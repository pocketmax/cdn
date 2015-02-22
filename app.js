var http = require('http'),
    fs = require('fs'),
    crypto = require('crypto'),
    path = require('path'),
    mime = require('mime'),
    request = require('request'),
    redis = require('redis'),
    client = redis.createClient(6379, 'localdocker');

client.on("error", function (err) {
	console.log("Error " + err);
});

// TODO: listen on 'evicted' event to pub/sub to the collection to listen for evicted keys... to delete there package file
// TODO: cleanup code a bit

var server = http.createServer(function (req, resp) {

	client.get(req.url, function(err, rec) {

		if(err) throw err;
		rec = JSON.parse(rec);

		//file already downloaded - stream local file
		if(rec) {
			console.log('file exists...');
			console.log(req.url);
			console.log(rec);

			var filePath = path.join(__dirname + '/files/' + rec.hash);
			var stat = fs.statSync(filePath);

			resp.writeHead(200, {
				'Content-Type': mime.lookup(filePath),
				'Content-Length': stat.size
			});

			var readStream = fs.createReadStream(filePath);
			readStream.pipe(resp);

		//file hasn't been downloaded yet - so return file to client and cache file locally
		} else {

			console.log('file is NEW...');
			console.log(req.url);

			request
			.get(req.url)
			.on('response', function(respData){
				var fileName = respData.headers['Content-Disposition'] || path.basename(req.url);
				//if we don't get a filename, then don't bother. It's probably not a package to download
				if(!fileName){
					console.log('had to exit due to no filename');
					return false;
				}
				this.pipe(resp);
				this.pipe(fs.createWriteStream('tmpfiles/' + fileName));
				this.on('end', function() {
					fs.readFile('tmpfiles/' + fileName, { encoding: 'utf8' }, function (err, data) {

						var hash = crypto.createHash('md5').update(data).digest('hex');
						var rec = {
							hash: hash,
							fileName: fileName
						};
						console.log('record to be saved...');
						console.log(rec);
						client.setex(req.url,100,JSON.stringify(rec));
						//move file from tmpfiles to files as hash
						fs.renameSync('tmpfiles/' + fileName, 'files/' + hash);
					});
				});
			});
		}

	});

});

server.listen(8005, function (req, res) {
    var port = server.address().port;
    console.log('HTTP(s) proxy server listening on port %d', port);
});

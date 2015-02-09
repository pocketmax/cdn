var http = require('http'),
    fs = require('fs'),
    crypto = require('crypto'),
    path = require('path'),
    mime = require('mime'),
    request = require('request'),
    stack = {};

var server = http.createServer(function (req, resp) {

    //file already downloaded - stream local file
    if(stack[req.url]) {
        console.log('file exists...' + req.url);
        var rec = stack[req.url];
        var fileRec = null;
        var fileHash = null;
        for(var i in rec.hashes){
            fileHash = i;
            fileRec = rec.hashes[i];
            break;
        }

        var filePath = path.join(__dirname + '/files/' + fileHash);
        var stat = fs.statSync(filePath);

        resp.writeHead(200, {
            'Content-Type': mime.lookup(filePath),
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(filePath);
        readStream.pipe(resp);

    //file hasn't been downloaded yet - so return file to client and cache file locally
    } else {
        console.log('file is NEW...' + req.url);


        request
            .get(req.url)
            .on('response', function(respData){
                var fileName = respData.headers['Content-Disposition'] || path.basename(req.url);
                //if we don't get a filename, then don't bother. It's probably not a package to download
                if(!fileName){
                    return false;
                }
                var tmpFileName = crypto.createHash('md5').update(new Date().toString()).digest('hex');
                this.pipe(resp);
                this.pipe(fs.createWriteStream('files/' + tmpFileName));
                this.on('end', function() {
                    fs.readFile('files/' + tmpFileName, { encoding: 'utf8' }, function (err, data) {

                        var hash = crypto.createHash('md5').update(data).digest('hex');
                        //support /current urls i.e. multiple checksums
                        var recId = req.url;
                        var rec = {
                            hashes: {}
                        };
                        rec['hashes'][hash] = {
                            type: 'md5',
                            fileName: fileName
                        };
                        stack[recId] = rec;
                        //rename file to hash
                        fs.renameSync('files/' + tmpFileName, 'files/' + hash);
                    });
                });
            });
    }
});

server.listen(8005, function (req, res) {
    var port = server.address().port;
    console.log('HTTP(s) proxy server listening on port %d', port);
});
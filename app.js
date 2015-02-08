var http = require('http'),
    setup = require('proxy'),
    fs = require('fs'),
    path = require('path'),
    mime = require('mime');

var server = setup(http.createServer(function(req, res){
    if(req.headers.host === 'www.google.com'){
        console.log('GOT GOOGLE!!!');
        var filePath = path.join(__dirname , 'bigfile.bz2');
        console.log(filePath);
        var stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': mime.lookup(filePath),
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(filePath);
        console.log('STREAMING FILE!!!!');
        readStream.pipe(res);
    }
}));

server.listen(8005, function (req, res) {
    var port = server.address().port;
    console.log('HTTP(s) proxy server listening on port %d', port);
});
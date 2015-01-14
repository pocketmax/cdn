var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var app = express();
var req = require('requirejs');
var mime = require('mime');

req.config({
    baseUrl: 'mods',
    nodeRequire: require
});


//returns finalized cdn data entry

var basePath = './files';
var fileList = fs.readdirSync(basePath);
var cdnList = req('cdnList');
var fetchConfig = req('fetchConfig');

//loop through regex configs
for(var i=0; i < cdnList.length; i++){
    console.log(cdnList[i]);

    //loop through archive files for each regex
    fileList.forEach(function(fileName){

        var data = fetchConfig(cdnList[i],fileName);
        if(data.vendor){
            var url = '/' + data.vendor + '/' + data.product + '/' + data.ver;
        } else {
            var url = '/' + data.product + '/' + data.ver;
        }
        app.get(url, function (req, res) {
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            var filestream = fs.createReadStream(basePath + '/' + fileName);
            filestream.pipe(res);
        });

    });

}

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});

/*
/sencha/touch/2.4.0/min
/sencha/touch/2.4.0/arch
/sencha/touch/2.4.0/
/jquery/min/latest
/jquery/2.3

*/
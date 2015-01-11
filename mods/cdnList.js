define(function(){

    return [{
        //sencha - touch
        regex: /^(sencha)-(touch)-((\.|\d)+)-commercial.zip/,
        cb: function(vend, prod, ver){
            return {
                vendor: vend,
                product: prod,
                ver: ver
            };
        }
    },{
        //sencha - touch
        regex: /^(touch)-((\.|\d)+)-commercial.zip/,
        vendor: 'sencha',
        cb: function(vend, ver){
            return {
                vendor: vend,
                ver: ver
            };
        }
    },{
        //angular
        regex: /^(angular)-((\.|\d)+).zip/,
        cb: function(vend, ver) {
            return {
                vendor: vend,
                ver: ver
            };
        }
    },{
        //jquery
        regex: /^(jquery)-((\.|\d)+).js/,
        cb: function(vend, ver) {
            return {
                vendor: vend,
                ver: ver
            };
        }
    },{
        //jquery min
        regex: /^(jquery)-((\.|\d)+).min.js/,
        cb: function(vend, ver) {
            return {
                vendor: vend,
                ver: ver,
                minified: true
            };
        }
    }];

});
define(function(){

    return [{
        //sencha
        regex: /-/,
        cb: function(bla, foo, bar){
            return {
                vendor: 'sencha',
                product: 'cmd',
                ver: '2.3'
            };
        }
    },{
        //angular
        regex: /-/,
        vendor: 0,
        product: 1,
        cb: function() {
            return {
                ver: '2.3'
            };
        }
    },{
        //jquery
        regex: /-/,
        cb: function() {

        }
    }];

});
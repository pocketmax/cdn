define(['lodash'], function(_){

    return function(archCfg, str){
        var matchList = archCfg.regex.exec(str) || [];
        matchList.shift(0);

        var data = _.clone(archCfg);
        delete data.cb;
        delete data.regex;

        //apply cb results if callbacks present
        if( _.isFunction( archCfg.cb ) ){
            data = _.merge(data, archCfg.cb.apply(archCfg, matchList));
        }
        return data;
    }

});
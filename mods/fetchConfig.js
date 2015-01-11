define(function(archCfg, str){

    var matchList = archCfg.regex.exec(str);
    var data = _.clone(archCfg);
    delete data.cb;
    delete data.regex;

    //apply regex match group results to data
    for(var i in data){
        data[i] = matchList[i];
    }

    //apply cb results if callbacks present
    if( _.isFunction( archCfg.cb ) ){
        data = _.merge(data, archCfg.cb.apply(archCfg, matchList));
    }

    return data;
});
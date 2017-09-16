//格式化json数据，仅限status
exports.FormatStatus = function(status,info){
    return{
        status:status,
        info:info
    };
};

exports.resjson = function(key,val,callback){

};

//格式化错误输出
exports.FormatLogErr = function(err){
    if(err){
        console.error(err);
        //throw err;
    }
    return false;
};

//格式化cookies
exports.FormatCookie = function(res,obj){
    for (var key in obj){
        res.cookie(key,obj[key],{signed:true,httpOnly:true});//,maxAge:1800000});
    }    
    return res;
};

//Format Sql_Result_afft
exports.FormatResultChange = function(result){
    return result.affectedRows;
};

//Format resjson
exports.resjson = function (res,result){
    var change = Format.FormatResultChange(result);
    var id = 'nukown';
    //console.log(change);
    if(result.insertId) id = result.insertId;
    if(change !== 0){
        res.json(Format.FormatStatus('1','change success,updateid:'+id+',change:'+change));
    }else{
        res.json(Format.FormatStatus('0','change error,updateid:'+id+',change:'+change));
    }
};
//仅支持sql2005版本以上
var ms = require('mssql');
var contstr = require('../passwd/mssql');

exports.setval = function(user,passwd,server,database){
    contstr.user = user;
    contstr.password = passwd;
    contstr.server = server;
    contstr.database = database;
};

exports.query = function(sql,callback){
    var pool = new ms.ConnectionPool(contstr,function(err){
        if(err) console.log(err);
        new ms.Request(pool).query(sql,function(err,result){
            pool.close();
            if(err){
                console.error(err.message);
                result = {status:'0',info:'sql excute error',affectedRows:0};
                callback(result);
              }else{
                callback(result);
              }
        });
    });
};

/*
var pool = new ms.ConnectionPool(contstr,function(err){
    if(err) console.log(err);

    new ms.Request(pool).query('select * from system_setup',function(err,result){
        console.dir(result);
    });
});
*/

var ms = require('mssql');
var contstr = require('../passwd/mssql');

exports.setval = function(user,passwd,server){
    contstr.user = user;
    contstr.password = passwd;
    contstr.server = server;
};
//封装连接执行函数
function connect(sql,callback){
    var pool = new ms.ConnectionPool(contstr,function(err){
        if(err){
            callback(Error_code(err));
            return false;
        }
        new ms.Request(pool).query(sql,function(err,result){
            pool.close();
            if(err){
                callback(Error_code(err));
                return false;
              }else{
                var str = sql.slice(0,6).toLocaleLowerCase();
                if(str == 'select'){
                    callback(result.recordset);
                }else{
                    callback(result.rowsAffected);
                }
                
              }
              return true;
        });
    });
}
//封装连接执行函数
function connectexecute(sql,contstr,callback){
    var pool = new ms.ConnectionPool(contstr,function(err){
        if(err){
            callback(Error_code(err));
            return false;
        }
        new ms.Request(pool).query(sql,function(err,result){
            pool.close();
            if(err){
                callback(Error_code(err));
                return false;
              }else{
                var str = sql.slice(0,6).toLocaleLowerCase();
                if(str == 'select'){
                    callback(result.recordset);
                }else{
                    console.dir(result);
                    callback({status:1,rows:result.rowsAffected,info:'modify success'});
                }
                
              }
              return true;
        });
    });
}

//query
exports.query = function(sql,callback){ 
   connect(sql,function(result){
    callback(result);
   }); 
};

//query exceute
exports.queryexecute = function(sql,contstr,callback){
    var obj = {
        user:contstr.sa_user,
        password:contstr.sa_pw,
        server:contstr.net_domain,
        database:'healmr',
        port:'1433',
        options:{
            tdsVersion:'7_1'
        }
    };
    connectexecute(sql,obj,function(result){ 
     callback(result);
    }); 
 };
 
//update
exports.update = function(obj,objcondition,table,callback){
    //console.log(contstr);
    var sql = '';
    for(var i in obj){
       for(var r in objcondition){
        sql = 'update '+table+" set "+i+" = '"+obj[i]+"' where "+r+" = '"+objcondition[r]+"'";
       }    
    }
   //console.log(sql);
   connect(sql,function(result){
       callback(result);
   });
       
};

//Error
function Error_code(err){
    var obj ={status:'0',info:err.code,affectedRows:0};
    if(err.code){
        switch(err.code){
            case 'ETIMEOUT':
                obj.info = 'Failed to connect to timeout';
            break;
            case 'ELOGIN':
                obj.info = 'user login error';
            break;
            default:
                obj.info = err.code;
            break;
        }
    }
    return obj;
}

/*
exports.query = function(sql,callback){
    var obj = new mso.Query(contstr);

    obj.query(sql,function(err,result){
        if(err){
            console.log(err);
        return false;
        }
        callback(result);
        console.log('22');
        return true;
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

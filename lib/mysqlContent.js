var my = require('mysql');
var Format = require('./Format');
var contStr = require('../passwd/mysql');
var pool = my.createPool(contStr);
 

//常规sql查询
exports.query = function(sql,callback){
  connet(sql,function(result){
    callback(result);
  });
};

//常用exec, 查询用户连接资料
exports.select_store_contstr = function(id,callback){
  if(!id){
    console.log('argment id err');
    return false;
  }
  var sql = "select id,sa_pw,sa_user,net,net_domain from client_data where id = "+id;
  connet(sql,function(result){
    callback(result[0]);
  });
};

//封装连接执行函数
function connet(sql,callback){
  pool.getConnection(function(err,con){
    if(Format.FormatLogErr(err)){
      return;
    }
    con.query(sql,function(err,result,fields){
      con.release();
        if(err){
          console.error(err.message);
          result = {status:'0',info:'sql excute error',affectedRows:0};
          callback(result);
        }else{
          callback(result);
        }               
    });
  });
}
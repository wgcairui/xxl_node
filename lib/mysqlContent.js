var my = require('mysql');
var contStr = require('../passwd/mysql');
var pool = my.createPool(contStr);
  
exports.query = function(sql,callback){
  pool.getConnection(function(err,con){
    if(err) throw err;
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
};

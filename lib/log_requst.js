var my = require('./mysqlContent');
exports.log_request = function(req,res,next){
    if(req.xhr){
        var method = req.method;
        var query;
        var log = 'login:'+req.ip.substring(7)+';method:'+method+',path:'+req.path+',url:'+req.url;
        console.log(log);
        if(method === 'POST'){
            console.log(req.body);
            query = req.body;
        }else if(method === 'GET'){
            //console.log(req.query);
            query = req.query;
        }
        var str = JSON.stringify(query);
        var sql = "INSERT INTO `log` (`incident`, `operate`, `tims`) VALUES ('request','"+log+str+"', now())";
        my.query(sql,function(result){
            return false;
        });

    }    
    next();
};
var my = require('./mysqlContent');

module.exports = function(req,res,next){
    if(!req.xhr) return next();

    var method = req.method;
    var query;
    if(method === 'GET'){
        query = req.query;
        
    }else{
        query = req.body;
    }

    var exemption = ['xxl-down','get-down-files','get-client-name','ch_login','logins'];
    if(exemption.indexOf(query.sid) !== -1) return next();

    c(req,res,next);
}

function c(req,res,next){
    if('uid' in req.signedCookies){
        var uid = req.signedCookies.uid,
            pid = req.signedCookies.pid;            
        my.query('select rand from admin where usercode = '+uid,function(result){
            console.log(uid);            
            if(result[0].rand === pid) return next();
                       
        });
      }else{
        console.log({'status':0,info:'you session is err'});
        res.json({'status':0,info:'you session is err'}).end();
        next(err);
      }
}
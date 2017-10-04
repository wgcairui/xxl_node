
var request = require('request');
var jar = request.jar();
var uid = {
    key:'__guid',
    val:'74214929.1381056897425801200.1506240947080.034'
};

module.exports = function(key,RegDate,callback){
    //'0080-8071-1163-6198-3004-1214'
    var key = key;
    var regdate = RegDate;
    //user info
    var user = {
        user:'35630',
        passwd:'55a848421878572ce011ff9c470c2f012860001f' //sha1
    };
    //url
    var loginurl = 'http://regxxl.microcloud.asia/Do/Login.ashx';
    var getlockerurl = 'http://regxxl.microcloud.asia/Do/GetLocker.ashx';
    var regurl = 'http://regxxl.microcloud.asia/Do/Register.ashx';


    request.post({url:loginurl,form:{UserCode:user.user,Password:user.passwd}},function(err,res,body){
        body = JSON.parse(body);
        if(err) return(console.log(err));
        var aspcookie = (res.headers['set-cookie'][0].split(';'))[0];
        var cookie = request.cookie(aspcookie);
        jar.setCookie(cookie,getlockerurl);
        request.post({url:getlockerurl,jar:jar,form:{RegKey:key}},function(err,res,body){ 
            if(err) return console.error({locker:err});  
            //console.log('locker');     
            //if(!body.IsSuccess) return callback(body);
            request.post({url:regurl,jar:jar,form:{Key:key,RegToDate:regdate,Province:'',City:'',County:''}},function(err,res,body){
                if(err) return console.error({register:err});
                //console.log({type:typeof(body),body:body});
                callback(JSON.parse(body));
                return;              
            });
        });        
    })
}
var express = require('express');
var app = express();
var route = express.Router();
var Format = require('../lib/Format');
var my = require('../lib/mysqlContent');

//POST 检测login登陆
route.post('/',function(req,res){
    var sid = req.body.sid;
    switch(sid){
  
      //登陆检测
      case 'logins':
        var user = req.body.user,
            passwd = req.body.passwd;
        my.query('select userpasswd from admin where usercode = '+user,function(result){
          if(passwd === result[0].userpasswd || passwd !== ''){
            var rand = Math.random()*260338638;
            my.query('update admin set rand = '+rand+',modifydate = now() where usercode = '+user,function(result){
              return true;
            });
            var $cookies = {
                'pid':rand,
                'uid':user
            };

            Format.FormatCookie(res,$cookies).json(Format.FormatStatus('1','manage.html')).end();

          }else{
            res.json(Format.FormatStatus('0','password error'));
          }
        });
      break;
      //登陆状态检测
      case 'ch_login':
        if('uid' in req.signedCookies){
          var uid = req.signedCookies.uid,
              pid = req.signedCookies.pid;            
          my.query('select rand from admin where usercode = '+uid,function(result){
              if(result[0].rand === pid){
                res.json(Format.FormatStatus('1','manage.html'));
              }else{
                res.json(Format.FormatStatus('0','pid is timeout'));
              }
          });
        }else{
          res.json(Format.FormatStatus('0','pid is timeout')).end();
        }
        
      break;
  
      
  
      default:
        console.log('unknow requst');
        res.send('requst error');
      break;
    }
  });

module.exports = route;
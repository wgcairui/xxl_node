var express = require('express');
var app = express();
var route = express.Router();
var Format = require('../lib/Format');
var my = require('../lib/mysqlContent');
var xxlregister = require('../lib/XXL_Register');
var os = require('os');
var fs = require('fs');

route.post('/',function(req,res){
    var body = req.body;
    var sid = body.sid;
    console.log(sid);
    switch(sid){
        //修改客户门店详细参数值
        case 'modifyval':
        var sql = "UPDATE client_data SET "+body.valname+" = '"+body.val+"' WHERE id = "+body.store;
        my.query(sql,function(result){                
            resjson(res,result);
        });
        break;

        //添加网络下载链接地址
        case 'update-link-adress':
            var update_link =function(){
                var sql = "INSERT INTO down (`name`, `adress`, `update_time`) VALUES ('"+body.name+"', '"+body.adress+"', now())";
                my.query(sql,function(result){
                    resjson(res,result);
                });
            }();
        break;

        //add新客户门店信息
        case 'update-store-info':            
            var update_store = function(){
                var key = '',
                    val = '';
                
                for(var i in body){
                    if(i !== 'sid'){
                        key += "`"+i+"`,";
                        val += "'"+body[i]+"',";
                    }                        
                }
                var sql = "INSERT INTO client_data ("+key+"`sing_date`) VALUES ("+val+" now())";
                //console.log(sql);
                my.query(sql,function(result){
                    resjson(res,result);                    
                });
                              
            }();
        break; 
        
        //注册休闲乐
            case 'xxl_register':
                if('key' in body && 'regdate' in body){
                    var key = body.key,
                        regdate = body.regdate;
                       
                    xxlregister(key,regdate,function(result){
                        console.log(result);
                        res.json(result);
                    });
                } 
                
            break;
    }

});

//Format resjson
function resjson(res,result){
    var change = Format.FormatResultChange(result);
    var id = 'nukown';
    //console.log(change);
    if(result.insertId) id = result.insertId;
    if(change !== 0){
        res.json(Format.FormatStatus('1','change success,updateid:'+id+',change:'+change));
    }else{
        res.json(Format.FormatStatus('0','change error,updateid:'+id+',change:'+change));
    }
}

module.exports = route;


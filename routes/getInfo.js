var express = require('express');
var app = express();
var route = express.Router()
var Format = require('../lib/Format');
var my = require('../lib/mysqlContent');
var os = require('os');
var fs = require('fs');

route.get('/',function(req,res){
    var query = req.query;
    var sid = query.sid;    
    switch(sid){
        //index.html file download
        case 'xxl-down':
            fs.readdir('./public/file/',function(err,files){
                Format.FormatLogErr(err);
                res.send(files);
            });

        break;
        
        //index.html file link
        case 'get-down-files':
            my.query('SELECT name,adress,title FROM down',function(result){
                res.json(result);
            });
        break;

        //manage.html get store list =================================
        case 'get-store-list':
            my.query("SELECT id,client_name FROM `client_data`",function(result){
                res.json(result).end();
            });
        break;

        case 'get-territory-info':
            my.query("SELECT id,territory FROM `territory`",function(result){
                res.json(result).end();
            });
        break;

        case 'get-store-info':
            my.query("SELECT * FROM `client_data` WHERE id = "+query.select,function(result){
                res.json(result[0]).end();
            });
        break;

        case 'delete-store':
            var select = query.select;
            my.query("delete FROM `client_data` where id ="+select,function(result){
                console.log(result);
                Format.FormatStatus('1','删除功能暂时不可用！！');
            });
        break;

        case 'get-log':
            console.log('get-log');
            var $sql = "SELECT * FROM `log`  WHERE incident <> 'array' and incident <> 'num' and incident <> 'val' and incident <> 'one' ORDER BY id DESC LIMIT 0,"+query.limit;

            my.query($sql,function(result){
                res.json(result);
            });
        break;

        case 'exit_login':
            res.clearCookie('pid');
            res.json(Format.FormatStatus('1','clearCookie'));
        break;
        
        //argument ======================================
        case 'get-reference-argument':
            var getreferenceargument = function(){
                var $sql = "select id,main_item,sub_item,item_value from system_setup where main_item <> '技师钟数统计模板'";
                
            }();
            
        break;

        case 'get-store-list-domain':
            var getstorelistdomain = function(){
                var $sql = "SELECT id,client_name FROM `client_data` WHERE (sa_pw <> '' OR sa_pw <> null) AND (net_domain <> '' OR net_domain <> null OR net <> '' OR net <> null)";

                my.query($sql,function(result){
                    res.json(result);
                });
            }();
            
        break;

        //sms =================================

        case 'get-territory':
            var getterritory = function(){
                my.query("SELECT id,territory FROM `territory`",function(result){
                    res.json(result);
                });
            }();
        break;

        case 'select-store':
            var getselectstore = function(){
                my.query("SELECT id,client_name,territory FROM `client_data`",function(result){
                    res.json(result);
                });
            }();
        break;

        case 'money':
            var money = function(){
                my.query("SELECT template,money FROM `rechargetemplate`",function(result){
                    res.json(result);
                });
            }();
        break;

        case 'pay-success':
            var paySuccess = function(){
                var $pay = '';
                var payment = query.payment;
                switch(payment){
                    case "alipay":
					    $pay = "支付宝支付";
					    break;
				    case "wxpay":
					    $pay = "微信支付";
					    break;
				    default:
					    $pay = "undefault";
					    break;
                }
            }();
        break;

        case 'get_sms_list':
            var getSmsList = function(){
                var sql = "SELECT * FROM `sms_pay`";
                my.query(sql,function(result){
                    res.json(result);
                });
            }();
        break;

        case 'set-sms-status':
            var setSmsStat = function(){
                my.query("UPDATE `sms_pay` SET `stat`=1,`modifydate`=now() WHERE id='"+query.id+"'",function(result){
                    resjson(res,result);
                });
            }();
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
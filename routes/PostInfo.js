var express = require('express');
var app = express();
var route = express.Router();
var Format = require('../lib/Format');
var my = require('../lib/mysqlContent');
var os = require('os');
var fs = require('fs');

route.post('/',function(req,res){
    var body = req.body;
    var sid = body.sid;
    console.log(sid);
    switch(sid){
        case 'modifyval':
        var sql = "UPDATE client_data SET "+body.valname+" = "+body.val+" WHERE id = "+body.store;
        //console.time('s');
            my.query(sql,function(result){                
                resjson(res,result);
            });
        break;

        case 'update-link-adress':
            var update_link =function(){
                var sql = "INSERT INTO down (`name`, `adress`, `update_time`) VALUES ('"+body.name+"', '"+body.adress+"', now())";
                my.query(sql,function(result){
                    resjson(res,result);
                });
            }();
        break;

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


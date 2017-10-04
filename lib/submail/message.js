var request = require('request');
var crypto = require('crypto');
var config = require('./config.js'); 
var my = require('../mysqlContent');

function Message() {
    this.appid = config.messageConfig.appid;
    this.signtype = config.messageConfig.signtype;
    this.appkey = config.messageConfig.appkey;
    this.send = function(params) {
        var api = 'https://api.submail.cn/message/send.json';
        var requestParams = params;
        requestParams['appid'] = this.appid;
        var self = this;
        request({
            uri: 'https://api.submail.cn/service/timestamp.json',
            method: 'GET'
        }, function(error, response, body) {
            var result = JSON.parse(body);
            requestParams['timestamp'] = result["timestamp"];
            requestParams['sign_type'] = self.signtype;
            requestParams['signature'] = self.createSignature(requestParams);
            request.post({url: api, formData: requestParams}, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return console.error('upload failed:', err);
                }
                console.log('Upload successful!  Server responded with:', body);
            });
        });
    };
    this.xsend = function(params,arg,project,res) {
        var api = 'https://api.submail.cn/message/xsend.json';
        var requestParams = params;
        requestParams['appid'] = this.appid;
        var self = this;
        request({
            uri: 'https://api.submail.cn/service/timestamp.json',
            method: 'GET'
        }, function(error, response, body) {
            var result = JSON.parse(body);
            requestParams['timestamp'] = result["timestamp"];
            requestParams['sign_type'] = self.signtype;
            requestParams['signature'] = self.createSignature(requestParams);
            request.post({url: api, formData: requestParams}, function optionalCallback(err, httpResponse, body) {
                body = JSON.parse(body);
                //console.log({type:typeof(body),body:body,str:body.toString});
                //add new code
                if(err){
                    res.json(err);
                    console.error('upload failed:', err);
                    my.query("INSERT INTO `client`.`sms_send_receipt` (`status`, `send_id`, `fee`, `sms_credits`, `modifydate`) VALUES ( '0', '$send_id', '$fee', '$sms_credits', now())",function(result){
                        return false;
                    });
                }
                
                if(project === 'ALEJG3'){
                    my.query("INSERT INTO `client`.`sms_pay` (`store`,`tel`,`payment`,`send_id`,`modifydate`) VALUES ('"+arg.store+"','"+arg.tel+"','"+arg.payment+"','"+body.send_id+"',now());",function(result){
                        res.json(body);
                        return true;
                    });
                }else if(project === 'xS5hJ4'){
                    my.query("INSERT INTO `client`.`sms_send_receipt` (`status`, `send_id`, `fee`, `sms_credits`, `modifydate`) VALUES ( '"+body.status+"', '"+body.send_id+"', '"+body.fee+"', '"+body.sms_credits+"', now());",function(result){
                        return true;
                    });
                }


                //end
                /*if (err) {
                    return console.error('upload failed:', err);
                }
                console.log('Upload successful!  Server responded with:', body);
                */
            });
        });
    };
    this.subscribe = function(params) {
        var api = 'https://api.submail.cn/addressbook/message/subscribe.json';
        var requestParams = params;
        requestParams['appid'] = this.appid;
        var self = this;
        request({
            uri: 'https://api.submail.cn/service/timestamp.json',
            method: 'GET'
        }, function(error, response, body) {
            var result = JSON.parse(body);
            requestParams['timestamp'] = result["timestamp"];
            requestParams['sign_type'] = self.signtype;
            requestParams['signature'] = self.createSignature(requestParams);
            request.post({url: api, formData: requestParams}, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return console.error('upload failed:', err);
                }
                console.log('Upload successful!  Server responded with:', body);
            });
        });
    };
    this.unsubscribe = function(params) {
        var api = 'https://api.submail.cn/addressbook/message/unsubscribe.json';
        var requestParams = params;
        requestParams['appid'] = this.appid;
        var self = this;
        request({
            uri: 'https://api.submail.cn/service/timestamp.json',
            method: 'GET'
        }, function(error, response, body) {
            var result = JSON.parse(body);
            requestParams['timestamp'] = result["timestamp"];
            requestParams['sign_type'] = self.signtype;
            requestParams['signature'] = self.createSignature(requestParams);
            request.post({url: api, formData: requestParams}, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return console.error('upload failed:', err);
                }
                console.log('Upload successful!  Server responded with:', body);
            });
        });
    };
    this.createSignature = function(params) {
        if (this.signtype == 'normal') {
            return this.appkey;
        } else {
            return this.buildSignature(params);
        }
    };

    this.buildSignature = function(params) {
        var sortedParams = this.sortOnKeys(params);
        var signStr = "";
        for(var key in sortedParams) {
            signStr += key + '=' + sortedParams[key] + '&';
        }
        signStr = signStr.substring(0, signStr.length-1);
        signStr = this.appid + this.appkey + signStr + this.appid + this.appkey;
        if (this.signtype == 'md5') {
            var md5sum = crypto.createHash('md5');
            md5sum.update(signStr);
            return md5sum.digest('hex');
        }
        if (this.signtype == 'sha1') {
            var sha1sum = crypto.createHash('sha1');
            sha1sum.update(signStr);
            return sha1sum.digest('hex');
        }
        return '';
    };

    this.sortOnKeys = function(dict) {
        var sorted = [];
        for(var key in dict) {
            if (key == 'attachments') {
                continue;
            }
            sorted[sorted.length] = key;
        }
        sorted.sort();

        var tempDict = {};
        for(var i = 0; i < sorted.length; i++) {
            tempDict[sorted[i]] = dict[sorted[i]];
        }

        return tempDict;
    };
};

module.exports = Message;

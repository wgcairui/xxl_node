var express = require('express');
var app = express();
var route = express.Router();
var fs = require('fs');
var my = require('../lib/mysqlContent');

route.post('/',function(req,res){
    if(req.files.length === 0) return res.json({status:0,info:'upload error,no file object'});
    if(req.files[0].size > 50331648) return res.json({status:0,info:'upload error,file size maxsize out'});
    var fileobj =  req.files[0],
        filename = fileobj.originalname,
        filenametemp = fileobj.filename,
        filepathtemp = fileobj.path,
        filepath = 'public/file/'+filename;
    //console.log(__dirname+filepath+filepathtemp);
    fs.rename(filepathtemp,filepath,function(err){
        if(err) return console.log(err);
        res.json({status:1,info:filename+'上传已完成'});
    })
    
    
});


module.exports = route;

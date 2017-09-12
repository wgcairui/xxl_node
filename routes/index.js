var express = require('express');
var app = express();
var router = express.Router();
var Format = require('../lib/Format');

var get = require('./getInfo');
var post = require('./PostInfo');
var login = require('./login');

// GET home page. 
router.get('/', function(req, res) {
  console.log('link in '+req.ip+',date:'+new Date());
});

//router分发;
//分发GET请求
router.use('/get',get);

//分发POST请求
router.use('/post',post);

//分发LoginPost请求
router.use('/login',login);



module.exports = router;

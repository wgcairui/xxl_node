var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var index = require('./routes/index');
var log = require('./lib/log_requst');
var checkStatus = require('./lib/Check_status');
var credentials = require('./lib/signed');

var app = express();

//multer 处理upload上传事件
var multer = require('multer');
var upload = multer({dest:'uploads/'});

// view engine setup
app.engine('html',ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(credentials.cookieSecret));

app.use(express.static(path.join(__dirname, 'public')));//静态资源配置，静态资源不会传递到后面

//add log请求的地址，ajax，url
app.use(log.log_request);
app.use('/',checkStatus);
app.post('/upload',upload.any(), function(req,res,next){
  next();
});

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

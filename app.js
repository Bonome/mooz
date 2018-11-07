"use strict";

var express = require('express');
var path = require('path'); 
var favicon = require('serve-favicon');
var fs = require('fs');
var dblite = require('dblite');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var basicAuth = require('express-basic-auth')

var config = require(__dirname + '/config/config.json');

var routes = require('./routes');
var destination = require('./routes/destination');
var move = require('./routes/move');
var remove = require('./routes/remove');
var refresh = require('./routes/refresh');
var scan = require('./routes/scan');
var downpath = require('./routes/downpath.js');
var list = require('./routes/list.js');


var app = express();

app.use(basicAuth({
    users: config.auth.users,
    challenge: true,
    realm: config.auth.realm
}));

if (!fs.existsSync('./downloads.db')) {
    let db = dblite('./downloads.db');
    db.query('CREATE TABLE IF NOT EXISTS directories (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT)');
    db.close();
}


// view engine setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('connect-multiparty')());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(session({
  secret: config.app.key,
  resave: true,
  saveUninitialized: true
}));

app.use('/', routes);
app.use('/destination', destination);
app.use('/move', move);
app.use('/remove', remove);
app.use('/refresh', refresh);
app.use('/scan', scan);
app.use('/down', downpath);
app.use('/dirs', list);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');



  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status('500').json({
    message: err.message,
    error: JSON.stringify(err)
  });
});


module.exports = app;

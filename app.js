'use strict';

let fs = require('fs');
let path = require('path');
let express = require('express');
let pug = require('pug');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let mongoose = require('./libs/mongoose.js');
let bodyParser = require('body-parser');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let log = require('./libs/log')(module);
let app = express();

// Create session
app.use(session({
  secret: 'photo',
  saveUnitialized: false,
  resave: false,
  store : new MongoStore({mongooseConnection: mongoose.connection})
}));



// view engine setup
app.set('views', path.join(__dirname, 'templates/pages/'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/img/', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//===маршруты===
app.use('/user', require('./routes/user.js'));
app.use('/', require('./routes/login.js'));
//=============

// catch 404 and forward to error handler
app.use((req, res, next)  => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


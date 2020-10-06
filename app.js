var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('client-sessions');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var backend = require('./public/javascripts/backend')

var app = express();
app.use(session({
	  cookieName: 'session',
	  secret: 'olivia@123',
	  duration: 60 * 60 * 1000, //1 hour
	  activeDuration: 20 * 60 * 1000, //20mins
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

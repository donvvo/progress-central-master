var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'),
  expressValidator = require('express-validator'),
  session = require('express-session'),
  errorHandler = require('errorhandler')

var credentials = require('./credentials.js')

var app = express();

// MongoDB connection using Mongoose
var mongoose = require('mongoose')
var opts = {
  server: {
    socketOptions: {keepAlive: 1}
  }
}
switch(app.get('env')) {
  case 'development':
    mongoose.connect(credentials.mongo.development.connectionString, opts);
    break;
  case 'production':
    mongoose.connect(credentials.mongo.production.connectionString, opts);
    break;
  default:
    throw new Error('Unknown execution environment: ' + app.get('env'));
}
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Setup Mongoose session
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({ mongooseConnection: db });

var routes = require('./routes/index');
var users = require('./routes/users');

var router = require('./routes/routes.js')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// set up handlebars view engine
var handlebars = require('express-handlebars').create({ 
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator())
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
  store: sessionStore
}));
var auth = require('./lib/auth.js')(app, {
  successRedirect: '/',
  failureRedirect: '/unauthorized'
})
auth.init();
app.use(express.static(path.join(__dirname, 'public')));

auth.registerRoutes()
// Only allow authenticated users
app.use(function(req,res,next) {
  res.locals.authenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.initialUserData = JSON.stringify(req.user)
  if (res.locals.authenticated) return next()
  res.redirect('/login')
})

app.use('/', routes);
app.use('/api/user', router.userRouter);
app.use('/api/course', router.courseRouter)

/* Cron job */
var cronJob = require('./lib/cronJob')
cronJob.init()

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
    console.log(err)
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      status: err.status,
      not_found: err.status === 404,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err)
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    status: err.status,
    not_found: err.status === 404,
    error: {}
  });
});

app.set('port', process.env.PORT || 9000)
app.set('trust proxy', true)
app.listen(app.get('port'), function() {
  console.log('Express started in ' + app.get('env') + 'mode on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

module.exports = app;

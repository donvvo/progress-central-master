// Only use local authentication strategy for this app

var User = require('../models/user.js'),
  userHandler = require('../routes/handlers/user.js'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err || !user) return done(err, null);

    done(null, user);
  });
});

module.exports = function(app, options) {
  if (!options.successRedirect) {
    options.successRedirect = '/account';
  }
  if (!options.failureRedirect) {
    options.failureRedirect = '/login';
  }

  return {
    init: function() {
      passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {
        User.findOne({ email: email }, function(err, user) {
          if (err) { return done(err); }

          if (!user) {
            return done(null, false, { message: 'Incorrect email. Please try again' });
          }

          user.validPassword(password, function(err, res) {
            if (err) { return done(err); }
            if (res) {
              if (user.status !== 'ACTIVE') {
                return done(null, false, { message: 'This user is not activated yet. Please activate the account.'}) 
              }
              return done(null, user);
            }
            else {
              return done(null, false, { message: 'Incorrect password. Please try again.' });
            }
          });
        });
      }));
      app.use(passport.initialize());
      app.use(passport.session());
    },
    registerRoutes: function() {
      app.get('/signup/:invite_key', function(req, res, next) {
        User.findOne({invite_key: req.params.invite_key, status: 'INACTIVE'}, function(err, user) {
          if (err) return next(err)
          if (!user) return next()

          res.render('user/signup', { layout: 'front', email: user.email, invite_key: req.params.invite_key })
        })
      }).post('/signup/:invite_key', userHandler.signUp)
      
      app.get('/reset-password', function(req, res, next) {
        res.render('user/reset_password', { layout: 'front' })
      }).post('/reset-password', userHandler.resetPassword)

      app.get('/login', function(req, res, next) {
        res.render('user/login', { layout: 'front' });
      }).post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          if (err) return next(err)
          if (!user) {
            return res.render('user/login', { layout: 'front', error: info.message})
          }

          req.logIn(user, function(err) {
            if (err) return next(err)
            return res.redirect('/')
          })
        })(req, res, next)
      });

      app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
      });
    },
  };
};

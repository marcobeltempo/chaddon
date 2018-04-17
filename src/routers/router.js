const debugRouter = require('debug')('chaddon:router');
var fs = require("fs");
module.exports = function (app, passport) {
  // GET
  // Select authentication/ registration screen
  app.get('/', function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/profile');
    } else {
      res.render('pages/login-index', {
        title: "Chaddon"
      });
    }
  });

  // GET
  // Display the users profile
  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('pages/profile', {
      user: req.user
    });
  });

  // GET
  // Logout a registered user
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // GET
  // Display the login form
  app.get('/login', function (req, res) {
    res.render('pages/login', {
      message: req.flash("loginMessage"),
      title: "Login"
    });
  });

  // POST
  // Process the login form
  app.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true // allow flash messages
    })
  );

  // GET
  // display the registration form
  app.get('/signup', function (req, res) {
    res.render('pages/signup', {
      message: req.flash("signupMessage"),
      title: "Sign Up"
    });
  });

  // POST
  // Process the registration form
  app.post(
    '/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/',
      failureFlash: true // allow flash messages
    })
  );

  // GET
  // display the Google registration form
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  // GET
  // Callback after Google form submission
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  );

  // GET
  // Authorize users if they're already logged in
  // or linking another social account
  app.get('/connect/local', function (req, res) {
    res.render('pages/connect-local', {
      message: req.flash("loginMessage")
    });
  });

  app.post(
    '/connect/local',
    passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: "/connect/local",
      failureFlash: true // allow flash messages
    })
  );

  // GET
  // Send to Google for authroization
  app.get(
    '/connect/google',
    passport.authorize('google', {
      scope: ['profile', 'email']
    })
  );

  // GET
  // Callback after google has authorized the user
  app.get(
    '/connect/google/callback',
    passport.authorize('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  );

  // GET
  // Used to unlink accounts
  // Social accounts: remove the token
  // Local account:   remove email and password
  // User account: stays active in case they want to reconnect in the future
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      if (err) {
        debugRouter('router:error: /unlink/local ', err);
      }
      res.redirect('/profile');
    });
  });

  // GET
  // Unlink Google account
  // Google account: remove the token
  app.get('/unlink/google', isLoggedIn, function (req, res) {
    var user = req.user;
    user.google.token = undefined;
    user.save(function (err) {
      if (err) {
        debugRouter('router:error: /unlink/google ', err);
      }
      res.redirect('/profile');
    });
  });

  // GET
  // Displays the server status
  app.get('/status', (req, res) => {
    res.render('pages/server', {});
  });

  // GET
  // Displays privacy policy
  app.get('/privacy', (req, res) => {
    res.render('pages/privacy', {
      title: 'Privacy Policy'
    });
  });

  // 404 Error
  // Redirect to 404 error page
  app.use(function (req, res) {
    res.status(404).render('pages/404', {});
  });
};

// Route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

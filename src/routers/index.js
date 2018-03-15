var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var bodyParser = require("body-parser");






module.exports = function(app) {
  app.use(require('body-parser').urlencoded({ extended: true }));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());


  app.get("/", (req, res) => {
    params = req.params.id;
    res.render("pages/index", {user: req.user});
  });

  app.post('/', 
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

  app.get('/chat',
  //require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('pages/chat', { user: req.user });
  });

  app.get("/login", (req, res) => {
    params = req.params.id;
    res.render("./src/views/login.html");
  });

 // app.get("/privacy", (req, res) => {
   // params = req.params.id;
    //res.render("./src/views/privacy_policy.html");
 // });

//  app.get("/:id", (req, res) => {
  //  params = req.params.id;
  //  res.render("./src/views/chatroom.html");
  //});
};


function generateUnid(a) {
  return a // if the placeholder was passed, return
    ? // a random number from 0 to 15
    (
      a ^ // unless b is 8,
      ((Math.random() * // in which case
        16) >> // a random number from
        (a / 4))
    ) // 8 to 11
      .toString(16) // in hexadecimal
    : // or otherwise a concatenated string:
    ([1e10] + 1e10 + 1e9)
      .replace(
        // replacing
        /[01]/g, // zeroes and ones with
        generateUnid // random hex digits
      )
      .toUpperCase();
}
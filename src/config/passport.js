require('dotenv').config();
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../models/user.js');

// load the auth variables
module.exports = function (passport) {
  // Passport Setup
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // Local login
  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },

      function (req, email, password, done) {
        if (email) {
          email = email.toLowerCase();
        }

        // asynchronous
        process.nextTick(function () {
          User.findOne(
            {
              'local.email': email
            },
            function (err, user) {
              if (err) {
                return done(err);
              }

              // if no user is found, return the message
              if (!user) {
                return done(
                  null,
                  false,
                  req.flash('loginMessage', 'No user found.')
                );
              }

              if (!user.validPassword(password)) {
                return done(
                  null,
                  false,
                  req.flash('loginMessage', 'Oops! Wrong password.')
                );
              }

              // user was found
              return done(null, user);
            }
          );
        });
      }
    )
  );

  // Local user registration
  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      function (req, email, password, done) {
        if (email) {
          email = email.toLowerCase();
        }

        // asynchronous
        process.nextTick(function () {
          // if the user is not already logged in:
          if (!req.user) {
            User.findOne(
              {
                'local.email': email
              },
              function (err, user) {
                if (err) {
                  return done(err);
                }

                if (user) {
                  return done(
                    null,
                    false,
                    req.flash('signupMessage', 'That email is already taken.')
                  );
                }

                // create the user
                var newUser = new User();

                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);

                newUser.save(function (err) {
                  if (err) {
                    return done(err);
                  }

                  return done(null, newUser);
                });
              }
            );
            // if the user is logged in but has no local account
          } else if (!req.user.local.email) {
            // Presumably they're trying to connect a local account
            // BUT let's check if the email used to connect a local account is being used by another user
            User.findOne(
              {
                'local.email': email
              },
              function (err, user) {
                if (err) {
                  return done(err);
                }

                if (user) {
                  return done(
                    null,
                    false,
                    req.flash('loginMessage', 'That email is already taken.')
                  );
                  // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                }
                var user = req.user;
                user.local.email = email;
                user.local.password = user.generateHash(password);
                user.save(function (err) {
                  if (err) {
                    return done(err);
                  }

                  return done(null, user);
                });
              }
            );
          } else {
            // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
            return done(null, req.user);
          }
        });
      }
    )
  );

  // Google Authentication
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
      },

      function (req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function () {
          // check if the user is already logged in
          if (!req.user) {
            User.findOne(
              {
                'google.id': profile.id
              },
              function (err, user) {
                if (err) {
                  return done(err);
                }

                if (user) {
                  // if there is a user id already but no token (user was linked at one point and then removed)
                  if (!user.google.token) {
                    user.google.token = token;
                    user.google.name = profile.displayName;
                    user.google.email = (
                      profile.emails[0].value || ''
                    ).toLowerCase(); // pull the first email

                    user.save(function (err) {
                      if (err) {
                        return done(err);
                      }

                      return done(null, user);
                    });
                  }

                  return done(null, user);
                }
                var newUser = new User();

                newUser.google.id = profile.id;
                newUser.google.token = token;
                newUser.google.name = profile.displayName;
                newUser.google.email = (
                  profile.emails[0].value || ''
                ).toLowerCase(); // pull the first email

                newUser.save(function (err) {
                  if (err) {
                    return done(err);
                  }

                  return done(null, newUser);
                });
              }
            );
          } else {
            // user already exists and is logged in, we have to link accounts
            var user = req.user; // pull the user out of the session

            user.google.id = profile.id;
            user.google.token = token;
            user.google.name = profile.displayName;
            user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

            user.save(function (err) {
              if (err) {
                return done(err);
              }

              return done(null, user);
            });
          }
        });
      }
    )
  );
};

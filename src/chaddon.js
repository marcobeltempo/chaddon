var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs");
var path = require('path');

require("dotenv").load(); // loadd .env file variables
require('./config/passport.js')(passport); // pass passport for configuration

app.use(express.static(path.join(__dirname, '/public')));

// Read in our SSL test certs
const httpsOptions = {
  key: fs.readFileSync("./src/config/server.key"),
  cert: fs.readFileSync("./src/config/server.csr")
};

//var http = require('http').createServer(app);
var http = require('https').createServer(httpsOptions, app);
var io = require('socket.io')(http);

// Modules
const envConfig = require(path.join(__dirname, "./config/envConfig.js"))(http);
const dbClient = require(path.join(__dirname, "./db/dbConfig.js"));

// Express setup
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
  extended: true
}));

// view engine + templating setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

// DB connection
mongoose.connect(process.env.MONGOOSE_URL, {
  useMongoClient: true
});

// Passport setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Routing
require('./routers/router.js')(app, passport); // load our routes and pass in our app with passport

envConfig.startServer(http);

var numUsers = 0;

//usernames in room
var localUser = {};

//storing room specific history
var history = {};

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'add user', this listens and executes
  socket.on("add user", function (payload) {
    if (addedUser) {
      return;
    };

    console.log("Adding: ", payload.username);
    console.log("Domain: ", payload.domain);
    // we store the username in the socket session for this client
    socket.username = payload.username;
    socket.channel = payload.domain;
    console.log("socket.channel : ", socket.channel);

    //add user to channel
    socket.join(socket.channel);

    if (localUser["" + socket.channel] === undefined) {
      localUser["" + socket.channel] = {};
    }
    //if user isn't already in this chat somewhere else
    if (localUser["" + socket.channel][socket.username] === undefined) {
      localUser["" + socket.channel][socket.username] = 1;
      //add channel to user's other tabs
      io.in(socket.username).emit("updateRooms", {
        room: socket.channel
      });

      socket.broadcast.to(socket.channel).emit('user joined', {
        username: socket.username,
        numUsers: numUsers
      });
    } else { //user is already in this chat
      localUser["" + socket.channel][socket.username] = localUser["" + socket.channel][socket.username] + 1;
    }

    numUsers += 1;
    addedUser = true;
    io.to(socket.channel).emit('login', {
      numUsers: numUsers
    });

    //add user to list of users on the channel
    io.in(socket.channel).emit("updateUsers", {
      usernames: localUser[socket.channel],
      room: socket.channel
    });

    socket.join(socket.username);
    //add user's current channels
    for (var i in localUser) {
      if (localUser[i][socket.username] != undefined) {
        socket.emit("updateRooms", {
          room: i
        });
      }
    }

    if (history[socket.channel] !== undefined) {
      socket.emit("loadHistory", history[socket.channel]);
    } else {
      history[socket.channel] = [];
    }
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    var message = {
      username: socket.username,
      message: data.message,
      room: data.room
    };

    if (history[data.room] === undefined) {
      history[data.room] = [];
    }
    history[data.room].push(message);

    socket.to(data.room).emit('new message', message);
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.to(socket.channel).emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.to(socket.channel).emit('stop typing', {
      username: socket.username
    });
  });

  socket.on("viewChannel", function (data) {
    if (data.oldChannel != undefined) {
      socket.leave(data.oldChannel);
    }
    socket.join(data.room);
    socket.emit("updateUsers", {
      usernames: localUser[data.room],
      room: data.room
    });
    if (history[data.room] !== undefined) {
      socket.emit("loadHistory", history[data.room]);
    }
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      numUsers -= 1;
      if (localUser[socket.channel] != undefined) {
        //user is in this chat in multiple instances
        if (localUser[socket.channel][socket.username] > 1) {
          localUser[socket.channel][socket.username] -= 1;
        } else if (delete localUser[socket.channel][socket.username]) {
          if (!Object.keys(localUser[socket.channel]).length) { //last user left; room now empty
            delete localUser[socket.channel];
            delete history[socket.channel];
          }

          io.sockets.in(socket.username).emit("updateRooms", {
            disconnectFlag: true,
            room: socket.channel
          });

          // echo globally that this client has left
          socket.broadcast.to(socket.channel).emit('user left', {
            username: socket.username,
            numUsers: numUsers
          });
        }
      }

      io.in(socket.channel).emit("updateUsers", {
        usernames: localUser[socket.channel],
        room: socket.channel
      });

      socket.leave(socket.username);
      socket.leave(socket.channel);
    }
  });
});

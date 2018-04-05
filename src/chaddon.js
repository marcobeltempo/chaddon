var express = require('express');
var app = express();
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

//Modules
const envConfig = require(path.join(__dirname, "./config/envConfig.js"))(http);
//const dbClient = require(path.join(__dirname, "./db/dbConfig.js"));

envConfig.startServer(http);

// Routing
app.use(express.static(path.join(__dirname, '../browser_extension')));

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'add user', this listens and executes
  socket.on("add user", function (payload) {
    console.log("add user called!");
    if (addedUser) {
      return;
    };
    console.log("Adding: ", payload.username);
    console.log("Domain: ", payload.domain);
    // we store the username in the socket session for this client
    socket.username = payload.username;
    socket.channel = payload.domain;
    console.log("socket.channel : ", socket.channel);

    socket.join(socket.channel);

    numUsers += 1;
      addedUser = true;
    io.to(socket.channel).emit('login', {
      numUsers: numUsers
    });

    socket.broadcast.to(socket.channel).emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  socket.on("add existing", function (payload) {
    console.log("Existing Called!");
    if (addedUser) {
      return;
    };


    // we store the username in the socket session for this client
    socket.username = payload.username;
    socket.channel = payload.domain;

    socket.join(socket.channel);

    if (numUsers == 0) {
      numUsers = 1;
    }

      addedUser = true;
    io.to(socket.channel).emit('login', {
      numUsers: numUsers
    });

    socket.broadcast.to(socket.channel).emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {

    //console.log("Attempt to get session " + socket.handshake.session.userdata);
    // we tell the client to execute 'new message'
    socket.to(socket.channel).emit('new message', {
      username: socket.username,
      message: data
    });
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

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    console.log("User disconnect");
    if (addedUser) {
      if (numUsers > 1) {
        numUsers -= 1;
      }

      // echo globally that this client has left
      socket.broadcast.to(socket.channel).emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

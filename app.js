/**
 * Module dependencies.
 */

var express = require("express"),
  routes = require("./routes"),
  io = require("socket.io");

var app = (module.exports = express.createServer());

const { Client } = require("pg");

const client = new Client({
  connectionString:
  process.env.DATABASE_URL,
  ssl: true
});

client.connect();

//global variable to store input parameter
var params;

// Configuration

app.configure(function() {
  app.set("views", "views");
  app.set("view engine", "html");
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static("public"));
});

app.configure("development", function() {
  app.use(
    express.errorHandler({
      dumpExceptions: true,
      showStack: true
    })
  );
});

app.configure("production", function() {
  app.use(express.errorHandler());
});

// Routes

app.get("/", function(req, res) {
  params = req.params.id;
  res.sendfile("views/index.html", {
    root: __dirname
  });
});

app.get("/login", function(req, res) {
  params = req.params.id;
  res.sendfile("views/login.html", {
    root: __dirname
  });
});

app.get("/:id", function(req, res) {
  params = req.params.id;
  res.sendfile("views/chatroom.html", {
    root: __dirname
  });
});

io = io.listen(app);
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(
    "Express server listening on port %d in %s mode",
    app.address().port,
    app.settings.env
  );
});

//usernames in room
var localUser = {};

//usernames that are currently connected to char
var usernames = {};

// deleted users list
var delUsernames = [];

//rooms that are currently active
var rooms = [];

//storing room specific history
var history = {};

function htmlEntities(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

io.sockets.on("connection", function(socket) {
  socket.emit("news", "testdata");

  socket.on("adduser", function(message) {
    var sql =
      "SELECT * FROM tbl_verified_user WHERE TOKEN = '" + message.token + "'";
    client.query(sql, (err, result) => {
      if (result.rowCount > 0) {
        if (result) {
          console.log("User is verified");

          var username = htmlEntities(message.username);

          //store the username in the socket session for this client
          socket.username = username;

          //store room in the socket session
          socket.room = params;
          //store room in rooms array
          rooms.push(params);
          //add client username to global list
          usernames[username] = username;
		  
		  logAction("Joined room",socket.room,socket.username);

          //adding client to the room specific array
          if (localUser["" + params] === undefined) {
            localUser["" + params] = {};
            localUser["" + params][username] = username;
          } else {
            localUser["" + params][username] = username;
          }

          //send client the room
          socket.join(params);
          //user added
          socket.emit("userAdded", {
            username: username,
            room: socket.room,
            timestamp: new Date()
          });
          var callId = "Second call to update users";
          console.log("SECOND CALL TO UPDATE USERS " + socket.room);
          io.sockets.in(socket.room).emit("updateUsers", {
            removeUser: socket.username,
            usernames: localUser["" + params]
          });
          if (history["" + params] !== undefined) {
            socket.emit("loadHistory", history["" + params]);
          }
        }
      }
    });
  });

  socket.on("getOnlineUsers", function() {
    io.sockets.in(socket.room).emit("updateUsersLogin", {
      removeUser: socket.username,
      usernames: localUser["" + params]
    });
  });

  //pierre
  socket.on("verifyUser", function(data) {
    var token = generateUnid();
    var sql =
      "INSERT INTO tbl_verified_user (name,token) VALUES ('" +
      data +
      "','" +
      token +
      "')";
    client.query(sql, (err, result) => {
      if (err) {
        console.info(err);
      }
      console.log("1 record inserted");
    });

    console.log(generateUnid());
    io.sockets.emit("verifySuccess", {
      username: data,
      token: token
    });
  });

  socket.on("sendChatName", function() {
    io.sockets.emit("chatName", socket.room);
  });

  socket.on("verifyUserGoogle", function(data) {
    console.log("Verifying Google User");
    var sql =
      "INSERT INTO tbl_verified_user (name,token) VALUES ('" +
      data.username +
      "','" +
      data.token +
      "')";
    client.query(sql, (err, result) => {
      if (err) {
      }
      console.log("1 record inserted");
    });

    console.log(generateUnid());
    io.sockets.emit("verifySuccess", {
      username: data.username,
      token: data.token
    });
  });

  socket.on("verifySend", function(data) {
    var sql =
      "SELECT * FROM tbl_verified_user WHERE TOKEN = '" + data.token + "'";
    client.query(sql, (err, result) => {
      if (result.rowCount > 0) {
        if (result) {
          io.sockets.emit("verifySendSuccess", true);
        } else {
          io.sockets.emit("verifySendSuccess", false);
        }
      }
    });
  });

  socket.on("message", function(msg) {
    var message = {};
    message.message = htmlEntities(msg.message);
    message.user = htmlEntities(msg.user);
    message.timestamp = new Date();
    console.log("message");
	
    var sql =
      "SELECT * FROM tbl_verified_user WHERE TOKEN = '" + msg.token + "'";
    client.query(sql, (err, result) => {
      if (result.rowCount > 0) {
        if (result) {
          console.log("Sending message");
          if (history["" + params] === undefined) {
            history["" + params] = [];
            history["" + params].push(message);
          } else {
            history["" + params].push(message);
          }

          io.sockets.in(socket.room).emit("update", message);
        }
      } else {
      }
    });
	
	logAction("Message sent",socket.room,msg.user);
  });

  socket.on("disconnect", function() {
    console.log("disconnect called");
    //remove username from the global username list
	
	logAction("Left room",socket.room,socket.username);
	
    console.info("Removing " + socket.username);
    if (delete usernames[socket.username]) {
      console.info("deleted true 1");
    }

    //remove username fromm the localroom username list
    console.log("Check params: " + params);
    console.log("Size " + localUser[0]);
    if (localUser["" + params] != undefined) {
      console.log(
        "in this if where undefined " + localUser["" + params][socket.username]
      );
      if (delete localUser["" + params][socket.username]) {
        console.info("DELETED TRUE");
      }
    } else {
      console.info("UNDEFINED ROOM");
    }

    // Has bug where it clears the entire user list on disconnect. Could be because of added security verification
    // CONFIRMED: bug was in demo code used in late 2017
    // Update userlist
    console.log("FIRST CALL TO UPDATE USERS");
    var disconnectFlag = true;

    io.sockets.in(socket.room).emit("updateUsers", {
      disconnectFlag: disconnectFlag,
      removeUser: socket.username,
      usernames: localUser["" + params]
    });
    delete socket.username;
    socket.leave(socket.room);
  });
});

function generateUnid(
  a // placeholder
) {
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

function logAction(action,room,user){
	var sql =
      "INSERT INTO logaction (action,roomname,username) VALUES ('" +
	  action +
      "','" +
      room +
      "','" +
      user +
      "')";
	  console.log(sql);
    client.query(sql, (err, result) => {
      if (err) {
		  console.log(err);
      }
      console.log("logged action");
    });
}

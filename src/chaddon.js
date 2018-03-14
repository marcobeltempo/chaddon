//Dependacies
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
let io = require("socket.io");

//Middleware
var bodyParser = require("body-parser");

//Modules
const config = require("./config/index.js");
const db = require("./config/db.js");
const app = express();
require("./routers")(app);

//Configuration
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser);

//Set HTTPS/SSL options
var server;

if (config.env === "production") {
  //Create HTTP server
  server = http.createServer(app);
  app.use(config.forceSsl);
} else {
  //Create HTTPS server
  const httpsOptions = {
    key: fs.readFileSync("./ssl/server.key"),
    cert: fs.readFileSync("./ssl/server.csr")
  };
  server = https.createServer(httpsOptions, app);
}

//Connect server
server.listen(config.port, () => {
  console.log("\n__________________________________________________________\n");
  console.log(
    `Chaddon Express Server Started\nMode: ` +
    app.get("env") +
    `\nPort: ${config.port}`
  );
  console.log(`Link: ${config.host}${config.port}`);
  console.log("\n__________________________________________________________\n");

  // monitor idle db clients
  db.getClient(err => {
    if (err) {
      console.info("Datbase client error: ", err);
    }
    console.info("Checking for idle clients...");

  });
});


//global variable to store input parameter
var params;

io = io.listen(server);

//usernames in room
var localUser = {};

//usernames that are currently connected to chat
var usernames = {};

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

io.sockets.on("connection", function (socket) {
  socket.emit("news", "testdata");

  socket.on("adduser", function (message) {
    var sql =
      "SELECT * FROM tbl_verified_user WHERE TOKEN = '" + message.token + "'";

    db.query(sql, function (err, result) {
      if (result.rowCount > 0) {
        if (result) {
          console.log("User verification status: verified");

          var username = htmlEntities(message.username);
          params = message.room;
          //store the username in the socket session for this client
          socket.username = username;

          //store room in the socket session
          socket.room = params;
          //store room in rooms array
          rooms.push(params);
          //add client username to global list
          usernames[username] = username;

          //adding client to the room speicify array
          if (localUser["" + params] === undefined) {
            localUser["" + params] = {};
            localUser["" + params][username] = username;
          } else {
            localUser["" + params][username] = username;
          }

          // logAction("Joined room",socket.room,socket.username);

          //send client the room
          socket.join(params);
          //user added
          socket.emit("userAdded", {
            username: username,
            room: socket.room,
            timestamp: new Date()
          });

          console.log("Update users: 2nd call " + socket.room);
          io.sockets.in(socket.room).emit("updateUsers", {
            removeUser: socket.username,
            usernames: localUser["" + params]
          });
          //update your other tabs with new channel
          io.sockets.in(socket.username).emit("updateRooms", {
            room: socket.room
          });
          //update current tab with other channels
          socket.join(username);
          for (var i in localUser) {
            if (localUser[i][username] != undefined) {
              socket.emit("updateRooms", {
                room: i
              });
            }
          }
          if (history["" + params] !== undefined) {
            socket.emit("loadHistory", history["" + params]);
          }
        }
      }
    });
  });

  socket.on("getOnlineUsers", function () {
    io.sockets.in(socket.room).emit("updateUsersLogin", {
      removeUser: socket.username,
      usernames: localUser["" + params]
    });
  });

  //pierre
  socket.on("verifyUser", function (data) {
    var token = generateUnid();
    var insert;
    var usernameCheck =
      "SELECT name FROM tbl_verified_user WHERE name='" + data + "'";
    db.query(usernameCheck, (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.rowCount > 0) {
        console.log("Record found");
        io.sockets.emit("usernameTaken", insert);
      } else {
        var sql =
          "INSERT INTO tbl_verified_user (name,token) VALUES ('" +
          data +
          "','" +
          token +
          "')";
        db.query(sql, err => {
          if (err) {
            console.info(err);
          }
          console.log("Database query: succesfully inserted 1 record");
        });
        io.sockets.emit("verifySuccess", {
          username: data,
          token: token
        });
      }
    });

    console.log(generateUnid());
  });


  socket.on("verifyUserGoogle", function (data) {
    console.log("Verifying: Google User");
    var sql =
      "SELECT token FROM tbl_verified_user WHERE token ='" + data.token + "'";
    db.query(sql, (err, result) => {
      if (err) {
        console.log("Database " + err);
      } else if (result.rowCount > 0) {
        console.log("Database query: google user verified");
      } else {
        sql =
          "INSERT INTO tbl_verified_user (name,token) VALUES ('" +
          data.username +
          "','" +
          data.token +
          "')";

        db.query(sql, err => {
          if (err) {
            console.log("Database error: " + err);
          } else {
            console.log("Database query: succesfully inserted 1 record");
          }
        });
      }
    });

    console.log("Generated id: ", generateUnid());
    io.sockets.emit("verifySuccess", {
      username: data.username,
      token: data.token
    });
  });

  socket.on("verifySend", function (data) {
    var sql =
      "SELECT * FROM tbl_verified_user WHERE TOKEN = '" + data.token + "'";
    db.query(sql, (err, result) => {
      if (result.rowCount > 0) {
        if (result) {
          io.sockets.emit("verifySendSuccess", true);
        } else {
          io.sockets.emit("verifySendSuccess", false);
        }
      }
    });
  });

  socket.on("removeUser", function (data) {
    var sql2 = "DELETE FROM tbl_verified_user WHERE TOKEN ='" + data + "'";
    var sql = "SELECT name FROM tbl_verified_user WHERE TOKEN ='" + data + "'";
    db.query(sql, (err, result) => {
      if (result) {
        console.info("Removing User");
      } else {
        console.info("User removal Failed");
      }
    });

    db.query(sql2, (err, result) => {
      if (result) {
        console.info("Deleted user from database");
      }
    });
  });

  socket.on("message", function (msg) {
    var message = {};
    message.message = htmlEntities(msg.message);
    message.user = htmlEntities(msg.user);
    message.room = htmlEntities(msg.room);
    message.timestamp = new Date();
    params = msg.room;
    socket.room = msg.room;

    var sql =
      "SELECT * FROM tbl_verified_user WHERE TOKEN = '" + msg.token + "'";
    db.query(sql, (err, result) => {
      if (result.rowCount > 0) {
        if (result) {
          console.log("Message status: sending");
          if (history["" + params] === undefined) {
            history["" + params] = [];
            history["" + params].push(message);
          } else {
            history["" + params].push(message);
          }
          io.sockets.in(socket.room).emit("update", message);
        }
      }
    });
    //logAction("Message sent",socket.room,socket.username);
  });

  socket.on("viewchannel", function (data) {
    if (data.oldchannel != undefined) {
      socket.leave(data.oldchannel);
    }
    socket.join(data.room);
    if (history["" + data.room] !== undefined) {
      socket.emit("loadHistory", history["" + data.room]);
    }
  });

  socket.on("disconnect", function () {
    console.log("Disconnected: true");
    //logAction("Left room",socket.room,socket.username);
    //remove username from the global username list
    console.info("Removed user: " + socket.username);
    if (delete usernames[socket.username]) {
      console.info("Removed user staus: success");
    }

    //remove username from the localroom username list
    console.log("Parameters:    " + socket.room);
    console.log("Total users:    " + localUser[0]);
    if (localUser["" + socket.room] != undefined) {
      console.log(
        "in this if where undefined " + localUser["" + socket.room][socket.username]
      );
      if (delete localUser["" + socket.room][socket.username]) {
        //if (localUser.splice["" + socket.room][socket.username]) {
        console.info("Remove local user: true");
      }

      if (localUser["" + params] != undefined) {
        //empty
      }
    } else {
      console.info("Room: undefined");
    }

    // Has bug where it clears the entire user list on disconnect. Could be because of added security verification
    // CONFIRMED: bug was in demo code used in late 2017
    // Update userlist
    console.log("Update users: 1st call");
    var disconnectFlag = true;
    io.sockets.in(socket.room).emit("updateUsers", {
      disconnectFlag: disconnectFlag,
      removeUser: socket.username,
      usernames: localUser["" + params]
    });
    io.sockets.in(socket.username).emit("updateRooms", {
      disconnectFlag: disconnectFlag,
      room: socket.room
    });
    socket.leave(socket.username);
    delete socket.username;
    socket.leave(socket.room);
  });
});

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

// Uncomment for debugging
// function logAction(action, room, user) {
// var fs = require("fs");
// var log = fs.createWriteStream("chatroom-log.txt", { flags: "a" });
// log.write(
// new Date() +
// " - \t" +
// action +
// " - \t user: " +
// user +
// " - \t room: " +
// room +
// "\n"
// );
// log.end();
// }

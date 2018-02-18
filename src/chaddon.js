//Dependacies
const express = require("express");
const fs = require("fs");
const https = require("https");
let io = require("socket.io");

//Middleware
var bodyParser = require("body-parser");

//Modules
const config = require("./config/index.js");
const db = require("./config/db.js");
const apiRouter = require("./routers/index.js");
const app = express();
const routes = require("./routers")(app);

//Configuration
app.set("views", "views");
app.set("view engine", "html");
app.use(express.static("./src/public"));
app.use(bodyParser);

//Set HTTPS/SSL options
const httpsOptions = {
  key: fs.readFileSync("./ssl/server.key"),
  cert: fs.readFileSync("./ssl/server.csr")
};

//Create HTTPS server
const serverHttps = https
  .createServer(httpsOptions, app)
  .listen(config.port, () => {
    console.log(
      "\n__________________________________________________________\n"
    );
    console.log(
      `Chaddon Express Server Started\nMode: ` +
        app.get("env") +
        `\nPort: ${config.port}\nProtocol: HTTPS`
    );
    console.log(`Link: https://localhost:${config.port}`);
    console.log(
      "\n__________________________________________________________\n"
    );
    /*
    monitors idle db clients
    db.getClient(function(result) {
      console.log("Checking for idle clients...");
    });
    */
  });

//global variable to store input parameter
var params;

io = io.listen(serverHttps);

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

    db.query(sql, function(err, result) {
      if (result.rowCount > 0) {
        if (result) {
          console.log("User verification status: verified");

          var username = htmlEntities(message.username);

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
    db.query(sql, (err, result) => {
      if (err) {
        console.info(err);
      }
      console.log("Database query: succesfully inserted 1 record");
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
    console.log("Verifying: Google User");
    var sql =
      "INSERT INTO tbl_verified_user (name,token) VALUES ('" +
      data.username +
      "','" +
      data.token +
      "')";

    db.query(sql, (err, result) => {
      if (err) {
        console.log("Database " + err);
      } else {
        console.log("Database query: succesfully inserted 1 record");
      }
    });

    console.log("Generated id: ", generateUnid());
    io.sockets.emit("verifySuccess", {
      username: data.username,
      token: data.token
    });
  });

  socket.on("verifySend", function(data) {
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

  socket.on("message", function(msg) {
    var message = {};
    message.message = htmlEntities(msg.message);
    message.user = htmlEntities(msg.user);
    message.timestamp = new Date();

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
  });

  socket.on("disconnect", function() {
    console.log("Disconnected: true");

    //remove username from the global username list
    console.info("Removed user: " + socket.username);
    if (delete usernames[socket.username]) {
      console.info("Removed user staus: success");
    }

    //remove username from the localroom username list
    console.log("Parameters:    " + params);
    console.log("Total users:    " + localUser[0]);
    if (localUser["" + params] != undefined) {
      console.log(
        "in this if where undefined " + localUser["" + params][socket.username]
      );
      if (delete localUser["" + params][socket.username]) {
        console.info("Remove local user: true");
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

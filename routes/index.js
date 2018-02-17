var express = require("express");
var app = express();
var port = process.env.PORT || 3000;

// Configuration
app.set("views", "views");
app.set("view engine", "html");
app.use(express.static("public"));
/*
 * GET home page.
 */
module.exports = {

listen: app.listen(port, function() {
  console.log(
    "Express server listening on port %d in %s mode"
  );
}),

index: function(req, res) {
  res.render("index", { title: "Express" });
},

// Routes
home: app.get("/", function(req, res) {
  params = req.params.id;
  res.sendfile("views/index.html", {
    root: "./"
  });
}),

login: app.get("/login", function(req, res) {
  params = req.params.id;
  res.sendfile("views/login.html", {
  root: "./"
  });
}),

channelId: app.get("/:id", function(req, res) {
  params = req.params.id;
  res.sendfile("views/chatroom.html", {
  root: "./"
  });
})
};

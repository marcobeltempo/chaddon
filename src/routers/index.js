module.exports = function(app) {
  home: app.get("/", function(req, res) {
    params = req.params.id;
    res.sendFile("./src/views/index.html", {
      root: "./"
    });
  });

  login: app.get("/login", function(req, res) {
    params = req.params.id;
    res.sendFile("./src/views/login.html", {
      root: "./"
    });
  });

  channel: app.get("/:id", function(req, res) {
    params = req.params.id;
    res.sendFile("./src/views/chatroom.html", {
      root: "./"
    });
  });
};

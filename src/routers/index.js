module.exports = function(app) {
  app.get("/", (req, res) => {
    params = req.params.id;
    res.sendFile("./src/views/index.html", {
      root: "./"
    });
  });

  app.get("/login", (req, res) => {
    params = req.params.id;
    res.sendFile("./src/views/login.html", {
      root: "./"
    });
  });

  app.get("/privacy", (req, res) => {
    params = req.params.id;
    res.sendFile("./src/views/privacy_policy.html", {
      root: "./"
    });
  });

  app.get("/:id", (req, res) => {
    params = req.params.id;
    res.sendFile("./src/views/chatroom.html", {
      root: "./"
    });
  });
};

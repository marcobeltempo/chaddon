module.exports = function(app) {
  app.get("/", (req, res) => {
    res.sendFile("./src/views/index.html", {
      root: "./"
    });
  });

  app.get("/login", (req, res) => {
    res.sendFile("./src/views/login.html", {
      root: "./"
    });
  });

  app.get("/privacy", (req, res) => {
    res.sendFile("./src/views/privacy_policy.html", {
      root: "./"
    });
  });

  app.get("/admin", (req, res) => {
    res.sendFile("./src/views/admin.html", {
      root: "./"
    });
  });
  
  app.get("/:id", (req, res) => {
    res.sendFile("./src/views/chatroom.html", {
      root: "./"
    });
  });
};

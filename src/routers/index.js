module.exports = function(app) {
  app.get("/", (req, res) => {
    params = req.params.id;
res.render("pages/index");
  });

  app.get("/login", (req, res) => {
    params = req.params.id;
    res.render("./src/views/login.html");
  });

  app.get("/privacy", (req, res) => {
    params = req.params.id;
    res.render("./src/views/privacy_policy.html");
  });

  app.get("/:id", (req, res) => {
    params = req.params.id;
    res.render("./src/views/chatroom.html");
  });

  app.get("/admin", (req, res) => {
    res.sendFile("./src/views/admin.html", {
      root: "./"
    });
});
};
  app.get("/admin", (req, res) => {
    res.sendFile("./src/views/admin.html", {
      root: "./"
    });
  });
}
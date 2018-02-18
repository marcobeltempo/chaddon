module.exports = function(app) {
  /*  Redirect http to https */
  ssl: app.get("*", function(req, res, next) {
    if (
      req.headers["x-forwarded-proto"] != "https" &&
      process.env.NODE_ENV === "production"
    )
      res.redirect(['https://', req.get('Host'), req.url].join(''));
    else next(); /* Continue to other routes if we're not redirecting */
  });

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

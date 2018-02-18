module.exports = function(app) {
  /*  Redirect http to https */
  ssl: app.get("*", function(req, res, next) {
    if (
      req.headers["x-forwarded-proto"] != "https" &&
      process.env.NODE_ENV === "production"
    )
      res.redirect("https://" + req.headers.host + req.url);
    else next(); /* Continue to other routes if we're not redirecting */
  });

  known: app.get(
    "/.well-known/acme-challenge/NMIRSLS3zXAgBIjZPifzhUWzchQpmTs9x8zbQGurMBU",
    function(req, res) {
      res.send(
        "NMIRSLS3zXAgBIjZPifzhUWzchQpmTs9x8zbQGurMBU.6WZEFGXlH9BndsrHAT7QRIzr0c-VpII1XkTArqlc3qI"
      );
    }
  );
  well: known: app.get(
    ".well-known/acme-challenge/zbiN2m9GSzvGndLYMXtmpyCBOrSAbLSk4O0VuIuyR6k",
    function(req, res) {
      res.send(
        "zbiN2m9GSzvGndLYMXtmpyCBOrSAbLSk4O0VuIuyR6k.6WZEFGXlH9BndsrHAT7QRIzr0c-VpII1XkTArqlc3qI"
      );
    }
  );

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

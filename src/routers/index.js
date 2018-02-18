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
    "HaqicXPaSUmcMuxpwemfmLHfmHXh_9-tUz7T4XFQILU",
    function(req, res) {
      res.send(
        "HaqicXPaSUmcMuxpwemfmLHfmHXh_9-tUz7T4XFQILU.6WZEFGXlH9BndsrHAT7QRIzr0c-VpII1XkTArqlc3qI"
      );
    }
  );
  well: app.get(
    "rQtxYDE04sqN-hbbDclizOodMU28kf-Xi-l5t5gP864",
    function(req, res) {
      res.send(
        "rQtxYDE04sqN-hbbDclizOodMU28kf-Xi-l5t5gP864.6WZEFGXlH9BndsrHAT7QRIzr0c-VpII1XkTArqlc3qI"
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

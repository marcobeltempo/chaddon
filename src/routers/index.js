module.exports = function (app) {
  app.get("/", (req, res) => {
    res.render("pages/index", { user: req.user });
  });

  app.get("/privacy", (req, res) => {
    res.render("pages/privacy_policy");
  });

  app.get("/admin", (req, res) => {
    res.render("pages/admin", {});
  });

  app.get("/:id", (req, res) => {
    res.render("pages/chatroom");
  });

};

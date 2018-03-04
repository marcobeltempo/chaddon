module.exports = Object.freeze({
  host: "https://localhost:",
  port: parseInt(process.env.PORT || 3000, 10),
  env: process.env.NODE_ENV || "development",

  forceSsl: function(req, res, next) {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(["https://", req.get("Host"), req.url].join(""));
    }
    return next();
  }
});

var path = require('path');
var dbClient = require(path.join(__dirname, "../db/dbConfig.js")).getClient;

module.exports = function (http) {

  var module = {};
  module.dbClient;
  module.host = "http://localhost:",
  module.port = parseInt(process.env.PORT || 3000, 10),
  module.env = process.env.NODE_ENV || "development",

  module.forceSsl = function (req, res, next) {
      if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect(["https://", req.get("Host"), req.url].join(""));
      }
      return next();
    },

  module.startServer = function (http) {
      http.listen(module.port, function () {
        console.info(`
      __________________________________________________________
     |              Chaddon Express Server Started              |
     |----------------------------------------------------------|
     |   Mode:  ${module.env}                                     |
     |   Port:  ${module.port}                                            |
     |   Link:  ${module.host}${module.port}                           |
     |__________________________________________________________|
     `);
      });

      //monitor idle db clients
      dbClient(err => {
        if (err) {
          console.error("Datbase client error: ", err);
        }
      });
    };
  return module;
};

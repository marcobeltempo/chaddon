var path = require('path');
var pem = require('pem');
const dbClient = require(path.join(__dirname, '../db')).getClient;
const debugServer= require('debug')('chaddon:server');

module.exports = {
  dbCLient: dbClient,
  host: 'https://localhost:',
  port: parseInt(process.env.PORT || 3000, 10),
  env: process.env.NODE_ENV || 'development',

  forceSSL: function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
  },
  getSSL: function (callback) {
    pem.createCertificate(
      {
        days: 30,
        selfSigned: true
      },
      function (err, keys) {
        if (err) {
          throw err;
        }
        return callback(keys);
      }
    );
  },
  serverMessage: function () {

const serverInfo = `
      _______________________________________
     |    Chaddon Express Server Started     |
     |---------------------------------------|
     |   Mode:  ${this.env}                  |
     |   Port:  ${this.port}                         |
     |   Link:  ${this.host}${this.port}       |
     |_______________________________________|`;

     debugServer('%s', serverInfo);

    // monitor idle db clients
    dbClient(err => {
      if (err) {
        debugRouter('server:database:error ', err);
      }
    });
  }
};

var path = require('path');
const dbClient = require(path.join(__dirname, '../db')).getClient;
const debugServer= require('debug')('chaddon:server');

module.exports = {
  dbCLient: dbClient,
  host: 'http://localhost:',
  port: parseInt(process.env.PORT || 3000, 10),
  env: process.env.NODE_ENV || 'development',

  forceSSL: function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
  },
  serverMessage: function () {

const serverInfo = `
      __________________________________
     |      Chaddon Express Server      |
     |----------------------------------|
     | Mode: ${this.env}                |
     | Port: ${this.port}                       |
     | Link: ${this.host}${this.port}      |
     |__________________________________|`;

     debugServer('%s', serverInfo);

    // monitor idle db clients
    dbClient(err => {
      if (err) {
        debugRouter('server:database:error ', err);
      }
    });
  }
};

const { Client } = require("pg");

module.exports = Object.freeze({
  port: parseInt(process.env.PORT || 3000, 10),

  db: new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  })
});

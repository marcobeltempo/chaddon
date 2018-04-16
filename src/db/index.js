require('dotenv').load();
const { Pool } = require('pg');
const debugDatabase = require('debug')('chaddon:database:postgresql');
const connString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: connString,
  ssl: true
});

module.exports = {
  query: (text, callback) =>
    pool.query(text, (err, res) => {
      if (err) {
        debugDatabase('There was an error executing a query.: %s,', err);
      }

      debugDatabase('Executing the following query: %s,', text);
      callback(err, res);
    }),
  getClient: callback => {
    pool.connect((err, client, done) => {
      const query = client.query.bind(client);

      // monkey patch the query method to keep track of the last query executed
      client.query = () => {
        client.lastQuery = arguments;
        client.query(...arguments);
      };

      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        debugDatabase('A client has been checked out for more than 5 seconds!');
        debugDatabase(
          'The last executed query on this client was: ',
          client.lastQuery
        );
      }, 5000);

      const release = err => {
        // call the actual 'done' method, returning this client to the pool
        done(err);

        // clear our timeout
        clearTimeout(timeout);

        // set the query method back to its old un-monkey-patched version
        client.query = query;
      };
      callback(err, client, done);
    });
  }
};

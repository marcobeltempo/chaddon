const { Pool } = require("pg");
require("dotenv").load();
var conString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: conString,
    ssl: true
});

module.exports = {
    query: (text, callback) => {
        const start = Date.now();
        return pool.query(text, (err, res) => {
            const duration = Date.now() - start;
            //uncomment for debugging
            //console.log('executed query', { text, duration, rows: res.rowCount })
            callback(err, res);
        });
    },
    getClient: callback => {
        pool.connect((err, client, done) => {
            const query = client.query.bind(client);

            // monkey patch the query method to keep track of the last query executed
            client.query = () => {
                client.lastQuery = arguments;
                client.query.apply(client, arguments);
            };

            // set a timeout of 5 seconds, after which we will log this client's last query
            const timeout = setTimeout(() => {
                console.error("A client has been checked out for more than 5 seconds!");
                console.error(
                    `The last executed query on this client was: ${client.lastQuery}`
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

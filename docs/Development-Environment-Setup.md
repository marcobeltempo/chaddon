---
layout: default
---

This guide will get you setup with Heroku and PostgreSQL on your local machine.

* [Heroku](#heroku)
* [PostgreSQL](#postgresql)
  * [Connection](#connection) 
  * [Prerequisites](#prerequisites)
  * [pgAdmin](#pgadmin)

## Heroku

1. [Download and install Heroku](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
2. Command line: `heroku login`
   * enter username and password
3.Command line: `heroku keys:add` 
4. If you've already added your GitHub SSH keys select those. 
This will save you from manually logging in every time. 
If you haven't, follow the instructions for [generating an SSH key](https://devcenter.heroku.com/articles/keys#adding-keys-to-heroku).

## PostgreSQL 

This will connect you to Chaddon's Heroku+PostgreSQL server. If you wish to create a local database you'll need to [download PostgreSQL](https://www.postgresql.org/download/) on your machine
For more information visit [Connecting to Node on Heroku Postgres](https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js)

### Prerequisites
PosgreSQL has been added to the devDependencies in `package.json`
1. Command line: `npm install`

### Connection
1. In the chaddon root, create a file named `.env`. This will store the connection string so we're not hardcoding the credentials.
2. In the `.env` file you just created add the following variable `DATABASE_URL=[INSERT YOUR POSTGRES/HEROKU CONNECTION STRING HERE`
  * Your connection string could be found within the **Data** section of your Heroku account. If you have any troubles locating it just as Marco.

_DO NOT commit this file to the project repo. It's been added to the `.gitignore` file._
3. Execute the example below to test the connection.


```js
//Example connection function
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.LOCAL_DATABASE_URL,
  ssl:true
});

client.connect();

client.query('SELECT * FROM tbl_verified_user;', (err, res) => {
  if (err) throw err;
  console.log(res.rows);
  client.end();
});

```

### pgAdmin

1. Download and install the latest version of [pgAdmin](https://www.pgadmin.org/download/)
2. Launch pgAdmin
3. Login to Heroku to [get your database credentials](https://data.heroku.com/datastores/)
4. In pgAdmin under the **Browser** panel:
   - right click on **Servers** > **Create** > **Server**

5. On the **General** tab fill in the following:
   - **Name:** `Heroku Chaddon`

6. Under the **Connection** tab:
   - **Host name/address:** `YOUR HEROKU HOST ADDRESS`
   - **Port:** 5432
   - **Maintenance database:** `YOUR HEROKU DATABASE NAME`
   - **Username:** `YOUR HEROKU USER`

7. Under the **SSL** tab:
   - **SSL mode:** `Require`
   - **SSL compression?:** `True`

8. Under the **Advanced** tab"
   - **DB restriction**: `YOUR HEROKU DATABASE NAME`

8. Click Save




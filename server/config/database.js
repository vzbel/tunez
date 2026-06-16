const dotenv = require("./env.js");
const pg = require("pg");

const config = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new pg.Pool(config);

module.exports = {
  pool,
};

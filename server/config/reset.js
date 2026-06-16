/**
 * this is just an example project, it
 * must have a reset.js file with all
 * table creation and ability to drop tables
 *
 * in reality we wouldn't really do this
 */

const { pool } = require("./database.js");

const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        email varchar(254) NOT NULL,
        username varchar(30) NOT NULL,
        password_hash varchar(255) NOT NULL,
        pfp_url varchar,
        bio varchar(150),
        PRIMARY KEY(id),
        UNIQUE(email)
      );
      `);
    console.log("created users table");
  } catch (error) {
    console.error(error);
  }
};

const dropTable = async (tableName) => {
  try {
    await pool.query(`DROP TABLE IF EXISTS ${tableName}`);
    console.log(`dropped ${tableName} table`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * super totally extremely dangerous function
 */
const runReset = async () => {
  await dropTable("users");
  await createUsersTable();
};

runReset();

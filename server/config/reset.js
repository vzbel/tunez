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
        UNIQUE(email),
        UNIQUE(username)
      );
      `);
    console.log("created users table");
  } catch (error) {
    console.error(error);
  }
};

const createSongsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS songs(
        id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        user_id integer NOT NULL,
        cover_url varchar,
        title varchar(500) NOT NULL,
        genre varchar(255) NOT NULL,
        description varchar(1000),
        object_path varchar(1024) NOT NULL,
        plays integer DEFAULT 0 NOT NULL CHECK(plays >= 0),
        PRIMARY KEY(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
          ON UPDATE CASCADE ON DELETE CASCADE
      );
      `);
    console.log("created songs table");
  } catch (error) {
    console.error(error);
  }
};

const createSongArtistsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS song_artists(
        created_at timestamptz DEFAULT now() NOT NULL,
        song_id integer NOT NULL,
        artist varchar(100) NOT NULL,
        PRIMARY KEY(song_id, artist),
        FOREIGN KEY(song_id) REFERENCES songs(id)
          ON UPDATE CASCADE ON DELETE CASCADE
      );
      `);
    console.log("created song artists table");
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
  await dropTable("song_artists");
  await dropTable("songs");
  await dropTable("users");
  await createUsersTable();
  await createSongsTable();
  await createSongArtistsTable();
};

runReset();

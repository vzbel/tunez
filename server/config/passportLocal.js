const passport = require("passport");
const LocalStrategy = require("passport-local");
const { pool } = require("./database.js");

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, pfp_url: user.pfp_url });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

/**
 *
 * checks if the password matches for user with the given username
 */
async function verify(username, password, cb) {
  try {
    const userResult = await pool.query(
      `
      SELECT id, created_at, email, username, pfp_url, bio, (password_hash = crypt($1, password_hash)) AS password_matches
      FROM users
      WHERE username=$2`,
      [password, username],
    );

    // no such username
    if (userResult.rowCount === 0) {
      return cb(null, false);
    }

    // username exists, check password
    const user = userResult.rows[0];
    const isPasswordCorrect = userResult.rows[0]["password_matches"];
    if (!isPasswordCorrect) {
      return cb(null, false);
    }
    return cb(null, user);
  } catch (err) {
    console.error(err);
    return cb(err);
  }
}

const strategy = new LocalStrategy(verify);
passport.use(strategy);

/**
 * controller for authentication
 * (login, logout, etc.)
 */

const express = require("express");
const ErrorNames = require("../config/errorNames.js");
const { pool } = require("../config/database.js");
const MIN_PASSWORD_LEN = 8;

const handleLoginWithPass = (req, res) => {
  delete req.user.password_matches;
  return res.status(200).json(req.user);
};

const handleLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.status(200).end();
  });
};

const handleSignUp = async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "no request body provided" });
  }

  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: "incomplete signup fields" });
  }
  if (password.length < MIN_PASSWORD_LEN) {
    return res.status(400).json({
      error: `password must be at least ${MIN_PASSWORD_LEN} characters`,
    });
  }

  // add user to database
  const results = await pool.query(
    `
    INSERT INTO users(email, username, password_hash)
    VALUES ($1, $2, crypt($3, gen_salt('md5')))
    RETURNING *;
    `,
    [email, username, password],
  );

  if (results.rowCount === 0) {
    return next(new Error("failed to create user"));
  }

  const user = {
    id: results.rows[0].id,
    username: results.rows[0].username,
    pfp_url: null,
  };

  req.login(user, (err) => {
    if (err) {
      return next(err);
    }
    return res.status(200).json(results.rows[0]);
  });
};

const getCurrentUser = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "not logged in" });
  }

  return res.status(200).json({
    id: req.user.id,
    username: req.user.username,
    profilePicture: req.user.pfp_url,
  });
};

module.exports = {
  handleLoginWithPass,
  handleLogout,
  handleSignUp,
  getCurrentUser,
};

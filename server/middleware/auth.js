const express = require("express");
const passport = require("passport");

const checkIfLoggedIn = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  return next();
};

module.exports = {
  checkIfLoggedIn,
};

/**
 * authentication router
 */
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.js");
const ErrorNames = require("../config/errorNames.js");
require("../config/passportLocal.js");
const passport = require("passport");

// sign in with username and password
router.post(
  "/login/password",
  passport.authenticate("local"),
  AuthController.handleLoginWithPass,
);
router.post("/logout", AuthController.handleLogout);
router.post("/signup", AuthController.handleSignUp);
router.get("/me", AuthController.getCurrentUser);

module.exports = router;

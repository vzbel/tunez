const express = require("express");
const router = express.Router();
const TracksController = require("../controllers/tracks.js");
const passport = require("passport");

const { checkIfLoggedIn } = require("../middleware/auth.js");

router.post(
  "/upload-url",
  checkIfLoggedIn,
  TracksController.getPresignedUploadURL,
);
router.post("/", checkIfLoggedIn, TracksController.createTrack);
module.exports = router;

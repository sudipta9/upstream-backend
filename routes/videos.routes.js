const express = require("express");
const passport = require("passport");
const Videos = require("../models/videos.model");
const passportConfig = require("../passport");
const router = express.Router();

router.get(
  "/get-videos-list",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Videos.find({}, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          msg: "Oops! Something happened unexpectedly",
        });
      }
      if (!data) {
        return res.status(400).json({
          success: false,
          msg: "Sorry! no videos found",
        });
      }
      return res.status(200).json({
        success: true,
        videosData: data,
      });
    });
  }
);

router.get("/watch/:id", (req, res) => {
  const videoId = req.params.id;
  Videos.findById(videoId, (err, video) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "Oops! Something happened unexpectedly",
      });
    }
    if (!video) {
      return res.status(400).json({
        success: false,
        msg: "Sorry! no videos found",
      });
    }
    return res.status(200).json({
      success: true,
      data: video,
    });
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  signOutController,
  changePasswordController,
  resetPasswordController,
  forgetPasswordController,
  checkResetPasswordToken,
} = require("../controllers/common.controller");
const {
  creatorSignInController,
} = require("../controllers/creators.controller");
const { userSignOutController } = require("../controllers/users.controller");
const passportConfig = require("../passport");
const multer = require("multer");

router.post(
  "/sign-in",
  passport.authenticate("local", { session: false }),
  creatorSignInController
);

router.get(
  "/is-authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          msg: "Oops! Something happened unexpectedly",
        });
      }
      if (user.role !== "creator") {
        return res.status(401).json({
          success: false,
          msg: "this is not a creator account",
        });
      }
      return res.status(200).json({
        success: true,
        msg: "User is authenticated",
      });
    });
  }
);

router.get(
  "/sign-out",
  passport.authenticate("jwt", { session: false }),
  signOutController
);

router.post(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  changePasswordController
);

router.post("/forget-password", forgetPasswordController);
router.get("/check-reset-password-token", checkResetPasswordToken);
router.post("/reset-password", resetPasswordController);

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "media/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({
  storage: storage,
}).single("file");

const { getVideoDurationInSeconds } = require("get-video-duration");
const generateThumbnail = require("../helpers/videoThumbnail");
const User = require("../models/user.model");
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    upload(req, res, (err) => {
      const data = JSON.parse(req.body.data);
      if (!data.title) {
        return res.status(404).json({
          success: false,
          msg: "Please Provide video title",
        });
      }
      if (!data.summary) {
        return res.status(404).json({
          success: false,
          msg: "Please Provide video summary",
        });
      }
      if (!req.file)
        return res.status(404).json({
          success: false,
          msg: "Please Select a video file",
        });
      req.body.data = data;
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          msg: "Oops! Something happened unexpectedly",
        });
      }
      next();
    });
  },
  async (req, res) => {
    const vidPath = req.file.path;
    const vidDuration = await getVideoDurationInSeconds(vidPath);

    User.findById(req.user._id, (err, user) => {
      generateThumbnail(
        req.user._id,
        user.creatorsName,
        req.body.data.title,
        req.body.data.summary,
        req.file.filename.replace(/\s+/g, "_"),
        `http://127.0.0.1:${
          process.env.PORT
        }/api/videos/${req.file.filename.replace(/\s+/g, "_")}`,
        vidDuration,
        res
      );
    });
  }
);

module.exports = router;

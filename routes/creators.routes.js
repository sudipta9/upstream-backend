const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  signOutController,
  changePasswordController,
  resetPasswordController,
  forgetPasswordController,
} = require("../controllers/common.controller");
const {
  creatorSignInController,
} = require("../controllers/creators.controller");
const { userSignOutController } = require("../controllers/users.controller");
const passportConfig = require("../passport");

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
router.post("/reset-password", resetPasswordController);

module.exports = router;

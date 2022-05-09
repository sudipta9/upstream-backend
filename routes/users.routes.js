const express = require("express");
const passport = require("passport");
const passportConfig = require("../passport");
const router = express.Router();
const userController = require("../controllers/users.controller");
const Users = require("../models/user.model");
const {
  signOutController,
  changePasswordController,
  resetPasswordController,
  forgetPasswordController,
  checkResetPasswordToken,
} = require("../controllers/common.controller");

router.post("/sign-up", userController.userSignupController);

router.post(
  "/sign-in",
  passport.authenticate("local", { session: false }),
  userController.userSignInController
);

router.get(
  "/is-authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({
      success: true,
      msg: "user is authenticated",
      role: req.user.role,
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

module.exports = router;

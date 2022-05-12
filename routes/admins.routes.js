const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  adminSignInController,
  addUserController,
  deleteUserController,
  addPlanController,
} = require("../controllers/admins.controller");
const {
  signOutController,
  changePasswordController,
} = require("../controllers/common.controller");
const User = require("../models/user.model");
const Plan = require("../models/plans.model");

const passportConfig = require("../passport");
const { isAdmin } = require("../middlewares/auth");

router.post(
  "/sign-in",
  passport.authenticate("local", { session: false }),
  adminSignInController
);

// router.get(
//   "/is-authenticated",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     User.findOne({ email: req.user.email }, (err, user) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({
//           success: false,
//           msg: "Oops! Something happened unexpectedly",
//         });
//       }
//       if (user.role !== "admin") {
//         return res.status(401).json({
//           success: false,
//           msg: "this is not an admin account",
//         });
//       }
//       return res.status(200).json({
//         success: true,
//         msg: "User is authenticated",
//       });
//     });
//   }
// );

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

router.post(
  "/add-user",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  addUserController
);

router.post(
  "/delete-user",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  deleteUserController
);

router.post(
  "/add-new-plan",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  addPlanController
);

module.exports = router;

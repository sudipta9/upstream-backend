const express = require("express");
const passport = require("passport");
const Subscription = require("../models/subscription.model");
const router = express.Router();
const passportConfig = require("../passport");

router.get(
  "/get-subscription",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      const { _id } = req.user;
      Subscription.findOne({ userId: _id }, (err, subscriptionDetails) => {
        if (err) {
          return res.status(500).json({
            success: false,
            msg: "Oops! Something happened unexpectedly",
          });
        }
        if (subscriptionDetails && subscriptionDetails.validTill > Date.now()) {
          return res.status(200).json({
            success: true,
            isSubscribed: true,
          });
        } else {
          res.status(200).json({
            success: true,
            isSubscribed: false,
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "Oops! Something happened unexpectedly",
      });
    }
  }
);

module.exports = router;

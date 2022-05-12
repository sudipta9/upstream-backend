const express = require("express");
const passport = require("passport");
const {
  buySubscriptionController,
  verifyPaymentController,
} = require("../controllers/payments.controller");
const router = express.Router();
const passportConfig = require("../passport");

router.post(
  "/buy-subscription",
  passport.authenticate("jwt", { session: false }),
  buySubscriptionController
);

router.post(
  "/verify-payment",
  passport.authenticate("jwt", { session: false }),
  verifyPaymentController
);

module.exports = router;

const express = require("express");
const passport = require("passport");
const router = express.Router();
const passportConfig = require("../passport");
const Plans = require("../models/plans.model");

router.get(
  "/get-plans",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Plans.find({}, (err, data) => {
      if (err)
        return res.status(500).json({
          success: false,
          msg: "Oops! Something happened unexpectedly",
        });
      if (!data)
        return res.status(500).json({
          success: false,
          msg: "Oops! Something happened unexpectedly",
        });
      else {
        const resData = data.map((plan) => {
          return {
            _id: plan._id,
            name: plan.name,
            features: plan.features,
            price: plan.price,
          };
        });
        return res.status(200).json({
          success: true,
          data: resData,
        });
      }
    });
  }
);

module.exports = router;

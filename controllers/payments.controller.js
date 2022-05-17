const Razorpay = require("razorpay");
const Plan = require("../models/plans.model");
const Subscription = require("../models/subscription.model");
const crypto = require("crypto");

const buySubscriptionController = async (req, res) => {
  try {
    if (!req.body.planId)
      return res.status(404).json({
        success: false,
        msg: "DATA MISSING",
      });
    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });
    await Plan.findOne({ _id: req.body.planId }).then(async (data) => {
      if (data) {
        await instance.orders
          .create({
            amount: data.price * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
          })
          .then((result) => {
            return res.status(200).json({
              success: true,
              data: result,
            });
          });
      } else {
        return res
          .status(404)
          .json({ success: false, msg: "Invalid plan data provided" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Oops! Something happened unexpectedly",
    });
  }
};

const verifyPaymentController = async (req, res) => {
  try {
    if (!req.body.orderId)
      return res.status(404).json({
        success: false,
        msg: "Please provide the order ID",
      });

    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const data = await instance.orders.fetch(req.body.orderId);
    if (data.status === "paid") {
      // console.log(data);

      // console.log("planID", req.body.planId);
      Plan.findOne({ _id: req.body.planId }, (err, plan) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            msg: "Oops! Something happened unexpectedly",
          });
        }
        if (!plan) {
          return res.status(404).json({
            success: false,
            msg: "Unknown Plan ID received",
          });
        } else {
          Subscription.findOne(
            { userId: req.user._id },
            (err, subscriptionData) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  success: false,
                  msg: "Oops! Something happened unexpectedly",
                });
              }
              if (!subscriptionData) {
                const data = new Subscription({
                  userId: req.user._id,
                  planId: plan._id,
                  validTill: new Date(Date.now() + plan.validity),
                });
                data.save((err) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      success: false,
                      msg: "Oops! Something happened unexpectedly",
                    });
                  }
                });
              } else {
                subscriptionData.planId = plan._id;
                subscriptionData.validTill = new Date(
                  Date.now() + plan.validity
                );
                subscriptionData.save((err) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      success: false,
                      msg: "Oops! Something happened unexpectedly",
                    });
                  } else
                    return res.status(200).json({
                      success: true,
                      data,
                    });
                });
              }
            }
          );
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "Payment Unsuccessful",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Oops! Something happened unexpectedly",
    });
  }
};

module.exports = { buySubscriptionController, verifyPaymentController };

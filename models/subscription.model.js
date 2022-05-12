const mongoose = require("mongoose");

const subscriptionModel = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "plans",
    required: true,
  },
  validTill: {
    type: Date,
  },
});

module.exports = mongoose.model("subscriptions", subscriptionModel);

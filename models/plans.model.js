const mongoose = require("mongoose");

const plansSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    maxlength: 3,
    required: true,
  },
  features: [
    {
      type: String,
    },
  ],
  validity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("plans", plansSchema);

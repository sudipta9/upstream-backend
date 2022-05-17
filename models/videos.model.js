const mongoose = require("mongoose");

const videoScheme = new mongoose.Schema({
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  creatorsName: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  summery: {
    type: String,
    required: true,
  },
  VideoUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("videos", videoScheme);

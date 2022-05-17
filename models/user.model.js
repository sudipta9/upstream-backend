const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user", "creator"],
    default: "user",
  },
  resetPasswordToken: {
    type: String,
    default: undefined,
  },
  resetPasswordTokenExpires: {
    type: Date,
    default: undefined,
  },
  creatorsName: {
    type: String,
    default: undefined,
  },
});

userSchema.pre("save", function (next) {
  if (!this.isModified) {
    return next();
  }
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

userSchema.methods.comparePassword = function (password, next) {
  bcrypt.compare(password, this.password, (err, isSame) => {
    if (err) return next(err);
    else {
      if (!isSame) return next(null, isSame);
      return next(null, this);
    }
  });
};

module.exports = mongoose.model("users", userSchema);

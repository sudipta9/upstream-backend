const User = require("../models/user.model");

const isAdmin = (req, res, next) => {
  User.findOne({ email: req.user.email }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "Oops! Something happened unexpectedly",
      });
    }
    if (user.role !== "admin") {
      return res.status(401).json({
        success: false,
        msg: "this is not an admin account",
      });
    }
    return next();
  });
};

module.exports = { isAdmin };

const forgetPasswordToken = require("../helpers/forgetPasswordToken");
const sendMail = require("../helpers/sendMail");
const User = require("../models/user.model");

const signOutController = (req, res) => {
  // console.log(req.user);
  res.clearCookie("access_token");
  res.status(200).json({
    success: true,
    msg: "User logged out successfully",
  });
};

const changePasswordController = (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword)
    return res.status(400).json({
      success: false,
      msg: "Please provide your old password",
    });
  if (!newPassword)
    return res.status(400).json({
      success: false,
      msg: "Please provide new Password",
    });
  else {
    const { _id } = req.user;
    User.findOne({ _id }, (err, user) => {
      if (err)
        return res.status(500).json({
          success: false,
          msg: "Oops! Something happened unexpectedly",
        });
      user.comparePassword(oldPassword, (error, isSame) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            msg: "Oops! Something happened unexpectedly",
          });
        }
        if (!isSame) {
          return res.status(401).json({
            success: false,
            msg: "Old password is incorrect",
          });
        }
        if (isSame) {
          user.password = newPassword;
          user.save((err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: false,
                msg: "Oops! Something happened unexpectedly",
              });
            }
            return res.status(201).json({
              success: true,
              msg: "Password updated successfully",
            });
          });
        }
      });
    });
  }
};

const forgetPasswordController = (req, res) => {
  const { email, domain } = req.body;
  if (!email || email === "")
    return res.status(400).json({
      success: false,
      msg: "Please provide a valid email address",
    });
  User.findOne({ email }, (err, user) => {
    if (err)
      return res.status(500).json({
        success: false,
        msg: "Oops! Something happened unexpectedly",
      });
    if (!user)
      return res.status(400).json({
        success: false,
        msg: "User not registered, please sign up to use our service",
      });
    const token = forgetPasswordToken(user._id, user.email);
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = Date.now() + 3600000;
    user.save((err) => {
      if (err)
        return res.status(500).json({
          success: false,
          msg: "Oops! Something happened unexpectedly",
        });
      else {
        // console.log(token);
        const resetPasswordMsg = `please click on the following link to reset your password. ${domain}?forgetpasswd=${user._id}&token=${token}`;
        sendMail(email, "Reset your password", resetPasswordMsg);
        return res.status(200).json({
          success: true,
          msg: "Reset password link has been sent to your email address, please check your email to reset your password",
        });
      }
    });
  });
};

const checkResetPasswordToken = (req, res) => {
  if (!req.query.token)
    return res.status(400).json({
      success: false,
      msg: "Reset password token is missing",
    });
  User.findOne({ resetPasswordToken: req.query.token }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "Oops! Something happened unexpectedly",
      });
    }
    if (!user || user.resetPasswordTokenExpires <= Date.now())
      return res.status(400).json({
        success: false,
        msg: "Token expired please generate a new token to reset your password",
      });
    else
      return res.status(200).json({
        success: true,
      });
  });
};

const resetPasswordController = (req, res) => {
  if (!req.query.token)
    return res.status(400).json({
      success: false,
      msg: "Reset password token is missing",
    });
  if (!req.body.password) {
    return res.status(400).json({
      success: false,
      msg: "Please Provide a new password",
    });
  }
  User.findOne({ resetPasswordToken: req.query.token }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "Oops! Something happened unexpectedly",
      });
    }
    if (!user || user.resetPasswordTokenExpires <= Date.now())
      return res.status(400).json({
        success: false,
        msg: "Token expired please generate a new token to reset password",
      });
    else {
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpires = undefined;
      user.save((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            msg: "Oops! Something happened unexpectedly",
          });
        }
        return res.status(201).json({
          success: true,
          msg: "Password changed successfully",
        });
      });
    }
  });
};

module.exports = {
  signOutController,
  changePasswordController,
  forgetPasswordController,
  checkResetPasswordToken,
  resetPasswordController,
};

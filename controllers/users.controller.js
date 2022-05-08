const { isEmail } = require("validator");
const User = require("../models/user.model");
const { signToken } = require("../helpers/jwtSign");

const userSignupController = (req, res) => {
  const { email, password } = req.body;
  if (!email || !isEmail(email))
    return res.status(400).json({
      success: false,
      msg: "Provide a valid email",
    });
  if (!password)
    return res.status(400).json({
      success: false,
      msg: "Provide a valid Password",
    });
  else {
    User.findOne({ email }, (err, isExistingUser) => {
      if (err)
        return res.status(500).json({
          success: false,
          msg: "Oops! Something happened unexpectedly",
        });
      if (isExistingUser)
        return res.status(400).json({
          success: false,
          msg: "Email already exists try logging in",
        });
      else {
        const user = new User({
          email: email,
          password: password,
          role: "user",
        });
        user.save((err) => {
          if (err)
            return res.status(500).json({
              success: false,
              msg: "Oops! Something happened unexpectedly",
            });
          else
            return res.status(201).json({
              success: true,
              msg: "User created successfully",
            });
        });
      }
    });
  }
};

const userSignInController = (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, role } = req.user;
    const token = signToken(_id);
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: true,
    });
    return res.status(200).json({
      success: true,
      msg: "Successfully signed in",
      user: {
        _id,
        role,
      },
    });
  }
};

module.exports = {
  userSignupController,
  userSignInController,
};

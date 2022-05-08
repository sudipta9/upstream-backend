const JWT = require("jsonwebtoken");
const { signToken } = require("../helpers/jwtSign");
const { isEmail } = require("validator");
const User = require("../models/user.model");
const sendMail = require("../helpers/sendMail");
const generatePassword = require("../helpers/generatePassword");

const adminSignInController = (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, role } = req.user;
    if (role === "admin") {
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
          role
        }
      });
    } else
      return res.status(401).json({
        success: false,
        msg: "You are not an admin user",
      });
  }
};

const addUserController = (req, res) => {
  const { email, role = "user" } = req.body;
  if (!email || !isEmail(email))
    return res.status(400).json({
      success: false,
      msg: "Provide a valid email",
    });
  const password = generatePassword();
  User.findOne({ email }, (err, isExistingCreator) => {
    if (err)
      return res.status(500).json({
        success: false,
        msg: "Oops! Something happened unexpectedly",
      });
    if (isExistingCreator)
      return res.status(400).json({
        success: false,
        msg: "Email already exists",
      });
    const creator = new User({
      email,
      password,
      role,
    });
    creator.save((err) => {
      if (err)
        return res.status(500).json({
          success: false,
          msg: "Oops! Something happened unexpectedly",
        });
      else {
        sendMail(
          email,
          `${role} account password generated`,
          `generated password : ${password}, 
          please change it immediately`
        );
        return res.status(201).json({
          success: true,
          msg: "Creator account created successfully",
        });
      }
    });
  });
};

module.exports = { adminSignInController, addUserController };

const { signToken } = require("../helpers/jwtSign");
// const Users = require("../models/user.model");

const creatorSignInController = (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, role } = req.user;
    if (role === "creator") {
      const token = signToken(_id);
      res.cookie("access_token", token, {
        // httpOnly: true,
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
    } else
      return res.status(401).json({
        success: false,
        msg: "This is not a creator account",
      });
  }
};

module.exports = { creatorSignInController };

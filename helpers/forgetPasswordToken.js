const JWT = require("jsonwebtoken");

const forgetPasswordToken = (userId, email) => {
  const secret = userId + "_" + email + "_" + new Date().getTime();
  return JWT.sign({ userId, email }, secret, { expiresIn: "1h" });
};

module.exports = forgetPasswordToken;

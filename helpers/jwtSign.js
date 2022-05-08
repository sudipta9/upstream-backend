const JWT = require("jsonwebtoken");

const signToken = (userId) => {
  return JWT.sign(
    {
      iss: "upstream",
      userId,
    },
    process.env.JWTKey,
    { expiresIn: "1w" }
  );
};

module.exports = { signToken };

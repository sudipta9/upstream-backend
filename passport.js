const passport = require("passport");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("./models/user.model");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWTKey,
    },
    (payload, next) => {
      User.findById({ _id: payload.userId }, (err, user) => {
        if (err) return next(err);
        if (user) {
          const { _id, email, role } = user;
          const userData = {_id, email, role}
          return next(null, userData);
        }
        else return next(null, false);
      });
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, next) => {
      User.findOne({ email }, (err, user) => {
        if (err) return next(err);
        if (!user) return next(null, false);
        user.comparePassword(password, next);
      });
    }
  )
);

module.exports = passport;

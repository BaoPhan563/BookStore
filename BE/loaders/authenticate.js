var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user");
var JwtStratergy = require("passport-jwt").Strategy; //dùng để xác thực jwt
var ExtractJwt = require("passport-jwt").ExtractJwt; //dùng để trích xuất jwt từ request
var jwt = require("jsonwebtoken"); //dùng để tạo, xác thực token

var config = require("../configs/config");
passport.use(new LocalStrategy(User.authenticate())); //tác dụng: xác thực user, password, và gọi hàm authenticate() từ passport-local-mongoose
passport.serializeUser(User.serializeUser()); //tác dụng: mã hóa user
passport.deserializeUser(User.deserializeUser()); //tác dụng: giải mã user

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, { expiresIn: 86400 }); //tạo token
};

var opts = {}; // options
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //trích xuất jwt từ request
opts.secretOrKey = config.secretKey; //secret key

exports.jwtPassport = passport.use(
  //sử dụng jwt
  new JwtStratergy(opts, async (jwt_payload, done) => {
    //jwt_payload: thông tin được mã hóa trong token
    console.log("JWT Payload: ", jwt_payload);

    try {
      const user = await User.findOne({ _id: jwt_payload._id }); //tìm user trong database
      if (user) {
        //nếu tìm thấy user
        return done(null, user);
      } else {
        //nếu không tìm thấy user
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false }); //xác thực user

exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    return next();
  } else {
    const err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};

var googleStrategy = require("passport-google-oauth2").Strategy;

exports.googlePassport = passport.use(
  new googleStrategy(
    {
      clientID: config.web.client_id,
      clientSecret: config.web.client_secret,
      callbackURL: config.web.redirect_uris,
      passReqToCallback: true,
    },
    (request, accesstoken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            user = new User({ username: profile.displayName });
            user.googleId = profile.id;
            user.fullname = profile.displayName;
            user.email = profile.emails[0].value;
            user.save().then((user) => {
              return done(null, user);
            });
          }
        })
        .catch((err) => {
          return done(err, false);
        });
    }
  )
);

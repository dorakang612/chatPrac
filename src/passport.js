import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (username, password, done) {
      User.findOne({ email: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "등록되지 않은 계정입니다." });
        }
        if (user.password !== password) {
          return done(null, false, {
            message: "비밀번호가 일치하지 않습니다.",
          });
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

passport.deserializeUser(function (email, done) {
  User.findOne({ email: email }, function (err, user) {
    done(err, user);
  });
});

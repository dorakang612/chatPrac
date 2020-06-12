import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (username, password, done) => {
      User.findOne({ email: username }, async (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "등록되지 않은 계정입니다." });
        }
        const checkPW = await bcrypt.compare(password, user.password);
        if (!checkPW) {
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

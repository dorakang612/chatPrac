import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (username, password, done) {
      console.log(`LocalStrategy : ${username} , ${password}`);
      User.findOne({ email: username }, function (err, user) {
        if (err) {
          console.log("에러 발생");
          return done(err);
        }
        if (!user) {
          console.log("로그인 실패 - 등록되지 않은 계정");
          return done(null, false, { message: "Incorrect username." });
        }
        if (user.password !== password) {
          console.log(
            `로그인 실패 - ${user.password} & ${password} 비밀 번호 불일치`
          );
          return done(null, false, { message: "Incorrect password." });
        }
        console.log("로그인 성공");
        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log("serializeUser : ", user);
  done(null, user.email);
});

passport.deserializeUser(function (email, done) {
  console.log("deserializeUser : ", email);
  User.findOne({ email: email }, function (err, user) {
    done(err, user);
  });
});

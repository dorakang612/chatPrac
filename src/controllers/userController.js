import routes from "../routes";
import User from "../models/user";

import passport from "passport";

export const getLogin = (req, res) => {
  res.render("login", { title: "로그인", error: req.flash("error") });
};

// passport의 local strategy를 사용해서 로그인을 진행합니다.
export const postLogin = passport.authenticate("local", {
  successRedirect: routes.home,
  failureRedirect: routes.login,
  failureFlash: true,
});

export const getLogout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

// 사용자 등록화면 전송 미들웨어입니다.
export const getJoin = (req, res) => {
  res.render("joinUser", { title: "사용자 등록" });
};

// 사용자 등록 정보를 저장하는 미들웨어입니다.
export const postJoin = async (req, res, next) => {
  const {
    body: { email, inAppName, password, password2 },
  } = req;

  if (password !== password2) {
    res.render("joinUser", { error: "비밀번호를 다시 확인해 주세요." });
  } else {
    try {
      const user = new User({
        email: email,
        inAppName: inAppName,
        password: password,
      });

      const checkUser = User.findOne({ email: user.email });
      if (checkUser) {
        return res.render("joinUser", { error: "이미 등록된 사용자입니다." });
      }

      req.session.email = user.email;
      req.session.inAppName = user.inAppName;
      await user.save();
      res.redirect(`${routes.home}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
};

// 사용자 목록을 가져오는 미들웨어입니다.
export const getUserList = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.render("usersList", { users, title: "사용자 목록" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

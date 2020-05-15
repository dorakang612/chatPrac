import routes from "../routes";
import User from "../models/user";

// 사용자 등록화면 전송 미들웨어입니다.
export const getJoin = (req, res) => {
  res.render("joinUser", { title: "사용자 등록" });
};

// 사용자 등록 정보를 저장하는 미들웨어입니다.
export const postJoin = async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      inAppName: req.body.inAppName,
    });
    req.session.email = user.email;
    req.session.inAppName = user.inAppName;
    await user.save();
    res.redirect(`${routes.home}`);
  } catch (error) {
    console.error(error);
    next(error);
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

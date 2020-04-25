const express = require("express");

// Schema를 가져옵니다.
const User = require("../models/user");
const Room = require("../models/room");

const router = express.Router();

router.get("/", (req, res) => {
  res.locals.title = "Node Chat";
  res.render("index");
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get("/enrollUser", (req, res) => {
  res.render("enrollUser", { title: "사용자 등록" });
});

router.post("/enrollUSer", async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      inAppName: req.body.inAppName,
    });
    const newUser = await user.save();
    res.redirect("/users");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.render("users", { users, title: "사용자 목록" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

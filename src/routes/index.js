// const express = require("express");
import express from "express";

// Schema를 가져옵니다.
// const User = require("../models/user");
// const Room = require("../models/room");

import User from "../models/user";
import Room from "../models/room";

const router = express.Router();

// localhost:3000/ 으로 접속시 처리할 라우터
router.get("/", async (req, res) => {
  if (!req.session.inAppName) {
    res.redirect("/enrollUser");
  } else {
    try {
      const rooms = await Room.find({});
      res.render("main", { rooms, title: "Node 채팅방 목록" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
});

// localhost:3000/enrollUser 으로 접속시 처리할 라우터
router.get("/enrollUser", (req, res) => {
  res.render("enrollUser", { title: "사용자 등록" });
});

// localhost:3000/enrollUser에서 사용자 정보를 입력하고 제출한 경우 처리할 라우터
router.post("/enrollUSer", async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      inAppName: req.body.inAppName,
    });
    req.session.email = user.email;
    req.session.inAppName = user.inAppName;
    await user.save();
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3000/users 로 접속시 사용자 목록을 보여줄 라우터
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.render("users", { users, title: "사용자 목록" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3000/enrollRoom으로 접속시 채팅방 등록화면을 보여줄 라우터
router.get("/enrollRoom", (req, res) => {
  res.render("enrollRoom", { title: "채팅방 등록" });
});

// localhost:3000/enrollRoom에서 채팅방의 설정을 보내면 처리할 라우터
router.post("/enrollRoom", async (req, res, next) => {
  try {
    const room = new Room({
      roomName: req.body.roomName,
      host: req.session.inAppName,
      password: req.body.password,
    });
    const newRoom = await room.save();

    const io = req.app.get("io");
    io.of("/room").emit("newRoom", newRoom);
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3000/room/:id 로 접속, 즉 특정 채팅방으로 접속시에 동작할 라우터입니다.
router.get("/room/:id", async (req, res, next) => {
  try {
    // 해당 채팅방에 대한 정보를 찾습니다.
    const room = await Room.findOne({ _id: req.params.id });

    // 방의 존재 여부를 확인합니다.
    if (!room) {
      return res.redirect("/");
    }

    // 방의 비밀번호를 알맞게 입력했는지 확인합니다.
    if (room.password && room.password !== req.query.password) {
      return res.redirect("/");
    }

    // 채팅방에 참여하면 사용자의 이메일과 inAppName을 참여자 목록에 추가합니다.
    const user = await User.findOne({ inAppName: req.session.inAppName });
    const participant = { email: user.email, inAppName: user.inAppName };
    await Room.update(room, { $push: { participants: participant } });

    // 위의 모든 if문을 거치면 chat화면을 렌더링 합니다.
    return res.render("chat", {
      room,
      title: room.roomName,
      user: req.session.inAppName,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 채팅방에 대한 삭제 요청이 이루어지면 동작하는 라우터 입니다.
router.delete("/room/:id", async (req, res) => {
  try {
    await Room.remove({ _id: req.params.id });
    res.send("ok");
    setTimeout(() => {
      req.app.get("io").of("/room").emit("removeRoom", req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 채팅방 내에서 채팅을 보내면 동작하는 라우터 입니다.
router.post("/room/:id/chat", async (req, res, next) => {
  const date = new Date();
  const chatDate = `${date.getFullYear()}.${
    date.getMonth() + 1
  }.${date.getDate()}.${
    date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
  const message = {
    user: req.session.inAppName,
    chat: req.body.chat,
    date: chatDate,
  };

  // 채팅 내역을 DB에 저장합니다.
  await Room.update({ _id: req.params.id }, { $push: { chats: message } });

  req.app.get("io").of("/chat").to(req.params.id).emit("chat", message);
  res.send("ok");
});

// module.exports = router;
export default router;

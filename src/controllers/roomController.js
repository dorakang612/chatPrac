import routes from "../routes";
import User from "../models/user";
import Room from "../models/room";

export const home = async (req, res) => {
  if (!req.user) {
    res.redirect("/login");
  } else {
    console.log("로그인 성공 정보 : ", req.user);
    try {
      const rooms = await Room.find({});
      res.render("main", {
        rooms,
        title: "채팅방 목록",
        error: req.flash("error"),
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
};

// 채팅방 생성화면 전송 미들웨어입니다.
export const getCreateRoom = (req, res) => {
  res.render("createRoom", { title: "채팅방 생성" });
};

// 채팅방의 생성 정보를 토대로 저장하는 미들웨어입니다.
export const postCreateRoom = async (req, res, next) => {
  try {
    const room = new Room({
      roomName: req.body.roomName,
      host: req.user.inAppName,
      password: req.body.password,
    });
    const newRoom = await room.save();

    const io = req.app.get("io");
    io.of("/room").emit("newRoom", newRoom);
    res.redirect(
      `${routes.roomDetail(newRoom._id)}?password=${req.body.password}`
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 채팅방 입장 미들웨어입니다.
export const getRoomDetail = async (req, res, next) => {
  try {
    // 해당 채팅방에 대한 정보를 찾습니다.
    const room = await Room.findOne({ _id: req.params.id });

    // 방의 존재 여부를 확인합니다.
    if (!room) {
      req.flash("error", "해당 방이 존재하지 않습니다.");
      return res.redirect(`${routes.home}`);
    }

    // 방의 비밀번호를 알맞게 입력했는지 확인합니다.
    if (room.password && room.password !== req.query.password) {
      req.flash("error", "비밀번호가 일치하지 않습니다.");
      return res.redirect(`${routes.home}`);
    }

    // 채팅방에 참여하면 사용자의 이메일과 inAppName을 참여자 목록에 추가합니다.
    const user = await User.findOne({ inAppName: req.user.inAppName });
    const participant = { email: user.email, inAppName: user.inAppName };
    await Room.update(room, { $push: { participants: participant } });

    // 위의 모든 if문을 거치면 chat화면을 렌더링 합니다.
    return res.render("chattingRoom", {
      room,
      title: room.roomName,
      user: req.user.inAppName,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// 채팅방 삭제 미들웨어입니다.
export const deleteRoomDetail = async (req, res) => {
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
};

// 채팅 전송 미들웨어입니다.
export const postChat = async (req, res, next) => {
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
};

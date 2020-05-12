// const SocketIO = require("socket.io");
// const axios = require("axios");

import SocketIO from "socket.io";
import axios from "axios";

// module.exports =
const webSocket = (server, app, sessionMidleware) => {
  const io = new SocketIO(server, { path: "/socket.io" }); // express의 서버를 인자로 받아와 연결해줍니다. 두 번째 인자로 서버에 대한 옵션을 줄 수 있는데, 현재 사용한 것은 client와 연결할 수 있는 경로입니다.

  // express 앱 내에서, app.get(io)를 통해 io객체를 사용할 수 있습니다.
  app.set("io", io);

  // room, chat 네임스페이스를 생성합니다.
  const room = io.of("/room");
  const chat = io.of("/chat");

  // io.use 메서드를 이용해서 미들웨어를 장착합니다. 모든 웹 소켓 연결 시마다 실행합니다. 세션 미들웨어에 요청 객체, 응답 객체, next 함수를 인자로 넣어주면됩니다.
  io.use((socket, next) => {
    sessionMidleware(socket.request, socket.request.res, next);
  });

  // 방 목록을 확인하는 화면의 room 네임스페이스 접속시 socket의 동작입니다.
  room.on("connection", (socket) => {
    console.log("room 네임스페이스에 접속");
    socket.on("disconnect", () => {
      console.log("room 네임스페이스 접속 해제");
    });
  });

  // 채팅방 입장시 chat 네임스페이스로 연결되며 그 때의 socket의 동작입니다.
  chat.on("connection", (socket) => {
    console.log("chat 네임스페이스 접속");

    // 요청을 가져 분석해서, 방의 ID를 알아내는 부분입니다.
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const roomId = referer
      .split("/")
      [referer.split("/").length - 1].replace(/\?.+/, "");

    // chat 네임스페이스 내부에서, join 메서드를 이용해 해당 채팅방의 room으로 접속합니다.
    socket.join(roomId);
    socket.to(roomId).emit("join", {
      user: "system",
      chat: `${req.session.inAppName} 님이 입장하셨습니다.`,
    });

    // 연결이 끊겼을 때 방에 남은 인원을 구해서 0명이면 방에 대한 제거 요청을 보냅니다.
    socket.on("disconnect", () => {
      console.log("chat 네임스페이스 접속 해제");
      socket.leave(roomId);
      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;
      if (userCount === 0) {
        axios
          .delete(`http://localhost:3000/room/${roomId}`)
          .then(() => {
            console.log("방 제거 요청 성공");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        socket.to(roomId).emit("exit", {
          user: "system",
          chat: `${req.session.inAppName}님이 퇴장하셨습니다.`,
        });
      }
    });
  });
};

export default webSocket;

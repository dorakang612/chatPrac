const SocketIO = require("socket.io");

module.exports = (server, app, sessionMidleware) => {
  const io = new SocketIO(server, { path: "/socket.io" }); // express의 서버를 인자로 받아와 연결해줍니다. 두 번째 인자로 서버에 대한 옵션을 줄 수 있는데, 현재 사용한 것은 client와 연결할 수 있는 경로입니다.

  // express 앱 내에서, app.get(io)를 통해 io객체를 사용할 수 있습니다.
  app.set("io", io);

  // io.use 메서드를 이용해서 미들웨어를 장착합니다. 모든 웹 소켓 연결 시마다 실행합니다. 세션 미들웨어에 요청 객체, 응답 객체, next 함수를 인자로 넣어주면됩니다.
  io.use((socket, next) => {
    sessionMidleware(socket.request, socket.request.res, next);
  });

  io.on("connection", (socket) => {
    console.log(`A User Connected, SocketID : ${socket.id}`);
    socket.broadcast.emit(
      "broadcast_intro",
      `System Message - ${socket.id} entered room.`
    );

    socket.on("disconnect", function () {
      console.log(`User ${socket.id} left room.`);
    });

    socket.on("chat message", (msg) => {
      console.log(`${socket.id} : ${msg}`);
      io.emit("chat message", `${socket.id} :  ${msg}`);
    });
  });
};

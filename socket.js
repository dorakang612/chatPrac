const SocketIO = require("socket.io");

module.exports = (server) => {
  const io = new SocketIO(server, { path: "/socket.io" }); // express의 서버를 인자로 받아와 연결해줍니다. 두 번째 인자로 서버에 대한 옵션을 줄 수 있는데, 현재 사용한 것은 client와 연결할 수 있는 경로입니다.

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

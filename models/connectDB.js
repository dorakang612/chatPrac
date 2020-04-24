const mongoose = require("mongoose");

const { MONGODB_USER, MONGODB_PW, NODE_ENV } = process.env;
const MONGO_URL = `mongodb://localhost:27017/chatPrac`;

module.exports = () => {
  const connect = () => {
    if (NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }
    mongoose.connect(
      MONGO_URL,
      {
        authSource: "admin",
        user: MONGODB_USER,
        pass: MONGODB_PW,
        useNewUrlParser: true, // mongoDB Driver가 현재 문자열 분석기를 사용하지 않게 되었을 때 예전에 사용하던 것을 이용하게 하기 위한 옵션입니다. 이 옵션은 연결에 방해되지 않는한 항상 true로 둡니다.
        useUnifiedTopology: true, // MongoDB Driver가 새로운 연결 관리 엔진을 사용하도록 허락하는 옵션입니다. 현재 연결을 유지해야하는 경우가 아니라면 꼭 true로 두도록합니다.
      },
      (error) => {
        if (error) {
          console.log("몽코디비 연결 에러", error);
        } else {
          console.log("몽고디비 연결 성공");
        }
      }
    );
  };

  connect();

  mongoose.connection.on("error", (error) => {
    console.error("몽고디비 연결 에러", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도 합니다.");
    connect();
  });
};

import mongoose from "mongoose";

const { MONGODB_USER, MONGODB_PW, NODE_ENV } = process.env;
const MONGO_URL = `mongodb://localhost:27017/chatPrac`;

const connectDB = () => {
  // MongoDB에 연결하는 함수를 선언합니다.
  const connect = () => {
    // Node의 환경이 개발환경이 아니라면 쿼리내용을 콘솔을 통해 보도록합니다.
    if (NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }
    // Mongoose와 MongoDB를 연결하는 부분입니다. 접속을 시도하는 주소가 MONGO_URL, 인증을 할 때 필요한 정보는 옵션으로 부여했습니다.
    mongoose.connect(
      MONGO_URL,
      {
        authSource: "admin",
        user: MONGODB_USER,
        pass: MONGODB_PW,
        useNewUrlParser: true, // mongoDB Driver가 현재 문자열 분석기를 사용하지 않게 되었을 때 예전에 사용하던 것을 이용하게 하기 위한 옵션입니다. 이 옵션은 연결에 방해되지 않는한 항상 true로 둡니다.
        useUnifiedTopology: true, // MongoDB Driver가 새로운 연결 관리 엔진을 사용하도록 허락하는 옵션입니다. 현재 연결을 유지해야하는 경우가 아니라면 꼭 true로 두도록합니다.
      },
      // 연결 상태를 확인하는 부분입니다.
      (error) => {
        if (error) {
          console.log("몽코디비 연결 에러", error);
        } else {
          console.log("몽고디비 연결 성공");
        }
      }
    );
  };

  // 위에서 선언한 DB연결 함수를 실행합니다.
  connect();

  // 몽고디비와 연결에 에러가 발생하면 실행되는 함수입니다.
  mongoose.connection.on("error", (error) => {
    console.error("몽고디비 연결 에러", error);
  });

  // 몽고디비와 연결이 끊기면 이를 알리고 다시 연결을 시도합니다.
  mongoose.connection.on("disconnected", () => {
    console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도 합니다.");
    connect();
  });

  // user와 room 스키마를 연결하는 부분입니다.
  require("./user");
  require("./room");
};

export default connectDB;

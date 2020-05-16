// router를 생성하기 위해 express를 불러옵니다.
import express from "express";

// 라우터의 주소들을 사용하기 위해 불러옵니다.
import routes from "../routes";

// 글로벌 라우터에서 사용할 채팅방에 대한 미들웨어들을 가져옵니다.
import {
  getRoomDetail,
  deleteRoomDetail,
  postChat,
} from "../controllers/roomController";

const roomRouter = express.Router();

// 채팅방 입장을 처리
roomRouter.get(routes.roomDetail(), getRoomDetail);

// 채팅방 삭제 요청 처리
roomRouter.delete(routes.roomDetail(), deleteRoomDetail);

// 채팅 송신 처리
roomRouter.post(routes.sendChat(), postChat);

export default roomRouter;

// router를 생성하기 위해 express를 불러옵니다.
import express from "express";

// 라우터의 주소들을 사용하기 위해 불러옵니다.
import routes from "../routes";

// 글로벌 라우터에서 사용할 사용자와 채팅방에 대한 미들웨어들을 가져옵니다.
import { getJoin, postJoin } from "../controllers/userController";
import {
  home,
  getCreateRoom,
  postCreateRoom,
} from "../controllers/roomController";

const globalRouter = express.Router();

// 홈 화면으로 접속 처리
globalRouter.get(routes.home, home);

// 사용자 등록 처리
globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, postJoin);

// 채팅방 생성 처리
globalRouter.get(routes.create, getCreateRoom);
globalRouter.post(routes.create, postCreateRoom);

export default globalRouter;

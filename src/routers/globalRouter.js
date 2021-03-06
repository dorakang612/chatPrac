// router를 생성하기 위해 express를 불러옵니다.
import express from "express";

// 라우터의 주소들을 사용하기 위해 불러옵니다.
import routes from "../routes";

// 글로벌 라우터에서 사용할 사용자와 채팅방에 대한 미들웨어들을 가져옵니다.
import {
  getLogin,
  postLogin,
  getLogout,
  getJoin,
  postJoin,
} from "../controllers/userController";
import {
  home,
  getCreateRoom,
  postCreateRoom,
} from "../controllers/roomController";
import { isLoggedIn, isNotLoggedIn } from "../middlewares";

const globalRouter = express.Router();

// 홈 화면으로 접속 처리
globalRouter.get(routes.home, home);

//로그인, 로그아웃 처리
globalRouter.get(routes.login, isNotLoggedIn, getLogin);
globalRouter.post(routes.login, isNotLoggedIn, postLogin);
globalRouter.get(routes.logout, isLoggedIn, getLogout);

// 사용자 등록 처리
globalRouter.get(routes.join, isNotLoggedIn, getJoin);
globalRouter.post(routes.join, isNotLoggedIn, postJoin);

// 채팅방 생성 처리
globalRouter.get(routes.create, isLoggedIn, getCreateRoom);
globalRouter.post(routes.create, isLoggedIn, postCreateRoom);

export default globalRouter;

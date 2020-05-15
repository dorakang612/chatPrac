// router를 생성하기 위해 express를 불러옵니다.
import express from "express";

// 라우터의 주소들을 사용하기 위해 불러옵니다.
import routes from "../routes";

// 글로벌 라우터에서 사용할 사용자에 대한 미들웨어들을 가져옵니다.
import { getUserList } from "../controllers/userController";

const userRouter = express.Router();

// 사용자 목록 요청 처리
userRouter.get(routes.userList, getUserList);

export default userRouter;

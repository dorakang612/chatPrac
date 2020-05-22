// Global
const HOME = "/";
const CREATE = "/create"; // chatting room 생성
const JOIN = "/join"; // user 가입
const LOGIN = "/login"; // 로그인
const LOGOUT = "/logout"; // 로그아웃

// Users
const USERS = "/users";
const USER_DETAIL = "/:id";
const USER_LIST = "/list";

// Chatting Room
const ROOMS = "/rooms";
const ROOM_DETAIL = "/:id";
const SEND_CHAT = "/:id/chat";

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  create: CREATE,
  users: USERS,
  userDetail: (id) => {
    if (id) {
      return `/users/${id}`;
    } else {
      return USER_DETAIL;
    }
  },
  userList: USER_LIST,
  rooms: ROOMS,
  roomDetail: (id) => {
    if (id) {
      return `/rooms/${id}`;
    } else {
      return ROOM_DETAIL;
    }
  },
  sendChat: (id) => {
    if (id) {
      return `${id}/chat`;
    } else {
      return SEND_CHAT;
    }
  },
};

export default routes;

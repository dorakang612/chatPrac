# ES6 기준 Express Chatting 앱 만들기

1. chatPrac이라는 폴더를 만듭니다.

2. package.json을 생성합니다.

```cmd
npm init
```

3. 필요한 모듈을 설치합니다.

```cmd
>npm i [package_name]
```

- express : 서버프레임워크
- cookie-parser : 쿠키 해석 미들웨어
- express-session : 세션 관리용 미들웨어
- mongoose : DB연결 모듈
- morgan : 요청에 대한 정보 기록 미들웨어
- socket.io : 웹 소켓 통신을 위한 모듈
- dotenv : 환경 변수 관리를 위한 모듈입니다.
- pug : 탬플릿 엔진이되는 모듈입니다.

4. express 프로젝트 구조를 잡습니다.

```
chatPrac
 ㄴpublic // 클라이언트에서 접근 할 수 있는 폴더입니다.
   ㄴimages
   ㄴjavascript
   ㄴstyles
 ㄴmodels // DB에 관한 스키마와 DB연결 코드가 있는 폴더입니다.
 ㄴroutes // 라우터들이 있는 폴더입니다.
 ㄴviews // 탬플릿들이 있는 폴더입니다.
 ㄴapp.js // 프로젝트의 시작점이 되는 파일입니다.
 ㄴpackage.json
 ㄴ.env
 ㄴreadme.md
```

5. 초기 서버 설정을 합니다.

- app.js : 서버 설정을 합니다.
- views : express 서버 실행시 진입할 화면들입니다.
- routes : express 서버로 접속시 해당 주소에 맞는 탬플릿을 전달해줄 라우터입니다.

6. socket.js, chat.pug 생성

웹 소켓을 사용하기 위한 소스코드를 작성합니다.

7. MongoDB를 사용하기 위한 코드 추가

- models/user.js : 사용자 스키마
- models/room.js : 채팅방 스키마
- models/connect.js : 몽고디비와 연결하는 코드

8. User와 Room 등록화면 및 코드 작성

- views/enrollUser.pug : 사용자를 등록하는 화면입니다.
- views/enrollRoom.pug : 채팅방을 등록하는 화면입니다.
- routes/index.js : request에 따라 정보들을 DB에 저장하도록 유도합니다.
- views/users.pug : 등록된 유저들의 inAppName들을 확인합니다.
- views/rooms.pug : 등록된 채팅방의 정보들을 확인합니다.

9. views/rooms.pug를 통해 채팅방 입장 추가

- socket.js : 방목록들을 볼 수 있는 rooms를 room 네임스페이스에 두고, 채팅방으로 입장시 chat 네임스페이스에 연결되도록 유지합니다. axios를 이용해서 HTTP 요청을 보내도록 합니다.
- views/rooms.pug -> main.pug : 현재 등록된 방을 보여주고 있는데, 여기에 입장 버튼을 추가하여 chat.pug가 랜더링되도록 합니다.
- views/chat.pug : 메세지를 보내는 form 태그의 action 속성에 /chat을 추가하여 채팅 활성화합니다.
- routes/index.js : 처음 접속시 세션에 inAppName이 있는지 확인하며, 없을 경우 enrollUser로 이동합니다. enrollUser에서 사용자 등록이 진행되며, 등록 완료시 채팅방 목록을 볼 수 있는 화면으로 넘어갑니다. 방마다 입장 버튼을 누르면 해당 방의 chatting을 보여주도록 유도합니다. 또한 새로운 채팅방이 생기거나 혹은 기존의 채팅방이 없어지면 이를 바로 반영하여 화면 구성 또한 바뀝니다.

> 현재 사용자를 등록하고 다시 접속시에는 DB에 저장된 사용자를 지운 뒤 동일 이메일과 이름으로 접속 가능합니다.

10. 채팅 보낸 시각 추가

- routes/index.js : Date()를 이용해 채팅을 보낸 시각 정보를 생성합니다.
- views/chat.pug : 시간 정보를 보여 줍니다.

11. 채팅 참여자와 채팅 내역 DB에 추가

- routes/index.js : participants와 chats에 데이터를 push 해줍니다.

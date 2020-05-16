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
 ㄴpublic                 // 클라이언트에서 접근 할 수 있는 폴더입니다.
   ㄴimages
   ㄴjavascript
   ㄴstyles
 ㄴmodels                 // DB에 관한 스키마와 DB연결 코드가 있는 폴더입니다.
 ㄴroutes                 // 라우터들이 있는 폴더입니다.
   ㄴindex.js             // 진입점의 라우터입니다.
 ㄴviews                  // 탬플릿들이 있는 폴더입니다.
 ㄴapp.js                 // 프로젝트의 시작점이 되는 파일입니다.
 ㄴpackage.json           // 프로젝트의 명세서입니다. 프로젝트 이름과 버전, 사용 모듈 등의 정보들이 담겨있습니다.
 ㄴ.env                   // 환경변수, 비밀번호와 같이 보호되어야할 정보들이 담긴 파일입니다.
 ㄴreadme.md              // 프로젝트의 설명 등을 적어둔 파일입니다.
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

12. 채팅방 입장시 이전의 채팅 내역을 보여줍니다.

- views/chat.pug : routes/index.js에서 room/:id를 요청할 때 이에 대한 응답으로 room에 대한 정보를 넘겨주기 때문에, room의 chats 컬렉션에서 채팅들을 추출하여 보여줍니다.

13. 브라우저의 탭을 닫아도 세션을 유지합니다.

- app.js : sessionMidleware의 설정 중 saveUninitialized을 true로 바꿉니다.

14. ES6 모듈 운용 방식을 위해서 babel을 설치하고, .babelrc파일을 만들어 preset을 지정해줍니다.

```cmd
>npm i --save-dev @babel/core @babel/cli @babel/preset-env @babel/node
```

- @babel/core : 바벨의 주기능들을 포함하고 있는 모듈입니다.
- @babel/cli : 명령 프롬프트 혹은 터미널에서 babel 명령어를 사용할 수 있습니다.
- @babel/preset-env : 실행하는 환경에 따라 자동으로 해당 환경의 최신 JavaScript 문법을 적용하여 변환해주도록 유도하는 모듈입니다.
- @babel/node : @babel/cli 에서 독립된 모듈로, Node.js CLI와 동일한 동작을 하지만 추가적으로 실행전에 babel의 preset들과 plugin들을 고려하여 파일을 변환 한뒤 실행합니다.

.babelrc

```
{
  "presets": ["@babel/preset-env"]
}
```

preset-env를 설정함으로써 자동으로 알맞은 변환 형식을 찾습니다.

15. 프로젝트의 구조를 변경합니다.

```
chatPrac
ㄴpublic
  ㄴimages
  ㄴjavascript
  ㄴstyles
ㄴsrc
  ㄴ models
    ㄴconnectDB.js
    ㄴroom.js
    ㄴuser.js
  ㄴroutes
    ㄴindex.js
  ㄴapp.js
  ㄴsocket.js
ㄴviews
ㄴ.babelrc
ㄴ.env
ㄴ.gitignore
ㄴpackage-lock.json
ㄴpackage.json
ㄴreadme.md
```

src에 주요 javascript 파일들을 넣습니다. 이유는 babel을 사용하여 변환을 할 때 한번에 처리하기 위해서입니다.

16. package.json에 script를 수정합니다.

```json
{
   ...
   "scripts": {
    "build": "babel src -d dist",
    "start": "npm run build && node dist/app.js",
    "start:dev": "nodemon --exec babel-node src/app.js"
  },
  ...
}
```

- build : src 디렉터리에 있는 파일을 변환하여, dist라는 파일에 저장합니다. -d 는 out-dir의 축약어로, 변환된 파일을 저장할 목적지를 지정할 때 사용합니다.
- start : build를 먼저 수행하고 후에 dist/app.js를 실행시킵니다.
- start:dev : 개발 시에 자동으로 수정사항이 생기면 재시작 시키기위해서 사용할 스크립트입니다. --exec은 nodemon의 옵션으로, 뒤에 나오는 스크립트를 수행합니다. babel-node src/app.js는 babel의 presets와 plugins를 고려하여 변환한 이후, node를 실행합니다.

평소 개발 시에는 npm run start:dev를 통해 실행시킵니다.

17. 라우터 분리

현재 routes/index.js에 집중적으로 실려있는 코드들을 각 기능별로 분리합니다.

- src/controllers : 사용자 관리 미들웨어와, 채팅방 관리 미들웨어들을 먼저 선언합니다. routes/index.js에서 user와 room에 관련된 코드들을 분리합니다.
- routes.js : 해당 서비스의 주소를 관리합니다. 모든 주소를 변수로 선언하여 할당한 뒤 라우터와 app.js에 적용합니다.
- routes -> routers : 라우터들을 관리하기 위해 파일명을 변경합니다.
- routers/globalRouter.js : 사용자 등록과 채팅방 생성 그리고 홈화면에 대한 라우터 입니다.
- routers/userRouter.js : 현재는 사용자 목록을 가져오는 것밖에 기능이 없지만, 추후 로그인을 구현한 뒤 사용자 정보를 수정하는 부분을 추가할 예정입니다.
- routers/roomRouter.js : 채팅방 이동과 채팅에 관한 처리를하는 라우터 입니다.
- views/, socket.js : 기존 form의 action과 버튼들 링크들의 주소를 새롭게 수정합니다.

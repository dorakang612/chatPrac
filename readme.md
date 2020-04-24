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

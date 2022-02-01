# Noom

Zoom clone using NodeJS, WebRTC and Websockets.

# #0 Introduction

## Requirements

- express, pug, app.get()
- package.json
- babel
- nodemon

## Setting Recap

1. Nodemon 설정: nodemon.json
   프로그램에 변경사항이 있을 때마다 서버를 재실행해주는 프로그램
   서버를 재시작하는 대신에 babel-node를 실행하는데 Babel은 우리가 작성한 코드를 일반 NodeJS코드로 컴파일 함
   bable-node를 실행하면 babel.confog.json으로 가서 preset을 실행 (babel.config.json)
   그 작업을 src/server.js에서 해준다. (라고 우리가 설정함)

2. server.js : src/server.js
   2-1. express를 import하고 express 어플리케이션을 구성함
   2-2. 여기에 view engine을 pug로 설정, view 디렉토리 설정
   2-3. frontend에거 구동될 코드 (public)에도 똑같은 작업
   2-3-1. 얘는 app.use 라고 되어 있는데 사용자에게 공개하는 부분을 말함 (유저가 볼 수 있는 폴더)
   2-3-2. 사용자가 /public으로 가면 이 폴더에 볼 수 있음
   2-4. render 이거는 우리 홈페이지로 이동 시 사용할 템플릿을 렌더해주는 거임. home.pug
   2-4-1. 그래서 home.pug로 이동하면 그에 대한 내용이 있음
   2-4-2. mvp css로 좀 덜 어글리하게 만들고
   2-4-3. /public/js/app.js를 import 해줌

# #1 Chat with websockets

## HTTP

- 모든 서버들이 작동하는 방식
- 유저가 request 보내면 서버가 response 받음
- stateless (backend가 user를 잊어버려 그냥 respond 주면 끝이고 request를 기다림)

## Websocket?

- 얘로 real-time 채팅,.. 이런 거 만들 수 있음
- 악수처럼 브라우저가 서버로 websocket request -> 서버가 accept하면 => connection establish
- 그 이후로는 closed 될 때까지 request/response 없이 자기 마음대로 메시지 주고 받을 수 있음

### ws

- npmjs.com/package/ws
- express는 http를 다루지. (http://localhost:PORT로 하잖아 우리가) 그런데 ws는 WebSocket임. 프로토콜이 다르다!
- 그래서 server.js에서 express도 쓰고 ws도 쓰는거지 두 개를 쓰는 거야 서로 대체하는 게 아니라

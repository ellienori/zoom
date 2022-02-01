import express from "express"; // express로 하는 일
import http from "http"; // ws를 사용하기 위함
import WebSocket from "ws";

const PORT = 3000;
const app = express(); // express application 구성

app.set("view engine", "pug"); // 1. Set the views using Pug
app.set("views", __dirname + "/views"); // 2. Tell express where the view template is
app.use("/public", express.static(__dirname+"/public")); // 3. Create public url (front-end) to share some files with users
app.get("/", (req, res) => res.render("home")); // 4. Create a route handler to render home.pug (src/views/home.pug)
app.get("/*", (req, res) => res.redirect("/")); // 어디로(/*) 이동해도 home(/)으로 가게

// 5. And listen
const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);
//app.listen(PORT, handleListen);

// 6. 나머지는 websocket에서 실시간으로 함

// ws를 사용하기 위해서 http 서버에 websocker server 둘다 연결
const server = http.createServer(app); // express app을 받아온다. 서버가 만들어짐
const wss = new WebSocket.Server({server}); // wss 연결하면 ws://localhost:${PORT}도 가능

// fake database for checking a connection with several browers.
const sockets = [];

// Socket은 연결된 broser 의미. 이제 이거를 frontend에서 연결해야지
wss.on("connection", (socket) => { // Listening for a event
  // scoket에 있는 메서드를 써보자. (wss에 있는 method가 아님)
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("Connection to Brower 💛");
  socket.on("close", () => console.log("Disconnection to Browser 💛❌"));
  socket.on("message", (message) => { // message.toString('utf-8')
    const messageObj = JSON.parse(message);
    switch (messageObj.type) {
      case "new_message":
        sockets.forEach(aSocket => aSocket.send(`${socket["nickname"]}: ${messageObj.payload}`));
        break;
      case "nickname":
        socket["nickname"] = messageObj.payload;
        break;
    }
  });
});

// http protocol과 websocket protocol 모두 공유
server.listen(PORT, handleListen);
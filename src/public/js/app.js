// socket == server
const socket = io();

const welcome = document.querySelector("#welcome");
const welcomeForm = welcome.querySelector("form");
const room = document.querySelector("#room");

let roomName;

room.hidden = true;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#message input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = ""; // clear form
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#nickname input");
  const value = input.value;
  socket.emit("nickname", value);
  input.value = ""; // clear form
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;

  const messageForm = room.querySelector("#message");
  messageForm.addEventListener("submit", handleMessageSubmit);

  const nicknameForm = room.querySelector("#nickname");
  nicknameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  // 우리는 메시지를 보낼 필요가 없고 (send) 그냥 event를 방출 (emit) 하면 돼
  // 여기서는 room 이라는 event를 emit 했고 그 뒤로 object 등의 arguments 보낼 수 있음
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = ""; // clear form
}

welcomeForm.addEventListener("submit", handleRoomSubmit);


socket.on("welcome", (user, count) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${count})`;
  addMessage(`🔔 ${user} joined!`);
});

socket.on("bye", (user, count) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${count})`;
  addMessage(`🔔 ${user} left!`);
});

socket.on("new_message", (msg, user) => {
  addMessage((`${user}: ${msg}`));
});

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";

  if(rooms.length === 0) {
    return;
  }
  
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});

/* the code when we use WebSocket
const socket = new WebSocket(`ws://${window.location.host}`);

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nicknameForm = document.querySelector("#nickname");

function makeMessage(type, payload) {
  const message = {type, payload};
  return JSON.stringify(message);
}

socket.addEventListener("open", () => {
  console.log("Connection to Server 💜");
})

// 새로운 메시지를 받으면 💻
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
})

socket.addEventListener("close", () => {
  console.log("Disconnection to Server 💜❌");
})

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");

  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  messageList.append(li);

  socket.send(makeMessage("new_message", input.value));
  input.value = ""; // clear form
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  // message에 종류가 2개 있어. nickname이랑 찐 message. 두 개를 구분하기 위해 json으로 넣을 거야.
  socket.send(makeMessage("nickname", input.value));
  input.value = ""; // clear form
}

messageForm.addEventListener("submit", handleSubmit);
nicknameForm.addEventListener("submit", handleNickSubmit);
*/
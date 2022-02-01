// socket == server
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
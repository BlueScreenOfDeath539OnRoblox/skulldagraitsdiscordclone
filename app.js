let userData = {};

function joinChat() {
  const name = document.getElementById("username").value.trim() || "Anon";
  const avatarInput = document.getElementById("avatar-picker");

  if (avatarInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = () => {
      userData = { name, avatar: reader.result };
      localStorage.setItem("minicord-user", JSON.stringify(userData));
      startChat();
    };
    reader.readAsDataURL(avatarInput.files[0]);
  } else {
    userData = { name, avatar: "https://i.imgur.com/U7xw5p0.png" };
    localStorage.setItem("minicord-user", JSON.stringify(userData));
    startChat();
  }
}

function startChat() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("chat-screen").style.display = "block";
  loadMessages();
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const text = input.value.trim();
  if (!text) return;

  const message = {
    sender: userData.name,
    avatar: userData.avatar,
    text,
    timestamp: new Date().toLocaleTimeString()
  };

  const messages = JSON.parse(localStorage.getItem("minicord-messages")) || [];
  messages.push(message);
  localStorage.setItem("minicord-messages", JSON.stringify(messages));
  input.value = "";
  displayMessage(message);
  showNotification(`${message.sender}: ${message.text}`);
}

function loadMessages() {
  const stored = JSON.parse(localStorage.getItem("minicord-messages")) || [];
  stored.forEach(displayMessage);
}

function displayMessage(msg) {
  const div = document.createElement("div");
  div.className = "message";

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = msg.avatar;

  const text = document.createElement("div");
  text.className = "text";
  text.innerHTML = `<strong>${msg.sender}</strong><br/>${msg.text}`;

  div.appendChild(avatar);
  div.appendChild(text);
  document.getElementById("messages").appendChild(div);
}

function showNotification(text) {
  if (Notification.permission === "granted") {
    new Notification(text);
  }
}

if (Notification.permission !== "granted") {
  Notification.requestPermission();

const saved = JSON.parse(localStorage.getItem("minicord-user"));
if (saved) {
  userData = saved;
  startChat();
}

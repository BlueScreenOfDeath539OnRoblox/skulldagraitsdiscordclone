let user = {};
let activeChannel = "general";

function joinChat() {
  const name = document.getElementById("username").value.trim() || "Guest";
  const avatarFile = document.getElementById("avatar-picker").files[0];

  if (avatarFile) {
    const reader = new FileReader();
    reader.onload = () => {
      user = { name, avatar: reader.result };
      localStorage.setItem("minicord-user", JSON.stringify(user));
      launchChat();
    };
    reader.readAsDataURL(avatarFile);
  } else {
    user = {
      name,
      avatar: "https://i.imgur.com/U7xw5p0.png"
    };
    localStorage.setItem("minicord-user", JSON.stringify(user));
    launchChat();
  }
}

function launchChat() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("chat-screen").style.display = "block";
  loadMessages(activeChannel);
}

function switchChannel(channel) {
  activeChannel = channel;
  document.getElementById("channel-name").textContent = `# ${channel}`;
  document.getElementById("messages").innerHTML = "";
  loadMessages(channel);
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const text = input.value.trim();
  if (!text) return;

  const message = {
    sender: user.name,
    avatar: user.avatar,
    text,
    timestamp: new Date().toLocaleTimeString()
  };

  const allMessages = JSON.parse(localStorage.getItem("minicord-messages")) || {};
  allMessages[activeChannel] = allMessages[activeChannel] || [];
  allMessages[activeChannel].push(message);

  localStorage.setItem("minicord-messages", JSON.stringify(allMessages));

  displayMessage(message);
  input.value = "";
}

function loadMessages(channel) {
  const allMessages = JSON.parse(localStorage.getItem("minicord-messages")) || {};
  const channelMessages = allMessages[channel] || [];
  channelMessages.forEach(displayMessage);
}

function displayMessage(msg) {
  const div = document.createElement("div");
  div.className = "message";

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = msg.avatar;

  const text = document.createElement("div");
  text.className = "text";
  text.innerHTML = `<strong>${msg.sender}</strong><span>${msg.text}</span>`;

  div.appendChild(avatar);
  div.appendChild(text);

  document.getElementById("messages").appendChild(div);
}

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

const saved = JSON.parse(localStorage.getItem("minicord-user"));
if (saved) {
  user = saved;
  launchChat();
}

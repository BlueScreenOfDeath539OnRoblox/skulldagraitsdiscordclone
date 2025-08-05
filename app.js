let messages = [];

function sendMessage() {
  const input = document.getElementById("message-input");
  const text = input.value.trim();
  if (!text) return;

  const message = {
    sender: "User",
    text: text,
    timestamp: new Date().toLocaleTimeString()
  };

  messages.push(message);
  localStorage.setItem("chat-messages", JSON.stringify(messages));
  input.value = "";

  displayMessage(message);
  showNotification(`${message.sender}: ${message.text}`);
}

function loadMessages() {
  const stored = JSON.parse(localStorage.getItem("chat-messages")) || [];
  messages = stored;
  stored.forEach(displayMessage);
}

function displayMessage(msg) {
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = `[${msg.timestamp}] ${msg.sender}: ${msg.text}`;
  document.getElementById("messages").appendChild(div);
}

function showNotification(text) {
  if (Notification.permission === "granted") {
    new Notification(text);
  }
}

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

window.onload = loadMessages;

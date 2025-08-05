let username = "";
let messages = [];

function joinChat() {
  username = document.getElementById('username').value || "Anon";
  document.getElementById('login-screen').style.display = "none";
  document.getElementById('chat-screen').style.display = "block";

  loadMessages();
}

function sendMessage() {
  const text = document.getElementById('message-input').value;
  if (!text) return;

  const message = {
    sender: username,
    text: text,
    timestamp: new Date().toLocaleTimeString()
  };
  
  messages.push(message);
  localStorage.setItem('chat-messages', JSON.stringify(messages));
  document.getElementById('message-input').value = "";

  displayMessage(message);
  showNotification(`${message.sender}: ${message.text}`);
}

function loadMessages() {
  const stored = JSON.parse(localStorage.getItem('chat-messages')) || [];
  messages = stored;
  stored.forEach(displayMessage);
}

function displayMessage(msg) {
  const div = document.createElement('div');
  div.className = "message";
  div.textContent = `[${msg.timestamp}] ${msg.sender}: ${msg.text}`;
  document.getElementById('messages').appendChild(div);
}

function showNotification(text) {
  if (Notification.permission === "granted") {
    new Notification(text);
  }
}

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

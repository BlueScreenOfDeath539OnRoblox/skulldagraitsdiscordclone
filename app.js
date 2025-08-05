const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app.firebaseio.com",
  projectId: "your-app",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let username = "";

function joinChat() {
  username = document.getElementById('username').value || "Anon";
  document.getElementById('login-screen').style.display = "none";
  document.getElementById('chat-screen').style.display = "block";
}

function sendMessage() {
  const msg = document.getElementById('message-input').value;
  db.ref("messages").push({
    sender: username,
    text: msg,
    timestamp: Date.now()
  });
  document.getElementById('message-input').value = "";
}

db.ref("messages").on("child_added", snapshot => {
  const msg = snapshot.val();
  const msgDiv = document.createElement('div');
  msgDiv.textContent = `${msg.sender}: ${msg.text}`;
  document.getElementById('messages').appendChild(msgDiv);

  // 🔔 Optional notification
  if (Notification.permission === "granted") {
    new Notification(`${msg.sender} says: ${msg.text}`);
  }
});

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

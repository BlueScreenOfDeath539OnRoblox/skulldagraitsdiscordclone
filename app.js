let currentUser = {};
let activeChannel = "general";
let theme = "dark";

// SHA-256 hashing utility
async function hash(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0")).join("");
}

// Sign-Up Logic
async function registerUser() {
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;
  const avatarFile = document.getElementById("signup-avatar").files[0];

  if (!username || !password) return alert("Fill in all fields");

  const users = JSON.parse(localStorage.getItem("minicord-users") || "{}");
  if (users[username]) return alert("Username taken");

  let avatar = "https://i.imgur.com/U7xw5p0.png";
  if (avatarFile) {
    const reader = new FileReader();
    reader.onload = async () => {
      avatar = reader.result;
      const hashedPass = await hash(password);
      users[username] = { password: hashedPass, avatar };
      localStorage.setItem("minicord-users", JSON.stringify(users));
      showLogin();
    };
    reader.readAsDataURL(avatarFile);
  } else {
    const hashedPass = await hash(password);
    users[username] = { password: hashedPass, avatar };
    localStorage.setItem("minicord-users", JSON.stringify(users));
    showLogin();
  }
}

function showLogin() {
  document.getElementById("signup-screen").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
}

// Login Logic
async function loginUser() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const users = JSON.parse(localStorage.getItem("minicord-users") || "{}");

  if (!users[username]) return alert("User not found");
  const hashedInput = await hash(password);
  if (users[username].password !== hashedInput) return alert("Incorrect password");

  currentUser = { name: username, avatar: users[username].avatar };
  localStorage.setItem("minicord-session", JSON.stringify(currentUser));
  launchChat();
}

function launchChat() {
  document.body.className = theme;
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("signup-screen").style.display = "none";
  document.getElementById("chat-screen").style.display = "flex";

  document.getElementById("user-info").textContent = `${currentUser.name}`;
  if (currentUser.name === "skulldagrait") {
    const adminLi = document.createElement("li");
    adminLi.textContent = "# admin-control";
    adminLi.onclick = () => switchChannel("admin-control");
    document.getElementById("channel-list").appendChild(adminLi);
  }

  loadMessages(activeChannel);
}

// Chat + Message
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
    sender: currentUser.name,
    avatar: currentUser.avatar,
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

// File Uploads
document.getElementById("file-input").addEventListener("change", function (e) {
  const files = [...e.target.files];
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      sendMessage(`[File Uploaded] ${file.name}: ${reader.result}`);
    };
    reader.readAsDataURL(file);
  });
});

// Settings Panel
function openSettings() {
  document.getElementById("settings-modal").style.display = "block";
}

function closeSettings() {
  document.getElementById("settings-modal").style.display = "none";
}

function changeTheme(e) {
  theme = e.target.value;
  document.body.className = theme;
}

async function changePassword() {
  const oldPass = document.getElementById("old-password").value;
  const newPass = document.getElementById("new-password").value;
  if (!oldPass || !newPass) return alert("Fill both fields");

  const users = JSON.parse(localStorage.getItem("minicord-users") || "{}");
  const hashedOld = await hash(oldPass);
  if (users[currentUser.name].password !== hashedOld) return alert("Old password wrong");

  users[currentUser.name].password = await hash(newPass);
  localStorage.setItem("minicord-users", JSON.stringify(users));
  alert("Password updated!");
}

// Enter key handler
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && document.getElementById("message-input") === document.activeElement) {
    sendMessage();
  }
});

// Logout
function logoutUser() {
  localStorage.removeItem("minicord-session");
  location.reload();
}

// Auto-login
const savedSession = JSON.parse(localStorage.getItem("minicord-session"));
if (savedSession) {
  currentUser = savedSession;
  launchChat();
}

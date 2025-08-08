function completeSignup() {
  const name = document.getElementById("usernameInput").value.trim();
  const avatar = document.getElementById("avatarInput").value.trim();

  if (!name || !avatar) return alert("Enter both name and avatar URL");

  localStorage.setItem("username", name);
  localStorage.setItem("avatar", avatar);

  document.getElementById("signupScreen").style.display = "none";
  document.getElementById("chatScreen").style.display = "block";

  startChat();
}

function startChat() {
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar");

  document.getElementById("usernameDisplay").textContent = username;
  document.getElementById("profilePic").src = avatar;

  const fileInput = document.getElementById("fileInput");
  const sendBtn = document.getElementById("sendBtn");
  const messageInput = document.getElementById("messageInput");
  const chatBox = document.getElementById("chatBox");

  sendBtn.onclick = sendMessage;
  messageInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  loadMessages();

  function sendMessage() {
    const msg = messageInput.value.trim();
    const file = fileInput.files[0];

    if (!msg && !file) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const fileURL = reader.result;
        const fileName = file.name;

        const message = {
          sender: username,
          avatar: avatar,
          text: msg,
          file: { name: fileName, url: fileURL }
        };

        saveMessage(message);
        displayMessage(message);

        messageInput.value = "";
        fileInput.value = "";
      };
      reader.readAsDataURL(file);
    } else {
      const message = {
        sender: username,
        avatar: avatar,
        text: msg
      };

      saveMessage(message);
      displayMessage(message);

      messageInput.value = "";
    }
  }

  function displayMessage({ sender, avatar, text, file }) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";

    const avatarImg = document.createElement("img");
    avatarImg.className = "avatar";
    avatarImg.src = avatar;

    const contentDiv = document.createElement("div");
    contentDiv.className = "content";

    const nameTag = document.createElement("strong");
    nameTag.textContent = sender;
    contentDiv.appendChild(nameTag);

    if (text) {
      const textNode = document.createElement("span");
      textNode.textContent = text;
      contentDiv.appendChild(textNode);
    }

    if (file) {
      const fileLink = document.createElement("a");
      fileLink.href = file.url;
      fileLink.download = file.name;
      fileLink.textContent = `📎 ${file.name}`;
      contentDiv.appendChild(fileLink);
    }

    msgDiv.appendChild(avatarImg);
    msgDiv.appendChild(contentDiv);
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function saveMessage(message) {
    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    messages.push(message);
    localStorage.setItem("messages", JSON.stringify(messages));
  }

  function loadMessages() {
    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    messages.forEach(displayMessage);
  }
}

// Auto-start if already signed up
if (localStorage.getItem("username") && localStorage.getItem("avatar")) {
  document.getElementById("signupScreen").style.display = "none";
  document.getElementById("chatScreen").style.display = "block";
  startChat();
}

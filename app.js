window.onload = function () {
  const authScreen = document.getElementById("authScreen");
  const chatScreen = document.getElementById("chatScreen");
  const signupBtn = document.getElementById("signupBtn");
  const usernameInput = document.getElementById("usernameInput");
  const avatarInput = document.getElementById("avatarInput");

  const usernameDisplay = document.getElementById("usernameDisplay");
  const profilePic = document.getElementById("profilePic");
  const chatBox = document.getElementById("chatBox");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const fileInput = document.getElementById("fileInput");

  // Load saved user
  const savedUsername = localStorage.getItem("username");
  const savedAvatar = localStorage.getItem("avatar");

  if (savedUsername && savedAvatar) {
    showChat(savedUsername, savedAvatar);
  }

  signupBtn.onclick = () => {
    const name = usernameInput.value.trim();
    const avatar = avatarInput.value.trim();
    if (!name || !avatar) return alert("Please enter both name and avatar URL");

    localStorage.setItem("username", name);
    localStorage.setItem("avatar", avatar);
    showChat(name, avatar);
  };

  function showChat(name, avatar) {
    authScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");
    usernameDisplay.textContent = name;
    profilePic.src = avatar;
    loadMessages();
  }

  sendBtn.onclick = sendMessage;
  messageInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const msg = messageInput.value.trim();
    const file = fileInput.files[0];
    const username = localStorage.getItem("username");
    const avatar = localStorage.getItem("avatar");

    if (!msg && !file) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const fileURL = reader.result;
        const fileName = file.name;
        if (!confirm(`Send ${fileName}?`)) return;

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
};

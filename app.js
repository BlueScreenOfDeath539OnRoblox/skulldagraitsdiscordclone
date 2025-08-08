window.onload = function () {
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar");
  if (username && avatar) {
    document.getElementById("usernameDisplay").textContent = username;
    document.getElementById("profilePic").src = avatar;
  }

  const fileInput = document.getElementById("fileInput");
  const sendBtn = document.getElementById("sendBtn");
  const messageInput = document.getElementById("messageInput");
  const chatBox = document.getElementById("chatBox");

  sendBtn.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const msg = messageInput.value.trim();
    const file = fileInput.files[0];

    if (!msg && !file) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const fileURL = reader.result;
        const fileName = file.name;
        if (!confirm(`Are you sure you want to send ${fileName}?`)) return;

        displayMessage({
          sender: username,
          avatar: avatar,
          text: msg,
          file: { name: fileName, url: fileURL }
        });

        messageInput.value = "";
        fileInput.value = "";
      };
      reader.readAsDataURL(file);
    } else {
      displayMessage({
        sender: username,
        avatar: avatar,
        text: msg
      });
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
};

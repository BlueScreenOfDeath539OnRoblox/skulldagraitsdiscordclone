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
    if (msg || fileInput.files.length > 0) {
      let confirmMsg = msg ? `Message: ${msg}` : "";
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        confirmMsg += `\nFile: ${file.name}`;
        if (!confirm(`Are you sure you want to send ${file.name}?`)) return;
      }

      const messageElement = document.createElement("div");
      messageElement.textContent = confirmMsg;
      chatBox.appendChild(messageElement);

      messageInput.value = "";
      fileInput.value = "";
    }
  }
};

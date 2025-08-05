<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MiniCord</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="login-screen">
    <h1>MiniCord</h1>
    <input type="text" id="username" placeholder="Enter your name" />
    <input type="file" id="avatar-picker" accept="image/*" />
    <button onclick="joinChat()">Enter Chat</button>
  </div>

  <div id="chat-screen" style="display:none;">
    <div class="container">
      <div class="sidebar">
        <h2>Servers</h2>
        <ul>
          <li onclick="switchChannel('general')"># general</li>
          <li onclick="switchChannel('memes')"># memes</li>
          <li onclick="switchChannel('dev')"># dev-chat</li>
        </ul>
      </div>
      <div class="chat-area">
        <div id="channel-name"># general</div>
        <div id="messages" class="messages"></div>
        <div class="input-bar">
          <input type="text" id="message-input" placeholder="Type your message..." />
          <button onclick="sendMessage()">Send</button>
        </div>
      </div>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>

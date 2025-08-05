document.getElementById("avatarInput").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById("avatarPreview").innerHTML =
      `<img src="${reader.result}" alt="Avatar Preview" class="avatar-preview"/>`;
  };
  reader.readAsDataURL(file);
});

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const avatar = document.getElementById("avatarPreview").querySelector("img").src;
  localStorage.setItem("username", username);
  localStorage.setItem("avatar", avatar);
  window.location.href = "index.html";
});

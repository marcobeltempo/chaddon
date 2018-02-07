function onSignIn(googleUser) {
  console.info("google login");
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  var socket = io.connect(document.location.origin);
  socket.on("news", function(data) {
    console.log(data);
  });
  var messageBar =
    '<form class="navbar-form" onSubmit="return false;"><label id="usernameLabel" class="col-2 col-form-label">Welcome, <a class="brand"></a></label><input class="span8" type="text" id="message" onkeydown="enterSend()" placeholder="Be nice"/><!--<input class="btn btn-primary span2" OnClick="myFunction()" type="button" id="sendGoogleLogin" value="Login" />*/--><input class="btn btn-primary span2" onclick="sendMessage()" type="button" id="send" value="Send" />';
  console.log("Full Name: " + profile.getName());
  var id_token = googleUser.getAuthResponse().id_token;
  var sendMessage = document.getElementById("sendMessageBar");

  sessionStorage.username = profile.getName();
  id_token = id_token.substring(0, 200);
  socket.emit("verifyUserGoogle", {
    username: profile.getName(),
    token: id_token
  });
  socket.on("verifySuccess", function(data) {
    console.info(
      "Username: " + data.username + " Token: " + sessionStorage.token
    );
    sessionStorage.token = data.token;
  });

  userProf = profile.getName();
  document.getElementById("overlay").style.display = "none";
  sendMessage.innerHTML = messageBar;
  $("#usernameLabel").text("Welcome, " + userProf);

  sendMessage.classList.remove("hide");

  if (userProf != "") {
    var usr = userProf;
    var safe = usr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
    sessionStorage.username = safe;
    // socket.emit('adduser', {username : sessionStorage.username, token : sessionStorage.token });
    // $('#onlineUserList').append("<li class='userOnline'>"+userProf+"</li>");
  }
}

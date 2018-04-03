var room = document.URL.split("/")[3];		  

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
  var content = document.getElementById("content");

  sessionStorage.username = profile.getName();
  id_token = id_token.substring(0, 200);
  socket.emit("verifyUserGoogle", {
    username: profile.getName(),
    token: id_token
  });
  socket.on("verifySuccess", function(data) {
    console.info(
      "Username: " + data.username + " Token: " + data.token
    );
    sessionStorage.token = data.token;
    //socket.emit("getOnlineUsers");
    var loggedInOverlay = '<div id="overlayLoggedIn"> <div id="text">Welcome '+ sessionStorage.username + '</div>  <button type="button" onclick="enterChat()" class="btn btn-primary buttonEnterChat">Enter Chat!</button></div>';
    if(!sessionStorage.loaded) {
    content.innerHTML= loggedInOverlay;
    }
  });

  userProf = profile.getName();
  document.getElementById("overlay").style.display = "none";
  sendMessage.innerHTML = messageBar;
  $("#usernameLabel").text("Welcome, " + userProf);



  if (userProf != "") {
    var usr = userProf;
    var safe = usr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
    sessionStorage.username = safe;
    $("#googleSignIn").attr("data-onsuccess", "signedIn");
    
    
     
  }
}

function enterChat() { 

  $("#overlayLoggedIn").css("display","none");
  sessionStorage.loaded = "true"; 
  location.reload();
  sendMessage.classList.remove("hide");

}






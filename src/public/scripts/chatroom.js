// TODO: Enter timeout so functions are not called repeatedly when enter is pressed
var user = null;
var socket = io.connect(document.location.origin);
var loginState;
var room = document.URL.split("/")[3];		  
var currentchannel = room;
var messageBar =
  '<form id="msgBar" class="navbar-form" onSubmit="return false;"><label id="usernameLabel" class="col-2 col-form-label">Welcome, <a class="brand"></a></label><input class="span8" type="text" id="message" onkeydown="enterSend()" placeholder="Be nice"/><!--<input class="btn btn-primary span2" OnClick="myFunction()" type="button" id="sendGoogleLogin" value="Login" />*/--><input class="btn btn-primary span2" onclick="sendMessage()" type="button" id="send" value="Send" />';

var initialLoad = false;
// sends message only
function sendMessage() {
  console.info("Secure send message");
  var msg = $("#message").val();
  if (msg != "") {
    var safe = msg
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
    console.log("message is not null");
    socket.emit("message", {
      token: sessionStorage.token,
      message: safe,
      user: sessionStorage.username,
	  room: currentchannel,
      timestamp: new Date()
    }); // this is insecure user can delete all validation on client side and send messages

    document.getElementById("message").value = "";
  }
}

// Logins in user from overlay
// Need token validation
function userLogin() {
  console.info("user login called");
  var userName = document.getElementById("usrName").value;
  var sendMessage = document.getElementById("sendMessageBar");

  if (userName.length != 0) {
    var socket = io.connect(document.location.origin);

    socket.emit("verifyUser", userName);
    // User if verified successfully
    socket.on("verifySuccess", function(data) {
      console.info("Username: " + data.username + " Token: " + data.token);
      sessionStorage.token = data.token;

      document.getElementById("overlay").style.display = "none";
      sendMessage.innerHTML = messageBar;
      $("#usernameLabel").text("Welcome, " + userName);

      sendMessage.classList.remove("hide");

      var usr = userName;
      var safe = usr
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
      sessionStorage.username = safe;
     /// socket.emit("adduser", {
       // username: sessionStorage.username,
		   // room: room,
       // token: sessionStorage.token
     // });
      $("#onlineUserList").append(
        "<li class='userOnline'>" + userName + "</li>"
      );
      location.reload();
      updateUsersLogin();
    });

    //Username is taken
    socket.on("usernameTaken", function(data) {
      $("#usrName").val("");
      // Multiple userErrors because Chrome, Firefox, and Safari handle placeholder differently
      $("#usrName").addClass("userError");
      $("#usrName").addClass("userError1");
      $("#usrName").addClass("userError2");

      $("#usrName").attr("placeholder", "Username is taken!");
      console.log("username taken");
    });
  }
}

function updateUsersLogin() {
  socket.emit("getOnlineUsers");
  socket.on("updateUsersLogin", function(data) {
    console.info("updating users. Disconnect Flag: " + data.disconnectFlag);
    console.info("This user left: " + data.removeUser);

    if (data != null && data.disconnectFlag == undefined) {
      //$('#onlineUserList').html(""); //This is being called and clearing the list because data is not null
      // Were clearing the list however sometimes data.usernames has no data which is causing this error
      for (var key in data.usernames) {
        console.info("Names " + key);
        //add the user to the list of online users
        $("#onlineUserList").append("<li class='userOnline'>" + key + "</li>");
      }
      location.reload();
    }
  });
}

// Checks if enter is pressed on username field for login. If so calls userLogin()

document.getElementById("usrName").addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("enterChat").click();
  }
});

// On page refresh we need to check if the user is already logged in.
// There is a small bug when user refreshes with ctrl+f5 that clears the session storage and clears username. Possible solution could be cookie storage.
// Important! For form tag add onSubmit="return false;" to stop page refresh
function checkUsername() {
  //current-channel
  console.info("Checking username");
  $("#current-channel").text(room + " Chat");

  var userName = document.getElementById("usrName").value;
  var sendMessage = document.getElementById("sendMessageBar");

  if (sessionStorage.username ) {
    document.getElementById("overlay").style.display = "none";
    sendMessage.innerHTML = messageBar;
    $("#usernameLabel").text("Welcome, " + sessionStorage.username);
    sendMessage.classList.remove("hide");
    
  } else {
    document.getElementById("overlay").style.display = "block";
  }

  
}

// Checks for enter key on message input and calls sendMessage() if key is pressed
function enterSend() {
  document.getElementById("message").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      sendMessage();
    }
  });
}

$(function() {
  var socket = io.connect(document.location.origin);
  socket.on("news", function(data) {
    console.log(data);
  });

  //check weather username is stored in the session, if yes then directly authenticate the user
  if (
    sessionStorage.username != undefined &&
    sessionStorage.token != undefined
  ) {
    console.info("Page load session check");
    $("#username").hide(sessionStorage.username);
    $(".brand").html();
    $(".brand").show();
    $("#message").show();
    $("#message").focus();

    // User must be verified with database to be added to list
    // Functionality to be implemented

    socket.emit("adduser", {
      username: sessionStorage.username,
      room: room,
      token: sessionStorage.token
    });
  } else {
    //hiding the brand
    $(".brand").hide();
    $("#message").hide();
    $("#username").focus();
  }

  $("#send").click(function() {
    console.log("Send pressed");
    //check if username is null if yes then fire addUsername event and send the username
    //handle message send
    var msg = $("#message").val();
    if (msg != "") {
      var safe = msg
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
      console.log("message is not null");
      socket.emit("message", {
        message: safe,
        user: sessionStorage.username,
		room: currentchannel,
        timestamp: new Date()
      });
    }
    document.getElementById("message").value = "";
  });

  //handle enter key event on messagebox/*
  $("#message").keydown(function(e) {
    if (e.which === 13) {
      //handle message send
      var msg = $("#message").val();
      $("#message").val("");
      e.preventDefault();
      if (msg != "") {
        var safe = msg
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
        console.log("message is not null");
        socket.emit("message", {
          message: safe,
          user: user,
		  room: currentchannel,
          timestamp: new Date()
        });
      }
      document.getElementById("message").value = "";
      e.preventDefault();
      return false;
    }
  });
  
  //handle clicking channels in the channel box
  $("div").on("click", ".changechannel", function(e){
	e.preventDefault();
	if (currentchannel != e.currentTarget.innerHTML){
		var oldchannel;
		if (currentchannel != room){ //you will leave old channel unless old channel is your current room since that affects other tabs
			oldchannel = currentchannel;
		}
		currentchannel = e.currentTarget.innerHTML;
		$("#current-channel").text(currentchannel + " Chat");
		socket.emit("viewchannel", {
			old: oldchannel,
			room: currentchannel
		});
    }
  });

  socket.on("userAdded", function(data) {
    console.info("user added");

    //add banner containing the username
    $("#username").hide();
    $(".brand").html(data.username);
    $(".brand").show();
    $("#message").show();
    $("#message").focus();
    user = data.username;
  });

  //This function only adjust client side html and does not interact with the server
  //Lets get a disconnect flag so we know where this function is being called
  //Depending on that disconnect flag we will innact different actions to remove the bug
  socket.on("updateUsers", function(data) {
    console.info("updating users. Disconnect Flag: " + data.disconnectFlag);
    console.info("This user left: " + data.removeUser);
	if (data.room == currentchannel) {
		if (data != null && data.disconnectFlag == undefined) {
		  console.info("Clearing the online user list!");
		  console.info("Desired user to remove " + data.removeUser);

		  $("#onlineUserList").html(""); //This is being called and clearing the list because data is not null
		  // Were clearing the list however sometimes data.usernames has no data which is causing this error
		  for (var key in data.usernames) {
			console.info("Names " + key);
			//add the user to the list of online users
			$("#onlineUserList").append("<li class='userOnline'>" + key + "</li>");
		  }
		} else if (data.disconnectFlag == true) {
		  console.info("Disconnect call to function");
		  var liUsers = document.getElementsByClassName("userOnline");
		  var i;
		  for (i = 0; i < liUsers.length; i++) {
			var liUser = liUsers[i].textContent;
			console.info("USER: " + liUsers[i].textContent);
			if (liUser == data.removeUser) {
			  console.info("Found and removing user: " + data.removeUser);
			  document.getElementsByClassName("userOnline")[i].remove();
			}
		  }
		}
	}
  });

  socket.on("updateRooms",function(data){
	  console.log("updateRooms called");
	  if (data != null && data.disconnectFlag == undefined){
		$("#userOpenChats").append("<li class='userOnline'><a href='' class='changechannel' value='"+data.room+"'>"+data.room+"</div></li>");
	  }
	  else if (data.disconnectFlag == true){
		var liRooms = document.getElementsByClassName("userOnline");
		for (var i = 0; i < liRooms.length; i++) {
			var liRoom = liRooms[i].textContent;
			if (liRoom == data.room) {
			  document.getElementsByClassName("userOnline")[i].remove();
			}
		}
	  }
  });

  //load history
  socket.on("loadHistory", function(data) {
    console.info("loading history");
	$("#liveChat").empty();
    for (var i = 0; i < data.length; i++) {
      var html =
        "<div class='post-other'> <div class='post-inner'><b>" +
        data[i].user +
        "</b> " +
        data[i].message +
        "</div></div>";
      $("#liveChat").append(html);
    }
  });

  socket.on("update", function(data) {
    console.log("updatechat called");
	
	if (data.room == currentchannel){
		var postClass;
		if (data.user === user) {
		  postClass = "post-current";
		} else {
		  postClass = "post-other";
		}
		var html =
		  "<div class='" +
		  postClass +
		  "'> <div class='post-inner'><b>" +
		  data.user +
		  "</b> " +
		  data.message +
		  "</div></div>";
		console.log("Message " + html);
		$("#liveChat").append(html);
		$("html, body").animate(
		  {
			scrollTop: $(document).height()
		  },
		  "slow"
		);
	}
  });
});

function channelSearch() {
  var url = "/" + document.getElementById("channel-search").value;
  location.href = url;
  return false;
}

var idleTime = 0;
console.info("Timeout");
//Increment the idle time counter every minute.
var idleInterval = setInterval(timerIncrement, 60000); // 1 minute



//Zero the idle timer on mouse movement.
$(this).mousemove(function(e) {
  idleTime = 0;
});
$(this).keypress(function(e) {
  idleTime = 0;
});

function timerIncrement() {
  idleTime = idleTime + 1;
  if (idleTime > 15) {
    // 2 minutes for development purposes
    $("#overlay").show();
    $("#msgBar").hide();
    socket.emit("removeUser", sessionStorage.token);
    sessionStorage.username = "";
    sessionStorage.token = "";
    location.reload();
  }
}

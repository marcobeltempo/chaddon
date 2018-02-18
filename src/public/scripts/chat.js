var user = null;

$(function() {
  var socket = io.connect(document.location.origin);
  socket.on("news", function(data) {
    console.log(data);
  });

  //check weather username is stored in the session, if yes then directly authenticate the user
  if (sessionStorage.username != undefined) {
    $("#username").hide(sessionStorage.username);
    $(".brand").html();
    $(".brand").show();
    $("#message").show();
    $("#message").focus();
    socket.emit("adduser", sessionStorage.username);
  } else {
    //hiding the brand
    $(".brand").hide();
    $("#message").hide();
    $("#username").focus();
  }

  function addUser() {
    if ($("#username").val() != "") {
      var usr = $("#username").val();
      var safe = usr
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
      sessionStorage.username = safe;
      socket.emit("adduser", sessionStorage.username);
    }
    return;
  }

  $("#send").click(function() {
    console.log("Send pressed");
    //check if username is null if yes then fire addUsername event and send the username
    if (sessionStorage.username === undefined) {
      addUser();
      return;
    }
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
        timestamp: new Date()
      });
    }
  });

  //handle enter key event on username textbox
  $("#username").keydown(function(e) {
    if (e.which === 13) {
      addUser();
    }
  });

  //handle enter key event on messagebox
  $("#message").keydown(function(e) {
    if (e.which === 13) {
      //handle message send
      var msg = $("#message").val();
      $("#message").val("");
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
          timestamp: new Date()
        });
      }
    }
  });

  socket.on("userAdded", function(data) {
    //add banner containing the username
    $("#username").hide();
    $(".brand").html(data.username);
    $(".brand").show();
    $("#message").show();
    $("#message").focus();
    user = data.username;
  });

  socket.on("updateUsers", function(data) {
    if (data != null) {
      $("#onlineUserList").html("");
      for (var key in data.usernames) {
        //add the user to the list of online users
        $("#onlineUserList").append("<li>" + key + "</li>");
      }
    }
  });

  //load history
  socket.on("loadHistory", function(data) {
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
    $("#liveChat").append(html);
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  });
});
function channelSearch() {
  var url = "/" + document.getElementById("channel-search").value;
  location.href = url;
  return false;
}

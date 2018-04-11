$(function () {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 300; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window)
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page
  var $googleSignInButton = $('#btnGoogleSignIn'); // Google login button
  var $guestSignInButton = $('#btnGuestLogin'); //Guest login button
  var $guestSignInCheck = $('#btnGuestCheck'); //Guest login button
  var $guestUser = $('#guestUser'); 
  var $logout = $('#logout');

  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io.connect('http://localhost:3000');
  
  var currentChannel;

  // Payload stores the username and channel
  var payload = {
    username: "",
    domain: ""
  }

  chrome.storage.local.get(['UID'], function(result) {
    if(result.UID) {
      socket.emit('guestLoginCheck', result.UID)
    } else {
      showLogin();
    }
  });
  
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = new URL(tabs[0].url);
    payload.domain = url.hostname;
    currentChannel = payload.domain;
  });

  // Reveals the guest username input field
  $guestSignInButton.click(function () {
    console.log("sign in");
    var username_ = $guestUser.val();
    socket.emit('guest',username_);
  });

  $logout.click(function () {

    chrome.storage.local.get(['UID'], function(result) {
      if(result.UID) {
        payload.username = null;
        socket.emit("logout",result.UID);
      }
    });

    chrome.storage.local.clear();
    showLogin();
  });

  socket.on('guestSuccess', function (data) {
    console.info("Setting unique key " + data);
    chrome.storage.local.set({UID: data }, function() {
      
    });

    chrome.storage.local.get(['UID'], function(result) {
      if(result.UID) {
        socket.emit('guestLoginCheck', result.UID)
      } else {
        showLogin();
      }
    });

  });

  socket.on('guestFailure', function (data) {
    showLogin();    
  });

  //TODO: Allow user to revoke their username
  socket.on('guestCheckSuccess', function (username) {
    console.info("This user is logged in " + username);
    payload.username = username;
    if (username) {
      console.log("User logged in");
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();
      setUsername(); // Tell server to set username
    }
  });  

  // Reveals the guest username input field
  $guestSignInCheck.click(function () {
    console.info("guest Check");
   
     chrome.storage.local.get(['UID'], function(result) {
       if(result.UID) {
         socket.emit('guestLoginCheck', result.UID)
       }
     });
  });

  function showLogin() {
    $loginPage.fadeIn();
    $chatPage.hide();
   // $currentInput = $inputMessage.focus();
  }
  function loginGoogleUser() {
    // Use identity API to get the logged in user.
    chrome.identity.getAuthToken({
      interactive: true
    }, function (token) {

      if (chrome.runtime.lastError) {
        callback(chrome.runtime.lastError);
        return;
      }
    });
    //Get the response from background.js
    chrome.extension.sendMessage({}, function (response) {
      console.log("Response value", response);

      if (response.emails.length > 0) {
        console.log("response.emails is", response.emails);

        payload.username = response.emails[0].split('@')[0]; // A Google users "username" is their email
        console.log("Payload", payload);

        if (payload.username) {
          $loginPage.fadeOut();
          $chatPage.show();
          $loginPage.off('click');
          $currentInput = $inputMessage.focus();

          setUsername(); // Tell server to set username
        }
      } else {
        console.log("Couldn't get email address of chrome user.");
      }
    });
  }

  function addParticipantsMessage(data) {
    /*var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);*/ // Disabled for now
  }

  // Sets the client's username
  function setUsername() {

    $window.keydown(function (event) {
      if (event.which == 13 && !payload.username) {
        payload.username = cleanInput($usernameInput.val().trim());
      }

      // If the username is valid
      if (payload.username) {
        $loginPage.fadeOut();
        $chatPage.show();
        $loginPage.off('click');
        $currentInput = $inputMessage.focus();
		$("#chat_name").text(currentChannel);
        // Tell the server your username
      }
    });
    socket.emit('add user', payload);
  }

  // Sends a chat message
  //TODO: handle '@username' notification for all users in the user array
  function sendMessage() {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      // send users UID to server to send back right username
      addChatMessage({
        username: payload.username,
        message: message
      });
      var subStr = message.toString();
      if (subStr.indexOf("@marcob") > -1) {
        console.log("Real: ", subStr);
        show(payload.username, message);
      }
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', { 
	    message: message,
		room: currentChannel
	  });
    }
  }

  /** Triggers a notification popup
   * @param username The display name of the user sending the message
   * @param message The message to display within the notification
   * @returns a new Notification popup
   */
  function show(username, message) {
    var time = /(..)(:..)/.exec(new Date()); //The prettyprinted time.
    var hour = time[1] % 12 || 12; //The prettyprinted hour.
    var period = time[1] < 12 ? 'a.m.' : 'p.m.'; //The period of the day.
    new Notification(hour + time[2] + ' ' + period, {
      icon: '../../icons/icon48.png',
      body: "From: @" + username + ": '" + message + "'"
    })
  };

  // Log a message
  function log(message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage(data, options) {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // Adds the visual chat typing message
  function addChatTyping(data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping(data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  /** Adds a message element to the messages and scrolls to the bottom
   *  @param el - The element to add as a message
   *  @param options.fade - If the element should fade-in (default = true)
   *  @param options.prepend - If the element should prepend
   *   all other messages (default = false)
   */
  function addMessageElement(el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput(input) {
    return $('<div/>').text(input).html();
  }

  // Updates the typing event
  function updateTyping() {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages(data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  function getUsernameColor(username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(function (event) {
    console.log("Detected a keydown", event.which);
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (payload.username) {

        socket.emit('stop typing');
        typing = false;
        sendMessage();
      } 
    }
  });

  $inputMessage.on('input', function () {
    updateTyping();
  });

  // Click events

  // Launches thethe Google login flow
  $googleSignInButton.click(function () {
    loginGoogleUser();
  });


  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });
  
  //handle clicking channels in the channel box
  $("div").on("click", ".changechannel", function(e){
	e.preventDefault();
	if (currentChannel != e.currentTarget.innerHTML){
		var oldChannel;
		if (currentChannel != payload.domain){ //you will leave old channel unless old channel is your current room since that affects other tabs
			oldChannel = currentChannel;
		}
		currentChannel = e.currentTarget.innerHTML;
		$("#chat_name").text(currentChannel);
		socket.emit("viewChannel", {
			oldChannel: oldChannel,
			room: currentChannel
		});
    }
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Chaddon – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
	if (data.room == currentChannel){
      addChatMessage(data);
	}
  });

  socket.on("updateUsers", function(data) {
	if (data.room == currentChannel) {
		$("#onlineUserList").html(""); //This is being called and clearing the list because data is not null
		for (var key in data.usernames) {
	      //add the user to the list of online users
		  $("#onlineUserList").append("<li class='userOnline' style='color: white;'>" + key + "</li>");
		}
	}
  });
  
  socket.on("updateRooms",function(data){
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
	$(".messages").empty();
    for (var i = 0; i < data.length; i++) {
		console.log(data[i]);
      addChatMessage(data[i]);
    }
  });
  
  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

  socket.on('disconnect', function () {
    log('you have been disconnected');
  });

  socket.on('reconnect', function () {
    log('you have been reconnected');
    if (payload.username) {
	  $("#chat_name").text(payload.domain);
      socket.emit('add user', payload);
    }
  });

  socket.on('reconnect_error', function () {
    log('attempt to reconnect has failed');
  });

});
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
  var $logout = $('#logout');

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page
  var $googleSignInButton = $('#btnGoogleSignIn'); // Google login button
  var $guestSignInButton = $('#btnGuestLogin'); //Guest login button

  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io.connect('http://localhost:3000');

  // Payload stores the username and channel
  var payload = {
    username: "",
    domain: "",
  }

  // Check local storage to see if use has logged in
  chrome.storage.local.get(['key'], function(result) {
    //chrome.storage.local.clear();
    if(result.key) {
      console.log("Key exists " + result.key);
       loginGoogleUser();
    } else {
      $chatPage.hide();
      $loginPage.fadeIn();
      console.log("Key deleted " + result.key);
    }
  });


  console.info("Hello!");

    socket.emit("sessionCheck");


  function loginGoogleUser() {
    // Use identity API to get the logged in user.
    chrome.identity.getAuthToken({
      interactive: true
    }, function (token) {
        console.log("Token: " + token);
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
        console.log("response.domainis", response.domain);

        payload.username = response.emails[0].split('@')[0]; // A Google users "username" is their email
        payload.domain = response.domain; // Stores the domain of the current active tab
        console.log("Payload", payload);
        
        chrome.storage.local.get(['key'], function(result) {
          console.log('Value currently is ' + result.key);
        });


        if (payload.username) {
          $loginPage.fadeOut();
          $chatPage.show();
          $loginPage.off('click');
          $currentInput = $inputMessage.focus();

          setUsername(); // Tell server to set username
          chrome.storage.local.get(['key'], function(result) {
            if(result.key) {
              setUsernameExist();
            } else {
              setUsername(); // Tell server to set username
            }
          });
        }
      } else {
        console.log("Couldn't get email address of chrome user.");
      }
    });
  }

  function addParticipantsMessage(data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }

  // Sets the client's username
  function setUsername() {

    chrome.storage.local.get(['key'], function(result) {
      if(!result.key) {
        loginGoogleUser();
     
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

        // Tell the server your username
        

        
      }
    });
    chrome.storage.local.set({key: payload.username}, function() {
      console.log('Value is set to ' + payload.username);
    });
    socket.emit('add user', payload);
  }
});
  }

  function setUsernameExist() {

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

        // Tell the server your username
       

       
        
      }
    });
     chrome.storage.local.set({key: payload.username}, function() {
      console.log('Value is set to Existing ' + payload.username);
    });
    socket.emit('add existing', payload);

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
      socket.emit('new message', message);
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
      } else { //getter
        chrome.storage.local.get(['key'], function(result) {
          if(result.key) {
            console.log("calling exist");
            setUsernameExist();
          } else {
            setUsername();
          }
        });
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

  $logout.click(function () {
    console.log("Cleared storage");

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    chrome.storage.local.clear();
    $chatPage.hide();
    $loginPage.fadeIn();
  });

  // Reveals the guest username input field
  $guestSignInButton.click(function () {
    document.getElementById('guestUsername').style.display = "inline";
  });

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
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
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {

    chrome.storage.local.get(['key'], function(result) {
      //chrome.storage.local.clear();
      if(result.key != data.username) {
        log(data.username + ' joined2');
      } 
    });
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
    chrome.storage.local.get(['key'], function(result) {
      if(result.key !=data.username) {
        addChatTyping(data);
      }
    });
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
      socket.emit('add user', payload);
    
    chrome.storage.local.get(['key'], function(result) {
      if(result.key) {
        socket.emit('add existing', payload);
      } else {
        socket.emit('add user', payload);

      }
    });
  }
  });

  socket.on('reconnect_error', function () {
    log('attempt to reconnect has failed');
  });

  socket.on('session',function() {
    console.log("session Check ");
  });

});
var currChannel;
var blackList = [];
var blankArray = [];
var isBlocked = false;

chrome.storage.sync.get({
  'blackList': blankArray
}, function (items) {
  blackList = items.blackList;

  chrome.tabs.query({
    'active': true,
    'lastFocusedWindow': true
  }, function (tabs) {
    var url = new URL(tabs[0].url);
    currChannel = url.domain;

    for (var i = 0; i < blackList.length; i++) {
      if (blackList[i] == currChannel.toString()) {
        isBlocked = true;
      }
    }
    if (isBlocked == false) {
      $(function () {
        const productionServer  = 'https://app.chaddon.ca';
    // const developmentServer = 'http://localhost:3000';

        // Set event variables
        var $window = $(window)
        var $usernameInput = $('.usernameInput'); // Input for username
        var $channelHeader = $("#currentChannelHeader")
        var $chatPage      = $('.chat-page'); // The chatroom page
        var $currentInput  = $usernameInput.focus();
        var $logout        = $('#logout');
        var $inputMessage  = $('#userMessageInput'); // Input message input box
        var $messages      = $('.chat-messages'); // Message area
        var $sendBtn       = $('#sendChatMessageBtn');

        // Set state variables
        var roomsShown        = 0;
        var connected         = false;
        var typing            = false;
        var notificationTimer = new Date();
        var lastTypingTime;
        var currentChannel;

        // Configure settings
        var FADE_TIME           = 150;
        var TYPING_TIMER_LENGTH = 300;
        var COLORS = [
          '#e21400', '#91580f', '#f8a700', '#f78b00',
          '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
          '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
        ];

        // Connect to socket server
        var socket = io.connect(productionServer);

        // Payload stores the username and current domain to be passed to the server
        var payload = {
          username: "",
          domain: ""
        }

        socket.on('init user', function (data) {
          payload.username = data;
          chrome.tabs.query({
            'active': true,
            'lastFocusedWindow': true
          }, function (tabs) {
            var url = new URL(tabs[0].url);
            payload.domain = url.hostname;
            currentChannel = payload.domain;
            init();
          });
        });

        $inputMessage.keydown(function (event) {
          if (event.keyCode == 13) {
            sendMessage();
            return false;
          }
        });

        $sendBtn.click(function () {
          sendMessage();
        });

        function init() {
          $chatPage.show();
          $currentInput = $inputMessage.focus();
          $channelHeader.text(currentChannel);
          setUsername();
          console.log("HERE", payload.domain, currentChannel)
        }

        // Sets the client's username
        function setUsername() {
          $("#currentChannelHeader").text(currentChannel);
          $currentInput = $inputMessage.focus();
          // Tell the server your username
          socket.emit('add user', payload);
        }

        // Sends a chat message
        function sendMessage() {
          var message = $inputMessage.val();
          // prevent markup from being injected into the message
          message = cleanInput(message);
          // if there is a non-empty message and a socket connection
          if (message && connected) {
            $inputMessage.val('');
            addChatMessage({
              username: payload.username,
              message: message
            });
            var subStr = message.toString();
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
        var notifState;
        chrome.storage.sync.get({
          'setNotif': false
        }, function (items) {
          console.log("SetNotif is:" + items.setNotif)
        });

        function show(username, message) {
          chrome.storage.sync.get({
            'setNotif': false
          }, function (result) {
            notifState = result.setNotif;
            console.log("Notifs on are: " + notifState);
            if (notifState === true) {
              messageTime = new Date();
              if (getTimeBetweenNotifications(messageTime)) {
                var time = /(..)(:..)/.exec(new Date()); //The prettyprinted time.
                var hour = time[1] % 12 || 12; //The prettyprinted hour.
                var period = time[1] < 12 ? 'a.m.' : 'p.m.'; //The period of the day.
                new Notification(hour + time[2] + ' ' + period, {
                  icon: '../../icons/icon48.png',
                  body: "From: @" + username + ": '" + message + "'"
                })
              }
            }
          });
        };

        function getTimeBetweenNotifications(newTime) {
          var timesUp = (newTime - notificationTimer) > 10000;

          notificationTimer = newTime;
          return timesUp;
        }

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
          var $username = $('.username');
          $username.innerHTML = data.username;

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

        // Focus input when clicking on the message input's border
        $inputMessage.click(function () {
          $inputMessage.focus();
        });

        $("#usersChatList").hover(
          function () {
            $(".channelHidden").stop(true, true).slideDown();
          },
          function () {
            $(".channelHidden").stop(true, true).slideUp();
          }
        );

        //handle clicking channels in the channel box
        $("div").on("click", ".changechannel", function (e) {
          e.preventDefault();
          if (currentChannel != e.currentTarget.innerHTML) {
            var oldChannel;
            if (currentChannel != payload.domain) { //you will leave old channel unless old channel is your current room since that affects other tabs
              oldChannel = currentChannel;
            }
            currentChannel = e.currentTarget.innerHTML;
            $("#currentChannelHeader").text(currentChannel);
            socket.emit("viewChannel", {
              oldChannel: oldChannel,
              room: currentChannel
            });
          }
        });

        // Socket events
        // Whenever the server emits 'login', log the message
        socket.on('login', function (data) {
          connected = true;
          // Display the welcome message
          var message = "Welcome to Chaddon – ";
          log(message, {
            prepend: true
          });

        });

        // Whenever the server emits 'new message', update the chat body
        socket.on('new message', function (data) {
          if (data.room == currentChannel) {
            addChatMessage(data);
            if (payload.username != data.username) {
              show(data.username, data.message);
            }
          }
        });

        socket.on("updateUsers", function (data) {
          if (data.room == currentChannel) {
            $("#onlineUserList").html(""); //This is being called and clearing the list because data is not null
            for (var key in data.usernames) {
              //add the user to the list of online users
              $("#onlineUserList").append("<li id='onlineUser'>" + key + "</li>");
            }
          }
        });

        socket.on("updateRooms", function (data) {
          if (data != null && data.disconnectFlag == undefined) {
            if (roomsShown < 5) {
              $("#usersChatList").append("<li class='onlineUser'><a href='' class='changechannel' value='" + data.room + "'>" + data.room + "</div></li>");
            } else if (roomsShown > 5) {
              $("#usersChatList").append("<li class='onlineUser channelHidden' style='display:none'><a href='' class='changechannel' value='" + data.room + "'>" + data.room + "</div></li>");
            }
            console.log("Rooms shown " + roomsShown);
            roomsShown = roomsShown + 1;
          } else if (data.disconnectFlag == true) {
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
        socket.on("loadHistory", function (data) {
          $messages.empty();
          for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
            addChatMessage(data[i]);
          }
        });

        // Whenever the server emits 'user joined', log it in the chat body
        socket.on('user joined', function (data) {
          log(data.username + ' joined');
        });

        // Whenever the server emits 'user left', log it in the chat body
        socket.on('user left', function (data) {
          log(data.username + ' left');
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
            $("#currentChannelHeader").text(payload.domain);
            socket.emit('add user', payload);
          }
        });

        socket.on('reconnect_error', function () {
          log('attempt to reconnect has failed');
        });
      });
    }
    isBlocked = false;
  });
  
  $(".themeGroup").hover(
    function () {
      $(".themeGroup").stop(true, true).show();
    },
    function () {
      $(".themeGroup").stop(true, true).slideUp();
    }
  );

  $(".themeSettings").hover(
    function () {
      $(".themeGroup").stop(true, true).slideDown();
    },
    function () {
      $(".themeGroup").stop(true, true).slideUp();
    }
  );
  
  $("#changeColor1").hover(
    function () {
      $(".channelView").css("background","#673AB7");
      $(".headerBack").css("background","#7E57C2");
  });

  $("#changeColor2").hover(
    function () {
      $(".channelView").css("background","#FF5722");
      $(".headerBack").css("background","#FF7043");
  });

  $("#changeColor3").hover(
    function () {
      $(".channelView").css("background","#4CAF50");
      $(".headerBack").css("background","#66BB6A");
  });

  $("#changeColor4").hover(
    function () {
      $(".channelView").css("background","#80DEEA");
    $(".headerBack").css("background","#B2EBF2");
  });
  $("#changeColor5").hover(
    function () {
      $(".channelView").css("background","#78909C");
    $(".headerBack").css("background","#90A4AE");
  });
  $("#changeColor1").click(function() {
    console.log("Clicked change color");
    $(".channelView").css("background","#673AB7");
    $(".headerBack").css("background","#7E57C2");
  });
  
  $("#changeColor2").click(function() {
    console.log("Clicked change color");
    $(".channelView").css("background","#FF5722");
    $(".headerBack").css("background","#FF7043");
  });
  
  $("#changeColor3").click(function() {
    console.log("Clicked change color");
    $(".channelView").css("background","#4CAF50");
    $(".headerBack").css("background","#66BB6A");
  });
  
  $("#changeColor4").click(function() {
    console.log("Clicked change color");
    $(".channelView").css("background","#80DEEA");
    $(".headerBack").css("background","#B2EBF2");
  });
  
  $("#changeColor5").click(function() {
    console.log("Clicked change color");
    $(".channelView").css("background","#78909C");
    $(".headerBack").css("background","#90A4AE");
  });
});
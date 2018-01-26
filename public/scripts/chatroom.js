var user = null;
var socket = io.connect(document.location.origin);

// sends message only
function sendMessage() {
    var msg = $('#message').val();
        if(msg != ""){
            var safe = msg.replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            console.log("message is not null");
            socket.emit('message', {message: safe, user: sessionStorage.username, timestamp: new Date()}); 
        }
        document.getElementById("message").value = "";    
}

// Logins in user from overlay
function userLogin() {
    var userName = document.getElementById('usrName').value;
    var sendMessage = document.getElementById("sendMessageBar");
    var messageBar = '<form class="navbar-form" onSubmit="return false;"><label id="usernameLabel" class="col-2 col-form-label">Welcome, <a class="brand"></a></label><input class="span8" type="text" id="message" onkeydown="enterSend()" placeholder="Be nice"/><!--<input class="btn btn-primary span2" OnClick="myFunction()" type="button" id="sendGoogleLogin" value="Login" />*/--><input class="btn btn-primary span2" onclick="sendMessage()" type="button" id="send" value="Send" />';
    if(userName.length !=0) {
        var socket = io.connect(document.location.origin);

        document.getElementById("overlay").style.display = "none";
        sendMessage.innerHTML =messageBar ;
        $("#usernameLabel").text("Welcome, " + userName);

        sendMessage.classList.remove("hide");

        var usr = userName;
        var safe = usr.replace(/&/g, '&amp;').replace(/</g, '&lt;')
             .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
             sessionStorage.username = safe;
             socket.emit('adduser', sessionStorage.username);
             $('#online').append("<li>"+userName+"</li>");   
    }   

}

// Checks if enter is pressed on username field for login. If so calls userLogin()
function checkUserEnter() {  
    document.getElementById("usrName").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            userLogin();
        }
    });
}

// On page refresh we need to check if the user is already logged in.
// There is a small bug when user refreshes with ctrl+f5 that clears the session storage and clears username. Possible solution could be cookie storage.
// Important! For form tag add onSubmit="return false;" to stop page refresh
function checkUsername() {
    var userName = document.getElementById('usrName').value;
    var sendMessage = document.getElementById("sendMessageBar");
    var messageBar = '<form class="navbar-form" onSubmit="return false;" ><label id="usernameLabel" class="col-2 col-form-label">Welcome, <a class="brand"></a></label><input class="span8" type="text" id="message" onkeydown="enterSend()" placeholder="Be nice"/><!--<input class="btn btn-primary span2" OnClick="myFunction()" type="button" id="sendGoogleLogin" value="Login" />*/--><input class="btn btn-primary span2" onclick="sendMessage" type="button" id="send" value="Send" />';
    if(sessionStorage.username)  {
        document.getElementById("overlay").style.display = "none";
        sendMessage.innerHTML =messageBar ;
        $("#usernameLabel").text("Welcome, " + userName);

        sendMessage.classList.remove("hide");
    }
    else {
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

$(function () {
    var socket = io.connect(document.location.origin);
    socket.on('news', function (data) {
        console.log(data);
    });

    //check weather username is stored in the session, if yes then directly authenticate the user
    if(sessionStorage.username != undefined) {
        $('#username').hide(sessionStorage.username);
        $('.brand').html();
        $('.brand').show();
        $("#message").show();
        $("#message").focus();
        socket.emit('adduser', sessionStorage.username);
    }
    else {
        //hiding the brand
        $('.brand').hide();
        $('#message').hide();
        $("#username").focus();
    }	

    $("#send").click(function() {
        console.log("Send pressed");
        //check if username is null if yes then fire addUsername event and send the username
        //handle message send
        var msg = $('#message').val();
        if(msg != ""){
            var safe = msg.replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            console.log("message is not null");
            socket.emit('message', {message: safe, user: sessionStorage.username, timestamp: new Date()}); 
        }
        document.getElementById("message").value = "";        
    });

    
    //handle enter key event on messagebox/*
    $("#message").keydown(function (e) {
        if(e.which === 13){
            //handle message send
            var msg = $('#message').val();
            $('#message').val('');
            e.preventDefault();
            if(msg != ""){
                var safe = msg.replace(/&/g, '&amp;').replace(/</g, '&lt;')
                .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                console.log("message is not null");
                socket.emit('message', {message: safe, user: user, timestamp: new Date()}); 
            }
            document.getElementById("message").value = "";  
            e.preventDefault();
            return false;
        }
    });


    socket.on('userAdded', function(data) {
        //add banner containing the username
        $('#username').hide();
        $('.brand').html(data.username);
        $('.brand').show();
        $("#message").show();
        $("#message").focus();
        user = data.username;
    });

    socket.on('updateUsers', function (data) {
        if(data != null){
            $('#onlineUserList').html("");
            for(var key in data.usernames){
                //add the user to the list of online users
                $('#onlineUserList').append("<li>"+key+"</li>");
            }
        }
    }); 

    //load history
    socket.on('loadHistory', function(data) {

        for(var i=0; i<data.length; i++){
            var html = "<div class='post-other'> <div class='post-inner'><b>"
            + data[i].user + "</b> "+ data[i].message + "</div></div>";
            $('#liveChat').append(html);
        }
    });

    socket.on('update',function (data) {
        console.log("updatechat called");
        var postClass;
        if(data.user === user){
            postClass = "post-current";
        } else {
            postClass = "post-other";
        }
        var html = "<div class='" + postClass + "'> <div class='post-inner'><b>"
        + data.user + "</b> " + data.message + "</div></div>";
        console.log("Message " + html);
        $('#liveChat').append(html);
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    });
});
function channelSearch()
{
var url = "/" +  document.getElementById('channel-search').value;
location.href = url;
return false;
}
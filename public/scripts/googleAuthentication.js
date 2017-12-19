function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    var socket = io.connect(document.location.origin);
    socket.on('news', function (data) {
         console.log(data);
     });
     
    console.log('Full Name: ' + profile.getName());					
    var id_token = googleUser.getAuthResponse().id_token;
    sessionStorage.username = profile.getName();
    userProf = profile.getName();
    $("#usernameLabel").text("Welcome, " + profile.getName());
    $('#loginGoogleAccountBar').addClass("hide");
    $('#googleSignIn').attr("disabled", true);
    $("#sendMessageBar").removeClass("hide");
    if(userProf != "") {
             var usr = userProf;
             var safe = usr.replace(/&/g, '&amp;').replace(/</g, '&lt;')
             .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
             sessionStorage.username = safe;
             socket.emit('adduser', sessionStorage.username);
             $('#online').append("<li>"+userProf+"</li>");             
    }
 };

var socket = io.connect(document.location.origin);

function displayRooms() {
	$("#Rooms").empty();
	socket.emit("getMasterList");
}

socket.on("displayMasterList", function (list) {
	for (var i in list) {
		$("#Rooms").append("<ul class='chaddon_headings'>" + i);
		for (var j in list[i]) {
			$("#Rooms").append("<li class='useronline'>" + j + "</li>");
		}
		$("#Rooms").append("</ul><br>");
	}
});
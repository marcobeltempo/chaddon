var ChaddonOpen = false;
var buttonspace = "20px";

var chatbar = document.createElement('iframe');
chatbar.id = "myChatbar";
chatbar.src = chrome.extension.getURL("/src/browser_action/browser_action.html");
chatbar.style.cssText = "\
	position:fixed;\
	top:0px;\
	right:" + buttonspace + ";\
	width:0%;\
	height:100%;\
	background:white;\
	box-shadow:inset 0 0 1em black;\
	z-index:999999;\
";

document.body.appendChild(chatbar);

var chatbutton = document.createElement('div');
chatbutton.style.cssText = "\
	position:fixed;\
	top:0px;\
	right:0px;\
	width:" + buttonspace + ";\
	height:100%;\
	background:white;\
	box-shadow:inset 0 0 1em black;\
	z-index:999999;\
";

document.body.appendChild(chatbutton);

chatbutton.addEventListener("click", function () {
	if (ChaddonOpen) {
		chatbar.style.width = "0%";
		ChaddonOpen = false;
	} else {
		chatbar.style.width = "30%";
		ChaddonOpen = true;
	}
});
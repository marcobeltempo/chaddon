// content.js

//Create button on page
var notify=document.createElement("button"); 
document.body.appendChild(notify); 
notify.style.position="fixed"; //position needs to be consistent
notify.style.right="10px";
notify.style.top="8px";
notify.style.zIndex="9999"; //I want it to overlap anything
notify.innerText="Chaddon";

//div contains the chatroom
var chatWindow=document.createElement("div"); 
document.body.appendChild(chatWindow); 
document.body.insertBefore(chatWindow, notify.nextSibling);
chatWindow.style.display = "none";
chatWindow.style.position="fixed";
chatWindow.style.right="10px";
chatWindow.style.top="40px";
chatWindow.style.zIndex="9999";

//positioned in the chatroom window, the rest of the chat functionality from heroku
var iframe = document.createElement('iframe');
chatWindow.appendChild(iframe);
iframe.src = "https://chaddon.herokuapp.com/" + extractHostname(document.URL); 
iframe.style.height="560px";
iframe.style.width="800px";


function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

notify.addEventListener("click",
	function (){
		if (chatWindow.style.display == "none"){
			chatWindow.style.display = "block";
		}
		else{
			chatWindow.style.display = "none";
		}
	}
);

chrome.runtime.onMessage.addListener(
    function getUrl (request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
        var firstHref = $("a[href^='http']").eq(0).attr("href");
        console.log('The URL is: ', firstHref);
        sendRespone= firstHref;
      }
    }
  );
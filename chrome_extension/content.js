// content.js
 var frameHeight = "560px";
 var frameWidth = "800px";
 var disArray = new Array;
  var blankArray = new Array;
  var arrayNo = 0;
  var enabled = true;
  var domain = extractHostname(document.URL);	
  


//Create button on page
var notify = document.createElement("button");
document.body.appendChild(notify);
notify.style.position = "fixed"; //position needs to be consistent
notify.style.right = "10px";
notify.style.top = "8px";
notify.style.zIndex = "9999"; //I want it to overlap anything
notify.innerText = "Chaddon";

//div contains the chatroom
var chatWindow = document.createElement("div");
document.body.appendChild(chatWindow);
document.body.insertBefore(chatWindow, notify.nextSibling);
chatWindow.style.display = "none";
chatWindow.style.position = "fixed";
chatWindow.style.right = "10px";
chatWindow.style.top = "40px";
chatWindow.style.zIndex = "9999";

//if (channel.Enabled == true){
//positioned in the chatroom window, the rest of the chat functionality from heroku
	





function getInfo(callback){
 chrome.storage.local.get({
	'size' : '',
	'tabList' : blankArray
  }, function(items) {
	  
  disArray = items.tabList;
  var sized = items.size;
   
   if(sized == 'small'){
	   frameHeight = "360px";
	   frameWidth = "360px";
   }
   else if(sized == 'medium'){
	    frameHeight = "560px";
	   frameWidth = "800px";
   }
   else if(sized == 'large'){
	   frameHeight = "800px";
	   frameWidth = "1000px";
   }
 
  
 callback(disArray);
  });
  
}

function useInfo(){

   for (var i = 0; i < disArray.length; i++){
	  if(disArray[i] == domain ){
		  
		  arrayNo = i;
	  }
	 
  }
  if (domain == disArray[arrayNo]){
 enabled = false;
}
if (domain != disArray[arrayNo]){
 enabled = true;
}
if(enabled){
var iframe = document.createElement("iframe");
chatWindow.appendChild(iframe);
iframe.src =
  "https://chaddon.ca/" + extractHostname(document.URL);
iframe.style.height = frameHeight;
iframe.style.width = frameWidth;
}
}

getInfo(useInfo);

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("://") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
}

notify.addEventListener("click", function() {
  if (chatWindow.style.display == "none") {
    chatWindow.style.display = "block";
  } else {
    chatWindow.style.display = "none";
  }
});

chrome.runtime.onMessage.addListener(function getUrl(
  request,
  sender,
  sendResponse
) {
  if (request.message === "clicked_browser_action") {
    var firstHref = $("a[href^='http']")
      .eq(0)
      .attr("href");
    console.log("The URL is: ", firstHref);
    sendRespone = firstHref;
  }
});

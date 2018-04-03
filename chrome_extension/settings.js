var domain, room, domainShow;
//var tabArray = new Array;
var existArray = new Array;
var blankArray = new Array;
var counter;
var removeIndex;
var addTab = true;
var toDisable = true;
var dummyArray = new Array;
var channel = {
	enabled: true,
	iCount : 0,
	tabArray : new Array
};

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    domain = tabs[0].url;
	domainShow = tabs[0].url;
	domainShow = domainShow.split("/")[2];
	domain = domain.split("/")[2];
	
	if(domain == null){
		
	}
	else{
	chrome.storage.local.set({
    'curTab': domain
  }, function() {
  });
	}
  current.textContent = 'Current tab is: ' + domainShow;
});

function save_options() {
 chrome.storage.local.get({
    'curTab': ' '
  }, function(items) {
   room = items.curTab;
  });
  
  var size1 = document.getElementById('radSize1').checked;
  var size2 = document.getElementById('radSize2').checked;
  var size3 = document.getElementById('radSize3').checked;
  var checkedSize;
  if(size1){
	  checkedSize = 'small';
  }
  else if (size2){
	  checkedSize = 'medium';
  }
  else if (size3){
	  checkedSize = 'large';
  }
  var disabled = document.getElementById('disableTab').checked;
 
	
  counter = channel.tabArray.length;
  chrome.storage.local.get({
    'tabList': blankArray
  }, function(items) {
   existArray = items.tabList;
  });
  for (var i=0; i < existArray.length; i++){
	  if (room == existArray[i]){
		  addTab = false;
		  
	  }
	  if (room == existArray[i] && disabled != true){
		  toDisable = false;
		  removeIndex = i;
	  }
	 
  }
  if (addTab && room != null){
  channel.tabArray.push(room);
  

 console.log("Value of array #"+ channel.tabArray.length + " = " + channel.tabArray[counter]);
 
  }
  if (toDisable){
  chrome.storage.local.set({
    'isDisabled': disabled,
	'tabList': channel.tabArray,
	'size' : checkedSize
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
  addtab = true;
  
  }
  if (toDisable != true){
	  chrome.storage.local.get({'tabList' : blankArray}, function(items) {
    // Remove one item at index 0
    dummyArray = items.tabList.splice(removeIndex, 1);
    chrome.storage.local.set({'tabList' : dummyArray}, function() {
		status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
        console.log('Item deleted!');
		
    });
});
	  
	 
  }
  toDisable = true; 
}




// Restores checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value 
  chrome.storage.local.get({
    'isDisabled': 'False',
    'tabList' : blankArray,
	'size' : 'medium'
  }, function(items) {
   document.getElementById('disableTab').checked = items.isDisabled;
   var sized = items.size;
   if(sized == 'small'){
	   document.getElementById('radSize1').checked = true;
   }
   else if(sized == 'medium'){
	   document.getElementById('radSize2').checked = true;
   }
   else if(sized == 'large'){
	   document.getElementById('radSize3').checked = true;
   }
   channel.tabArray = items.tabList;
  });
}

  
document.addEventListener('DOMContentLoaded', restore_options);
var el = document.getElementById("settingSubmit");
if (el){
el.addEventListener('click',
    save_options);
}



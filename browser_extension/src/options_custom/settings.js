var blackList = [];
var newDomain;
var blankArray = [];
var counter = 0;
function getValue(callback){
	chrome.storage.sync.get("blackList", callback);
}


window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {

        var _setNotification = settings.manifest.setNotification.element;
       // var _setNotificationTime = settings.manifest.setNotificationTime.element;
       // var _popupSize = settings.manifest.popupWindowSize.element;
       // var _theme = settings.manifest.themeDropdown.element;
        var _blackListDomains = settings.manifest.blacklistedListBox.element;
		var _toBlackList = settings.manifest.domainToBlacklist.element;
		var _blackListAdd = settings.manifest.addBlacklistDomainButton.element;
		var _notification = settings.manifest.setNotification.element;
		//var _notificationTime = settings.manifest.setNotificationTime.element;

		var _delete = settings.manifest.deleteBlacklistDomainButton.element;
        var chromeExtensionSettings = (function () {
            var chaddonSettings = [];
            chaddonSettings.push({
                id: 'isInitialized',
                settings: {
                    isInitialized: true
                }
            });
            chaddonSettings.push({
                id: 'general',
                settings: {
                    setNotification: false
                  //  setNotificationTime: 10,
                }
            });
            /*chaddonSettings.push({
                id: 'appearance',
                settings: {
                    theme: 'default_theme',
                   // popupSize: 'medium-736x414'
                }
            });*/
		
			chrome.storage.sync.get({
							'blackList': blankArray
							}, function(items) {
							blackList = items.blackList;
							
							console.log("Value:" + blackList[4]);
			
			var count = blackList.length;
			for (var i = 0; i < count; i++){
	        document.getElementById("blacklistedListBox").innerHTML += "<option>" + blackList[i] + "</option>";
			};
			
		   // }
			});
            return {
                //set default settings
                _setDefaultSettings() {
                    //chrome.storage.sync.clear();
                    chrome.storage.sync.set({
                        chaddonSettings
                    });
                },
                //listeners for setting changes
                onchange() {
                    _setNotification.onchange = function () {
                            console.log("setNotification changed to ", _setNotification.checked)
							
							chrome.storage.sync.set({
							'setNotif': _setNotification.checked,
							}, function() {
							});
                        },
                      /*  _setNotificationTime.onchange = function () {
                            console.log("setNotificationTime changed to ", _setNotificationTime.value)
							chrome.storage.sync.set({
							'setNotifTime':  _setNotificationTime.value,
							}, function() {
							});
                        },

                        _theme.onchange = function () {
                            console.log("theme changed to ", _theme.selected)
							chrome.storage.sync.set({
							'theme':  _theme.selected,
							}, function() {
							});
							
                        },*/
						_toBlackList.onchange = function(){
							newDomain = _toBlackList.value;
							console.log("domain to blacklist changed to ", _toBlackList.value)
						}
						_blackListAdd.onclick = function(){
							var duplicate = false;
							
							chrome.storage.sync.get({
							'blackList': blankArray
							}, function(items) {
							blackList = items.blackList;
						
							});
							if(newDomain == null){
								duplicate = true;
								console.log("Null entry detected");
							}
							for(var i = 0; i < blackList.length; i++){
								if (newDomain == blackList[i]){
									duplicate = true;
									console.log("Duplicate entry detected.");
								}
							}
							
							if(duplicate == false){
							blackList.push(newDomain);
							
							chrome.storage.sync.set({
							'blackList': blackList,
							}, function() {
							});
							
							chrome.storage.sync.get({
							'blackList': blankArray
							}, function(items) {
							blackList = items.blackList;
							var counter = blackList[blackList.length];
							document.getElementById("blacklistedListBox").innerHTML += "<option>" + counter + "</option>";
							});
							}
							
							duplicate = false;
							
						}
						
						_delete.onclick = function(){
							
							var x;
							
							x = _blackListDomains[_blackListDomains.selectedIndex].value;
							x.toString();
							chrome.storage.sync.get({
							'blackList': blankArray
							}, function(items) {
							blackList = items.blackList;
						
							});
							for (var i = 0; i < blackList.length; i++){
								if(blackList[i] == x){
									blackList.splice(i,1);
								}
							}
							chrome.storage.sync.set({
							'blackList': blackList,
							}, function() {
							});
							console.log("Domain removed from blacklist: ", x)
						}

                }
            };
        })();

        chromeExtensionSettings._setDefaultSettings();
        chromeExtensionSettings.onchange();

        /*Retrieves all values in chrome storage */
        chrome.storage.sync.get(null, function (result) {
            console.log("Settings", result);
        });

        /*Listens for changes to chrome storage */
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            for (key in changes) {
              var storageChange = changes[key];
              console.log('Storage key [%s] in namespace [%s] changed. ' +
                'Old value was [%s], new value is [%s].',
                key,
                namespace,
                storageChange.oldValue,
                JSON.stringify(storageChange.newValue));
            }
          });
		  
		  
    });

});


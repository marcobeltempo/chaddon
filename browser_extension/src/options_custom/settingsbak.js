window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {

        var chromeExtensionSettings = (function () {
        var generalTabSettings = {
                enableNotifications: false,
                setNotificationTime: "0",
                isInitialized: true
            }
            //set Chaddon Chrome extension to default settings
             setDefaultSettingsInChromeStorage = function () {
                //reset the settings to default state
                this.generalTabSettings = [
                    enableNotifications = false,
                    setNotificationTime = 1,
                    isInitialized = true
                ];
                //save the default settings to Chrome storage
                chrome.storage.sync.set({
                    enableNotifications: this.generalTabSettings.enableNotifications,
                    setNotificationTime: this.generalTabSettings.setNotificationTime,
                    isInitialized: this.generalTabSettings.isInitialized
                });
                console.log('Extension settings have been reset to default');
            };

            updateExtensionSetting = function (key, value) {
                if (generalTabSettings.isInitialized) {
                    generalTabSettings[key] = value;
                    chrome.storage.sync.set({
                        key: value
                    }, function () {
                        console.log(key + ": has been changed to [" + generalTabSettings[key]  + "]");
                    });
                }
            };
            inject : () => chrome.extension.onMessage.addListener(
                function(request, sender, sendResponse) {
                    chrome.pageAction.show(sender.tab.id);
                  sendResponse();
                });
            

            return {
                getInitialized: function(){
                   return generalTabSettings.isInitialized; 
                },
                setDefaultSettings: function () {
                    setDefaultSettingsInChromeStorage();
                },
                updateSetting : function (key, newValue){
                    updateExtensionSetting(key, newValue);
                },
                getSettingValue: function(key){
        
                    return generalTabSettings[key];
                }
            };

        })();

        var manifestSettings = {
            enableNotifications: settings.manifest.enableNotifications.element,
            setNotificationTime: settings.manifest.setNotificationTime,
        };

        //set settings to deault if they haven't been initialized
        if(!chromeExtensionSettings.getInitialized()){
            chromeExtensionSettings.setDefaultSettings();
        }else{
            chromeExtensionSettings.updateSetting("enableNotifications", manifestSettings.enableNotifications.checked);
            chromeExtensionSettings.updateSetting("setNotificationTime", manifestSettings.setNotificationTime.element.value);
        }
        console.log("Enabled? ", chromeExtensionSettings.getSettingValue("enableNotifications"));

        //set the display activation and setNotificationTime
        manifestSettings.enableNotifications.onchange = function () {
            chromeExtensionSettings.updateSetting("enableNotifications", manifestSettings.enableNotifications.checked);
            ghost(!manifestSettings.enableNotifications.checked);
        };

        manifestSettings.setNotificationTime.element.onchange = function () {
            chromeExtensionSettings.updateSetting("setNotificationTime", manifestSettings.setNotificationTime.element.value);
        };

        function ghost(isDeactivated) {
            manifestSettings.enableNotifications.style.color = isDeactivated ? 'graytext' : 'black'; // The label color.
            manifestSettings.setNotificationTime.element.disabled = isDeactivated; // The control manipulability.
        };

        if (!manifestSettings.enableNotifications.checked) {
            ghost(true);
        }

    });
});

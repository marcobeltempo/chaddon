window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {

        var ManifestSettings = (function () {

            var userSettings = [
                {
                    id: "general",
                    _setNotificationChecked: settings.manifest.setNotification.element.checked,
                    _setNotificationStyleColor: settings.manifest.setNotification.element.style.color,
                    _setNotificationTime: settings.manifest.setNotificationTime,
                    _setNotificationTimeDisabled: settings.manifest.setNotificationTime.element.disabled,
                    _setNotificationTimeValue: settings.manifest.setNotificationTime.element.value,
                },
                {
                    id: "appearance",
                    theme: settings.manifest.themeDropdown,
                    popupSize: settings.manifest.popupWindowSize,
                }
            ];

            var userSettingsMap = new Map(userSettings.map(setting => [setting.id, setting]));
       /*     return {
                updateNotifications: userSettings.general._setNotificationChecked.onchange = function () {
                    console.log("Checked? ", userSettings.general._setNotificationChecked)
                    chrome.storage.sync.get('chaddonDefault', function (result) {
                        console.log(" updateNotifications(): ", result);
                        //{'chaddonDefault':['general']['setNotification']}
                        chrome.storage.sync.set(result[chaddonDefault.general.setNotification], function (result) {
                            console.log("About to set:", result);

                        })
                    })
                }
            };
*/
        })();
      //  ManifestSettings.updateNotifications();

    });
});
/* 
                    //set settings to deault if they haven't been initialized
                    if (!chromeExtensionSettings.getInitialized()) {
                        chromeExtensionSettings.setDefaultSettings();
                    } else {
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
            }); */
window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {

        var _setNotification = settings.manifest.setNotification.element;
        var _setNotificationTime = settings.manifest.setNotificationTime.element;
        var _popupSize = settings.manifest.popupWindowSize.element;
        var _theme = settings.manifest.themeDropdown.element;
        var _blackListDomains = settings.manifest.blacklistedListBox.element;
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
                    setNotification: false,
                    setNotificationTime: 10,
                }
            });
            chaddonSettings.push({
                id: 'appearance',
                settings: {
                    theme: 'default_theme',
                    popupSize: 'medium-736x414'
                }
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
                            console.log("setNotification changed to ", _setNotification.value)
                        },
                        _setNotificationTime.onchange = function () {
                            console.log("setNotificationTime changed to ", _setNotificationTime.value)
                        },
                        _popupSize.onchange = function () {
                            console.log("popupSize changed to ", _popupSize.value)
                        },

                        _theme.onchange = function () {
                            console.log("theme changed to ", _theme.value)
                        }

                }
            };
        })();

        chromeExtensionSettings._setDefaultSettings();
        chromeExtensionSettings.onchange();
        chrome.storage.sync.get(null, function (result) {
            console.log("Settings", result);
        });
    });
});
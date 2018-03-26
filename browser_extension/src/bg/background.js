var BackgroundSettings = (function () {

  function _getDefaultSettings() {
    var defaultSettings = [{
        id: 'isInitialized',
        settings: {
          isInitialized: true,
        }
      },
      {
        id: 'general',
        settings: {
          setNotification: false,
          setNotificationTime: 10,
        }
      },
      {
        id: 'appearance',
        settings: {
          theme: 'default_theme',
          popupSize: 'medium-736x414'
        }
      }
    ]
    return defaultSettings;
  }
  var _defaultSettingsMap = new Map(_getDefaultSettings().map(setting => [setting.id, setting]));


  var _setDefaultSettings = function () {
    chrome.storage.sync.clear();
    let keys = Array.from( _defaultSettingsMap.keys() );
    let values = Array.from( _defaultSettingsMap.values() );

      chrome.storage.sync.set({values} );
      
      chrome.storage.sync.get(null, function (result) {
        console.log("Setting",  result);
      });
     

    /*
    console.log("Is initialized before default? ", _isDefaultInitialized());
    console.log("Restoring default settings", _getDefaultSettings());
    var chaddonDefault = _getDefaultSettings()['chaddonDefault'];

    chrome.storage.sync.set({
      chaddonDefault,
      function (result) {
        var gen = chrome.storage.sync.get('chaddonDefault', function (result) {});

      }
    }) */

  };

  var _isDefaultInitialized = function () {
    _setDefaultSettings();
    
  }

  //public
  var settingObject = {
    initSettings: function () {
      _setDefaultSettings();
    }
  };
  return settingObject;

})();


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

BackgroundSettings.initSettings();


/*
     chrome.storage.sync.clear();
      chrome.storage.sync.get('chaddonDefaultSettings', function (result) {
        console.log("Cleared?", result);
        });
   */
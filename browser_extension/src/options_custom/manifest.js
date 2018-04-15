

this.manifest = {
    "name": "Chaddon Settings",
    "icon": "../../icons/icon48.png",
    "settings": [{
            "tab": "General",
            "group": "Notifications",
            "name": "setNotification",
			"id": "setNotification",
            "type": "checkbox",
            "label": "enable/disable"
        },
	
		
        
        {
            "tab": "General",
            "group": "Notifications",
            "name": "setNotificationTime",
            "type": "popupButton",
            "label": "Recieve notifications every:",
            "options": {
                "values": [{
                        "value": "1",
                        "text": "1 Minute"
                    },
                    {
                        "value": "10",
                        "text": "10 Minutes"
                    },
                    {
                        "value": "30",
                        "text": "30 Minutes"
                    }
                ]
            },
        },
        {
            "tab": "Appearance",
            "group": "Theme",
            "name": "themeDropdown",
			"id" : "themeDropdown",
            "type": "popupButton",
            "label": "Select a theme:",
            "options": {
                "values": [{
                        "value": "default-theme",
                        "text": "Default Theme"
                    },
                    {
                        "value": "light-theme",
                        "text": "Light Theme"
                    },
                    {
                        "value": "dark_theme",
                        "text": "Dark Theme"
                    }
                ]
            },
        },
      
        {
         "tab": "Blacklisted Domains",
        "group": "Blacklisted",
        "name": "domainToBlacklist",
        "type": "text",
        "label": "",
        "text": "Add a domain to blacklist"
    },
    {
    "tab": "Blacklisted Domains",
       "group": "Blacklisted",
       "name": "addBlacklistDomainButton",
       "type": "button",
       "label": "",
       "text": "Add"
   },
        {
            "tab": "Blacklisted Domains",
            "group": "Blacklisted",
            "name": "blacklistedListBox",
			"id": "blacklistedListBox",
            "type": "listBox",
            "label": "Chaddon will not enter a chatroom while browsing the domains listed below. (Refresh the page to see the updated blacklist)",
            "options": [
			
				]
                
        },
        {
            "tab": "Blacklisted Domains",
               "group": "Blacklisted",
               "name": "deleteBlacklistDomainButton",
               "type": "button",
               "label": "",
               "text": "Delete"
           },
    ]
    
};
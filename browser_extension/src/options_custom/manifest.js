this.manifest = {
    "name": "Chaddon Settings",
    "icon": "../../icons/icon48.png",
    "settings": [{
            "tab": "General",
            "group": "Login",
            "name": "username",
            "type": "text",
            "label": "username",
            "text": "Username"
        },
        {
            "tab": "General",
            "group": "Login",
            "name": "password",
            "type": "text",
            "label": "password",
            "text": "Password",
            "masked": true
        },
        {
            "tab": "General",
            "group": "Login",
            "name": "myDescription",
            "type": "description",
            "text": "description"
        },
        {
            "tab": "General",
            "group": "Incognito",
            "name": "enableIncognito",
            "type": "checkbox",
            "label": "enable/disable"
        },
        {
            "tab": "General",
            "group": "Notifications",
            "name": "setNotification",
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
            "tab": "Apperance",
            "group": "Theme",
            "name": "themeDropdown",
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
            "name": "blacklistedListBox",
            "type": "listBox",
            "label": "Chaddon will not launch while browsing the domains listed below.",
            "options": [{
                    "value": "http://www.example.com",
                    "text": "http://www.example.com"
                },
                {
                    "value": "http://www.example.ca",
                    "text": "http://www.example.ca"
                },
                {
                    "value": "http://www.example.io",
                    "text": "http://www.example.io"
                }
            ]
        },
        {
            "tab": "Apperance",
            "group": "Size",
            "name": "popupWindowSize",
            "type": "radioButtons",
            "label": "Select a popup size:",
            "options": [{
                    "value": "small-823x411",
                    "text": "Small (823 x 411)"
                },
                {
                    "value": "medium-736x414",
                    "text": "Medium (736 x 414)"
                },
                {
                    "value": "large-1355x1025",
                    "text": "Large (1355 x 1025)"
                }
            ]
        }
  ],
    "alignment": [
        [
            "username",
            "password"
        ]
    ]
};
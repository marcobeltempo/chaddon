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
      "options": []
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

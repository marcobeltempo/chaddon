### Whats new

- Chatroom extensionbuilt using the Chrome api to load on the front end compared to a loaded iframe in v0.1.0

- Displays an in line notification when another user:
   - typing
   - joins a room
   - leaves a room

- Recieve notifications for `@mentions`
- Login with with your Google account directly from the chrome browser
- New chrome settings page 
- New user popup widget
- A cleaner side button to toggle the chatroom
- Moved front end verification to servers
- Background scripts for accessing `chrome storage`
- Google people api for retrieving usernames and profile pictures

Known Bugs
- channels are only available for Google users. Guest users are placed into a general chat
- chatroom state does not persist once the page is reloaded
- message history is not stored

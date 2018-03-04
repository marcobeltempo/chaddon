This hierarchy is based on the chaddon's master branch. Please update as new files and functions are added. 

***

[/chaddon](#chaddon)
  * src/ 
    * [chaddon.js](#srcchaddonjs)
    * [chrome_extension](#chrome_extension)
      * [content.js](#chrome_extensioncontentjs)
    * [config](#srcconfig)
      * [db.js](#srcconfigdbjs)
      * [index.js](#srcconfigindex.js)
    * [public](#srcpublic)
      * [images](#srcpublicimages)
      * [scripts](#srcpublicscripts)
        * [chat.js](#srcpublicscriptschatjs)
        * [chatroom.js](#srcpublicscriptschatroomjs)
        * [googleAuthentication.js](#srcpublicscriptsgoogleauthenticationjs)
      * [stylesheets](#srcpublicstylesheets)
        *  [login.css](#srcpublicstylesheetslogincss)
        *  [style.css](#srcpublicstylesheetsstylecss)
    * [routers](#srcrouters)
      * [index.js](#srcroutersindexjs)
    * [views](#srcviews)
      * [index.html](#srcviewsindexhtml)
      * [login.html](#srcviewsloginhtml)    

***

## /src
### /src/chaddon.js

```js
//[Deprecated] - sets the the dependencies being used 
app.configure(function(){...})
```

```js
//[Deprecated] - determines how express handles errors in production and development mode
app.configure('{development | production}', function()...) 
```

```js
//[Deprecated] - redirects user to 'views/index.html' when accessing the root. The use of sendFile() needs to be updated. 
app.get('/', function(req, res) {
    params = req.params.id;
	res.sendfile('views/index.html', {root:__dirname});
    });
```

```js
//[Deprecated] - redirects user to 'views/login.html'. The use of sendFile() needs to be updated. 
app.get('/login', function(req, res) {
        params = req.params.id;
        res.sendfile('views/login.html', {root:__dirname});
    });
```

```js
//[Deprecated] - parses the parameter following 'root/' and uses it as a page id. "views/chatroom.html" is then loaded. The use of sendFile() needs to be updated. 
app.get('/:id', function(req, res) {
    params = req.params.id;
	res.sendfile('views/chatroom.html', {root:__dirname});
    });
```

```js
// development mode uses `localhost:3000` | production mode uses the environment variable port
io = io.listen(app);
var port = process.env.PORT || 3000;
```

```js
//decodes url characters by replacing ASCII characters
function htmlEntities(str) {...}
```

```js
//activates the socket listener
//stores valid username in socket session  
io.sockets.on('connection', function(socket){..}
```

```js
//adds the new user to the chatroom user list
io.sockets.in(socket.room).emit("updateUsers", {usernames:localUser[""+params]})
```

```js
//appends new message after clicking the "Send" button.
socket.on('message', function(msg) {...}
```

```js
//removes the user from the chatroom/ user list once they leave a chatroom
socket.on('disconnect', function() {...}
```
[Back to Top](#srcchaddon)

***

### /package.json

See [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json) for more info.

[Back to Top](#srcchaddon)

## /chrome_extension
### chrome_extension/content.js

```js
//listener is fired on run time to check if the add on icon has been clicked. 
//on click the "getURL" function parses the URL and prints it to the developer console.
chrome.runtime.onMessage.addListener(
    function getUrl (request, sender, sendResponse) { ... } )
```
[Back to Top](#srcchaddon)

***
## /src/config
### db.js
### index.js
## /src/public

### /src/public/images
[Back to Top](#srcchaddon)

### /src/public/scripts
### /src/public/scripts/chat.js
### /src/public/scripts/chatroom.js
### /src/public/scripts/googleAuthentication.js
[Back to Top](#chaddon)

### /src/public/stylesheets
### /src/public/stylesheets/login.css
### /src/public/stylesheets/style.css
[Back to Top](#srcchaddon)

***

## /src/routers
### /src/routers/index.js
[Back to Top](#srcchaddon)

***

## /src/views
### /src/views/chatroom.html
### /src/views/index.html
### /src/views/login.html
[Back to Top](#srcchaddon)

***
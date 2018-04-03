---
layout: default
---
![alt text](https://travis-ci.com/marcobeltempo/chaddon.svg?token=M3Dz3y61ixyrS7SXSzMF&branch=dev
 "Travis CI Build Status:Dev Branch")

**Chaddon** is a browser extensions that detects an active tab's url and connects you with other users currently browsing the same domain to a dynamic chatroom.

This project has been developed and maitained by Michael Pierre, Evan Davies, Geoff McCollam and Marco Beltempo.

Although Chaddon is still in it's early stages, the team plans to have the extension publically available in the Chrome Webstore by late April 2018.

For now feel free to download the source code to test the extension locally. Or try the demo over at [app.chaddon.ca](http://app.chaddon.ca/)

## [](#chromeextensioninstall) Browser Extension Dev-Install

**Requirements**
- Google Chrome Browser 
<a src="google.com">chaddon</a>
### Installation
1. Download the `.zip` or `.tar.` from the top right of this page
2. Save the file to your local machine
3. Extract the downloaded folder to the current directory
4. Open a Google Chrome Browser
5. Enter `chrome://extensions/` in the address bar
6. Make sure `Developer Mode` is checked
7. Click `Load unpacked extension...`
8. Navigate to the downloaded package and select the `chaddon/chrome_extension` folder
9. Chaddon 0.1 will display in your list of extensions

## [](#usingchaddon) Using Chaddon

1. Navigate to a url ex. `https://google.ca`
2. A Chaddon hover box will appear at the top right of your screen
3. Click the hover box to load the chat for your current URL
4. On first launch, you will be prompted to login
  - Create a temporary username
  - Sign-in with a valid Google account

## [](#buildsource) Build Source
1.  Fork the chaddon repository to your profile
2. `git clone https://github.com/marcobeltempo/chaddon`
3. `cd chaddon`
4. `npm install`
5. `npm run start`
6.  Navigate to https://localhost:3000/ to view the results


## [](#authors) Authors
* **Michael Pierre**
* **Evan Davies**
* **Geoff McCollam**
* **Marco Beltempo**

***

**[License](https://github.com/marcobeltempo/chaddon/blob/dev/LICENSE) |** 
**[Privacy Policy](https://github.com/marcobeltempo/chaddon/blob/dev/PRIVACY.md)**

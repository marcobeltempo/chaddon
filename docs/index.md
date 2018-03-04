---
layout: default
---

![Chaddon Logo](http://i64.tinypic.com/nd7mop.jpg)

# [](#home)Chaddon Wiki

Welcome to the Chaddon Wiki. These pages are primarily intended for Chaddon developers. 

Please refer to the sidebar (on the left) for details on Project Structure, Contributing Guidelines, and Documentation.

![alt text](https://travis-ci.com/marcobeltempo/chaddon.svg?token=M3Dz3y61ixyrS7SXSzMF&branch=dev
 "Travis CI Build Status:Dev Branch")

## [](#chromeextensioninstall) Chrome Extension Dev-Install

### Requirments
- Google Chrome Browser 

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
  - Sig-in with a valid Google account

## [](#buildsource) Build Source
1.  Fork the chaddon repository to your profile
2. `git clone https://github.com/marcobeltempo/chaddon`
3. `cd chaddon`
4. `npm install`
5. `npm run start:dev` //(uses nodemon to watch for changes)
6.  Navigate to https://localhost:3000/ to view the results

## [](#authors) Authors
* **Michael Pierre**
* **Evan Davies**
* **Geoff McCollam**
* **Marco Beltempo**

***

**[License](https://github.com/marcobeltempo/chaddon/blob/dev/LICENSE) |** 
**[Privacy Policy](https://github.com/marcobeltempo/chaddon/blob/dev/PRIVACY_POLICY.md)**

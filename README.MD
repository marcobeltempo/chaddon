# Chaddon v0.2.0

![alt text](https://travis-ci.com/marcobeltempo/chaddon.svg?token=M3Dz3y61ixyrS7SXSzMF&branch=dev "Travis CI Build Status:Dev Branch")
![Heroku](https://heroku-badge.herokuapp.com/?app=chaddon-dev-v2)

Chaddon is a browser extension that detects an active tab’s url and connects you with other users currently browsing the same domain to a dynamic chatroom.

This project has been developed and maintained by [Michael Pierre](https://github.com/MPierre9), [Evan Davies](https://github.com/EmdaviesSeneca), [Geoff McCollam](https://github.com/GeoffMcCollam) and [Marco Beltempo](https://github.com/marcobeltempo)
 

Although Chaddon is still in its early stages, the team plans to have the extension publicly available in the Chrome Webstore by late April 2018.

For now feel free to download the source code to test the extension locally or try the demo over at [app.chaddon.ca](http://app.chaddon.ca)

---

## Chrome Extension Installation
1. Download the [.zip](https://github.com/marcobeltempo/chaddon/zipball/master) or [.tar](https://github.com/marcobeltempo/chaddon/tarball/master) file
2. Save the file to your local machine
3. Extract the downloaded folder to the current directory
4. Open a Google Chrome Browser
5. Enter `chrome://extensions/` in the address bar
6. Make sure `Developer Mode` is checked
7. Click `Load unpacked extension...`
8. Navigate to the downloaded package and select the `chaddon/browser_extension` folder
9. Chaddon 0.2.0 will display in your list of extensions

---
## Build and Run

For more detailed information visit our [Development-Environment-Setup](https://github.com/marcobeltempo/chaddon/wiki/Development-Environment-Setup) wiki.

### Getting the sources
`git clone https://github.com/marcobeltempo/chaddon`

### Prerequisites
* [git](https://git-scm.com/) 
* [Node.JS](https://nodejs.org/en/), >= 8.9.1, < 9.0.0 
* npm v5.5 and up
* Google Chrome v65.0 and up
* pgAdmin 4 v2.1 (optional)

1. `cd chaddon`
2. `npm install`

### Build
From a terminal, where you have cloned the Chaddon repository, execute the following command to run the nodemon server:

`npm start`

It will do an initial full build and then watch for file changes, compiling those changes incrementally, enabling a fast, iterative coding experience.

### Run
To test the changes you launch a development version of the Chaddon extension
1. Enter `chrome://extensions/` in the Chrome address bar
2. Enable `Developer Mode`
3. Click `Load unpacked extension...`
4. Navigate to the downloaded package and select the `chaddon/browser_extension` folder
5. Enable Chaddon 0.2.0 in your extension list
   - **Note** the localhost server must be running without any errors

---

## Scripts
* `npm start` - uses nodemon to start the server and watch for any changes 
* `npm test` - executes eslint + prettier
* `npm run test:lint:fix` - automatically fix any styling and validation errors. (Double check your changes)

---

## Contributing

### Submitting a Pull Request

Even if you have push rights on the `marcobeltempo/chaddon` repository, you should create a personal fork and create feature branches there when you need them. This keeps the main repository clean and your personal workflow cruft out of sight.
Make sure to go through the following checklist before submitting and merging a pull request.

**Checklist** 

- create a feature branch for big changes
- execute `npm test` before pushing changes upstream
  - linting errors will cause Travis CI to fail
  - if there are errors, execute `npm run test:lint:fix` to automatically fix them
- when submitting a pull request, make sure to detail:
  - [ ] the newly added feature or bug fix
  - [ ] known bugs
  - [ ] any additional steps to reproduce or test
  - [ ] delete the remote feature branch after it has been successfully merged

---

## Authors

* [**Michael Pierre**](https://github.com/MPierre9)
* [**Evan Davies**](https://github.com/EmdaviesSeneca)
* [**Geoff McCollam**](https://github.com/GeoffMcCollam)
* [**Marco Beltempo**](https://github.com/marcobeltempo)
 
---

**[License](LICENSE) |** 
**[Privacy Policy](PRIVACY.md)**

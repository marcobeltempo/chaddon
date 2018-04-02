# Chaddon v0.2.0

![alt text](https://travis-ci.com/marcobeltempo/chaddon.svg?token=M3Dz3y61ixyrS7SXSzMF&branch=dev "Travis CI Build Status:Dev Branch")
![Heroku](https://heroku-badge.herokuapp.com/?app=chaddon-dev&style=flat)

---
## Chrome Extension Dev-Install
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
## Build Source

**Prerequisites**
* node v8.9 and up
* npm v5.5 and up
* Google Chrome v65.0 and up

**Instrucitons**
1.  Fork the chaddon repository to your profile
2. `git clone https://github.com/marcobeltempo/chaddon`
3. `cd chaddon`
4. `npm install`
5. `npm start` //(uses nodemon to watch for changes)
6.  Navigate to http://localhost:3000/ to view the results

### Dev-Environment Setup
* [Wiki: Development-Environment-Setup](https://github.com/marcobeltempo/chaddon/wiki/Development-Environment-Setup)
Setup chaddon on your local machine

---

## Running Tests

* `npm start:dev` - automatically refreshes the server when changes are made
* `npm test` - performs an eslint + prettier
* `npm run test:lint:fix` - automatically fix any styling and validation errors. (Double check your changes)

---
## Contributing

### Submitting a Pull Request

Make sure to go through the following checklist before submitting and merging a pull request.

- Create a feature branch for big changes to ensure all Travis CI tests are passing. (Avoid contributing diretly to the `dev` branch)
- execute `npm test` before pushing changes upstream
  - linting errors will cause Travis CI to fail
  - if there are errors, execute `npm run test:lint:fix` to automatically fix them
- when submitting a pull request, make sure to detail:
  - the newly added feature or bug fix
  - known bugs
  - any additional steps 
  - delete the remote feature branch after it has been successfully merged

---

## Authors

* [**Michael Pierre**](https://github.com/MPierre9)
* [**Evan Davies**](https://github.com/EmdaviesSeneca)
* [**Geoff McCollam**](https://github.com/GeoffMcCollam)
* [**Marco Beltempo**](https://github.com/marcobeltempo)
 
---

**[License](LICENSE) |** 
**[Privacy Policy](PRIVACY)**

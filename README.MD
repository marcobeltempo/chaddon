![alt text](https://travis-ci.com/marcobeltempo/chaddon.svg?token=M3Dz3y61ixyrS7SXSzMF&branch=dev
 "Travis CI Build Status:Dev Branch")
### Prerequisites

* node v8.9 and up
* npm 5.5 and up

### Build Source
1.  Fork the chaddon repository to your profile
2. `git clone https://github.com/marcobeltempo/chaddon`
3. `cd chaddon`
4. `npm install`
5. `npm run start:dev` //(uses nodemon to watch for changes)
6.  Navigate to https://localhost:3000/ to view the results

### Dev-Environment Setup
[Wiki: Development-Environment-Setup](https://github.com/marcobeltempo/chaddon/wiki/Development-Environment-Setup)
Setup chaddon on your local machine

## Running Tests
* `npm start:dev` - automatically refreshes the server when changes are made
* `npm test` - performs an eslint + prettier
* `npm run test:lint:fix` - automatically fix any styling and validation errors. (Double check your changes)

### Chrome Extension Dev-Install

## Contributing

### Submitting a Pull Request
Make sure to go through the following checklist before submitting and merging a pull request.

- Create a feature branch for big changes to ensure all Travis CI tests are passing. (Avoid contributing diretly to the `dev` branch)
- execute `npm test` before pushing changes upstream
  - linting errors will cause Travis CI to fail
  - if there are errors, execute `npm run test:lint:fix`to automatically fix them
- when submitting a pull request, make sure to detail:
  - the newly added feature or bug fix
  - known bugs
  - any additional steps 
  - delete the remote feature branch after it has been successfully merged

## Authors
* **Michael Pierre**
* **Evan Davies**
* **Geoff McCollam**
* **Marco Beltempo**

***

**[License](https://github.com/marcobeltempo/chaddon/blob/dev/LICENSE) |** 
**[Privacy Policy](https://github.com/marcobeltempo/chaddon/blob/dev/PRIVACY_POLICY.md)**

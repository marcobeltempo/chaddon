# Contributing

## Submitting a Pull Request

Even if you have push rights on the `marcobeltempo/chaddon` repository, you should create a personal fork and create feature branches there when you need them. This keeps the main repository clean and your personal workflow cruft out of sight.
Make sure to go through the following checklist before submitting and merging a pull request.

**Checklist** 
A pull request template has been made avaiable [PULL_REQUEST_TEMPLATE](PULL_REQUEST_TEMPLATE.md)

- create a feature branch for big changes
- execute `npm test` before pushing changes upstream
  - linting errors will cause Travis CI to fail
  - if there are errors, execute `npm run test:lint:fix` to automatically fix them
- when submitting a pull request, make sure to detail:
  - [ ] the newly added feature or bug fix
  - [ ] known bugs
  - [ ] any additional steps to reproduce or test
  - [ ] delete the remote feature branch after it has been successfully merged

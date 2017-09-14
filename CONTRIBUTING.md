# How to contribute

I'm really glad you're reading this, because this means that you are interested in contributing to my project. Creating a PR, opening an issue or fix a typo, every kind of contribution is welcome.

## How to start primeng-advanced-growl

1. After you have forked and cloned the repo run a npm install
2. Navigate to the root folder (the folder where the package.json is located)
3. type npm run start - this command opens the test page on localhost:4200
4. type npm run test to run the tests

## Folder structure
The app has two main folders:
1. **lib:** this folder contains the actual library code. This is also the folder that will then be delivered via npm to the consumer of the library. Notice that this folder also contains the unit tests for the library.
2. **test:** this folder contains a test page where we test our own library. It uses the library like a consumer would. Notice that this page will not be delivered via npm but it will be deployed on primeng-advanced-growl.firebaseapp.com with each release.

## How to make a clean pull request

1. Create a personal fork of the project on Github.
2. Clone the fork on your local machine. Your remote repo on Github is called origin.
3. Add the original repository as a remote called upstream. (If you created your fork a while ago be sure to pull upstream changes into your local repository.)
4. Create a new branch to work on! Branch from develop.
5. Implement/fix your feature.
6. Expand/adjust the test, run them!
7. Document your changes in the README.md.
8. If possible demonstrate your feature in the testpage.
9. Push your branch to your fork on Github, the remote origin.
10. From your fork open a pull request in the correct branch. Target the project's develop branch.
11. Once the pull request is approved and merged you can pull the changes from upstream to your local repo and delete your extra branch(es).
And last but not least: Always write your commit messages in the present tense. Your commit message should describe what the commit, when applied, does to the code – not what you did to the code.

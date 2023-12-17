#!/usr/bin/env node

const { execSync } = require('child_process');

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone https://github.com/rua109/create-react-app-swc.git ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;
const initGitCommand = `cd ${repoName} && rm -rf .git && git init && git add . && git commit -m "Initialize project using Create React app swc"`;

console.log(`Creating a new React app ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) {
  process.exit(-1);
}

console.log(`Installing packages. This may take a couple of minutes.`);
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) {
  process.exit(-1);
}

const initializedGit = runCommand(initGitCommand);
if (!initializedGit) {
  process.exit(-1);
}
console.log(`Created git commit.`);

console.log(`Success! created ${repoName}
Inside the directory you can run several commands.

npm run start
  Starts the development server

npm run storybook
  Starts the storybook 

npm run test
  Runs the jest test

npm run build
  Creates a build
`);

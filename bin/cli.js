#!/usr/bin/env node

const { execSync } = require('child_process');
const { updatepackage } = require('./update_package');

const switchToDefaultColor = `\x1b[0m`;
const switchToGreenColor = `\x1b[32m`;
const switchToRedColor = `\x1b[31m`;
const switchToBlueColor = `\x1b[34m`;
const switchToyellowColor = `\x1b[33m`;

const runCommand = (command, { mute = false } = {}) => {
  try {
    execSync(`${command}`, { stdio: mute ? 'pipe' : 'inherit' });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};

const repoName = process.argv[2] ?? 'example';
const gitCheckoutCommand = `git clone https://github.com/rua109/create-react-app-swc.git ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;
const initGitCommand = `cd ${repoName} && rm -rf .git && git init && git add . && git commit -m "Initialize project using Create React app swc"`;
const cleanupDir = `cd ${repoName} && rm -rf bin && rm -rf docs`;

console.log(`Creating a new React app ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) {
  process.exit(-1);
}

console.log(`Installing packages. This may take a couple of minutes.
`);
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) {
  process.exit(-1);
}

const initializedGit = runCommand(initGitCommand, { mute: true });
if (!initializedGit) {
  process.exit(-1);
}
console.log(`Created git commit.
`);

const cleanedDir = runCommand(cleanupDir, { mute: true });
if (!cleanedDir) {
  process.exit(-1);
}

updatepackage({ name: repoName, author: 'unknown' });

console.log(`Success! created ${repoName}
Inside the directory you can run several commands.

${switchToBlueColor} npm run start ${switchToDefaultColor}
  Starts the development server

${switchToBlueColor} npm run storybook ${switchToDefaultColor}
  Starts the storybook 

${switchToBlueColor} npm run test ${switchToDefaultColor}
  Runs the jest test

${switchToBlueColor} npm run build ${switchToDefaultColor}
  Creates a build
`);

const fs = require('fs');
const path = require('path');

const PACKAGE_NAME = `package.json`;

function updatePackage({ name, author }) {
  try {
    console.log(`updating ${name}/${PACKAGE_NAME}
    `);
    // Resolve the full path to package.json
    const filePath = path.resolve(`${name}/${PACKAGE_NAME}`);

    // Read the package.json file
    const packageJson = require(filePath);

    // Update the name property
    packageJson.name = name;
    // Update the version number
    packageJson.version = '0.0.0';
    // Update author
    packageJson.author = author;
    // delete license
    delete packageJson.license;
    // delete scripts
    delete packageJson.scripts.pub;
    // Docs
    delete packageJson.directories;
    // Repository
    delete packageJson.repository;
    // bugs
    delete packageJson.bugs;
    // home page
    delete packageJson.homepage;
    // bin
    delete packageJson.bin;

    // Write the updated package.json back to the file
    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
  } catch (error) {
    console.error('Error updating package name:', error.message);
  }
}

module.exports = {
  updatePackage,
};

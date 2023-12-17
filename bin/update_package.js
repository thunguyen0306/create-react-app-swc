const fs = require('fs');

const PACKAGE_NAME = `package.json`;

function updatePackage({ name, author }) {
  try {
    // Read the package.json file
    const packageJson = require(PACKAGE_NAME);

    // Update the name property
    packageJson.name = name;
    // Update the version number
    packageJson.version = '0.0.0';
    // Update author
    packageJson.author = author;
    // delete license
    delete packageJson.license;
    // Docs
    delete packageJson.directories;
    // Repository
    delete packageJson.respository;
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

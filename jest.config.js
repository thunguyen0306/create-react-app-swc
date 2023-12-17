module.exports = {
  setupFiles: ['./jest-setup.js'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['./jest-setup-after-env.js'],
};

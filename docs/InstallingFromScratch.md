# Basic setup

### `@swc/core`

Install dependencies to compile ES6 typescript code

```bash
npm i --save-dev @swc/cli @swc/core @swc/helpers
```

Note: `@swc/helpers` is a required dependency for `externalHelpers`; see `.swcrc`

### `swc-loader`

This module allows `swc` to work with webpack

```bash
npm i --save-dev swc-loader
```

Create `.swcrc` and add

```json
{
  "jsc": {
    "parser": {
      "syntax": "ecmascript",
      "jsx": true
    },
    "externalHelpers": true
  }
}
```

`jsx` allows compiling React `jsx` syntax

`externalHelpers` reduces bundle size by removing helper function inlined into the output files and importing it instead from `node_modules/@swc/helpers`

## `Typescript`

SWC only transpiles the code and doesn't perform type checking. Therefore, it's still recommended that we install tsc for detecting any type errors. This is very similar to using `babel-loader`

```sh
npm install --save-dev typescript @types/node @types/react @types/react-dom @types/jest
```

## `@tsconfig/create-react-app`

A base TSConfig for working with Create React App.

```sh
npm install --save-dev @tsconfig/create-react-app
```

`tsconfig.json`

```json
// prettier-ignore
{
  "extends": "@tsconfig/create-react-app/tsconfig.json",     
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    "noImplicitAny": false,

    /* Completeness */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}
```

## `webpack`

Install basic webpack components

```bash
npm i --save-dev webpack webpack-cli webpack-dev-server
```

Install webpack plugins to manage split configurations

```bash
npm i --save-dev clean-webpack-plugin webpack-merge
```

## `html-webpack-plugin`

The HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles. This is especially useful for webpack bundles that include a hash in the filename which changes every compilation (cache busting). You can either let the plugin generate an HTML file for you, supply your own template using lodash templates, or use your own loader.

```bash
npm install --save-dev html-webpack-plugin
```

## `terser-webpack-plugin`

This plugin uses terser to minify/minimize your JavaScript.

Webpack v5 comes with the latest terser-webpack-plugin out of the box

---

Create following files:

`package.json`

```json
  "scripts": {
    "start": "webpack-dev-server  --config webpack.dev.js --open",
    "build": "webpack --config webpack.prod.js",
  },
```

`webpack.common.js`

```js
module.exports = {
  entry: {
    main: './src/index.js',
  },
};
```

`webpack.dev.js`

```js
const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
});
```

`webpack.prod.js`

```js
const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
    ],
  },
  plugins: [new CleanWebpackPlugin()],
});
```

## `react`

Install react

```sh
npm i react react-dom
```

---

`webpack.common.js`

```js
module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
        },
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
};
```

---

## `PostCSS`

PosrCSS is a tool for CSS syntax transformations. It allows you to define custom CSS like syntax that could be understandable and transformed by plugins.

```sh
npm install --save-dev postcss-loader postcss
```

The style loader takes CSS and actually inserts it into the page so that the styles are active on the page. The CSS loader takes a CSS file and returns the CSS with imports and url(...) resolved via webpack's require functionality

```sh
npm install --save-dev style-loader css-loader
```

## `mini-css-extract-plugin`

By default the `css` is part of the `javascript` bundle. This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps.

```sh
npm install --save-dev mini-css-extract-plugin
```

## `css-minimizer-webpack-plugin`

This plugin uses cssnano to optimize and minify your CSS.

```sh
npm install css-minimizer-webpack-plugin --save-dev
```

---

`webpack.dev.js`

```js
module.exports = merge(common, {
  module: {
    rules: [
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [
          'style-loader', //3. Inject styles into DOM
          'css-loader', //2. resolvs css imports
          'postcss-loader', //1. Apply css transformations
        ],
      },
    ],
  },
});
```

`webpack.prod.js`

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })],
  module: {
    rules: [
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [
          MiniCssExtractPlugin.loader, //3. Extract css into files
          'css-loader', //2. Turns css into commonjs
          'postcss-loader', //1. Turns sass into css
        ],
      },
    ],
  },
});
```

## Creating a basic react project

In `typings.d.ts`

```ts
declare module '*.svg';
```

In `src/App.css`

```css
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

In `App.tsx`

```tsx
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

In `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>host</title>
  </head>

  <body>
    <div id="app"></div>
  </body>
</html>
```

In `index.css`

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

In `index.js`

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

In `logo.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3"><g fill="#61DAFB"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/><circle cx="420.9" cy="296.5" r="45.7"/><path d="M520.5 78.1z"/></g></svg>
```

## `tailwindcss`

Install tailwindcss and its peer dependencies via npm, and then run the init command to generate both tailwind.config.js and postcss.config.js.

```sh
npm install -save-dev tailwindcss autoprefixer postcss-import postcss-nesting
npx tailwindcss init -p
```

In `postcss.config.js`

```js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

In `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Add the @tailwind directives for each of Tailwind’s layers to your main CSS file. In `index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## `eslint`

1. `npm install eslint --save-dev` - install the latest `eslint` package version.

2. `npx eslint --init` - set up a configuration file for `eslint`. This command will ask you a few questions via CLI. Here's a list of them, and the answers we'll need to choose (`✔` and `❯` symbols indicate the selected answers):

```bash
# question 1:
? How would you like to use ESLint? …
  To check syntax only
  To check syntax and find problems
❯ To check syntax, find problems, and enforce code style

# question 2:
? What type of modules does your project use? …
❯ JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these

# question 3:
? Which framework does your project use? …
❯ React
  Vue.js
  None of these

# question 4 (select "Yes" because we are using Typescript):
? Does your project use TypeScript? › No / Yes

# question 5:
? Where does your code run? …
✔ Browser
  Node

# question 6:
? How would you like to define a style for your project? …
❯ Use a popular style guide
  Answer questions about your style
  Inspect your JavaScript file(s)

# question 7 (we'll rely on Airbnb's JavaScript style guide here):
? Which style guide do you want to follow? …
❯ Standard: https://github.com/standard/standard
  Google: https://github.com/google/eslint-config-google

# question 8:
? What format do you want your config file to be in? …
  JavaScript
  YAML
❯ JSON

# the final prompt here is where eslint will ask you if you want to install all the necessary dependencies. Select "Yes" and hit enter:

✔ Which package manager do you want to use? · npm

Installing eslint-plugin-react@latest, eslint-config-standard-with-typescript@latest, @typescript-eslint/eslint-plugin@^5.0.0, eslint@^8.0.1, eslint-plugin-import@^2.25.2, eslint-plugin-n@^15.0.0, eslint-plugin-promise@^6.0.0, typescript@*

? Would you like to install them now with npm? › No / Yes
```

As a result, you'll end up having a `.eslintrc.json` file in the root of your project, which looks like so (we'll modify it a little bit later on):

```json
{
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": ["plugin:react/recommended", "standard-with-typescript"],
  "overrides": [],
  "parserOptions": {
    "project": ["tsconfig.json"],
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react"],
  "rules": {},
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

## `eslint-plugin-jsdoc`

```
npm i --save-dev eslint-plugin-jsdoc
```

## `eslint-plugin-react-hooks`

```
npm install eslint-plugin-react-hooks --save-dev
```

Add following to `.eslintrc.json`

```json
{
  "plugins": ["react", "react-hooks"],
  "extends": [/*...*/ "plugin:jsdoc/recommended"],
  "rules": {
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "semi": "off",
    "comma-dangle": "off",
    "space-before-function-paren": "off",
    "jsdoc/require-returns": 0,
    "jsdoc/check-tag-names": ["error", { "definedTags": ["format"] }],
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
  }
}
```

Create `.eslintignore`

```json
# Ignore everything
/*

# Except
!/src
!App.tsx
```

In `package.json`

```json
"scripts" : {
  "lint": "tsc --noEmit && eslint . --ext .js,.jsx,.ts,.tsx"
}
```

## `prettier`

```bash
npm install --save-dev eslint-plugin-prettier
npm install --save-dev --save-exact prettier
npm install --save-dev eslint-config-prettier
```

Then in `.eslintrc.json`

```json
{
  "extends": ["plugin:prettier/recommended"]
}
```

Add following to `.prettierrc.json`

```json
{
  "bracketSpacing": true,
  "singleQuote": true,
  "trailingComma": "all",
  "endOfLine": "lf",
  "jsxBracketSameLine": false,
  "printWidth": 80,
  "tabWidth": 2
}
```

## `storybook`

Use the Storybook CLI to install it in a single command.

```sh
npx storybook@latest init
```

Install tailwind

```sh
npx storybook@latest add @storybook/addon-styling-webpack
```

Modify `main.js`

```ts
addons: [
'@storybook/addon-styling-webpack',
    {
      name: '@storybook/addon-styling-webpack',

      options: {
        rules: [
          {
            test: /\.(css|s[ac]ss)$/i,
            use: [
              'style-loader', //3. Inject styles into DOM
              'css-loader', //2. Turns css into commonjs
              'postcss-loader', //1. Turns sass into css
            ],
          },
        ],
      },
    },
  ],
]
```

## darkmode\*

Note: this may change in future

update your `tailwind.config.js` file to change themes based on a class or data-attribute.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // Toggle dark-mode based on .dark class or data-mode="dark"
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
```

install the `@storybook/addon-themes` addon to provide the switcher tool.

```sh
npm i -D @storybook/addon-themes
```

add following to `main.ts`

```js
export default {
  addons: ['@storybook/addon-themes'],
};
```

Create `preview.css`

```css
html.dark .sb-show-main {
  background-color: #333333 !important;
}
```

add following to `preview.ts`

```ts
import type { Preview, ReactRenderer } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import './preview.css';

const preview: Preview = {
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};
```

## `Jest`

Install jest

```sh
npm i -D jest @swc/jest react-test-renderer
```

Create `jest-setup-after-env.js` and `jest-setup.js`. In `jest.config.js` put

```js
module.exports = {
  setupFiles: ['./jest-setup.js'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  moduleNameMapper: {},
  setupFilesAfterEnv: ['./jet-setup-after-env.js'],
};
```

## `react-testing-library`

React Testing Library builds on top of DOM Testing Library by adding APIs for working with React components.

```sh
npm install --save-dev @testing-library/react
```

## `jest-dom`

jest-dom is a companion library for Testing Library that provides custom DOM element matchers for Jest

```sh
npm install --save-dev @testing-library/jest-dom
```

In `jest-setup-after-env.js` put in

```js
import '@testing-library/jest-dom';
```

## identity-obj-proxy

install proxy for css files

```sh
npm i --save-dev identity-obj-proxy
```

In `jest.config.js`

```js
module.exports = {
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'identity-obj-proxy',
  },
};
```

## `jest-environment-jsdom`

Install `jest-environment-jsdom`

```sh
npm i -D jest-environment-jsdom
```

Create a test in `src/stories/Sample/index.test.tsx`

```tsx
/** @jest-environment jsdom */
import React from 'react';
import { render } from '@testing-library/react';
import { Default } from './index.stories';
import { describe, it } from '@jest/globals';

describe('Text tests', () => {
  it('smoke test', () => {
    render(Default.render());
  });
});
```

---
title: Setting Up a Basic Webpack Development Environment
date: "2024-07-13T00:00:00Z"
description: "Let's set up the development environment"
tags: ["typescript", "javascript", "web"]
---

# 1. Introduction

I have taken on the role of managing the program at [ICPC Sinchon](https://icpc-sinchon.io/) and have decided to document my experiences, especially as I embark on this new project with many fresh ideas.

This article discusses the basic Webpack setup I worked on while creating an attendance-related page. Although the plan to allow students to enter their attendance codes ultimately failed, the effort put into the setup seems worthwhile to document as it may be revisited in the future.

## 1.1. Background

I have been involved with [ICPC Sinchon](https://icpc-sinchon.io/) for quite some time. I attended lectures there and eventually started teaching after gaining some skills.

While dining with the organizer of [Sinchon Union Camp](https://github.com/Goldchae), I ended up assisting with various tasks. The first of these was to create a page for attendance in the algorithm course, designed by another member of the management team.

This document organizes the settings I established as development began.

## 1.2. Existing Setup

The existing page had necessary elements, and the design was decent. Since various components simply embedded images created with Figma, it was relatively clean.

![Attendance Page](./attendance-page.png)

However, the development environment and logic design were lacking. It was built using only HTML, CSS, and vanilla JavaScript, with CSS elements created through inserted images. Libraries were utilized via CDN `<script>` tags, resulting in significant bundle size waste. For instance, the entire `bootstrap` was used just for a navigation bar.

There was no setup for a development server, and distribution was scattered, with user pages hosted on Firebase and admin pages on repl.it.

I aim to refactor this into a better structure by introducing React and TypeScript, using a package manager, and enabling deployment through builds. I also plan to incorporate testing later.

Rather than starting with complete knowledge, I may not cover everything. Nonetheless, I will document the process here.

We could entirely overhaul it using project templates like `create-vite`, but since the original code was authored and already in use, I want to preserve as many original choices and structures as possible.

Thus, I will conduct project settings for Webpack almost from scratch and will address project setup in this article.

## 1.3. Plan

Objectives for this article include:

- Setting up the development environment
- Introducing the popular stack React and TypeScript

# 2. Basic Setup

First, I configured the following in each project.

## 2.1. Package Manager Configuration

Start the project setup in the project folder with `npm init`. This will create a basic `package.json`.

```json
{
  "name": "sinchonattendance",
  "version": "1.0.0",
  "description": "### ...",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

## 2.2. Installing ESLint

Next, let's install `eslint`, a tool for static code analysis. You can quickly start using `npm init @eslint/config`. It will prompt several questions, generating a `.eslintrc.json` file. I selected the following options since I will be using TypeScript and running the code in the browser:

```bash
npm init @eslint/config
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ What format do you want your config file to be in? · JSON
```

Additionally, I chose to use `yarn` as the package manager.

Alternatively, a more modern tool called Biome could be used for static analysis. I documented this process in [Basic React Project Setup](https://witch.work/posts/react-my-basic-setting#3-%EB%8B%A4%EB%A5%B8-%EC%BD%94%EB%93%9C-%ED%8F%AC%EB%A7%A4%ED%84%B0---biome). However, for the sake of basic setup, I will use `eslint`.

# 3. Basic Webpack Configuration

## 3.1. Installing Webpack and Basic Configuration

Now, let's install the bundler. I will use the classic Webpack. As of 2024, even the latest framework nextjs still utilizes Webpack, indicating it is not an obsolete technology.

`webpack` must be installed alongside `webpack-cli`.

```bash
yarn add webpack webpack-cli --dev
```

Next, create source files. Initially, create `dist/index.html` and `src/index.js` in the project root.

`dist/index.html` will be included in the build results later.

Then, delete the entry point from `package.json` and set private to true to prevent accidental publishing.

```json
{
  "name": "sinchonattendance",
  "version": "1.0.0",
  "description": "### ...",
  "main": "index.js", // delete
  "private": true, // add
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

By default, the Webpack bundling result is `main.js`. Update `dist/index.html` to call it.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Getting Started</title>
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

Running `npx webpack` generates `dist/main.js`, which is called from `dist/index.html`.

## 3.2. Creating a Configuration File

Now, let's create a configuration file that will be read during the execution of `npx webpack`. Generate `webpack.config.js` in the project root.

In webpack commands, you can specify a different configuration file using the `--config` option, but `webpack.config.js` is the default name. For convenience, we will use this name.

Add only the `mode` in line with the example in the Webpack documentation, as follows:

```js
// webpack.config.js
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

`entry` represents the starting point for Webpack to bundle files, and `output` sets configurations for the bundled files. In short, it means to build in development mode, bundling `src/index.js` into `dist/main.js`.

Let’s also add a build command to `package.json`.

```json
{
  // ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
  // ...
}
```

This allows you to run `yarn build` to create `dist/main.js`.

# 4. TypeScript Configuration

Next, let’s install TypeScript and create `tsconfig.json` using `tsc --init`.

```bash
yarn add typescript --dev
npx tsc --init
```

Then set `tsconfig.json` as follows. This follows a slightly modified version of [vite's react-ts settings](https://stackblitz.com/edit/vitejs-vite-6uynas?file=tsconfig.json&terminal=dev).

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ES6",
    "skipLibCheck": true,
    "moduleResolution": "Node",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "typeRoots": ["src/types"],
    "outDir": "./dist/"
  },
  "include": ["src"]
}
```

# 5. React Setup

## 5.1. Library Installation

Install the libraries required to use React.

```bash
yarn add react react-dom
yarn add -D webpack-dev-server html-webpack-plugin
yarn add -D @types/react @types/react-dom
yarn add -D ts-loader
```

## 5.2. Modifying Webpack Configuration

Next, modify `webpack.config.js` to include basic loaders and plugins.

Update Webpack settings to handle TypeScript. In `module.rules`, add rules for `.ts` and `.tsx` to be processed by `ts-loader`. Also, add `.ts` and `.tsx` to `resolve.extensions`. Set `./src/index.ts` as the entry point, and configure the output file to be `./dist/bundle.js`.

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Sinchon Attendance Development",
      template: "./src/index.html",
    }),
  ]
};
```

## 5.3. Importing Assets

We will also configure Webpack to handle CSS and images. Install `style-loader` and `css-loader`.

```bash
yarn add style-loader css-loader --dev
```

Then, reference the [Asset Management official documentation](https://webpack.kr/guides/asset-management/) to modify the `rules` in the `module` property of `webpack.config.js` as follows:

```js
const path = require("path");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  // ...
};
```

## 5.4. Setting Up the Development Server

To confirm everything is working, write a basic React code.

```tsx
// index.tsx
import "./style.css";
import App from "./App";

import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

The `index.html` document should look like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <meta property="og:image" content="./image/240.png" />
    <title>Algorithm Camp Attendance</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

Now, start the development server to ensure everything displays correctly. With `webpack-dev-server` installed, you can add the following command to `package.json`.

```json
{
  // ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack serve --mode development --open --hot",
    "build": "webpack --mode production"
  },
  // ...
}
```

Additionally, append the `devServer` property in `webpack.config.js`.

```js
{
  // ...
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
}
```

Now, running the command `yarn dev` will start the development server at `localhost:9000`.

If there are multiple entry points, set `optimization.runtimeChunk` to `single`.

```js
module.exports = {
  // ...
  optimization: {
    runtimeChunk: "single",
  },
  // ...
};
```

However, since we only have one entry point, this option is not necessary.

Note that `webpack-dev-server` serves the bundled files from the directory defined in `output.path`. For example, specific files will be accessible via the following address:

```
http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename]
```

# 6. Hot Module Replacement Configuration for the Development Server

Adding Hot Module Replacement (HMR) to the development server environment increases efficiency during development. HMR allows you to avoid refreshing the entire page to reflect changes saved during development.

## 6.1. Basic HMR Setup

Traditionally, `react-hot-loader` was commonly used. However, React's fast refresh is considered more versatile and favorable. Therefore, we will utilize `react-refresh`.

```bash
yarn add -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

Since I am using `ts-loader`, I will also install `react-refresh-typescript` as per the [react-refresh official documentation](https://github.com/pmmmwh/react-refresh-webpack-plugin).

```bash
yarn add -D react-refresh-typescript
```

Next, modify `webpack.config.js` as follows, based on a slight modification of the official documentation's example.

```js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: require.resolve("ts-loader"),
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
              }),
              transpileOnly: isDevelopment,
            },
          },
        ],
        exclude: /node_modules/,
      },
      // Other plugin settings...
    ],
  },
  plugins: [isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean),
};
```

However, this will cause `ts-loader` to use `transpileOnly` in development mode, meaning type checking will not occur. We will use the `fork-ts-checker-webpack-plugin` to run type checks concurrently.

```bash
yarn add --dev fork-ts-checker-webpack-plugin
```

Then add the plugin to your Webpack configuration file as follows:

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: "Sinchon Attendance Development",
      template: "./src/index.html",
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ].filter(Boolean),
  watchOptions: {
    ignored: /node_modules/,
  },
};
```

Once configured, you can launch `yarn dev` to run the development server with HMR enabled. Further optimizations like minification can be applied later after making some progress in development.

# 7. Additional Configurations

## 7.1. Image Loading

Currently, Webpack may have trouble locating image paths. To resolve this, you’ll need to configure types. Create `src/types/custom.d.ts` and write the following:

```ts
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
```

Then add the following to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "typeRoots": ["src/types"],
    // ...
  },
  // ...
}
```

## 7.2. CSS Plugin Configuration

Let’s set up plugins for CSS compression and modularization.

```bash
yarn add -D mini-css-extract-plugin css-minimizer-webpack-plugin
```

Now, modify the Webpack configuration file accordingly. Since `mini-css-extract-plugin` cannot be used alongside `style-loader`, configure the use of `style-loader` in development mode and `mini-css-extract-plugin` in production mode.

The Webpack settings will look like this:

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Sinchon Attendance Development",
      template: "./src/index.html",
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    !isDevelopment && new MiniCssExtractPlugin(),
  ].filter(Boolean),
};
```

At this point, you should have enough basic setup to proceed with development, with reasonably minified build outputs.

# References

Starting Vanilla TypeScript - Project Environment Setup

https://velog.io/@hopsprings2/TypeScript-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%99%98%EA%B2%BD%EC%84%A4%EC%A0%95

Installing ESLint and Configuration Guide

https://lakelouise.tistory.com/199

Getting Started with Webpack

https://webpack.kr/guides/getting-started

Webpack TypeScript Guide

https://webpack.kr/guides/typescript/

Webpack Asset Management

https://webpack.kr/guides/asset-management/

Webpack Output Management

https://webpack.kr/guides/output-management/

Webpack HTML-Loader

https://webpack.js.org/loaders/html-loader/

Webpack DevServer

https://webpack.kr/configuration/dev-server/

Setting Up Webpack 5 by Zero Cho 

https://www.zerocho.com/category/Webpack/post/58aa916d745ca90018e5301d

Understanding the package.json `scripts` Section

https://programmingsummaries.tistory.com/385

TypeScript 'Cannot find module ...' Error

https://chiabi.github.io/2018/08/30/typescript/

Webpack Introduction: Using HTML and CSS

https://medium.com/@shlee1353/%EC%9B%B9%ED%8C%A9-%EC%9E%85%EB%AC%B8-%EA%B0%80%EC%9D%B4%EB%93%9C%ED%8E%B8-html-css-%EC%82%AC%EC%9A%A9%EA%B8%B0-75d9fb6062e6

Integrating Firebase with React TypeScript

https://velog.io/@parkyw1206/React-Typescript%EC%97%90%EC%84%9C-firebase-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0

React Refresh Webpack Plugin

https://github.com/pmmmwh/react-refresh-webpack-plugin/

TypeScript TS2307: Cannot find module '.png' or its corresponding type declarations

https://egas.tistory.com/125

Official Plugin Documentation

https://www.npmjs.com/package/css-minimizer-webpack-plugin

https://www.npmjs.com/package/mini-css-extract-plugin

Webpack (Webpack + TypeScript + React)

https://1-blue.github.io/posts/Webpack/
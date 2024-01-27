---
title: 신촌연합 알고리즘 캠프 출석 페이지 만들기 - 개발 환경 세팅
date: "2024-01-27T00:00:00Z"
description: "알고리즘 캠프 출석 페이지를 만들어보자"
tags: ["typescript", "javascript", "web"]
---

# 이 글은 현재 작성 중입니다.

# 시작

나는 오래 전부터 [ICPC Sinchon(이하 신촌연합)](https://icpc-sinchon.io/)에서 활동해왔다. [그곳에서 강의를 듣기도 했고](https://witch.work/posts/sinchon-camp-2021-summer) 시간이 지나 실력이 조금 붙자 [거기서 강사 활동을 하기도 했다.](https://github.com/witch-factory/2022-winter-sinchon-lecture)

그리고 [신촌연합의 캠프장을 맡은 분](https://github.com/Goldchae)과 식사를 하다가 그곳의 갖가지 일을 돕게 되었다. 그 중 하나가 바로 알고리즘 강의의 출석 페이지를 개선하는 거였다. 코드 베이스가 내 것이 아니기 때문에 전부 블로그에 올리기는 힘들지만 그래도 개발하면서 내가 했던 설정 등을 정리해 보고자 한다.

# 기존 구성

기존의 페이지에도 필요한 것들이 그럭저럭 있었고 잘 구성되어 있었다.

![출석 페이지](./attendance-page.png)

하지만 문제는 개발에 있어서는 그렇게 잘 되어 있지 못했다. HTML, CSS, 바닐라 JS로만 짜여 있었고 라이브러리는 `<script>`태그의 CDN을 통해서 사용하고 있었다. 개발 서버 세팅 등도 되어 있지 않았다. 그래서 이를 TypeScript로 바꾸고, 패키지 매니저를 사용하고, 빌드를 통해서 배포할 수 있게 만들어보는 작업을 진행하고자 한다.

큰 프로젝트는 아니기 때문에 당장은 원래 페이지와 같은 구조로 가도 괜찮겠지만 나중에 더 많은 기능을 추가하고자 할 때를 대비하는 것이다. 물론 `create-vite`와 같은 템플릿을 사용해서 아예 갈아엎을 수도 있다. 하지만 기존에 이 코드를 작성하던 사람이 있고 이미 배포되어서 사용되고 있기 때문에, 최대한 기존의 구조를 보존하면서 시작하고자 한다.

따라서 기초적인 프로젝트 설정과 webpack 설정을 진행하고, 그 다음에는 프로젝트 구조를 직접 잡아 보고자 한다.

# 기본적인 세팅

## 패키지 매니저 설정

먼저 `npm init`으로 프로젝트 설정을 시작하자. 기본적인 `package.json`이 생성된다.

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

## eslint 설치

그리고 코드를 정적 분석해 문제를 찾아주는 툴인 `eslint`를 설치하자. `npm init @eslint/config`을 이용해서 빠르게 시작할 수 있다. 해당 커맨드를 입력하면 몇 가지 질문을 하고, 그에 따라 `.eslintrc.json` 파일이 생성된다. 나는 Typescript를 쓸 것이고 브라우저에서 코드를 돌릴 거라서 다음과 같이 선택했다.

```bash
npm init @eslint/config
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ What format do you want your config file to be in? · JSON
```

또한 이후 나오는 패키지 매니저 질문에는 `yarn`을 쓰는 걸로 했다. 

## typescript 설치와 설정

그다음엔 ts를 설치하자. 그리고 `tsx --init`으로 `tsconfig.json`을 생성했다.

```bash
yarn add typescript --dev
npx tsc --init
```

# 웹팩

## 웹팩 설치

이제 번들러를 설치하자. 나는 고전인 웹팩을 쓸 것이다. nextjs에서조차도 아직 웹팩을 쓰고 있으니 아주 낡은 기술은 아니라고 보인다.

`webpack`은 `webpack-cli`와 함께 설치해야 한다.

```bash
yarn add webpack webpack-cli --dev
```

그리고 소스 파일을 만들자. 먼저 시험적으로 프로젝트 루트 경로에 `dist/index.html`을 만들고 `src/index.js`를 생성.

`dist/index.html`은 이후 빌드 결과물에 포함될 것이다. 이후에는 `public`에 담길 것이다.

## 설정

`package.json`에서 엔트리 포인트를 삭제하고 private를 true로 설정하자. 실수로 publish해버리는 것을 방지하는 옵션이다.

```json
{
  "name": "sinchonattendance",
  "version": "1.0.0",
  "description": "### ...",
  "main": "index.js", // 삭제
  "private": true, // 추가
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

그리고 기본적으로는 웹팩 번들링 결과물은 `main.js`이다. `dist/index.html`에서 이를 불러오도록 하자.

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

`npx webpack`을 실행하면 `dist/main.js`가 생성된다. 이를 `dist/index.html`에서 불러오는 것이다.

## 설정 파일 만들기

그리고 프로젝트 루트 경로에 `webpack.config.js`를 생성하자. 이 파일은 웹팩 설정 파일이다. 이 파일을 생성하면 `npx webpack`을 실행할 때 이 파일을 읽어서 빌드를 진행한다.

`webpack --config 파일이름`과 같이 `--config` 옵션을 통해서 설정 파일을 지정할 수도 있다. 하지만 `webpack.config.js`가 기본 설정 파일명으로 지정되어 있으므로 이걸 사용하자.

공식 문서의 예시에 `mode`만 추가해서 다음과 같이 설정했다.

```js
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

`entry`는 웹팩이 번들링할 파일의 경로이고, `output`은 번들링 결과물의 경로이다. 즉 이는 개발 모드로 빌드하고, `src/index.js`를 번들링해서 `dist/main.js`에 저장하라는 의미이다.

`package.json`에 빌드 명령어도 추가하자.

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

이렇게 하면 `yarn build`를 실행하면 `dist/main.js`가 생성된다.

## 웹팩 타입스크립트 설정

이제 웹팩에서 타입스크립트를 사용할 수 있도록 `ts-loader`를 설치하자.

```bash
yarn add ts-loader --dev
```

`tsconfig.json`에서 `outDir`을 `dist`로 설정하자. 이는 타입스크립트 컴파일 결과물을 `dist`에 저장하라는 의미이다. 그리고 `module`은 `es6`로 설정한다. 기본값은 `commonjs`인데, 이를 `es6`로 하지 않으면 웹팩이 트리쉐이킹을 제대로 할 수 없다.

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "es6",
    // ...
  },
  // ...
}
```

그리고 ts를 처리하도록 웹팩 설정을 바꾸자. `module.rules`에 `.ts`와 `.tsx`를 `ts-loader`로 처리하도록 추가하자. 그리고 `resolve.extensions`에 `.ts`와 `.tsx`를 추가하자. `./src/index.ts`를 통해 진입하고 빌드된 파일은 `./dist/main.js`에 저장하도록 설정했다.

이러면 `yarn build`를 실행하면 tsc를 통해 타입스크립트를 컴파일하고, 웹팩이 번들링하고, `dist/main.js`에 저장한다.

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: ["./src/index.ts"],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json", ".css"],
  },
};
```

## 애셋 가져오기

이뿐 아니라 웹팩에서 css, 이미지도 가져오도록 설정하자. `style-loader`와 `css-loader`를 설치하자.

```bash
yarn add style-loader css-loader --dev
```

그리고 [Asset Management 공식 문서](https://webpack.kr/guides/asset-management/)를 참고하여 `webpack.config.js`의 `module`속성의 rules를 다음과 같이 수정하자.

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

# 추가적인 설정

이제 코드를 바꿔보자. 바꾸는 과정에서 추가적으로 했던 설정들이다.

## 모듈 설정

여기까지 하자 기존 코드에서 `node_modules`에 설치한 모듈을 찾지 못하는 문제가 발생했다. `tsconfig.json`에서 `moduleResolution`을 `node`로 설정하자.

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    // ...
  },
  // ...
}
```

이렇게 해야 모듈이 제대로 로딩되는 이유는 [TypeScript 사용할 때 'Cannot find module ...' 에러](https://chiabi.github.io/2018/08/30/typescript/)를 보면 알 수 있다.

## html 파일 로딩 설정

지금까지는 `dist/index.html`을 직접 수정하고 있었다. 하지만 나중에 코드가 더 커지고 복잡해지면 이런 과정은 점점 번거롭고 어려워질 것이다.

또한 이제 UI를 HTML에 넣어야 하는데 js와 css는 번들링하고 `dist/index.html`은 직접 수정하는 것은 이상하기까지 하다. 따라서 이제는 `dist/index.html`도 매번 빌드할 때마다 자동으로 생성되도록 설정하자.

먼저 `html-webpack-plugin`을 설치하자.

```bash
yarn add html-webpack-plugin --dev
```

그리고 `webpack.config.js`를 다음과 같이 수정하자. `template`에 명시된 파일을 기반으로 `dist/index.html`을 생성한다.

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      title: "Sinchon Attendance",
      template: "./src/index.html",
    }),
  ],
  // ...
};
```

이제 `dist/index.html`을 직접 수정하지 않아도 된다. `src/index.html`을 수정하고 빌드하면 `dist/index.html`도 자동으로 수정되고 다른 파일들과 함께 번들링된다.

예를 들어 `src/index.html`을 다음과 같이 수정하자.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no"
    />
    <title>알고리즘캠프 출석체크</title>
  </head>
  <body></body>
</html>
```

그리고 이 상태에서 `yarn build`를 실행하면 `dist/index.html`이 다음과 같이 수정된다. `main.js`가 자동으로 추가되고 minimization도 적용된다.

```html
<!doctype html><html><head><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/><title>알고리즘캠프 출석체크</title><script defer="defer" src="main.js"></script></head><body></body></html>
```

## 자잘한 설정

매번 빌드할 때마다 결과물 파일이 새로 생성되도록 설정파일의 `output.clean`을 `true`로 설정하자.

```js
module.exports = {
  // ...
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  // ...
};
```

개발 서버 설정도 해보자. 웹팩의 `--watch` 옵션을 사용할 수도 있다. 하지만 새로고침을 해야 페이지가 바뀐다는 단점이 있으므로 `webpack-dev-server`를 사용하자.

```bash
yarn add webpack-dev-server --dev
```

그리고 `webpack.config.js`를 다음과 같이 수정하자. `devServer` 속성을 설정한다.

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
  // ...
};
```

그리고 `package.json`의 `scripts`에 `dev`를 바꿔서 해당 명령어로 개발 서버를 실행하도록 하자.

```json
{ 
  // ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --mode development --open --hot",
    "build": "webpack --mode production"
  },
  // ...
}
```

이제 `yarn dev`를 실행하면 `dist/index.html`을 기반으로 개발 서버가 실행된다. `--open` 옵션을 통해서 자동으로 브라우저가 열리게 설정도 해놨다.








# 참고

바닐라 TypeScript 시작하기 - 프로젝트 환경설정

https://velog.io/@hopsprings2/TypeScript-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%99%98%EA%B2%BD%EC%84%A4%EC%A0%95

ESLint 설치하기, 설정 방법

https://lakelouise.tistory.com/199

웹팩 getting started

https://webpack.kr/guides/getting-started

웹팩 typescript

https://webpack.kr/guides/typescript/

웹팩 Asset Management

https://webpack.kr/guides/asset-management/

웹팩 Output Management

https://webpack.kr/guides/output-management/

웹팩 html-loader

https://webpack.js.org/loaders/html-loader/

웹팩 DevServer

https://webpack.kr/configuration/dev-server/

제로초 웹팩5(Webpack) 설정하기 

https://www.zerocho.com/category/Webpack/post/58aa916d745ca90018e5301d

모두 알지만 모두 모르는 package.json(package.json scripts)

https://programmingsummaries.tistory.com/385

TypeScript 사용할 때 'Cannot find module ...' 에러

https://chiabi.github.io/2018/08/30/typescript/

웹팩 입문: 1. HTML, CSS 사용하기

https://medium.com/@shlee1353/%EC%9B%B9%ED%8C%A9-%EC%9E%85%EB%AC%B8-%EA%B0%80%EC%9D%B4%EB%93%9C%ED%8E%B8-html-css-%EC%82%AC%EC%9A%A9%EA%B8%B0-75d9fb6062e6

React Typescript에서 firebase 연동하기

https://velog.io/@parkyw1206/React-Typescript%EC%97%90%EC%84%9C-firebase-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0
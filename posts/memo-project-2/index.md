---
title: 메모장 만들기 프로젝트 - 2. 프로젝트 구성
date: "2021-08-29T00:00:00Z"
description: "웹 메모장 프로젝트, 그 삽질의 기록2"
tags: ["memo-jang", "web"]
---

# 1. 프로젝트의 구성 - 클라이언트

프론트를 담당할 client 폴더와 백을 담당할 server 폴더를 따로 분리해서 서로간에 정보를 주고받는 식으로 프로젝트를 구성하려고 한다. 이때 node_modules는 하나로 관리하는 게 좋으므로 모노레포로 구성해 주고자 했다.

먼저 프로젝트 폴더 내에 `yarn init`을 한 후 `package.json` 에 workspace를 편집해 준다. 프로젝트를 모노레포로 구성하기 위해서이다.

```json
{
  "name": "memo-jang",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "private": true,
  "workspaces": [
    "client",
    "server"
  ]
}
```

그리고 클라이언트는 create-react-app으로 만들어 준다.

```
npx create-react-app client
```

client 폴더 내에 들어가서 yarn start 를 하면 리액트 기본 페이지가 자동으로 생성되는 것을 알 수 있다.

그리고 eslint는 airbnb-style-guide를 사용해 주자.

https://velog.io/@_jouz_ryul/ESLint-Prettier-Airbnb-Style-Guide%EB%A1%9C-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0

이 블로그를 참고하여 client 폴더에 eslint-config-airbnb를 설치해 주었다.

그런데 이 상태로 yarn start를 하여 react app을 실행해주게 되면 `reportWebVitals.js` 의 형식에 문제가 있다면서 에러를 뿜고 만다. 내가 만든 파일도 아닌데 에러가 뜬다.

구글링한 결과 https://stackoverflow.com/questions/64518226/my-create-react-app-is-failing-to-compile-due-to-eslint-error 라는 문서가 있었다. 여길 보면 프로젝트 폴더에 `.env` 파일을 만들고 

```
ESLINT_NO_DEV_ERRORS=true
```

를 넣으면 된다고 한다. 그대로 하니까 되었다. 비록 컴파일 시에 경고 메시지는 뜨지만 eslint 를 쓰는 목적은 내가 쓰는 코드의 스타일을 고치는 거지 내가 작성하지도 않은 파일 때문에 컴파일 에러를 내는 것은 아니니까 말이다.

또한 jsx를 `.js`형식 파일에서도 쓸 수 있게 하기 위해 `.eslintrc.js` 에 다음 문구를 추가했다. 나는 리액트를 사용하여 프론트를 짤 것이기 때문에 필수적이다.

```json
rules: {
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
  }
```

그리고 페이지 분할을 위해 리액트 라우터를 설치해 주자.

```
yarn add react-router-dom
```

리액트 라우터에 대한 내용은 https://velog.io/@pkbird/React-Router-1 이 블로그를 참고하면서 개발한다.

그리고  스타일링을 위해 styled-components를 설치해 준다.

```
yarn add styled-components
```



# 2. 프로젝트의 구성 - 서버

이제 server 폴더를 세팅해 주도록 하자. 기본적인 Express 정도만 설치해 줄 것이다.

먼저 프로젝트 폴더에 server 폴더를 새로 만들자. 그리고 거기에 들어가서 터미널을 열어 express를 설치한다.

```
yarn init
yarn add express
```

https://velog.io/@ohzzi/Node.js-%EC%97%90%EC%84%9C-importexport-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0

위 글의 내용을 참고하여 node.js에서 import를 사용할 수 있게 한 후 다음과 같은 간단한 예제 코드를 실행해 본다.

```jsx
import express from 'express';

const app=express();
const PORT=3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
```

`node index.js` 로 실행시켜 보면 실행이 잘 되는 걸 확인할 수 있다. `localhost:3000` 으로 접속하면 `Hello World!` 가 출력되는 아주 단순한 페이지가 나온다.

여기에도 eslint-config-airbnb를 적용할 수 있는데 이건 나중에 서버를 작업할 때 할 것이다. 먼저 프론트부터 작업할 것이다. 이제 메모장 프론트 작업을 시작하자. 눈에 바로바로 보이는 작업을 하는 것은 언제나 즐겁다.


---
title: 로컬 개발 환경에서 HTTPS 적용하기
date: "2024-09-08T00:00:00Z"
description: "로컬 개발 환경에서 HTTPS를 적용하는 방법을 알아보자"
tags: ["web", "tip"]
---

# 1. 개요

JWT 로그인을 구현하면서 간단한 Vite React 프로젝트(로그인, 회원가입 페이지 존재)와 Node.js 서버를 통해 데모를 만들고 있었다. 그리고 토큰을 쿠키에 저장하기로 했다.

사용자가 로그인에 성공시 JWT를 쿠키에 담아 클라이언트에게 전달하고, 클라이언트는 인증이 필요한 요청시마다 이 쿠키를 서버에 전달하는 방식이다.

이때 프론트와 백엔드는 다른 출처에서 실행되고 있기 때문에 쿠키를 주고받기 위해서는 `sameSite: "none"` 설정이 필요하다. 그리고 이 설정은 `Secure` 속성 설정을 요구한다. 즉, HTTPS를 사용해야 한다.

그런데 로컬 개발 환경에서 HTTPS를 사용하기 위해서는 약간의 설정이 필요하다. 이런 `sameSite:"none"` 쿠키 설정은 [web.dev 문서에서도 설명하고 있는 로컬 개발에 HTTPS를 사용하는 경우 중 하나다.](https://web.dev/articles/when-to-use-local-https?hl=ko#when_to_use_https_for_local_development_2)

따라서 서버, 클라이언트 모두 HTTPS를 사용하도록 설정해보자.

## 1.1. 폴더 구조

현재 폴더 구조는 `login` 폴더 내에 클라이언트와 서버 폴더가 존재한다. 이 프로젝트 루트에 인증서를 생성하고 서버와 클라이언트에서 이를 사용할 것이다.

```
login
├── client
│   ├── src
│   ├── package.json
│   └── ...
└── server
    ├── src
    ├── package.json
    └── ...
```

# 2. 인증서 생성

macOS를 기준으로 설명한다.

인증서 생성을 위해서는 로컬 개발을 위해 간단히 인증서를 생성해 주는 도구인 `mkcert`를 사용할 것이다.

먼저 프로젝트 루트에 `mkcert`를 설치하고 인증서를 생성한다.

```bash
brew install mkcert
# 로컬 루트 인증 기관에 mkcert를 추가
mkcert -install
# 프로젝트 루트에서 localhost 인증서 생성
mkcert localhost
```

그럼 프로젝트 루트에 `localhost.pem`과 `localhost-key.pem` 파일이 생성된다. 이때 이 `.pem` 파일을 절대로 버전 관리에 포함시키지 말자. 프로젝트 루트의 `.gitignore`에서 아예 `.pem` 확장자를 무시하도록 설정하자.

```
# .gitignore
*.pem
```

그럼 이제 이 인증서를 서버와 클라이언트에서 사용할 것이다.

# 3. 서버 HTTPS 설정

방금 만든 인증서를 통해 Node.js 서버에서 HTTPS를 사용하도록 설정해보자. `https` 모듈을 사용한다.

```ts
// server/src/index.ts
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import https from "https";

const app = express();
const port = 3000;

const options = {
  key: fs.readFileSync("../localhost-key.pem"),
  cert: fs.readFileSync("../localhost.pem"),
};

// CORS 설정
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 쿠키 사용을 위한 cookie-parser 미들웨어
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// 서버 시작
https.createServer(options, app).listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
```

만약에 http 요청을 https로 리다이렉트하고 싶다면 다음과 같이 설정할 수 있다. 3001 포트에서 https 서버가 실행되도록 하고 3000 포트로 http 요청이 오면 3001 포트로 리다이렉트하는 것이다.

```ts
https.createServer(options, app).listen(port + 1, () => {
  console.log(`Server is running at https://localhost:${port + 1}`);
});

http
  .createServer((req, res) => {
    res.writeHead(301, { Location: `https://localhost:${port + 1}${req.url}` });
    res.end();
  })
  .listen(port);
```

301 상태 코드는 GET 요청에 사용하고 POST 요청에는 308 상태 코드를 사용하는 것이 좋지만 여기서는 간단하게 301 상태 코드만 사용했다.

# 4. 클라이언트 설정

Vite에서는 설정 파일을 통해 서버 설정을 할 수 있다. 이때 vite 설정 파일은 자동으로 node 환경에서 실행되기 때문에 fs 모듈도 사용할 수 있다.

따라서 앞서 `https.createServer`에 전달한 옵션 객체를 그대로  `server.https` 옵션에 전달하면 해당 인증서를 통해 https 서버를 실행할 수 있다.

```ts
// client/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

const options = {
  key: fs.readFileSync("../localhost-key.pem"),
  cert: fs.readFileSync("../localhost.pem"),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: options,
  },
});
```

이렇게 한 후 개발 환경을 실행할 시 `https://localhost:5173`에서 개발 환경이 실행된다.

# 참고

브라우저 쿠키와 SameSite 속성

https://seob.dev/posts/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EC%BF%A0%ED%82%A4%EC%99%80-SameSite-%EC%86%8D%EC%84%B1

로컬 개발에 HTTPS를 사용해야 하는 경우 

https://web.dev/articles/when-to-use-local-https?hl=ko

새로운 SameSite=None; Secure 쿠키 설정에 대비

https://developers.google.com/search/blog/2020/01/get-ready-for-new-samesitenone-secure?hl=ko

로컬 개발에 HTTPS 사용

https://web.dev/articles/how-to-use-local-https?hl=ko

Vite Server Options

https://vitejs.dev/config/server-options

How to import file as text into vite.config.js?

https://stackoverflow.com/questions/73348389/how-to-import-file-as-text-into-vite-config-js

MDN 301 Moved Permanently

https://developer.mozilla.org/ko/docs/Web/HTTP/Status/301
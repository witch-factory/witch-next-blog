---
title: JWT 로그인 구현하기 - 첫번째, 준비하기
date: "2024-09-03T00:00:00Z"
description: "로그인 구현을 위해 프로젝트를 준비하고 기본적인 설정을 하자"
tags: ["typescript", "javascript", "web"]
---

# 이 글은 작성 중입니다.

이번에 프로젝트에 JWT를 이용한 로그인을 달아 보기로 했다. 그러면서 간단히 데모를 구현해 본 흔적을 여기 남긴다.

실제 프로젝트에 똑같이 적용할 것이므로 Node, Express, Prisma를 이용하여 서버를 구현하고 간단한 로그인 기능이 있는 React 프로젝트와 연동할 것이다.

# 1. 서버 구성

먼저 서버 폴더를 만들고 npm 프로젝트를 생성한 후 필요한 패키지를 설치한다. 이걸 적용할 프로젝트에서는 pnpm을 사용하고 있지만 크게 중요한 건 아니므로 npm을 사용한다.

```bash
# /server 폴더로 이동
npm init -y
npm install express
```

그리고 Typescript 사용과 개발 환경 설정을 위해 필요한 패키지들을 설치한다.

```bash
npm install -D typescript ts-node @types/node @types/express
```

타입스크립트 설정 파일 `tsconfig.json` 초기화

```bash
npx tsc --init
```

나머지 설정은 크게 건드릴 필요가 없지만 ts 파일을 트랜스파일했을 때 결과 파일들의 경로를 설정하는 `outDir` 만 `dist` 폴더로 바꿔주자. 간단한 예시 코드라 따로 src 폴더에 소스 파일을 분리하지 않을 것이기 때문에 빌드 결과 파일이 `dist` 폴더에 따로 생성되도록 설정한 것이다.

```json
{
  "compilerOptions": {
    // ...
    "outDir": "./dist",
    // ...
  }
}
```

그리고 개발 시 서버를 자동으로 재시작해주는 `nodemon`도 설치한다.

```bash
npm install -D nodemon
```

클라이언트에서 오는 요청을 받기 위해 `cors` 패키지도 설치한다.

```bash
npm install cors
```

`index.ts` 파일을 만들고 기본적인 서버를 구성한다. 클라이언트가 될 로컬호스트 주소에 대한 cors 설정도 추가한다. 이후 cross origin 

```typescript
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
```

이제 `package.json`에 스크립트 명령어를 추가해서 개발 시에는 `ts-node`로 실행하고, 빌드 후에는 `dist` 폴더에 있는 결과 파일을 실행하도록 설정한다.

```json
{
  "scripts": {
    "start": "ts-node dist/index.js",
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc"
  }
}
```

기존에 있던 프로젝트에서 이렇게 타입스크립트 설정을 하고 `npm run dev`를 했을 경우 다음과 같은 에러가 발생할 수 있다.

```bash
TypeError: Unknown file extension ".ts" for /Users/kimsunghyun/Desktop/projects/login-practice/server/index.ts
```

그럴 경우 `package.json`에 혹시 `"type": "module"` 설정이 되어 있는지 확인하고 있다면 지워주자. 타입스크립트를 사용할 때는 이 설정이 필요 없고 오히려 위 에러를 발생시킨다.

# 2. prisma 세팅

사용자 정보 저장과 조회를 위해 DB를 사용할 것이고 ORM으로 prisma를 사용할 것이다. 간단한 데모이므로 sqlite를 사용할 것이다.

```bash
# prisma를 개발 의존성으로 설치
npm install prisma --save-dev
# 데이터 소스를 sqlite로 하여 prisma ORM 초기화
npx prisma init --datasource-provider sqlite
```

프로젝트에 `prisma` 폴더와 그 내부의 `schema.prisma` 파일이 생성되었을 것이다. 파일을 열어서 다음과 같이 스키마를 추가한다. 간단히 사용자 정보를 저장할 `User` 모델을 추가하였다.

권한은 enum을 사용하여 `Admin`, `User`, `Guest` 등을 두는 게 좋은 선택이라고 생각한다. 하지만 sqlite에서 enum을 지원하지 않기도 하고 다른 부분을 단순화하여 인증 구현에 집중하기 위해서 `isAdmin` 필드만 두었다. 관리자와 일반 사용자만 구분한다는 가정이다.

```prisma
model User {
  /// Primary Key.
  id       Int    @id @default(autoincrement())
  /// 사용자 ID는 중복될 수 없음
  username String @unique
  password String
  isAdmin  Boolean @default(false)
}
```

그리고 `npx prisma migrate` 명령어를 실행하여 방금 만든 스키마를 기반으로 sql 파일을 생성하고 데이터베이스에 적용한다. 이 명령어를 실행시 `npx prisma generate`도 자동으로 같이 실행되어 작성한 스키마에 기반한 Prisma Client API를 생성한다.

```bash
npx prisma migrate dev --name init
```

sqlite는 인메모리 DB이므로 데이터베이스 파일이 생성되지 않고 메모리에 저장된다. 그래서 데이터베이스 파일을 확인하고 싶다면 `prisma/dev.db` 파일을 확인하면 된다.

# 3. 회원가입 API 구현

routes 폴더를 만들고 `auth.ts` 파일을 만들어 로그인, 회원가입, 로그아웃 API를 구현할 것이다. 그런데 로그인, 로그아웃의 경우 다음 섹션에서 JWT를 사용하여 구현할 것이므로, 정보를 암호화해 저장할 뿐인 회원가입 API를 먼저 구현한다.

먼저 필요한 암호화 모듈을 설치한다. bcryptjs는 해싱할 때 자동으로 salt도 넣어주고 쉽게 사용할 수 있어서 선택하였다. `genSaltSync`등을 통해 더 세부적인 설정을 할 수도 있지만 여기서는 기본 설정으로 사용하겠다.

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

그리고 `routes/auth.ts` 파일을 만들어 회원가입 API를 이렇게 구현한다.

```typescript
// routes/auth.ts
import express, { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const authRouter = express.Router();
const prisma = new PrismaClient();

type RegisterBody = {
  username: string;
  password: string;
};

authRouter.post(
  "/register",
  async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const { username, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    // 201 Created
    res.status(201).json(newUser);
  }
);

export default authRouter;
```

그리고 `index.ts` 파일에 라우터를 추가한다.

```typescript
// index.ts
app.use("/auth", authRouter);
```

# 4. 간단한 클라이언트 구현

데모에서 사용할 로그인, 회원가입 페이지를 만들어보자. react를 이용한다.

먼저 프론트엔드 프로젝트를 생성한다. vite의 react + typescript 템플릿을 이용한다.

```bash
npm create vite@latest client -- --template react-ts
```

로그인, 회원가입 페이지의 라우팅을 위해 `react-router-dom`을, HTTP 요청을 위해 `ky`를 설치한다.

```bash
npm install react-router-dom ky
```

그리고 ky 인스턴스를 정의한다. 서버 도메인을 추가하고 서로 다른 도메인에서 요청을 보낼 것이므로 `credentials: "include"` 옵션을 추가한다.

```typescript
// utils/apiClient.ts
import ky from "ky";

const apiClient = ky.create({
  prefixUrl: "http://localhost:3000",
  credentials: "include",
  throwHttpErrors: false,
});

export default apiClient;
```

## 4.1. 로그인 페이지

로그인 페이지는 다음과 같이 정의한다. 스타일은 거의 신경쓰지 않았고 아직 기능은 구현하지 않았으므로 `handleSubmit` 함수도 서버로 단순히 요청을 보내기만 한다.

```tsx
import { useState } from "react";
import apiClient from "./utils/apiClient";

type LoginCredentials = {
  username: string;
  password: string;
};

function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(credentials);
    apiClient.post("/auth/login", { json: credentials });
  };

  return (
    <>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='username'
          placeholder='사용자명'
          required
          value={credentials.username}
          onChange={handleChange}
        />
        <input
          type='password'
          name='password'
          placeholder='비밀번호'
          required
          value={credentials.password}
          onChange={handleChange}
        />
        <button type='submit'>로그인</button>
      </form>
      <a href='/register'>회원가입</a>
    </>
  );
}

export default LoginPage;
```

## 4.2. 회원가입 페이지

회원가입 페이지도 다음과 같이 간단히만 구현하였다.

계속...


# 참고

Prisma Quickstart 문서

https://www.prisma.io/docs/getting-started/quickstart
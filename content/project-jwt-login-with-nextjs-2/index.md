---
title: JWT 로그인 구현하기 - 두번째, 로그인 API 구현
date: "2024-08-21T01:00:00Z"
description: "로그인 API를 구현해보자."
tags: ["typescript", "javascript", "web"]
---

이번에는 프로젝트에 JWT를 이용한 로그인을 달아 보기로 했다. 실제 프로젝트에 똑같이 적용할 것이므로 Node, Express, Prisma를 이용하여 구현하고 간단한 예시를 만들어 볼 것이다.

[이전 글에서는 세팅을 진행하였고](https://witch.work/posts/project-jwt-login-with-nextjs-1) 이번에는 본격적으로 JWT 로그인을 구현하고 발전시켜보기로 했다.

이 글에서는 JWT를 이용한 로그인 API를 구현해 보고 refresh token, refresh token rotation 등을 추가해보기로 했다. 또한 어느 정도까지 구현할 만 하고 어떤 트레이드오프가 있고 어떤 선택을 했는지도 가능한 한 조사하여 간략하게 정리하였다.

# 1. 선택과 설계

## 1.1. JWT vs 세션 기반 인증

세션 기반 인증은 서버에서 사용자의 로그인 세션을 관리한다. 사용자가 로그인에 성공시 서버는 세션ID를 발급하고 클라이언트와 서버에 저장한다. 이후 클라이언트는 서버에 요청할 때 이 세션ID를 함께 보내고, 서버는 이를 통해 사용자의 인증 상태를 확인한다.

JWT는 서버가 세션을 관리하지 않는다. 서버는 사용자가 로그인 성공시 액세스 토큰(경우에 따라 다른 토큰이나 정보들)을 발급하고 클라이언트에 전달한다. 서버에서는 액세스 토큰을 발급할 때 사용한 시크릿 키만 보유하고 있다. 클라이언트가 요청 시 토큰을 함께 보내면, 서버는 시크릿 키로 토큰의 유효성을 검증한다.

이때 사용자 정보는 토큰에 포함되어 있어 서버가 따로 저장할 필요가 없다. 이로 인해 서버는 stateless하게 동작한다. 세션 기반 인증은 서버 확장이나 로드밸런싱 시 세션 동기화 문제가 발생할 수 있지만, JWT는 이러한 문제를 겪지 않는다.

그리고 JWT는 서버에 저장할 정보가 많지 않으므로 DB를 갖추거나 할 필요가 딱히 없다. 따라서 간단한 구성이 가능하다. 반면 세션 무효화나 로그인 상태 등을 서버에서 관리할 수 있는 세션 기반 인증에 비해 구현이 어려운 부분도 있다.

> 이번 프로젝트에서는 JWT에서 구현이 어려운 기능들이 필요하지도 않고 사용자 이름 등의 간단한 정보만 저장하면 되므로 JWT를 사용하기로 했다.

## 1.2. JWT의 보강 - 리프레시 토큰

그런데 JWT를 이용해 발급한 액세스 토큰은 한 번 발급되면 만료될 때까지 계속 사용할 수 있다. 따라서 만약 액세스 토큰이 탈취당하게 되면 이 토큰을 사용하는 사람은 계속 인증을 받을 수 있다.

쿠키의 sameSite, httpOnly, secure 등의 옵션을 이용하여 보안을 강화하는 방법으로 탈취 자체를 어렵게 할 수 있다. 혹은 아예 액세스 토큰의 유효기간을 짧게 설정하여 빨리빨리 만료시켜 버리는 방법도 있다.

하지만 10분마다 새로 로그인을 해야 한다면 사용자 경험이 매우 안 좋아질 것이다. 따라서 액세스 토큰의 유효기간은 짧게 설정하고 상대적으로 유효기간이 긴 리프레시 토큰을 사용하여 액세스 토큰을 갱신하는 방법을 사용한다. [이는 OAuth 2.0 사양에서도 권장하는 방식이다.](https://www.oauth.com/oauth2-servers/access-tokens/access-token-lifetime/)

이렇게 하면 액세스 토큰이 탈취당하더라도 유효기간이 짧아서 금방 만료되어 더 이상 사용할 수 없게 된다. 앱 삭제 등으로 인해 사용자의 접근 권한을 취소해야 할 경우에도 구현이 쉬워진다. 토큰 블랙리스트 등을 만들 필요 없이 리프레시 토큰을 무효화하면 되기 때문이다.

하지만 만약 리프레시 토큰까지 탈취당했을 경우 문제가 발생한다. 따라서 리프레시 토큰을 이용해서 액세스 토큰을 새로 발급받을 때 리프레시 토큰도 함께 갱신하는 방법도 있다. 이를 refresh token rotation이라고 한다.

이번 글에서는 refresh token rotation까지만 다룰 예정이다. 하지만 이렇게 해도 다음과 같은 문제점이 여전히 있다.

- 만약 통신이 감청되고 있다면 액세스 토큰뿐 아니라 액세스 토큰 만료 기간마다 보내지는 리프레시 토큰도 탈취당할 수 있다.
- 클라이언트 기기 자체가 오염되면 당연히 액세스 토큰과 리프레시 토큰을 모두 탈취당할 수 있다.
- 리프레시 토큰이 탈취당했을 경우 공격자가 1번에 한해서지만 액세스 토큰을 갱신할 수 있다.

따라서 이에 대한 보강은 다음 글에서 진행해 보려고 한다.

> 단 이러한 문제점을 해결하려면 BFF 등 여러 추가적인 조치가 필요하다. 따라서 이는 실제 프로젝트에서는 일단 도입을 미루었다.

# 2. 로그인 API 구현 - 기본

액세스 토큰만을 이용하는 로그인 인증 방식은 다음과 같다.

1. 사용자가 로그인 시도. 성공시 액세스 토큰 발급하고 쿠키에 저장
2. 사용자는 API 요청시마다 쿠키에 저장된 액세스 토큰도 같이 전송
3. 서버는 인증이 필요한 API 요청이 들어올 때마다 미들웨어로 액세스 토큰을 검증
4. 검증 실패시 401 Unauthorized 응답을 보내고, 성공시 요청 처리

## 2.1. 설정

가장 기본적으로 리프레시 토큰 같은 것 없이 JWT 토큰을 사용할 뿐인 간단한 로그인 API를 구현해보자. JWT 토큰을 발급하기 위한 `jsonwebtoken` 패키지를 설치한다. 그리고 JWT 토큰을 쿠키에 저장할 것이므로 `cookie-parser` 패키지도 설치한다. 우리는 ts를 사용하고 있으므로 타입 정의도 설치하자.

```bash
npm install jsonwebtoken cookie-parser
npm install --save-dev @types/jsonwebtoken @types/cookie-parser
```

그리고 `.env` 파일을 생성하여 JWT 시크릿으로 사용할 환경 변수를 설정한다. 그냥 인터넷에 쳐서 나오는 무작위 비밀번호 생성기 결과를 조금 바꿔서 만들었고 배포도 안 되어 있기에 그냥 노출해도 상관 없다.

```env
JWT_SECRET=wit*chRbW!wn0aURi@Grlz7
```

## 1.2. 필요한 함수들 작성

먼저 비밀 키를 이용하여 토큰을 발급하는 함수를 작성하자. `utils/auth.ts` 파일을 생성하여 작성했다. 토큰 만료 시간은 12시간으로 설정했다.

```typescript
// src/utils/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 환경변수가 설정되어 있지 않습니다.");
}

const ACCESS_TOKEN_EXPIRATION = "12h";
const HASH_ALGORITHM = "HS256";

type TokenPayload = JwtPayload & {
  username: string;
};

export const generateToken = (payload: TokenPayload) => {
  const options: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
    algorithm: HASH_ALGORITHM,
  };
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const options: VerifyOptions = {
      algorithms: [HASH_ALGORITHM],
    };
    return jwt.verify(token, JWT_SECRET, options) as TokenPayload;
  } catch (error) {
    return null;
  }
};
```

## 1.3. 로그인 API 작성

이제 로그인 API를 작성해보자. `routes/auth.ts` 파일에 `POST /login` 라우터를 추가하였다. 사용자 이름과 비밀번호를 받아서 로그인 가능한 정보인지 확인하고, 맞다면 JWT 토큰을 발급하여 쿠키에 저장한다.

```typescript
type User = {
  username: string;
  password: string;
}

authRouter.post("/login", async (req: Request<{}, {}, User>, res: Response) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  // 사용자가 존재하지 않는 경우
  if (!user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  // 비밀번호가 일치하지 않는 경우
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const payload = { username, isAdmin: user.isAdmin };
  const token = generateToken(payload);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS를 사용하는 경우에만 true로 설정
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.json({
    message: "Login successful",
  });
});
```

## 1.4. 검증 미들웨어 작성

이렇게 로그인 API를 작성했다. 하지만 사용자를 로그인시키는 것 자체가 목적은 아니다. 로그인을 한 사용자만이 특정 API를 사용할 수 있도록 하기 위해서는 토큰을 검증하는 미들웨어가 필요하다. `utils/auth.ts` 파일에 토큰을 검증하는 `verifyToken` 함수와 이를 통해 사용자를 검증하는 미들웨어를 작성하였다.

```typescript
export const verifyToken = (token: string) => {
  try {
    const options: VerifyOptions = {
      algorithms: [HASH_ALGORITHM],
    };
    return jwt.verify(token, JWT_SECRET, options) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  if (token === null || token === undefined) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  console.log(payload);
  req.body.username = payload.username;
  next();
}
```

이런 식으로 특정 라우트에 미들웨어를 추가하여 사용자를 검증할 수 있다.

```typescript
protectedRouter.get("/", authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: "Protected resource. Authorized user only.",
  });
});
```

혹은 payload의 `isAdmin` 값을 확인하여 관리자만 접근 가능한 API를 만들 수도 있다. 이후에 리프레시 토큰을 추가하는 과정에서 해볼 것이다.

# 2. 리프레시 토큰의 구현

이렇게 액세스 토큰만을 이용한 로그인은 보안에 취약하다. 액세스 토큰을 탈취당하게 되면 토큰의 유효기간이 만료되기 전까지 계속 사용할 수 있기 때문이다.

따라서 액세스 토큰 유효기간을 상대적으로 짧게 설정하고, 긴 유효기간을 갖는 리프레시 토큰을 사용하여 액세스 토큰을 갱신하는 방법을 일반적으로 사용한다.

## 2.1. 동작 설계

리프레시 토큰의 동작은 다음과 같다.

1. 클라이언트에서 로그인 시도. 성공시 서버에서 액세스 토큰과 리프레시 토큰을 발급하고 쿠키에 저장. 리프레시 토큰은 DB에도 저장
2. 클라이언트는 API 요청시마다 쿠키에 저장된 액세스 토큰도 같이 전송
3. 서버는 인증이 필요한 API 요청이 들어올 때마다 미들웨어로 액세스 토큰을 검증
4. 서버에서 액세스 토큰 검증 실패시 401 Unauthorized 응답을 보내고, 만료된 액세스 토큰인 경우 만료되었다는 응답. 검증 성공시 요청 처리
5. 클라이언트는 액세스 토큰 만료 응답을 받을 시 액세스토큰 + 리프레시 토큰을 서버에 보내 새로운 액세스 토큰 발급 요청
6. 서버는 액세스 토큰 + 리프레시 토큰을 검증 후 리프레시 토큰이 만료되지 않았다면 새로운 액세스 토큰을 발급하고 쿠키에 저장해 반환
7. 리프레시 토큰도 만료되었다면 새로 로그인을 요청하라는 응답

## 2.2. redis 세팅

리프레시 토큰을 저장하기 위한 redis를 설치하자. [Install Redis on macOS](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-mac-os/)를 참고했다.

그리고 redis를 사용하기 위한 `redis` 패키지를 설치한다.

```bash
npm install redis
```

그리고 redis 클라이언트를 생성하는 함수를 작성한다. 이는 `utils/redis.ts` 파일에 작성하였다.

```typescript
import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
  await redisClient.connect();
}

connectRedis();

export default redisClient;
```

## 2.3. 리프레시 토큰 사용 이유





# 참고

LocalStorage vs. Cookies: JWT 토큰을 안전하게 저장하기 위해 알아야할 모든것

https://hshine1226.medium.com/localstorage-vs-cookies-jwt-%ED%86%A0%ED%81%B0%EC%9D%84-%EC%95%88%EC%A0%84%ED%95%98%EA%B2%8C-%EC%A0%80%EC%9E%A5%ED%95%98%EA%B8%B0-%EC%9C%84%ED%95%B4-%EC%95%8C%EC%95%84%EC%95%BC%ED%95%A0-%EB%AA%A8%EB%93%A0%EA%B2%83-4fb7fb41327c

Express에서 JWT로 인증시스템 구현하기 ( Access Token과 Refresh Token )

https://velog.io/@kshired/Express%EC%97%90%EC%84%9C-JWT%EB%A1%9C-%EC%9D%B8%EC%A6%9D%EC%8B%9C%EC%8A%A4%ED%85%9C-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-Access-Token%EA%B3%BC-Refresh-Token

Access Token Lifetime

https://www.oauth.com/oauth2-servers/access-tokens/access-token-lifetime/

인증과 인가를 안전하게 처리하기 (Refresh Token Rotation)

https://velog.io/@chchaeun/%EC%9D%B8%EC%A6%9D%EA%B3%BC

Install Redis on macOS

https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-mac-os

Node.js guide

https://redis.io/docs/latest/develop/connect/clients/nodejs
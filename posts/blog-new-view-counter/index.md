---
title: 블로그 고치기 - 블로그에 조회수 달기
date: "2024-02-18T00:00:00Z"
description: "없어졌던 블로그의 조회수 카운터를 다시 달아주자"
tags: ["front", "blog"]
---

# 시작

이전에 블로그를 만들면서 [블로그 만들기 - 11. 글 조회수 달기](https://witch.work/posts/blog-remake-11)에서 조회수 카운터를 달았던 바 있다. 하지만 수많은 오류 등으로 인해 슬쩍 없애 버렸었다. 이를 다시 만들어 주도록 하겠다.

[Adding a View Counter to your Next.js Blog](https://upstash.com/blog/nextjs13-approuter-view-counter)라는 글을 참고하였다.

[upstash Redis](https://upstash.com/)가 하루에 10000회의 무료 사용량이 있고 NoSQL이라 key-value 기반이므로 조회수 카운터에 적합하다고 보았다. 또한 upstash 공식 블로그 글이라 신뢰도가 높다고 판단하였다.

# 1. 기본 설정

먼저 upstash 로그인을 하고(나는 구글 로그인을 썼다) [upstash 콘솔](https://console.upstash.com/)에서 새로운 데이터베이스를 만들어 주자. 이름은 `witch-blog-view-counter`로 하고 리전은 가장 가까울 것 같은 일본 리전으로 선택하였다.

트래픽 SSL 암호화와 max size를 초과하는 요청을 거부하는 설정이 있길래 켜두었다.

![db 생성하기](./create-db.png)

그리고 DB 대시보드에 나오는 REST 연결 정보 중 `.env`항목을 `.env.local`에 추가해 주자.

```env
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

그리고 redis 패키지를 설치하자. 이걸로 기본적인 준비는 끝났다.

```bash
yarn add @upstash/redis
```

# 2. 조회수 증가 로직

라우트 핸들러를 만들어서 조회수를 증가시키는 로직을 만들자. `app/viewcount/route.ts`를 만들어서 `/viewcount`에서 post 요청을 받도록 한다.

`Redis.fromEnv()`는 환경 변수에서 `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`을 자동으로 읽어와서 Redis 인스턴스를 만들어 준다.



# 참고

[Adding a View Counter to your Next.js Blog](https://upstash.com/blog/nextjs13-approuter-view-counter)

[Nextjs Route Handlers 공식 문서](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

[한 땀 한 땀 블로그 만들기 - 조회수 세기](https://solidw.github.io/posts/how-to-make-blog-views-count)

[upstash 공식 문서 - Quickstarts nextjs 13](https://upstash.com/docs/redis/quickstarts/nextjs13)
---
title: 블로그 리팩토링 - 1. contentlayer에서 velite로
date: "2024-03-20T01:00:00Z"
description: "이분 탐색의 활용에 대해 알아봅니다."
tags: ["algorithm"]
---

nextjs 14가 나왔고, 블로그에 쓰였던 라이브러리들도 업데이트가 많이 되었다. 또한 지금 다 파악할 수 없는 여러 가지 이유로 블로그 속도도 많이 느려졌다. 그래서 블로그를 리팩토링 해보기로 했다. 리팩토링을 하고 나서 최적화를 진행할 것이다.

# to pnpm

기존에 yarn classic을 사용하고 있었는데 pnpm으로 전환하였다. 다음 글을 참고했다.

[Yarn Classic에서 Pnpm으로 전환하기 with TurboRepo](https://medium.com/wantedjobs/yarn-classic%EC%97%90%EC%84%9C-pnpm%EC%9C%BC%EB%A1%9C-%EC%A0%84%ED%99%98%ED%95%98%EA%B8%B0-with-turborepo-7c0c37cb3f9e)

# 1. contentlayer의 대안들

`.md` 파일을 변환할 때 contentlayer라는 라이브러리를 사용하였다. [하지만 이는 더 이상 유지보수되지 않고 있다.](https://github.com/contentlayerdev/contentlayer/issues/429)

contentlayer의 원래 메인테이너는 Prisma에 관여하고 있고 후원을 받지 않는 개발은 할 수 없는 상태인데 Vercel에서 contentlayer에 대한 후원을 중단했다고 한다. netlify와 협의 중이지만 어떻게 될지 모른다고 한다.

그래서 대안을 찾아 보기로 했다. 먼저 contentlayer는 제거하였다.

```bash
yarn remove contentlayer next-contentlayer
```

## 1.1. @next/mdx

[nextjs 공식 문서에서도 마크다운을 변환하는 방법을 소개하고 있었다.](https://nextjs.org/docs/app/building-your-application/configuring/mdx) 공식 문서에도 있는 만큼 contentlayer와 같이 갑자기 유지보수가 중단되지 않을 것이다.

하지만 몇 가지 단점이 있었다.

먼저 contentlayer에서는 프로젝트 루트의 /posts 경로에서 글을 관리했었는데 모든 글을 app/ 디렉토리에 넣어야 한다. next-mdx-remote를 사용하여 해결할 수 있지만 rsc 지원이 아직 불안정하고 또한 next-mdx-remote는 원격으로 데이터를 가져오기 위한 라이브러리인데 이를 다른 로컬 경로에 있는 파일을 가져오기 위한 라이브러리로 사용하는 것은 좋지 않다.

또한 원하는 대로 커스터마이징하기 어렵다. contentlayer는 아예 .md 파일 내용을 HTML 형식의 문자열로 만들어 주고 이를 사용자가 가져다가 커스터마이징할 수 있었다. 하지만 `@next/mdx`는 .md나 .mdx 파일을 하나의 페이지로 만드는 형식이기 때문에 커스텀이 상대적으로 어렵다.

각 컴포넌트의 스타일링도 CSS를 통해서 쉽게 할 수 있었던 contentlayer와 달리 `mdx-components.tsx` 파일을 만들어서 커스텀 컴포넌트를 만들어야 한다.

기존 코드와의 호환성과 유지보수를 위해 다른 대안을 찾아보기로 했다.

## 1.2. marked

[블로그 개편기 - 4. marked를 활용한 마크다운 변환기 구현하기](https://blog.itcode.dev/posts/2021/10/28/nextjs-reorganization-4)에서 사용하고 있는 marked 라이브러리도 방법이었다.

하지만 이 역시 따로 .md 파일을 HTML로 변환하는 방법을 찾아야 하고, 커스텀 컴포넌트를 만들어야 한다. 잘 사용하고 있던 remark와 rehype 플러그인도 버려야 한다. 기각했다.

## 1.3. velite

[contentlayer의 유지보수 이슈](https://github.com/contentlayerdev/contentlayer/issues/429)를 보면 velite라는 라이브러리의 제작자가 홍보하고 있었다. 스타는 고작 173개짜리 라이브러리다. 당연히 많이 사용되는 라이브러리는 아닌 것 같다.

하지만 contentlayer에 비해 훨씬 코드가 간단했고 마크다운의 타입 정의도 지원했으며 기존 contentlayer 코드와 호환성도 좋았다. 그래서 이를 사용하기로 했다. 오픈소스 기여를 탐내고 있는 나로서는 이 라이브러리에 기여하면서 쓸 수도 있을 것이다.

그래서 이 글에서는 기존의 contentlayer를 velite로 대체하는 작업을 진행할 것이다.

# 2. 설치와 기본 설정

[velite 공식 문서](https://velite.js.org/)를 참고하였다.

```bash
pnpm add velite -D
```

현재 contentlayer의 변환 문서 형식

```json
{
  "title": "C-through - 1. Implicit int rule",
  "description": "C언어의 implicit int rule에 대하여",
  "date": "2022-01-09T00:00:00.000Z",
  "tags": [
    "language"
  ],
  "body": {
    "raw": "글의 내용 그대로",
    "html": "글 내용을 변환한 HTML 형식 문자열"
  },
  "_id": "c-through-1/index.md",
  "_raw": {
    "sourceFilePath": "c-through-1/index.md",
    "sourceFileName": "index.md",
    "sourceFileDir": "c-through-1",
    "contentType": "markdown",
    "flattenedPath": "c-through-1",
    "headingTree": [
      {
        "data": {
          "hProperties": {
            "title": "1. C-through",
            "id": "1.-C-through"
          }
        },
        "depth": 1,
        "children": []
      },
      {
        "data": {
          "hProperties": {
            "title": "2. \"Implicit int\" rule",
            "id": "2.-\"Implicit-int\"-rule"
          }
        },
        "depth": 1,
        "children": []
      },
      {
        "data": {
          "hProperties": {
            "title": "3. 참고",
            "id": "3.-참고"
          }
        },
        "depth": 1,
        "children": []
      }
    ],
    "thumbnail": {
      "local": "/thumbnails/c-through-1-index-md-thumbnail.png",
      "cloudinary": "https://res.cloudinary.com/desigzbvj/image/upload/c_scale,w_300,f_auto/blog/thumbnails/thumbnails-c-through-1-index-md-thumbnail-png",
      "blurURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAIAAABxZ0isAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAgUlEQVR4nGNYvXp1SkpKenq6t7f30qVLd+7c+R8MGHp7e6WlpdXU1Dg4OLKysl69evX792+QREtLi5yc3MWLF69evXrjxg2IcpDEnj27m5ubjhw58uXLl99gAJWYM2dxaGhYYmLi0qVLr169+v//f6hREVG5be19O3fuQBb9//8/ALhkZ3yrHgJ0AAAAAElFTkSuQmCC"
    }
  },
  "type": "Post",
  "url": "/posts/c-through-1"
}
```


# 참고

[Next.js에서 MDX 컴포넌트를 스타일링하기 (편?하게)](https://velog.io/@gomiseki/Next.js%EC%97%90%EC%84%9C-MDX-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EB%A5%BC-%EC%8A%A4%ED%83%80%EC%9D%BC%EB%A7%81%ED%95%98%EA%B8%B0-%ED%8E%B8%ED%95%98%EA%B2%8C)

[Next.js docs - Markdown and MDX](https://nextjs.org/docs/app/building-your-application/configuring/mdx)

[Yarn Classic에서 Pnpm으로 전환하기 with TurboRepo](https://medium.com/wantedjobs/yarn-classic%EC%97%90%EC%84%9C-pnpm%EC%9C%BC%EB%A1%9C-%EC%A0%84%ED%99%98%ED%95%98%EA%B8%B0-with-turborepo-7c0c37cb3f9e)
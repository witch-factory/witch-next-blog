---
title: 블로그 버그 수정 - 서버와 연동되는 부분 트러블 슈팅
date: "2023-08-01T00:00:00Z"
description: "서버와 연동되는 부분, 썸네일과 조회수 고치기"
tags: ["blog"]
---

# 1. 문제 발생

블로그를 보다가 조회수 부분을 유심히 보니 뭔가 이상했다. 현재 DB에 저장되고 있는 조회수가 하나로 묶여서 저장되고 있는 것 같았다. 테이블을 보니 웬 `undefined`값에 조회수가 모두 수신되고 있었다.

그리고 썸네일을 CDN에 업로드하는 데에도 오류가 발생하고 있었다. 하지만 현재 CDN으로 사용하고 있는 cloudinary의 무료 플랜은 업로드에 대해 상당히 빡빡하므로 한번한번 고치기가 쉽지 않았다. 그래서 일단 로컬에 모든 썸네일을 저장해 놓는 걸로 대체한 후 다른 작업들을 먼저 진행하였다. 하지만 이제는 미룰 수 없다. CDN으로 업로드하는 코드를 고쳐야 한다. 

더 이상한 것은 Vercel에서는 이 cloudinary 업로드가 잘 진행되는데 로컬에서는 이게 잘 안되는 것이다. 대략 이런 오류 메시지가 발생했다.

```bash
"binary-search/index.md": UnexpectedMarkdownError: Must supply api_key
```

그래서 환경변수를 한번 출력해 보았더니 역시나, 로컬에서는 환경변수를 제대로 인식하지 못하고 있었다. 분명 `.env.local`에 잘 넣어 줬는데 말이다. 이를 수정해 보자.

# 2. 조회수 카운터 오류

확인 결과 `ViewCounter`에서는 문제가 없었다. 이 조회수를 쓰는 곳은 글 상세 페이지였는데 여기서는 slug를 만들어서 `ViewCounter`컴포넌트에 props로 넘겨주었고 해당 컴포넌트에서는 그 props로 받은 slug를 기반으로 DB 키를 만들었다.

문제는 slug를 만드는 코드가 다음과 같았다는 것이다.

```tsx
const slug=post._raw.flattenedPath.split('/')[1];
```

이는 `post._raw.flattenedPath`가 `[category]/[slug]`형식이었을 때의 잔재이다. 현재는 post의 `flattenedPath`가 slug만 가리키도록 수정되었다. 따라서 이를 수정해 주기만 하면 된다.

```tsx
const slug=post._raw.flattenedPath;
```
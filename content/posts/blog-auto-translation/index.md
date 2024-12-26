---
title: 블로그에 자동 번역 기능 추가하기
date: "2024-12-25T00:00:00Z"
description: "블로그의 글들에 자동 번역을 추가해보기"
tags: ["blog"]
---

# 1. 들어가며

블로그를 운영하다 보니 전세계 사람들을 타겟으로 콘텐츠를 제공하고 싶어졌다. 한국어로 글을 작성하다 보니 언어의 장벽으로 인해서 내 글이 도달하는 사람들의 수가 적을 수밖에 없다고 느꼈기 때문이다.

따라서 원래 블로그 글 중 번역 글들을 따로 게시판을 만들어 옮기고 자동 번역 기능을 추가하고자 했다. 요즘 ChatGPT가 번역을 너무 잘한다고 해서 GPT에게 맡겨볼 생각이다.

# 2. 번역 API 사용해보기

먼저 OpenAI developer platform의 [대시보드에서 API 키를 만들 수 있다.](https://platform.openai.com/api-keys) 그리고 이걸 사용해서 원격으로 ChatGPT 요청을 보낼 수 있다.

이런 GPT API를 사용하면 ChatGPT Plus와 관계없이 따로 API 비용이 청구되는데, 역시 OpenAPI 플랫폼의 프로필에 있는 Organization - Billing에서 확인할 수 있다. 나는 10달러의 크레딧을 충전해 두었다.

## 2.1. API 실행

그리고 내 블로그의 프로젝트는 pnpm을 패키지 매니저로 사용하므로 JS/TS OpenAI SDK를 설치하자.

```bash
pnpm add openai
```

그다음 프로젝트에 다음과 같은 예시 코드를 추가해보자. 나는 대충 프로젝트 루트에 두었다. 기본적인 부분은 [OpenAI의 Developer quickstart 문서](https://platform.openai.com/docs/quickstart?language-preference=javascript)에서 가져왔다.

```javascript
// example.mjs
import OpenAI from 'openai';

const OPENAPI_API_KEY = '여기에 API 키를 넣어주세요';

const openai = new OpenAI({
  apiKey: OPENAPI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'You are a friendly and playful assistant.' },
    {
      role: 'user',
      content: '나에게 인사를 해줘!',
    },
  ],
});

console.log(completion.choices[0].message);
```

role의 system은 GPT가 어떻게 행동할지 지정한다. 예를 들어서 "너는 전문적인 경력을 가진 번역가야." 등의 역할 지정을 할 수 있다. user는 일반적으로 우리가 사용하는 역할 그러니까 GPT에게 질문하는 사용자이다. assistant도 있는데 명령을 수행하기 위한 사전 지식 등을 전달하는 데 쓴다고 한다.

아무튼 이렇게 기본적인 코드를 쓰고 터미널에서 `node example.mjs`를 실행하면 ChatGPT가 답변을 생성해준다. 실행할 때마다 조금씩 답변이 달라졌지만 대략 이런 답변이 나왔다.

```js
{
  role: 'assistant',
  content: '안녕하세요! 😊 오늘 하루는 어떠신가요? 즐거운 시간 보내고 계신가요?',
  refusal: null
}
```

## 2.2. API 코드 다듬기

그럼 이제 프롬프트를 다듬고, 특정 문서를 가져와서 번역해 보자.


# 참고

openapi platform Developer quickstart

https://platform.openai.com/docs/quickstart

3차시 수업 ChatGPT로 한국어를 영어로 번역해주는 번역기 만들어보기

https://velog.io/@janequeen/gpt-%EB%B2%88%EC%97%AD%EA%B8%B0
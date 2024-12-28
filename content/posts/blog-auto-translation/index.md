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

그럼 이제 프롬프트를 다듬고, 특정 문서를 가져와서 번역해 보자. 적당히 스크립트를 작성하였다.

```javascript
const systemPrompt = 'You are an expert technical translator. Your goal is to translate the given Korean technical documents into professional and accurate English. Ensure the translation is concise and formal, suitable for professional audiences. Provide only the translation without additional explanation or context.';

const openai = new OpenAI({
  apiKey: OPENAPI_API_KEY,
});

// ...

const translateFile = async (inputFile, outputFile) => {
  const inputContent = readFileSync(inputFile, 'utf-8');

  const outputDir = path.dirname(outputFile);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true }); // 디렉토리가 없으면 생성한다
  }

  try {
    const completion = await openai.chat.completions.create({
      // 상대적으로 경량인 mini 모델 사용(gpt-4o보다 훨씬 싸다)
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: inputContent },
      ],
    });

    const translatedContent = completion.choices[0].message.content;
    writeFileSync(outputFile, translatedContent);
  }
  catch (error) {
    console.error('Failed to translate:', error);
  }
};
```

# 3. 자동화

만약 배포 시에 번역을 자동화하고 싶다면, GitHub Actions를 사용하면 된다. 토스 기술 블로그의 [GitHub Actions로 개선하는 코드 리뷰 문화](https://toss.tech/article/25431)라는 글을 인상깊게 보았기 때문에 처음에는 GitHub Actions를 사용하려고 했다.

하지만 지금 필요한 기본적인 흐름은 다음과 같다.

- 내가 블로그 글을 쓴다.
- 배포하는 시점 이전에 번역된 글이 생성된다.
- 번역된 글과 함께 배포된다.

이를 위해서는 GitHub Actions까지 필요없다. 왜냐 하면 매번 글이 새롭게 번역될 필요가 없기 때문이다(ChatGPT 크레딧을 아끼기 위해서라도 매번 새로 번역되어서도 안된다).

따라서 다음과 같은 동작을 하는 스크립트를 짜서 prebuild 스크립트로 실행하면 된다. 혹은 아예 `build` 스크립트에 번역하는 스크립트의 실행을 추가해도 된다.

- 한글로 작성된 모든 글에 대해 해당 글이 이미 번역되었는지 확인한다.
  - 한글로 작성된 글은 `content/posts` 디렉토리에 있고 번역된 글은 `content/en-posts`나 `content/jp-posts`(이후에 할지도 모르겠다) 같은 언어별 디렉토리에 있다.
- 번역된 글이 없다면 ChatGPT API를 사용해서 번역한다.

내가 로컬에서 빌드를 하고 GitHub에 푸시를 해도 되고, 내가 dev 모드에서만 개발하다가 배포한다고 해도 어차피 Vercel에서 배포 전에 빌드를 하고 따라서 prebuild 스크립트가 실행되기 때문에 번역된 글이 생성되어 배포될 것이다.

일단 다음과 같이 스크립트를 작성

```js
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import OpenAI from 'openai';

const OPENAI_API_KEY = '내 API 키를 넣어주세요';

const systemPrompt = 'You are an expert technical translator. Your goal is to translate the given Korean technical documents into professional and accurate English. Ensure the translation is concise and formal, suitable for professional audiences. Provide only the translation without additional explanation or context.';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const __dirname = path.resolve();
const inputDir = path.join(__dirname, 'content', 'posts');
const outputDir = path.join(__dirname, 'content', 'en-posts');

const translateFileToEnglish = async (inputFile, outputFile) => {
  // /content/posts 의 파일을 순회할 것이므로 inputFile 위치의 파일은 무조건 존재
  const inputContent = readFileSync(inputFile, 'utf-8');
  const outputDirPath = path.dirname(outputFile);

  if (!existsSync(outputDirPath)) {
    mkdirSync(outputDirPath, { recursive: true }); // 디렉토리가 없으면 생성한다
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: inputContent },
      ],
    });

    const translatedContent = completion.choices[0].message.content;
    const translateResourceUsage = completion.usage;
    console.log('Translate resource usage: ', translateResourceUsage);

    writeFileSync(outputFile, translatedContent);
    console.log(`Translated: ${inputFile} -> ${outputFile}`);
  }
  catch (error) {
    console.error(`Failed to translate ${inputFile}:`, error);
  }
};

// TODO: 다른 언어로의 번역도 지원할지도?
const translateAllFiles = async () => {
  const posts = readdirSync(inputDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const post of posts) {
    const inputFile = path.join(inputDir, post, 'index.md');
    const outputFile = path.join(outputDir, post, 'index.md');

    if (!existsSync(inputFile)) {
      console.warn(`Source file not found: ${inputFile}`);
      continue;
    }

    if (existsSync(outputFile)) {
      console.log(`Translation already exists: ${outputFile}`);
      continue;
    }

    await translateFileToEnglish(inputFile, outputFile);
  }
};

translateAllFiles().then(() => {
  console.log('Translation process completed.');
}).catch((error) => {
  console.error('An error occurred during the translation process:', error);
});
```

그리고 `node translate.mjs`를 실행하면 번역이 진행된다. 번역이 완료되면 `content/en-posts` 디렉토리에 번역된 파일이 생성된다.

하나하나 번역하는 데 시간이 좀 걸리기는 하지만 번역이 완료되면 번역된 파일이 생성되고, 다음에는 번역이 필요 없으므로 번역된 파일이 이미 존재하는 경우에는 번역을 건너뛰는 동작을 잘 하는 걸 확인할 수 있다.

# 이미지 경로 문제 해결

이렇게 하고 나면 `content/en-posts` 디렉토리에 번역된 파일이 생성된다. 그런데 이미지 경로가 문제다. 내 블로그는 Next.js를 사용해서 만들어졌고 이건 `/public` 폴더에 있는 이미지를 절대 경로를 통해 사용해야 한다. 그런데 마크다운으로 쓰인 내 글의 이미지들은 `./image.png`와 같은 상대 경로로 되어 있다.

따라서 내가 사용하는 [velite 라이브러리에서는 마크다운 파일을 변환할 때 `markdown.copyLinkedFiles`이라는 옵션을 통해서 상대 경로로 표현된 파일의 복사본을 만들고 이미지 경로도 바꿔주는 기능을 제공한다.](https://velite.js.org/reference/config#markdown-copylinkedfiles)

하지만 다국어로 가면 문제가 좀 생긴다. 물론 지원하는 언어를 하나씩 추가할 때마다 이미지의 복사본을 하나씩 더 만들도록 할 수도 있다. 하지만 이미지가 한두개도 아니고 이건 비효율적이기 때문에, 이미지는 `content/posts` 디렉토리에만 원본으로 존재하고 번역된 파일들에서는 그 원본을 복사해서 만든 `public` 디렉토리에 있는 이미지를 사용하는 게 맞다.

`content/posts`에 원본 글과 원본 글에 쓰인 이미지가 있다. 그리고 번역된 글은 `content/en-posts`에 있다. 그러면 `en-posts`에 있는 마크다운 글에서 `./경로`와 같이 쓰인 이미지 경로를 `../../posts/경로`로 바꾸면 된다. 이건 remark 플러그인을 작성해서 할 수 있다.

`path` 모듈을 이용해서 기존의 폴더명도 알아냈다.

```js 
import path from 'path';

import { Root } from 'mdast';
import { VFile } from 'vfile';
import { visit } from 'unist-util-visit';

export default function remarkImagePath() {
  return function (tree: Root, file: VFile) {
    const articleSlugPath = path.basename(path.dirname(file.path));
    const updatedDir = `../../posts`;

    visit(tree, 'image', (imageNode) => {
      const fileName = imageNode.url.replace('./', '');
      const updatedPath = `${updatedDir}/${articleSlugPath}/${fileName}`;
      imageNode.url = updatedPath;
    });
  };
}
```

그리고 썸네일의 URL을 생성하는 함수가 있었는데, 이 함수는 velite의 내부 로직을 이용해서 상대 경로로 표현된 썸네일의 URL을 절대 경로로 바꾸는 동작을 했다. 이건 velite에서 자동으로 마크다운을 파싱하면서 이미지의 src를 바꿔주기 전에 실행되는 함수였다.

때문에 여기서도 마찬가지로 번역된 글의 상대 경로를 바꿔주는 작업을 해줘야 한다. 이를 위해서 `generateThumbnailURL`함수에 `lang` 인수를 추가하고 번역된 글, 그러니까 한국어가 아닌 다른 언어가 인수로 들어오면 이미지 경로를 적절한 상대 경로로 변환해 주도록 했다. 로직은 위의 remark 플러그인과 비슷하다.

```ts
export async function generateThumbnailURL(meta: ZodMeta, title: string, lang: Language = 'ko') {
  // source of the images
  if (!meta.mdast) return '/witch-new-hat.png';
  const images = extractImgSrc(meta.mdast);
  if (images.length > 0) {
    let imageURL = images[0];
    if (lang !== 'ko') {
      const articleSlugPath = path.basename(path.dirname(meta.path));
      const updatedDir = `../../posts`;

      const fileName = imageURL.replace('./', '');
      imageURL = `${updatedDir}/${articleSlugPath}/${fileName}`;
    }
    console.log('이미지 경로 ', imageURL);
    // 상대 경로 이미지인 경우 processAsset 함수로 처리
    return isRelativePath(imageURL)
      ? processImageForThumbnail(imageURL, meta)
      : imageURL;
  }
  else {
    // vercel/og를 이용한 open graph 이미지 생성
    return `${blogConfig.url}/api/og?title=${title}`;
  }
}
```



# 다국어 페이지 만들기

# 참고

openapi platform Developer quickstart

https://platform.openai.com/docs/quickstart

3차시 수업 ChatGPT로 한국어를 영어로 번역해주는 번역기 만들어보기

https://velog.io/@janequeen/gpt-%EB%B2%88%EC%97%AD%EA%B8%B0

GitLab 기술 문서 번역용 GPT 설계 가이드

https://insight.infograb.net/blog/2024/03/27/gpt-gitlabdocs/
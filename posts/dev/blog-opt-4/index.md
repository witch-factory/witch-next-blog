---
title: 블로그 최적화 - 4. 여러 가지 최적화
date: "2023-06-11T04:00:00Z"
description: "겁나 빠른 마녀 : 블로그 최적화 그 네번째"
tags: ["blog", "web"]
---

# 1. 검색 페이지 최적화

검색 페이지는 현재 너무 많은 DOM 트리 요소를 가지고 있다. 따라서 무한 스크롤을 이용해서 초기 로딩되는 요소를 줄여보자.

# 2. 아이콘 소스 base64로 변경

헤더에 있는 아이콘들의 로딩과 모드에 따른 전환이 느리다는 생각이 든다. 따라서 이를 base64 인코딩 기반으로 바꿔보자.

기존에 쓰던 아이콘들의 base64 인코딩이 문자열 변수 형태로 정의된 파일 `src/utils/iconsURL.ts`를 만들자.

```ts
const searchIcon='data:image/png;base64, 어쩌고저쩌고';
const searchIconDark='data:image/png;base64, 어쩌고저쩌고';
const searchIconPink='data:image/png;base64, 어쩌고저쩌고';

const hamburgerIcon='data:image/png;base64, 어쩌고저쩌고';
const hamburgerIconDark='data:image/png;base64, 어쩌고저쩌고';
const hamburgerIconPink='data:image/png;base64, 어쩌고저쩌고';

const cancelIcon='data:image/png;base64, 어쩌고저쩌고';
const cancelIconPink='data:image/png;base64, 어쩌고저쩌고';

const linkIcon='data:image/png;base64, 어쩌고저쩌고';
const linkIconDark='data:image/png;base64, 어쩌고저쩌고';
const linkIconPink='data:image/png;base64, 어쩌고저쩌고';

export {
  searchIcon,
  searchIconDark,
  searchIconPink,

  hamburgerIcon,
  hamburgerIconDark,
  hamburgerIconPink,

  cancelIcon,
  cancelIconDark,
  cancelIconPink,

  linkIcon,
  linkIconDark,
  linkIconPink,
};
```

그리고 아이콘들의 src를 결정하는 객체에서 이 변수들을 import해서 사용한다. 이렇게 하면 이미지를 브라우저에서 캐싱할 수 없게 되지만 대신 매우 빠른 속도로 이미지를 서빙할 수 있다.

```ts
// src/components/header/menu/toggler/index.tsx
const hamburgerIconMap: {[key: string]: string} = {
  'light':hamburgerIcon,
  'dark':hamburgerIconDark,
  'pink':hamburgerIconPink,
};

const cancelIconMap: {[key: string]: string} = {
  'light':cancelIcon,
  'dark':cancelIconDark,
  'pink':cancelIconPink,
};
```

검색 아이콘도 똑같이 base64 문자열로 src를 변경한다.

```tsx
// src/components/header/search/index.tsx
import { searchIcon, searchIconDark, searchIconPink } from '@/utils/iconsURL';

const searchIconMap: {[key: string]: string}={
  'light':searchIcon,
  'dark':searchIconDark,
  'pink':searchIconPink,
};
```

# 참고

https://www.bucketplace.com/post/2020-09-10-%EC%98%A4%EB%8A%98%EC%9D%98%EC%A7%91-%EB%82%B4-%EB%AC%B4%ED%95%9C%EC%8A%A4%ED%81%AC%EB%A1%A4-%EA%B0%9C%EB%B0%9C%EA%B8%B0/
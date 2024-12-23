---
title: NextJS metadata 오류 해결
date: "2023-09-13T00:00:00Z"
description: "Nextjs 13 마이그레이션 중 메타데이터 문제"
tags: ["front", "blog"]
---

# 1. 시작

지금 이 블로그는 NextJS 13의 app router로 마이그레이션 중이다. 이 과정은 추후 블로그에 올릴 예정이다. 여기서는 마이그레이션 과정에서 발생한 사소한, 그런데 시간을 꽤 잡아먹었던 문제를 하나 정리한다.

먼저 앱 라우터로 구성한 페이지 구조는 다음과 같이 짜여 있다.

```
app
├── (doc)
│   ├── about
│   │   ├── page.tsx
│   ├── posts
│   │   ├── [slug]
│   │   │   ├── page.tsx
│   ├── layout.tsx
├── (page)
│   ├── posts
│   │   ├── all
│   │   │   ├── page.tsx
│   │   │   ├── [page]
│   │   │   │   ├── page.tsx
│   │   ├── tag/[tag]
│   │   │   ├── page.tsx
│   │   │   ├── [page]
│   │   │   │   ├── page.tsx
│   │   ├── page.tsx
├── 메인 페이지
```

그리고 `/posts`페이지는 검색창이 있는 특성 상 client state 관리가 필요해서 클라이언트 컴포넌트로 관리되고 있었다. 따라서 서버 컴포넌트에서만 쓸 수 있는 `generateMetadata`와 같은 api들은 사용하지 않았다.

그런데 뜬금없이 `/posts/tag/[tag]/[page]`페이지에서 다음과 같은 에러가 발생했다. 해당 페이지는 서버 컴포넌트로 구성되어 있는데도 말이다.

```
You are attempting to export "generateMetadata" from a component marked with "use client", which is disallowed. Either remove the export, or the "use client" directive. Read more: https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive
```

그래서 문제를 해결해 보려고 여러 시도를 하였는데 그걸 여기 적는다.

# 2. 문제 해결 시도

## 2.1. 클라이언트 컴포넌트 분리

`generateMetadata` api는 서버 사이드에서만 쓰일 수 있다. 그리고 오류 메시지로 추측해 보건대 `/posts`페이지가 `use client`모드로 렌더링되는 게 영향을 주는 것이 아닐까 추측하여 이를 먼저 바꾸어 보았다. 지금 `/posts`페이지 즉 `/posts/page.tsx`는 다음과 같이 짜여 있다.

```tsx
'use client';
/* import들 생략 */
function PostSearchPage() {
  const searchPosts: CardProps[] = getSearchPosts();
  const [searchKeyword, debouncedKeyword, setSearchKeyword] = useSearchKeyword();
  const [filteredPostList, setFilteredPostList] = useState<CardProps[]>(searchPosts);
  const [page, setPage] = useState<number>(1);
  const debouncedPage = useDebounce(page.toString(), 300);

  const infiniteScrollRef = useRef<HTMLDivElement>(null);
  const totalPage = Math.ceil(filteredPostList.length / ITEMS_PER_PAGE);

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, [setSearchKeyword]);

  useEffect(() => {
    setFilteredPostList(filterPostsByKeyword(searchPosts, debouncedKeyword));
  }, [debouncedKeyword]);

  useInfiniteScroll(infiniteScrollRef, useCallback(()=>{
    if (page < totalPage) {
      setPage(prev=>prev + 1);
    }
  }, [debouncedPage, totalPage]));

  return (
    <>
      <Title heading='h2' size='md'>전체 글 검색</Title>
      <SearchConsole 
        value={searchKeyword}
        onChange={onKeywordChange}
      />
      {filteredPostList.length === 0 ?
        <p>검색 결과가 없습니다.</p> : null
      }
      <PostList postList={filteredPostList.slice(0, ITEMS_PER_PAGE * page)} />
      <div ref={infiniteScrollRef} />
    </>
  );
}
```

그래서 `useState`를 쓰는 것과 같이 클라이언트 렌더링이 필요한 부분을 `SearchPageBody`와 같은 컴포넌트로 분리하여 `pageBody.tsx` 파일을 만들었다. 해당 컴포넌트는 `use client`모드로 렌더링하도록 하였다. 또한 `/posts/page.tsx`는 서버 사이드 렌더링으로 바꾸었다.

```tsx
// posts/page.tsx
/* import 생략 */

function PostSearchPage() {

  return (
    <>
      <Title heading='h2' size='md'>전체 글 검색</Title>
      <SearchPageBody />
    </>
  );
}
```

하지만 오류가 여전히 해결되지 않았다.

## 2.2. 라우트 변경해보기

오류 메시지를 다시 한번 잘 읽어보자.

```
You are attempting to export "generateMetadata" from a component marked with "use client", which is disallowed. Either remove the export, or the "use client" directive. Read more: https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive

    ,-[/Users/kimsunghyun/Desktop/nextjs-blog/src/app/(page)/posts/tag/[tag]/[page]/page.tsx:86:1]
 86 |   return paths;
 87 | }
 88 | 
 89 | export async function generateMetadata({ params }: Props): Promise<Metadata> {
    :                       ^^^^^^^^^^^^^^^^
    ...대충 generateMetadata 내용(생략)...
    `----

File path:
  ./src/app/(page)/posts/tag/[tag]/[page]/page.tsx
  ./src/app/(page)/posts/page.tsx
```

아래에 보면 File Path라고 해서 어떤 파일에서 문제가 생긴지 알려주는 것 같다. 그리고 오류 메시지도 `/posts/tag/[tag]/[page]/page.tsx`를 가리키고 있다.

[Nextjs 공식 문서의 optimizing - Metadata - ordering](https://nextjs.org/docs/app/building-your-application/optimizing/metadata#ordering)문서를 보면 메타데이터는 루트 세그먼트에서 시작해서 해당 페이지의 `page.js`에 도달할 때까지 탐색하면서 메타데이터를 생성한다고 한다. 그러면 `/posts/tag/[tag]/[page]`의 메타데이터를 생성할 때도 `/posts`라우트를 지날 테고 그래서 오류가 발생하는 것이 아닐까 했다.

그래서 `/posts`에서 렌더링하는 컴포넌트를 다른 곳으로 옮겨보았다. `/posts/page.tsx`를 `/search`로 바꾸었다. 하지만 그렇게 해도 오류가 뜨는 파일 경로가 `./src/app/(page)/search/page.tsx`로 바뀔 뿐이었다.

그런데 보면 해당 파일의 동적 라우트 중 하나에 해당하는 곳, 그러니까 가령 `/posts/tag/study/2`와 같은 라우트에 접속할 때는 저런 버그가 발생하지 않았다. `generateMetadata`의 위치도 `/posts/tag/[tag]/[page]/page.tsx`에 있었는데도 엉뚱한 `/posts`에서만 버그가 발생하고 있었던 것이다.

## 2.3. import의 문제

위와 같은 실험들을 통해서 `/posts`경로에서 뭔가 `/posts/tag/[tag]/[page]`에 의존성이 있는 부분이 있다는 추측을 할 수 있었다. 

import들이 정적으로 의존성 그래프를 생성할 때 `/posts`경로에서 `/posts/tag/[tag]/[page]`를 참조하고, 거기에는 `generateMetadata`가 있으니까 마치 `/posts`에서 `generateMetadata`를 사용한 것처럼 취급됨에 따라 위와 같은 오류가 뜨는 게 아닐까 했다.

아니나 다를까, `/posts/page.tsx`의 import문들을 보니...

```tsx
'use client';

import { useCallback, ChangeEvent, useEffect, useState, useRef } from 'react';

import Title from '@/components/atoms/title';
import SearchConsole from '@/components/molecules/searchConsole';
import { CardProps } from '@/components/organisms/card';
import PostList from '@/components/templates/postList';
import filterPostsByKeyword from '@/utils/filterPosts';
import { getSearchPosts } from '@/utils/post';
import { useDebounce } from '@/utils/useDebounce';
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';
import useSearchKeyword from '@/utils/useSearchKeyword';

/* 이 부분이 문제다 */
import { ITEMS_PER_PAGE } from './tag/[tag]/[page]/page';

function PostSearchPage() {
  /* 검색 페이지 컴포넌트 구현 */
}
```

따라서 다음 부분을 이렇게 고쳐 주면 문제가 해결된다. 정말 별거 아닌 원인이었다.

```tsx
'use client';

/* 앞선 import문들 생략 */
import useSearchKeyword from '@/utils/useSearchKeyword';

const ITEMS_PER_PAGE = 10;

function PostSearchPage() {
  /* 검색 페이지 컴포넌트 구현 */
}
```

# 3. 후속조치

위에서 수정한 이 `ITEMS_PER_PAGE`라는 변수는 상당히 많은 곳에서 쓰이고 있으므로 이렇게 파일마다 정의해 주는 건 좋은 선택이 아니다. 따라서 이를 글을 가져오는 함수들이 있는 `src/utils/post.ts`에 배치시켰다.

```ts
// src/utils/post.ts
/* 페이지당 몇 개의 글이 보이는가 */
export const ITEMS_PER_PAGE = 10;
/* 첫 번째 페이지 */
export const FIRST_PAGE = 1;
```

그리고 해당 변수를 쓰는 모든 곳의 import 경로를 수정했다. 가령 다음과 같이 말이다.

```tsx
// src/app/(page)/posts/page.tsx
import { getSearchPosts, ITEMS_PER_PAGE } from '@/utils/post';
```

그러자 generateMetadata 관련 오류는 사라졌다. 비슷한 이유로 `FIRST_PAGE`같은 변수도 `src/utils/post.ts`에 배치시켰다. 원래는 `src/app/(page)/posts/all/page.tsx`같은 뜬금없는 곳에 있었다.

이런 작은 이유로 일어난 버그로 약 2일을 소모하고 나니 작은 변수 하나라도 구조에 맞게 잘 배치하는 것이 중요하다는 것을 다시 한번 느낄 수 있었다.

# 참고

Nextjs optimizing metadata 문서 https://nextjs.org/docs/app/building-your-application/optimizing/metadata
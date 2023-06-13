---
title: 블로그 최적화 - 4. 검색 페이지 무한 스크롤, 아이콘 소스 최적화
date: "2023-06-11T04:00:00Z"
description: "겁나 빠른 마녀 : 블로그 최적화 그 네번째"
tags: ["blog", "web"]
---

# 블로그 만들기 시리즈

|제목|링크|
|---|---|
|1. 기본 세팅|[https://witch.work/posts/dev/blog-remake-1](https://witch.work/posts/dev/blog-remake-1)|
|2. 메인 페이지의 HTML 설계|[https://witch.work/posts/dev/blog-remake-2](https://witch.work/posts/dev/blog-remake-2)|
|3. 글 상세 페이지의 구조 설계|[https://witch.work/posts/dev/blog-remake-3](https://witch.work/posts/dev/blog-remake-3)|
|4. 이미지를 상대 경로로 쓸 수 있도록 하기|[https://witch.work/posts/dev/blog-remake-1](https://witch.work/posts/dev/blog-remake-1)|
|5. 자잘한 페이지 구성 개선과 배포|[https://witch.work/posts/dev/blog-remake-5](https://witch.work/posts/dev/blog-remake-5)|
|6. 페이지 요소의 배치 설계|[https://witch.work/posts/dev/blog-remake-6](https://witch.work/posts/dev/blog-remake-6)|
|7. 메인 페이지 컴포넌트 디자인|[https://witch.work/posts/dev/blog-remake-7](https://witch.work/posts/dev/blog-remake-7)|
|8. 글 목록/내용 페이지 컴포넌트 디자인|[https://witch.work/posts/dev/blog-remake-8](https://witch.work/posts/dev/blog-remake-8)|
|9. 글 썸네일 자동 생성하기|[https://witch.work/posts/dev/blog-remake-9](https://witch.work/posts/dev/blog-remake-9)|
|10. 폰트, 카드 디자인 등의 디자인 개선|[https://witch.work/posts/dev/blog-remake-10](https://witch.work/posts/dev/blog-remake-10)|
|11. 글에 조회수 달기|[https://witch.work/posts/dev/blog-remake-11](https://witch.work/posts/dev/blog-remake-11)|
|12. 페이지 테마와 글 검색 기능|[https://witch.work/posts/dev/blog-remake-12](https://witch.work/posts/dev/blog-remake-12)|
|13. 테마 아이콘과 썸네일 레이아웃 개선 등|[https://witch.work/posts/dev/blog-remake-13](https://witch.work/posts/dev/blog-remake-13)|
|메인 페이지의 연산 최적화|[https://witch.work/posts/dev/blog-opt-1](https://witch.work/posts/dev/blog-opt-1)|
|글 목록 페이지네이션 만들기|[https://witch.work/posts/dev/blog-opt-2](https://witch.work/posts/dev/blog-opt-2)|
|이미지를 CDN에 올리고 placeholder 만들기|[https://witch.work/posts/dev/blog-opt-3](https://witch.work/posts/dev/blog-opt-3)|
|검색 페이지에 무한 스크롤 구현하기|[https://witch.work/posts/dev/blog-opt-4](https://witch.work/posts/dev/blog-opt-4)|

# 1. 검색 페이지 최적화

검색 페이지는 현재 너무 많은 DOM 트리 요소를 가지고 있다. 따라서 무한 스크롤을 이용해서 초기 로딩되는 요소를 줄여보자.

그럼 무한 스크롤을 어떻게 구현해야 할까? 다음과 같은 방식을 생각할 수 있다. 만약 보여줄 글이 100개가 있다면, 처음에는 10개만 보여주고 스크롤이 일정 부분 이상 내려가게 되면 글을 10개 더 보여준다.

또 스크롤이 더 내려가면 10개를 더 보여주고 하는 식으로 100개가 될 때까지 스크롤이 내려간 정도에 따라서 글들을 점진적으로 로딩하는 것이다.

스크롤 감지를 위해서는 Intersection Observer API를 사용하면 된다. 빈 요소를 하나 맨 아래에 만든 다음 해당 요소가 뷰포트에서 관측될 때 글을 로딩하는 것이다.

## 1.1. 커스텀 훅 useIntersectionObserver

React 컴포넌트의 ref와 Intersection Observer options를 받아서 해당 ref와 뷰포트가 교차되는지 관찰하는 커스텀 훅을 `src/utils`에 작성하자.

요소가 변할 때마다 Intersection Observer를 새로 만들어서 관찰하고, 해당 요소가 사라질 때는 관찰을 멈추는, 그리고 그 결과를 반환하는 훅이다.

```ts
// src/utils/useIntersectionObserver.ts
import { RefObject, useState, useEffect, useRef } from 'react';

function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
  options: IntersectionObserverInit={}
) {
  const [element, setElement] = useState<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer= useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setElement(elementRef.current);
  }, [elementRef]);

  useEffect(() => {
    if (!element) {return;}
    observer.current?.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {...options});
    observer.current?.observe(element);

    return () => {
      observer.current?.disconnect();
    };
  }, [element, options]);

  return isIntersecting;
}

export {useIntersectionObserver};
```

## 1.2. 무한 스크롤 구현

이번에는 리액트 컴포넌트의 ref와 콜백 함수를 받아서, ref가 뷰포트에 들어오는 순간 콜백을 실행하도록 하는 훅을 만들자.

threshold는 intersection observer API의 옵션으로 ref와 뷰포트(사실 어디와의 교차를 감지할 것인지는 API에서 설정할 수 있는 값이지만, 기본값이 뷰포트이기 때문에 여기서는 따로 설정해 주지 않았다)가 얼마나 겹칠 때 교차되었다고 판단할 것인지를 결정하는 값이다.

여기선 `0.0`으로 설정했는데, 이는 ref가 뷰포트에 단 1px라도 감지되는 순간 교차 판정을 내리도록 한다는 것이다.

```ts
// src/utils/useInfiniteScroll.ts
import { MutableRefObject, useEffect } from 'react';

import { useIntersectionObserver } from '@/utils/useIntersectionObserver';

function useInfiniteScroll (
  ref: MutableRefObject<Element | null>,
  callback: () => void
) {
  /* 뷰포트와 ref의 intersection observe */
  const shouldLoadMore = useIntersectionObserver(ref, { threshold: 0.0 });

  useEffect(() => {
    if (shouldLoadMore) {
      callback();
    }
  }, [shouldLoadMore, callback]);
};

export { useInfiniteScroll };
```

## 1.3. 적용

그리고 이를 적용하자. `src/pages/posts/index.tsx`에서 `useInfiniteScroll` 훅을 이용해서 무한 스크롤을 구현하면 된다.

맨 밑에 빈 div를 만들고, 뷰포트에 해당 요소가 들어오면 보여지는 페이지를 늘려 주는 동작을 한다.

```tsx
// src/pages/posts/index.tsx
function PostSearchPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchKeyword, debouncedKeyword, setSearchKeyword]=useSearchKeyword();
  const [filteredPostList, setFilteredPostList]=useState<CardProps[]>(postList);
  const [page, setPage]=useState<number>(1);

  const infiniteScrollRef=useRef<HTMLDivElement>(null);
  const totalPage=Math.ceil(filteredPostList.length/ITEMS_PER_PAGE);

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, [setSearchKeyword]);

  useEffect(() => {
    setFilteredPostList(filterPostsByKeyword(postList, debouncedKeyword));
  }, [debouncedKeyword]);

  /* 이번 수정의 핵심 로직이다. 스크롤이 infiniteScrollRef 컴포넌트와 교차시
  보여주는 글의 인덱스를 늘려주는 콜백 실행 */
  useInfiniteScroll(infiniteScrollRef, useCallback(()=>{
    if (page<totalPage) {
      setPage(prev=>prev+1);
    }
  }, [page, totalPage]));

  return (
    <PageContainer>
      <h2 className={styles.title}>{`${category} 검색`}</h2>
      <SearchConsole 
        value={searchKeyword}
        onChange={onKeywordChange}
      />
      <ul className={styles.list}>
        {filteredPostList.slice(0, ITEMS_PER_PAGE * page).map((post: CardProps) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
      <div ref={infiniteScrollRef} />
    </PageContainer>
  );
}
```

## 1.4. 뒤로가기 문제 해결

검색 페이지에 진입한 뒤에 뒤로가기를 누르거나, 검색 페이지에서 아무것도 입력하지 않은 상태에서 카드 링크를 통해 글로 이동한 후 뒤로가기를 누르면 이전 페이지로 바로 이동하지 않는 문제가 있었다.

`useSearchKeyword` 함수에서 발생한 문제였는데 `debouncedKeyword`를 `parsed.search` 즉 쿼리스트링에 있는 현재 검색어와 비교해서 새로운 페이지를 히스토리에 추가하는 로직이 있었다.

그런데 검색어가 아무것도 없는 상태에서는 `parsed.search`가 없기에 `debouncedKeyword===parsed.search` 비교문을 넘어가고 히스토리에 해당 페이지가 추가된다. 따라서 검색어가 없는 상태에서 뒤로가기를 누르면 이전 페이지로 바로 이동하지 않는 것이다.

따라서 `parsed.search`가 없을 경우 빈 문자열과 비교하도록 하는 로직으로 수정했다. 이렇게 하면 검색어가 없는 상태에서 뒤로가기를 눌렀을 때 이전 페이지로 바로 이동한다.

```ts
// src/utils/useSearchKeyword.ts
function useSearchKeyword(): [string, string, (s: string) => void] {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  /* onPopState 함수 생략 */
  /* popstate 관련 useEffect 생략 */

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    /* 이 부분에서 parsed.search가 없을 경우 빈 문자열과 비교하는 것을 추가했다. */
    if (debouncedKeyword===(parsed.search ?? '')) return;

    parsed.search = debouncedKeyword;

    const nextURL=queryString.stringifyUrl({
      url: location.pathname,
      query: parsed,
    }, {
      skipEmptyString: true,
      skipNull: true,
    });

    history.pushState(parsed, '', nextURL);
  }, [debouncedKeyword]);

  return [keyword, debouncedKeyword, setKeyword];
}
```

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

intersection observer API https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API

https://www.bucketplace.com/post/2020-09-10-%EC%98%A4%EB%8A%98%EC%9D%98%EC%A7%91-%EB%82%B4-%EB%AC%B4%ED%95%9C%EC%8A%A4%ED%81%AC%EB%A1%A4-%EA%B0%9C%EB%B0%9C%EA%B8%B0/
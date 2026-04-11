---
title: Blog Optimization - 4. Infinite Scroll on Search Page, Icon Source Optimization
date: "2023-06-11T04:00:00Z"
description: "Incredibly Fast Witch: The Fourth Part of Blog Optimization"
tags: ["blog", "web"]
---

# Blog Creation Series

|Title|Link|
|---|---|
|1. Basic Settings|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Design of Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structure Design of Post Detail Page|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Enabling Relative Path for Images|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Minor Page Composition Improvements and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Design of Page Element Layout|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Main Page Component Design|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Design of Post List/Content Page Components|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatic Generation of Post Thumbnails|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements in Fonts, Card Designs, etc.|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Adding View Counts to Posts|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Theme and Post Search Functionality|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Improvements in Theme Icons and Thumbnail Layouts, etc.|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Changing Post Classification to Tag-Based|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Main Page Calculation Optimization|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Creating Pagination for Post List|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Uploading Images to CDN and Creating Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implementing Infinite Scroll on Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

# 1. Search Page Optimization

The search page currently has too many DOM tree elements. Therefore, let’s reduce the initial loading elements using infinite scrolling.

How can we implement infinite scrolling? We can consider the following method. If there are 100 posts to display, initially show only 10, and when the scroll reaches a certain threshold, show 10 more posts.

As the scroll continues, show an additional 10 until it reaches a total of 100 posts, loading them progressively based on the scroll depth.

To detect the scroll, we can use the Intersection Observer API. Create an empty element at the bottom and load posts when that element is observed in the viewport.

## 1.1. Custom Hook useIntersectionObserver

Let's create a custom hook in `src/utils` that takes the ref of the React component and Intersection Observer options to observe whether the ref intersects with the viewport.

This hook creates a new Intersection Observer to observe each time the element changes and stops observing when the element disappears, returning the result.

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

## 1.2. Implementing Infinite Scroll

Next, let's create a hook that takes the ref of the React component and a callback function to execute when the ref enters the viewport.

The threshold is an option of the Intersection Observer API, determining when the intersection between the ref and the viewport is considered valid based on how much they overlap.

Here it is set to `0.0`, meaning it will trigger the intersection judgment as soon as the ref is detected in the viewport by even 1px.

```ts
// src/utils/useInfiniteScroll.ts
import { MutableRefObject, useEffect } from 'react';

import { useIntersectionObserver } from '@/utils/useIntersectionObserver';

function useInfiniteScroll (
  ref: MutableRefObject<Element | null>,
  callback: () => void
) {
  /* Observing the intersection between the viewport and the ref */
  const shouldLoadMore = useIntersectionObserver(ref, { threshold: 0.0 });

  useEffect(() => {
    if (shouldLoadMore) {
      callback();
    }
  }, [shouldLoadMore, callback]);
};

export { useInfiniteScroll };
```

## 1.3. Application

Now, let's apply this. We can implement infinite scroll using the `useInfiniteScroll` hook in `src/pages/posts/index.tsx`.

Create an empty div at the bottom, and increase the number of displayed posts when this element enters the viewport.

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

  /* The core logic of this modification. When scrolling intersects with
  the infiniteScrollRef component, we execute the callback to increase
  the index of displayed posts */
  useInfiniteScroll(infiniteScrollRef, useCallback(()=>{
    if (page<totalPage) {
      setPage(prev=>prev+1);
    }
  }, [page, totalPage]));

  return (
    <PageContainer>
      <h2 className={styles.title}>{`${category} Search`}</h2>
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

## 1.4. Resolving Back Navigation Issue

There was an issue when entering the search page and pressing the back button or moving to a post through a card link without inputting anything in the search page; pressing back would not return to the previous page.

This was caused by the `useSearchKeyword` function, which had logic that compared `debouncedKeyword` to `parsed.search`, the current search word in the query string, adding a new page to the history.

However, when the search keyword is empty, `parsed.search` is not present, thus bypassing the comparison `debouncedKeyword===parsed.search` and adding the page to history. Consequently, when pressing back in an empty search state, it would not return to the previous page.

Thus, this was revised to compare against an empty string when `parsed.search` is not present. This ensures that when pressing back with no search keyword, it returns directly to the previous page.

```ts
// src/utils/useSearchKeyword.ts
function useSearchKeyword(): [string, string, (s: string) => void] {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  /* onPopState function omitted */
  /* useEffect regarding popstate omitted */

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    /* This is where we added the comparison with an empty string when parsed.search is absent. */
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

# 2. Changing Icon Sources to Base64

It seems that the loading of icons in the header and the transitions based on modes are slow. Therefore, let's switch to using base64 encoding.

Create a file named `src/utils/iconsURL.ts` to define the base64 encoded strings for the icons we were using.

```ts
const searchIcon='data:image/png;base64, ...';
const searchIconDark='data:image/png;base64, ...';
const searchIconPink='data:image/png;base64, ...';

const hamburgerIcon='data:image/png;base64, ...';
const hamburgerIconDark='data:image/png;base64, ...';
const hamburgerIconPink='data:image/png;base64, ...';

const cancelIcon='data:image/png;base64, ...';
const cancelIconPink='data:image/png;base64, ...';

const linkIcon='data:image/png;base64, ...';
const linkIconDark='data:image/png;base64, ...';
const linkIconPink='data:image/png;base64, ...';

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

Then, import and use these variables in the object that determines the src of the icons. This means that while we will not be able to cache these images in the browser, we can serve them at a very fast speed.

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

The search icon should also have its src changed to base64 strings in the same manner.

```tsx
// src/components/header/search/index.tsx
import { searchIcon, searchIconDark, searchIconPink } from '@/utils/iconsURL';

const searchIconMap: {[key: string]: string}={
  'light':searchIcon,
  'dark':searchIconDark,
  'pink':searchIconPink,
};
```

# References

Intersection Observer API: https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API

https://www.bucketplace.com/post/2020-09-10-%EC%98%A4%EB%8A%98%EC%9D%98%EC%A7%91-%EB%82%B4-%EB%AC%B4%ED%95%9C%EC%8A%A4%ED%81%AC%EB%A1%A4-%EA%B0%9C%EB%B0%9C%EA%B8%B0/
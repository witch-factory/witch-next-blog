---
title: 블로그 한땀한땀 만들기 - 13. 기타 페이지 최적화
date: "2023-06-08T00:00:00Z"
description: "블로그가 너무 느리다. 페이지 최적화를 하자."
tags: ["blog", "web"]
---

# 1. 글 목록 - 이미지 최적화

글 목록 페이지와 글 상세 페이지를 약간 최적화한다. 가장 글이 많은 개발 카테고리의 글 목록 페이지를 lighthouse로 조회해 보자.

![category-page-lighthouse](./category-page-lighthouse.png)

처참하다. 그럼 lighthouse의 제안과 진단을 볼까?

![category-page-diagnostics](./category-page-diagnostics.png)

아까처럼 이미지에 적당한 크기를 주라고 한다. Card 컴포넌트에서 Image 태그에 sizes를 지정하자.

```jsx
function Card(props: Props) {
/* 생략 */
  <Image 
    className={styles.image} 
    src={image} 
    alt={`${image} 사진`} 
    width={200} 
    height={200}
    sizes='200px'
  />
/* 생략 */
}
```

# 2. 글 목록 - 페이지네이션

그리고 DOM 사이즈를 줄이라는 조언이 있었다. DOM에 1620개나 되는 요소들이 있다고 한다. 자식이 110개나 있는 요소도 있고. 이런 식으로 DOM 크기가 너무 크고 child 노드도 많으면 메모리 사용량이 늘고 스타일 계신이 너무 길어지며 레이아웃 리플로우(문서 내 요소의 위치를 계산되는 프로세스)도 오래 걸리게 된다. 

안 그래도 글 목록 페이지의 길어진 스크롤이 불편하던 참이었다. Vercel 템플릿에서 [SSG 페이지네이션](https://vercel.com/templates/next.js/pagination-with-ssg)코드가 공개되어 있길래 이를 사용해 보았다.

먼저 동적 라우트를 사용해야 하기 때문에 동적 라우트 폴더를 새로 만들자. `pages/posts/[category]` 내에 동적 라우트가 있어야 하는데 여기에는 이미 `[category]/[slug]` 라는 동적 라우트가 있다. 따라서 `pages/posts/[category]/page/[page]/index.tsx`로 동적 라우트를 새로 만들었다. 

이렇게 하면 `/posts/category/page/2(페이지번호)` 이런 식으로 페이지네이션을 할 수 있다. [동적 라우트를 2개 쓰는 것도 가능은 하지만 좋은 패턴이 아니라고 한다.](https://stackoverflow.com/questions/59790906/nextjs-how-to-handle-multiple-dynamic-routes-at-the-root)


## 2.1. CategoryPagenation 컴포넌트

기존에 쓰던 카테고리 페이지의 컨텐츠 부분을 따와서 `CategoryPagenation` 컴포넌트를 만들었다. 일단 지금 당장 필요한 정보만 props로 받아 오도록 했고 단순히 이를 보여주는 기능만 일단 구현했다.

```tsx
// src/components/categoryPagenation/index.tsx
import Card from '../card';

import styles from './styles.module.css';

export interface PostMetaData{
  title: string;
  description: string;
  image?: string;
  date: string;
  tags: string[];
  url: string;
}

interface Props{
  category: string;
  currentPage: number;
  postList: PostMetaData[];
}

function CategoryPagenation(props: Props) {
  const {category, currentPage, postList}=props;
  return (
    <>
      <h1 className={styles.title}>
        {`${category} 주제의 글 ${currentPage} 페이지`}
      </h1>
      <ul className={styles.list}>
        {postList.map((post: PostMetaData) =>{
          return (
            <li key={post.url}>
              <Card {...post} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default CategoryPagenation;
```

그러면 `src/pages/posts/[category]/index.tsx` 페이지의 컴포넌트 구조는 `CategoryPagenation`를 사용하여 다음과 같이 바뀐다. 

```tsx
// src/pages/posts/[category]/index.tsx
function PostListPage({
  category, categoryURL, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEOInfo 객체 정보 생략 */
  return (
    <>
      <NextSeo {...SEOInfo} />
      <PageContainer>
        <CategoryPagenation 
          category={category}
          currentPage={1}
          postList={postList}
        />
      </PageContainer>
    </>
  );
}
```

이걸 써서 각 페이지별로 특정 개수의 글들만 목록에 보이도록 해야 한다.

## 2.2. 페이지네이션 개별 페이지

`src/pages/posts/[category]/page/[page]/index.tsx`를 작성하여 개별 페이지의 내용을 구현하자.

개별 페이지를 구현하기 위해선 뭐가 필요할까? 일단 해당 페이지의 글을 가져와야 한다. 이는 이전에 글을 가져오는 데에 쓰던 `getSortedPosts`함수를 쓸 수도 있다. 

하지만 여기서는 우리가 지금 해야 하는 작업 즉 특정 카테고리의 특정 페이지의 글을 가져오는 로직을 새로운 함수로 만들자. `src/utils/post.ts`에 `getCategoryPosts` 함수를 만들었다.

category와 현재 페이지 그리고 페이지당 몇 개의 글이 들어가는지를 인수로 받는 함수이다. 그러면 함수 내에선 `getSortedPosts`의 결과에서 먼저 인수로 받은 category에 해당하는 글만 뽑아낸다. 그다음은 `currentPage`와 `postsPerPage`를 이용해서 현재 페이지에 해당하는 글 목록만 슬라이싱해서 배열로 가져온다.

이때 pagePosts뿐 아니라 totalPostNumber 즉 해당 카테고리에 속한 글의 개수도 리턴하는 것을 볼 수 있다. 이는 이후 페이지네이션 컴포넌트(페이지를 이동하는 데 쓰이는 컴포넌트)를 구현하는 데에 쓰일 것이다.

```ts
interface PageInfo{
  category: string;
  currentPage: number;
  postsPerPage: number;
}

export const getCategoryPosts = (info: PageInfo) => {
  const { category, currentPage, postsPerPage } = info;
  const allDocumentsInCategory = getSortedPosts().filter((post: DocumentTypes)=>
    post._raw.flattenedPath.startsWith(category));

  const pagenatedPosts= allDocumentsInCategory.slice(
    (currentPage-1)*postsPerPage, 
    currentPage*postsPerPage
  );

  return {pagePosts:pagenatedPosts, totalPostNumber: allDocumentsInCategory.length};
};
```

그럼 이제 개별 페이지에서는 이 함수를 사용해서 맞는 카테고리의 해당 페이지에 필요한 글을 가져온 후 보여주기만 하면 된다.

페이지당 몇 개의 글 Card를 보여줄지를 정하는 변수를 정의하자.

```tsx
// src/pages/posts/[category]/page/[page]/index.tsx
/* 페이지당 몇 개의 글이 보이는가 */
export const ITEMS_PER_PAGE=10;
```

`getStaticPaths`를 작성해보자. 여기서는 각 카테고리별로 필요한 페이지들의 경로를 생성해서 `paths`로 리턴해 주면 된다. 다음과 같이 작성한다.

```tsx
export const getStaticPaths: GetStaticPaths = async () => {
  const paths=[];
  for (const category of blogCategoryList) {
    const categoryURL=category.url.split('/').pop();
    for (let i=1;i<=5;i++) {
      paths.push(`/posts/${categoryURL}/page/${i}`);
    }
  }
  return {
    paths,
    // Block the request for non-generated pages and cache them in the background
    fallback: 'blocking',
  };
};
```

`blogCategoryList`에 있는 모든 카테고리들에 대해서 `/posts/[카테고리]/page/[페이지번호]`에 해당하는 URL 경로를 생성해주고 있다. 그런데 코드를 보면 페이지 번호를 1부터 5까지만 생성한다. 만약 글이 50개(정확히는 `5*ITEMS_PER_PAGE`개)를 넘어가면 다음 페이지는 어떻게 들어갈까?

이를 위해서 `getStaticPaths`리턴 객체의 fallback을 `blocking`으로 설정했다. 이렇게 하면 [Incremental Static Regeneration](
https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)으로 페이지가 렌더링된다. 

이 ISR 로직은 다음과 같다. `getStaticPaths`에서 생성되지 않은 페이지가 처음으로 요청되면 일단 서버사이드 렌더링을 한 후 이를 캐싱하고 백그라운드에서 새로운 페이지를 생성한다. 그리고 해당 페이지에 대한 다음 요청부터는 정적 페이지로 제공한다. 따라서 사이트를 빌드한 후에도 정적 페이지가 새로 생성되도록 할 수 있게 된다. 

5페이지를 넘어가면 아무래도 사용자가 해당 페이지를 요청할 확률이 적어지므로 적절한 조치라고 할 수 있겠다.





# 참고

https://uxplanet.org/ux-infinite-scrolling-vs-pagination-1030d29376f1

https://developers.google.com/speed/docs/insights/browser-reflow?utm_source=lighthouse&utm_medium=lr&hl=ko

https://vercel.com/templates/next.js/pagination-with-ssg

https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking

Incremental Static Regeneration
https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration
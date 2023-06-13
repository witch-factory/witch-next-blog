---
title: 블로그 최적화 - 2. 글 목록 페이지 최적화
date: "2023-06-11T00:00:00Z"
description: "겁나 빠른 마녀 : 블로그 최적화 그 두번째"
tags: ["blog", "web"]
---

# 블로그 만들기 시리즈

- [1. 기본 세팅](https://witch.work/posts/dev/blog-remake-1)
- [2. 메인 페이지의 HTML 설계](https://witch.work/posts/dev/blog-remake-2)
- [3. 글 상세 페이지의 구조 설계](https://witch.work/posts/dev/blog-remake-3)
- [4. 이미지를 상대 경로로 쓸 수 있도록 하기](https://witch.work/posts/dev/blog-remake-1)
- [5. 자잘한 페이지 구성 개선과 배포](https://witch.work/posts/dev/blog-remake-5)
- [6. 페이지 요소의 배치 설계](https://witch.work/posts/dev/blog-remake-6)
- [7. 메인 페이지 컴포넌트 디자인](https://witch.work/posts/dev/blog-remake-7)
- [8. 글 목록/내용 페이지 컴포넌트 디자인](https://witch.work/posts/dev/blog-remake-8)
- [9. 글 썸네일 자동 생성하기](https://witch.work/posts/dev/blog-remake-9)
- [10. 폰트, 카드 디자인 등의 디자인 개선](https://witch.work/posts/dev/blog-remake-10)
- [11. 글에 조회수 달기](https://witch.work/posts/dev/blog-remake-11)
- [12. 페이지 테마와 글 검색 기능](https://witch.work/posts/dev/blog-remake-12)
- [13. 테마 아이콘과 썸네일 레이아웃 개선 등](https://witch.work/posts/dev/blog-remake-13)

- [메인 페이지의 연산 최적화](https://witch.work/posts/dev/blog-opt-1)
- [글 목록 페이지네이션 만들기](https://witch.work/posts/dev/blog-opt-2)
- [이미지를 CDN에 올리고 placeholder 만들기](https://witch.work/posts/dev/blog-opt-3)
- [검색 페이지에 무한 스크롤 구현하기](https://witch.work/posts/dev/blog-opt-4)

# 1. 페이지네이션으로 DOM 트리 줄이기

가장 글이 많은 개발 카테고리의 글 목록 페이지를 lighthouse로 조회해 보자.

![category-page-lighthouse](./category-page-lighthouse.png)

처참하다. lighthouse의 조언들을 되는대로 적용해 보자.

글 목록 페이지에는 DOM 사이즈를 줄이라는 조언이 있었다. DOM에 1620개나 되는 요소들이 있다고 한다. 자식이 110개나 있는 요소도 있고. 이런 식으로 DOM 크기가 너무 크고 child 노드도 많으면 메모리 사용량이 늘고 스타일 계신이 너무 길어지며 레이아웃 리플로우(문서 내 요소의 위치를 계산되는 프로세스)도 오래 걸리게 된다. 

안 그래도 글 목록 페이지의 길어진 스크롤이 불편하던 참이었다. Vercel 템플릿에서 [SSG 페이지네이션](https://vercel.com/templates/next.js/pagination-with-ssg)코드가 공개되어 있길래 이를 사용해 보았다.

먼저 동적 라우트를 사용해야 하기 때문에 동적 라우트 폴더를 새로 만들자. `pages/posts/[category]` 내에 동적 라우트가 있어야 하는데 여기에는 이미 `[category]/[slug]` 라는 동적 라우트가 있다. 따라서 `pages/posts/[category]/page/[page]/index.tsx`로 동적 라우트를 새로 만들었다. 

이렇게 하면 `/posts/category/page/2(페이지번호)` 이런 식으로 페이지네이션을 할 수 있다. [동적 라우트를 2개 쓰는 것도 가능은 하지만 좋은 패턴이 아니라고 한다.](https://stackoverflow.com/questions/59790906/nextjs-how-to-handle-multiple-dynamic-routes-at-the-root)


# 2. Vercel Pagination Template 분석

Vercel template에서 어떻게 페이지네이션을 구현했는지 분석하였다. 실제 템플릿은 [pagination-with-ssg template](https://vercel.com/templates/next.js/pagination-with-ssg)에서 확인할 수 있다.

이 템플릿은 페이지별로 상품의 목록을 보여주는 페이지네이션을 구현한 것이다. 이 템플릿의 핵심 로직을 나름대로 분석하면 다음과 같다.

![vercel-pagination-template](./vercel-pagination-template.png)

이를 내 블로그의 현재 구조에 맞게 적절히 변경하여 구성해 보자.

`PaginationPage`컴포넌트

# 3. CategoryPagination 컴포넌트

기존에 쓰던 카테고리 페이지의 컨텐츠 부분을 따와서 `CategoryPagination` 컴포넌트를 만들었다. 템플릿의 PaginationPage 컴포넌트의 props에 현재 카테고리까지 props로 받아 오도록 했고 단순히 이를 보여주는 기능만 일단 구현했다.

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
  totalItemNumber: number;
  category: string;
  currentPage: number;
  postList: PostMetaData[];
  perPage: number;
}

function CategoryPagination(props: Props) {
  const {category, currentPage, postList}=props;
  return (
    <>
      <h1 className={styles.title}>
        {`${category} 주제 ${currentPage} 페이지`}
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
/* 페이지당 몇 개의 글이 보이는가 */
export const ITEMS_PER_PAGE=10;

function PostListPage({
  category, categoryURL, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEOInfo 객체 정보 생략 */
  return (
    <>
      <NextSeo {...SEOInfo} />
      <PageContainer>
        <CategoryPagination 
          category={category}
          currentPage={1}
          postList={postList}
          totalItemNumber={postList.length}
          perPage={ITEMS_PER_PAGE}
        />
      </PageContainer>
    </>
  );
}
```

postList는 `getStaticProps`에서 잘 계산하여 props로 넘겨주어, 각 페이지별로 특정 개수의 글들만 목록에 보이도록 해야 한다.

다만 그전에 먼저 필요한 컴포넌트들을 모두 구현하자.

# 4. 페이지네이션 컴포넌트

페이지네이션 컴포넌트란 다음과 같이 현재 페이지 위치와 링크를 통한 페이지 이동을 하게 해주는 컴포넌트다.

![pagination-example](./pagination-example.png)

이 컴포넌트를 만들기 위해 `src/components/categoryPagination/pagination/index.tsx`를 만들고 작성하자.

inc부터 length 길이의 배열을 만들어서 리턴하는 `getPages` 함수를 정의한다.

```tsx
// inc부터 시작해서 length만큼의 숫자 배열을 반환하는 함수
function getPages(length: number, inc: number = 1) {
  return Array.from({ length }, (_, i) => i + inc);
}
```

페이지네이션에 표시할 숫자와 문자열들의 배열을 리턴하는 `getPaginationArray`함수도 정의한다. currentPage의 값에 따라서 전체 페이지 중 적절한 페이지 번호들을 담은 배열을 리턴한다. 이때 중간에 `dotts` 변수를 이용해서 생략 표시도 넣는다.

```tsx
function getPaginationArray(
  totalItemNumber: number,
  currentPage: number,
  perPage: number
) {
  /* JS의 정수 나눗셈은 소숫점을 버리지 않음에 주의 */
  const totalPages=parseInt((totalItemNumber/perPage).toString()) + (totalItemNumber%perPage?1:0);
  if (totalPages<=7) {
    return getPages(totalPages);
  }
  if (currentPage<=4) {
    return [1, 2, 3, 4, 5, dotts, totalPages-1 ,totalPages];
  }
  if (currentPage>=totalPages-3) {
    return [1, dotts, ...getPages(6, totalPages - 5)];
  }

  return [1, 
    dotts,
    ...getPages(5, currentPage - 2),
    dotts, 
    totalPages
  ];
}
```

이를 이용해서 페이지네이션을 보여주는 컴포넌트도 만든다. 페이지 번호의 경우 링크를 걸고, 현재 페이지와 같은 번호라면 강조 표시를 해준다.

```tsx
// src/components/categoryPagination/pagination/index.tsx
function Pagination({
  totalItemNumber,
  currentPage,
  renderPageLink,
  perPage = 10,
}: PaginationProps) {
  const pageArray=getPaginationArray(totalItemNumber, currentPage, perPage);
  return (
    <div>
      {pageArray.map((pageNumber, i) =>
        pageNumber === dotts ? (
          <span key={i}>
            {pageNumber}
          </span>
        ) : (
          <Link
            key={i}
            href={renderPageLink(pageNumber as number)}
          >
            {pageNumber}
          </Link>
        )
      )}
    </div>
  );
}
```

그럼 간단하게 스타일링도 해볼까. `src/components/categoryPagination/pagination/styles.module.css`를 만들고 다음과 같이 작성한다.

```css
// src/components/categoryPagination/pagination/styles.module.css
.container{
  margin:1.5rem auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.item{
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

.item:hover{
  background: var(--gray3);
}

.selected{
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 600;
  background: var(--indigo1);
  color: var(--indigo8);
}

.selected:hover{
  background: var(--indigo5);
  color: var(--white);
}
```

그리고 className을 Pagination 컴포넌트 내에 부여한다.

```tsx
// src/components/categoryPagination/pagination/index.tsx
function Pagination({
  totalItemNumber,
  currentPage,
  renderPageLink,
  perPage = 10,
}: PaginationProps) {
  const pageArray=getPaginationArray(totalItemNumber, currentPage, perPage);
  return (
    <div className={styles.container}>
      {pageArray.map((pageNumber, i) =>
        pageNumber === dotts ? (
          <span key={i} className={styles.item}>
            {pageNumber}
          </span>
        ) : (
          <Link
            key={i}
            href={renderPageLink(pageNumber as number)}
            className={currentPage === pageNumber ? styles.selected : styles.item}
          >
            {pageNumber}
          </Link>
        )
      )}
    </div>
  );
}
```

그러면 이 페이지네이션을 어디에 배치해야 할까?

페이지네이션에 대응하는 다른 컨텐츠 전략인 무한 스크롤에 비해서 나는 페이지네이션을 택했다. 그리고 이것의 가장 큰 의미는 사용자에게 자신이 페이지를 제어하고 있다는 감각을 주는 것이라고 생각한다.

무한 스크롤에 비해서 마지막 페이지가 어딘지도 알 수 있고, 그 페이지에 비해 자신이 어느 지점에 있는 글을 보고 있는지도 짐작할 수 있기 때문이다.

이러한 감각을 극대화하기 위해서는 페이지네이션이 게시판의 맨 위에 배치되어 있는 게 가장 적절하다고 생각된다.

그래서 `CategoryPagination` 컴포넌트를 다음과 같이 수정하여 페이지네이션 컴포넌트가 카테고리 제목 바로 아래에 보이도록 했다. 사용자가 게시판에 들어오자마자 자신이 제어한다는 감각을 가질 수 있도록 하기 위해서이다.

```tsx
function CategoryPagination(props: Props) {
  const {totalItemNumber, category, currentPage, postList, perPage}=props;
  const categoryURL=blogCategoryList.find((c: {title: string, url: string})=>
    c.title===category)?.url.split('/').pop() as string;
  return (
    <>
      <h1 className={styles.title}>
        {`${category} 주제 ${currentPage} 페이지`}
      </h1>
      {/* 카테고리 제목 바로 아래에 페이지네이션 배치 */}
      <Pagination
        totalItemNumber={totalItemNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `/posts/${categoryURL}/page/${page}`}
        perPage={perPage}
      />
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
```

# 5. 개별 페이지 만들기

이제 `src/pages/posts/[category]/page/[page]/index.tsx`를 작성하여 개별 페이지의 내용을 구현하자.

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
// src/pages/posts/[category]/page/[page]/index.tsx
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

`getStaticProps`를 작성해보자. params로 받을 수 있는 정보는 category와 page인데 각 페이지에 몇 개의 글이 들어가는지는 이미 상수로 정의해 놓았으므로 이를 이용하면 페이지를 위한 정보를 모두 받아올 수 있다.

`getCategoryPosts`를 이용해서 페이지의 글을 모두 받아오고, map을 이용해서 PostMetaData의 image에 `post._raw.thumbnail`을 대응시킨다. 이렇게 만든 객체 배열을 리턴값으로 넘긴다.

이때 만약 페이지 정보에 해당하는 글이 없으면 404 페이지를 띄워줘야 하고 1페이지에 대한 요청은 `/posts/[category]`로 리다이렉트 시켜줘야 한다. 같은 내용에 대한 2가지 라우트를 막기 위함이다.

```tsx
export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const page: number = Number(params?.page) || 1;
  const {pagePosts, totalPostNumber} = await getCategoryPosts({
    category:params?.category as string, 
    currentPage:page,
    postsPerPage:ITEMS_PER_PAGE
  });

  const pagePostsWithThumbnail=pagePosts.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata={title, description, date, tags, url};
    return 'thumbnail' in post._raw ? 
      ({...metadata, image: post._raw.thumbnail} as PostMetaData) :
      metadata;
  });

  const {title:category, url:categoryURL}=blogCategoryList.find((c: {title: string, url: string})=>
    c.url.split('/').pop()===params?.category) as {title: string, url: string};

  if (!pagePostsWithThumbnail.length) {
    return {
      notFound: true,
    };
  }
  
  if (page===1) {
    return {
      redirect: {
        destination: `/posts/${params?.category}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      category,
      categoryURL,
      pagePosts:pagePostsWithThumbnail,
      totalPostNumber,
      currentPage:page,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};
```

이렇게 하니까 배포시 에러가 뜬다. 다 비슷한 에러인데 그중 하나를 가져오면 다음과 같다.

```
Error: `redirect` can not be returned from getStaticProps during prerendering (/posts/cs/page/1)
```

페이지가 프리렌더링될 때 redirect를 리턴할 수 없다는 에러다. 빌드 시에 페이지를 구성하면서 `getStaticProps`에서 리턴한 값이 페이지 컴포넌트의 props로 들어가는데 이때 redirect를 리턴하면 페이지 구성에 문제가 생기는 것 같다.

우리의 목적은 사실 1페이지에 대한 요청을 `/posts/[category]`로 리다이렉트 시키는 것이다. 이를 위해서는 그냥 `getStaticPaths`에서 1페이지에 대한 경로를 생성하지 않으면 된다.

`getStaticPaths`를 다음과 같이 수정하자.

```tsx
export const getStaticPaths: GetStaticPaths = async () => {
  const paths=[];
  for (const category of blogCategoryList) {
    const categoryURL=category.url;
    for (let i=0;i<5;i++) {
      paths.push(`${categoryURL}/page/${i+2}`);
    }
  }
  return {
    paths,
    // Block the request for non-generated pages and cache them in the background
    fallback: 'blocking',
  };
};
```

이제 빌드가 잘 되고 페이지 URL로 접근해 보면 페이지에도 잘 들어가진다. 이를 각 카테고리별 첫 페이지에도 적용한다. `src/pages/posts/[category]/index.tsx`를 편집.

```tsx
// src/pages/posts/[category]/index.tsx
/* import 문들 생략 */
function PostListPage({
  category,
  categoryURL,
  pagePosts,
  totalPostNumber,
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEO config 생략 */
  return (
    <>
      <NextSeo {...SEOInfo} />
      <PageContainer>
        <CategoryPagination 
          category={category}
          categoryURL={categoryURL}
          currentPage={currentPage}
          postList={pagePosts}
          totalItemNumber={totalPostNumber}
          perPage={ITEMS_PER_PAGE}
        />
      </PageContainer>
    </>
  );
}

export default PostListPage;

export const getStaticPaths: GetStaticPaths=()=>{
  const paths=blogCategoryList.map((category)=>{
    return {
      params: {
        category:category.url.split('/').pop(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

const FIRST_PAGE=1;

export const getStaticProps: GetStaticProps = async ({params}) => {
  const {pagePosts, totalPostNumber} = await getCategoryPosts({
    category:params?.category as string,
    currentPage:FIRST_PAGE,
    postsPerPage:ITEMS_PER_PAGE
  });

  const pagePostsWithThumbnail=pagePosts.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata={title, description, date, tags, url};
    return 'thumbnail' in post._raw ? 
      ({...metadata, image: post._raw.thumbnail} as PostMetaData) :
      metadata;
  });

  const {title:category, url:categoryURL}=blogCategoryList.find((c: {title: string, url: string})=>
    c.url.split('/').pop()===params?.category) as {title: string, url: string};

  return {
    props: {
      category,
      categoryURL,
      pagePosts:pagePostsWithThumbnail,
      totalPostNumber,
      currentPage:FIRST_PAGE,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};
```

이렇게 페이지네이션을 적용하자 글 목록 페이지 로딩이 꽤 빨라졌다.

![lighthouse-after-pagination](./lighthouse-after-pagination.png)

다음 글에서는 전반적인 이미지 최적화를 해보자.


# 참고

https://uxplanet.org/ux-infinite-scrolling-vs-pagination-1030d29376f1

브라우저 리플로우 최소화 https://developers.google.com/speed/docs/insights/browser-reflow?utm_source=lighthouse&utm_medium=lr&hl=ko

https://vercel.com/templates/next.js/pagination-with-ssg

https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking

Incremental Static Regeneration
https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration

tag manager 잘 쓰기 https://stackoverflow.com/questions/75521259/how-to-solve-reduce-the-impact-of-third-party-code-third-party-code-blocked-t

https://web.dev/tag-best-practices/

이미지 로딩이 느린 이슈 https://github.com/vercel/next.js/discussions/21294#discussioncomment-4479278

https://junheedot.tistory.com/entry/Next-Image-load-super-slow

https://nextjs.org/docs/messages/sharp-missing-in-production

vercel edge function https://vercel.com/docs/concepts/functions/edge-functions
---
title: Blog Optimization - 2. Optimizing the Post List Page
date: "2023-06-11T00:00:00Z"
description: "Incredibly Fast Witch: The Second Part of Blog Optimization"
tags: ["blog", "web"]
---

# Blog Creation Series

|Title|Link|
|---|---|
|1. Basic Settings|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Structure Design of the Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structure Design of the Post Detail Page|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Enable Usage of Relative Paths for Images|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Minor Page Structure Improvements and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Design for Page Element Layout|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Main Page Component Design|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Design of Post List/Content Page Components|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatically Generate Post Thumbnails|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements for Fonts and Cards|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Adding View Counts to Posts|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Theme and Post Search Function|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Improvements to Theme Icons and Thumbnail Layout|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Changing Post Classification to Tag-Based|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Main Page Computational Optimization|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Creating Post List Pagination|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Uploading Images to CDN and Creating Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implementing Infinite Scroll on the Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

# 1. Reducing DOM Tree Size with Pagination

Let's check the post list page of the development category with the most articles using Lighthouse.

![category-page-lighthouse](./category-page-lighthouse.png)

It is terrible. Let's apply the suggestions from Lighthouse as much as possible.

One of the suggestions for the post list page was to reduce the DOM size. It states that there are 1,620 elements within the DOM. Some elements even have up to 110 child nodes. When the DOM size is too large and has many child nodes, it increases memory usage and elongates the style recalculation process, which also makes layout reflow (the process of calculating the positions of elements in a document) take longer.

It had already been inconvenient due to the lengthy scrolling of the post list page. I found that the Vercel template has [SSG Pagination](https://vercel.com/templates/next.js/pagination-with-ssg) code available, so I decided to utilize it.

First, since we need dynamic routes, let's create a new dynamic route folder. The dynamic route must be under `pages/posts/[category]`, where a dynamic route already exists as `[category]/[slug]`. Therefore, I created a new dynamic route at `pages/posts/[category]/page/[page]/index.tsx`.

With this, pagination can be implemented like `/posts/category/page/2 (page number)`. [Using two dynamic routes is possible, but it's not considered a good pattern.](https://stackoverflow.com/questions/59790906/nextjs-how-to-handle-multiple-dynamic-routes-at-the-root)

# 2. Analyzing the Vercel Pagination Template

I analyzed how pagination was implemented in the Vercel template. The actual template can be found in the [pagination-with-ssg template](https://vercel.com/templates/next.js/pagination-with-ssg).

This template implements pagination that displays a list of products on each page. My analysis of the core logic of this template yields the following:

![vercel-pagination-template](./vercel-pagination-template.png)

Let's modify it appropriately to fit the current structure of my blog.

`PaginationPage` Component

# 3. CategoryPagination Component

I repurposed the content section of the previously used category page to create a `CategoryPagination` component. I had the props for the current category passed down from the `PaginationPage` component of the template and implemented simple functionality to display it.

```tsx
// src/components/categoryPagination/index.tsx
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
        {`${category} Topic Page ${currentPage}`}
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

export default CategoryPagination;
```

Now, the component structure of the `src/pages/posts/[category]/index.tsx` page will change to use `CategoryPagination` as follows:

```tsx
// src/pages/posts/[category]/index.tsx
/* Number of posts displayed per page */
export const ITEMS_PER_PAGE=10;

function PostListPage({
  category, categoryURL, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEOInfo object omitted */
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

The `postList` should be properly calculated and passed as props from `getStaticProps` to ensure that only a specific number of posts are displayed on each page.

However, let's implement all necessary components first.

# 4. Pagination Component

The pagination component is meant to indicate the current page location and facilitate page navigation through links.

![pagination-example](./pagination-example.png)

To build this component, let’s create a file at `src/components/categoryPagination/pagination/index.tsx`.

We will define a function `getPages` that returns an array of numbers starting from `inc` for the length specified.

```tsx
// Function to return an array of numbers starting from inc
function getPages(length: number, inc: number = 1) {
  return Array.from({ length }, (_, i) => i + inc);
}
```

We also need to define a function `getPaginationArray` that returns an array of numbers and strings that will be displayed in the pagination, based on the value of `currentPage`. It will also include a `dotts` variable for omitted numbers.

```tsx
function getPaginationArray(
  totalItemNumber: number,
  currentPage: number,
  perPage: number
) {
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

Using this, we create the pagination display component. The page numbers will be clickable links, and the current page number will be highlighted.

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

Next, let's add some basic styling. Create `src/components/categoryPagination/pagination/styles.module.css` and write the following styles.

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

Now let's assign the className in the Pagination component.

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

Where should this pagination be placed?

I chose pagination over an alternative content strategy like infinite scroll. The most significant reason is to give users a sense of control over the pages.

With pagination, users can assess where the last page is and understand which posts they are currently viewing.

To maximize this sensation, I think the pagination should be placed right at the top of the bulletin board.

Thus, I modified the `CategoryPagination` component to ensure the pagination component is displayed just below the category title. This way, users feel they have control as soon as they enter the bulletin board.

```tsx
function CategoryPagination(props: Props) {
  const {totalItemNumber, category, currentPage, postList, perPage}=props;
  const categoryURL=blogCategoryList.find((c: {title: string, url: string})=>
    c.title===category)?.url.split('/').pop() as string;
  return (
    <>
      <h1 className={styles.title}>
        {`${category} Topic Page ${currentPage}`}
      </h1>
      {/* Place pagination right below the category title */}
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

# 5. Creating Individual Pages

Now, let's implement the individual page by writing `src/pages/posts/[category]/page/[page]/index.tsx`.

What do we need to create the individual page? First, we need to fetch the articles for that page. We could use the `getSortedPosts` function we used previously to retrieve the articles.

However, let's create a new function for our current task, which is to fetch posts for a specific category on a specific page. We created the `getCategoryPosts` function in `src/utils/post.ts`.

This function accepts the category, the current page, and the number of posts per page as arguments. Within the function, we first filter the posts returned by `getSortedPosts` to get only those corresponding to the given category. We then slice the posts based on `currentPage` and `postsPerPage` to get the list of posts for the current page.

Notably, the function returns `pagePosts` along with `totalPostNumber`, which denotes the total number of posts in the specified category. This will be useful later in implementing the pagination component.

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

Now, the individual page will utilize this function to retrieve and display the needed posts for the specified category and page.

Let’s define a variable to determine how many post cards will be displayed per page.

```tsx
// src/pages/posts/[category]/page/[page]/index.tsx
/* Number of posts displayed per page */
export const ITEMS_PER_PAGE=10;
```

Next, let's write the `getStaticPaths` function. Here, we generate the necessary paths for each category and return them in the `paths` object.

```tsx
// src/pages/posts/[category]/page/[page]/index.tsx
export const getStaticPaths: GetStaticPaths = async () => {
  const paths=[];
  for (const category of blogCategoryList) {
    const categoryURL=category.url.split('/').pop();
    for (let i=1; i<=5; i++) {
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

This code generates URLs corresponding to `/posts/[category]/page/[page number]` for all categories in `blogCategoryList`. However, as written, the code only creates page numbers from 1 to 5. So how will we access pages beyond that if there are more than 50 posts (specifically, more than `5 * ITEMS_PER_PAGE`)?

To address this, we set the `fallback` of the returned object from `getStaticPaths` to `blocking`. This means that under [Incremental Static Regeneration](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration), if a page that has not been generated yet is requested, the server will render it for the first time, cache it, and then create a new page in the background. Subsequently, all requests for that page will provide the statically generated version. Therefore, we will enable new static pages to be created even after building the site.

Since the likelihood of a user requesting pages beyond five is low, this approach seems reasonable.

Now, let's write the `getStaticProps`. The information we can obtain from `params` here includes category and page, while the number of posts per page is already defined as a constant.

Using `getCategoryPosts`, we will retrieve the posts for the page and map the `PostMetaData.image` to `post._raw.thumbnail`. We will pass the object array created in this way as the return value.

If there are no posts matching the page info, we should display a 404 page, and if it is the first page, redirect to `/posts/[category]` to prevent multiple routes for the same content.

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

However, with this setup, I encountered errors during deployment. The errors were consistent and one example is as follows:

```
Error: `redirect` cannot be returned from getStaticProps during prerendering (/posts/cs/page/1)
```

This occurs because the `redirect` cannot be returned from `getStaticProps` when the page is being prerendered. During the build phase, the return value from `getStaticProps` is being used as props for the page component, and returning `redirect` creates issues in rendering the page.

Our actual goal is to redirect requests for the first page to `/posts/[category]`. To achieve this, we can simply avoid generating the path for the first page in `getStaticPaths`.

We will modify `getStaticPaths` as follows:

```tsx
export const getStaticPaths: GetStaticPaths = async () => {
  const paths=[];
  for (const category of blogCategoryList) {
    const categoryURL=category.url;
    for (let i=0; i<5; i++) {
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

Now, the build should proceed without errors and accessing the page URL should work as expected. We should also apply this to the first page of each category. Let's edit `src/pages/posts/[category]/index.tsx`.

```tsx
// src/pages/posts/[category]/index.tsx
/* import statements omitted */
function PostListPage({
  category,
  categoryURL,
  pagePosts,
  totalPostNumber,
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEO config omitted */
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

export const getStaticPaths: GetStaticPaths=()=> {
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

Now that pagination is implemented, the loading speed of the post list page has improved significantly.

![lighthouse-after-pagination](./lighthouse-after-pagination.png)

In the next article, I will focus on overall image optimization.

# References

https://uxplanet.org/ux-infinite-scrolling-vs-pagination-1030d29376f1

Minimizing browser reflow https://developers.google.com/speed/docs/insights/browser-reflow?utm_source=lighthouse&utm_medium=lr&hl=en

https://vercel.com/templates/next.js/pagination-with-ssg

https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking

Incremental Static Regeneration
https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration

Using tag manager effectively https://stackoverflow.com/questions/75521259/how-to-solve-reduce-the-impact-of-third-party-code-third-party-code-blocked-t

https://web.dev/tag-best-practices/

Issues with slow image loading https://github.com/vercel/next.js/discussions/21294#discussioncomment-4479278

https://junheedot.tistory.com/entry/Next-Image-load-super-slow

https://nextjs.org/docs/messages/sharp-missing-in-production

Vercel edge function https://vercel.com/docs/concepts/functions/edge-functions
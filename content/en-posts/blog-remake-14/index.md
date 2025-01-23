---
title: Creating a Blog - 14. Classifying Posts Using Tags
date: "2023-08-07T00:00:00Z"
description: "Let's rebuild the page to classify posts using tags."
tags: ["blog"]
---

# Blog Creation Series

|Title|Link|
|---|---|
|1. Basic Setup|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Design for the Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structure Design for Post Detail Page|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Enabling Relative Path for Images|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Improving Minor Page Composition and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Design of Page Element Layout|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Main Page Component Design|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Post List/Content Page Component Design|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatic Generation of Post Thumbnails|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements for Fonts, Cards, etc.|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Adding View Counts to Posts|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Theme and Post Search Functionality|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Improvements to Theme Icons and Thumbnail Layout|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Changing Post Classification to Tag-Based|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Optimization of Main Page Processing|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Creating Pagination for Post List|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Uploading Images to CDN and Creating Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implementing Infinite Scroll on Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

# 1. Why Classify Using Tags

The tasks I have documented so far include blog image optimization, inserting an introduction page, linking to the board title, adding post thumbnails, pagination of post lists, dark mode, chronological order of posts, adding view counts, creating a TOC automatically, comments functionality, search functionality, tag filtering, and SEO.

Except for the tag filtering, the rest are complete. I had postponed the tag filtering as it didn’t seem necessary with the existing search functionality.

However, as the number of posts increased, classifying them solely by the previously considered categories of CS, development, and others became increasingly difficult. While I anticipated the development category would grow, I didn't expect it to expand this much.

Therefore, I decided to classify posts using tags that reflect themes more accurately. Since posts already had tags applied, I could utilize this functionality.

# 2. Concept

However, classifying posts via tags proved to be a more complex task than I anticipated.

If it were simply a matter of viewing posts by tag on the list page, it would have been straightforward, but it required changes to the site structure and several components.

Currently, there are about 15 different tags. If I remove the random tags I previously added, there will be around 10 remaining. Given potential future growth, I expect it won't exceed two digits.

However, even currently, displaying all tags for posts exceeding 10 in the header is nearly impossible for visibility.

Thus, I aim to transition from a folder-based classification of posts to a tag-based classification, envisioning how the site should evolve accordingly.

While I need to be mindful of my tagging practices, I believe this system is more flexible, allowing me to easily create new tags if needed.

Currently, posts are classified and displayed based on folders, sorting the posts within each folder chronologically. I need to transform this to a tag-based classification instead. The overall concept is illustrated as follows.

![Blog Restructure Diagram](./page-structure.png)

## 2.1. Abandoned Concept

Initially, I considered combining the search page and tag filtering page into a single page that would display only posts filtered by the search term and tags. This method is employed in [gatsby-starter-lavender](https://gatsby-starter-lavender.vercel.app/).

However, I opted against this for several reasons.

First, there is a performance and implementation difficulty difference. If filtering by tags and search terms is handled on a single page, it won’t be possible to generate pagination for the filtered results ahead of time.

Thus, the page number and search term must be managed through query strings to display filtered results based on those values. For example, `/tag?search=searchTerm&page=2`.

However, this means that every time a search term is entered, the following process must occur:

```
Filter posts from all posts based on search term -> Paginate the resulting posts and display them
```

This would inherently perform worse than serving a statically generated page (such as through URLs like `/[tag]/[page]`).

Second, I believe combining search, tag filtering, and pagination doesn't result in a good UX. In my current implementation, the search updates results as the user types into the search field. Although it's not entirely real-time, debouncing optimization is applied.

This approach allows users to see search results without performing any extra actions after entering a search term, reducing interaction with the user.

However, pairing this real-time search filtering with pagination does not work ideally. For instance, if 100 posts are found when typing the search term `A`, resulting in 10 pages, and the user navigates to page 9 (`?search=A&page=9`), adding `B` to the search term changes the results to only 25 posts.

So, what should be displayed on page 9 of the search results for `AB`? Show no search results? Reset the search term? Or direct the user to the last page of the current search results? While any option is possible, they all involve changing the current URL and page number, which would confuse the user.

If I used infinite scroll as in the previous search page, it would be comfortable to display search results. However, I could not abandon the advantages of pagination that gives users a sense of control.

Moreover, I lack expertise in UX design, making it difficult to create a new method that combines real-time search, tag filtering, and pagination advantages. Thus, I've resolved to design the page routes in the manner described.

## 2.2. Page Structure

Currently, `/posts/[category]` displays the list of categorized posts, and `/posts/[category]/[slug]` is for the detailed view of each post. Additionally, `/posts/[category]/page/[page]` displays paginated results for categories with more than one page.

Considering multiple tags are allowed, using URLs like `/posts/[tag]/[slug]` is not ideal. Given the current URL naming convention, the likelihood of having duplicate folder names with different tags is low, so the detailed post pages will retain the format `/posts/[slug]`.

I did not structure the pagination URLs as `/posts/[category]/page/[page]` simply because it seemed neat. Rather, having the intermediate section `page` helps to avoid a situation where the detailed post URL format (`/posts/[category]/[slug]`) and paginated URLs (`/posts/[category]/[page]`) clash. It is discouraged to have two dynamic routes, hence the introduction of the intermediate `page` section.

However, since a tag-based categorization does not involve such dynamic route overlaps, for pages with more than one page based on tags, the format will be `/posts/tag/[tag]/[page]`. A separate route to show all posts will be created as `/posts/all` and `/posts/all/[page]`.

Consequently, the structure within `src/pages/posts` will be organized as follows:

```
posts
├── all
│   └── [page]
│   │   └── index.tsx
│   └── index.tsx
├── tag
│   ├── [tag]
│   │   ├── [page]
│   │   │   └── index.tsx
│   │   └── index.tsx
├── [slug]
│   └── index.tsx
└── index.tsx (Post Search Page)
```

# 3. Extracting Posts

## 3.1. Paginating All Posts

Previously, there was no pagination for all posts. The only way to view all posts was through the search page, which had pagination only by category. Therefore, I will create a separate function to paginate through all posts. This will require editing `src/utils/post.ts`.

I can utilize the existing pagination function for posts nearly as is.

```js
// src/utils/post.ts
interface Page {
  currentPage: number;
  postsPerPage: number;
}

export const getPostsByPage = (page: Page) => {
  const { currentPage, postsPerPage } = page;
  const paginatedPosts = getSortedPosts().slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  return { pagePosts: paginatedPosts, totalPostNumber: allDocuments.length };
};
```

## 3.2. Paginating Posts by Tag

Each post's tags exist as an array, `post.tags`, within the elements of `allDocument` located in `contentlayer/generated`. Therefore, let's extract all of these.

[Since the JS Set object can iterate in the order the elements are inserted,](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Set) extracting tags from `getSortedPosts` will yield the most recently authored post tags in order.

To extract all tags from posts, create `src/utils/postTags.ts` and write the function.

```js
// src/utils/postTags.ts
export const getAllPostTags = (): string[] => {
  const allTags = new Set<string>();
  getSortedPosts().forEach((post: DocumentTypes) => {
    post.tags.forEach((tag: string) => {
      allTags.add(tag);
    });
  });
  return Array.from(allTags);
};
```

Next, let's create a function to extract posts with a specific tag. The existing `getCategoryPosts` function operates as follows, requiring `PageInfo` information to load only the necessary number of posts.

```js
// src/utils/posts.ts
// Previously used function
interface PageInfo {
  category: string;
  currentPage: number;
  postsPerPage: number;
}

export const getCategoryPosts = (info: PageInfo) => {
  const { category, currentPage, postsPerPage } = info;
  const allDocumentsInCategory = getSortedPosts().filter((post: DocumentTypes) =>
    post._raw.flattenedPath.startsWith(category));

  const paginatedPosts = allDocumentsInCategory.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return { pagePosts: paginatedPosts, totalPostNumber: allDocumentsInCategory.length };
};
```

Based on this, create a similar function called `getPostsByPageAndTag`. It will also need to paginate posts with the corresponding tag, and therefore will require the same information.

```js
// src/utils/post.ts
interface TagPage {
  tag: string;
  currentPage: number;
  postsPerPage: number;
}

export const getPostsByPageAndTag = (tagPage: TagPage) => {
  const { tag, currentPage, postsPerPage } = tagPage;
  const tagPosts = getSortedPosts().filter((post: DocumentTypes) => post.tags.includes(tag));
  const paginatedPosts = tagPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  return { pagePosts: paginatedPosts, totalPostNumber: tagPosts.length };
};
```

# 4. Creating Page Structure

Let's implement the previously established page folder structure. First, move all posts to `posts` rather than categorizing them inside folders like `posts/cs`.

## 4.1. Constructing Tag-Based Pages

First, let's create the pages that classify posts by tags. Edit `src/pages/posts/tag/[tag]/index.tsx`.

Use `getAllPostTags` to provide possible paths for all tags.

```tsx
// src/pages/posts/tag/[tag]/index.tsx
export const getStaticPaths: GetStaticPaths = () => {
  const paths = getAllPostTags().map((tag) => {
    return {
      params: { tag },
    };
  });
  return {
    paths,
    fallback: false,
  };
};
```

Then, based on the created paths, use `getPostsByPageAndTag` to fetch the posts associated with that tag in `getStaticProps`.

```tsx
// src/pages/posts/tag/[tag]/index.tsx
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { pagePosts, totalPostNumber } = await getPostsByPageAndTag({
    tag: params?.tag as string,
    currentPage: FIRST_PAGE,
    postsPerPage: ITEMS_PER_PAGE
  });

  const pagePostsWithThumbnail = pagePosts.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata = { title, description, date, tags, url };
    return 'thumbnail' in post._raw ?
      ({ ...metadata, thumbnail: post._raw.thumbnail } as CardProps) :
      metadata;
  });

  return {
    props: {
      tag: params?.tag,
      tagURL: `/posts/tag/${params?.tag}`,
      pagePosts: pagePostsWithThumbnail,
      totalPostNumber,
      currentPage: FIRST_PAGE,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};
```

The page component should now utilize the generated `tag` and `tagURL`.

```tsx
// src/pages/posts/tag/[tag]/index.tsx
function PostListPage({
  tag,
  tagURL,
  pagePosts,
  totalPostNumber,
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEO Information */
  const SEOInfo: NextSeoProps = {
    title: `${tag} Tag Posts`,
    description: `This page displays posts tagged with ${tag}.`,
    canonical: `${blogConfig.url}${tagURL}`,
    openGraph: {
      title: `${tag} Tag Posts`,
      description: `This page displays posts tagged with ${tag}.`,
      images: [
        {
          url: `${blogConfig.url}${blogConfig.thumbnail}`,
          alt: `${blogConfig.name} Profile Picture`,
        },
      ],
      url: `${blogConfig.url}${tagURL}`,
    },
  };

  return (
    <>
      <NextSeo {...SEOInfo} />
      <PageContainer>
        <Title title={`Tag: ${tag}`} />
        <Pagination
          totalItemNumber={totalPostNumber}
          currentPage={currentPage}
          renderPageLink={(page: number) => `${tagURL}/${page}`}
          perPage={ITEMS_PER_PAGE}
        />
        <PostList postList={pagePosts} />
      </PageContainer>
    </>
  );
}
```

Now edit the file responsible for pages exceeding two pages: `src/pages/posts/tag/[tag]/[page]/index.tsx`. It should first generate pages based on the tags in `getStaticPaths`, ensuring to retain ISR for existing functionality.

```tsx
// src/pages/posts/tag/[tag]/[page]/index.tsx
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];

  const tags = getAllPostTags();

  for (const tag of tags) {
    // Pre-render the next 5 pages after the first page, which is handled by the index page.
    // Other pages will be pre-rendered at runtime.
    for (let i = 0; i < 5; i++) {
      paths.push(`/posts/tag/${tag}/${i + 2}`);
    }
  }

  return {
    paths,
    // Block the request for non-generated pages and cache them in the background
    fallback: 'blocking',
  };
};
```

In `getStaticProps`, implement retrieval of posts for those dynamically created pages:

```tsx
// src/pages/posts/tag/[tag]/[page]/index.tsx
export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const page: number = Number(params?.page) || 1;
  const { pagePosts, totalPostNumber } = await getPostsByPageAndTag({
    tag: params?.tag as string,
    currentPage: page,
    postsPerPage: ITEMS_PER_PAGE
  });

  const pagePostsWithThumbnail = pagePosts.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata = { title, description, date, tags, url };
    return 'thumbnail' in post._raw ?
      ({ ...metadata, thumbnail: post._raw.thumbnail } as CardProps) :
      metadata;
  });

  if (!pagePostsWithThumbnail.length) {
    return {
      notFound: true,
    };
  }
  
  if (page === 1) {
    return {
      redirect: {
        destination: `/posts/tag/${params?.tag}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      tag: params?.tag,
      tagURL: `/posts/tag/${params?.tag}`,
      pagePosts: pagePostsWithThumbnail,
      totalPostNumber,
      currentPage: page,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};
```

Like before, ensure the page component uses `tag` and `tagURL`.

## 4.2. All Posts Page

In addition to the tag classification pages, an all-inclusive posts page should also exist. Several blog templates, such as [Jbee's blog](https://jbee.io/) or [gatsby-starter-lavender](https://gatsby-starter-lavender.vercel.app/), include an "All" tag classification.

The pages responsible for this will be explicitly created as `posts/all` and `posts/all/[page]`. Since this isn’t categorized by tags, I believe using a `/tag` URL in this context is inappropriate. Constructing explicit routes helps to avoid dynamic route overlaps. One should ensure not to generate a URL path of `all` when writing posts.

First, create `src/pages/posts/all/index.tsx`. This will follow a structure similar to the tag pages. We can create `getStaticProps` as follows and construct the component accordingly.

```tsx
// src/pages/posts/tag/all/index.tsx
export const getStaticProps: GetStaticProps = async () => {
  const currentPage: number = FIRST_PAGE;
  const postsPerPage: number = ITEMS_PER_PAGE;

  const { pagePosts, totalPostNumber } = await getPostsByPage({
    currentPage,
    postsPerPage,
  });

  const pagePostsWithThumbnail = pagePosts.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata = { title, description, date, tags, url };
    return 'thumbnail' in post._raw ?
      ({ ...metadata, thumbnail: post._raw.thumbnail } as CardProps) :
      metadata;
  });

  return {
    props: {
      tag: 'All',
      tagURL: '/posts/tag/all',
      pagePosts: pagePostsWithThumbnail,
      totalPostNumber,
      currentPage: FIRST_PAGE,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};
```

The detailed page's `getStaticProps`, like before, includes redirecting to `/posts/tag/all` when on page 1, and ensuring no posts are found leads to a "not found" response:

```tsx
// src/pages/posts/tag/all/[page]/index.tsx
export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const page: number = Number(params?.page) || 1;

  const currentPage: number = page;
  const postsPerPage: number = ITEMS_PER_PAGE;

  const { pagePosts, totalPostNumber } = await getPostsByPage({
    currentPage,
    postsPerPage,
  });

  const pagePostsWithThumbnail = pagePosts.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata = { title, description, date, tags, url };
    return 'thumbnail' in post._raw ?
      ({ ...metadata, thumbnail: post._raw.thumbnail } as CardProps) :
      metadata;
  });

  if (!pagePostsWithThumbnail.length) {
    return {
      notFound: true,
    };
  }
  
  if (page === 1) {
    return {
      redirect: {
        destination: '/posts/tag/all',
        permanent: false,
      },
    };
  }

  return {
    props: {
      tag: 'All',
      tagURL: '/posts/tag/all',
      pagePosts: pagePostsWithThumbnail,
      totalPostNumber,
      currentPage: page,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};
```

## 4.3. Post Detail Page

The existing detailed post page located at `src/pages/posts/[category]/[slug]/index.tsx` should be moved to `src/pages/posts/[slug]/index.tsx`. Now let’s create the detail page based on this.

In `getStaticPaths`, all post paths must be generated. Since every post now directly exists within the `/posts` folder, `post._raw.flattenedPath` will serve effectively as the slug.

```tsx
// src/pages/posts/[slug]/index.tsx
export const getStaticPaths: GetStaticPaths = () => {
  const paths = getSortedPosts().map((post: DocumentTypes) => {
    return {
      params: {
        slug: post._raw.flattenedPath
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};
```

The `getStaticProps` should retrieve the relevant post information:

```tsx
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = getSortedPosts().find(
    (p: DocumentTypes) => {
      return p._raw.flattenedPath === params?.slug;
    }
  )!;

  const URL = `/api/view?slug=${params?.slug}`;
  const fallbackData = await fetchViewCount(params?.slug);
  return {
    props: {
      post,
      fallback: {
        [URL]: fallbackData,
      }
    },
  };
};
```

## 4.4. Main Page

To keep the main page concise, we will display only the most recent 9 posts, organized in rows of three.

```tsx
// src/pages/index.tsx
export default function Home({
  categoryPosts
}: InferGetStaticPropsType<typeof getStaticProps>) {

  return (
    <PageContainer>
      <Profile />
      <ProjectList />
      <Category {...categoryPosts} />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  await generateRssFeed();

  const title = 'Recently Written Posts';
  const url = '/posts';

  const categoryPosts: CategoryProps = {
    title,
    url,
    items: getSortedPosts().slice(0, 9).map((post: DocumentTypes) => {
      return propsProperty(post);
    })
  };

  return { props: { categoryPosts } };
};
```

# 5. Other Modifications

## 5.1. Header Modification

Let's modify the header structure, moving from folder-based categorizations. We will retain only the `/posts/all` page, the search page, and `/about`. Originally, I considered using icons for these, but it seems unnecessary. Remember, it will be possible to navigate to different tag classification pages directly from the post list page.

To update the header, we will modify `blog-category.ts`, which receives `navList` as props to display those menu items in the navigation bar.

```ts
// blog-category.ts
interface Category {
  title: string;
  url: string;
}

const blogCategoryList: Category[] = [
  { title:'Post List', url:'/posts/all' },
  { title:'About', url:'/about' },
];

export default blogCategoryList;
```

## 5.2. Filtering by Tags

With the transition to tag-based classification, the categorization has significantly expanded. Though I plan to reduce clutter, I anticipate greater than just the previous three categories of CS, development, and others. This expansion indicates that listing all categories in the header is no longer feasible.

While it’s possible to structure the menu hierarchically, I believe overly strict classification reduces the purpose of the tag system. Thus, I explained in the header section that only `/posts/all` remains in the header. Consequently, I will enable links from the post list page to other tag categorization pages.

Initially, I considered a dropdown menu for selecting tags. However, this could lead to additional interactions for users attempting to view post lists. From an accessibility standpoint, if the tagging classification is presented in a dropdown, screen readers might struggle to read it properly.

Hence, links for navigating to tag-based post categorization pages will be visible on post viewing pages. The end result will appear similar to the design outlined below:

![Result of Tag Filter Completion](./tagfilter-design.png)

While the design is not exceptional (as I am not a designer), there is no need to go into detail about CSS; I will only provide the core logic in code.

### 5.2.1. URL Conversion Function

The tag list will be fetched using `getAllPostTags`, which simplifies aspects related to the function, leaving tag name handling for conversion to URL paths. For the "All" tag, it must lead to a special link, so it's treated distinctly.

Thus, I will create a function in `src/utils/postTags.ts` to convert tag names to URLs:

```ts
export const makeTagURL = (tag: string): string => {
  if (tag === 'All') {
    return '/posts/all';
  } else {
    return `/posts/tag/${tag}`;
  }
};
```

### 5.2.2. Component Creation

Next, create the tag filter component in `src/components/tagFilter/index.tsx`. What inputs does this component require?

Firstly, it needs the complete list of tags. Although this can be constructed internally, since tags are constants, I will define them in `src/utils/postTags.ts` and pass them as props.

```ts
export const tagList: string[] = ['All', ...getAllPostTags()];
```

The currently selected tag should be defined through the URL, so it needs to be provided as props. Additionally, the function that generates page URLs for the tags must also be supplied as a prop. The `makeTagURL` function we created previously serves this purpose.

Thus, the `TagFilter` component may look like this:

```tsx
interface Props {
  tags: string[];
  selectedTag: string;
  makeTagURL: (tag: string) => string;
}

function TagFilter(props: Props) {
  const { tags, selectedTag, makeTagURL } = props;

  return (
    <section className={styles.container}>
      <Title title={'Tag List'} />
      <ul className={styles.tagList}>
        {tags.map((tag) => {
          return (
            <li
              key={tag}
              className={tag === selectedTag ? styles.selectedTagItem : styles.tagItem}
            >
              <Link
                href={makeTagURL(tag)} 
                className={styles.tagLink}
              >
                {tag}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

This component can be integrated as follows, appearing on all pages related to post lists:

```tsx
<TagFilter 
  tags={tagList} 
  selectedTag={tag} 
  makeTagURL={makeTagURL} 
/>
```

# 6. Plugin Correction

Due to adjustments in folder structure, the plugin responsible for copying post images in the pre-build phase needs updates. Modify `src/bin/pre-build.mjs` to look like this:

```js
// src/bin/pre-build.mjs
async function getInnerDirectories(dir) {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });
  return files.filter(file => file.isDirectory());
}

async function getInnerImages(dir) {
  const files = await fsPromises.readdir(dir);
  return files.filter((file) => imageFileExtensions.includes(path.extname(file)));
}

async function copyPostDirImages() {
  // Inside the posts folder for posts
  const posts = await getInnerDirectories(postDir);

  for (const _post of posts) {
    const post = _post.name;
    const postImages = await getInnerImages(`${postDir}/${post}`);
    if (postImages.length) {
      // Create folder
      await fsPromises.mkdir(`${imageDir}/${post}`, { recursive: true });
      await copyImage(`${postDir}/${post}`, `${imageDir}/${post}`, postImages);
    }
  }
}
```

# 7. Troubleshooting Duplicate Path Issues

After these changes, building the project resulted in the following error:

```bash
SourceFetchDataError {
  error: JsonParseError {
    str: 'undefined\n',
    error: SyntaxError: Unexpected token 'u', "undefined" is not valid JSON
    ...
  },
  ...
}
```

What could be the issue? The thumbnail creation and Cloudinary upload process seemed suspect, so I modified the function to only save thumbnails locally. 

```js
export default function makeThumbnail() {
  return async function(tree, file) {
    /* 
    Thumbnail generation code
    */
    if (blogConfig.imageStorage === 'local') { return; }
    /*
    Code to upload thumbnails to Cloudinary
    */
  };
}
```

With this change, that particular error was resolved; however, a new error surfaced:

```bash
[Error: ENOENT: no such file or directory, rename '/users/username/nextjs-blog/.next/export/posts/tag/HTML.html' -> '/users/username/nextjs-blog/.next/server/pages/posts/tag/HTML.html'] {
  ...
}
```

Upon researching GitHub issues, it was suggested that this may be due to duplicate routes. I suspected the presence of both `HTML` and `html` tags causing the issue. 

Upon altering the `html` tag to `HTML`, the build successfully completed.

```bash
# Before
---
title: Handling Data in HTML Forms
date: "2023-08-03T00:00:00Z"
description: "How to manage data in HTML forms?"
tags: ["html"]
---

# After
---
title: Handling Data in HTML Forms
date: "2023-08-03T00:00:00Z"
description: "How to manage data in HTML forms?"
tags: ["HTML"]
---
```

Using `Set` to eliminate duplicates ensures that both `HTML` and `html` are treated as unique. Therefore, generating URL paths from `src/pages/posts/tag/[tag]/index.tsx` ensures that duplicate tag strings lead to HTTP errors.

# 8. Reducing Tags

Since there are abundant ambiguous tags, I will narrow down the list to a few essential categories. The tentative list includes the following:

- OOP
- Javascript
- HTML
- Study
- React
- Web
- Front
- Tip
- CS
- CSS
- Algorithm
- Language
- Git
- Blog
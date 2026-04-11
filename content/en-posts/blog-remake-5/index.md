---
title: Creating a Blog - 5. Remaining Tasks Before Design
date: "2023-05-24T01:00:00Z"
description: "Main page article preview, header, About page, and full article list page tasks"
tags: ["blog", "web"]
---

# Create a Blog Series

|Title|Link|
|---|---|
|1. Basic Settings|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Design of Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structure Design of Article Detail Page|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Enable Using Relative Paths for Images|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Minor Page Layout Improvements and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Layout Design of Page Elements|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Main Page Component Design|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Article List/Content Page Component Design|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatic Generation of Article Thumbnails|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements for Fonts and Cards|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Adding View Counts to Articles|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Themes and Article Search Functionality|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Improvements to Theme Icons and Thumbnail Layout|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Change Article Classification to Tag-Based|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Optimization of Main Page Operations|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Create Pagination for Article List Page|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Upload Images to CDN and Create Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implement Infinite Scroll on Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

What tasks remain before decorating the pages? There are definitely numerous implementations desired, such as adding view counts, comment features, and filtering article lists by tags.

However, let's first focus on the minor tasks essential for setting up the blog's layout, including displaying the actual article list on the main page, modifying the header, and creating a simple self-introduction page before deploying it on Vercel. We should check whether it works correctly.

# 1. Main Page Article List

After investing too much effort in the article list, I can hardly remember how I structured the main page. The objective of the main page is to display my introduction, project, and blog article list.

![home-layout](./new-home-layout.png)

The components for `Category` and `Card` have already been created for this purpose. Now, let's make these components display the actual article list. Since we have already worked with retrieving the article list via `allDocument`, this should be straightforward.

Currently, there is no project list available, so let's display only the blog article list. Looking at the structure, the subject list of the articles exists in `blog-config.ts` (the names of the subfolders under `/posts`), so we will find relevant articles from `allDocument` and pass them to `Category`.

Moreover, since the main page will only show a limited number of articles for each category, we need to slice the filtered article list as follows:

```tsx
{/* The article list exists as an independent section */}
<article>
  {blogCategoryList.map((category) => {
    const categoryPostList = allDocuments.filter((post) => {
      return post._raw.flattenedPath.split('/')[0] === category.title.toLowerCase();
    }).slice(0, 3);
    if (categoryPostList.length === 0) {
      return null;
    }
    return <Category key={category.title} title={category.title} items={categoryPostList} />;
  })}
</article>
```

# 2. Header

The menu in the header is now also available in `blog-config.ts`, so let's retrieve this and display it in the header. We will replace the props passed to `Header` in `src/pages/index.tsx` with those imported from `blog-category.ts`.

```tsx
// src/pages/index.tsx
import blogCategoryList from 'blog-category';

export default function Home() {
  return (
    <>
      <Head>
        <title>{blogConfig.title}</title>
        <meta name='description' content={blogConfig.description} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='og:image' content={blogConfig.thumbnail} />
        <meta name='twitter:image' content={blogConfig.thumbnail} />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='canonical' href='https://witch.work/' />
      </Head>
      <main>
        {/* Change navList here to blogCategoryList */}
        <Header navList={blogCategoryList} />
        <Profile />
        {/* Project list exists as an independent section */}
        <article>
          <Category title={projectList.title} items={projectList.items} />
        </article>
        {/* Article list exists as an independent section */}
        <article>
          <Category title={postList.title} items={postList.items} />
          <Category title={postList.title} items={postList.items} />
        </article>
        <Footer />
      </main>
    </>
  );
}
```

Additionally, we should at least have links in the header to navigate home and to the About page, so let's add those to `blog-category.ts`. This way, when displaying the article list for each category, the links for `home` and `about` will also attempt to show articles for those categories, but since there are no articles in those categories, they will be filtered out by `if (categoryPostList.length === 0) { return null; }`, so it won't matter.

```ts
// blog-category.ts
interface Category {
  title: string;
  url: string;
}

const blogCategoryList: Category[] = [
  {title: 'Home', url: '/'},
  {title: 'CS', url: '/posts/cs'},
  {title: 'Front', url: '/posts/front'},
  {title: 'Misc', url: '/posts/misc'},
  {title: 'About', url: '/about'},
];

export default blogCategoryList;
```

# 3. Full Article List Page

While I’m not confident in UI/UX theory, I believe having a full article list page is appropriate. The category pages such as `/posts/cs`, `/posts/front`, and `/posts/misc` will only display articles specific to their category, while the `/posts` page will display all articles.

Therefore, let's create the file at `/pages/posts/index.tsx`. It's easy to anticipate that this structure overlaps significantly with `/pages/posts/[category]/index.tsx`, so we can copy the content of that file for now.

What do we need to modify? Since we are not creating a dynamic path, we can remove `getStaticPaths`.

Also, there’s no need to filter by category in `getStaticProps`, meaning we can simply retrieve `allDocuments` and extract the required information. Furthermore, since the category will only serve the purpose of displaying the article list title, we can rename it to "All Articles."

After applying these changes, it will look like this:

```tsx
// src/pages/posts/index.tsx
import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';

import Card from '@/components/card';
import { allDocuments } from '@/contentlayer/generated';

interface PostMetaData {
  title: string;
  description: string;
  date: string;
  tags: string[];
  url: string;
}

function AllPostListPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main>
      <h1>{category}</h1>
      <ul>
        {postList.map((post: PostMetaData) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
    </main>
  );
}

export default AllPostListPage;

export const getStaticProps: GetStaticProps = () => {
  const postList = allDocuments.map((post) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
  return { props: { category: 'All Articles', postList } };
};
```

As for adding a link to this full article page, while we could add it to `blog-category.ts`, I’m uncertain whether it’s appropriate to include the full article list in the header. I feel that users may not intuitively understand the distinction between a navigation menu for all articles and for categories.

I will leave it for now, should it be needed in the future.

# 4. About Page

We need to create the `/about` page. Let’s create `pages/about/index.tsx` and write an introduction there.

However, since there are countless features still to be added to the blog, I simply pasted my resume for now. Those curious can refer to my [resume repo](https://github.com/witch-factory/resume). Stars are appreciated...

I created `styles.module.css` and added classNames similar to those in the resume. It isn't particularly crucial, so let's move on quickly.

# 5. Deploying

Now, let’s deploy and in the next article, we will focus on styling. Eventually, I'll connect it to Cloudflare, but for now, we merely want to check if it operates correctly in the deployment environment, so we will deploy it on Vercel.

Create a repository named `witch-next-blog` on GitHub and link it to the current repository.

```bash
git init
git remote add origin git@github.com:witch-factory/witch-next-blog.git
git add .
git commit -m "init"
git push -u origin master
```

Next, we deploy through Vercel. There are many tutorials available online for this, so I will skip the details.

Click "Add New Project" on the Vercel dashboard, select the project from your GitHub to deploy. Choose the `witch-next-blog` we just created and let’s start the deployment process.

As expected, it doesn’t go smoothly at first. Almost immediately, there’s a build error from Vercel. This emphasizes the importance of testing deployments. Reading through the build error messages displayed by Vercel, I found the following:

```bash
./src/pages/index.tsx
6:1  Error: There should be at least one empty line between import groups  import/order
7:1  Error: There should be at least one empty line between import groups  import/order
7:1  Error: `@/contentlayer/generated` import should occur after import of `blog-config`  import/order
./src/pages/posts/[category]/index.tsx
7:1  Error: There should be at least one empty line between import groups  import/order
8:1  Error: There should be at least one empty line between import groups  import/order
9:1  Error: `blog-category` import should occur before import of `@/contentlayer/generated`  import/order
./src/pages/posts/index.tsx
6:1  Error: There should be at least one empty line between import groups  import/order
info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
Error: Command "npm run build" exited with 1
BUILD_UTILS_SPAWN_1: Command "npm run build" exited with 1
```

It appears there’s an error arising from the ESLint `import/order` rule. We could modify that rule; however, since everything runs fine in the development environment and auto-fixes work well, let’s reduce the severity of this rule from error to warning.

```json
// .eslintrc.json
{
  // ...
  "rules": {
    "import/order": [
      // It was originally "error."
      "warn", 
      // ...
    ]
  }
  // ...
}
```

Now, shall we try deploying on Vercel again? After doing so, the previous lint errors have been changed to warnings, and that part of the deployment works fine. But another error appears.

```
./src/pages/index.tsx:7:30
Type error: Cannot find module '@/contentlayer/generated' or its corresponding type declarations.
```

How can we resolve this? That’s a defined alias in `tsconfig.json`, and the "@" might be causing the issue, so let's try changing it.

```json
{
  // ...
  "compilerOptions": {
    // ...
    "paths": {
      "@/*": ["./src/*"],
      "contentlayer/generated": ["./.contentlayer/generated"],
      "contentlayer/generated/*": ["./.contentlayer/generated/*"]
    },
    // ...
  }
  // ...
}
```

Then, let’s change all imports from `@/contentlayer/generated` to `contentlayer/generated`.

However, the alias merely changed, and the same error persists. It seems that the folder might not be created at the time we try to use `contentlayer/generated`.

```
Type error: Cannot find module 'contentlayer/generated' or its corresponding type declarations.
```

It appears that the sequence is somewhat mixed up. How about downgrading `contentlayer` to match the version of others who have built successfully? I altered the versions of `contentlayer` and `next-contentlayer` in `package.json` from `^0.3.2` to `^0.3.0`. Ultimately, it didn’t help. Back to rolling back versions.

Upon investigation, I found an existing [issue for a similar problem in a pnpm environment](https://github.com/contentlayerdev/contentlayer/issues/415). Although I'm not using pnpm, it's worth trying out any suggested solutions. 

The proposed solution was to change the `build` script in `package.json` to `"contentlayer build && next build"`. This seems to combine the contentlayer build with the next build command.

```json
"scripts": {
  "copyimages": "node ./src/bin/pre-build.mjs",
  "prebuild": "npm run copyimages",
  "predev": "npm run copyimages",
  "dev": "next dev",
  "build": "contentlayer build && next build",
  "start": "next start",
  "lint": "next lint"
},
```

Ah, this was the issue. Now that I made this change, it finally deployed successfully.

![deploy-success](./deploy-success.png)

The deployed page can be viewed [here](https://witch-next-blog-kgb1t697z-witch-factory.vercel.app/). It may seem basic, but it has the necessary features for a blog.

# References

Issue for resolving deployment issues https://github.com/contentlayerdev/contentlayer/issues/415
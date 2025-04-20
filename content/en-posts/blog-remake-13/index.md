---
title: Creating a Blog - 13. Icon Colors, Adding Links, Code Refactoring
date: "2023-06-12T05:00:00Z"
description: "Let's make some minor fixes."
tags: ["blog", "web"]
---

# Blog Creation Series

| Title | Link |
| --- | --- |
| 1. Basic Settings | [https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1) |
| 2. HTML Design of the Main Page | [https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2) |
| 3. Structure Design of the Detail Page | [https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3) |
| 4. Enable Relative Paths for Images | [https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4) |
| 5. Minor Page Structure Improvements and Deployment | [https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5) |
| 6. Design Layout of Page Elements | [https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6) |
| 7. Main Page Component Design | [https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7) |
| 8. Post List/Content Page Component Design | [https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8) |
| 9. Automatically Generate Post Thumbnails | [https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9) |
| 10. Design Improvements on Fonts, Cards, etc. | [https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10) |
| 11. Add View Counts to Posts | [https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11) |
| 12. Page Themes and Post Search Features | [https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12) |
| 13. Improvements on Theme Icons and Thumbnail Layouts | [https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13) |
| 14. Change Post Classification to Tag-Based | [https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14) |
| Optimize Operations on the Main Page | [https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1) |
| Create Pagination for Post List | [https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2) |
| Upload Images to CDN and Create Placeholders | [https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3) |
| Implement Infinite Scroll on Search Page | [https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4) |

# 1. Header Icon Colors

As the screen width decreases, the menu in the header changes to a dropdown, but the icon colors remain consistently black regardless of the theme. This is inconvenient for dark mode.

Let’s make the icon colors change based on the theme. We'll retrieve the iOS hamburger menu and close icons from [icons8](https://icons8.com/) and apply them to the `Toggler` component.

```tsx
// src/components/header/menu/toggler/index.tsx
import Image from 'next/image';
import { useTheme } from 'next-themes';

import styles from './styles.module.css';

const hamburgerIcon: { [key: string]: string } = {
  'light': '/icons/icons8-hamburger.svg',
  'dark': '/icons/icons8-hamburger-dark.svg',
  'pink': '/icons/icons8-hamburger-pink.svg',
};

const cancelIcon: { [key: string]: string } = {
  'light': '/icons/icons8-cancel.svg',
  'dark': '/icons/icons8-cancel-dark.svg',
  'pink': '/icons/icons8-cancel-pink.svg',
};

function Toggler({ isMenuOpen, toggle }: { isMenuOpen: boolean, toggle: () => void }) {
  const { theme } = useTheme();

  return (
    <button className={styles.button} onClick={toggle}>
      <Image
        src={isMenuOpen ?
          cancelIcon[theme || 'light'] :
          hamburgerIcon[theme || 'light']
        }
        alt='Menu'
        width={32}
        height={32}
      />
    </button>
  );
}

export default Toggler;
```

Then, to make this visible on the client side, we use dynamic import in the menu component.

```tsx
// src/components/header/menu/index.tsx

import dynamic from 'next/dynamic';

/* import statements omitted */
/* dynamic import */
const Toggler = dynamic(() => import('./toggler'), { ssr: false });

/* type omitted */

function Menu({ navList }: { navList: PropsItem[] }) {
  /* Component content remains the same, omitted */
}

export default Menu;
```

# 2. Adjusting Spacing of Automatically Generated Thumbnails

Currently, automatically generated thumbnails are created through the remark plugin function in `src/plugins/make-thumbnail.mjs`. However, in the present code, if the title is too long and spans multiple lines, the content below (heading list) does not adjust its spacing flexibly and renders at a fixed position.

Let's modify this code. We only need to update the `drawHeadings` function.

```js
// src/plugins/make-thumbnail.mjs
/* Other functions omitted */
function drawHeadings(ctx, title, headingTree) {
  title = stringWrap(title, 15);
  title = title.split('\n');

  if (title.length > 3) { return; }

  const thumbnailHeadings = headingTree.slice(0, 2);
  const headingTexts = [];
  for (let h of thumbnailHeadings) {
    const headingText = h.data.hProperties.title.replaceAll('. ', '-');
    headingTexts.push(headingText);
  }
  headingTexts[headingTexts.length - 1] += '...';
  ctx.font = '20px NotoSansKR';
  for (let i = 0; i < headingTexts.length; i++) {
    ctx.fillText(headingTexts[i], 20, 50 + 50 * title.length + 25 * i);
  }
}
```

Additionally, pass the title as an argument when using `drawHeadings`.

```js
drawHeadings(ctx, title, headings);
```

# 3. Adding Links to Categories

Let's add links to the board titles displayed in the `Category` section on the main page. The component already receives category URLs as props, making it straightforward.

To indicate that a link is present, we use the link indicator Unicode `U+1F517`.

```tsx
// src/components/category/index.tsx
function Category(props: Props) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        <Link href={props.url}>
          {props.title} {'\u{1F517}'}
        </Link>
      </h2>

      <ul className={styles.list}>
        {props.items.map((item) => {
          return (
            <li key={item.url}>
              <Card
                {...propsProperty(item)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

Also, add text color styling on hover.

```css
// src/components/category/styles.module.css
.container {
  margin-bottom: 2rem;
}

.title:hover {
  color: var(--textLightIndigo);
}

.list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
  margin: 0;
}

@media (min-width: 768px) {
  .list {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

# 4. Specifying Theme Setting Functions in the Footer

The original theme setting functions used in the footer were explicitly created for each theme name. Let's change this to a function that creates them automatically based on the theme name.

```tsx
// src/components/footer/index.tsx
/* Previously used functions */
const pinkTheme = () => {
  setTheme('pink');
};

const witchTheme = () => {
  setTheme('witch');
};

/* New generic function */
const changeTheme = useCallback((theme: string) => {
  return () => {
    setTheme(theme);
  };
}, []);
```

# 5. Consolidating Repeating Sections

## 5.1. Icon Colors Based on Theme

Currently, selecting icons based on the theme is done through a mapping object in the `Toggler` and `Search` components. However, repetitive functions for each icon have been defined independently.

In addition to what is written below, a `searchIconSrc` function also exists... there are three similar functions with the same logic.

```tsx
// src/components/header/menu/toggler/index.tsx
function hamburgerIconSrc(isDark: boolean, isPink: boolean, isWitch: boolean) {
  if (isDark || isWitch) {
    return hamburgerIconMap['dark'];
  }
  else if (isPink) {
    return hamburgerIconMap['pink'];
  }
  else {
    return hamburgerIconMap['light'];
  }
}

function cancelIconSrc(isDark: boolean, isPink: boolean, isWitch: boolean) {
  if (isDark || isWitch) {
    return cancelIconMap['dark'];
  }
  else if (isPink) {
    return cancelIconMap['pink'];
  }
  else {
    return cancelIconMap['light'];
  }
}
```

Let's separate this into a function. Define the following function in `utils/getThemeName.ts`. The reason for allowing `undefined` is that the theme passed here is `resolvedTheme` from next-themes, which could also be `undefined`.

If the theme is `undefined`, treat it as `light`.

```ts
export const getThemeName = (theme: string | undefined) => {
  if (theme === 'witch') {
    return 'dark';
  }
  return theme ?? 'light';
}
```

Additionally, move the existing image objects to `utils/iconsURL.ts`.

```ts
// Add the following content to src/utils/iconsURL.ts
const hamburgerIconMap: { [key: string]: string } = {
  'light': hamburgerIcon,
  'dark': hamburgerIconDark,
  'pink': hamburgerIconPink,
};

const cancelIconMap: { [key: string]: string } = {
  'light': cancelIcon,
  'dark': cancelIconDark,
  'pink': cancelIconPink,
};

const searchIconMap: { [key: string]: string } = {
  'light': searchIcon,
  'dark': searchIconDark,
  'pink': searchIconPink,
};

export {
  hamburgerIconMap,
  cancelIconMap,
  searchIconMap,
};
```

Then apply this in the `Toggler` component as follows. The redundant logic and function definitions are eliminated, resulting in much cleaner code.

```tsx
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { getThemeName } from '@/utils/getThemeName';
import { hamburgerIconMap, cancelIconMap } from '@/utils/iconsURL';

import styles from './styles.module.css';

function Toggler({ isMenuOpen, toggle }: { isMenuOpen: boolean, toggle: () => void }) {
  const { resolvedTheme } = useTheme();

  return (
    <button className={styles.button} onClick={toggle}>
      <Image
        src={isMenuOpen ?
          cancelIconMap[getThemeName(resolvedTheme)] :
          hamburgerIconMap[getThemeName(resolvedTheme)]
        }
        alt='Menu' 
        width={32} 
        height={32} 
      />
    </button>
  );
}

export default Toggler;
```

Apply the same logic to the `Search` component.

```tsx
// src/components/header/search/index.tsx
const Search = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Link href='/posts' className={styles.search}>
      <Image 
        src={searchIconMap[getThemeName(resolvedTheme)]} 
        alt='Search' 
        width={32} 
        height={32} 
        priority
      />
    </Link> 
  );
};
```

## 5.2. Removing Redundant Logic Mapping in the Main Page

Take a look at the main page code in `src/pages/index.tsx`. The `getStaticProps` returns an object in the format `{ categoryName: array of posts in that category }`, which is then iterated over in the `Home` component using `blogCategoryList.map` to generate `Category` components for each category.

At this point, the logic for returning posts by category is redundant. Let's remove it.

```tsx
export default function Home({
  categoryPostMap
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageContainer>
      <Profile />
      {/* Creating a project list */}
      <ProjectList />
      <article>
        {/* Creating a post list by category */}
        {blogCategoryList.map((category) => {
          const categoryPostList = categoryPostMap[category.url];

          return categoryPostList.length ?
            <Category
              key={category.title} 
              title={category.title} 
              url={category.url} 
              items={categoryPostList}
            /> : null;
        })}
      </article>
    </PageContainer>

  );
}

export const getStaticProps: GetStaticProps = () => {
  const categoryPostMap: { [key: string]: CardProps[] } = {};

  blogCategoryList.forEach((category) => {
    categoryPostMap[category.url] = getSortedPosts()
      .filter((post: DocumentTypes) => {
        return post._raw.flattenedPath.split('/')[0] === category.url.split('/').pop();
      })
      .slice(0, 3)
      .map((post: DocumentTypes) => {
        return propsProperty(post);
      });
  });

  return { props: { categoryPostMap } };
};
```

Modify it as follows. Now, instead of calculating through an object in the `Home` component, we use a map with an array.

```tsx
function propsProperty(post: DocumentTypes) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

export default function Home({
  categoryPostList
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageContainer>
      <Profile />
      {/* Creating a project list */}
      <ProjectList />
      <article>
        {/* Creating a post list by category */}
        {categoryPostList.map((category: CategoryProps) => {
          return category.items.length ?
            <Category
              key={category.url}
              {...category}
            /> : null;
        })}
      </article>
    </PageContainer>

  );
}

export const getStaticProps: GetStaticProps = () => {

  const categoryPostList: CategoryProps[] = blogCategoryList.map((category) => {
    const { title: categoryTitle, url: categoryURL } = category;
    const postList: CardProps[] = getSortedPosts()
      .filter((post: DocumentTypes) => {
        return post._raw.flattenedPath.split('/')[0] === category.url.split('/').pop();
      })
      .slice(0, 3)
      .map((post: DocumentTypes) => {
        return propsProperty(post);
      });

    return { title: categoryTitle, url: categoryURL, items: postList };
  });

  return { props: { categoryPostList } };
};
```

The `CategoryProps` used above is defined similarly in the `Category` component.

```tsx
// src/components/category/index.tsx
export interface CategoryProps {
  title: string;
  url: string;
  items: CardProps[];
}
```

# 6. Add Types to Pagination Code

The array returned by `getPaginationArray`, used for pagination, contains both `...` and numbers. Therefore, let's define a type that encompasses these two to prevent erroneous strings from being included in this array during future maps.

```tsx
// Change to constant type
export const dotts = '...' as const;

function getPaginationArray(
  totalItemNumber: number,
  currentPage: number,
  perPage: number
): Array<number | typeof dotts> {
  /* Define return type as either number or dotts string */
  const totalPages = parseInt((totalItemNumber / perPage).toString()) + (totalItemNumber % perPage ? 1 : 0);
  if (totalPages <= 7) {
    return getPages(totalPages);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, dotts, totalPages - 1, totalPages];
  }
  if (currentPage >= totalPages - 3) {
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

# 7. Debounce for Infinite Scroll

Separate the `useDebounce` hook into `src/utils/useDebounce.ts` and implement it to debounce the scrolling on the page.

```tsx
function PostSearchPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchKeyword, debouncedKeyword, setSearchKeyword] = useSearchKeyword();
  const [filteredPostList, setFilteredPostList] = useState<CardProps[]>(postList);
  const [page, setPage] = useState<number>(1);
  /* Page only increases after 300ms */
  const debouncedPage = useDebounce(page.toString(), 300);

  const infiniteScrollRef = useRef<HTMLDivElement>(null);
  const totalPage = Math.ceil(filteredPostList.length / ITEMS_PER_PAGE);

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, [setSearchKeyword]);

  useEffect(() => {
    setFilteredPostList(filterPostsByKeyword(postList, debouncedKeyword));
  }, [debouncedKeyword]);

  /* Load scroll based on the debounced page */
  useInfiniteScroll(infiniteScrollRef, useCallback(() => {
    if (page < totalPage) {
      setPage(prev => prev + 1);
    }
  }, [debouncedPage, totalPage]));

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
      <div className={styles.infScroll} ref={infiniteScrollRef} />
    </PageContainer>
  );
}
```

# 8. Improve Blur URL

The current blurred image used as a placeholder is generated in `src/utils/generateBlurPlaceholder.ts`. The code is as follows:

```ts
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';

export default async function getBase64ImageUrl(imageUrl: string) {
  const response = await fetch(imageUrl.replace('w_300,f_auto', 'w_16,f_jpg'));
  const buffer = await response.arrayBuffer();
  const minified = await imagemin.buffer(Buffer.from(buffer), {
    plugins: [imageminJpegtran()],
  });
  const blurURL = `data:image/jpeg;base64,${Buffer.from(minified).toString('base64')}`;
  return blurURL;
}
```

However, the library `imagemin` being used here has become obsolete. According to the [official GitHub](https://github.com/imagemin/imagemin#readme), it is marked as Unmaintained.

Thus, let's use a new library. The [plaiceholder](https://plaiceholder.co/docs) library is available. 

```
Q: Why have you misspelled "placeholder"?
A: A Plaice is a flat fish that lays stationary on the seabed, much like an image placeholder… actually this is just a joke, all the other good names were taken.
```

## 8.1. Library Setup

Remove all previously installed `imagemin` related libraries and install `plaiceholder`.

```bash
npm uninstall @types/imagemin
npm uninstall @types/imagemin-jpegtran
npm uninstall imagemin-jpegtran
npm uninstall imagemin

npm install sharp
npm install plaiceholder
```

If you want to use this on the Next.js side, you should also install `@plaiceholder/next`. However, since I will only use it during the build using the remark plugin, it’s unnecessary to install.

For reference, `plaiceholder` requires the `next.config` to be in `ts` or `mjs` format to use the ESM module format. The official documentation frequently mentions "ESM only."

However, doing so causes many caching errors during the build, presumably from the contentlayer side. [Next.js has an issue related to this.](https://github.com/vercel/next.js/issues/33693) Based on the related issues, it appears that most ESM module support in Webpack is experimental and not yet stabilized.

Although I moved on since I won’t be using it on the Next.js side, if someone manages to resolve using `plaiceholder` in Next.js, please let me know in the comments.

## 8.2. Code Modification

We only need to modify the `getBase64ImageUrl` function in `generateBlurPlaceholder.ts`. It should return the base64 encoded `blurURL`, and the rest will be handled in `make-thumbnail.mjs`.

```ts
import { getPlaiceholder } from 'plaiceholder';

export default async function getBase64ImageUrl(imageUrl: string) {
  try {
    const buffer = await fetch(imageUrl).then(async (res) => {
      return Buffer.from(await res.arrayBuffer());
    });
    const { base64: blurURL } = await getPlaiceholder(buffer, { size: 8 });
    return blurURL;
  } catch (err) {
    err;
  }
}
```

# References

Official documentation of plaiceholder: https://plaiceholder.co/docs

https://github.com/vercel/next.js/issues/33693
---
title: Creating a Blog - 2. HTML Structure of the Main Page
date: "2023-05-21T01:00:00Z"
description: "Let's create the HTML structure for the blog."
tags: ["blog", "web"]
---

# Blog Creation Series

|Title|Link|
|---|---|
|1. Basic Setup|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Design of the Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structure Design of the Detailed Article Page|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Allowing Images to be Used with Relative Paths|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Improving Minor Page Composition and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Design of Page Element Placement|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Main Page Component Design|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Design of Article List/Content Page Components|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatically Generating Article Thumbnails|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements in Fonts, Cards, etc.|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Adding View Counts to Articles|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Themes and Article Search Functions|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Improvements in Theme Icons and Thumbnail Layouts|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Changing Article Classification to Tag-Based|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Optimization of Main Page Operations|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Creating Pagination for Article List|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Uploading Images to CDN and Creating Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implementing Infinite Scroll on Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

# 0. Overview

This time, let's establish the basic HTML structure for the blog's main page. The layout for other pages will be created after implementing the fundamental functionalities of the blog through the main page.

The layout envisioned for the main page is as follows.

![home-layout](./new-home-layout.png)

Based on the layout above, let's create the necessary components. The components required at this stage seem to be a header, footer, a component for my introduction, a component to display a list of articles, and a component to show a project list.

For now, let's focus on the basic construction without considering styling. Create a `src/components` folder. Our goal is to create a semantically well-structured page. With this in mind, we will design the components.

# 1. Header Component

Create a folder `src/components/header` and make an `index.tsx` file. Since the header of my blog will contain basic navigation, the following structure should suffice.

```tsx
function Header() {
  return <header>
    <nav>
      <button>Home</button>
      <button>Front</button>
      <button>Topic 1</button>
    </nav>
  </header>;
}
```

However, since the navigation bar may contain more menus and links, let's modify it to use props.

```tsx
import Link from 'next/link';

interface PropsItem {
  title: string;
  url: string;
}

function Header({
  navList
}: {
  navList: PropsItem[];
}) {
  return (
    <header>
      <nav>
        {
          navList.map((item) => {
            return <button key={item.title}>
              <Link href={item.url} aria-label={item.title}>
                {item.title}
              </Link>
            </button>;
          })
        }
      </nav>
    </header>
  );
}

export default Header;
```

Insert this into `index.tsx` and create an appropriate `navList` variable to check if it works properly by passing it as props. The same approach applies to the other components, which are also placed in `src/pages/index.tsx` to verify their functionality.

# 2. Footer Component

In fact, there isn't much to put in the Footer. Let’s include my name there. However, as my name will be used frequently, let's first create a `blog-config.ts` file to include my information.

I will also add my profile picture to the `/public` directory. Below, you will see `picture: '/witch.jpeg'`, which indicates my profile picture located at `/public/witch.jpeg`.

```ts
// /blog-config.ts
interface BlogConfigType {
  name: string;
  title: string;
  description: string;
  picture: string;
  url: string;
  social: {
    github: string;
  }
}

const blogConfig: BlogConfigType = {
  name: 'Sung Hyun Kim',
  title: 'Witch-Work',
  description:
    'I have a dual major in Mechanical Engineering and Computer Science at Sogang University. ' +
    'I often go by the nickname `Witch`. ' +
    'I am not someone who possesses any grand meaning in life. ' +
    'I have come this far by following the light emitted by wonderful people, ' +
    'and I hope to continue living this way in the future. ' +
    'It is an honor to share this space with you who have come here.',
  picture: '/witch.jpeg',
  url: 'https://witch.work/',
  social: {
    github: 'witch-factory'
  }
};

export default blogConfig;
```

Now, let's insert my name into the footer. To use an absolute path, add `"baseUrl": "."` to the `compilerOptions` in the root `tsconfig.json`. It's not mandatory, but it makes things more convenient.

```tsx
// src/components/footer/index.tsx
import blogConfig from 'blog-config';

function Footer() {
  return (
    <footer>
      © {blogConfig.name}, Built with NextJS, 2023
    </footer>
  );
}

export default Footer;
```

# 3. Profile Component

Now, let's create a component for my introduction, which will contain a picture, a brief introduction, and links. The creation of the `blog-config.ts` serves this very purpose.

Create a folder `src/components/profile` and then make an `index.tsx` file. I believe this section can exist independently, hence the use of the `<article>` tag.

```tsx
// src/components/profile/index.tsx
import blogConfig from 'blog-config';
import Image from 'next/image';
import Link from 'next/link';

function Profile() {
  return (
    <article>
      <Image src={blogConfig.picture} alt={`${blogConfig.name}'s profile picture`} width={100} height={100} />
      <h2>{blogConfig.name}</h2>
      <p>{blogConfig.description}</p>
      <ul>
        <li>
          <Link href={`https://github.com/${blogConfig.social.github}`} target='_blank'>
            Github
          </Link>
        </li>
      </ul>
    </article>
  );
}

export default Profile;
```

# 4. Article Category Component

On the main page of the blog, I would like to preview a few articles categorized by subject in a card format. This component will be referred to as the article category component.

What should this component look like? Let's think about which props it should receive for reusability.

Since we need information about the subject category, we should first take the article subject as a prop. Furthermore, we need to provide the list of articles related to that subject for rendering. So, what information should each article preview in the article category?

While there may be additional information later (particularly view counts), for now, we will include the article title, a brief description, and the article creation date. Since blog articles will be stored in markdown files, this information will also be included in the meta data of the markdown files. Therefore, we can structure the HTML accordingly.

![article-category](./article-category.png)

While I believe tags should also be part of the metadata, I do not think it needs to be shown in the article preview, so it will be excluded from consideration here. However, it could be added later when designing the props structure and type.

Let’s proceed to create the ArticleCategory component. The HTML structure is envisioned as follows.

![article-category-html](./article-category-html.png)

## 4.1. Article Card Component

First, let's create a component that displays a brief overview of an article in a card format. I suspect that there will be a future need to reuse this card, so let’s name it something more general: create `components/card/index.tsx`.

This component will utilize the `<article>` tag. According to [MDN's article documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article), using the `<article>` tag for individual articles in the blog post list aligns perfectly.

The prop `url` specifies the link where this card will redirect upon being clicked.

```tsx
// src/components/card/index.tsx
import Link from 'next/link';

interface Props {
  title: string;
  description: string;
  date: string;
  url: string;
}

function Card(props: Props) {
  const { title, description, date, url } = props;
  return (
    <article>
      <Link href={url}>
        <h3>{title}</h3>
        <p>{description}</p>
        <time>{date}</time>
      </Link>
    </article>
  );
}

export default Card;
```

## 4.2. Article Category Component

Now, let's create the article category component as per the designed structure. Since its main function is to group the cards, let’s give it a generic name of `Category`.

```tsx
import Card from '../card';

interface CardProps {
  title: string;
  description: string;
  date: string;
  url: string;
}

interface Props {
  title: string;
  items: CardProps[];
}

function Category(props: Props) {
  return (
    <section>
      <h2>{props.title}</h2>
      <ul>
        {
          props.items.map((item, index) => {
            return (
              <li key={index}>
                <Card title={item.title} description={item.description} date={item.date} url={item.url} />
              </li>
            );
          })
        }
      </ul>
    </section>
  );
}

export default Category;
```

# 5. Project Introduction Component

I also want to include introductions to the projects I've undertaken on the blog. Although I don’t have much to include right now, I will fill it in as I go! For now, envisioning the project introduction component, I think it should look like this.

![project-layout](./project-layout.png)

To achieve this, let's first modify the Card component so that it can display images, and create an appropriately accommodating Category component.

## 5.1. Improving the Card Component

We will update it to receive the URL of the image as a prop. If an image URL is provided, it should render the image.

```tsx
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  title: string;
  description: string;
  image?: string;
  date: string;
  url: string;
}

function Card(props: Props) {
  const { title, description, image, date, url } = props;
  return (
    <article>
      <Link href={url}>
        {
          image ? <Image src={image} alt={`${title} image`} width={50} height={50} /> : null
        }
        <h3>{title}</h3>
        <p>{description}</p>
        <time>{date}</time>
      </Link>
    </article>
  );
}

export default Card;
```

Since `image` might not always be present, it is denoted as `image?: string`. The Image component will only be rendered if an image prop is supplied; otherwise, there are no other modifications.

## 5.2. Improving the Category Component

The changes here are just to allow it to accept `image`, with no other modifications needed.

```tsx
import Card from 'src/components/card';

interface CardProps {
  title: string;
  description: string;
  image?: string;
  date: string;
  url: string;
}

interface Props {
  title: string;
  items: CardProps[];
}

function Category(props: Props) {
  return (
    <section>
      <h2>{props.title}</h2>
      <ul>
        {
          props.items.map((item, index) => {
            return (
              <li key={index}>
                <Card 
                  title={item.title} 
                  description={item.description} 
                  image={item.image} 
                  date={item.date} 
                  url={item.url} 
                />
              </li>
            );
          })
        }
      </ul>
    </section>
  );
}

export default Category;
```

# 6. Specifying Metadata

Now, let's specify the page metadata, which is generally done using the `<head>` tag (in NextJS, this is done with the Head component). I plan to refine this metadata intensively during the SEO process, so I will keep it simple for now.

We will bring in the title and description metadata from `blog-config.ts`, and I made a favicon. I generated a simple favicon with the text `Witch` using [favicon.io](https://favicon.io/favicon-generator/).

![witch-favicon](./favicon.ico)

The Head tag with the title, favicon, and canonical data will look like this:

```tsx
<Head>
  <title>{blogConfig.title}</title>
  <meta name='description' content={blogConfig.description} />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
  <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
  <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
  <link rel='manifest' href='/site.webmanifest' />
  <link rel='canonical' href='https://witch.work/' />
</Head>
```

# 7. HTML Construction Result

The main page will be structured approximately as follows. Of course, the common structure shared with other pages will be extracted, and there will likely be more changes with CSS and so forth, but I will strive to maintain this semantic structure.

```tsx
<main>
  <Header navList={navList}/>
  <Profile />
  <h1>Welcome to My Blog</h1>
  {/* Project list exists independently */}
  <article>
    <Category title={projectList.title} items={projectList.items} />
  </article>
  {/* Article list exists in an independent area */}
  <article>
    <Category title={postList.title} items={postList.items} />
    <Category title={postList.title} items={postList.items} />
  </article>
  <Footer />
</main>
```

Keeping to this structure while thinking about CSS is already making my head spin, but fortunately, there is still work to be done. We need to ensure that articles are statically generated when writing them in the blog, meaning we need to set up pre-rendering. Let's tackle that before styling. 

# References

The article tag is suitable for the card component I want. https://stackoverflow.com/questions/43953026/element-for-a-card-card-container-in-html5

Searching functionality: https://medium.com/frontendweb/build-the-search-functionality-in-a-static-blog-with-next-js-and-markdown-33ebc5a2214e
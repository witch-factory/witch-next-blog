---
title: Creating a Blog - 7. Main Page Component Design
date: "2023-05-26T01:00:00Z"
description: "Let's write the CSS for the main page."
tags: ["blog", "web"]
---

# Blog Creation Series

| Title | Link |
|---|---|
| 1. Basic Settings | [https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1) |
| 2. HTML Design of the Main Page | [https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2) |
| 3. Structure Design of the Detailed Writing Page | [https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3) |
| 4. Enabling Relative Paths for Images | [https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4) |
| 5. Minor Page Structure Improvements and Deployment | [https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5) |
| 6. Layout Design of Page Elements | [https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6) |
| 7. Main Page Component Design | [https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7) |
| 8. Design of Writing List/Content Page Components | [https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8) |
| 9. Automatically Generating Writing Thumbnails | [https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9) |
| 10. Design Improvements for Fonts and Cards | [https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10) |
| 11. Adding View Counts to Writings | [https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11) |
| 12. Page Themes and Writing Search Functionality | [https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12) |
| 13. Improvements to Theme Icons and Thumbnail Layouts | [https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13) |
| 14. Changing Writing Classification to Tag-Based | [https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14) |
| Main Page Operational Optimization | [https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1) |
| Creating Writing List Pagination | [https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2) |
| Uploading Images to CDN and Creating Placeholders | [https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3) |
| Implementing Infinite Scroll on Search Page | [https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4) |

I am not a designer, but I have documented the process of creating the main page as best as I can. Since I do not have the capacity to control elaborate designs, I have tried not to overly embellish it.

# 0. Color Definition

Before that, let's define color variables in `styles/globals.css`. I used the gray and indigo colors from [Open Color](https://yeun.github.io/open-color/).

I also added CSS to remove the default body margin of 8px.

```css
// styles/globals.css
:root{
  --white:#fff;

  --gray0:#f8f9fa;
  --gray1:#f1f3f5;
  --gray2:#e9ecef;
  --gray3:#dee2e6;
  --gray4:#ced4da;
  --gray5:#adb5bd;
  --gray6:#868e96;
  --gray7:#495057;
  --gray8:#343a40;
  --gray9:#212529;

  --indigo0:#edf2ff;
  --indigo1:#dbe4ff;
  --indigo2:#bac8ff;
  --indigo3:#91a7ff;
  --indigo4:#748ffc;
  --indigo5:#5c7cfa;
  --indigo6:#4c6ef5;
  --indigo7:#4263eb;
  --indigo8:#3b5bdb;
  --indigo9:#364fc7;
}

body{
  margin:0;
}
```

# 1. Header Component

I will start with the header and footer, which are common to all pages.

After pondering while eating 부대찌개 (Buddae-jjigae), I thought of the following layout. Since the About section feels different from other board classifications, I am considering distinguishing it with a slightly different color. I am not a designer, but I have tried my best.

![header-layout](./header-layout.png)

## 1.1. Container

The header height seems most appropriate at 50px, considering harmony with other content. It must also be fixed at the top, so I used `position:sticky;` and `top:0`. The width is limited to `width:100%; max-width: 60rem;`. It is centered with `margin:0 auto`.

Set the background color to white and specified a light gray bottom border for differentiation from other content.

```css
.header{
  height:50px;
  position:sticky;
  top:0;
  width:100%;
  max-width:60rem;
  margin:0 auto;
  background-color:#FFFFFF;
  border-bottom:1px solid var(--gray3);
}
```

Next is the nav component within the header component. The menu items will be placed here, but if we set the width to 100%, the navigation will look too snug against both sides. Therefore, it will be set to `width:92%`.

Moreover, internal elements need to be focused toward the sides in both mobile and PC environments (the bulletin board menus will later be enclosed in div boxes). Thus, flex is set to space-between. The height is, of course, 100%, margin 0 auto.

```css
.header__nav{
  width:92%;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  height:100%;
  margin:0 auto;
}
```

## 1.1. Home Button

Next, let’s create the home button. Create `index.tsx` and `styles.module.css` in `src/components/header/homeButton`.

The structure of the HomeButton component in index.tsx is as follows. A simple structure with a div inside the link, containing an image and text.

```tsx
import Image from 'next/image';
import Link from 'next/link';

import blogConfig from 'blog-config';

import styles from './styles.module.css';

function HomeButton() {
  return (
    <Link href='/' aria-label='Home' className={styles.link}>
      <div className={styles.container}>
        <Image src='/witch-hat.svg' alt='logo' width={40} height={40} />
        {blogConfig.title}
      </div>
    </Link>
  );
}

export default HomeButton;
```

To ensure the link has width and height, it is set to block and sized to fit the content. Also, any default styles white should be removed, and some padding added with a light gray background color on hover.

```css
.link{
  text-decoration:none;
  color:#000;
  display:block;
  width:fit-content;
  padding:5px;
}

.link:hover{
  background:var(--gray2);
}
```

Next, set flex for the internal elements of the home button and make width and height 100%. Vertical alignment is centered, with a gap of 5px between the internal elements.

```css
.container{
  display:flex;
  flex-direction:row;
  align-items:center;
  gap:5px;
  width:100%;
  height:100%;
  font-size:24px;
}
```

The image for the header is borrowed from [Pixabay by searching for a witch hat](https://pixabay.com/vectors/magician-wizard-hat-magic-mystery-41104/).

## 1.2. Navigation Menu

The largest challenge in the header component. In narrow screen widths, a dropdown menu should be displayed, while a normal menu should be shown for wider widths.

First, create `index.tsx` and `styles.module.css` in `src/components/header/menu`.

The layout concerns in this navigation are as follows:

1. Container
2. Toggle Button for the Dropdown Menu
3. The Dropdown Menu itself

So, the container needs nothing special; just set its size to fit the content.

```css
.container{
  display:flex;
  flex-direction:column;
  width:fit-content;
  height:100%;
  font-size:20px;
}
```

Now let’s create the button. Create `index.tsx` and `styles.module.css` in `menu/toggler`.

In fact, there is not much style to give the button. Just remove borders and backgrounds, set an appropriate width and height, and provide a light gray background color on hover.

```css
// src/components/header/menu/toggler/styles.module.css
.button{
  border:none;
  background:transparent;
  width:50px;
  height:100%;
}

.button:hover{
  cursor:pointer;
  background:var(--gray2);
}
```

Next, we will write a component to include the icon to place inside the button. Although I initially intended to use `react-icons`, I did not want to install a package with a size of 55MB for icons that would not be used often, so I just found a suitable SVG image.

Also, since the icon should depend on whether the menu is open or closed, it will receive props for the open state and toggle function.

```tsx
import Image from 'next/image';

import styles from './styles.module.css';

function Toggler({isMenuOpen, toggle}:{isMenuOpen: boolean, toggle: () => void}) {
  return (
    <button className={styles.button} onClick={toggle}>
      <Image
        src={isMenuOpen?'/cancel-32x32.svg':'/hamburger-32x32.svg'} 
        alt='Menu' 
        width={32} 
        height={32} 
      />
    </button>
  );
}

export default Toggler;
```

Now, let's create the main dropdown menu. Create `index.tsx` and `styles.module.css` in `menu/dropdown`.

What should we do here? First, we need to show the menu. Moreover, in mobile environments, the menu should appear in dropdown format while on PC, it should display normally. The visibility should depend on whether the menu is open or closed.

Thus, we should pass navList and isMenuOpen as props to the Dropdown component. Let's structure it as follows.

```tsx
// src/components/header/menu/dropdown/index.tsx
import Link from 'next/link';

import styles from './styles.module.css';

interface PropsItem{
  title: string;
  url: string;
}

function Dropdown({navList, isMenuOpen}:{navList: PropsItem[], isMenuOpen: boolean}) {
  return (
    <ul>
      {navList.map((item) => {
        return (
          <li key={item.title}>
            <Link
              href={item.url} 
              aria-label={item.title} 
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default Dropdown;
```

Since we are using CSS modules, we will assign simple class names like list, link, item that will only be used here. Additionally, we will apply different class names based on whether the menu is open using isMenuOpen.

```tsx
function Dropdown({navList, isMenuOpen}:{navList: PropsItem[], isMenuOpen: boolean}) {
  return (
    <ul className={`${styles.list} ${isMenuOpen?styles['list--active']:styles['list--inactive']}`}>
      {navList.map((item) => {
        return (
          <li key={item.title} className={styles.item}>
            <Link
              href={item.url} 
              aria-label={item.title} 
              className={styles.link}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
```

CSS is set up as follows, with brief descriptions in comments for each.

```css
// src/components/header/menu/dropdown/styles.module.css
/*
In mobile environments, a vertical array. Remove bullet points and padding, and give a white background with a gray border.
Set position to absolute since the header height is fixed at 50px to position it below that.
*/
.list{
  width:100%;
  flex-direction:column;
  list-style:none;
  padding:0;
  margin:0;
  background-color:white;
  border:1px solid var(--gray2);
  box-sizing:border-box;
  position:absolute;
  top:50px;
  left:0;
}

/* When the menu is open, display flex; otherwise hide it */
.list--active{
  display:flex;
}

.list--inactive{
  display:none;
}

/* Remove the default styling of links and allow sizing to be possible by setting to block.
Furthermore, in mobile environments, provide slight indentation and center align. */
.link{
  text-decoration:none;
  color:#000;
  display:block;
  width:100%;
  height:40px;
  text-indent:30px;
  line-height:35px;
}

// Simply make the background gray on hover
.link:hover{
  background:var(--gray2);
}

// For screens with a width of 640px or more
@media (min-width:640px){
  /*
  In wide screens, there's no need for a dropdown menu, so set horizontal layout.
  Now that it's not in dropdown format, set the default position to static and remove the border.
  */
  .list{
    flex-direction:row;
    height:100%;
    position:static;
    border:none;
  }
  /* When not in dropdown format, fixed width */
  .item{
    width:60px;
  }
  /* In wide screens, the menu should always be displayed. */
  .list--active{
    display:flex;
  }

  .list--inactive{
    display:flex;
  }
  /* Appropriate sizing and text alignment for horizontal layout */
  .link{
    width:60px;
    height:100%;
    text-indent:0;
    line-height:50px;
    text-align:center;
  }
}
```

## 1.3. Close Dropdown on Page Navigation

However, there is a problem. NextJS supports client-side navigation, so components do not rerender when navigating between pages. Since we placed the header common to all pages in `_app.js`, the `isMenuOpen` state of the header will not change as the page navigates!

This means that if the menu is opened in a mobile environment and the user moves to another page, the menu stays open.

To solve this, I referred to the router events section from the [NextJS documentation](https://nextjs.org/docs/pages/api-reference/functions/use-router#routerevents).

Let’s use `useEffect` and NextJS's provided `useRouter`. When the router changes and the component unmounts, we will make `isMenuOpen` false.

```tsx
/* src/components/header/menu/index.tsx */

function Menu({navList}:{navList: PropsItem[]}) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const router=useRouter();

  useEffect(()=>{
    return router.events.on('routeChangeStart', ()=>setIsMenuOpen(false));
  }, [router]);

  return (
    <div className={styles.container}>
      <Toggler isMenuOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
      <Dropdown navList={navList} isMenuOpen={isMenuOpen} />
    </div>
  );
}
```

## 1.4. Modifying Navigation Menu Logic

After this, I noticed that the menu in the header was labeled Home, CS, Front, Misc, and About. Each of these names is used to create their respective category pages, and they are managed in `blog-category.ts`.

However, I did not like these names much. I wanted to remove Home, which is not a problem because I can simply edit `blog-category.ts`.

Additionally, I wanted the header menu to use Korean, just as with the word ‘Development’. Therefore, I modified `blog-category.ts` accordingly. Then I renamed the folder “front” in posts to “dev”.

```ts
// blog-category.ts
interface Category{
  title: string;
  url: string;
}

const blogCategoryList: Category[] = [
  {title:'CS', url:'/posts/cs'},
  {title:'개발', url:'/posts/dev'},
  {title:'기타', url:'/posts/misc'},
  {title:'소개', url:'/about'},
];

export default blogCategoryList;
```

This will initially cause an issue in the dynamic route creation at `/pages/posts/[category]/index.tsx`. This happens because `category.title` is changed. Therefore, let’s modify it so that dynamic routes are created based on `url` instead of `title`.

We can split the `url` using `/` and take only the last element.

```tsx
// pages/posts/[category]/index.tsx의 getStaticPaths
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
```

Also, during filtering to show writings by category on the main page, replace the use of `category.title` with `category.url`.

![filtering-edited](category-filtering-edited.png)

# 2. Footer Component

Let's add the footer, which will include my name and a link to my GitHub. For this, I downloaded the logo from [GitHub logos page](https://github.com/logos).

```tsx
import Image from 'next/image';
import Link from 'next/link';

import blogConfig from 'blog-config';

import styles from './styles.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
      © {blogConfig.name}, Built with NextJS, 2023
      </p>
      <Link href='https://github.com/witch-factory' className={styles.github}>
        <Image src='/github-mark.png' alt='Github' width={32} height={32} />
      </Link>
    </footer>
  );
}

export default Footer;
```

The styles were adjusted slightly for spacing and background.

```css
.footer{
  height:100px;
  color:var(--gray6);
  background-color:var(--gray2);
  margin-top:50px;
  padding:20px;
}

.copyright{
  margin:10px 0;
}

.github{
  display:block;
  width:32px;
  height:32px;
}
```

# 3. Intro Component

## 3.1. Adjusting Page Width

Previously, we had limited the container width for the blog content with `max-width`. However, this means that internal content will fill that container completely. What if the window width is smaller than `max-width`? The content will fill the page width without any margins. This is not ideal.

Therefore, create another container with `width:92%` and `margin:0 auto;`.

```css
// pages/styles.module.css
.container{
  width:92%;
  margin:0 auto;
}
```

Next, let's add the Intro component to the main page.

```tsx
// pages/index.tsx
<main className={styles.pagewrapper}>
  // Added a div container here.
  <div className={styles.container}>
    <Profile />
    {/* Create a list of projects */}
    {/* The writing list exists as an independent area */}
    <article>
      {blogCategoryList.map((category) => {
        const categoryPostList=allDocuments.filter((post)=>{
          return post._raw.flattenedPath.split('/')[0]===category.url.split('/').pop();
        }).slice(0, 3);
        if (categoryPostList.length===0) {
          return null;
        }
        return <Category key={category.title} title={category.title} items={categoryPostList} />;
      })
      }
    </article>
  </div>
</main>
```

Now let's create the Intro component, which will be displayed at the top of this page (excluding the header). Since we created this structure before, we will just style it.

We will split the self-introduction part that shows on both small and large screen widths into an Intro component by creating `src/components/profile/intro` with index.tsx and styles.module.css.

Then, write the index.tsx as follows. Previously, links were created individually, but we will modify it to automatically generate them using `Object.entries` so that we can display new links in the profile just by editing blog-config.ts.

```tsx
// src/components/profile/intro/index.tsx
import Link from 'next/link';

import blogConfig from 'blog-config';

import styles from './styles.module.css';

function Intro() {
  return (
    <div>
      <h2 className={styles.name}>{blogConfig.name}</h2>
      <p className={styles.description}>{blogConfig.description}</p>
      <ul className={styles.linklist}>
        {Object.entries(blogConfig.social).map(([key, value]) => (
          <li key={key}>
            <Link href={value} target='_blank' className={styles.link}>
              {key}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Intro;
```

Then, let's style the classes. The name will reduce its size and spacing a bit when the screen width decreases. The description will also have less line height when the screen width shrinks.

The links will be arranged horizontally with appropriate spacing and given a suitable color in the indigo spectrum.

```css
.name{
  margin:10px 0;
  font-size:1.2rem;
}

.description{
  margin:10px 0;
  word-break:keep-all;
}

.linklist{
  display:flex;
  flex-direction:row;
  list-style:none;
  padding-left:0;
  margin-bottom:0.5rem;
  gap:0 15px;
}

.link{
  text-decoration:none;
  color:var(--indigo6);
}

@media (min-width:768px){
  .name{
    font-size:1.5rem;
  }

  .description{
    line-height:1.5;
  }
}
```

After this, add the `Intro` component to the `Profile` component.

```tsx
// src/components/profile/index.tsx
function Profile() {
  return (
    <article className={styles.profile}>
      <Image 
        className={styles.image} 
        src={blogConfig.picture} 
        alt={`${blogConfig.name}의 프로필 사진`} 
        width={100} 
        height={100} 
      />
      {/* Simplified Intro component */}
      <Intro />
    </article>
  );
}
```

In the profile styles.module.css, make the photo appear circular, providing suitable spacing. A very light gray background is added to the entire self-introduction component, along with additional margins and rounded corners.

```css
.image{
  display:none;
  border-radius:50%;
  margin-top:20px;
  margin-right:20px;
}

.profile{
  background:var(--gray1);
  margin:20px 0;
  padding:10px 20px;
  border-radius:1rem;
}

@media (min-width:768px){
  .image{
    display:block;
  }

  /* On wider screens, display the photo and introduction side by side */
  .profile{
    display:flex;
    flex-direction:row;
  }
}
```

# 4. Project Component

Previously, I thought I could reuse the Card component for the project introduction, but the layout I had in mind changed. Therefore, it is better to create new components to show the projects. Consider what information should be included.

# 4.1. Layout Design

Currently, the information I think should be included consists of the project title, project description, project link (e.g., GitHub), and a project image.

Let's rename the `src/components/projects` to `projectList` and get to work. The layout I envisioned is as follows.

![project-layout](./project-layout.png)

First, we create the `components/projectList/project` directory, along with index.tsx and styles.module.css, and make a suitable `Project` component constructed as an article. We will also need to create a project list container. But first, we need to create the project list.

We will create `blog-project.ts` in the root directory and write it as follows. The type will be exported for reuse in other places.

```ts
// /blog-project.ts
export interface projectType {
  title: string;
  description: string;
  image: string;
  url: {
    title: string;
    link: string;
  }[];
  techStack: string[];
}

const projectList: projectType[] = [
  {
    title: 'Witch-Work',
    description: 'Personal blog that I created and deployed on Cloudflare.',
    image: '/witch.jpeg',
    url: [
      {
        title: 'Github',
        link:'https://github.com/witch-factory/witch-next-blog'
      },
      {
        title: 'URL',
        link:'https://witch.work/'
      }
    ],
    techStack: ['Next.js', 'React', 'TypeScript']
  },
];

export default projectList;
```

## 4.2. Container Component

Since the project section can exist independently, we'll use the article tag. We'll just create a title and list. That's all.

```tsx
// src/components/projectList/index.tsx
import { projectType } from 'blog-project';
import projectList from 'blog-project';

import Project from './project';
import styles from './styles.module.css';

function ProjectList() {
  return (
    <article>
      <h2 className={styles.title}>Projects</h2>
      <ul className={styles.list}>
        {projectList.map((project: projectType) => {
          return (
            <li key={project.title}>
              <Project project={project} />
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default ProjectList;
```

The title should remove the bottom margin, the list should eliminate left-right margins and bullet points, and use grid display for two-column layouts when the screen is wider, with some spacing in between.

```css
.title{
  margin-bottom:0;
}

.list{
  list-style:none;
  padding:0;
}

@media (min-width: 768px) {
  .list{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    column-gap: 1rem;
  }
}
```

## 4.3. Project Introduction Component

Let's separate the project introduction and project image to create a new component for the project introduction (to include title, description, links, etc.). Create the `projectList/project/intro` folder and create index.tsx and styles.module.css within it.

Let’s structure it as follows. Although I wanted to avoid too many divs, in CSS, there's no way around it.

While it looks long, for meaning, it's just arranging the title, description, links, and tech stack (grouping links and tech stacks with ul).

```tsx
import Link from 'next/link';

import { projectType } from 'blog-project';

import styles from './styles.module.css';

function ProjectIntro({project}: {project: projectType}) {
  return (
    <div className={styles.intro}>
      <div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
      </div>
      <div>
        <ul className={styles.list}>
          {project.url.map((url) =>
            <li key={url.link}>
              <Link 
                className={styles.link} 
                href={url.link} 
                target='_blank'
              >
                {`${url.title} Link`}
              </Link>
            </li>
          )}
        </ul>
        <ul className={styles.list}>
          {project.techStack.map((tech) =>
            <li key={tech} className={styles.tech}>{tech}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ProjectIntro;
```

The styles are written as follows. Although my design sense is lacking, I did my best to choose colors and spacing.

```css
/* If the container's height is greater than the heights of the inner elements,
the title/description will be at the top, while links/tech stack will be at the bottom. */
.intro{
  display:flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Simply remove the default space for h3 and p tags,
and provide some space between the title and description. */
.title{
  margin: 0;
}

.description{
  margin: 0;
  margin-top:5px;
}

/* Use horizontal layout and provide spacing. */
.list{
  display: flex;
  flex-direction: row;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin-top:5px;
}

/* Set to block and provide some styling and spacing. */
.link{
  display:block;
  padding: 3px;
  border-radius: 5px;
  text-decoration: none;
  background-color: var(--indigo1);
  color: var(--indigo8);
}

.link:hover{
  background-color: var(--indigo2);
}

.tech{
  padding: 1.5px 3px;
  border-radius: 5px;
  background-color: var(--indigo9);
  color:var(--white);
  font-size: 0.8rem;
}
```

## 4.4. Folding Feature for Projects

Currently, although it looks fine on PC, on mobile, the project introductions are too long, requiring excessive scrolling to view posts. Thus, let’s keep project introduction cards folded by default and allow users to expand them by clicking a button.

![old-layout](./mobile-old-layout.png)

In the project component, create a div container for the title and expand button, and add the button. We’ll create an `open` state that toggles whenever the button is clicked.

```tsx
function ProjectList() {
  const [open, setOpen] = useState(false);

  const toggle = ()=>{
    setOpen(prev=>!prev);
  };

  return (
    <article>
    // This part changed
      <div className={styles.header}>
        <h2 className={styles.title}>Projects</h2>
        <button className={styles.toggle} onClick={toggle}>{open?'Fold':'Expand'}</button>
      </div>
      <ul className={`${styles.list} ${open?styles['list--open']:styles['list--close']}`}>
        {projectList.map((project: projectType) => {
          return (
            <li key={project.title}>
              <Project project={project} />
            </li>
          );
        })}
      </ul>
    </article>
  );
}
```

Then arrange the internal elements of the header horizontally and ensure they are positioned at both ends. Style the button similarly to project introduction URL links and give it an appropriate size. The toggle button should also not be visible if the site width exceeds a certain threshold, adding that in a media query.

```css
// src/components/projectList/styles.module.css
.header{
  display:flex;
  flex-direction:row;
  justify-content:space-between;
}

.title{
  margin:0;
}

.toggle{
  width:70px;
  height:30px;
  border:none;
  border-radius:5px;
  background:var(--indigo1);
  color:var(--indigo8);
}

.toggle:hover{
  background:var(--indigo2);
}

@media (min-width: 768px) {
  .toggle{
    display:none;
  }
}
```

Next, if the `open` state is false, we will show only one project. This can be implemented using CSS grid.

First, set the `list` class with grid layout and define it to have only one column with one row. In the `list--closed` class, set the `grid-auto-rows` property to 0 and overflow to hidden. This will treat any elements generating more than one row as overflowing and will hide them. Therefore, only one project introduction will be displayed.

Then, in the `list--open`, we revert `grid-auto-rows` to 1fr, allowing all elements to display properly. For screen widths above 768px, it should display two columns regardless of the open state.

```css
// src/components/projectList/styles.module.css
.list{
  list-style:none;
  padding:0;
  display:grid;
  grid-template-columns:1fr;
  grid-template-rows:1fr;
}

.list--open{
  grid-auto-rows:1fr;
}

.list--close{
  grid-auto-rows:0;
  overflow:hidden;
}

@media (min-width: 768px) {
  .list{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    grid-auto-rows:1fr;
    column-gap: 1rem;
  }

  .toggle{
    display:none;
  }
}
```

# 5. Writing Introduction Component

## 5.1. Category Component

This component does not have much to handle. Its main role is simply to arrange cards in a responsive layout, setting them horizontally for larger widths. We will use grid for this purpose.

```tsx
// src/components/category/index.tsx
import Card from 'src/components/card';

import styles from './styles.module.css';

interface CardProps{
  title: string;
  description: string;
  image?: string;
  date: string;
  tags?: string[];
  url: string;
}

interface Props{
  title: string;
  url: string;
  items: CardProps[];
}

function propsProperty(item: CardProps) {
  const { title, description, image, date, tags, url } = item;
  return { title, description, image, date, tags, url };
}

function Category(props: Props) {
  return (
    <section className={styles.container}>
      <h2>{props.title}</h2>
      
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

export default Category;
```

Thus, appropriate responsive layout and spacing can only be applied to the `list` class.

```css
// src/components/category/styles.module.css
.list{
  list-style:none;
  padding:0;
  display: grid;
  gap:1rem;
}

@media (min-width:768px){
  .list{
    grid-template-columns:repeat(3,1fr);
  }
}
```

## 5.2. Card Component

This `Card` component will also be used on each category page to present writing lists, so let’s think about its layout.

Let's first adjust the height. Right now, it is fixed to 150px, which may cause overflow issues for titles or descriptions. 

![card-overflow](./card-overflow.png)

Therefore, change the height to be dynamic instead. We can change the height in `components/card/styles.module.css` to 100%.

```css
// src/components/card/styles.module.css
.container{
  border: 1px solid var(--gray5);
  border-radius: 1rem;
  box-sizing: border-box;
  height:100%;
  display:flex;
  flex-direction:column;
}
```

For design convenience, we will split the content into a text section that serves as the true content of the post, by creating an Intro component in `src/components/card/intro` with index.tsx and styles.module.css.

Then, structure the `index.tsx` so that it plays the role of the overview (like previously). Assign appropriate class names during this process and then attach it to the `Card` component.

```tsx
// src/components/card/intro/index.tsx
import { toISODate, formatDate } from '@/utils/date';

import styles from './styles.module.css';

interface Props{
  title: string;
  description: string;
  date: string;
  tags: string[];
}

function Intro(props: Props) {
  const { title, description, date, tags } = props;
  const dateObj = new Date(date);
  return (
    <>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {tags.length ?
        <ul className={styles.tagList}>
          {tags.map((tag: string)=>
            <li key={tag} className={styles.tag}>{tag}</li>
          )}
        </ul> :
        null}
      <time dateTime={toISODate(dateObj)}>{formatDate(dateObj)}</time>
    </>
  );
}

export default Intro;
```

The `toISODate` and `formatDate` functions are utilized here and are defined in `src/utils/date.ts`. The content for these functions is below.

```ts
// src/utils/date.ts
export const toISODate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};
```

Now, let’s attach the Intro component to the Card component.

```tsx
// src/components/card/index.tsx
import Image from 'next/image';
import Link from 'next/link';

import Intro from './intro';
import styles from './styles.module.css';

interface Props{
  title: string;
  description: string;
  image?: string;
  date: string;
  tags: string[];
  url: string;
}

function Card(props: Props) {
  const { title, description, image, date, tags, url } = props;
  return (
    <article className={styles.container}>
      <Link className={styles.link} href={url}>
        {image ?
          <Image src={image} alt={`${title} 사진`} width={50} height={50} /> : 
          null
        }
        {/* This part is now handled by the Intro component. */}
        <Intro title={title} description={description} date={date} tags={tags} />
      </Link>
    </article>
  );
}

export default Card;
```

The styles for the card will be as follows. Simple borders and spacing should suffice along with a color scheme. Assign dimensions to the link component as well to make it block-level.

```css
// src/components/card/styles.module.css
.container{
  border: 1px solid var(--gray5);
  border-radius: 1rem;
  box-sizing: border-box;
  height:100%;
  display:flex;
  flex-direction:column;
}

.link{
  display:block;
  height:100%;
  padding:1rem;
  text-decoration:none;
  color:var(--black);
}

.link:hover{
  color:var(--indigo6);
}
```

The styling for the Intro component gives it spacing. Remove the default spacing of the title and description tags and provide new spacing. Adjust the size of the text. The tags will be arranged horizontally with the same design as the tech stack blocks in the project description area, but with added margins.

```css
// src/components/card/intro/styles.module.css
.title{
  font-size:1.2rem;
  margin:0;
  margin-bottom:10px;
}

.description{
  font-size:1rem;
  margin:0;
  margin-bottom:10px;
}

.tagList{
  display:flex;
  flex-wrap:wrap;
  margin:0;
  padding:0;
  list-style:none;
  gap:5px;
}

.tag{
  background-color:var(--indigo6);
  color:var(--white);
  border-radius:5px;
  font-size:0.8rem;
  margin:0;
  margin-bottom:5px;
  padding:3px 8px;
}
```

## 5.3. Sorting by Writing Date

Currently, the writings displayed on the main page are not sorted by date. The same applies to each category page. Let’s sort these writings by date during retrieval. 

Previously, we used `allDocuments` to fetch writings, so we will create a function that sorts `allDocuments` by date and substitute this wherever `allDocuments` has been used.

Create `src/utils/post.ts`, then let’s write the `getSortedPosts` function.

```ts
// src/utils/post.ts
import { allDocuments } from 'contentlayer/generated';

export const getSortedPosts = () => {
  return allDocuments.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};
```

Now, replace each instance of `allDocuments` with `getSortedPosts()`.

## 5.4. Adding Spacing to Intro

However, while adjusting the screen width on `Card` components, an issue arises. The title and description heights can differ based on their lengths, causing misalignment with the tags and date.

![card-not-aligned](./card-not-aligned.png)

This can be resolved by providing spacing in the `Intro` component of the `Card` component. Add a styles.module.css to the `Card` component's `Intro` component.

```css
// src/components/card/intro/styles.module.css
.container{
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  height:100%;
}
```

The Intro component should be enclosed with a div of the class container, and the tags along with time should be surrounded by another div.

```tsx
function Intro(props: Props) {
  const { title, description, date, tags } = props;
  const dateObj = new Date(date);
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div>
        {tags.length ?
          <ul className={styles.tagList}>
            {tags.map((tag: string)=>
              <li key={tag} className={styles.tag}>{tag}</li>
            )}
          </ul> :
          null}
        <time dateTime={toISODate(dateObj)}>{formatDate(dateObj)}</time>
      </div>
    </div>
  );
}
```

# 6. Minor Improvements

Do we really need borders around both the project introductions and writing previews (`Card` component)? Let's remove anything unnecessary.

Edit the `src/components/projectList/project/styles.module.css` to remove the borders and expand spacing a bit.

Images that were originally displayed with `border-radius:50%` should only be slightly rounded.

```css
// src/components/projectList/project/styles.module.css
.container{
  display: flex;
  flex-direction: row;
  gap:1rem;
  /*border: 1px solid var(--gray5);
  border-radius: 1rem;*/
  box-sizing: border-box;
  padding:15px;
  margin-bottom: 1rem;
  min-height:150px;
}

.image{
  border-radius:1rem;
}

@media (min-width: 768px) {
  .container{
    padding: 10px;
  }

  .image{
    display: block;
  }
}
```

Now, edit `src/components/card/styles.module.css` to remove the container borders and add a background color on hover.

```css
.container{
  /*border: 1px solid var(--gray5);*/
  border-radius: 1rem;
  box-sizing: border-box;
  height:100%;
  display:flex;
  flex-direction:column;
}

.link{
  display:block;
  height:100%;
  padding:1rem;
  text-decoration:none;
  color:var(--black);
}

.link:hover{
  border-radius: 1rem;
  color:var(--indigo6);
  background-color:var(--gray1);
}
```

It may be an illusion, but it seems that removing the border lines makes the interface appear tidier.

# 7. Next Story

The `Card` component will be used not only on the main page but also to show writing lists on category pages. Since these cards will show one at a time, they will occupy quite a wide space.

I plan to improve understanding of the writings by including thumbnails and reduce the width of each line to enhance user focus.

However, this will require multiple tasks, so I'll take care of other pages first before addressing that. Just the writing list page and the detailed writing page, but I’ll take a look.

# References

I have referenced the design of the Toss technology blog heavily. I believe not many companies prioritize UI as much as Toss does. https://toss.tech/tech

Witch hat image source: https://pixabay.com/vectors/magician-wizard-hat-magic-mystery-41104/

Use `useRouter` from NextJS for page navigation detection: https://nextjs.org/docs/pages/api-reference/functions/use-router#routerevents

Created the component for displaying projects with the help of this reference.
https://portfolio-kagrin97.vercel.app/portfolio

Used during the project to increase indentation in VSCode according to the folder structure in the code. https://thenicesj.tistory.com/35

Reference for implementing folding using CSS grid: https://stackoverflow.com/questions/63184642/display-only-one-row-and-hide-others-in-css-grid
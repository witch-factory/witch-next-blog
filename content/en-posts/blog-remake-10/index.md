---
title: Creating a Blog - 10. Font, Project Introduction, Tags
date: "2023-06-01T00:00:00Z"
description: "Font changes and detailed design of the project introduction card"
tags: ["blog", "web"]
---

# Blog Creation Series

|Title|Link|
|---|---|
|1. Basic Settings|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Design of Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structural Design of Post Detail Page|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Enabling Relative Path for Images|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Minor Page Improvement and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Element Placement Design|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Main Page Component Design|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Post List/Content Page Component Design|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatic Thumbnail Generation for Posts|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements to Font, Card Design, etc.|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Adding View Counts to Posts|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Themes and Post Search Functionality|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Improvements to Theme Icons and Thumbnail Layouts|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Changing Post Categories to Tag-Based|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Optimization of Main Page Operations|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Creating Pagination for Post List|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Uploading Images to CDN and Creating Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implementing Infinite Scroll on Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

# 1. Changing the Font of Code in Post Content

Some settings from Prism were used. Edit `/src/pages/[category]/[slug]/content.module.css`.

```css
.content :is(pre,code){
  //font-family:monospace, Pretendard, apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-family: 'Fira Code', Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.5;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  /* Options for dot merging */
  font-variant-ligatures: none;
  font-size:1rem;
  overflow:auto;
}
```

# 2. Project Card Design

The current design and layout of project cards are as follows. They are arranged in two columns when the screen is wide and in one column when narrow.

![project-old-layout](./project-old-layout.png)

On mobile, it appears as follows.

![project-old-layout-mobile](./project-old-layout-mobile.png)

There are several issues with this design:

1. The sizes of project images and text boxes do not match.
2. Clicking on a card does not intuitively lead to the project page; instead, there is a separate link button.
3. The arrangement is simply a grid, which lacks visual interest. (This is not a concern on mobile.)

I found several reference pages, and a layout from the main page of Lush looked good.

![lush-card-layout](./lush-card-layout.png)
Source: [Lush Official Site](https://www.lush.co.kr/)

The cards themselves are made clickable (though not necessarily the entire card), and different heights of images are used for visual variation. Additionally, they are arranged in a single line.

Let's replicate this approach, but only when the screen is wide. A horizontal one-row layout seems to reduce visibility when the screen is narrow.

## 2.1. Making the Cards Clickable

Since the layouts for mobile and PC will be different, let’s first modify the common characteristics of both sections. Begin by making the entire card clickable.

Remove the existing link. Simply eliminate the link list section and the div that wraps the link block and tech stack block.

```tsx
// src/components/projectList/project/intro/index.tsx
function ProjectIntro({project}: {project: projectType}) {
  return (
    <div className={styles.intro}>
      <div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
      </div>
      <ul className={styles.list}>
        {project.techStack.map((tech) =>
          <li key={tech} className={styles.tech}>{tech}</li>
        )}
      </ul>
    </div>
  );
}
```

Then, make the `Project` component a link so that the entire card becomes clickable, using the first link from `project.url`.

```tsx
function Project({project}: {project: projectType}) {
  return (
    <Link className={styles.wrapper} href={project.url[0].link} target='_blank'>
      <article className={styles.container} > 
        <div className={styles.imagebox}>
          <Image
            className={styles.image}
            src={project.image} 
            alt={project.title}
            width={200}
            height={200}
          />
        </div>
        <ProjectIntro project={project} />
      </article>
    </Link>
  );
}
```

## 2.2. Changing Project Layout

The layout of the project list used to arrange items in two columns when the screen was wide. We will change it to display in a single horizontal line. Edit the media query in `/src/components/projectList/styles.module.css` where the number of columns is specified.

```css
// /src/components/projectList/styles.module.css
@media (min-width: 768px) {
  .list{
    display:grid;
    /* Change the number of columns from 2 to 4 */
    grid-template-columns:repeat(4,1fr);
    grid-auto-rows:1fr;
    row-gap:1rem;
    column-gap:1rem;
  }

  .toggle{
    display:none;
  }
}
```

## 2.3. Changing Project Introduction Layout

Referring to the official Lush page, I have thought of an individual project card layout. The `project` component design has also been changed.

![project card layout](./project-card-layout.png)

First, separate the `project` component into its own folder. Move the `src/components/projectList/project` folder to `src/components/`, rename it to `projectCard`, and create new folders named `image`, `title`, and keep the `intro` folder within it. Create `index.tsx` and `styles.module.css` files inside each.

After creating each separate element, let’s construct the overall `projectCard` layout. Start with the simplest element, the `title`. Just use a single h3 tag.

```tsx
// src/components/projectCard/title/index.tsx
import styles from './styles.module.css';

function Title({title}: {title: string}) {
  return (
    <h3 className={styles.title}>{title}</h3>
  );
}

export default Title;
```

The style will simply remove the margin.

```css
// src/components/projectCard/title/styles.module.css
.title{
  margin: 0;
}
```

Now, let's edit the intro. The design for the tech stack block does not need to change. The structure remains the same.

```tsx
function ProjectIntro({project}: {project: projectType}) {
  return (
    <div className={styles.intro}>
      <p className={styles.description}>{project.description}</p>
      <ul className={styles.list}>
        {project.techStack.map((tech) =>
          <li key={tech} className={styles.tech}>{tech}</li>
        )}
      </ul>
    </div>
  );
}
```

Remove the unused `link` class since the card itself has become a link, and for narrow screen widths, arrange the description and tech stack sections with `space-between`, while keeping them close together on wider screens. The design for the tech stack block is adjusted to a lighter color so it draws less attention.

```css
// src/components/projectCard/intro/styles.module.css
.intro{
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  height:100%;
}

.description{
  margin: 0;
  margin-top:5px;
  width:100%;
}

.list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin-top:5px;
}

.tech{
  padding: 1.5px 3px;
  border-radius: 5px;
  background-color: var(--indigo0);
  color:var(--indigo6);
  font-size: 0.8rem;
}

@media (min-width:768px){
  .intro{
    justify-content: flex-start;
    height:100%;
  }
}
```

Next, let’s separate the image component. We will use `next/Image`, which requires specifying the width and height but also supports adjusting size through CSS styling. 

The component structure will be straightforward, receiving the image source and project title to use in the alt text. The width and height will be fixed at 300x300 since we will define its size in CSS later.

```tsx
import Image from 'next/image';

import styles from './styles.module.css';

function ProjectImage({title, image}: {title: string, image: string}) {
  return (
    <div className={styles.container}>
      <Image
        className={styles.image}
        src={image} 
        alt={`${title} project photo`}
        width={300}
        height={300}
      />
    </div>
  );
}

export default ProjectImage;
```

For narrow screens, ensure the image appears square, while on wider screens, utilize `aspect-ratio:auto` to maintain the original aspect ratio.

```css
// src/components/projectCard/image/styles.module.css
.image{
  margin:0;
  object-fit: fill;
  width:120px;
  height:100%;
  aspect-ratio: 1/1;
}

.container{
  display: block;
  position: relative;
}

@media (min-width: 768px) {
  .container{
    display: block;
    position: relative;
    width:100%;
  }

  .image{
    display: block;
    margin:0;
    object-fit: contain;
    width:100%;
    height:auto;
    aspect-ratio: auto;
  }
}
```

Now, let's write the `projectCard`. Simply follow the planned layout accurately.

```tsx
// src/components/projectCard/index.tsx
function Project({project}: {project: projectType}) {
  return (
    <Link className={styles.wrapper} href={project.url[0].link} target='_blank'>
      <article className={styles.container} >
        <div className={styles.titlebox}>
          <ProjectTitle title={project.title} />
        </div>
        <div className={styles.imagebox}>
          <ProjectImage title={project.title} image={project.image} />
        </div>
        <div className={styles.introbox}>
          <ProjectIntro project={project} />
        </div>
      </article>
    </Link>
  );
}
```

Utilize grid display to set fixed rows and columns.

```css
// src/components/projectCard/styles.module.css
.wrapper{
  display:block;
}

.container{
  display: grid;
  grid-template-columns: min-content max-content;
  grid-template-rows: 25px;
  column-gap:1rem;
  box-sizing: border-box;
  height:120px;
  max-height:150px;
}

.container:hover{
  background-color: var(--gray1);
  border-radius: 1rem;
  color:var(--indigo6);
}

.titlebox{
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  height:100%;
}

.imagebox{
  grid-column: 1 / 2;
  grid-row: 1 / 3;
}

.introbox{
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

@media (min-width: 768px) {
  .container{
    flex-direction: column;
    grid-template-columns: 1fr;
    grid-template-rows: 35px min-content;
    min-height:18rem;
  }

  .titlebox{
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    height:100%;
  }

  .imagebox{
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }

  .introbox{
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }
}
```

To enhance the hover effect, remove the gray background and add a shadow effect that makes the image appear slightly lifted. Use the `box-shadow` property, along with margin, padding, and transition properties appropriately.

```css
// src/components/projectCard/styles.module.css
.wrapper{
  display:block;
  width:100%;
  height:100%;
}

.container{
  display: grid;
  grid-template-columns: min-content;
  grid-template-rows: 25px;
  column-gap:1rem;
  height:100%;
}

.container:hover{
  color:var(--indigo6);
}

/* Effect of shadow on hover for image box */
.container:hover .imagebox{
  margin-top: -3px;
  padding-bottom:3px;
  box-shadow: 3px 3px 5px var(--gray6);
  transition: all 0.3s ease-out;
}

.titlebox{
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  height:100%;
}

.imagebox{
  grid-column: 1 / 2;
  grid-row: 1 / 3;
  border-radius: 0.5rem;
  height:100%;
}

.introbox{
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

@media (min-width: 768px) {
  .container{
    flex-direction: column;
    grid-template-columns: 1fr;
    grid-template-rows: min-content min-content;
  }

  .titlebox{
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    height:100%;
  }

  .imagebox{
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }

  .introbox{
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }
}
```

Additionally, there was a problem with the project image positioned at the top being cropped with the `overflow:hidden` option when `margin-top:-3px` was applied during hover, affecting the visible project introduction when it was collapsed.

This can be resolved by adding padding to the image box on hover.

# 3. Tag Color

Currently, when displaying posts slightly on the main page, the tags are shown, but the individual colors of these tag blocks are too bold, attracting excessive attention. Change the background to a lighter color and set the text in a complementary deep navy color.

```css
// src/components/card/intro/styles.module.css
.tag{
  background-color:var(--indigo1);
  color:var(--indigo7);
  border-radius:5px;
  font-size:0.8rem;
  margin:0;
  margin-bottom:5px;
  padding:3px 8px;
}
```

# 4. h3 Tag Height Issue

The h3 tag was used for project titles, but there was a height discrepancy between Korean and English texts. When using h3 at 1.25rem, the height was 25.5px for Korean, whereas it was 23.5px for English.

Thus, the font used in the h3 tag for `projectCard/title` was changed from Pretendard to Roboto. This adjustment fixed the height at 24px.

```css
// src/components/projectCard/title/styles.module.css
.title{
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

@media (min-width: 768px) {
  .title {
    margin-bottom:10px;
  }
}
```

# References

Lush Official Website: https://www.lush.co.kr/

You can now wrap block elements with `<a>` tags, provided there are no interactive tags, such as buttons or links, contained within. [Source](https://stackoverflow.com/questions/1827965/is-putting-a-div-inside-an-anchor-ever-correct/1828032#1828032)

[Another Source](https://stackoverflow.com/questions/38367002/make-entire-article-tag-a-link)

Next.js Image Tag: [Documentation](https://nextjs.org/docs/app/api-reference/components/image#fill)

[Flexbox Child Height Issues](https://stackoverflow.com/questions/20959600/height-100-on-flexbox-column-child)

[Next Image Component Height Setting](https://stackoverflow.com/questions/65169431/how-to-set-the-next-image-component-to-100-height)
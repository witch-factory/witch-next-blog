---
title: Creating a Blog - 1. Basic Setup
date: "2023-05-19T01:00:00Z"
description: "The beginning of creating a new blog"
tags: ["blog", "web"]
---

# Blog Creation Series

|Title|Link|
|---|---|
|1. Basic Setup|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Design of the Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structural Design of the Article Detail Page|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Enabling Relative Path for Images|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Improvement of Minor Page Structure and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Layout Design of Page Elements|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Design of Main Page Components|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Design of Article List/Content Page Components|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatic Thumbnail Generation for Articles|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements for Fonts, Cards, etc.|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Adding View Counts to Articles|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Themes and Article Search Features|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Theme Icons and Thumbnail Layout Improvements|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Changing Article Classification to Tag-Based|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Main Page Calculation Optimization|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Creating Pagination for Article List|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Uploading Images to CDN and Creating Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implementing Infinite Scroll on the Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

# 1. Introduction

The illustration here was drawn using [excalidraw](https://excalidraw.com/) unless specified otherwise.

![self-made](./self-made.jpeg)

As of May 19, 2023, the blog I am currently writing is based on the gatsby-starter-lavender blog theme created by [Lee Changhee](https://xo.dev/).

However, this blog does not have all the functionalities I desire. Additionally, as I am not well-versed in Gatsby, there were limitations in adding custom features. Therefore, since I was looking to learn through a NextJS tutorial focused on creating a blog, I decided to create my own blog in the process.

The NextJS tutorial offers a guide to creating [this kind of blog](https://next-learn-starter.vercel.app/). I have already attempted to follow it.

However, I wish to add several desired features. The layout is inspired by [ambienxo](https://github.com/blurfx/ambienxo) and my existing blog theme. The NextJS tutorial also includes extensive discussions on the advantages of NextJS, but I will not transfer that content here as detailed explanations on code splitting are unnecessary for creating a blog.

While developing the blog, I made a conscious effort to provide explanations for my decisions when possible. There will certainly be moments where this is not feasible. For example, as I am not a designer, I may struggle to fundamentally explain "why this layout looks clean." However, I aim to ensure that responses to development-related questions, such as "Why did you use this library?" do not result in vague answers like "I just looked it up."

# 2. Layout

This is how I envision the homepage.

![home-layout](./new-home-layout.png)

And I hope the article viewing area will resemble the following.

![article-layout](./new-article-layout.png)

Of course, this may change gradually as I work on it.

# 3. Getting Started

Assuming Node is already installed, let’s first create a NextJS app.

```
npx create-next-app@latest
```

This will prompt several questions; I will choose to use TypeScript and not use Tailwind due to previous bad experiences at Soma... For now, I plan to use the default CSS Modules.

There is also a new App router available, but it reportedly has many bugs, so I selected "No" for the question about using the App router and will stick with the existing Page router.

Once the app is created, navigate to the folder and run `npm run dev` to start the app.

# 4. ESLint and Prettier

ESLint was set to install when the app was set up, so I need to install Prettier and the ESLint integration plugin. This plugin will disable rules that conflict with Prettier and add Prettier formatter rules to ESLint.

```
npm i -D prettier
npm i -D eslint-config-prettier eslint-plugin-prettier
```

Next, set ESLint as the default formatter in VSCode and configure it to format on save. Set format on save to true and default formatter to ESLint in settings.

The `.prettierrc` file should contain only basic settings, as the same content will be configured in ESLint.

```
{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": true
}
```

Since I will be using TS, I’ll install the corresponding ESLint plugins.

```
npm i -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

I will also install the ESLint plugin to remove unused imports.

```
npm i -D eslint-plugin-unused-imports
```

Now, let’s configure `.eslintrc`. The default `.eslintrc.json` looks like this:

```js
{
  "extends": ["next/core-web-vitals"]
}
```

First, let’s add the plugins we installed along with recommended settings.

```json
{
  "plugins": ["@typescript-eslint", "unused-imports"],
  "extends": ["next", "next/core-web-vitals", "prettier"],
}
```

Next, we will set the rules to establish the linter rules. Setting indent rules is necessary for automatic formatting. Let’s add the following rules.

Turn off the maximum line length limit, set indentation to 2 spaces, and ensure imports are properly sorted. Additionally, add spaces between reserved keywords and use single quotes. Only `.tsx` file names should be allowed. Also, disallow console output, prevent shadowing variables, enforce semicolons, and specify several other rules. I have adopted convenient defaults, but if additional needs arise while coding, I will modify these rules.

```json
"rules": {
  "no-unused-vars": "off",
  "max-len":"off",
  "indent":[
    "error",
    2
  ],
  "import/order": [
    "error",
    {
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      },
      "groups": [
        "builtin",
        "external",
        [
          "parent",
          "internal"
        ],
        "sibling",
        [
          "unknown",
          "index",
          "object"
        ]
      ],
      "pathGroups": [
        {
          "pattern": "~/**",
          "group": "internal"
        }
      ],
      "newlines-between": "always"
    }
  ],
  "jsx-quotes": [
    "error",
    "prefer-single"
  ],
  "keyword-spacing": "error",
  "quotes": [
    "error",
    "single",
    {
      "avoidEscape": true
    }
  ],
  "react/jsx-filename-extension": [
    "warn",
    {
      "extensions": [
        ".tsx"
      ]
    }
  ],
  "no-console": [
    "error",
    {
      "allow": [
        "warn",
        "error"
      ]
    }
  ],
  "react/no-unescaped-entities": "warn",
  "react/jsx-props-no-spreading": "off",
  "react/require-default-props": "off",
  "semi": "off",
  "space-before-blocks": "error",
  "no-shadow": "off",
  "@typescript-eslint/no-shadow": [
    "error"
  ],
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-unused-vars": "error",
  "@typescript-eslint/semi": [
    "error"
  ],
  "@typescript-eslint/type-annotation-spacing": [
    "error",
    {
      "before": false,
      "after": true,
      "overrides": {
        "colon": {
          "before": false,
          "after": true
        },
        "arrow": {
          "before": true,
          "after": true
        }
      }
    }
  ]
}
```

Since this isn't the core of coding, let's move on with this for now.

# 5. Creating Page Routes

The pages I consider necessary for the blog are as follows:

1. Main Page
2. Article List Page
3. My Introduction Page
4. Article Page

The article page will require dynamic routing for individual articles, so let's set that aside for now and create routes for the remaining pages.

In NextJS, components exported within the `pages` directory determine the application routes. For instance, a component exported from `pages/posts/index.tsx` can be accessed via the `/posts` path.

Thus, create `posts` and `about` folders within the `pages` directory, and create `index.tsx` files in each. Insert simple content into each component.

For example, it would look like this:

```tsx
// src/pages/about/index.tsx
function AboutPage() {
  return <h1>My Introduction Page</h1>;
}

export default AboutPage;
```

It seems we have completed the basic setup. In the next article, we will establish the basic site structure using HTML.

# References

https://velog.io/@rmaomina/prettier-eslint-settings

https://www.daleseo.com/eslint-config/
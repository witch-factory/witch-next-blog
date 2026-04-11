---
title: Creating a Book Community - 1. Initial Design
date: "2022-02-07T00:00:00Z"
description: "Structuring the Book Community folder"
tags: ["web", "study"]
---

# 1. Starting to Create a Book Community

We decided to form a three-member team for a project using React, Express, and MySQL. Based on a suggestion from one of the study group members (https://github.com/hamuneulbo), we agreed to create a community site centered around books. Therefore, I decided to briefly document the development process in this blog. I received much advice that organizing my tasks (which are more about studying) in a blog would be helpful...

# 2. Structuring the Site

Previously, I had attempted a cloning project briefly. At that time, I thought I could just follow along since it was a clone coding project, but it turned out to be quite challenging. Of course, there already exists a completed version of the site, so it was clear what the final product of my site should look like. However, the issue lay in the order and structure. When I tried to start without a defined site structure, I felt lost about where to begin, and I had to think too much every time I wanted to add a feature. Questions like which page should this function be linked to? What changes when this component operates on this page? How should the pages be interconnected, and how should they interact with the database? I constantly had to ponder these aspects, which made developing even a single feature mentally exhausting.

Therefore, this time, I thought it would be best to outline the site structure first, especially since team members also needed to grasp it. I found a tool called xmind for visualizing site structures and used it for this purpose. After receiving feedback from team members, the finalized site structure is as follows. It was quickly put together in one day and may appear rough. I knew that as the development progressed, many more connections and unanticipated features would likely arise. However, we needed to get the project on track during the break (if not deployed), and everything felt urgent. So we agreed to proceed with whatever ideas came to mind before jumping into coding.

![page](./mindmap.png)

# 3. Creating the Project Folder Structure

We decided to maintain separate client and server folders. The client would be developed using create-react-app, while the server would be built using Express without any additional frameworks. Although I was aware of various tools such as nestjs, we agreed to postpone their use for now. There is a potential for collaboration on those later. We created a book-community folder and set up client and server folders inside it.

Using `npx create-react-app client`, the client folder was generated. For the server, after creating the server folder, we initialized the environment with `npm init` to generate `package.json`.

Additionally, in the server folder, we installed Express.

By entering `npm install express --save` in the terminal, Express was installed, and we created the basic code following the official documentation.

Before doing this, I added `type: "module"` to `package.json` to enable import/export functionality in nodejs. Subsequently, I wrote the following in server/index.js.

```js
import express from 'express';

const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.send('hello world');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
```

# 4. Configuring ESLint

We decided to set up ESLint to standardize the code style among team members to some extent. During this process, I referred to multiple blog posts that explained the ESLint/Prettier configuration, along with instructions on how to apply them in WebStorm, as mentioned in section 5. However, there was a problem when applying ESLint to the server. To resolve this, I set the ESLint configuration as a .cjs file to ensure that the eslintrc file uses CommonJS syntax, due to the earlier configured `type: "module"`, which is linked in the reference materials.

Additionally, I included references on how to set up linting in WebStorm. However, it seems that applying different ESLint configurations for the client and server within WebStorm is not currently supported.

# 5. References

Express Official Documentation: https://expressjs.com/ko/starter/hello-world.html

Using imports in Node.js: https://velog.io/@ohzzi/Node.js-%EC%97%90%EC%84%9C/importexport-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0

Setting up ESLint + Prettier in Airbnb Style: https://velog.io/@_jouz_ryul/ESLint-Prettier-Airbnb-Style-Guide%EB%A1%9C-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0

Applying ESLint in WebStorm: https://modipi.tistory.com/10, https://valuefactory.tistory.com/828

CommonJS and ESM: https://yceffort.kr/2020/08/commonjs-esmodules
---
title: Creating a Notepad Project - 2 Project Structure
date: "2021-08-29T00:00:00Z"
description: "Web Notepad Project and its Recording of Trials 2"
tags: ["web", "react"]
---

# 1 Project Structure - Client

We plan to structure the project by separating the client folder for the front end and the server folder for the back end, allowing them to exchange information. Since it is preferable to manage `node_modules` as a single entity, we will configure it as a monorepo.

First, initialize the project folder with `yarn init` and edit the `package.json` to configure workspaces, in order to set up a monorepo.

```json
{
  "name": "memo-jang",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "private": true,
  "workspaces": [
    "client",
    "server"
  ]
}
```

Next, create the client using create-react-app.

```
npx create-react-app client
```

By entering the client folder and running `yarn start`, you will see that the default React page is automatically generated.

Also, we will use the Airbnb style guide for eslint.

https://velog.io/@_jouz_ryul/ESLint-Prettier-Airbnb-Style-Guide%EB%A1%9C-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0

Following this blog, I installed eslint-config-airbnb in the client folder.

However, when running `yarn start` to execute the React app, an error occurs due to issues with the format of `reportWebVitals.js`, which is not a file I created.

After some searching, I found a document at https://stackoverflow.com/questions/64518226/my-create-react-app-is-failing-to-compile-due-to-eslint-error suggesting creating a `.env` file in the project folder and adding

```
ESLINT_NO_DEV_ERRORS=true
```

Doing so resolved the issue. Although a warning message appears during compilation, the purpose of using eslint is to fix the style of the code I write, not to trigger a compilation error due to files I didn't create.

Additionally, to enable the use of jsx in `.js` files, I added the following line to `.eslintrc.js`, which is essential since I will be developing the front end using React.

```json
rules: {
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
  }
```

Next, we will install React Router for page navigation.

```
yarn add react-router-dom
```

For more information on React Router, refer to https://velog.io/@pkbird/React-Router-1 as a reference during development.

We will also install styled-components for styling.

```
yarn add styled-components
```

# 2 Project Structure - Server

Now let’s set up the server folder. We will install the basic Express framework.

First, create a new server folder within the project folder. Then, navigate into it, open a terminal, and install express.

```
yarn init
yarn add express
```

Referencing the article at https://velog.io/@ohzzi/Node.js-%EC%97%90%EC%84%9C/importexport-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0, I enabled the use of import in node.js and executed the following simple example code.

```jsx
import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
```

By running `node index.js`, I confirmed that it executes correctly. Accessing `localhost:3000` displays a very simple page showing `Hello World!`.

The eslint-config-airbnb can also be applied here, but that will be done later when working on the server. First, let's focus on the front end development of the notepad project. There is always joy in working on visible tasks.
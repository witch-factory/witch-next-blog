---
title: Creating a Notepad Project - 4. Basic Login Page Development
date: "2021-09-04T00:00:00Z"
description: "Web Notepad Project, A Record of Struggles 4"
tags: ["react", "web"]
---

# 1. Setting Up the Page Router

Before creating the login page, we need to establish the URL for the login page. Since we intend to route three different pages—sign-up page, login page, and notepad page—at separate addresses rather than using conditional rendering on individual pages, this is essential.

First, let’s create a simple page for the login route. Create `login.js` in the client/src folder.

```jsx
//src/login.js
import React from 'react';

const Login = () => (
  <h1>This is the Login Page</h1>
);

export default Login;

```

Next, add `/login` to the routing paths in client/src/App.js. While doing that, let’s also change the `Note` component to render at the `/memo` path instead of the home page.

```jsx
//App component
function App() {
  return (
    <>
      <NoteGlobalStyle />
      <Route path="/memo" component={Note} exact />
      <Route path="/login" component={Login} exact />
    </>
  );
}
```

Note that the `exact` option for the Route component ensures that the specified component is shown only for that exact path. Otherwise, the component will render on any path that includes it. For example, if a component is designated for the `"/"` path, it will also display on the `/login` path because `/login` includes `/`.

With this setup, executing `yarn start` will show the notepad created in the `Note` component at `http://localhost:3000/memo`, while the simple text from the `Login` component will display at `http://localhost:3000/login`. Our next task is to incorporate the actual login page layout into the `Login` component.

# 2. Working on the Login Page Component

## 2.0 Using Containers

Before starting work on the login page, let’s separate the containers we created earlier into a different file for reusability. Create `src/container.js` and move the previously created containers here.

```jsx
//container.js
import styled from 'styled-components';

const FlexContainer = styled.div`
  display:flex;
`;

const ColumnContainer = styled(FlexContainer)`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  flex-direction: column;
`;

const RowContainer = styled(FlexContainer)`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  flex-direction: row;
`;

export { FlexContainer, ColumnContainer, RowContainer };

```

Of course, we need to import `ColumnContainer` and `RowContainer` in note.js.

## 2.1 Adding Username/Password Fields

The login page doesn’t require anything elaborate. It only needs two input fields for the username and password and a submit button. Therefore, we will first create the essential input fields and submit button, and then we will enhance the design.

We will modify the input tag to create larger input fields for better visibility. It is intentionally made very large and may be adjusted later.

```jsx
const UserInput = styled.input`
  width:20rem;
  height:3rem;
  margin:5px;
  font-size: 1.5rem;
`;
```
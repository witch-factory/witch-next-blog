---
title: Project Troubleshooting - Creating Child Routes with react-router-dom
date: "2022-08-19T00:00:00Z"
description: "Issues Handling Nested Routes in React Router"
tags: ["web", "study", "front", "HTML", "react"]
---

# 1. Problem Occurrence

In the ongoing project, `react-router-dom` is utilized to structure multiple pages in a Single Page Application (SPA) built with React. There are instances where multiple routes share similar URLs, especially for routes related to accounts, which begin with the path `account` and vary based on the specific page's purpose.

Thus, it is natural to have routes such as a login route, a route for finding a registered email, and a route for recovering a password.

```jsx
<Routes>
  <Route path="account/login" element={<LoginPage />} />
  <Route path="account/find/email" element={<FindEmailPage />} />
  <Route path="account/find/password" element={<FindPasswordPage />} />
</Routes>
```

However, the common parts are not utilized at all. Therefore, this document aims to organize how to combine such diverse routes effectively.

# 2. Beginning of Problem Resolution - Nested Route

Firstly, the following `App.tsx` code is drafted for illustration purposes.

```jsx
// BrowserRouter is handled in index.tsx
import { Routes, Route } from "react-router-dom";

function MainPage() {
  return <div>Main Page</div>;
}

function LoginPage() {
  return <h1>Login Page</h1>;
}

function FindEmailPage() {
  return <h1>Find Email Page</h1>;
}

function FindPasswordPage() {
  return <h1>Find Password Page</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account/login" element={<LoginPage />} />
      <Route path="account/find/email" element={<FindEmailPage />} />
      <Route path="account/find/password" element={<FindPasswordPage />} />
    </Routes>
  );
}

export default App;
```

This setup creates three routes that share the common prefix of `/account` leading from the main page. The simplest way to group these routes is to create a Route for the common part and then wrap the subsequent URLs with that Route component. Thus, we can modify the `App` component as follows.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account">
        <Route path="login" element={<LoginPage />} />
        <Route path="find/email" element={<FindEmailPage />} />
        <Route path="find/password" element={<FindPasswordPage />} />
      </Route>
    </Routes>
  );
}
```

To further consolidate the common part, the URL for `find/` can also be grouped as follows.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account">
        <Route path="login" element={<LoginPage />} />
        <Route path="find">
          <Route path="email" element={<FindEmailPage />} />
          <Route path="password" element={<FindPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

## 2-1. Reason for This

This is possible because the default element of the Route component is `<Outlet />`. This Outlet component determines where to display child Route components when nesting routes occurs.

If we need to add the phrase "Account Page" to all routes prefixed with `account`, we can do it like this. First, create an `AccountPage` component as follows.

```jsx
function AccountPage() {
  return (
    <div>
      <h1>Account Page</h1>
      <Outlet />
    </div>
  );
}
```

The `AccountPage` component, through the position of the Outlet component, sets where the element of the Route using this component as its element will be rendered. It has been positioned below the h1 tag in `AccountPage`.

If we switch the order of the h1 tag and the Outlet, the "Account Page" phrase will appear above.

Since the Outlet tag is the default element for the Route tag, nested routes function as expected without explicitly specifying the element. If the element is the Outlet itself, the parent Route simply displays the element of the matching child Route.

# 3. More Complex Cases - Handling Parent Routes

The more complex problem arises when a component must render at the URL of the parent route as well. If both the parent route and the child route share common elements, and the child merely adds to the parent's elements, one can appropriately use the Outlet as discussed above. However, what if entirely different components need to be rendered for those routes?

Consider a scenario where there is a separate account recovery page. Here, we need to show the account recovery page before navigating to the email recovery or password recovery pages.

(There may be no need to create an account recovery page here. In the project context, there was a mid-level page that naturally fit the scenario better. However, for the sake of consistency, I use the account recovery page in this example.)

In this case, the `account/find` URL must show the account recovery page, while the `account/find/email` page must display the email recovery page, and the `account/find/password` page must show the password recovery page.

Thus, we might expect to set up the routes like this.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account" element={<AccountPage />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="find" element={<FindAccountPage />}>
          <Route path="email" element={<FindEmailPage />} />
          <Route path="password" element={<FindPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

However, this does not yield the desired result. The `account/find` URL appropriately displays the `FindAccountPage` component. Yet, at the `account/find/email` and `account/find/password` URLs, the components we specified as elements do not render correctly.

This failure occurs because the parent component `<Route path="find" />` has no `Outlet` component within its element, which would determine where to display the elements of the child routes. Without a component rendering the child routes, there can be no rendering of those child routes.

# 3.1 Solution 1 - Create Empty URL Child Component

A simple solution presents itself immediately upon thought. The parent route can be designated with an `Outlet` as its element (i.e., either explicitly setting the element to Outlet or allowing it to serve as the default element), while appropriately structuring the child routes.

Thus, we can modify the App component as follows.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account" element={<AccountPage />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="find" element={<Outlet />}>
          <Route path="" element={<FindAccountPage />} />
          <Route path="email" element={<FindEmailPage />} />
          <Route path="password" element={<FindPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

However, using an empty URL feels unsatisfactory. It would be preferable to have a method that explicitly illustrates a link to the parent route.

# 3.2 Solution 2 - Using Index

This can be resolved by utilizing the `index` prop in the Route. A Route with the index prop is designated as the default child route, rendering at the parent Route URL + '/'. Thus, the App component from section 3.1 can be rewritten as follows.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account" element={<AccountPage />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="find" element={<Outlet />}>
          <Route index element={<FindAccountPage />} />
          <Route path="email" element={<FindEmailPage />} />
          <Route path="password" element={<FindPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

As expected, the `FindAccountPage` renders at the `account/find` path, and the child route elements render as intended. Although the designation of a default child route could be misinterpreted, it is important to note that an index Route will not render anything for URL paths other than the parent Route URL + '/'. For instance, a path such as `account/find/123` would render nothing since there are no matching Route URLs.

If there are multiple child routes specified as index under a single parent route, the first one listed will render first.

Furthermore, a Route that has a path prop cannot be designated as index. Once a path prop is passed to a Route, the type of the index prop is set to false, leading to an error if there is an attempt to assign the index prop to a Route with a path prop (`Type 'true' is not assignable to type 'false'`). This is purely a matter of type in TypeScript.

# References

React Router Official Documentation on Route Component: https://reactrouter.com/docs/en/v6/components/route  
React Router Official Documentation on Outlet Component: https://reactrouter.com/docs/en/v6/components/outlet  
Stack Overflow Q&A: https://stackoverflow.com/questions/66266216/how-can-i-exactly-match-routes-nested-deeply-in-react-router-6
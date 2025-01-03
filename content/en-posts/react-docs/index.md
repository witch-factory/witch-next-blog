---
title: Reading the Official React Documentation
date: "2023-10-11T00:00:00Z"
description: "Reviewed the revamped React official documentation"
tags: ["front", "react"]
---

I started with React using the now-legacy [previous official documentation](https://ko.legacy.reactjs.org/). I recall beginning with the documentation for creating a tic-tac-toe game, then moving on to [Velopert's Modern React](https://react.vlpt.us/) to build a to-do list.

However, that was quite some time ago, and [now the React official documentation has been revamped.](https://react.dev/) I will briefly summarize some parts that I was previously unaware of by reading through the new documentation.

# 1. JSX

If you need to convert a lot of HTML to JSX, you can use an [online converter](https://transform.tools/html-to-jsx).

JSX is stricter than HTML. Tags must always be closed, such as `<br />`, and multiple JSX tags cannot be returned. This is because JSX is essentially JavaScript, which cannot return multiple values from a function.

# 2. React Hooks

Functions that start with `use` are referred to as hooks in React, and these hooks should only be called at the top level of a component or another hook (likely a custom hook). This means you cannot use hooks directly inside conditional or looping statements. If you need that functionality, you must create a new component.

There are also built-in hooks provided by React, such as `useState`, which users can combine to create new hooks, known as custom hooks.

# 3. Lifting State

When multiple child components need to share the same state, it is recommended in the official documentation to place the state in a parent component and pass it down to the child components via props. This process is referred to as lifting state. This allows child components to easily maintain synchronized states.

# 4. Designing with React

When structuring the UI with React, you should first break it down into components and then think about the states that each component should represent. After that, you will design how data flows among the components.

## 4.1. Component Division

When dividing components, you can follow the Single Responsibility Principle by extracting portions that have specific roles into separate components, or you can divide components based on CSS to facilitate better use of class selectors.

Thinking about design composition while dividing components is also beneficial. However, since UI and data models usually go hand in hand, if the data is well-structured, it should not be difficult to split components accordingly.

## 4.2. Managing State

Once the site's structural design is complete, the static structure of the components should be in place. You should then design the application's states to be minimal.

For example, if an array is stored as state, the length of the array can be computed from the state, meaning it should not exist as a state itself. Immutable values should also not exist as state. State is meant to facilitate user interactions.

Once you have envisioned the minimal states, consider which components should hold those states.

# 5. Key Props

When rendering elements within an array as components using the JS array method `.map(item, index)`, you must include a unique value called `key` for each component. This allows React to detect what has changed among the components and determines what to re-render, acting as a unique ID for the component.

```jsx
const listItems = numbers.map((number) =>
  <li key={number}>
    {number}
  </li>
);
```

When the list is re-rendered, React compares the keys of the previous list with those of the updated list. If the updated list has a key that did not exist before, React creates a component for that key. Conversely, if a key from the previous list does not appear in the updated list, React removes the component for that key. If a key exists in both the previous and updated lists, React will update or move the corresponding component.

In summary, `key` provides React with the unique identifier for each component, indicating which components are added, removed, or updated during re-rendering.

Although `key` appears similar to props, it is special and reserved. React uses the `key` prop internally to decide which components to update.

Thus, assigning appropriate keys when rendering dynamic lists is crucial. It is not advisable to use array indices as keys, as React will throw an error and automatically use the index as a key if none is explicitly assigned.

If a key changes, React will remove and recreate the component, while the index can change too easily due to array modifications. Using a unique value from each array element as a key allows for the targeted updating of the corresponding component when an element is edited.

Additionally, keys do not need to be globally unique and only need to be unique among the component and its siblings.

# 6. React Frameworks

Many boilerplates facilitate starting React projects easily, such as create-react-app or Vite. However, various frameworks incorporate commonly required functionalities like routing, data fetching, and HTML generation when working on React projects.

A prominent example is Next.js, which powers this blog. Other similar full-stack React frameworks include [Remix](https://remix.run/), known for static site generation, and [Gatsby](https://www.gatsbyjs.com/), among others. Next.js is managed by Vercel, while Gatsby is supported by Netlify.

## 6.1. Benefits of Using Frameworks with React

It is possible to use React without a framework. Originally, React's advantage was its capability for incremental migration via methods like `render`. However, if you plan to build an entire page in React, using a framework is advisable.

During development, you will frequently need to implement routing, data fetching, preloading, and sometimes want static HTML builds. Implementing these functionalities from scratch requires significant time and effort, and learning how to use libraries is necessary. Moreover, self-configuring environments can make it difficult to receive assistance from others since everyone may have experience with different setups.

Using a framework allows you to start developing quickly, as many components are already configured. Additionally, if issues arise, you can seek help from the framework's community.

## 6.2. Frameworks and React

The React team collaborates with several well-known React framework developers. For instance, they discuss React features such as [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) with developers from frameworks like Next.js.

You can experiment with these server components in the [Next.js App Router documentation](https://nextjs.org/docs). Features like server components and Suspense are part of React but have been implemented in Next.js first due to the challenges of applying them directly to React.

## 6.3. Editor Setup

Here are some helpful [official documentation links for VSCode](https://react.dev/learn/editor-setup).

# 7. Adding React to Existing Projects

The emergence of React boilerplates like CRA has made starting new projects with React seem standard. However, React's strength lies in its ability to enable gradual migration, allowing you to incrementally integrate React into existing projects.

You can approach it in two ways: building certain pages with React or rendering parts of individual pages as React components.

## 7.1. Adding React Pages

Suppose you have a page built with another server technology, such as Ruby on Rails, and you want to build specific routes with React—let's call this page `witch.com`. For example, if you want to create all routes starting with `/witch` using React.

First, you would set up that page in React, potentially using a framework like Next.js. Then, in the framework's configuration file, you would set the base path for the desired route. If you want the `/witch` path to be the root for the React page, configure it as follows:

If using Next.js, edit the `next.config.js`:

```js
module.exports = {
  basePath: '/witch',
}
```

Then, you need to set up a proxy on the server to route all requests going to `/witch` to the React page.

## 7.2. Adding React Components to Existing Pages

You can also choose to use React only for specific components on an existing page. Meta has extensively utilized this method for a long time.

Start by installing JSX syntax and the React library via npm. Create the desired React components and render them as needed.

You will also need to configure the settings for compiling JS modules, which can be easily accomplished using Vite. There’s even a repository compiling code on [integrating Vite with various backend frameworks](https://github.com/vitejs/awesome-vite#integrations-with-backends).

First, install React:

```bash
npm install react react-dom
```

Then, use `createRoot` and `render` to render React components within a DOM element:

```js
import {createRoot} from 'react-dom/client';

const root = document.getElementById('root');

createRoot(root).render(<App />);
```

This approach can be observed in the structure of the `main.tsx` file when initially creating a project with Vite's TypeScript template. It finds the tag with the `root` ID and renders the React component within it.

```tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

This operation can be performed on any tag within the existing application. By assigning a unique ID and using `getElementById` to find the tag, then `createRoot` and `render` to output the React component, you can proceed.

For example, if there is a pre-existing header element on the page, you can render a React component into that header tag:

```html
<!-- ...skipped... -->
<header>
  <div id="header"></div>
</header>
<!-- ...skipped... -->
```

You can find the tag with the ID `header` and render the React component inside it as follows:

```js
import { createRoot } from 'react-dom/client';
// Assume that the component to go inside the header is already created
import Header from './Header';

const header = document.getElementById('header');
const root = createRoot(header);
root.render(<Header />);
```

This way, you can progressively migrate elements of the page to React.

# 8. Types in React

This section introduces some types from the `@types/react` and `@types/react-dom` packages that provide type definitions for React elements. It includes types related to hooks and others that may be useful.

You can install the React types with `npm install @types/react @types/react-dom`. Additionally, you must use the `.tsx` file format to leverage TS with JSX.

## 8.1. useState

`useState` is the most fundamental hook in React. This hook infers the state type based on the initial state provided.

```tsx
// The type of count is inferred to be number.
// The type of setCount is inferred to be a function type that receives a number or returns a function that returns a number.
const [count, setCount] = useState(0);
```

You can also directly provide the state type for `useState` using generics, which is useful for defining union type states.

```tsx
type Theme = 'light' | 'dark';

const [theme, setTheme] = useState<Theme>('light');
```

## 8.2. useReducer

`useReducer` is similar to `useState` but updates state through a reducer. The reducer function's type is also inferred from the initial state. While you can provide types directly via generics, it is usually better to allow inference from the initial state.

```tsx
type Action = { type: 'increment' } | { type: 'decrement' };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
  }
}

// When used later
const [count, dispatch] = useReducer(reducer, 0);
```

## 8.3. useContext

The `useContext` hook is used to pass data through the component tree without having to prop drill. Typically, a custom hook is created to pass values down to child components.

The type of the value provided by the context is inferred from the value passed to the `createContext` function. It can also be provided separately using generics.

```tsx
type Theme = 'light' | 'dark';

const ThemeContext = React.createContext<Theme>('light');
```

If there are cases where there is no initial value, set the generic type to `Theme | null` and perform `null` checks when using `useContext` to narrow the type.

## 8.4. useMemo, useCallback

`useMemo` and `useCallback` infer the return type of the hook's result from the type of the function passed as the first argument. You can also provide types generically for the hooks.

```tsx
// The return type of memoizedValue is inferred from the return type of computeExpensiveValue
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

`useCallback` infers the parameter and return types of the callback function.

```tsx
// The type of onClick is inferred as (e: React.MouseEvent<HTMLButtonElement>) => void.
const onClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
  console.log('button clicked');
}, []);
```

You can use the `EventHandler` type provided by React based on your preferences.

```tsx
const handleClick = useCallback<React.ClickEventHandler<HTMLButtonElement>>((e) => {
  console.log('button clicked');
}, []);
```

## 8.5. DOM Events

React wraps DOM events and provides them. Event types can often be inferred from event handlers, but if you want to create functions tailored for event types, you can provide event types directly.

```tsx
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log('button clicked');
}

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log('input changed');
}
```

You can find the types of all events in the [MDN Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events).

All event types' base type is `React.SyntheticEvent`.

## 8.6. Children

There are two widely used methods to represent child components. One is `React.ReactNode`, which is the union of all types that can be passed as children in JSX.

The second is `React.ReactElement`, which represents only JSX elements and excludes primitive values like strings or numbers.

It is also impossible to set a children type that only accepts specific types of JSX elements, e.g., accepting only `<section>` elements as children.

## 8.7. Style Props

When applying inline styles in React, use `React.CSSProperties`. This serves as a union type of all possible CSS properties, allowing you to verify the validity of CSS properties.

```tsx
interface Props {
  style: React.CSSProperties;
}
```
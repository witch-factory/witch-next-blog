---
title: React Testing - Jest 1
date: "2023-02-04T03:00:00Z"
description: "Study for introducing testing in frontend, basics"
tags: ["javascript"]
---

This document aims to summarize the study contents related to testing.

# 1. React Testing Library

When a project is created with CRA, RTL is installed by default. This library is built on top of the DOM Testing Library, providing APIs specifically for React.

For testing React components, the behavior-driven testing methodology is used. This focuses not on value exchange, but rather on how certain actions lead to changes in the display.

# 2. Web Page Build Process

The browser reads the HTML document, applies styles (CSS), and displays it in the viewport. During this process, HTML is converted into the DOM and CSS into the CSSOM, after which the browser merges these to create a render tree. This will be discussed in more detail in future writings.

The DOM tree is built by parsing the HTML file and creating tokens according to HTML standards, which are structured into a tree. This structured representation of the HTML file by the browser is referred to as the DOM.

When testing React, nodes of this DOM are targeted for testing.

# 3. Getting Started with Testing

Let's create a project using CRA. The app name is chosen arbitrarily.

```
npx create-react-app react-test-app --template typescript
```

## 3.1. Jest

We will render the DOM using the React Testing Library and test it using Jest.

When an app is created with CRA, Jest is pre-installed. This Jest searches for files ending with `[filename].test.js` or `[filename].spec.js` to execute tests. It also recognizes files located in a folder named tests as test files.

The structure of Jest comprises describe and it. Describe groups the tests, while it defines the content of each test. It can also be replaced with test.

```js
// describe(name, function) format
describe('Test Group Name', () => {
  // it(name, function, [timeout]) format
  it('Test Name', () => {
    // Test content
  });
});
```

Tests fundamentally consist of expect and matcher. Expect defines the test subject, while the matcher verifies the state of the test subject.

For example, `expect(sum(1,3)).toBe(2)` checks if sum(1,3) equals 2. You can also use it with not like this: `expect(something).not.toBe(a)`.

## 3.2. React Testing Library

Now, let's finally use RTL. If the app is created with CRA, tests can be executed using `npm test`. At this point, the `App.test.tsx` file will be executed.

This file has the following structure:

```js
test('renders learn react link', () => {
  render(<App />);
  // Retrieves the link element containing the text "learn react"
  const linkElement = screen.getByText(/learn react/i);
  // Uses the toBeInTheDocument() matcher to confirm the link element exists in the DOM
  expect(linkElement).toBeInTheDocument();
});
```

Render is a function that renders the received component to the DOM. In this case, it will render the App component. It returns an object containing query functions (like getByText) provided by RTL. The use of the screen object is recommended.

### 3.2.1. RTL Query Functions

Query functions are used by the testing library to find specific elements on the page. They include getByX(), queryByX(), and findByX().

- getByX(): Returns the found element if it exists, and throws an error if it doesn't. If multiple elements are found, it also throws an error. In cases where multiple elements are expected, use getAllByX.

- findByX(): Returns a Promise that resolves if the element is found, and rejects if the element is not found or if there are multiple elements after the default timeout (1 second).

- queryByX(): Returns the found element if it exists, and returns null if it doesn't. Like getBy, it throws an error if multiple elements are found.

By using waitFor, you can wait for a certain period for the test to pass.

# 4. Installing ESLint

To catch syntax errors and enforce style while coding, we will install eslint and prettier.

First, let’s delete the automatically configured eslint config in package.json that was set up when creating the app with CRA.

```json
// Delete this part
"eslintConfig": {
  "extends": [
    "react-app",
    "react-app/jest"
  ]
},
```

Then, create a `.eslintrc.json` file in the root and install the testing plugin.

```
npm install eslint-plugin-testing-library eslint-plugin-jest-dom --save-dev
```

Modify eslintrc according to the installed plugins.

```json
{
  "plugins": ["testing-library", "jest-dom"],
  "extends": [
    "react-app",
    "react-app/jest",
    "plugin:testing-library/react",
    "plugin:jest-dom/recommended"
  ]
}
```

# References

https://www.daleseo.com/react-testing-library/

https://leehyungi0622.github.io/2021/05/05/202105/210505-React-unit-test-questions/

https://testing-library.com/docs/queries/about
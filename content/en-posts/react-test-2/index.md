---
title: React Testing - Jest 2
date: "2023-02-19T03:00:00Z"
description: "Study for implementing tests in frontend, basics of Testing Library"
tags: ["javascript"]
---

When developing with TDD, you should first create tests and then write code that passes those tests. Of course, the opposite order can be chosen, but the tests must remain central as their name suggests.

First, we will review the basics from the official Testing Library documentation, and in the next article, we will build a counter using TDD.

# 1. Basics

Let's create a basic test. When you create a project with CRA, there is a default file named `App.test.tsx`. Let's add the following test to it. This test verifies if the title element in the App component is present in the Document.

```js
test("Title is in Document", () => {
  render(<App />);
  const titleElement = screen.getByTestId("title");
  expect(titleElement).toBeInTheDocument();
});
```

First, we render the App component and then look for the element with the testId of "title". We then check if that element is present in the Document.

The following App component will pass the test because the element with the title testid is present in the Document.

```js
function App() {
  return (
    <div className="App" data-testid="title">
      Hello
    </div>
  );
}
```

# 2. Categorization Based on Query Function Behavior

Above, we naturally accessed the element using the `screen.getByTestId` function. What other query functions are there?

As mentioned earlier, query functions are used to find page elements. They can be broadly classified into get, find, and query functions, and these functions behave differently when they cannot find an element.

After finding an element, you can trigger events using Event API or user-event.

```js
test("Test Title", () => {
  render(<Component />);
  // Query function to find specific element
  const element = screen.queryFunction(/name/);
});
```

Now let's explore how query functions are categorized based on their behavior when failing to find an element. Additionally, we can also differentiate between query functions that find one element and those that find multiple elements. When finding multiple elements, "AllBy" is appended instead of "By". This results in a total of six categories.

### 2.1.1. getBy

The `getBy...` query function returns the element if it matches the condition. If not found, it throws an error. It also throws an error if there are two or more matching elements.

### 2.1.2. queryBy

The `queryBy...` query function returns the element if it matches the condition. If not found, it returns null. It throws an error if there are two or more matching elements.

### 2.1.3. findBy

The `findBy...` query function returns a Promise. If it finds an element that matches the query, the Promise resolves. If it does not, the Promise rejects. 

If one or more matching elements are found after the default timeout of 1000ms (1 second), the Promise rejects.

### 2.1.4. getAllBy

The `getAllBy...` query function returns an array containing the elements that match the condition. If not found, it throws an error.

### 2.1.5. queryAllBy

The `queryAllBy...` query function returns an array containing the elements that match the condition. If not found, it returns an empty array `[]`.

### 2.1.6. findAllBy

The `findAllBy...` query function returns a Promise. If it finds elements that match the query, the Promise resolves with an array containing those elements. If it does not find such elements after the default timeout of 1000ms, the Promise rejects.

The findBy query functions are similar to a combination of getBy and waitFor. These functions accept waitFor options as the last optional argument.

# 3. Query Function Priority

Each of the categories classified above contains numerous query functions. Among them, we used `getByTestId`. However, accessing elements via `screen.getByTestId` is not the recommended approach. So, which queries should be used?

The basic principle is that they should resemble how users interact with your page. You should prioritize using query functions that are accessible to everyone.

Therefore, it is advisable to use `getByRole`, `getByLabelText`, `getByText`, and `getByDisplayValue`. These query functions work well not only for mouse or sighted users but also in various contexts such as screen readers.

Next are semantic queries like `getByAltText` and `getByTitle`. Finally, the one we used, `getByTestId`, comes last in priority. This is because testId only holds meaning for developers and is meaningless to users.

Next, we explored the query functions provided by the Testing Library.

# 3.1. Accessible to Everyone

Queries that take into account the experiences of not only mouse users but also screen reader users. For convenience, we describe them with `getBy`, but the same applies to `queryBy`, `findBy`, `getAllBy`, `queryAllBy`, and `findAllBy`.

### 3.1.3. getByRole

This is applicable to all elements in the accessibility tree (based on DOM tree and containing accessibility information). It can also be filtered by name. This is the most recommended method. Most tests can be conducted using this, especially in conjunction with the name option.

```js
screen.getByRole('button', { name: /submit/i })
```

### 3.1.2. getByLabelText

This locates elements through LabelText. It is particularly useful for forms, as users encounter labels when filling them out. This is another highly recommended method.

### 3.1.3. getByPlaceholderText

This finds elements through the placeholder. However, [placeholders are not recommended](https://www.nngroup.com/articles/form-design-placeholders/), so it is better to use another option if available.

### 3.1.4. getByText

Users sometimes locate elements through text. This applies to elements not interacting with the user, such as div, span, and p tags.

### 3.1.5. getByDisplayValue

This locates elements based on the currently displayed value in input, textarea, or select.

## 3.2. Semantic Query Functions

### 3.2.1. getByAltText

This function can reference elements like img, area, and input that support alt text.

### 3.2.2. getByTitle

This fetches elements using the title attribute, but it has the drawback of not being well-read by screen readers and being generally invisible.

## 3.3. getByTestId

This fetches elements using the testid attribute. However, since this attribute is not visible to the user, it is used only when elements cannot be matched by role or text, such as when texts change dynamically.

# 4. Using Query Functions

The query functions of the Testing Library must be passed the container as the first argument. However, in most Testing Libraries, including React Testing Library, document.body is often passed as a container, so when query functions are used via the screen object, document.body is automatically passed as the container.

The arguments used in queries can be strings, regular expressions, or functions. Let's pass strings to the query functions to locate elements and then test.

Let's create a simple React component.

```js
function App() {
  return <h1>Hello</h1>;
}
```

Then we write the test code. According to the [W3C specification](https://www.w3.org/TR/html-aria/#docconformance), the default role for h1 to h6 tags is heading. Thus, we use `getByRole`. 

```js
test("Element is in Document", () => {
  render(<App />);
  const titleElement = screen.getByRole("heading");
  expect(titleElement).toBeInTheDocument();
});

test("Text check", () => {
  render(<App />);
  const titleElement = screen.getByRole("heading");
  expect(titleElement).toHaveTextContent("Hello");
});
```

When you run `npm test`, you can verify that the tests pass.

## 4.1. TextMatch

Many query functions accept TextMatch as an argument. This can be a string, a regular expression, or a function. The function form looks like this.

```js
(content?: string, element?: Element | null) => boolean
```

They can be utilized as follows.

```js
screen.getByText('Hello World') // searching using string
screen.getByText(/World/) // searching using regular expression
screen.getByText((content, element) => content.startsWith('Hello')) // searching using function
```

Typically, using regular expressions allows for broader and more complex searches.

### 4.1.1. TextMatch Options

Functions that accept TextMatch allow for fine-tuning string matching by passing an options object as the last argument. The options include:

- exact: If true, it differentiates case and finds only the exact matching string. The default value is true. If false, it disregards case and matches substrings (affects only string arguments).
- normalizer: A function to normalize the string can be passed.

### 4.1.2. Normalization

When matching text in the DOM, the Testing Library performs basic text normalization. The default normalization removes leading and trailing spaces, merges spaces into one, and replaces line breaks with spaces. This aligns with the text seen by users.

If you want to create a custom normalization function, you can pass it to the normalizer property within an object containing TextMatch options.

Alternatively, you can slightly edit the basic normalization function by passing options to `getDefaultNormalizer`. You can adjust the trim option to remove leading and trailing spaces and the collapseWhitespace option to merge spaces into one.

```js
screen.getByText('text', {
  normalizer: getDefaultNormalizer({ trim: false }),
})
```

The above code fetches elements containing 'text' without trimming in the text normalization function.

## 4.2. Manual Query

Instead of using the Testing Library's query functions to fetch elements, you can simply use the querySelector API to obtain elements via class or id.

```js
const { container } = render(<App />);
const titleElement = container.querySelector("h1");
```

However, this contradicts the principle of "testing as the user experiences," since such aspects are not visible to users. Therefore, it is not recommended. If you must use a non-semantic query, use testId.

# 5. Individual Functions

We briefly reviewed how query functions vary based on how elements are found. We further explored each function based on the official documentation, although we lacked time to cover all optional arguments, focusing instead on the most commonly used features.

## 5.1. ByRole

This retrieves elements based on their role. For instance, the role of a button tag is button, and the role of an a tag is link. Utilizing roles means it is important to use semantic HTML elements.

The default roles for various elements can be viewed [here](https://www.w3.org/TR/html-aria/#docconformance).

Modifying default roles or aria-* attributes is unnecessary and discouraged, as it may lead to conflicts with default roles.

Elements can also be retrieved based on their accessible names. This includes the label of form elements, the textContent of buttons, and the value of aria-label, among others.

When multiple components serve the same role, they can be distinguished via their accessible names. For example, if multiple buttons exist, they all share the button role but can be differentiated by their accessible names, such as `getByRole('button', { name: 'Submit' })`.

Accessible names are explained in more detail [here](https://www.tpgi.com/what-is-an-accessible-name/).

## 5.2. ByLabelText

This query function accepts TextMatch. It searches for the label matching the TextMatch and locates the associated element.

Testing the following component is straightforward.

```js
function App() {
  return (
    <div>
      <label htmlFor="id-input">ID</label>
      <input id="id-input" />
    </div>
  );
}
```

We can simply check if the input is present in the document.

```js
test("Element is in Document", () => {
  render(<App />);
  const titleElement = screen.getByLabelText("ID");
  expect(titleElement).toBeInTheDocument();
});
```

However, if the label text does not match the input's id, `getByLabelText` will not locate the element. In such cases, it is preferable to use `getByRole`, rather than using aria-label.

```js
getByRole('textbox', { name: 'ID' })
```

## 5.3. Other Query Functions

The remaining functions do not have meanings beyond what was explained above. Just ensure to provide a proper TextMatch argument, and they will locate elements as intended.

# 6. Triggering Events

It is recommended to use `userEvent` instead of `fireEvent`. While userEvent also utilizes fireEvent, it responds more appropriately according to the element type, for instance, focusing on a clicked button. Thus, let's review how to use userEvent briefly.

First, it is recommended to execute `userEvent.setup()` before rendering the component and use the returned object to trigger events. While it is possible to execute events directly using `userEvent.click(element)`, this is only to facilitate migration from v13 to v14.

The objects returned from userEvent.setup() share a single state, allowing tests to continue. For example, you can click a button in the first test and verify that it was clicked in the second test.

```js
test("Button click", () => {
  const user = userEvent.setup();
  render(<App />);
  // Fetch the button labeled "Click me"
  const button = screen.getByRole("button", { name: "Click me" });
  user.click(button);
});
```

Writing the following App component will pass the test.

```js
function App() {
  return (
    <div>
      <button>Click me</button>
    </div>
  );
}
```

## 6.1. userEvent API

There are many user events like pointer, keyboard, clipboard, click/dblClick/tripleClick, but I plan to explore and summarize them after some usage.

# References

https://testing-library.com/docs/queries/about
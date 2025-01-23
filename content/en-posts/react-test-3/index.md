---
title: React Testing - Jest 3
date: "2023-03-01T03:00:00Z"
description: "Study for introducing testing in frontend, creating a counter"
tags: ["javascript"]
---

# 1. Counter Creation

Let's imagine we are creating a simple counter with + and - buttons that increase and decrease a number when clicked. What is the core functionality? Obviously, it is the increasing and decreasing of the number. Now let's test this functionality.

We can also test whether the buttons are rendered correctly and whether the number component is rendered properly. However, we will trust React for those aspects. Our responsibility is to check whether the user's intention of clicking the button operates correctly.

# 2. Writing Tests

We will have an h1 element showing the number within a section element, and button elements demonstrating + and - buttons. We will implement this in the default App component created with Create React App.

Then, a test for when the + button is clicked to increase by 1 can be written as follows. Assume the initial value of the counter is 0.

```js
test("when plus button is clicked then counter increases", () => {
  const user = userEvent.setup();
  render(<App />);
  const plusButton = screen.getByRole("button", { name: "+" });
  user.click(plusButton);
  const counterElement = screen.getByRole("heading");
  expect(counterElement).toHaveTextContent("1");
});
```

Alternatively, this can be written in a more sophisticated way. Since there is no guarantee that the initial value is 0, we can retrieve the initial value and add 1 to it.

```js
test("when plus button is clicked then counter increases", () => {
  const user = userEvent.setup();
  render(<App />);
  const counterElement = screen.getByRole("heading");
  const counterValue = parseInt(counterElement.textContent || "0");
  const plusButton = screen.getByRole("button", { name: "+" });
  user.click(plusButton);
  expect(counterElement).toHaveTextContent((counterValue + 1).toString());
});
```

If we run `npm test`, the test will naturally fail. However, let’s also write a test for the - button. It can be done similarly.

```js
test("when minus button is clicked then counter decreases", () => {
  const user = userEvent.setup();
  render(<App />);
  const counterElement = screen.getByRole("heading");
  const counterValue = parseInt(counterElement.textContent || "0");
  const minusButton = screen.getByRole("button", { name: "-" });
  user.click(minusButton);
  expect(counterElement).toHaveTextContent((counterValue - 1).toString());
});
```

# 3. Component Implementation

Now, let’s implement the counter directly. It is simple and can be done quickly.

```js
function App() {
  const [count, setCount] = useState(0);

  return (
    <section title="counter">
      <h1>{count}</h1>
      <button
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          setCount((prev) => prev - 1);
        }}
      >
        -
      </button>
    </section>
  );
}
```

# 4. Fixing Tests

However, this will cause the tests to fail. But the application works well. Why is that?

Let’s examine this part of the test code.

```js
user.click(plusButton);
expect(counterElement).toHaveTextContent((counterValue + 1).toString());
```

After clicking the plusButton, it checks whether the text contains the value obtained by adding 1 to counterValue. However, this test behaves asynchronously. The user.click function operates as a Promise. (Additionally, the Testing Library documentation suggests using await with userEvent.)

Therefore, let’s add await to access the element after the click event has completed. We modify the tests as follows.

```js
test("when plus button is clicked then counter increases", async () => {
  const user = userEvent.setup();
  render(<App />);
  const counterElement = screen.getByRole("heading");
  const counterValue = parseInt(counterElement.textContent || "0");
  const plusButton = screen.getByRole("button", { name: "+" });
  await user.click(plusButton);
  expect(counterElement).toHaveTextContent((counterValue + 1).toString());
});

test("when minus button is clicked then counter decreases", async () => {
  const user = userEvent.setup();
  render(<App />);
  const counterElement = screen.getByRole("heading");
  const counterValue = parseInt(counterElement.textContent || "0");
  const minusButton = screen.getByRole("button", { name: "-" });
  await user.click(minusButton);
  expect(counterElement).toHaveTextContent((counterValue - 1).toString());
});
```

Now, when we run `npm test`, the tests succeed.

# 5. Adding Tests

The tests above only check if the button is pressed once. However, we also need to test whether it works correctly when pressed multiple times. Let’s add the following test.

```js
test("plus button 100 times", async () => {
  const user = userEvent.setup();
  render(<App />);

  const plusButton = screen.getByRole("button", { name: "+" });
  for (let i = 0; i < 100; i++) {
    await user.click(plusButton);
  }
  const counterElement = screen.getByRole("heading");
  expect(counterElement).toHaveTextContent("100");
});
```

By checking with npm test, we can confirm that the counter also works well with repeated clicks. Similar tests can be written for the minus button.

Although the CSS settings are not applied, making it look unappealing, we have created a counter along with testing.

# Reference

https://jbee.io/react/testing-2-react-testing/
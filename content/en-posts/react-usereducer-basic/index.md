---
title: Exploring React - useReducer Syntax
date: "2022-09-12T00:00:00Z"
description: "Fundamentals of React useReducer"
tags: ["web", "study", "front", "react"]
---

(Updated on 2023-11-13)

# 1. Introduction

Many documents that teach React introduce the state management technique known as useReducer. However, I had only a vague awareness of its existence without having actually used it. Therefore, I will explore the functionality, advantages, and use cases of useReducer. Incidentally, there was also a section about this in the newly updated official React documentation.

# 2. Basic Structure of useReducer

React provides a state management technique called useState. Anyone using React has likely employed useState at least once. This function provides the state and a `setState` function that can update that state to a specific value.

So, how is useReducer different from this? useReducer provides a dispatch function that allows sending actions to change a given state into a specific different state. Instead of directly setting the state, this action serves to convey information about 'what to do' to the reducer.

Let's consider an example. Suppose we have code using useState as follows:

```jsx
const [number, setNumber] = useState(0);
```

Here, useState provides the variable number to store the state and the function setNumber to change that number to a specific other number. Therefore, when creating a counter, incrementing and decrementing can be implemented as follows:

```jsx
const onIncrease = () => {
  setNumber(number + 1);
};

const onDecrease = () => {
  setNumber(number - 1);
};
```

In contrast, useReducer provides a variable to store the state and a function (dispatch) that transforms that state into one processed by a specific function (reducer).

The basic form is as follows. The useReducer hook takes a reducer function responsible for updating the state as well as an initial state as arguments.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

You can also pass a function for lazy initialization as the third argument of useReducer, but this is seldom used, so the above form is effectively the basic structure. Therefore, the useReducer form replacing number and setNumber is as follows:

```jsx
const [number, dispatch] = useReducer(reducer, 0);
```

The previously observed increment and decrement functions are implemented in this way. Action objects are passed to the dispatch function. Doing so updates the `number` state returned by `useReducer`.

```jsx
const onIncrease = () => {
  dispatch({ type: "INCREMENTED" });
};

const onDecrease = () => {
  dispatch({ type: "DECREMENTED" });
};
```

In this case, the action object can be in any form, but it is common to use a string in the `type` property to specify the type of update to be made. This allows the reducer to distinguish which update should be performed through a `switch` statement.

So, how should the string for this type property be written? Originally, it was typically written to specify how the state would change, such as `ADD` or `DELETE`.

However, the official React documentation recommends writing about what action the user has taken rather than how the state should change. For instance, using terms like `INCREMENTED` or `CHANGED`. Of course, it is acceptable to write it in lowercase, such as `changed`.

Data needed for the update can be passed through each property or as an object with the name `payload`. In the above case, no specific state is required for the update, so only the `type` property was passed.

The number retains its state just like when using `useState`, and dispatch relays the action object to the reducer to update the state. So, what is the reducer?

# 3. About the reducer Function

The reducer is a function responsible for updating the state similar to `setState`. It takes the current state and the action object as arguments and returns the new state.

```tsx
// state: Current state
// action: Object containing information needed for the update
function reducer(state, action) {
  // Return next state
}
```

At this point, the action is the object passed through the dispatch function when using useReducer. As mentioned earlier, the action generally consists of a type indicating the type of state update and the necessary information. Therefore, a `switch` statement is typically written for `action.type`.

```tsx
function reducer(state, action) {
  switch (action.type) {
    case "ADDED":
      return state + 1;
    case "SUBTRACTED":
      return state - 1;
  }
}
```

If the state is an object, you need to maintain immutability here as well, just as when using `setState`. Here, the information needed for the update is passed as action.payload, following the naming convention used in Redux.

```tsx
function reducer(state, action) {
  switch (action.type) {
    case 'APPENDED':
      return [...state, action.payload];
    case 'CHANGED':
      return state.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    case 'DELETED':
      return state.filter((item) => item.id !== action.payload.id);
  }
}
```

This reducer runs in the same execution queue as the useState update logic. Therefore, it is important to uphold immutability and purity. It should not contain network requests or side effects.

Additionally, a single action should represent a single user interaction, even if that means changing multiple pieces of data at once. For example, if there is an action to reset a form that initializes 5 data fields, it should be expressed as a single action, such as `reset_form`.

## 3.1. Origin of the reducer

Where does the name reducer come from? It is derived from the array's `reduce` method. The array's reduce method combines all elements of an array to return a single value. The callback function that reduce receives is referred to as the reducer. This callback has the following structure:

```tsx
function reducer(accumulator, currentValue, currentIndex, array) {
  // ...
}
// However, typically only the first two parameters are used
function reducer(accumulator, currentValue) {
  // ...
}
```

This callback is called while iterating through all elements of the array, where accumulator is the result produced so far and currentValue is the current element being iterated. By taking these two, the callback can return a value that will serve as the accumulator for the next iteration. In this way, the reducer condenses all elements into a single value.

Similarly, React's reducer takes the current state and the action to return the next state, hence the name reducer. You can think of the state as the result of all actions reduced thus far.

# 4. Using the dispatch Function

The basic form of useReducer we have seen is as follows. By passing the reducer function and the initial state to useReducer, we receive a state variable that holds the state and a dispatch function used to update that state.

The dispatcher that accepts actions and performs specific logic for state changes can exist outside the component or in another file, allowing for separation of state change logic, which is one of the advantages of useReducer.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

The dispatch function forwards its received arguments as the second argument to the reducer. It then creates a new state based on the current state and the action provided by dispatch. For example, if there is a dispatch function like this:

```jsx
dispatch({ type: "reset" });
```

Then the reducer is called as `reducer(currentState, {type:"reset"})`, and the value returned here becomes the new state.

This action can be illustrated informally in a diagram.

![Operation of reducer](./reducer-structure.png)

In this case, the dispatch function does not get recreated when the component re-renders. This is also the case for the setState function of useState.

For reference, the `immer` library provides similar functionality. You can use `useImmerReducer`.

# 5. Usage of useReducer - Counter Example

Now that we understand the form of how to use useReducer and how reducers and dispatches work, how do we implement it? Let's create a counter example that everyone makes when starting React. First, we will do it using useState.

```jsx
function Counter() {
  const [number, setNumber] = useState(0);

  const onIncrease = () => {
    setNumber((prev) => prev + 1);
  };

  const onDecrease = () => {
    setNumber(number - 1);
  };

  return (
    <section>
      <h1>{number}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </section>
  );
}
```

Using useReducer transforms it as follows.

```tsx
const initialState = { count: 0 };

function reducer(state: { count: number }, action: { type: string }) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onIncrease = () => {
    dispatch({ type: "increment" });
  };

  const onDecrease = () => {
    dispatch({ type: "decrement" });
  };

  return (
    <section>
      <h1>{state.count}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </section>
  );
}
```

However, the code seems to have become longer, and it doesn't appear that any problem was particularly resolved. Why, then, should useReducer be used? We will explore this in the next article.

# 6. Conceptual Understanding of useReducer's Operation

This section was prepared referencing the "useReducer: A Backend Mental Model" segment from the article [Writing React Like a Pro](https://devtrium.com/posts/how-to-use-react-usereducer-hook#usereducer-a-backend-mental-model) and discussions with [Lee Chang-hee](https://xo.dev/).

Before examining the advantages of using useReducer, let's first intuitively understand how useReducer operates. You can think of useReducer as working similarly to backend systems.

Consider the state as a database and dispatch as the database API. With the action provided to dispatch, we manage the state like managing a database through various APIs. The action.type allows us to choose the type of API, and action.payload allows for data to be included for the API. This is akin to sending data in the request body with a POST method.

The reducer can be thought of as corresponding to the internal logic of an API. Actual backend APIs provide a way to access the database separate from their internal logic. For instance, an API named `AddUser` would typically perform some database query (or a request through ORM) as part of its operation.

However, the user of this API does not need to know what is happening internally; they simply need to call the `AddUser` API. Similarly, someone using useReducer does not need to know the internals of the reducer; they only need to call it by passing an action to the dispatch. The reducer handles everything accordingly.

This separation of state management logic is truly one of the advantages of useReducer, highlighting its differences from useState.

## 6.1. Similar Implementation

The official React documentation also provides an example of implementing useReducer in a similar manner. You can create a very concise piece of code that accepts actions, calls the reducer, and creates state from the results.

```tsx
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    setState(prev => reducer(prev, action));
  }

  return [state, dispatch];
}
```

# References

Belopert's Modern React useReducer section [20. Using useReducer to Separate State Update Logic · GitBook](https://react.vlpt.us/basic/20-useReducer.html)

React official documentation's useReducer https://ko.reactjs.org/docs/hooks-reference.html#usereducer

New official React tutorial on useReducer https://react.dev/learn/extracting-state-logic-into-a-reducer

Detailed article on using useReducer https://devtrium.com/posts/how-to-use-react-usereducer-hook

When useReducer helps with optimization https://stackoverflow.com/questions/54646553/usestate-vs-usereducer

A brief article on when and why to use useReducer https://dev.to/spukas/3-reasons-to-usereducer-over-usestate-43ad#:~:text=useReducer()%20is%20an%20alternative,understand%20for%20you%20and%20colleagues
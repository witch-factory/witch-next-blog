---
title: Exploring React - Utilizing useReducer
date: "2022-09-18T00:00:00Z"
description: "An inquiry into the reasons for using React's useReducer"
tags: ["web", "study", "front", "react"]
---

(Updated on 2023-11-13)

# 1. Introduction

This document explores the reasons for using useReducer.

# 2. Applications of useReducer

We have understood how useReducer operates in terms of syntax and how it can be viewed as a model for managing specific data via APIs, similar to back-end management. Now, let’s explore how to effectively utilize useReducer.

Through various trials and discussions with many individuals (including [Lee Chang-hee](https://xo.dev/) and [Yoo Dong-geun](https://github.com/CreeJee)), the benefits of using useReducer can be summarized as follows:

1. By separating the state management logic, it becomes easier to use the state without needing to understand the internal logic of state updates, thus simplifying complex state management. In other words, it allows for the encapsulation of state update logic.
2. When validating new states upon updates or performing simultaneous actions, logic can be added to the reducer without creating a new function.
3. The dispatch responsible for state updates is a pure function, providing advantages for testing. The reducer function can be tested independently to validate the state update logic.
4. Compared to using useState, it may facilitate easier re-rendering optimization.
5. Since one function handles all state update logic, it may become easier to pinpoint the source of bugs during debugging.

On the other hand, there are drawbacks. Using useReducer requires writing both the reducer function and the actions to be dispatched, which can lead to longer code. Moreover, for simpler update logic, utilizing useState may lead to a more straightforward code structure.

Let’s review each of these cases.

# 3. Managing Complex State

## 3.1 Using useState

The advantage of using useReducer lies in its ability to separate state logic from components, thereby enabling easier management of multiple states and their interrelated actions. For example, suppose we create a sign-up component that collects information such as name, username, email, password, and password confirmation. To manage these five elements, we can utilize useState as follows:

```tsx
interface SignUpFormType {
  "User Name": string;
  "User ID": string;
  "User Email": string;
  "User Password": string;
  "User Confirm Password": string;
}

const initialSignUpForm: SignUpFormType = {
  "User Name": "",
  "User ID": "",
  "User Email": "",
  "User Password": "",
  "User Confirm Password": "",
};

function SignUpForm() {
  const [userSignUpForm, setUserSignUpForm] = useState(initialSignUpForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSignUpForm({
      ...userSignUpForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section>
      <h1>Sign Up</h1>
      <form
        style={{ display: "flex", flexDirection: "column", width: "180px" }}
      >
        {Object.keys(userSignUpForm).map((key) => (
          <label key={key}>
            {key}
            <input
              type="text"
              id={key}
              name={key}
              value={userSignUpForm[key]}
              onChange={handleChange}
            />
          </label>
        ))}
        <button type="submit">Sign Up</button>
      </form>
    </section>
  );
}
```

Although it lacks styling, a simple sign-up form has been completed.

![signupform](./signupform.png)

## 3.2 Using useReducer

Using the same type and `initialSignUpForm`, we can write equivalent code utilizing useReducer as follows:

```tsx
const signUpReducer = (
  state: SignUpFormType,
  action: { type: string; payload: { key: string; value: string } }
) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

const ReducerSignUpForm = () => {
  const [state, dispatch] = useReducer(signUpReducer, initialSignUpForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE",
      payload: {
        key: e.target.name,
        value: e.target.value,
      },
    });
  };

  return (
    <section>
      <h1>Sign Up</h1>
      <form
        style={{ display: "flex", flexDirection: "column", width: "180px" }}
        onSubmit={handleSubmit}
      >
        {Object.keys(state).map((key) => (
          <label key={key}>
            {key}
            <input
              type="text"
              id={key}
              name={key}
              value={userSignUpForm[key]}
              onChange={handleChange}
            />
          </label>
        ))}
        <button type="submit">Sign Up</button>
      </form>
    </section>
  );
};
```

## 3.3 Comparison of useState and useReducer

Observe the code for using useReducer. By crafting appropriate actions and dispatching them, the reducer function autonomously updates the state. This allows for writing code without concerning oneself with the internal logic of state updates.

In the `ReducerSignUpForm` component, one can update the state without worrying about how updates are handled within the dispatch function, which might have been written by someone else. In contrast, when using useState, the state update logic must reside within the `SignUpForm`.

This feature proves to be more convenient than one might expect. For instance, if a reset functionality for the sign-up form must be implemented, using useState would require creating a new function within the sign-up form component:

```tsx
const signUpFormReset = () => {
  setUserSignUpForm(initialSignUpForm);
};
```

However, by utilizing the reducer, one merely needs to add suitable reset logic to the reducer function, allowing the user to call it as follows:

```tsx
const signUpFormReset = () => {
  dispatch({
    type: "RESET",
  });
};
```

While it might seem more practical to consolidate all logic within a small component like this sign-up form, as the component grows larger and more complex, this approach becomes harder to maintain.

In such cases, managing logic separately with useReducer is advisable. Relying on a trusted reducer function for state management and separating concerns is a more maintainable approach.

Moreover, there is a technique where useReducer is combined with the useContext hook. By providing the dispatch function through a ContextProvider, child components can update the state using only the dispatch mechanism.

# 4. Performing Specific Actions During State Setting

There are scenarios where specific actions must occur before performing another task. For example, validating input before updating a sign-up form. UseReducer can be advantageous here.

Suppose the requirement is to restrict typing to a maximum of 10 characters for the user ID in the sign-up form. We can modify the handleChange function accordingly:

```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (userSignUpForm["User ID"].length <= 10) {
    setUserSignUpForm({
      ...userSignUpForm,
      [e.target.name]: e.target.value,
    });
  }
};
```

Alternatively, one could create a new function such as `handleUserIDChange`. However, using useState suggests that `state` and `setState` are getters and setters. It seems odd that the user must validate values before passing them to the setter. Ideally, the setter should independently validate the values.

This can be accomplished using useReducer. Because the reducer function is responsible for managing state updates, we can implement appropriate logic in the reducer. The following example demonstrates state validation during user input without altering the sign-up form component code:

```tsx
const signUpReducer = (
  state: SignUpFormType,
  action: { type: string; payload: { key: string; value: string } }
) => {
  switch (action.type) {
    case "UPDATE":
      if (state["User ID"].length <= 10) {
        return {
          ...state,
          [action.payload.key]: action.payload.value,
        };
      } else {
        return state;
      }
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
```

Of course, this code cannot be used verbatim. If the user inputs an ID exceeding 10 characters, updates to other fields will be blocked. The above code exemplifies how useReducer allows for more robust state update logic that functions effectively.

## 4.1 Using Primitive Values

(Added on 2024-04-11)

The second argument received by the reducer function in useReducer need not be an action object. As long as it appropriately represents the aspect affecting state changes, primitive values can be used effectively. The following `reducer` function receives a numeric `delta` that indicates how much to increase the state and performs different actions based on the given `delta`.

Certainly, similar tasks can be accomplished using useState, but using useReducer helps to isolate complex logic within the reducer function:

```tsx
const reducer = (count: number, delta: number) => {
  if (delta < 0) {
    throw new Error("delta must be positive");
  }
  if (delta > 10) {
    return count; // Ignore if delta is too large
  }
  if (count < 100) {
    return count + delta + 10; // Additional increase
  }
  return count + delta;
};
```

When utilizing this `reducer` in conjunction with useReducer, it can be employed as follows:

```tsx
const [count, dispatch] = useReducer(reducer, 0);

const handleIncrement = () => {
  dispatch(1);
};

const handleIncrement10 = () => {
  dispatch(10);
};

// ...
```

# 5. Optimizing Re-rendering

React re-renders components when state changes occur. However, this process can be resource-intensive; thus, minimizing re-rendering is crucial.

One common trigger for re-rendering is a change in the component's state. In cases where a single function must update multiple states, the following code illustrates setting colors for three different areas:

```tsx
function Colors() {
  const [firstColor, setFirstColor] = useState("red");
  const [secondColor, setSecondColor] = useState("blue");
  const [thirdColor, setThirdColor] = useState("green");

  const setColorSet = () => {
    setFirstColor(secondColor);
    setSecondColor(thirdColor);
    setThirdColor(firstColor);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <button onClick={setColorSet}>Red</button>
      <div
        style={{ backgroundColor: firstColor, width: "100px", height: "100px" }}
      ></div>
      <div
        style={{
          backgroundColor: secondColor,
          width: "100px",
          height: "100px",
        }}
      ></div>
      <div
        style={{ backgroundColor: thirdColor, width: "100px", height: "100px" }}
      ></div>
    </div>
  );
}
```

With this code, three separate re-renders occur (up to React 17). However, if we utilize useReducer, only a single re-render will take place as the state changes cluster together.

# 6. Writing Tests

Pure functions that always return the same result for the same inputs and have no side effects are easy to test. Even when end-to-end testing is not feasible due to time constraints or other reasons, pure functions used in programs can be tested independently.

Since the reducer function passed into useReducer is also a pure function, it inherits the same testing advantages.

# References

Belloper's Modern React useReducer section [20. Using useReducer to Separate State Update Logic · GitBook](https://react.vlpt.us/basic/20-useReducer.html)

Official React documentation on useReducer https://ko.reactjs.org/docs/hooks-reference.html#usereducer

Specific article regarding the use of useReducer https://devtrium.com/posts/how-to-use-react-usereducer-hook

When useReducer helps with optimization https://stackoverflow.com/questions/54646553/usestate-vs-usereducer

A brief article on when and why to use useReducer https://dev.to/spukas/3-reasons-to-usereducer-over-usestate-43ad#:%7E:text=useReducer()%20is%20an%20alternative,understand%20for%20you%20and%20colleagues

About pure functions https://www.learnhowtoprogram.com/react/functional-programming-with-javascript/pure-functions

By Daishi Kato, translated by Lee Seon-hyeop and Kim Ji-eun, "Micro State Management Using React Hooks"
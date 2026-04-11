---
title: Project Troubleshooting - Handling Checkbox Events
date: "2022-08-23T00:00:00Z"
description: "Event handling for checkboxes and default states"
tags: ["web", "study", "front", "react"]
---

# 0. Summary

While dealing with checkboxes in a project, I encountered two issues. The first was deciding whether to use the onClick or onChange event handler function. Considering Internet Explorer, onClick would have been better. However, since IE service has ended and its market share is minimal, it is no longer a significant concern. Nevertheless, I decided to use the onClick event handler, taking into account that changing the value of a checkbox ultimately involves a click event.

Using onClick, however, posed the problem of not being able to use the checked props to specify the initial state of the checkbox. Consequently, I resolved this by using defaultChecked. I will summarize this process.

# 1. onClick vs onChange

There may be cases where actions need to be performed based on the checkbox's checked state. In the project I worked on, there was a case that required using a terms and conditions agreement checkbox. Also, there was a state being passed to another page when navigating from one page to another, which involved handling a checkbox that determined what content to include in that state.

To handle the event of the checkbox being checked or unchecked, two handler functions come to mind: `onChange` and `onClick`. So what is the difference between the two?

I wrote the following code in the App component.

```jsx
function App() {
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    console.log("Checkbox clicked" + e.currentTarget.checked);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Checkbox changed" + e.target.checked);
  };

  return (
    <div>
      <h1>Checkbox Test</h1>
      <label htmlFor="onclick-checkbox">Checkbox using onClick</label>
      <input id="onclick-checkbox" type="checkbox" onClick={handleClick} />
      <label htmlFor="onchange-checkbox">Checkbox using onChange</label>
      <input id="onchange-checkbox" type="checkbox" onChange={handleChange} />
    </div>
  );
}
```

Both checkboxes behave identically in a Chrome environment. However, in Internet Explorer, the onChange event occurs when the checkbox loses focus (this issue does not exist in Edge). To resolve this, it is advisable to use onClick.

# 2. Issues with onClick

However, you might want the checkbox to be initially checked. In this case, consider using the checked props.

```jsx
const [checked, setChecked] = useState(true);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setChecked(!checked);
};

<input
  id="onchange-checkbox"
  type="checkbox"
  checked={checked}
  onChange={handleChange}
/>;
```

By doing this, the `checked` state, which indicates the checkbox's checked status, is initially set to true. Therefore, the checkbox renders as checked at the start. Additionally, it allows for toggling the checked state in the onChange handler. Without onChange, the checkbox's checked state cannot be changed.

But what happens if we use onClick instead?

```jsx
const [checked, setChecked] = useState(true);

const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
  console.log("Checkbox clicked" + e.currentTarget.checked);
  setChecked(!checked);
};

<input
  id="onclick-checkbox"
  type="checkbox"
  checked={checked}
  onClick={handleClick}
/>;
```

In this case, an error occurs. The error message is as follows:

```
Warning: You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.
```

The solution to this error is to follow the advice given in the error message. Since we only want the checkbox to be initially checked, we will set defaultChecked.

```jsx
<input
  id="onclick-checkbox"
  type="checkbox"
  defaultChecked
  onClick={handleClick}
/>
```

This removes the error message, and the checkbox is rendered as initially checked. The onClick event also works as intended. We managed to achieve the desired outcome. However, I briefly investigated why this error occurred.

# 3. Reason for the Error

React provides two methods for creating forms (including inputs): Controlled components and Uncontrolled components. Each of these component types requires specific attributes, and failure to properly set these results in the error mentioned above.

Controlled components require the `value` and `onChange` attributes. For checkboxes or radio button components, they require the `checked` attribute instead of `value`.

Since controlled components are designed to manage specific values, they must derive the value from state or props. Hence, it is expected that they have a value. Also, when this value changes, React needs to be informed of the change through an event handler, which is accomplished via onChange. This is the reason controlled components necessitate the aforementioned two attributes.

In contrast, uncontrolled components are those governed by the DOM itself, rather than by state/props and event handlers. Consequently, they do not require attributes like value or onChange. To access the value of such uncontrolled components, one would typically use useRef or obtain it via its id (using methods such as getElementById).

The attribute that sets the initial value for uncontrolled components is defaultValue or, as used above, defaultChecked (applicable only for checkbox and radio type inputs). It is not mandatory to provide the initial value; unlike the controlled component's value, it does not support handling. It merely provides an initial value.

The error above occurred because the checkbox was supplied with a `checked` prop, indicating to React that it was a controlled component. However, because the required `onChange` was not provided, the error was triggered.

Thus, the resolution involves eliminating `checked` altogether to create an uncontrolled component, passing the initial value through `defaultChecked`, and using `useRef` to manage value retrieval. If we also cover how to retrieve the checkbox value, it would look like this:

```tsx
function App() {
  const checkedRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (checkedRef.current !== null) {
      console.log("Checkbox clicked" + checkedRef.current.checked);
    }
  };

  return (
    <div>
      <h1>Checkbox Test</h1>
      <label htmlFor="onclick-checkbox">Checkbox using onClick</label>
      <input
        ref={checkedRef}
        id="onclick-checkbox"
        type="checkbox"
        onClick={handleClick}
        defaultChecked
      />
    </div>
  );
}
```

If you wish to handle the checkbox as a controlled component, you can do so by managing events using `onChange` instead of `onClick`.

# References

https://devlog.jwgo.kr/2018/11/28/checkbox-error-with-react/

Related Stack Overflow Q&A https://stackoverflow.com/questions/5575338/what-the-difference-between-click-and-change-on-a-checkbox

https://stackoverflow.com/questions/70022781/react-checkbox-event-preventdefault-breaks-onchange-function-why

https://stackoverflow.com/questions/36715901/reactjs-error-warning

Documentation on Uncontrolled and Controlled Components in React
https://reactjs.org/docs/uncontrolled-components.html
https://reactjs.org/docs/forms.html#controlled-components
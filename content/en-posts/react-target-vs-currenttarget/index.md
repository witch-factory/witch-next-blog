---
title: Study of e.target and e.currentTarget
date: "2023-11-26T01:00:00Z"
description: "Handling target and currentTarget"
tags: ["react", "typescript"]
---

# 1. event.target vs event.currentTarget

## 1.1. event.target

Using the `target` property of an event in React is quite common because it contains a reference to the object on which the event occurred. In the following code, when clicking on the `hi` text, it logs the `innerText` of the clicked object, which is `hi`.

```jsx
export function App(props) {
  const handleClick=(e)=>{console.log(e.target.innerText)}

  return (
    <div className='App'>
      <div onClick={handleClick}>hi</div>
    </div>
  );
}
```

## 1.2. vs event.currentTarget

What if we modify the `handleClick` function as follows?

```jsx
const handleClick=(e)=>{console.log(e.currentTarget.innerText)}
```

It still behaves the same way. Clicking `hi` logs `hi` to the console. So what is the difference between these two?

`event.target` points to the object where the event occurred, while `event.currentTarget` points to the object to which the event handler is attached. These can be the same or different. In the above example they were the same, but in the following example, we can see they can differ.

```jsx
export function App(props) {
  const handleClick=(e)=>{
    console.log("target text", e.target.innerText);
    console.log("currentTarget text", e.currentTarget.innerText);
  }
  return (
    <div onClick={handleClick}>
      Parent Element
      <div>Child Element</div>
    </div>
  );
}
```

Running the example and manipulating it produces the following results.

```
Clicking on the child element
> target text Child Element
> currentTarget text Parent Element Child Element

Clicking on the parent element
> target text Parent Element Child Element
> currentTarget text Parent Element Child Element
```

`target` precisely identifies the element that was clicked. When the child element is clicked, it references only the child element and retrieves its `innerText`. When the parent element is clicked, it references the parent element and retrieves its `innerText`.

On the other hand, `currentTarget` always points to the element to which the event handler is attached. Regardless of clicking the child or parent element, it points to the parent element because that is where the event is controlled, and retrieves its `innerText`.

# 2. Working with TypeScript

However, introducing TypeScript complicates matters. For instance, let's recreate the simple example from earlier in TypeScript. We could type `handleClick` as `MouseEventHandler`, but the result remains unchanged.

```tsx
export function App(props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Error: Property 'innerText' does not exist on type 'EventTarget'.
    console.log(e.target.innerText); 
  };

  return (
    <div className='App'>
      <div onClick={handleClick}>hi</div>
    </div>
  );
}
```

But this results in an error, as noted in the comment! It states that `EventTarget` does not have properties like `innerText`. To summarize, this is because `e.target` is defined with the type `EventTarget`. Why does this problem occur, and how can we address it?

## 2.1. Cause of the Problem

If we trace the definition of `React.MouseEvent<T>`, we see that its types follow a certain hierarchy.

![Event Type Structure](./event-type-structure.png)

At the lowest level, the `BaseSyntheticEvent` is defined like this:

```ts
interface BaseSyntheticEvent<E = object, C = any, T = any> {
    nativeEvent: E;
    currentTarget: C;
    target: T;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    persist(): void;
    timeStamp: number;
    type: string;
}
```

The target in many event base types is defined as a generic type `T`. This is restricted to `EventTarget` in the `SyntheticEvent` type that wraps it. Since all event types in React inherit from `SyntheticEvent`, the target in React's event types is limited to the type `EventTarget`.

```ts
interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}
```

In contrast, `currentTarget` is defined as a generic type `C`, which in `SyntheticEvent` is defined as `EventTarget & T`, allowing access to the properties of the referenced element.

## 2.2. Why Is This the Case?

The reason can be found in the comment linked in the definition of the `SyntheticEvent` type. The comment, paraphrased, states:

```ts
/**
 * currentTarget - a reference to the element on which the event listener is registered.
 *
 * target - a reference to the element from which the event was originally dispatched.
 * This might be a child element to the element on which the event listener is registered.
 * If you thought this should be `EventTarget & T`, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508#issuecomment-256045682
 */
```

Upon following the link, the explanation reads:

```
You cannot always tell target's type at compile time. Making it generic is of little value.
target is the origin of the event (which no one really cares about, it might be a span inside a link, for example)
currentTarget is the element that has the event handler attached to, which you should very much care about and type accordingly if you attached a dataset or other attributes to it, and intend to access at runtime.

Relying on target instead of currentTarget is a beginner's mistake that will bite them sooner than latter.
```

In summary, while `target` indicates the element where the event occurred, it is not possible to definitively ascertain the type of that element at compile time.

The event handler is attached to the parent element, but the element where the event occurred could very well be a child element. In such cases, the handler cannot definitively determine the type of `target`.

For example, consider a scenario where you want to run a validation check upon clicking a form. Your code might look like this:

```tsx
function App() {
  const handleClick = (e: React.MouseEvent<HTMLFormElement>) => {
    if (e.currentTarget.checkValidity()) {
      console.log("Validation passed");
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <div className='App'>
      <form onClick={handleClick}>
        <h1>Simple Survey</h1>
        <input type='text' required />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}
```

Since the event handler is attached to the form element, `e.currentTarget` will always be the form element. Hence, you can safely use the `checkValidity` method on `currentTarget` to check validity every time it is clicked.

But what about `e.target`? The TypeScript compiler cannot predict where the user will click to trigger the event. They might click on the `<h1>` tag or the submit button. In that case, `e.target` would be `HTMLHeadingElement` or `HTMLButtonElement`. This multitude of possibilities prevents the type of `e.target` from being definitively established at compile time.

Thus, TypeScript defines types so that element control is only possible through `currentTarget`, which has a reference to the attached event handler and can have its type confirmed at compile time.

## 2.3. Solution

The solution is actually straightforward. Naturally, as mentioned above, you should use `currentTarget`, the reference to the element attached to the event handler, which allows for compile-time type assurance. This is recommended in the aforementioned PR comment, and looking at the type definitions, it is indeed safer.

However, if for some reason you need to access the exact element that triggered the event and wish to use `target`, you can forcefully specify the type using `as`. Of course, if you intend to use methods defined in `EventTarget`, you can do so without using `as`.

```tsx
export function App(props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log((e.target as HTMLDivElement).innerText);
  };

  return (
    <div className='App'>
      <div onClick={handleClick}>hi</div>
    </div>
  );
}
```

# 3. Exceptions and Reasons

It was stated earlier that `e.target` is defined as `EventTarget`, thus not allowing for proper use of the properties of the element where the event occurred. However, the following code operates correctly, accessing the `value` property, which certainly does not exist on the `EventTarget` type!

```tsx
function App() {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className='App'>
      <input value={value} onChange={handleChange} />
    </div>
  );
}
```

This occurs because certain event types redefine the type of `target`. For example, `ChangeEvent` is defined as follows:

```ts
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
}
```

The event handlers that receive this event are defined specifically as `ChangeEventHandler`, which is used for the `onChange` properties of `<input>`, `<select>`, and `<textarea>`.

Thus, when the `event` is of type `ChangeEvent`, `event.target` includes the type of the element where the event occurred, allowing access to the `value` property in this instance, as `event.target` becomes `EventTarget & HTMLInputElement`.

Similarly, other events like `FocusEvent` redefine `e.target`, allowing access to properties without causing type errors, as the exact type of the event-targeting object can be determined.

# 4. Conclusion

Unless there is a compelling reason, event handlers should be attached to the exact elements relevant to the event. There is little reason to attach an event handler to a parent element when you are specifically interested in a child element's click event.

Therefore, it's advisable to use `currentTarget`. 

# References 

https://developer.mozilla.org/en-US/docs/Web/API/Event/target

https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget

https://velog.io/@edie_ko/JavaScript-event-target%EA%B3%BC-currentTarget%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90

https://handhand.tistory.com/287

https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508
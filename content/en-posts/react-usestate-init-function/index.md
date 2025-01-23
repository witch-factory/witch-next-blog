---
title: Delayed Initialization of React State Management Hooks
date: "2024-03-09T00:00:00Z"
description: "React useState initialize function"
tags: ["react"]
---

# Passing Initialization Functions

The React state management hooks, `useState` and `useReducer`, can accept initialization functions that are evaluated only during the first render. For instance, if one needs to create an initial value using a computation that is expensive, it can be done simply like this.

```tsx
const veryExpensiveInitFunction = () => {
  // Generates an initial value using a very expensive operation.
  return veryExpensiveValue;
};

function MyComponent() {
  const [state, setState] = useState(veryExpensiveInitFunction());
  const [state, dispatch] = useReducer(reducer, veryExpensiveInitFunction());
  // ...
  update(current, initialArg, init){
    realUpdate(current, **hook,);
  }
  update(current, veryExpensiveInitFunction(), ...){

  }
}
```

However, this approach calls `veryExpensiveInitFunction()` during every render, even though its result is only needed for the initial rendering.

To optimize this, you can pass the initialization function to `useState` and `useReducer`. This function will not be called until the hook is invoked and will only execute once when the component mounts. In the case of `useReducer`, the second argument `initialArg` is used as the initial value through the third argument `init` function.

```tsx
const [state, setState] = useState(veryExpensiveInitFunction);
const [state, dispatch] = useReducer(reducer, 0, veryExpensiveInitFunction);
```

# Internal Mechanism

How does this internal mechanism facilitate such behavior? [react source code github](https://github.com/facebook/react)

`useState` and `useReducer` can be found in `packages/react/src/ReactHooks.js`.

```js
export function useState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

export function useReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
```

Where does the crucial `resolveDispatcher` reside? It is also located in `packages/react/src/ReactHooks.js`.

```js
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;

  // ... intermediate code omitted ...
  return ((dispatcher: any): Dispatcher);
}
```

In `src/ReactCurrentDispatcher.js`, we find `ReactCurrentDispatcher`.

```js
/**
 * Keeps track of the current dispatcher.
 */
const ReactCurrentDispatcher = {
  current: (null: null | Dispatcher),
};
```

It appears that `ReactCurrentDispatcher.current` is injected elsewhere, which happens in `ReactFiberHooks.js`.

```js
// packages/react-reconciler/src/ReactFiberHooks.js
export function renderWithHooks<Props, SecondArg>(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: (p: Props, arg: SecondArg) => any,
  props: Props,
  secondArg: SecondArg,
  nextRenderLanes: Lanes,
): any {
  // ... intermediate code omitted ...
  if (__DEV__) {
    // Code omitted for development mode
  } else {
    ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;
  }
  // Remaining code omitted...
}
```

We can infer that `HooksDispatcherOnMount` is used when there is neither a current state nor a memoized state, while `HooksDispatcherOnUpdate` is used otherwise.

Since we are curious about the behavior of the 'initialization function', let’s examine `HooksDispatcherOnMount`.

```js
// packages/react-reconciler/src/ReactFiberHooks.js
const HooksDispatcherOnMount = {
  useState: mountState,
  useReducer: mountReducer,
  /*...*/
};
```

`mountState` calls `mountStateImpl`, where it checks whether `initialState` is a function, and if so, calls it to generate the initial value.

In the state update function, although not used, `initialArg` is passed as an argument. If an initialization function is passed, it is executed once at mount time to derive the value, otherwise, `initialArg` is used. If `initialArg` is not a function passed as an argument but the result of a function call (i.e., `veryExpensiveInitFunction()`), then this costly function will be called on every render.

```tsx
function mountStateImpl<S>(initialState: (() => S) | S): Hook {
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    const initialStateInitializer = initialState;
    // $FlowFixMe[incompatible-use]: Flow doesn't like mixed types
    initialState = initialStateInitializer();
    if (shouldDoubleInvokeUserFnsInHooksDEV) {
      setIsStrictModeForDevtools(true);
      // $FlowFixMe[incompatible-use]: Flow doesn't like mixed types
      initialStateInitializer();
      setIsStrictModeForDevtools(false);
    }
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue: UpdateQueue<S, BasicStateAction<S>> = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  };
  hook.queue = queue;
  return hook;
}
```

For `mountReducer`, it generates the initial value based on the presence of the `init` argument.

```js
function mountReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  const hook = mountWorkInProgressHook();
  let initialState;
  if (init !== undefined) {
    initialState = init(initialArg);
    if (shouldDoubleInvokeUserFnsInHooksDEV) {
      setIsStrictModeForDevtools(true);
      init(initialArg);
      setIsStrictModeForDevtools(false);
    }
  } else {
    initialState = ((initialArg: any): S);
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue: UpdateQueue<S, A> = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: (initialState: any),
  };
  hook.queue = queue;
  const dispatch: Dispatch<A> = (queue.dispatch = (dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any));
  return [hook.memoizedState, dispatch];
}
```

# References

https://ko.react.dev/reference/react/useState#avoiding-recreating-the-initial-state
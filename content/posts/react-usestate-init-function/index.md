---
title: React의 상태 관리 훅의 지연 초기화
date: "2024-03-09T00:00:00Z"
description: "React useState initialize function"
tags: ["react"]
---

# 초기화 함수 전달하기

리액트의 상태 관리를 위한 훅인 `useState`와 `useReducer`는 첫 번째 렌더링에서만 평가되는 초기화 함수를 받을 수 있다. 예를 들어서 비용이 아주 큰 연산을 하는 함수를 이용해서 초기화 값을 만들어야 한다고 하자. 간단하게 이렇게 해볼 수 있다.

```tsx
const veryExpensiveInitFunction = () => {
  // 비용이 아주 큰 연산을 이용해 초기화 값을 만든다.
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

하지만 이렇게 하면 `veryExpensiveInitFunction()`의 결과는 초기 렌더링에만 사용됨에도 불구하고 매 렌더링마다 호출된다.

이를 개선하기 위해 `useState`와 `useReducer`에 초기화 함수를 전달할 수 있다. 이 함수는 훅이 호출되기 전까지 호출되지 않으며 컴포넌트가 마운트될 때 한 번만 호출된다. `useReducer`같은 경우 2번째 인자 `initialArg`를 3번째 인자인 `init` 함수를 통해 초기화한 값을 state 초기값으로 사용한다.

```tsx
const [state, setState] = useState(veryExpensiveInitFunction);
const [state, dispatch] = useReducer(reducer, 0, veryExpensiveInitFunction);
```

# 내부

그럼 내부가 어떻게 되어 있길래 이렇게 동작할 수 있는 걸까? [react 소스코드 github](https://github.com/facebook/react)

`useState`와 `useReducer`는 `packages/react/src/ReactHooks.js`에 있다.

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

그럼 핵심인 `resolveDispatcher`는 어디에 있을까? `packages/react/src/ReactHooks.js`에 같이 있다.

```js
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;

  // ... 중간 코드 생략 ...
  return ((dispatcher: any): Dispatcher);
}
```

`src/ReactCurrentDispatcher.js`에 `ReactCurrentDispatcher`가 있다.

```js
/**
 * Keeps track of the current dispatcher.
 */
const ReactCurrentDispatcher = {
  current: (null: null | Dispatcher),
};
```

찾아보니 다른 곳에서 `ReactCurrentDispatcher.current`를 주입해 준다고 한다. 이는 `ReactFiberHooks.js`에서 이루어진다.

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
  // ... 중간 코드 생략 ...
  if (__DEV__) {
    // 개발 모드의 코드들 생략
  } else {
    ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;
  }
  // 이하 생략...
}
```

대략 현재 상태도 메모이제이션된 상태도 없으면 `HooksDispatcherOnMount`를 사용하고, 그렇지 않으면 `HooksDispatcherOnUpdate`를 사용한다는 걸 알 수 있다.

우리는 '초기화 함수'에 대한 동작이 궁금하니까 `HooksDispatcherOnMount`를 살펴보자.

```js
// packages/react-reconciler/src/ReactFiberHooks.js
const HooksDispatcherOnMount = {
  useState: mountState,
  useReducer: mountReducer,
  /*...*/
};
```

`mountState`는 `mountStateImpl`을 호출하는데 거기 보면 이렇게 되어 있다. `typeof`로 `initialState`가 함수인지 판단하고 함수면 호출해서 초기값을 만들어낸다.

이후 state update 함수를 보면 거기에도 사용되지는 않지만 `initialArg`가 인수로 들어가게 된다. 이때 만약 이렇게 초기화 함수로 전달된 인수가 있다면 update할 때는 초기화 함수를 마운트 시에 딱 1번 호출해서 만들어낸 값이 들어가지만 그렇지 않으면 `initialArg`가 들어가게 되는데 이때 만약 `initialArg`가 함수 전달이 아닌 함수 호출(`veryExpensiveInitFunction()`)이라면 이 큰 비용의 함수가 매 렌더링마다 호출되게 된다.

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

`mountReducer`는 이렇게. `init` 인수가 있는지 없는지에 따라서 초기값을 만들어낸다.

```tsx
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


# 참고

https://ko.react.dev/reference/react/useState#avoiding-recreating-the-initial-state
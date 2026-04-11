---
title: Jotai의 Provider 컴포넌트는 어떻게 작동하는 걸까?
date: "2024-03-30T00:00:00Z"
description: "Jotai의 Provider 컴포넌트는 어떻게 작동하는 걸까?"
tags: ["javascript", "study"]
---

# 1. Jotai 소개와 Provider

Jotai는 전역 상태 관리 라이브러리로, Recoil과 비슷한 기능을 제공한다. `useAtom` 훅을 사용하여 바텀업 형태로 상태를 관리할 수 있다. 그런데 `Provider` 라는 컴포넌트를 사용하면 특정 컴포넌트 서브트리에서 다른 상태를 사용할 수 있다.

예를 들어 다음과 같은 Jotai를 사용한 `Counter` 컴포넌트가 있다고 하자.

```jsx
const countAtom = atom(0);

export function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}
```

그럼 `countAtom`은 전역에서 존재하기 때문에 `Counter` 컴포넌트를 사용하는 모든 곳에서 동일한 상태를 사용한다. 그런데 `Provider` 컴포넌트를 사용하면 특정 컴포넌트 서브트리에서 다른 상태를 사용할 수 있다.

다음과 같이 하면 각 `Provider`마다 하위 컴포넌트들이 해당 `Provider`의 전역 상태를 사용하게 된다.

즉 "First TodoList Provider"아래 있는 `Counter` 컴포넌트들과 "Second TodoList Provider"아래 있는 `Counter` 컴포넌트들은 다른 전역 상태를 사용한다는 것이다. 물론 같은 `Provider` 아래에 있는 컴포넌트들은 같은 전역 상태를 사용한다.

```jsx
function App() {
  return (
    <>
      <h1>상태 관리 실험</h1>
      <Provider>
        <h2>First TodoList Provider</h2>
        <Counter />
        <Counter />
      </Provider>
      <Provider>
        <h2>Second TodoList Provider</h2>
        <Counter />
        <Counter />
      </Provider>
    </>
  );
}
```

[React Context API](https://react.dev/reference/react/createContext)의 `Provider` 컴포넌트에서는 우리가 `value` props를 따로 제공함으로써 어떤 값을 전역으로 사용할지 React에게 알려줘야 했다. 그런데 Jotai의 `Provider`는 `value` props를 사용하지 않는다.

그렇다면 Jotai의 `Provider`는 어떻게 작동하여 특정 컴포넌트 서브트리에서 다른 상태를 사용할 수 있게 해주는 걸까? 궁금해서 Jotai의 소스 코드를 살펴보았다.

# 2. Jotai Provider 내부 코드

Jotai는 오픈소스이기 때문에 [GitHub에서 소스코드를 볼 수 있다.](https://github.com/pmndrs/jotai)

## 2.1. Provider 컴포넌트

Jotai의 `Provider` 컴포넌트는 다음과 같이 구현되어 있다.

```jsx
// src/react/Provider.ts
export const Provider = ({
  children,
  store,
}: {
  children?: ReactNode
  store?: Store
}): FunctionComponentElement<{ value: Store | undefined }> => {
  const storeRef = useRef<Store>()
  if (!store && !storeRef.current) {
    storeRef.current = createStore()
  }
  return createElement(
    StoreContext.Provider,
    {
      value: store || storeRef.current,
    },
    children,
  )
}
```

`value` props가 왜 필요없는지는 바로 알 수 있다. `Provider`는 내부적으로 `StoreContext.Provider`를 만들어 사용하며 그때 `value` props에 `store` 또는 `storeRef.current`를 전달하기 때문이다.

그럼 이때 들어가는 `value`는 무엇일까? 일단 Jotai의 atom은 실제 값을 가지고 있는 게 아니다. atom 값을 저장하고 있는 store 객체(WeakMap)가 따로 있다. [`createStore`](https://jotai.org/docs/guides/using-store-outside-react) 함수를 통해 이 store 객체를 만들 수도 있다.

이 store는 각각이 atom 상태들을 독립적으로 저장하고 있다. store는 각 atom들을 실제 상태에 매핑시켜 주는 역할을 한다고 보면 된다. 

## 2.2. createStore 함수

`createStore` 함수의 주석에서 이러한 설명을 찾아볼 수 있다.

```ts
// src/vanilla/store.ts
/**
 * Create a new store. Each store is an independent, isolated universe of atom
 * states.
 *
 * Jotai atoms are not themselves state containers. When you read or write an
 * atom, that state is stored in a store. You can think of a Store like a
 * multi-layered map from atoms to states, like this:
 *
 * ```
 * // Conceptually, a Store is a map from atoms to states.
 * // The real type is a bit different.
 * type Store = Map<VersionObject, Map<Atom, AtomState>>
 * ```
 *
 * @returns A store.
 */
export const createStore = (): Store => {
  // ... 생략 ...
}
```

이걸 알고 나서 `Provider` 컴포넌트를 다시 보자. 기존에 props로 넘겨졌거나 `storeRef.current`에 저장된 store 객체가 없다면 `createStore`함수를 통해 생성하여 `value`로 넣어준다.

만약 외부에서 `createStore` 등으로 store 객체를 따로 생성해서 `Provider`의 props로 넘겨줄 시 해당 store를 사용하게 된다.

```tsx
// src/react/Provider.ts
export const Provider = ({
  children,
  store,
}: {
  children?: ReactNode
  store?: Store
}): FunctionComponentElement<{ value: Store | undefined }> => {
  const storeRef = useRef<Store>()
  if (!store && !storeRef.current) {
    storeRef.current = createStore()
  }
  return createElement(
    StoreContext.Provider,
    {
      value: store || storeRef.current,
    },
    children,
  )
}
```

`useRef`를 사용한 이유는 해당 컴포넌트가 리렌더링될 시에도 값을 유지해 주기 위해서로 보인다. `useRef`를 이렇게 리렌더링 시에도 값이 유지되는 변수처럼 사용하는 방식은 [React 공식 문서에도 소개](https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref)되어 있는 방법이다.

즉 `Provider`는 내부적으로 `StoreContext.Provider`를 사용하고 있으며 `store` 객체를 하위 컴포넌트들에 제공한다. 그런데 하위 컴포넌트들에서는 이러한 `store` 객체를 어떻게 가져다 쓰는 걸까?

# 3. useStore 훅

## 3.1. 훅 정의

Provider 컴포넌트 코드가 있는 파일에는 `useStore`라는 훅도 정의되어 있다. 말 그대로 store를 가져다 쓰기 위한 훅이다.

만약 훅의 인자를 통해 store가 넘어왔다면 해당 store를, 아니라면 `StoreContext`에서 가져온 store를 반환한다. 둘 다 아닐 경우 컴포넌트를 감싸는 `Provider` 컴포넌트 없이 Jotai atom을 사용했을 때 사용되는 기본 store를 반환한다(이 기본 store를 반환하는 게 바로 `getDefaultStore()`함수이다).

```tsx
type Options = {
  store?: Store
}

export const useStore = (options?: Options): Store => {
  const store = useContext(StoreContext)
  return options?.store || store || getDefaultStore()
}
```

즉 `useStore`는 어디선가 쓰여야 할 store 객체를 가져오는 훅이라고 할 수 있다.

## 3.2. useStore 훅을 통해 store 가져오기

이 훅이 바로 `useAtom`에서 `Provider`가 제공하는 `store`를 가져다 쓰는 역할을 한다.

`useAtom`훅은 다음과 같이 정의되어 있다.

```tsx
// src/react/useAtom.ts
export function useAtom<Value, Args extends unknown[], Result>(
  atom: Atom<Value> | WritableAtom<Value, Args, Result>,
  options?: Options,
) {
  return [
    useAtomValue(atom, options),
    // We do wrong type assertion here, which results in throwing an error.
    useSetAtom(atom as WritableAtom<Value, Args, Result>, options),
  ]
}
```

`useAtomValue`와 `useSetAtom`을 반환한다. `useAtomValue`는 atom의 값을 가져오는 훅이고 `useSetAtom`은 atom의 값을 변경하는 함수를 가져오는 훅이다.

atom의 값만 필요할 때, 혹은 값을 변경하는 함수만 필요할 때에 `useAtomValue`와 `useSetAtom`을 따로 사용할 수도 있다. 아무튼 해당 함수들의 내부를 보면 `useStore` 훅을 사용하여 `store`를 가져오는 것을 볼 수 있다.

```tsx
// src/react/useAtomValue.ts
export function useAtomValue<Value>(atom: Atom<Value>, options?: Options) {
  const store = useStore(options)
  // ... 생략 ...
}

// src/react/useSetAtom.ts
export function useSetAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  options?: Options,
) {
  const store = useStore(options)
  // ... 생략 ...
}
```

이런 방식으로 각 `Provider` 컴포넌트의 하위 컴포넌트들에서 각각 다른 `store`를 사용할 수 있게 된다.

## 3.3. 메모리 누수 방지책, WeakMap

그러면 `Provider` 컴포넌트가 여러 개 있을 때 각각의 `Provider` 컴포넌트가 각각의 store를 사용하게 되는데, 이렇게 여러 개의 store가 생기면 메모리 낭비가 발생하지 않을까 걱정할 수 있다.

하지만 Jotai의 store 객체는 [WeakMap](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)으로 관리된다. 또한 store 객체 내부의 atom 상태들도 WeakMap으로 관리되고 있다.

따라서 사용되지 않는 atom의 경우 store 객체에서 해당 atom을 참조하고 있는 것과 상관없이 GC에 의해 메모리에서 해제된다. 그러면 각 store 객체는 오직 내부에서 사용되는 atom 상태들만을 가지고 있게 된다. 그래서 store 객체가 여러 개 생겨도 메모리 낭비가 발생하지 않는다.

# 4. 정리

Jotai의 `Provider` 컴포넌트는 `StoreContext.Provider`를 사용하여 `store`를 하위 컴포넌트들에 제공한다. `store`들은 각각 atom 상태들을 독립적으로 저장하고 있다.

atom 값을 가져오는 `useAtomValue`와 atom 값을 변경하는 함수를 가져오는 `useSetAtom` 훅은 내부적으로 `useStore` 훅을 사용하여 가장 가까운 `Provider`의 `store`객체를 가져와서 해당 `store`의 atom 상태들을 사용한다.

이런 방식으로 서로 다른 `Provider`에 속한 하위 컴포넌트들은 각각이 `Provider`마다 다른 store 객체를 사용하게 되고 따라서 서로 다른 전역 상태를 사용할 수 있게 된다. 이때 store 객체는 WeakMap으로 관리되어 메모리 낭비가 발생하지 않는다.

# 참고

다이시 카토 지음, 이선협, 김지은 옮김, "리액트 훅을 활용한 마이크로 상태 관리"

Jotai의 Provider 공식 문서

https://jotai.org/docs/core/provider

Jotai createStore, getDefaultStore

https://jotai.org/docs/core/store

Jotai 소스 코드

https://github.com/pmndrs/jotai

MDN의 WeakMap 문서

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap


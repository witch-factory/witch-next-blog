---
title: How Does the Provider Component of Jotai Work?
date: "2024-03-30T00:00:00Z"
description: "How Does the Provider Component of Jotai Work?"
tags: ["javascript", "study"]
---

# 1. Introduction to Jotai and Provider

Jotai is a global state management library that provides functionality similar to Recoil. It allows for bottom-up state management using the `useAtom` hook. By using the `Provider` component, different states can be utilized within specific component subtrees.

For instance, consider a `Counter` component that utilizes Jotai:

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

Since `countAtom` exists globally, the same state is shared across all instances of the `Counter` component. However, by using the `Provider` component, different states can be accessed within specific component subtrees.

As shown below, each `Provider` allows its child components to utilize the global state of that specific `Provider`.

This means that `Counter` components under the "First TodoList Provider" and those under the "Second TodoList Provider" operate with different global states. Of course, components under the same `Provider` share the same global state.

```jsx
function App() {
  return (
    <>
      <h1>State Management Experiment</h1>
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

With the `Provider` component from the [React Context API](https://react.dev/reference/react/createContext), it was necessary to specify the value to be used globally via the `value` props. However, Jotai's `Provider` does not utilize `value` props.

So how does Jotai's `Provider` function to allow different states to be accessed within specific component subtrees? I was curious and reviewed Jotai's source code.

# 2. Internal Code of Jotai Provider

Since Jotai is open source, the [source code can be viewed on GitHub](https://github.com/pmndrs/jotai).

## 2.1. Provider Component

Jotai's `Provider` component is implemented as follows:

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

The reason `value` props are unnecessary becomes clear. The `Provider` internally creates and utilizes `StoreContext.Provider`, passing either `store` or `storeRef.current` as `value` props.

What does this `value` represent? Jotai's atoms do not hold actual values; instead, a separate store object (WeakMap) holds the atom values. The `createStore` function can be used to create this store object.

This store independently maintains the state of each atom. You can think of the store as a mechanism that maps each atom to its actual state.

## 2.2. createStore Function

The documentation for the `createStore` function provides the following explanation:

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
  // ... omitted ...
}
```

With this understanding, let's revisit the `Provider` component. If there is no existing store object passed as props or stored in `storeRef.current`, the component will create one using the `createStore` function and assign it to `value`.

If an external store object is created using `createStore` or similar methods and passed to the `Provider`, that specific store will be used.

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

The use of `useRef` appears to be for maintaining the value even upon re-rendering of the component. This usage of `useRef` to keep a value across re-renders is also described in the [official React documentation](https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref).

Thus, the `Provider` internally uses `StoreContext.Provider` to provide the `store` object to child components. But how do the child components utilize this `store` object?

# 3. useStore Hook

## 3.1. Hook Definition

The file containing the `Provider` component code also defines a `useStore` hook, intended for accessing the store.

If the hook receives a store through its arguments, it returns that store; otherwise, it returns the store retrieved from `StoreContext`. If neither is the case, it returns the default store used when Jotai atoms are utilized without a wrapping `Provider` component (the function `getDefaultStore()` returns this default store).

```tsx
type Options = {
  store?: Store
}

export const useStore = (options?: Options): Store => {
  const store = useContext(StoreContext)
  return options?.store || store || getDefaultStore()
}
```

Therefore, `useStore` can be seen as a hook for retrieving the store object that should be utilized.

## 3.2. Accessing Store Through useStore Hook

This hook is responsible for fetching the `store` provided by the `Provider` within `useAtom`.

The `useAtom` hook is defined as follows:

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

It returns `useAtomValue` and `useSetAtom`. `useAtomValue` retrieves the atom's value, while `useSetAtom` provides a function for modifying the atom's value.

When only the atom's value or the function for modifying it is needed, `useAtomValue` and `useSetAtom` may be used separately. In any case, examining the internals of these functions reveals that they utilize the `useStore` hook to obtain the `store`.

```tsx
// src/react/useAtomValue.ts
export function useAtomValue<Value>(atom: Atom<Value>, options?: Options) {
  const store = useStore(options)
  // ... omitted ...
}

// src/react/useSetAtom.ts
export function useSetAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  options?: Options,
) {
  const store = useStore(options)
  // ... omitted ...
}
```

In this way, child components from each `Provider` component can utilize different `store` objects.

## 3.3. Memory Leak Prevention with WeakMap

When multiple `Provider` components exist, one might worry about memory waste due to having several `store` instances.

However, Jotai's store objects are managed through [WeakMap](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap). Additionally, the atom states within the store objects are also managed using WeakMap.

Thus, if an atom is no longer in use, the store object will not retain a reference to that atom, allowing the garbage collector to free it from memory. Therefore, each store object only retains atom states that are actively in use, preventing memory waste even when multiple store objects are created.

# 4. Conclusion

Jotai's `Provider` component utilizes `StoreContext.Provider` to provide the `store` to its child components. Each `store` independently maintains the atom states.

The `useAtomValue` hook for retrieving atom values and the `useSetAtom` hook for obtaining functions to modify these values internally utilize the `useStore` hook to access the `store` object from the nearest `Provider`.

Through this methodology, child components belonging to different `Providers` can each utilize different store objects, thereby allowing distinct global states to be accessed. The store objects are managed via WeakMap, ensuring no memory waste occurs.

# References

Daiichi Kato, Lee Seon-hyeop, Kim Ji-eun, "Micro State Management Using React Hooks"

Official Documentation for Jotai's Provider

https://jotai.org/docs/core/provider

Jotai createStore, getDefaultStore

https://jotai.org/docs/core/store

Jotai Source Code

https://github.com/pmndrs/jotai

MDN Documentation on WeakMap

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
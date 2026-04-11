---
title: Managing Global State with SWR
date: "2023-03-21T02:00:00Z"
description: "Can SWR also manage global state?"
tags: ["web", "study", "front"]
---

# 1. Is it possible to manage global state with SWR?

SWR is a library used in React that helps with data fetching. It emerged from the philosophy that the concerns of clients and servers should be separated. Therefore, it aids in fetching server data.

This serves a clearly different purpose than global state management libraries like Recoil or Jotai. However, it seems that global state management is also possible with SWR, so let's explore how.

Assuming SWR is already installed.

# 2. Managing Global State with Context API

To manage global state, two different components need to share the same data. For example, in the following situation, components A and B should share the same data. Instead of passing the data managed in MyPage to A and B via props, we want A to fetch the necessary data immediately for its use.

If we implement global state management using React's built-in Context API, it would look like this:

```jsx
export const MyContext = React.createContext("default value");

function MyPage() {
  const contextData = "The wings of a nail are the masterpiece of the century";

  return (
    <MyContext.Provider value={contextData}>
      <section>
        <A />
        <B />
      </section>
    </MyContext.Provider>
  );
}
```

Components wrapped in the Provider can access and use the context value.

```jsx
function A() {
  const context = React.useContext(MyContext);
  return <div>{context}</div>;
}

function B() {
  const context = React.useContext(MyContext);
  return <div>{context}</div>;
}
```

Now, let's see how to achieve the same with SWR.

# 3. Managing Global State with SWR

SWR caches fetched data somewhere locally and links it to the key used for the fetch. If there are no refresh requests, it uses that cache.

For example, if a dataset is saved at the URL `/data`, and we need that data but do not have it, we will fetch it anew. However, if the data has already been fetched and does not need updating, SWR will provide it from the cache. This means SWR caches the data somewhere in the client!

Hence, we can consider this a simple way to manage global state.

## 3.1. Creating State

Managing global state with SWR is implemented by linking the data to the key given to useSWR. We can write as follows. First, let's create a state using SWR.

```jsx
const { data, mutate } = useSWR("global", {
  fallbackData: "The feelings that rise every night, making me think I can do anything",
});
```

This code snippet creates a client cache linked to the key "global". Since there is no cache yet, SWR will send a request to the fetcher at `http://localhost:3000/global`. However, we have not provided the fetcher argument, so it will send the request using the default fetcher:

```jsx
fetcher = window.fetch(url).then(res => res.json())
```

There is nothing at `http://localhost:3000/global`, so an error will occur in the fetcher. However, there is no catch code for this, so it will simply be ignored. Nevertheless, since the fetch failure is recognized, the fallbackData will be applied to the client cache, linked to the key "global".

Thus, the current client cache is linked to the key "global" with the data "The feelings that rise every night, making me think I can do anything". This can be accessed through the data variable.

```jsx
function A() {
  const { data, mutate } = useSWR("global", {
    fallbackData: "The feelings that rise every night, making me think I can do anything",
  });
  if (!data) {
    return <div>Loading</div>;
  }
  return <div>{data}</div>;
}
```

## 3.2. Changing State

How can we change the global state we have stored? By using `mutate`. SWR's mutate allows for modifications to the client cache. For detailed information on this API, refer to the [official documentation](https://swr.vercel.app/ko/docs/mutation).

Although we could pass an asynchronous function to mutate to change the data on the server, we will simply update the cache for global state management.

The above state data is song lyrics, and let's implement a button that displays the next line of lyrics when clicked.

```jsx
function A() {
  const { data, mutate } = useSWR("global", {
    fallbackData: "The feelings that rise every night, making me think I can do anything",
  });
  if (!data) {
    return <div>Loading</div>;
  }
  return (
    <div>
      {data}
      <button
        onClick={() => {
          mutate("Embracing the unhealed past, silently rotting");
        }}
      >
        Next Line
      </button>
    </div>
  );
}
```

In this code, `mutate` uses the return value from useSWR, so the key is bound by default. Therefore, we only need to specify how to update the client cache. Thus, when the button is clicked, the client cache linked to "global" gets updated.

After updating the client cache with mutate, the data returned from useSWR will automatically refresh to reflect the latest fetched server data. However, since our code cannot fetch server data (specifically due to an error), the client cache updated by mutate continues to be in use.

We utilize the client cache like a global state, thus managing the state with SWR.

## 3.3. Minimizing Fetch Requests

Too many data fetch requests are undesirable. How many fetch requests is our code sending currently?

We can print console messages whenever a fetch occurs to determine how many requests are being made. Let’s write the fetcher function as follows, simply adding console logging functionality to the default fetcher.

```jsx
const fetcher = (url: string) => {
  console.log("Fetch request");
  return fetch(url).then((res) => res.json());
};
```

We then add this fetcher to the previous code's useSWR arguments.

```tsx
function A() {
  const { data, mutate } = useSWR("global", fetcher, {
    fallbackData: "The feelings that rise every night, making me think I can do anything",
  });
  if (!data) {
    return <div>Loading</div>;
  }
  return (
    <div>
      {data}
      <button
        onClick={() => {
          mutate("Embracing the unhealed past, silently rotting");
        }}
      >
        Next Line
      </button>
    </div>
  );
}
```

Rendering the A component in this state will result in repeated console messages for fetch requests. Even without updating the client cache, fetch requests happen frequently, especially after using mutate.

Our ultimate goal should be to perform fetch requests only when updating the client cache, avoiding unnecessary requests otherwise. Let's implement changes to eliminate unnecessary fetches.

Firstly, retries occur when errors happen during fetch. However, since we are only using the client cache, this option is not actually necessary. Setting `shouldRetryOnError` to false in the useSWR options will prevent retries.

```tsx
const { data, mutate } = useSWR("global", fetcher, {
  fallbackData: "The feelings that rise every night, making me think I can do anything",
  shouldRetryOnError: false,
});
```

SWR has automatic revalidation options that are enabled by default. Options like `revalidateIfStale`, `revalidateOnFocus`, and `revalidateOnReconnect` result in excessive revalidation. While `focusThrottleInterval` is set to 5 seconds by default, which prevents it from happening too frequently, unnecessary requests still occur.

To disable all types of automatic revalidation, we can use `useSWRImmutable`.

```tsx
const { data, mutate } = useSWRImmutable("global", fetcher, {
  fallbackData: "The feelings that rise every night, making me think I can do anything",
  shouldRetryOnError: false,
});
```

After doing this, we will see fetch requests occur only when updating the state.

# 4. Creating a Custom Hook

We can transform this into a custom hook, making it usable as global state management.

## 4.1. First Custom Hook

Since we managed song lyrics as global state earlier, let's create a global store hook called `useSong`.

```tsx
function useSong() {
  const { data: song, mutate: setSong } = useSWRImmutable("song", fetcher, {
    fallbackData: "The feelings that rise every night, making me think I can do anything",
    shouldRetryOnError: false,
  });
  return [song, setSong];
}
```

This behaves similarly to useState.

```tsx
function A() {
  const [song, setSong] = useSong();
  return (
    <div>
      {song}
      <button
        onClick={() => {
          setSong("Embracing the unhealed past, silently rotting");
        }}
      >
        Next Line
      </button>
    </div>
  );
}
```

Other components can also utilize useSong, and we can see that the state is shared.

## 4.2. Improved Custom Hook

Let’s create a `useSWRStore` hook that takes a key and initial value to allow flexible use. States should share the same value when they have the same key.

```tsx
function useSWRStore(key: string, initialData: any) {
  const { data, mutate } = useSWRImmutable(key, fetcher, {
    fallbackData: initialData,
    shouldRetryOnError: false,
  });
  return [data, mutate];
}
```

Using this hook would allow us to rewrite the previous component using useSong as follows:

```tsx
function A() {
  const [song, setSong] = useSWRStore(
    "song",
    "The feelings that rise every night, making me think I can do anything"
  );
  return (
    <div>
      {song}
      <button
        onClick={() => {
          setSong("Embracing the unhealed past, silently rotting");
        }}
      >
        Next Line
      </button>
    </div>
  );
}
```

However, there is an issue. By passing initialData as an argument to every global state hook, various states can coexist.

This can be resolved by removing the initialData argument from the useSWRStore hook and setting the fallback in a higher-level SWRConfig.

For instance, we can do the following, setting "initial value" as the fallback value for the key song. Then, when components A and B use `useSWRStore("song");`, the initial value will automatically be set to "initial value". The edit process remains the same.

```tsx
<SWRConfig
  value={{
    fallback: {
      song: "initial value",
    },
  }}
>
  <section>
    <A />
    <B />
  </section>
</SWRConfig>
```

Example of using useSWRStore in component A:

```tsx
function A() {
  const [song, setSong] = useSWRStore("song");
  return (
    <div>
      {song}
      <button
        onClick={() => {
          setSong("Embracing the unhealed past, silently rotting");
        }}
      >
        Next Line
      </button>
    </div>
  );
}
```

It may feel increasingly complex, but it demonstrates that managing global state using SWR's client caching is possible. However, for complex global states, it might be better to use separate libraries dedicated to global state management like zustand or Recoil.

# 5. Additional Notes

The default fetcher we examined lacks handling for Promise errors. It seemed odd, but it is said that not catching unhandled errors is better.

The reason for catching promises is to take action in case errors occur in areas where errors might happen. This is similar to using try-catch.

However, if no real error handling is performed in the catch block, like simply logging to console with `console.log(err)`, it does not count as error handling.

Additionally, modern JavaScript has methods to handle unhandled promise rejections, so it is not necessary to use catch.

[Reference 1](https://stackoverflow.com/questions/54892213/creating-reusable-promises-without-catch)

[Reference 2](https://stackoverflow.com/questions/50896442/why-is-catcherr-console-errorerr-discouraged)

# References

https://velog.io/@e_juhee/Global-state

https://paco.me/writing/shared-hook-state-with-swr

Default fetcher of SWR https://github.com/vercel/swr/discussions/910

Fetch https://www.daleseo.com/js-window-fetch/

https://ko.javascript.info/promise-error-handling

https://velog.io/@code-bebop/SWR-%EC%8B%AC%EC%B8%B5%ED%83%90%EA%B5%AC
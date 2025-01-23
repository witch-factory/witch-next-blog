---
title: Learning the Data Fetching Library SWR
date: "2023-03-09T02:00:00Z"
description: "SWR library learning record"
tags: ["web", "study", "front"]
---

# 1. Background Explanation

In the front-end, there are many instances where data stored on the server is handled. For example, fetching and managing user profile information.

Originally, when managing this data, it was typical to use useEffect to retrieve information from the server upon page load and store it in the front-end. Additionally, when the server data is updated, the front-end must continuously handle that aspect.

With the introduction of React 18, Suspense has made asynchronous processing during page loading easier, but storing data fetched from the server in the front-end remains the same.

In this scenario, libraries like SWR and React Query have emerged with the philosophy that server data should not be stored in the front-end and interests should be separated.

Among them, I experimented with a library called SWR. It stands for stale-while-revalidate. The strategy first returns data from the cache, then revalidates with a fetch and fetches the latest data. Although SWR seems to be overshadowed by React Query nowadays, I decided to give the original a try.

## 1.1. stale-while-revalidate

(Added on 2023.07.04)

`stale-while-revalidate` is an extension of HTTP cache control, and SWR is a library that implements and extends this concept.

So, what is `stale-while-revalidate`?

It helps maintain a balance between immediacy—loading cached content immediately—and freshness—ensuring that updated cached content will be used in the future. How? By displaying cached data first and updating that data in the background.

The HTTP Cache-Control header that includes `stale-while-revalidate` must also include max-age. This max-age allows determining whether the cached response is stale. We can use these two parameters to evaluate the response of the local cache and take subsequent actions.

For example, let's say there is a cached response at the 0-second mark. The Cache-Control header for this response looks like this:

```
Cache-Control: max-age=60, stale-while-revalidate=120
```

If requests are repeated within the 60 seconds, the cache value is still current since it has not yet reached max-age. Thus, the cached response is returned without revalidation.

If requests are repeated between 60 seconds and 120 seconds, the cached value is stale, but the cached response is returned due to `stale-while-revalidate`. Then, a new response is fetched in the background. Once the new response arrives, the cache will be updated.

If a request occurs after more than 120 seconds, the stale cached content can no longer be used. Therefore, a new response must be fetched from the server, and the cache will be updated.

The SWR library adopts this strategy to quickly return content from the stale cache while revalidating the cached content in the background to ensure that the cached data is up to date.

![swr logic](./swr.svg)

# 2. vs React-query

In the future, I may try using React Query and compare the two. However, I came across a well-composed comparison on [Mad Up's Tech Blog](https://tech.madup.com/react-query-vs-swr/) and read it.

React Query supports modifying server data through mutations, provides devTools by default, and allows for convenient fetching of previous page data using default properties when using UI components like infinite scrolling.

React Query automatically returns the currently cached data until fetching the next data. While this is possible in SWR, it requires additional code.

React Query allows extraction of query result portions using something called selector. It also optimizes rendering performance by updating components only when queries are updated and bundling updates when multiple components use the same query.

The feature of garbage collection for unused queries after a specified period is also exclusive to React Query.

For further details, you can check the [comparison in the official React Query documentation](https://tanstack.com/query/latest/docs/react/comparison?from=reactQueryV3&original=https%3A%2F%2Ftanstack.com%2Fquery%2Fv3%2Fdocs%2Fcomparison). While React Query does have its advantages, according to the [Kakao Tech Blog](https://fe-developers.kakaoent.com/2022/220224-data-fetching-libs/), transitioning from SWR to React Query is simple with minimal changes, and since SWR was released first, I wanted to give it a test.

I plan on creating a simple todoList.

First, let’s install SWR in the application created with CRA. I used TypeScript here.

```bash
npm i swr
```

# 3. Mocking the Server

To mock a simple server, I used json-server. I considered using MSW, but it has a steeper learning curve compared to json-server, so I will explore that later while studying testing.

First, let's create a folder and install json-server.

```bash
mkdir json-server-test && cd json-server-test
npm init -y
npm install json-server
```

Next, create a db.json file at the project root. Here is a simple todo list file.

```json
{
  "todos": [
    {
      "id": 1,
      "content": "Learn React",
      "done": false
    },
    {
      "id": 2,
      "content": "Learn Redux",
      "done": false
    },
    {
      "id": 3,
      "content": "Learn React Native",
      "done": false
    }
  ]
}
```

Now add the following to the scripts section of package.json in the json-server-test folder. This will run the json-server on port 5000.

```json
"scripts": {
  "start": "json-server --watch db.json --port 5000",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

Running the command `npm start` will start the server as shown below.

![json-server-open](./json-server-open.png)

# 4. Basic Usage of SWR

I will use axios to send requests to the server. So, let’s return to the todo list folder and install axios.

```bash
npm i axios
```

Now, let’s create a fetcher function to fetch data from the URL.

```jsx
import axios from 'axios';
const fetcher = (url: string) => axios.get(url).then((res) => res.data);
```

Next, let’s create a simple element to represent the todo items in the TodoList. More elements, such as for indicating completion, need to be created, but for now, I will just show the list elements.

```tsx
interface Todo {
  id: number;
  content: string;
  done: boolean;
}

function TodoListItem({ todo }: { todo: Todo }) {
  return (
    <li>
      <span>{todo.content}</span>
    </li>
  );
}
```

Now, I will use the useSWR function. I will use it in the simplest way by fetching the URL and fetcher function.

```tsx
function TodoListPage() {
  const { data, error } = useSWR("http://localhost:5000/todos", fetcher);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <ul>
      {data
        ? data.map((todo: Todo) => <TodoListItem key={todo.id} todo={todo} />)
        : null}
    </ul>
  );
}
```

This confirms that the data is being fetched correctly.

![useswr](./useswr-res.png)

Alternatively, I can use isLoading to format it like this.

```tsx
function TodoListPage() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:5000/todos",
    fetcher
  );

  if (error) {
    return <div>failed to load!</div>;
  }
  if (isLoading) {
    return <div>loading TodoList...</div>;
  }

  return (
    <ul>
      {data
        ? data.map((todo: Todo) => <TodoListItem key={todo.id} todo={todo} />)
        : null}
    </ul>
  );
}
```

# 5. useSWR

useSWR is used as follows. All arguments except for key are optional, so they can be omitted. Interestingly, the fetcher is not mandatory.

It turns out there is a way to provide a global fetcher, and in this case, it can be omitted. I will summarize how to do the global setting later.

```tsx
const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, options)
```

As seen above, the key is the request URL. A function, array, or null can also be provided. The fetcher is a promise that returns a function for fetching data, and options is an object containing additional options.

## 5.1. Return Values

useSWR returns the following values.

- data: the data fetched by the fetcher function for the provided key. It is undefined when not yet loaded.
- error: if an error occurs during the fetch operation of the fetcher function for the provided key, it returns the error object. It is undefined when there is no error.
- isLoading: true if there is an ongoing request and no data has been loaded, otherwise false.
- isValidating: true if data is being requested or updated, otherwise false.
- mutate(data?, options): modifies the cached data.

The usage of mutate will be covered in more detail later.

## 5.2. Options Object

The options object can have the following properties. 

### 5.2.1. Suspense

The suspense feature available from React 18 can be utilized. To activate it, set suspense to true in the options object. However, React does not recommend using suspense for data fetching frameworks.

We can modify the TodoListPage like this using Suspense. Typically, when suspense is activated, data is always ready at the time of rendering.

```tsx
function TodoListPage() {
  const { data } = useSWR("http://localhost:5000/todos", fetcher, {
    suspense: true,
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ul>
        {data
          ? data.map((todo: Todo) => <TodoListItem key={todo.id} todo={todo} />)
          : null}
      </ul>
    </Suspense>
  );
}
```

### 5.2.2. Auto-refresh Options

SWR automatically refreshes the data at certain points. It offers options like refreshInterval, refreshWhenHidden, refreshWhenOffline, revalidateOnFocus, revalidateOnReconnect, and revalidateOnMount.

revalidateOnFocus is an option that automatically refreshes the data when the page gains focus or the tab is switched. This option is true by default.

refreshInterval sets the period for refreshing the data. This option only refreshes while the associated components are on the screen. It defaults to 0 and can be set in milliseconds. If a function is provided, it receives the latest data as an argument and returns the refresh interval.

```tsx
// Passing a number
const { data } = useSWR(key, fetcher, {
  refreshInterval: 1000
})

// Passing a function
const { data } = useSWR(key, fetcher, {
  refreshInterval: (data) => data.interval
})
```

revalidateOnReconnect is the option that automatically refreshes the data when the network connection is lost and then restored. It is generally true by default to refresh data when the network recovers.

revalidateOnMount is the option that automatically refreshes the data when the component mounts.

revalidateIfStale is the option that automatically refreshes the data if it is stale when the component mounts. This option is true by default.

refreshWhenHidden and refreshWhenOffline, as the names imply, automatically refresh the data when the browser tab is hidden or when the browser is offline. These options are false by default, meaning SWR does not refresh data if the page is not displayed or if the network connection is offline.

If a server resource does not change after being fetched, all automatic refresh options can be disabled to reduce unnecessary requests.

```tsx
const { data } = useSWR(key, fetcher, {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false
});
```

From SWR 1.0 onwards, the hook useSWRImmutable is provided to fetch immutable resources, disabling automatic refresh and ensuring data remains unchanged.

```tsx
const { data } = useSWRImmutable(key, fetcher);
```

Both hooks above provide identical functionality.

### 5.2.3. Error Related Options

shouldRetryOnError is an option that determines whether to retry when an error occurs. This option is true by default.

errorRetryInterval sets the interval for retrying when an error occurs. The default is 5 seconds, and it can be set in milliseconds. In slow network environments, the retry interval is set to 10 seconds by default.

errorRetryCount is an option that sets the number of retry attempts when an error occurs.

### 5.2.4. Refresh Interval Options

dedupingInterval is an option that sets the interval for preventing duplicate requests when multiple requests with the same key come in. It is set in milliseconds and defaults to 2 seconds.

focusThrottleInterval is an option that sets the interval for preventing refreshes when focus events occur. It is set in milliseconds and defaults to 5 seconds.

loadingTimeout sets the time to show a loading state when fetching data takes a long time. It is set in milliseconds and defaults to 3 seconds; if data fetching takes longer than this, the onLoadingSlow callback is called.

### 5.2.5. Other Callback Functions

onSuccess(data, key, config) is the callback function that is called when the data is fetched successfully.

onError(err, key, config) is the callback function that is executed when an error occurs during data fetching.

onErrorRetry(err, key, config, revalidate, revalidateOps) is the callback function called when retries are attempted after the onError callback is invoked.

onDiscarded(key) is executed when requests for this key are ignored due to race conditions.

There are other functions like compare, isPaused, and use, but they seem unnecessary for practical use; I’ll just keep them in mind.

# 6. Global Configuration

SWR supports global configuration. By using the SWRConfig component, it is possible to set the options for SWR hooks used within all components inside this component at once.

```tsx
import { SWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig
      value={options}
    >
      <Component />
    </SWRConfig>
  )
}
```

The values that can be placed in the options object above are the same as the options for useSWR. It hasn’t been addressed earlier, but this options argument can also include the fetcher function.

By using this, a common fetcher function used in a specific SWRConfig can be configured. In this case, it is not necessary to provide a fetcher function to the useSWR hook. However, providing a fetcher separately would override this setting.

If nested SWRConfig components are used, the settings of the upper context will be overridden.

Additionally, the value object of SWRConfig can include function values. When function values are included, the function receives the upper config settings as an argument and returns new settings.

The useSWRConfig hook can be used to retrieve the current settings of SWRConfig.

```tsx
import { useSWRConfig } from 'swr'

function Component() {
  // If there is no SWRConfig in the parent component, return the default values
  const { cache, mutate, ...restConfig } = useSWRConfig()
  // ...
}
```

# 7. Error Handling

When an error occurs in the operation of the fetcher function provided to the useSWR hook, it is returned as an error. This means that if an error is thrown, the error is returned.

```tsx
const {data, error}=useSWR(key, fetcher);
```

You can configure the fetcher to return more information when it fails and passes an error object. This can be referenced [here](https://swr.vercel.app/ko/docs/error-handling#%EC%83%81%ED%83%9C-%EC%BD%94%EB%93%9C%EC%99%80-%EC%97%90%EB%9F%AC-%EA%B0%9D%EC%B2%B4).

Moreover, SWR retries requests when an error occurs, and by utilizing the onErrorRetry option callback, you can override the function that retries when an error occurs. If provided through the global SWRConfig setting, a common error retry logic can be made accessible to the hooks of many components.

Additionally, if you wish to execute a particular logic when an error occurs, the onError callback can be used, for instance, to display the error as a toast message.

# 8. Conditional Fetching

SWR does not perform a fetch when the key argument is null or when the function passed as the key argument returns a falsy value. This allows for conditional fetching.

```tsx
const { data, error } = useSWR(
  isLogin ? '/api/user' : null,
  fetcher
)
```

In this example, fetching will not occur if isLogin is false.

You can also use this to fetch data dependent on other data.

```tsx
const {data:user}=useSWR('/api/user', fetcher);
const {data:posts}=useSWR(user ? `/api/posts?userId=${user.id}` : null, fetcher);
```

In this code, if the user is null, the hook attempting to fetch posts will not execute. This setup allows fetching posts only when the user exists.

# 9. Arguments for the Fetcher Function

The key argument in useSWR is generally the URL that will be fetched in the fetcher function.

However, you might want to add additional arguments, such as the JWT token for the logged-in user, when fetching with this fetcher function.

In this case, you can provide an array as the key argument for useSWR.

```tsx
const { data, error } = useSWR(
  ['/api/user', token],
  (url, token) => fetcher(url, token)
)
```

This way, the fetcher function will receive both the URL and the token as arguments.

# 10. Mutation

SWR not only fetches data but also provides functionality for modifying data through the mutate function.

There are both a global mutate API available for modifying data across all keys and a specific mutate API for a specific hook.

## 10.1. Global Mutate API

The global mutate API can be accessed using the useSWRConfig hook.

```tsx
import { useSWRConfig } from 'swr'

function Component() {
  const { mutate } = useSWRConfig()
  // ...
}
```

You can also import it globally.

```tsx
import { mutate } from 'swr'
```

The mutate function can be used as follows:

```tsx
mutate(key, data, options)
```

## 10.2. Mutate API for a Specific Hook

The mutate API for a specific hook can be accessed using the useSWR hook. As learned earlier, the mutate function also exists in the returned value of useSWR.

By using the bound mutate, you can change data only for that hook's key without needing to separately provide the key for the mutate function.

```tsx
const { data, mutate } = useSWR('/api/user', fetcher)
mutate(data, options)
```

## 10.3. Format of the Mutate API

The mutate API follows this format:

```tsx
mutate(key, data, options)
```

### 10.3.1. Key Argument

The key is the key of the data you want to mutate. It indicates that the data pertaining to that key will be mutated. It is similar to the useSWR key argument.

However, there is a slight distinction when the key argument is provided as a function. In this case, the callback function given as the key argument acts like a filter function, meaning that when it receives the key as an argument and returns true, that key's data will be refetched.

This behaves similarly to calling mutate without the data parameter, which will refetch the data for that key by marking the data as expired.

```tsx
mutate('/api/user');
```

Such a function will mark all data associated with the key `/api/user` for expiration and force a refetch.

The example of using the key as a filter function is as follows:

```tsx
mutate((key) => key.startsWith('/api/user'))

// Or passing data as undefined to trigger refetch

mutate((key) => key.startsWith('/api/user'), undefined, { revalidate: true })
```

This will mark all data corresponding to keys starting with `/api/user` for expiration and refetch it.

Since the filter function applies to all existing cached keys, care must be taken in writing it to accommodate various key formats.

This feature also allows for easily creating a function to clear all cached data.

```tsx
// Clear all key cached data and do not revalidate
mutate(() => true, undefined, { revalidate: false })
```

### 10.3.2. Data

This parameter can be used to update the client cache or send data from the client to the server to update the server's data.

It involves passing an asynchronous function that instructs the server to change the data.

### 10.3.3. Options

The options parameter has the following options.

optimisticData, revalidate, populateCache, rollbackOnError, throwOnError

revalidate determines whether to revalidate the cache after an asynchronous update is completed. Its default value is true.

rollbackOnError determines whether to revert the cache back to its previous state when mutate fails. Its default is true.

throwOnError dictates whether to throw an error when mutate fails. Its default is true.

### 10.3.4. Returned Value of Mutate

The mutate function returns the result of the data parameter resolution. It provides the updated data used for updating the cache value.

Errors can also be handled appropriately using try-catch.

```tsx
try {
  // update is an asynchronous function
  const data = await mutate('/api/user', update(newData))
} catch (error) {
  // ...
}
```

## 10.4. useSWRMutation

There is useSWRMutation for remote mutations. Unlike useSWR, this hook does not trigger automatically but can only be triggered manually. It also does not share state with other useSWRMutation hooks.

```tsx
const { data, error, trigger, reset, isMutating } = useSWRMutation(key, fetcher, options)
```

You provide the key, fetcher, and options to get a trigger function that enables remote mutations. Since the request does not start until the trigger is called, data loading can be delayed until necessary.

# References

https://web.dev/stale-while-revalidate/

Official Documentation https://swr.vercel.app/ko

https://fe-developers.kakaoent.com/2022/220224-data-fetching-libs/

https://tech.madup.com/react-query-vs-swr/

json-server https://poiemaweb.com/json-server

https://velog.io/@soryeongk/SWRBasic

https://youthfulhps.dev/web/stale-while-ravalidate/
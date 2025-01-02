---
title: JS Exploration - The Inaccuracy of setTimeout and the Event Loop
date: "2023-01-30T01:00:00Z"
description: "The setTimeout function in JS is not precise. What are the reasons?"
tags: ["javascript"]
---

# 1. setTimeout

The setTimeout function is a method provided by browsers that executes a function after a specified time interval.

```js
let tid=setTimeout(func, time, arg1, arg2, ...);
```

However, when used this way, the function may not execute after the exact designated time. There are various reasons for this, which we will explore one by one.

# 2. Nested Timeouts

The HTML standard defines constraints regarding the execution intervals of nested timers. After the fifth nested timer, a minimum delay of 4ms is enforced. This applies to both setTimeout and setInterval.

```js
let start = Date.now();
let times = [];

setTimeout(function tick() {
  times.push(Date.now() - start);
  // Once 100ms has passed since the start, log the array of function call times
  if (start + 100 < Date.now()) {
    console.log(times);
  } else {
    setTimeout(tick, 0);
  }
});
// [0, 0, 1, 1, 5, 10, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59, 64, 69, 74, 79, 84, 89, 94, 99, 104]
```

When running the code below, while the specific values in the array may vary slightly, it can be observed that there is a minimum delay of 4ms between function calls starting from the fifth nested call, even though a 0 delay was specified for setTimeout.

Due to these constraints, setTimeout does not guarantee perfectly accurate time intervals.

# 3. Browser Management of Inactive Tabs

The following code is designed to log "tick" every second.

```js
setTimeout(function tick() {
  console.log("tick");
  setTimeout(tick, 1000);
}, 1000);
```

When this code is executed and the browser tab is deactivated (simply by viewing another tab), if you count to ten seconds and then return to the tab, you may notice there are fewer than 10 logs printed.

This is because the browser enforces a minimum delay for inactive tabs to reduce the load caused by background tabs.

# 4. Delayed Timeouts

If the page, OS, or browser is busy with other tasks, timeouts may be further delayed. The callback of setTimeout will not execute until the thread that called setTimeout has completed its current execution.

You can check this with the following code.

```js
setTimeout(() => {
  console.log("a");
});
console.log("b");
// b a
```

When executed in a browser, 'b' is printed first, followed by 'a'. The script currently being executed in the thread concludes first, printing 'b', and only then is 'a' printed.

However, if the code corresponding to `console.log('b')` takes a significant amount of time, the execution of the function passed to setTimeout will be delayed significantly. This is why the delay specified in setTimeout may not be applied accurately.

## 4.1. The Execution Process of setTimeout

The execution process of setTimeout is as follows:

1. setTimeout is executed.
2. This setTimeout is passed to the WebAPI.
3. After the delay specified by setTimeout elapses, the WebAPI adds the setTimeout callback to the task queue.
4. The event loop retrieves the callback from the top of the task queue and adds it to the call stack when the call stack is empty.

If the call stack is currently processing some code, the event loop will be blocked. In other words, if the browser is busy executing a heavy operation, the event loop will remain blocked, preventing the setTimeout callback from being transferred from the task queue to the call stack.

Further details on JavaScript's asynchronous execution can be found [in this article](https://www.witch.work/javascript-event-loop-dive/).

# 5. Other Reasons

Firefox delays the execution of setTimeout timers when the current tab is loading.

In WebExtensions, setTimeout is unreliable, so the alarm API should be used.

Browsers such as IE, Chrome, and Firefox store delays internally as signed 32-bit integers. Therefore, specifying a delay greater than 2147483647ms (approximately 24.8 days) will cause an integer overflow, resulting in the timer expiring immediately.

# References

https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#%EB%94%9C%EB%A0%88%EC%9D%B4%EA%B0%80_%EC%A7%80%EC%A0%95%ED%95%9C_%EA%B0%92%EB%B3%B4%EB%8B%A4_%EB%8D%94_%EA%B8%B4_%EC%9D%B4%EC%9C%A0

https://ssocoit.tistory.com/249

https://javascript.info/settimeout-setinterval

https://negabaro.github.io/archive/js-async-detail

https://velog.io/@seongkyun/fetch-setTimeout%EC%9D%80-%ED%91%9C%EC%A4%80-API%EC%9D%BC%EA%B9%8C-len7n3gc

https://joooing.tistory.com/entry/%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A3%A8%ED%94%84-setTimeout%EC%9D%98-%EC%8B%9C%EA%B0%84%EC%9D%80-%EC%A0%95%ED%99%95%ED%95%A0%EA%B9%8C

https://felixgerschau.com/javascript-event-loop-call-stack/#web-apis
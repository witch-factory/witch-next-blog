---
title: How to Optimize Requests to a Server from Batch Jobs to Generators
date: "2025-03-16T00:00:00Z"
description: "What happens if a server crashes when it receives more than 5 requests at the same time? How can we send a maximum number of requests within limitations?"
tags: ["javascript"]
---

# Introduction

I previously wrote an article about creating a Next.js blog that can be viewed in English. This article detailed the process of translating the blog's content into English, and you can view the results on this blog as well. You can switch the language to English in the menu on the right or at the top.

In that article, I used the OpenAI API to translate about 200 blog posts for a cost of around $0.50. However, I encountered some issues while sending requests. My script sent translation requests for all posts at once, but the OpenAI API could only handle 200,000 tokens per minute. As a result, during the script's execution, I hit the API request limit.

At that time, I solved the issue by dividing translation requests into several groups. The function I wrote to manage the tasks takes an array of tasks, a batch size, and a delay between batches to process tasks.

```javascript
/**
 * Function to process asynchronous tasks in batches with delay
 * @param {Array<Function>} tasks - Array of functions returning promises for async tasks
 * @param {number} batchSize - Number of tasks to execute at once
 * @param {number} delayMs - Delay time between batches (in milliseconds)
 */
const processInBatches = async (tasks, batchSize, delayMs) => {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    // Execute all tasks in the batch
    const batchResult = await Promise.allSettled(batch.map((task) => task()));
    results.push(...batchResult);

    // Delay between batch processing
    if (i + batchSize < tasks.length) {
      console.log(`Waiting for ${delayMs / 1000} seconds before next batch...`);
      await delay(delayMs);
    }
  }
  return results;
};
```

However, I began to think about how to solve this problem more generally. Determining how to send requests within server limits is a common task. Considerations include having a limited server capacity or budget for API requests. I remember being asked a similar question during an interview and struggling to articulate my thoughts.

This article will explore methods for addressing such issues and implementing the corresponding code.

As a reference, the OpenAI API that caused this problem can be found in my previous article, "Creating a Next.js Blog That Can be Viewed in English." However, this API is paid. Therefore, this article will create a simple server using Express and TypeScript for testing purposes.

# Setting Up the Test Environment

It is challenging to test against the actual OpenAI API server due to costs. Instead, I will create a test server that crashes upon receiving a certain number of concurrent requests. So first, let’s create this test server using Express.

## Creating the Test Server

We will create a server that shuts down when a certain number of requests are activated simultaneously. Since I am familiar with the JavaScript ecosystem, I’ll proceed with Express. First, create a folder named `api-limit` and set up an Express server as follows.

```bash
npm init -y
npm install express
# Install libraries needed for TypeScript
npm install --save-dev @types/express ts-node typescript
```

Next, create a `tsconfig.json` file and set it up as follows.

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"]
}
```

Now create `src/server.ts` and write the server code as follows. The server behaves as follows:

- A middleware counts the number of currently active requests and shuts down the server if the number exceeds the maximum allowed (set to 5).
- When a `GET /` request is received, the server responds after a delay proportional to the number of active requests.
- The response includes the number of active requests and the server's status.

```typescript
// src/server.ts
import express, { Request, Response, NextFunction } from "express";

const app = express();
const port = 3000;

const MAX_CONCURRENT_REQUESTS = 5; // Maximum number of simultaneous requests
let activeRequests = 0;

const limitRequests = (req: Request, res: Response, next: NextFunction) => {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    console.log(`🔥 Server exceeded concurrent request limit. Shutting down.`);
    res.status(503).json({
      message: "🔥 Server is overloaded. Shutting down.",
      requestNumber: activeRequests,
    });
    process.exit(1);
  }

  activeRequests++;
  console.log(`📩 Request received. Current request count: ${activeRequests}`);

  // Decrease activeRequests when request finishes
  res.on("finish", () => {
    activeRequests--;
    console.log(`✅ Request completed. Current request count: ${activeRequests}`);
  });

  // Decrease activeRequests if client disconnects during request
  res.on("close", () => {
    if (!res.writableEnded) {
      activeRequests--;
      console.log(`⚠️ Request interrupted. Current request count: ${activeRequests}`);
    }
  });

  next();
};

app.use(limitRequests);

app.get("/", (req: Request, res: Response): void => {
  setTimeout(() => {
    res.json({
      message: "Hello, World!",
      requestNumber: activeRequests,
    });
  }, 1000 * activeRequests);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}.`);
});
```

You can run the server with the following command.

```bash
npx ts-node src/server.ts
```

Now visit `localhost:3000` to check that the server is running. You can also test that the server crashes with an overload message by refreshing `localhost:3000` multiple times rapidly, exceeding five requests. 

To do this, you may need to comment out the code for the `res.on("close")` event listener since refreshing will interrupt the client connection. This `close` event decreases `activeRequests`, preventing the intended overload testing. 

Of course, if this were an actual server, it would need to implement a graceful shutdown when overloaded. However, this server is designed to test "crashing under overload," so I simplified it by using `process.exit(1)`.

## Basic Server Request Script

Having created a server that shuts down when it receives too many requests, we need to create a way to send requests to the server. A server requires requests to find an optimal way to send them.

Let’s write a script that sends requests to the server. This code will serve as a foundation for controlling future requests.

First, create `src/test.ts`. For the most basic operation of sending requests to the server, the following code was written.

- Using `http.get` to send `NUM_REQUESTS` number of requests to the server.
- Depending on the success/failure of the request, logs appropriate messages to the console.

The code is as follows.

```typescript
// src/test.ts
import http from "http";

const SERVER_URL = "http://localhost:3000";
const NUM_REQUESTS = 5; // Number of requests to send at once

type ServerResponse = {
  message: string;
  requestNumber: number;
};

const sendRequest = (index: number): Promise<ServerResponse> => {
  return new Promise((resolve, reject) => {
    console.log(`Starting request ${index}`);

    const req = http.get(SERVER_URL, (res) => {
      let rawData = "";

      res.on("data", (chunk) => {
        rawData += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(rawData) as ServerResponse;
          console.log(
            `Request ${index} message: ${result.message}, requests remaining on server: ${result.requestNumber}`
          );
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (err) => {
      console.error(`Request ${index} failed: ${err.message}`);
      reject(err);
    });

    req.end();
  });
};

const testRequests = async () => {
  const promises = [];
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    promises.push(sendRequest(i));
  }

  await Promise.all(promises);
};

testRequests();
```

Now run `npx ts-node src/test.ts` to see requests being sent to the server. Changing `NUM_REQUESTS` to more than 5 will also confirm that the server shuts down.

## Setting Up Command to Run Scripts

Earlier, I used `npx` to run the script via `ts-node`. It is convenient to register such commands in the `scripts` section of `package.json`.

```json
// package.json
{
  "scripts": {
    "start": "ts-node src/server.ts",
    "test": "ts-node src/test.ts"
  }
}
```

You can run the server with `npm start`, and execute the request-sending script with `npm run test`. This way, defining commands makes it more convenient to change variable values in the file code and edit the server or request script while experimenting.

# How to Send Requests Within Limits

Let’s return to the initial question: how can we properly send requests to a server with limited capacity?

## Starting to Think

There are many thoughts to consider. The simplest way would be to send requests one by one. Wait for each request to finish before sending the next. You might think of a code like the following.

```typescript

const requests = [
  // request functions
]

const makeRequest = async () => {
  // or you could use for await...of
  for (const request of requests) {
    await request();
  }
};
```

However, this doesn’t guarantee that it won’t fail. For example, if one of the sequential requests takes too long and results in a timeout, or if the authentication token expires before processing the request, various issues can arise.

Nonetheless, this is one of the simplest methods to think of when sending requests to a limited-capacity server. However, it is also highly inefficient! Most servers can handle several requests at once.

So let’s explore the next approach: sending requests in groups. This has its inefficiencies but is better than sending one by one, making it a suitable starting point.

## Sending Requests in Groups

Assuming we know the server's limit on the number of concurrent requests, we can think about sending requests in groups. 

For example, if a server can only handle 5 simultaneous requests, you would send 5 requests at a time and then send the next 5 after the first batch completes. We can generalize this approach by taking a list of tasks and the number of tasks to run at once, processing several at a time.

The `processInBatches` function I previously used for translation tasks follows this pattern. Since the server limit is based on the number of requests, let’s remove the `delay` argument and simplify it. Create `src/processInBatch.ts` and write the following.

```typescript
const processInBatch = async <T>(
  tasks: (() => Promise<T>)[],
  batchSize: number
) => {
  const results = [];

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((task) => task()));
    results.push(...batchResults);
  }
  return results;
};

export default processInBatch;
```

Notably, when executing the requests in the `batch` array, we call `task => task()`, because `task` is a function that returns a promise, rather than a promise itself.

Moreover, if `batchSize` is greater than the length of `tasks`, the `slice` method automatically copies up to the end of the array, making it safe. You can refer to the [Array.prototype.slice() MDN documentation](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) for more on this.

The reason for this is due to the nature of Promises. The execution function of Promises is invoked immediately when the constructor runs, hence wrapping the actual task within a function delays its execution. Therefore, when using this function, do it as follows. In `test.js`, modify the `testRequests` function to push anonymous functions that return requests into `promises`.

```javascript
const testRequests = async () => {
  const promises: (() => Promise<ServerResponse>)[] = [];
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    // Wrap in an anonymous function to prevent immediate execution
    promises.push(() => sendRequest(i));
  }

  const results = await processInBatch(promises, BATCH_SIZE);
  console.log(`All requests completed: ${results.length}`);
  console.log(results);
};
```

But is this the best way? While I used this method for translation tasks, it may not always be optimal. What if while sending a group of requests, just one or some take a very long time?

If some requests succeed, the server can accept more requests proportional to the number of successful ones. However, if we wait for all requests in one group to succeed before sending the next, it may result in underutilizing the server's request limit efficiently.

To overcome this disadvantage, we can create a task queue to control the sending of requests.

## Creating a Task Queue

To alleviate the flaws of simply running a set number of tasks in batches, let’s create a task queue. We will place requests in a queue and execute a new request immediately upon the completion of an existing one.

This requires managing a queue, as well as functions to add tasks to the queue and execute them. Additionally, we will keep track of the number of requests currently being processed. This code will also be implemented in `src/test.ts`.

```typescript 
let activeRequests = 0; // Number of requests currently running
const queue: (() => Promise<ServerResponse>)[] = []; // Server request queue

// Function to execute the next request from the queue
const runNextRequest = async () => {
  // Exit if the queue is empty or request limit is hit
  if (queue.length === 0 || activeRequests >= MAX_CONCURRENT_REQUESTS) return;

  const nextRequest = queue.shift();
  if (!nextRequest) return;

  activeRequests++;
  try {
    await nextRequest();
  } catch (error) {
    console.error("⚠️ Error occurred while processing request:", error);
  } finally {
    activeRequests--;
    runNextRequest(); // Execute the next request
  }
};

// Add request to queue and execute the next 
const enqueueRequest = (index: number) => {
  queue.push(() => sendRequest(index));
  runNextRequest(); // Start queue execution
};

const testRequests = async () => {
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    enqueueRequest(i); // Add request to queue
  }
};

testRequests();
```

Using the queue to manage tasks is much more efficient. New requests can be executed immediately as existing ones complete. By observing the server response, you can confirm that requests are consistently handled within the server's limit of 5.

# Improving the Code

Using the task queue improves the efficiency of request sending, but there are still areas for improvement. One option is to use classes to further clean up the code and take advantage of JavaScript features.

## Class for Request Management

In the existing code, global variables `activeRequests` and `queue` manage requests. By creating a class to encapsulate these concerns, we can better abstract the functionality and ease overall code management. I want to acknowledge that I referenced a simple request semaphore implementation by [fienestar](https://github.com/fienestar) while building the class structure.

I developed a `TaskManager` class to perform these roles. The implementation must include:

- Setting the number of concurrent requests with `maxConcurrent`
- Adding requests using the `addTask` method
- Running tasks using `runTasks`, executing up to the maximum allowed and returning a promise with results once all tasks complete

To accomplish this, create `src/taskManager.ts` and write the following class.

```typescript
export class TaskManager<T> {
  private queue: (() => Promise<T>)[] = [];
  private activeRequestCount = 0;

  constructor(private maxConcurrent: number) {}

  addTask(task: () => Promise<T>): void {
    this.queue.push(task);
  }

  // Method for running N requests simultaneously
  async runTasks(): Promise<T[]> {
    const results: T[] = [];

    return new Promise((resolve) => {
      const next = async () => {
        if (this.queue.length === 0 && this.activeRequestCount === 0) {
          resolve(results); // Resolve when all tasks are complete
          return;
        }

        while (
          this.activeRequestCount < this.maxConcurrent &&
          this.queue.length > 0
        ) {
          const task = this.queue.shift();
          if (!task) return;
          this.activeRequestCount++;

          task()
            .then((result) => results.push(result))
            .catch((error) => console.error("Task failed:", error))
            .finally(() => {
              this.activeRequestCount--;
              next(); // Start next task whenever one finishes
            });
        }
      };

      next(); // Begin execution
    });
  }
}
```

Now in `test.ts`, we can use this class to send requests as follows.

```typescript
const taskManager = new TaskManager<ServerResponse>(MAX_CONCURRENT_REQUESTS);

const testRequests = async () => {
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    taskManager.addTask(() => sendRequest(i));
  }

  const results = await taskManager.runTasks();
  console.log(`All requests completed: ${results.length}`);
  console.log(results);
};
```

Using a class allows us to encapsulate task management and facilitates creating multiple `TaskManager` instances for parallel handling of different tasks, which is helpful for managing various types of API requests.

## Using Generators for Task Processing

Currently, the code calls `next()` each time after a task finishes to process the next task. This might feel familiar as it resembles the iterator protocol we see in JavaScript.

The iterator protocol defines a standard for generating values and can be seen in various languages like JavaScript and Python. However, since the iterator protocol is not the main topic here, you can refer to the [MDN Iterator Protocol documentation](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Iteration_protocols#%EB%B0%98%EB%B3%B5%EC%9E%90_%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C) if needed.

JavaScript allows easy creation of objects adhering to this protocol, primarily through generator functions. While this article won't delve deeply into generators, many resources are available online, such as the [MDN Documentation on Generators](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Generator) and [ES6 In Depth: Generators](https://hacks.mozilla.org/2015/05/es6-in-depth-generators/).

The key point is that JavaScript provides features similar to the concepts we've implemented so far. It involves invoking `next()` until a completion point returns a value and works well with the task approach we're developing. Therefore, let’s utilize generator functions for the task processing code.

First, modify the `taskGenerator` method to yield each array element one by one. Then, in the `runTasks` method, call `next()` to retrieve the next element. Also, use a `hasMoreTasks` flag to check if tasks remain, setting it based on the iterator’s `done` status. Additionally, I refactored the logic to execute tasks into a separate `executeTask` method for clearer organization. The final code appears as follows.

```typescript
export class TaskManager<T> {
  private queue: (() => Promise<T>)[] = [];
  private activeRequestCount = 0;

  constructor(private maxConcurrent: number) {}

  addTask(task: () => Promise<T>): void {
    this.queue.push(task);
  }

  private *taskGenerator() {
    const currentTasks = [...this.queue];

    this.queue = [];
    yield* currentTasks;
  }

  private async executeTask(
    task: () => Promise<T>,
    results: T[],
    onComplete: () => void
  ): Promise<void> {
    this.activeRequestCount++;

    try {
      const result = await task();
      results.push(result);
    } catch (error) {
      console.error(`Task failed:`, error);
    } finally {
      this.activeRequestCount--;
      onComplete();
    }
  }

  // Method for running N requests simultaneously
  async runTasks(): Promise<T[]> {
    const results: T[] = [];
    const taskIterator = this.taskGenerator();
    let hasMoreTasks = true;

    return new Promise<T[]>((resolve) => {
      const executeNext = async () => {
        if (this.activeRequestCount === 0 && !hasMoreTasks) {
          resolve(results);
          return;
        }

        while (this.activeRequestCount < this.maxConcurrent && hasMoreTasks) {
          const { done, value: nextTask } = taskIterator.next();
          if (done) {
            hasMoreTasks = false;
            return;
          }

          this.executeTask(nextTask, results, executeNext);
        }
      };

      executeNext(); // Begin execution
    });
  }
}
```

The functionality of each method in `TaskManager` remains unchanged, allowing the class to be utilized in the same manner as before. Using generators enhances our utilization of JavaScript’s features and can be beneficial for further refinements in code design.

Additionally, using generators provides marginal performance benefits, as previously, when using an array as a queue, one end receives elements while the other removes them. This could lead to operations that, in the worst case, require `O(N)` time complexity due to the structure of JavaScript arrays. 

Though performance issues may be negligible with fewer tasks processed, I want to emphasize that using generators can lead to more elegant code while also providing slight practical advantages.

Furthermore, those more accustomed to using generators could likely write even more abstracted code than I have. However, my goal was to illustrate a gradual journey towards employing the iterator protocol and generators while improving the code.

# Conclusion

This article examined how to send requests in situations where there are limits imposed on the requests. We experimented with sending requests in groups and utilized a task queue for more efficient request handling. Additionally, we improved the code by using classes, the iterator protocol, and generators.

Such issues are commonly encountered, leading to various applications and extended scenarios. For example, how can multiple clients sending requests to a bounded server avoid exceeding limits? One potential approach could involve setting up a middle server to regulate requests, employing a Rate Limiter library like `express-rate-limit`. While I'm not well-versed in this topic, similar functionalities are also provided in nginx, with many libraries available for similar behaviors.

No matter how many solutions exist, I wasn't aware of them, and figuring out how to resolve requests under constraints was one of the challenges I faced while creating a blog and during interviews. Throughout this writing process, I gained foundational ideas about tackling such limitations and experienced a gradual understanding of generators that I previously knew only in theory. I hope this proves helpful to someone facing similar situations. 

# References

Simple request semaphore implementation by [fienestar](https://github.com/fienestar)

https://gist.github.com/fienestar/56045d793cf8d8a173d2945ced899db6

Developer mock interview playlist by Maples Education

https://www.youtube.com/watch?v=4VPeriS5XWo&list=PLIa4-DYeLtn1I7pQEMbYITbl8SYm2AqXX

Rate Limiter and algorithms

https://velog.io/@cjy1705/RateLmiter-Rate-Limiter%EC%99%80-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98
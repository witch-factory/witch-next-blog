---
title: 어떻게 서버에 요청을 최적으로 보낼까? 배치 작업부터 제너레이터까지
date: "2025-03-16T00:00:00Z"
description: "5개가 넘는 요청을 동시에 받으면 서버가 터져 버린다고 하자. 어떻게 제한에 맞게 최대의 요청을 보낼까?"
tags: ["javascript"]
---

# 시작

이전에 [영어로도 볼 수 있는 Next.js 블로그 만들기](https://witch.work/ko/posts/blog-auto-translation)라는 글을 썼다. 블로그의 컨텐츠를 영어로 번역해 제공하기 위한 과정을 담은 글이었으며 그 결과물은 지금 이 블로그에서도 확인할 수 있다. 오른쪽, 혹은 위의 메뉴에서 언어를 영어로 바꾸면 된다.

해당 글에서는 OpenAI API를 이용하여 블로그 글들의 번역을 진행했다. 약 200개의 글을 0.5달러 정도의 비용으로 번역할 수 있었다. 그런데 요청을 보내는 도중 약간의 문제가 있었다. 내가 짠 스크립트는 한번에 모든 글에 대한 번역 요청을 보냈는데, OpenAI API는 1분당 20만 토큰까지의 요청을 받을 수 있었다. 그래서 스크립트가 전체 글에 대한 번역 요청을 보내는 도중에 API 요청 제한에 걸렸다.

당시에는 번역 요청을 여러 개의 그룹으로 나누어서 하는 방식으로 이 문제를 해결했다. 그때 작업 처리를 위해 작성했던 함수는 다음과 같다. 작업들이 담긴 배열, 배열들을 나눌 단위, 단위 간의 딜레이를 인자로 받아서 작업을 처리하는 함수이다.

```javascript
/**
 * 비동기 작업을 나누어 처리하고 배치 사이에 딜레이를 추가하는 함수
 * @param {Array<Function>} tasks - 실행할 비동기 작업이 담긴 프로미스를 리턴하는 함수들의 배열
 * @param {number} batchSize - 한 번에 실행할 작업 수
 * @param {number} delayMs - 작업 배치 간 대기 시간 (밀리초 단위)
 */
const processInBatches = async (tasks, batchSize, delayMs) => {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    // 배치 내 모든 작업 실행
    const batchResult = await Promise.allSettled(batch.map((task) => task()));
    results.push(...batchResult);

    // 배치 작업 사이의 딜레이
    if (i + batchSize < tasks.length) {
      console.log(`Waiting for ${delayMs / 1000} seconds before next batch...`);
      await delay(delayMs);
    }
  }
  return results;
};
```

그런데 이런 문제를 어떻게 하면 더 일반적으로 해결할 수 있을지에 대해 고민하게 되었다. 사실 어떻게 하면 서버 제한에 맞게 요청을 보낼 수 있을지를 판단하는 건 흔한 일이기 때문이다. 서버 용량이 작다거나 API 요청에 쓸 수 있는 비용이 한정되어 있다거나 하는 이유들을 생각해 볼 수 있겠다. 개인적으로는 이와 비슷한 질문을 면접에서 받은 적도 있는데, 말문이 막혔던 기억이 있다.

따라서 이 글을 통해 이런 문제를 풀어 나가는 방법들과 코드 구현에 대해 생각해 보았다.

참고로 이 문제를 내가 마주하게 만들었던 OpenAI API에 관해서는 이전에 작성했던 글인 [영어로도 볼 수 있는 Next.js 블로그 만들기](https://witch.work/ko/posts/blog-auto-translation)에서 볼 수 있다. 다만 이 API는 유료이다. 그래서 글에서는 해당 API를 사용하지 않고 Express와 TypeScript를 사용해서 간단한 서버를 만들고 이를 이용해 테스트를 해볼 것이다.

# 테스트 환경 구성

실제 OpenAI API 서버로 테스트를 해보기는 어렵다(돈이 든다는 소리다). 따라서 한번에 N개의 요청을 받으면 터지는 서버를 테스트용으로 만들어서 작업해 볼 것이다. 그러니 먼저 이러한 테스트용 서버를 express를 이용해 만들어 보자.

## 테스트용 서버 만들기

일정 갯수 이상의 요청이 동시에 활성화되면 종료되는 서버를 만들 것이다. 나는 JavaScript 생태계에 익숙한 편이기 때문에 express로 진행했다. 먼저 `api-limit`라는 폴더를 만들고 다음과 같이 express 서버를 만들었다.

```bash
npm init -y
npm install express
# ts에 필요한 라이브러리 설치
npm install --save-dev @types/express ts-node typescript
```

그리고 `tsconfig.json` 파일을 만들어서 다음과 같이 설정했다.

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"]
}
```

그리고 프로젝트에 `src/server.ts`를 만들어서 다음과 같이 서버 코드를 작성한다. 서버 동작은 다음과 같이 작성하였다.

- 미들웨어를 통해 현재 활성화된 요청의 갯수를 세고, 동시에 처리하는 요청 갯수의 최댓값(5개로 설정해 놓음)을 넘으면 서버를 종료한다.
- `GET /` 요청이 들어오면 현재 활성화된 요청의 갯수에 비례하는 시간이 지난 후 응답을 보낸다.
- 응답에는 현재 활성화된 요청의 갯수와 서버의 상태를 포함한다.

```typescript
// src/server.ts
import express, { Request, Response, NextFunction } from "express";

const app = express();
const port = 3000;

const MAX_CONCURRENT_REQUESTS = 5; // 동시 처리 가능한 최대 요청 개수
let activeRequests = 0;

const limitRequests = (req: Request, res: Response, next: NextFunction) => {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    console.log(`🔥 서버의 동시 요청 제한을 초과했습니다. 서버를 종료합니다.`);
    res.status(503).json({
      message: "🔥 서버가 과부하 상태입니다. 서버를 종료합니다.",
      requestNumber: activeRequests,
    });
    process.exit(1);
  }

  activeRequests++;
  console.log(`📩 요청 도착. 현재 요청 개수: ${activeRequests}`);

  // 요청이 완료되면 activeRequests 감소
  res.on("finish", () => {
    activeRequests--;
    console.log(`✅ 요청 완료. 현재 요청 개수: ${activeRequests}`);
  });

  // 요청 도중 클라이언트가 연결을 끊으면 activeRequests 감소
  res.on("close", () => {
    if (!res.writableEnded) {
      activeRequests--;
      console.log(`⚠️ 요청이 중단됨. 현재 요청 개수: ${activeRequests}`);
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
  console.log(`서버가 http://localhost:${port} 주소에서 실행 중입니다.`);
});
```

다음 명령어로 서버를 실행할 수 있다.

```bash
npx ts-node src/server.ts
```

이제 `localhost:3000`으로 접속하면 서버가 동작하는 것을 확인할 수 있다. 또한 `res.on("close")` 이벤트 리스너의 코드를 주석 처리하고 `localhost:3000`에서 새로고침을 누르는 등의 방식으로 요청을 빠르게 5번 넘게 보내면 서버가 과부하되었다며 종료되는 것도 확인 가능하다.

해당 코드를 주석 처리해야 하는 이유는 새로고침을 하면 클라이언트의 연결이 끊기기 때문이다. 이게 바로 `close` 이벤트이고 우리가 만든 `close` 이벤트 리스너에서는 `activeRequests`를 감소시키는 동작을 한다. 새로고침을 통해 요청을 여러 번 보내려 할 경우 이 동작을 막아야 한다.

물론 이게 실제 서버라면 요청이 과부하되었을 경우 graceful shutdown을 구현하여 서버 종료를 더 안전하게 처리해야 한다. 하지만 애초에 "요청이 과부하되면 서버가 종료된다"는 것을 테스트하기 위한 서버이므로 간단하게 `process.exit(1)`로 서버를 종료하도록 했다.

## 기초적인 서버 요청 스크립트 작성

일정 갯수를 넘는 요청을 받으면 종료되는 서버를 만들었다. 그럼 서버에 요청을 보내는 방법을 만들어야 한다. 서버가 있고 요청이 있어야 해당 요청을 최적으로 보내는 방법을 찾을 수 있으니까.

그러니 서버에 요청을 보내는 스크립트를 작성해 보았다. 이 코드를 기반으로 이후 요청을 제어하는 방법을 찾아볼 것이다.

먼저 `src/test.ts`를 만들자. 서버에 요청을 보내는 가장 기본적인 동작을 위해서 다음과 같은 코드를 작성했다.

- `http.get`을 이용해서 서버에 `NUM_REQUESTS`만큼 요청을 보낸다.
- 요청의 성공/실패 여부에 따라 콘솔에 적당한 로그를 출력한다.

코드는 다음과 같다.

```typescript
// src/test.ts
import http from "http";

const SERVER_URL = "http://localhost:3000";
const NUM_REQUESTS = 5; // 동시에 보낼 요청 개수 지정

type ServerResponse = {
  message: string;
  requestNumber: number;
};

const sendRequest = (index: number): Promise<ServerResponse> => {
  return new Promise((resolve, reject) => {
    console.log(`요청 ${index} 시작`);

    const req = http.get(SERVER_URL, (res) => {
      let rawData = "";

      res.on("data", (chunk) => {
        rawData += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(rawData) as ServerResponse;
          console.log(
            `요청 ${index} 메시지: ${result.message}, 현재 서버에 남은 요청 개수: ${result.requestNumber}`
          );
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (err) => {
      console.error(`요청 ${index} 실패: ${err.message}`);
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

이제 `npx ts-node src/test.ts`를 실행하면 서버에 요청을 보내는 것을 확인할 수 있다. `NUM_REQUESTS`의 값을 바꿔서 5개가 넘는 요청을 보내면 서버가 종료되는 것도 확인할 수 있다.

## 스크립트 실행 커맨드 설정

앞서 `npx`를 이용해서 `ts-node`를 통해 스크립트를 실행했다. 이러한 명령어를 `package.json`의 `scripts`에 등록해두면 편리하다.

```json
// package.json
{
  "scripts": {
    "start": "ts-node src/server.ts",
    "test": "ts-node src/test.ts"
  }
}
```

`npm start`로 서버를 실행하고, `npm run test`로 서버 요청을 보내는 스크립트를 실행할 수 있다. 이렇게 명령어를 지정하여 해당 파일 코드에 지정된 변수들의 값을 바꿔가며, 그리고 서버 혹은 요청 스크립트의 코드를 바꿔가며 실험할 때 조금은 더 편하게 할 수 있었다. `.sh` 파일을 만들어서 실행할 수도 있겠지만, 복잡한 명령 순서가 있는 게 아니다 보니 이 정도로도 충분히 편리하다.

# 요청 제한에 맞게 요청을 보내는 방법

그럼 다시 처음의 질문으로 돌아가자. 제한된 용량의 서버에 어떻게 요청을 적절히 보낼 수 있을까?

## 생각의 시작

여러 가지 생각을 해볼 수 있다. 가장 간단한 방법이라면 역시 서버에 요청을 딱 하나씩만 보내는 것이다. 요청 하나를 보낼 때마다 해당 요청이 끝날 때까지 기다리고 다음 요청을 보내는 식이다. 대략 이런 코드를 생각해 볼 수 있겠다.

```typescript

const requests = [
  // 요청 함수들
]

const makeRequest = async () => {
  // 혹은 for await...of를 사용할 수도 있다
  for (const request of requests) {
    await request();
  }
};
```

물론 이 경우에도 절대 실패하지 않는다고 장담할 수는 없다. 가령 순차적으로 보내지는 요청 중 하나가 너무 오래 걸려서 타임아웃이 발생하는 경우, 요청을 보내는 사이 인증 토큰이 만료되어서 요청이 처리되는 시점에는 인증이 유효하지 않게 되어버리는 경우 등 여러 가지 문제가 발생할 수 있다.

하지만 요청 제한이 있는 서버에 요청을 보낼 때 가장 간단하게 생각할 수 있는 방법 중 하나임에는 틀림없다. 그러나, 이건 너무 비효율적이다! 대부분의 서버는 아무리 못해도 한번에 몇 개씩의 요청은 처리할 수 있기 때문이다.

그러니 그 다음으로 생각할 수 있을 방법, 요청을 특정 갯수만큼 끊어서 보내는 방식부터 시작해 보자. 이 역시 비효율적인 점들이 있지만 하나씩 보내는 것보다는 그나마 낫다. 또한 충분히 간단하기도 하기 때문에 적절한 시작이라고 생각한다.

## 요청 끊어서 보내기

서버의 제한이 요청의 갯수에 대한 것이고 그 제한에 대한 정보를 알고 있다고 하자. 그러면 요청을 해당 갯수만큼 끊어서 보내는 방식을 생각할 수 있다.

예를 들어 서버가 한번에 5개까지의 요청만 동시에 처리할 수 있다면 5개씩 요청을 끊어서 보내는 식이다. 5개의 요청을 보내고, 5개의 요청이 완료되면 다음 5개의 요청을 보내면 된다. 이를 일반화하면, 작업의 목록과 한 번에 실행할 작업 수를 받아서 작업을 몇 개씩 끊어서 수행하는 식이다.

앞서 내가 번역 작업을 할 때 사용했던 `processInBatches` 함수가 이러한 방식이다. 하지만 서버의 제한이 요청의 갯수에 대한 것이므로 `delay` 인수는 삭제하고 좀 더 간결하게 만들어보자. `src/processInBatch.ts` 파일을 만들어서 다음과 같이 작성한다.

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

코드에서 볼 점은 `batch` 배열의 요청을 실행할 때 `task => task()`처럼 요청을 실행하는 부분이다. 인자의 타입에서도 볼 수 있듯이 `task`가 실제 작업 Promise가 아니라 Promise를 반환하는 함수이기 때문이다.

그리고 만약 `batchSize`가 `tasks` 배열의 길이보다 크더라도 `slice` 메서드는 자동으로 배열의 끝까지만 복사해서 반환하기 때문에 안전하다. 이에 관해서는 [Array.prototype.slice() MDN 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)를 참고할 수 있다.

이렇게 하는 건 Promise의 특성 때문이다. Promise의 실행 함수는 생성자가 실행될 때 즉시 실행되기 때문에 실제 작업을 함수로 감싸서 실행을 미루는 것이다. 따라서 이 함수를 사용할 때도 다음처럼 해야 한다. `test.js`에서 `testRequests` 함수를 다음과 같이 수정했다. `promises`에 요청을 반환하는 익명 함수를 만들어서 넣어준다.

```javascript
const testRequests = async () => {
  const promises: (() => Promise<ServerResponse>)[] = [];
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    // 즉시 실행을 막기 위해 익명 함수로 감쌈
    promises.push(() => sendRequest(i));
  }

  const results = await processInBatch(promises, BATCH_SIZE);
  console.log(`모든 요청 완료: ${results.length}개`);
  console.log(results);
};
```

그런데 이게 최선일까? 내가 번역 작업을 할 때는 이 방식을 사용했지만 이 방식이 항상 최선은 아니다. 만약 이렇게 끊어서 보내는 요청 중 딱 하나 혹은 일부가 매우 오래 걸린다면 어떻게 될까?

오래 걸리는 요청 이외의 나머지 요청들은 성공했으므로 서버에서는 성공한 요청 갯수만큼의 요청을 더 받을 수 있을 것이다. 하지만 이런 식으로 한 묶음의 모든 요청이 성공하고 나서 다음 묶음을 보내게 되면 서버의 요청 제한을 효율적으로 사용하지 못하게 된다.

이러한 단점을 해결하기 위해 작업 큐를 만들어서 요청을 보내는 방식을 사용해볼 수 있다.

## 작업 큐 만들기

앞서 언급한, 단순히 작업들을 일정 갯수씩 끊어서 실행하는 방식의 단점을 극복하기 위해 작업 큐를 만들어보자. 요청들을 큐에 넣어두고 하나의 요청이 완료될 때마다 즉시 큐에 있는 새로운 요청을 실행할 수 있도록 하는 것이다.

작업을 관리하는 큐, 그리고 큐에 작업을 넣는 함수와 빼서 실행하는 함수를 만들고 또 현재 서버에 가 있는 요청을 세는 변수를 만들어서 이를 이용해 작업을 제어하였다. 이 코드 또한 `src/test.ts`에 작성했다.

```typescript 
let activeRequests = 0; // 현재 실행 중인 요청 개수
const queue: (() => Promise<ServerResponse>)[] = []; // 서버 요청 대기열

// 대기열에서 요청 실행하는 함수
const runNextRequest = async () => {
  // 대기열이 비어있거나, 동시 요청 개수 제한에 걸리면 종료
  if (queue.length === 0 || activeRequests >= MAX_CONCURRENT_REQUESTS) return;

  const nextRequest = queue.shift();
  if (!nextRequest) return;

  activeRequests++;
  try {
    await nextRequest();
  } catch (error) {
    console.error("⚠️ 요청 처리 중 오류 발생:", error);
  } finally {
    activeRequests--;
    runNextRequest(); // 다음 요청 실행
  }
};

// 요청을 대기열에 추가하고 대기열의 다음 요청 실행
const enqueueRequest = (index: number) => {
  queue.push(() => sendRequest(index));
  runNextRequest(); // 큐 실행
};

const testRequests = async () => {
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    enqueueRequest(i); // 요청을 큐에 추가
  }
};

testRequests();
```

이렇게 큐를 이용해서 작업을 관리하면 훨씬 효율적이다. 요청이 끝날 때마다 즉시 다음 요청을 실행할 수 있기 때문이다. 서버 응답에 들어 있는 "서버에 남은 요청 개수"를 보면 늘 서버의 요청 제한 갯수인 5개에 맞게 요청이 서버에서 처리되고 있는 것도 확인할 수 있다.

# 코드 개선하기

작업 큐를 이용해서 요청을 좀 더 효율적으로 보낼 수 있게 되었다. 하지만 아직 코드에 개선할 수 있는 부분들이 있다. 여러 가지를 생각할 수 있겠지만 클래스를 이용하는 것, 그리고 JavaScript의 기능을 이용해서 코드를 더 깔끔하게 만드는 것을 생각해보자.

## 요청 제어를 위한 클래스

기존 코드에서는 전역 변수인 `activeRequests`와 `queue`를 사용해서 요청을 제어하고 있다. 이러한 부분들을 클래스로 만들어 사용하면 작업을 더 추상화할 수 있고 전역 변수를 사용하는 것보다 코드 관리도 쉬워진다. 이 섹션에서 다루는 클래스의 동작를 구현할 때 [fienestar](https://github.com/fienestar)님의 [간단한 요청 세마포어 구현 코드](https://gist.github.com/fienestar/56045d793cf8d8a173d2945ced899db6)를 참고했음을 밝힌다.

이런 역할을 하는 `TaskManager` 클래스를 만들어 보았다. 구현해야 할 부분은 다음과 같다.

- maxConcurrent로 동시에 실행할 요청 갯수를 설정
- 요청을 추가하는 `addTask` 메서드
- 제한 하의 최대 갯수만큼 요청을 실행하고 하나의 요청이 끝나면 다음 요청을 실행하며, 모든 요청이 완료될 경우 결과의 Promise를 반환하는 `runTasks` 메서드

이러한 부분을 구현하는 클래스를 만들기 위해 `src/taskManager.ts`를 만들고 다음과 같이 작성하였다. JavaScript였다면 `#`를 이용해서 private 필드를 만들어야 했겠지만 TypeScript 클래스에서는 접근 제한자를 사용할 수 있으므로 이를 이용했다.

```typescript
export class TaskManager<T> {
  private queue: (() => Promise<T>)[] = [];
  private activeRequestCount = 0;

  constructor(private maxConcurrent: number) {}

  addTask(task: () => Promise<T>): void {
    this.queue.push(task);
  }

  // N개씩 동시에 실행하는 메서드
  async runTasks(): Promise<T[]> {
    const results: T[] = [];

    return new Promise((resolve) => {
      const next = async () => {
        if (this.queue.length === 0 && this.activeRequestCount === 0) {
          resolve(results); // 모든 작업 완료 시 resolve
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
              next(); // 작업 하나가 끝날 때마다 다음 작업 실행
            });
        }
      };

      next(); // 실행 시작
    });
  }
}
```

이제 `test.ts`에서 이 클래스를 이용해 요청을 보내는 코드를 다음과 같이 수정할 수 있다.

```typescript
const taskManager = new TaskManager<ServerResponse>(MAX_CONCURRENT_REQUESTS);

const testRequests = async () => {
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    taskManager.addTask(() => sendRequest(i));
  }

  const results = await taskManager.runTasks();
  console.log(`모든 요청 완료: ${results.length}개`);
  console.log(results);
};
```

이렇게 클래스를 이용하면 작업을 관리하는 부분을 클래스 내부로 캡슐화할 수 있다. 또한 여러 개의 `TaskManager` 인스턴스를 만들어서 서로 다른 작업을 병렬로 처리하는 것도 가능하다. 여러 종류의 API 요청을 관리해야 할 때 유용할 것이다.

## 제너레이터를 사용해서 작업 처리

지금 코드에서는 작업이 끝날 때마다 `next()`를 호출하면서 배열에 들어 있는 작업을 하나씩 처리하고 있다. 그런데 JavaScript를 좀 공부해 보았다면 어디서 본 것 같은 방식이라는 생각이 들 수 있다. 바로 반복자 프로토콜(Iteration protocol)과 비슷하다.

반복자 프로토콜이란 값을 생성하는 표준 방법을 정의하는 프로토콜로 JavaScript, Python 등 여러 언어에서 볼 수 있다. 다만 반복자 프로토콜이 이 글의 주제는 아니므로 필요하다면 [MDN의 반복자 프로토콜 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Iteration_protocols#%EB%B0%98%EB%B3%B5%EC%9E%90_%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C)를 참고할 수 있다.

그리고 JavaScript에서는 이러한 반복자 프로토콜을 준수하는 객체를 쉽게 만들 수 있는 방법을 제공하는데 이것이 바로 제너레이터 함수이다. 제너레이터에 관해서도 여기서 그 개념을 다루지는 않겠지만 생소할 수 있으므로 [MDN의 제너레이터 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Generator), [ES6 In Depth: Generators](https://hacks.mozilla.org/2015/05/es6-in-depth-generators/)를 비롯해 인터넷에서 다양한 정보를 찾아볼 수 있다.

다만 중요한 건 반복자, 제너레이터가 정확히 무엇인지라기보다는 우리가 지금까지 구현한 개념과 딱 비슷한 느낌인 JavaScript의 기능이 있다는 것이다. 뭔가가 끝날 때까지 `next()`를 호출하며 값을 반환하는 것, 이게 바로 반복자 프로토콜의 핵심이기 때문이다. 따라서 이제 제너레이터 함수를 이용해서 지금까지 했던 작업을 처리하는 코드를 만들어보자.

먼저 `taskGenerator` 메서드에서 `yield*`를 이용해 배열 원소를 하나씩 반환하도록 한다. 그리고 `runTasks` 메서드에서는 `next()`를 호출하여 다음 원소를 가져오도록 했다. 또한 `hasMoreTasks` 플래그를 이용해 작업이 더 남아 있는지 확인하도록 했는데 이는 반복자 프로토콜의 `done`을 확인하여 설정하도록 했다.

또한 작업을 실행하는 로직을 `executeTask` 메서드로 분리하여 코드도 조금 정리했다. 이렇게 완성된 코드는 다음과 같다.

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

  // N개씩 동시에 실행하는 메서드
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

      executeNext(); // 실행 시작
    });
  }
}
```

`TaskManager`의 각 메서드가 하는 동작은 바뀌지 않았으므로 위에서 한 것과 똑같은 코드로 이 클래스를 사용할 수 있다. 하지만 이렇게 제너레이터를 사용하면 JavaScript의 기능을 좀 더 잘 활용할 수 있으며 나중에 함수형으로 코드를 개선할 때도 유용하다.

그리고 이렇게 제너레이터를 사용하면 좀 더 멋있다는 것 외에 실제 성능에서도 약간의 이점이 있다. 앞서 제너레이터를 사용하기 이전의 코드에서는 배열을 큐로 사용하였다. 이렇게 하면 배열의 한쪽에서는 원소가 삽입되고, 한쪽에서는 빠져나가게 된다. 그럴 경우 한쪽에서는 `O(N)`의 시간복잡도가 소요되는 작업이 생길 수밖에 없다.

이는 JavaScript 배열의 구조 상 불가피한 일이며 명세의 동작에 의해 강제되다시피 한다. 배열 메서드의 시간복잡도에 대해서는 [JS 탐구생활 - 배열 삽입 메서드의 시간복잡도](https://witch.work/posts/javascript-array-insert-time-complexity)를 참고할 수 있다.

물론 적은 수의 작업을 동시에 처리하는 경우에는 이러한 성능 문제가 거의 없을 것이기에 큰 문제가 되지 않는다. 하지만 제너레이터를 사용해서 작업을 처리하는 건 세련되기도 하지만 실질적인 이점도 약간이나마 있다는 걸 밝히고자 했다.

또한 좀더 제너레이터를 사용한 코드에 익숙한 사람이라면 나보다 더 추상화된 코드를 짤 수도 있을 것이다. 다만 완벽한 코드보다는 점점 코드를 개선해 감에 따라 반복자 프로토콜과 제너레이터를 이용하는 것에 자연스럽게 다가간 과정을 보이고자 했다.

# 마무리

이로써 요청에 대한 제한이 있는 상황에서 요청을 보내는 코드를 어떻게 작성할지에 대해 생각해 보았다. 요청을 일정 갯수씩 끊어 보내 보았고, 작업 큐를 이용해서 좀 더 효율적으로 요청을 보내보았다. 그리고 클래스, 반복자 프로토콜과 제너레이터를 이용해서 코드를 개선해 보았다.

이런 건 꽤 흔하게 마주하는 문제이기 때문에 더 많은 응용과 확장된 상황들도 있다. 예를 들어 제한이 있는 서버에 요청을 보내는 클라이언트가 여러 개일 때, 이 클라이언트들이 보내는 요청이 어떻게 서버의 제한을 넘지 않도록 할 것인가? 중간에 요청을 조절하는 서버를 하나 두고 `express-rate-limit`같은 라이브러리를 사용하는 Rate Limiter를 사용해 볼 수 있을 것이다. 자세히 알지는 못하지만 nginx에서도 비슷한 기능을 제공하며 이런 동작을 할 수 있는 다른 라이브러리들도 많다.

하지만 이에 대한 해결책이 얼마나 있건 간에 나는 몰랐고, 요청의 제한 상황이 있을 때 이를 어떻게 해결할지는 블로그를 만들면서 그리고 면접 등에서 나를 시험했던 문제 중 하나였다. 이 글을 쓰면서 이에 대한 기본적인 아이디어를 얻을 수 있었다. 또 코드를 개선해 나가는 과정에서 단순히 이론으로만 알고 있던 제너레이터에 다가가는 과정을 경험해보았다. 비슷한 상황을 겪고 있을 누군가에게도 도움이 되었기를 바란다.

# 참고

[fienestar](https://github.com/fienestar)의 간단한 요청 세마포어 구현

https://gist.github.com/fienestar/56045d793cf8d8a173d2945ced899db6

마플개발대학 개발자 가상 면접 재생목록의 영상들

https://www.youtube.com/watch?v=4VPeriS5XWo&list=PLIa4-DYeLtn1I7pQEMbYITbl8SYm2AqXX

Rate Limiter와 알고리즘

https://velog.io/@cjy1705/RateLmiter-Rate-Limiter%EC%99%80-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98

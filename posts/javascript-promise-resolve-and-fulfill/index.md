---
title: JS 탐구생활 - 왜 Promise는 resolve가 아니라 fulfill될까?
date: "2023-08-26T00:00:00Z"
description: "Promise에 대한 작은 의문"
tags: ["javascript"]
---

# 1. 의문의 시작

Promise는 직접 해당 객체를 만들어서 쓰기보다는 주로 라이브러리나 API를 통해서 사용된다. 어떤 비동기 작업을 처리한 결과를 이용해서 무언가를 해야 할 때 말이다.

```js
fetch(url).then((res)=>{
  return res.json();
}).then((data)=>{
  // 데이터를 사용한다
  console.log(data);
});
```

이번에는 Promise 객체를 만들 때를 생각해 보자. `resolve`랑 `reject`인수를 전달할 함수인 `executor`함수를 전달한다.

```js
new Promise((resolve, reject)=>{
  // 비동기 작업을 수행한다
  // 성공하면 resolve를 호출한다
  // 실패하면 reject를 호출한다
});
```

그런데 Promise의 동작을 배울 때를 생각해 보면 Promise는 pending 상태에서 `resolve`와 `reject` 호출을 통해서 fulfilled나 rejected 상태로 전이된다고 배웠다. 

개발 용어들에 있어서 이런 용어의 의미들을 따지는 것이 큰 의미가 없을 때가 많다는 걸 알지만, 그래도 의문이 들었다. 또한 MDN의 Promise 관련 문서에서도 여기에 무언가 이유가 있는 듯이 언급하고 있어서 한번 탐구해 보기로 했다.

> Why resolve(), and not fulfill()? The answer we'll give you, for now, is it's complicated.
>
> [MDN, Graceful asynchronous programming with Promises](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Asynchronous/Promises)

# 2. Promise의 상태 전이

[ECMA262의 Promise 객체 명세](https://tc39.es/ecma262/#sec-promise-objects)에서는 Promise의 동작을 다음과 같이 정의하고 있다.

Promise는 3가지 상태 중에 하나를 가진다. fulfilled, rejected, pending이다.

Promise `p`에 대해서 `p.then(f,r)`이 job 큐에 f를 즉시 넣게 되면 fulfilled 상태가 되고, r을 즉시 넣게 되면 rejected 상태가 된다. 그리고 fulfilled나 rejected 상태가 아닐 때 pending상태이다.

그리고 pending 상태가 아닌 promise, 즉 fulfilled 혹은 rejected 상태가 되어 무엇인가 완결된 promise는 settled 상태라고 한다. settled 상태이거나 다른 Promise의 상태를 기다리는 Promise는 resolved 상태라고 한다.

여기서 주목해야 하는 건 'resolved 상태라고 해서 fulfilled인 건 아니다'라는 것이다.




# 참고

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise

Promise 사용하기 가이드

https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Using_promises

https://medium.com/@contact_97709/the-difference-between-fulfill-and-resolve-a-promise-f2cb5540cd6a

Promise 직접 구현해 보기 https://www.getoutsidedoor.com/2020/03/12/promise-%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EB%A9%B0-%EC%9B%90%EB%A6%AC-%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B8%B0/

ECMA262의 Promise Object Specification https://tc39.es/ecma262/#sec-promise-objects

https://stackoverflow.com/questions/35398365/js-promises-fulfill-vs-resolve
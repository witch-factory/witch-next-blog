---
title: JS의 커링
date: "2023-01-29T00:00:00Z"
description: "자바스크립트로 커링하기"
tags: ["javascript"]
---

# 1. 시작

토스 코딩테스트에 비슷하게 있기도 하고, 모던 js 튜토리얼에 있는 문제를 먼저 다뤄보자.

## 1.1. 문제

먼저, 인수들을 받아서 모두 합해주는 함수를 만드는 것은 쉽다. arguments를 사용해도 되고, 나머지 인수를 사용해도 될 것이다.

```js
// arguments를 사용
function sum_args() {
    let result = 0;
    for (let i of arguments) {
        result += i;
    }
    return result;
}

console.log(sum_args(5, -1, 2)); //6

// 나머지 인수를 사용한 버전
function sum_args(...rest) {
    let result = 0;
    for (let i of rest) {
        result += i;
    }
    return result;
}

console.log(sum_args(5, -1, 2)); //6
```

그러면 임의의 수만큼의 괄호를 이용해서 합계를 구하는 함수를 짜려면 어떻게 해야 하는가? 다음과 같이 작동하도록 sum 함수를 만드는 문제이다.

```js
sum(5)(-1)(2); // 6
```

## 1.2. 기본적 해답

모던 JS 튜토리얼에서의 내용을 먼저 보자. 여기서는 일단 다음과 같은 식을 만족하는 함수를 만드는 것을 목표로 한다.

```js
sum(1)(2)==3; //true
sum(5)(-1)(2) == 6; //true
```

그러려면 일단 sum은 함수를 반환해야 한다. 그리고 sum이 반환하는 함수는 현재까지의 합을 메모리에 저장하고 있어야 한다.
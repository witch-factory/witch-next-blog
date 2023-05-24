---
title: JS의 Object.assign
date: "2023-01-02T00:00:00Z"
description: "JS Object.assign 함수에 관하여"
tags: ["javascript"]
---

# 1. 시작

Object.assign 함수는 객체를 복사하는 함수이다. 첫번째 인수로 받은 객체에 그 뒤 인수로 받은 객체들을 복사한다.

```js
let a = {
  name: "김성현",
  blog: "https://www.witch.work/",
};
let b = {
  nickname: "마녀",
};

let info = {};

Object.assign(info, a, b);
console.log(info); // a,b의 내용이 info로 복사된 상태
```
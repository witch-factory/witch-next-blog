---
title: 모던 자바스크립트 튜토리얼 part 1.6 함수 심화학습 네번째
date: "2023-02-04T00:00:00Z"
description: "ko.javascript.info part 1-6 4번째"
tags: ["javascript"]
---

# 1. 함수 바인딩

객체 메서드가 객체 내부가 아닌 다른 곳에 전달되거나 콜백으로 사용되면 this 정보가 사라지는 문제가 생긴다. 예를 들어서 setTimeout 함수는 this 정보를 잃어버린다.

```js
let me = {
  firstName: "김성현",
  greeting() {
    console.log(`안녕하세요. ${this.firstName}입니다.`);
  },
};

me.greeting(); // 안녕하세요. 김성현입니다.
setTimeout(me.greeting, 1000); // 안녕하세요. undefined입니다
```

이는 setTimeout에 me.greeting을 전달할 때 객체 맥락에서 분리된 함수만이 전달되기 때문이다.

그리고 이게 만약 브라우저 환경이라면 setTimeout 메서드는 window 객체를 가리키는 this를 가지게 된다.

```js
let me = {
  firstName: "김성현",
  greeting() {
    console.log(`안녕하세요. ${this.firstName}입니다.`);
  },
};
window.firstName = "이름없음";

me.greeting(); // 안녕하세요. 김성현입니다.
setTimeout(me.greeting, 1000); // 안녕하세요. 이름없음입니다.
// 브라우저 환경에서 this는 window를 가리키기 때문에 window.firstName이 출력됨
```

그럼 객체 메서드를 전달할 때 맥락도 유지하려면 어떻게 할까?

## 1.1. 래퍼 함수

다음과 같이 래퍼 함수를 만들면 me.greeting을 호출할 때 콜백으로 호출되는 게 아니라 보통 때처럼 me 객체의 메서드로 호출되기 때문에 정상적으로 작동한다.

```js
let me = {
  firstName: "김성현",
  greeting() {
    console.log(`안녕하세요. ${this.firstName}입니다.`);
  },
};

setTimeout(function () {
  me.greeting();
}, 1000);
```

하지만 만약 setTimeout 콜백이 실행되기 전에 me.greeting이 변경되면 문제가 생긴다.

```js
let me = {
  firstName: "김성현",
  greeting() {
    console.log(`안녕하세요. ${this.firstName}입니다.`);
  },
};

setTimeout(function () {
  me.greeting();
}, 1000);
me.greeting = () => {
  console.log("변경된 함수");
};
// 1초 뒤에 '변경된 함수' 출력
```

따라서 이런 경우 bind 메서드를 사용하면 된다.

## 1.2. bind

`func.bind(context)`는 func를 호출할 때 this를 context로 고정시킨 새로운 함수를 반환한다. 즉 다음과 같이 me.greeting의 this를 me로 고정시킨 새로운 함수를 만들어서 setTimeout에 전달하면 된다.

```js
let me = {
  firstName: "김성현",
  greeting() {
    console.log(`안녕하세요. ${this.firstName}입니다.`);
  },
};

let myGreeting = me.greeting.bind(me);
setTimeout(myGreeting, 1000);
```

bind를 사용하면 this만 고정되고 함수 인수는 그대로 전달된다.

만약 객체에 메서드가 여러 개 있고 메서드 전체를 전달하려 하면 반복문을 쓸 수 있다.

```js
// 반복문을 써서 메서드 바인딩
for(let key in obj){
  if(typeof obj[key] === 'function'){
    obj[key] = obj[key].bind(obj);
  }
}
```

## 1.3. 인수 바인딩

bind 메서드는 this를 고정시키는 것 뿐만 아니라 함수 인수를 고정시킬 수도 있다. 다음과 같이 bind 메서드에 인수를 전달하면 된다.

```js
function f(a, b) {
  console.log(a + b);
}

let addTwo = f.bind(null, 2);
console.log(g(1)); // 3
```

이런 방식을 partial function이라고 한다. 기존 함수의 매개변수 중 일부를 고정시킨 새로운 함수를 만들어주는 기능이다. 포괄적인 함수 하나를 기반으로 여러 변형 함수를 만들어내는 데 쓸 수 있다.

그런데 bind 메서드를 사용하려면 this를 기본적으로 지정해 줘야 하는데, 매번 this를 고정할 객체를 찾아 주는 건 번거롭다. 따라서 this는 알아서 처리해 주고 인수만 고정시킬 수 있는 함수를 짜볼 수 있다.

```js
// argsBound는 고정할 인수들
function partial(func, ...argsBound) {
  return function (...args) {
    // 객체 메서드와 같은 this를 사용하기 위해 call 사용
    return func.call(this, ...argsBound, ...args);
  };
}
```

이 함수를 쓰면 partial로 고정되기 전 함수의 this를 partial로 인수가 고정된 함수에 바인딩해 준다.

## 1.4. bind의 특성

bind가 반환한 특수 객체인 묶인 함수는 함수 생성 시점의 컨텍스트 그리고 bind에서 제공된 인수만을 기억한다. 따라서 한번 bind를 호출하여 묶인 함수에 다시 bind를 호출해도 무시된다.

```js
function f() {
  console.log(this.name);
}

let g = f.bind({ name: "John" }).bind({ name: "김성현" });
g();
// John
```

또한 bind를 사용하면 새로운 함수 객체가 만들어져서 반환되므로 기존 함수의 프로퍼티는 묶인 함수에는 없다.

```js
function f() {
  console.log(this.name);
}
f.test = 1;

let g = f.bind({ name: "John" });
console.log(f.test); // 1
console.log(g.test); // undefined
```

# 2. 화살표 함수 revisit

JS에선 forEach 등을 사용할 때 함수를 생성하고 그것을 전달하는 일이 많이 일어난다. 이때 화살표 함수를 사용하면 현재 컨텍스트를 잃지 않게 된다.

화살표 함수는 this를 고유하게 가지지 않는다. 화살표 함수에서 this를 사용하면 화살표 함수가 아닌 외부 함수에서 this 값을 가져온다. 따라서 화살표 함수를 사용할 시 별개의 this 없이 외부 컨텍스트의 this를 사용할 수 있다.

예를 들어서, 스터디 인원이 담겨 있고 그들을 차례로 출력하는 함수를 가진 객체를 만들어 보자. 이때 forEach에 function을 통해 만든 함수를 넘겨주면 그 함수의 this는 window(브라우저 환경에서는)를 가리키게 된다.

```js
let study = {
  goal: "study JS",
  people: ["John", "Jane", "Jack", "Jill"],

  printPeople: function () {
    this.people.forEach(function (person) {
      // 이 경우 여기서의 this는 window가 되므로 결과가 이상하게 나올 것
      console.log(`${this.goal}: ${person}`);
    });
  },
};

study.printPeople();
```

이를 제대로 작동시키기 위해서는 화살표 함수를 써야 한다.

```js
let study = {
  goal: "study JS",
  people: ["John", "Jane", "Jack", "Jill"],

  printPeople: function () {
    this.people.forEach((person) => {
      // 여기서의 this는 화살표 함수가 아닌 외부 함수인 printPeople을 호출한 객체를 가리키게 된다
      console.log(`${this.goal}: ${person}`);
    });
  },
};

study.printPeople();
/*study JS: John
study JS: Jane
study JS: Jack
study JS: Jill */
```

화살표 함수는 this가 없기에 생성자로 사용할 수 없다. 그리고 `bind`와도 다른데, `bind`는 함수의 this를 고정시킨 새로운 함수를 만들고, 또한 외부 렉시컬 환경이 아닌 아예 다른 객체를 this로 설정할 수도 있다.

그러나 화살표 함수는 this를 특별히 바인딩하지 않고, 아예 this가 존재하지 않기에 외부 렉시컬 환경의 this를 사용하게 되는 것 뿐이다.
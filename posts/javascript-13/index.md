---
title: 모던 자바스크립트 튜토리얼 part 1.6 함수 심화학습 세번째
date: "2023-01-30T00:00:00Z"
description: "ko.javascript.info part 1-6 3번째"
tags: ["javascript"]
---

# 1. new Function

앞에서 다룬 방법 외에도 new Function으로 함수를 만들 수 있다.

```js
let 함수명= new Function(인자1, 인자2, ... , 함수의 본문);
let sum = new Function('a', 'b', 'return a + b');
```

이 방식을 사용하면 런타임에 받은 문자열을 사용해서 함수를 만들 수 있다. 서버에서 받은 문자열로 함수 만들기도 가능하다.

또한 이 방식으로 만든 함수에는 차이가 있는데 바로 함수 내부에서 자신이 생성된 렉시컬 환경을 기억하는 `[[Environment]]`가 무조건 전역 렉시컬 환경을 참조한다는 것이다. 따라서 new Function으로 생성된 함수는 전역 변수가 아닌 외부 변수에 접근할 수 없다. 이 함수에 무언가 넘겨주고 싶다면 매개 변수를 사용하자.

# 2. setTimeout과 setInterval

일정 시간이 지난 후에 원하는 함수를 호출하는, 호출 스케줄링을 하는 함수들이다.

## 2.1. setTimeout

```js
let timerId = setTimeout(함수 혹은 문자열, [시간], [인자1], [인자2], ...);
setTimeout(func, time, arg1, arg2, ...);
```

time이 지난 후 arg1, arg2...를 매개변수로 하여 func을 호출한다. 이때 time은 밀리세컨드 단위이며 기본값은 0이다.

다음과 같이 하면 func을 1초 이후에 호출하게 된다.

```js
setTimeout(func, 1000);
```

그리고 만약 setTimeout에 첫 번째 인수가 문자열이라면 js에선 이 문자열을 함수로 만들어 실행한다.

### 2.1.2. 리턴값

setTimeout은 타이머 식별자를 반환한다.

```js
function foo() {
  console.log("foo");
}

let tid = setTimeout(foo, 1000);
let tid2= setTimeout(foo, 2000);
console.log(tid); // 1
console.log(tid2); // 2
```

이 타이머 식별자를 이용하면 clearTimeout을 사용하여 타이머를 취소할 수 있다.

```js
function foo() {
  console.log("foo");
}

let tid = setTimeout(foo, 1000);
clearTimeout(tid); // tid에 해당하는 스케줄링을 취소
console.log("done");
```

단 NodeJS에서 setTimeout을 사용할 때는 타이머 식별자가 타이머 객체가 되는 등, 타이머 식별자는 꼭 숫자는 아닐 수도 있다.

## 2.2. setInterval

setInterval의 형식은 setTimeout과 거의 같다.

```js
let timerId = setInterval(함수 혹은 문자열, [시간], [인자1], [인자2], ...);
```

그러면 지정한 시간마다 함수를 호출하게 된다. 이때 인자는 setInterval에 넘겨준 인자들이 그대로 함수에 전달된다.

그리고 setInterval도 타이머 식별자를 반환하는데 이를 이용하여 clearInterval로 타이머를 취소할 수 있다.

```js
// 1초 간격으로 메시지를 보여줌
let timerId = setInterval(() => console.log("째깍"), 1000);

// 4초 후에 정지
setTimeout(() => {
  clearInterval(timerId);
  alert("정지");
}, 4000);
// 째깍 이 4번 출력되고 정지 창이 뜬다.
```

## 2.3. 중첩 setTimeout으로 주기적 실행

setInterval을 쓰지 않더라도 setTimeout을 재귀적으로 사용하면 주기적으로 실행할 수 있다.

```js
let tid = setTimeout(function tick() {
  console.log("2초 지났다");
  tid = setTimeout(tick, 2000);
}, 2000);
```

이렇게 하면 2초마다 tick이 호출되는데, tick 안에서 다시 setTimeout으로 tick을 호출하여 2초 뒤에 다시 tick을 호출하게 된다.

그리고 이런 식으로 하면 호출 결과에 따라 다음 호출의 딜레이를 조정하거나 다른 함수를 호출하는 등 더 유연한 작업을 할 수 있다.

### 2.3.1. setInterval과의 차이

setTimeout은 지연 간격을 보장하지만, setInterval은 그렇지 않다.

```js
let i = 1;
setInterval(() => {
  for (let i = 0; i < 1000000000; i++);
  console.log(i++);
}, 1000);
```

위 코드는 1초마다 한번씩 i를 로그에 찍을 것이다. 그런데 10억번의 반복이 함수 호출마다 있다. 실제로 호출해 보면 함수 호출마다 약 0.3~0.5초가 소모된다. 

그런데 setInterval은 이렇게 함수 호출에 소모되는 시간도 지연 간격에 포함한다. setInterval이 지정한 함수 호출이 끝나고 나면 엔진은 함수 첫 호출 이후에 지연된 시간을 확인하고 지연 시간이 지났으면 다음 호출을 시작한다.

즉 만약 함수 호출에 걸린 시간이 0.5초라면 스케줄러는 0.5초가 지난 것을 확인하고 delay초가 아니라 delay-0.5초가 지난 후 바로 다음 함수를 호출한다. 만약 함수가 소모한 시간이 delay보다 길면 즉시 다음 함수를 호출한다.

반면 중첩 setTimeout은 함수 실행이 종료된 후 delay가 지난 후 다음 함수를 호출한다. 따라서 함수가 소모한 시간이 delay보다 긴지 어떤지에 상관없이 다음 함수 호출까지 delay가 지연된다.

```js
let i = 1;
setTimeout(function run() {
  for (let j = 0; j < 1000000000; j++);
  console.log(i++);
  setTimeout(run, 1000);
});
```

위 코드를 실행해 보면 1초가 약간 넘는 시간마다 run 함수가 호출되는 것을 확인할 수 있다. 이는 run 함수 실행에도 약 0.4초가 걸리고 그 시간이 지난 후 또 1초가 지나서 run이 다시 호출되기 때문이다.

setTimeout은 이전 함수의 실행이 종료된 후 다음 함수 호출을 스케줄링하기 때문이다.

## 2.4. gc와 setTimeout

setTimeout, setInterval에 함수를 넘기면 함수에 대한 내부 참조가 만들어진다. 따라서 여기 넘긴 함수는 clearTimeout, clearInterval을 호출하기 전까지 가비지 컬렉션 대상이 되지 않는다.

이런 방식은 메모리 누수를 일으킨다. 다음 코드 같은 경우 setInterval에 넘긴 함수는 외부 렉시컬 환경의 a를 참조한다. 따라서 함수가 끝나도 a는 setInterval에서 참조하고 있으므로 가비지 컬렉션 대상이 되지 않는다. 이런 메모리 누수를 일으키고 싶지 않다면 스케줄링이 필요없어지면 clearTimeout, clearInterval을 호출해야 한다.

```js
let a = 1;

setInterval(() => {
  console.log(a++);
}, 1000);
```

## 2.5. setTimeout(func,0)

`setTimeout(func,0)`은 함수 실행까지의 대기 시간을 0으로 설정한다. 그러나 이는 함수를 즉시 실행하는 것이 아니라 함수를 즉시 실행할 수 있을 때 실행하라는 의미이다. 현재 처리중인 스크립트의 처리가 종료된 직후 스케줄링한 함수를 실행하는 것이다.

```js
setTimeout(() => {
  console.log("a");
});
console.log("b");
// b a
```

위 코드에서 b가 먼저 출력된다. 현재 스크립트인 b 출력을 먼저 처리한 직후 setTimeout에 넘긴 함수가 실행되는 것이다.

그리고 setTimeout간의 순서는 딱히 보장되지 않는다.

```js
setTimeout(() => {
  console.log("A");
});
setTimeout(() => {
  console.log("B");
});
setTimeout(() => {
  console.log("C");
});
```

위 코드에서 A,B,C의 출력 순서는 보장되지 않는다는 것이다. 만약 이 순서를 보장하고 싶다면 중첩 setTimeout을 사용해야 한다.

# 3. call, apply, 데코레이터

## 3.1. 데코레이터

데코레이터는 인수로 받은 함수의 행동을 변경시켜 주는 함수를 말한다. 데코레이터는 함수를 인수로 받아서 특정한 행동을 하고 래퍼 함수를 반환한다. 이 래퍼 함수는 원래 함수를 호출하는 것과 같은 행동을 하면서 추가적인 기능을 수행한다.

예를 들어 함수에 캐싱 기능을 추가해 주는 데코레이터를 만들어 보자.

먼저 간단하게 피보나치 함수를 만들자. 재귀 호출이 엄청나게 일어나는 코드이다.

```js
function fibonacci(n) {
  if (n <= 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

`fibonacci(100)`만 해도 연산이 끝나질 않는다. 이 함수를 데코레이터를 사용해 캐싱 기능을 추가해 보자.

```js
function fibonacci(n) {
  if (n <= 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function cachingDecorator(func) {
  let cache = new Map();
  return function (x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
    let result = func(x);
    cache.set(x, result);
    return result;
  };
}

fibonacci = cachingDecorator(fibonacci);
console.log(fibonacci(100));
```

아주 빠른 시간에 답이 나오는 것을 볼 수 있다. 이 데코레이터는 내부적으로 Map을 만든 후 다음과 같은 함수를 만들어 반환한다. 

함수를 호출할 때마다 Map에 없는 인수라면 Map에 인수와 결과를 저장한다. 그리고 다음에 같은 인수로 함수를 호출하면 Map에서 값을 꺼내서 반환한다.

## 3.2. bind, call, apply

this는 자신을 호출한 객체를 가리킨다. 따라서 내부에서 this를 사용하는 객체 메서드를 다른 변수에 할당하여 사용하려고 하면 문제가 발생한다. 이때 이를 해결하는 방법 중 하나로 bind가 있다. 예를 들어서 다음 코드는 잘 작동하지 않는다.

```js
let obj = {
  name: "김성현",
  age: 27,
  greeting: function () {
    console.log(`안녕하세요. ${this.name}입니다.`);
  },
};

obj.greeting(); // 안녕하세요. 김성현입니다.
let greet = obj.greeting;
// this가 undefined가 되어서 제대로 작동하지 않는다
greet();
```

하지만 bind를 사용하면 this를 고정시킬 수 있다. bind는 함수를 호출하지는 않고 함수 내에서 가리키는 this만 바꾼다.

```js
obj.greeting(); // 안녕하세요. 김성현입니다.
let greet = obj.greeting.bind(obj);
greet(); // 안녕하세요. 김성현입니다.
```

call은 함수의 메서드이다. call은 첫번째 인수로 this가 될 객체를 받는다. 두번째 인수부터는 함수의 인수를 받는다. 즉 다음과 같은 형태로 사용한다.

```js
func.call(thisArg, arg1, arg2, ...)
```

이를 이용해 위 코드의 this가 잘 작동하도록 고치면 다음과 같다.

```js
let obj = {
  name: "김성현",
  age: 27,
  greeting: function () {
    console.log(`안녕하세요. ${this.name}입니다.`);
  },
};

obj.greeting(); // 안녕하세요. 김성현입니다.
let greet = obj.greeting;
greet.call(obj);
```

apply는 call과 비슷하지만 인수를 배열로 받는다. 즉 다음과 같은 형태로 사용한다.

```js
// arg1, arg2...를 배열에 넣어서 전달한다. 유사 배열 객체에 담아서 전달해도 된다.
func.apply(thisArg, [arg1, arg2, ...])
```

그리고 대부분의 JS 엔진은 내부에서 apply를 최적화하기 때문에 apply를 사용하는 게 더 빠르다고 한다.

## 3.3. call, apply와 데코레이터

이를 데코레이터에 어떻게 적용할까? 위의 3.1.에서와 같이 데코레이터를 만들면 문제가 생긴다. 객체 메서드 내부에서 this에 접근하는 메서드가 있다면 데코레이터 내부에서 this에 접근하면서 문제가 생길 수 있다.

```js
let test = {
  someMethod() {
    return 2;
  },

  doubleNumber(n) {
    return n * this.someMethod();
  },
};

function cachingDecorator(func) {
  let cache = new Map();
  return function (x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
    let result = func(x);
    cache.set(x, result);
    return result;
  };
}
console.log(test.doubleNumber(3));
test.doubleNumber = cachingDecorator(test.doubleNumber);
console.log(test.doubleNumber(3));
/* 실패한다. 캐싱 데코레이터가 리턴하는 내부에서 func을 호출하는데, 이 func의 역할을 하는
test.doubleNumber 내부에서는 원래 this(test)에 접근한다. 그러나 캐싱 데코레이터가 리턴하는 래퍼 함수 내에서는 this의 맥락이 사라졌기에 test.doubleNumber의 this에 접근할 수 없어서 에러이다. */
```

이를 해결하기 위해 call, apply를 사용한다. call, apply는 this를 명시적으로 지정할 수 있기 때문에 이를 이용해 this를 명시적으로 지정해주면 된다. 캐싱 데코레이터를 다음과 같이 수정한다.

```js
function cachingDecorator(func) {
  let cache = new Map();
  return function (x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
    let result = func.call(this, x);
    cache.set(x, result);
    return result;
  };
}
```

이렇게 하면 잘 작동한다. 원리는 다음과 같다.

먼저 데코레이터를 적용하게 된 함수는 래퍼 함수로 대체된다. 그리고 래퍼 함수는 원래 함수를 호출할 때 this를 명시적으로 지정해준다. 이때 래퍼 함수가 호출하는 원래 함수는 객체 함수이므로 호출할 때 `obj.method()`형태로 호출될 것이다. 따라서 call이 명시적으로 지정해준 this는 원래 함수가 호출될 때의 객체가 되고 따라서 정상적으로 작동하게 된다.

그런데 만약 함수에 프로퍼티가 붙어 있다면 데코레이터를 적용한 함수에선 프로퍼티를 사용할 수 없다.

```js
function fibonacci(n) {
  if (n <= 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

fibonacci.temp = 1;

function cachingDecorator(func) {
  let cache = new Map();
  return function (x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
    let result = func(x);
    cache.set(x, result);
    return result;
  };
}

console.log(fibonacci.temp);
fibonacci = cachingDecorator(fibonacci);
console.log(fibonacci.temp);
// 데코레이터를 적용한 함수에서는 기존 프로퍼티가 없으므로 undefined가 출력된다.
```

## 3.4. call 다른 활용

함수의 arguments를 조작할 때 쓸 수 있다. 함수에 들어온 인자를 관리하는 유사 배열 객체인데 원래는 배열이 아니기 때문에 배열 메서드를 사용할 수 없다. 그런데 call을 이용하면 배열 메서드를 사용할 수 있다.

물론 Array.from을 쓸 수도 있겠지만 call로 배열의 join 메서드를 빌려올 수도 있다. 다음과 같이.

```js
function example() {
  console.log(Array.prototype.join.call(arguments));
}

example("a", "b", "c"); // a,b,c
```


# 참고

call, apply에 대하여 https://www.zerocho.com/category/JavaScript/post/57433645a48729787807c3fd
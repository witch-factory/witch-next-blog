---
title: 모던 자바스크립트 튜토리얼 part 1.6 함수 심화학습 두번째
date: "2023-01-28T00:00:00Z"
description: "ko.javascript.info part 1-6 2번째"
tags: ["javascript"]
---

모던 자바스크립트 Part1.6을 정리하는 두번째 글이다.

# 1. 오래된 var

지금까지 했던 let, const 외에 var로도 변수를 선언할 수 있다. 이게 원래 JS에서 쓰이던 방식이다.

let을 var로 바꿔도 유사하게 작동할 때가 많다. 하지만 몇몇 중요한 부분에서 다른 점이 있다.

## 1.1. 스코프

블록 기준으로 스코프를 나누는 let과 달리 var는 함수 스코프와 전역 스코프뿐이다. 따라서 함수 스코프가 아닌 블록은 스코프를 분리하지 않는다.

```js
if (1) {
  var a = 1;
  console.log(a);
}

console.log(a);
// if블록은 함수 스코프가 아니라서
// var는 스코프를 나누지 않기에 여기서도 a에 접근 가능
```

반면 함수를 기준으로는 스코프를 나눈다.

```js
function foo() {
  var bar = 1;
}

foo();
console.log(bar); 
// 함수 밖에서 bar를 참조하면 ReferenceError 발생
```

## 1.2. 변수 중복 선언

var는 같은 스코프 내에서 중복 선언이 가능하다. 그러나 이미 선언된 변수를 var로 다시 선언시 변수에 값은 대입되지만, 새로 메모리를 할당하거나 하지는 않는다.

```js
var a = 1; // 이 시점에 이미 a는 선언되었다
var a = 2;
var a = 3;
console.log(a); // 3이 출력된다
```

## 1.3. 선언 전 사용

var의 선언은 함수의 어느 부분에서 선언되었든 함수가 시작하는 시점에 처리된다. 따라서 선언 위치와 상관없이 함수 본문 내 어디서든, var를 만나기 이전에도 사용할 수 있다. 단 선언만 처리되고 값의 할당은 스크립트 시작 시점엔 처리되지 않는다.

```js
function foo() {
  // a의 선언은 처리되었지만 값은 대입되지 않아 undefined가 출력된다
  console.log(a);
  var a = 1;
}

foo();
```

값을 미리 대입해 주면 그 값으로 처리된다.

```js
function foo() {
  a = 2;
  console.log(a); // 2
  var a = 1;
  console.log(a); // 1
}

foo();
```

물론 함수 밖에서는 사용할 수 없다.

```js
function foo() {
  var a = 1;
  console.log(a);
}
console.log(a); // 에러
foo();
```

## 1.4. IIFE

IIFE는 Immediately Invoked Function Expression의 약자로, 함수를 선언함과 동시에 즉시 실행하는 것이다. 이는 var도 블록 레벨 스코프로 사용할 수 있도록 한 대안 중 하나이다.

즉시 실행 함수 표현식은 함수 표현식을 만들고 괄호로 감싸는 방식으로 만들어진다.

```js
(function () {
  let msg = "Hello World";
  console.log(msg);
})();
// hello world
```

이런 걸 이용해서 private 멤버를 흉내낼 수 있다. var밖에 없던 시절 쓰이던 트릭이다.

```js
var User = (function () {
    var name = "김성현";

    return function () {
        this.getName = function () {
            return name;
        }

        this.setName = function (newName) {
            name = newName;
        }
    }
})();

var user1 = new User();
console.log(user1.name); //undefined
console.log(user1.getName()); //김성현
user1.name = "다른 이름";
console.log(user1.getName()); //김성현
user1.setName("다른 이름");
console.log(user1.getName()); //다른 이름
```

위 예시를 보면 User 함수는 쓰이는 즉시 호출된다. 그리고 호출이 끝남과 함께 함수 내부의 지역변수 name은 (원래는)사라진다. 또한 일반적인 방법으론 접근할 수 없다. 

하지만 즉시 실행 함수가 리턴한 함수의 내부 숨김 프로퍼티 `[[Environment]]`에는 그 렉시컬 환경이 남아 있으므로 그 함수들(여기선 getName, setName)은 즉시 실행 함수의 렉시컬 환경에 접근하여 name에 접근 가능하다. 따라서 위와 같이 private를 흉내낼 수 있는 것이다.

# 2. 전역 객체

전역 객체는 보통 언어 자체나 호스트 환경에 기본 내장되어 있다. 브라우저 환경에선 window, Nodejs환경에선 global인데, 최근에는 globalThis로 표준화되었다.

let, const가 아닌 var로 선언된 변수는 전역 객체의 프로퍼티다. 단 애초에 var를 쓰지 말고, 또한 이런 방식으로 전역 객체를 사용하는 건 추천되지 않는다. let을 사용하면 또 전역 객체를 통해 변수에 접근할 수 없다.

그런데 만약 모든 곳에서 사용할 수 있는 어떤 변수를 만들고 싶다면 전역 객체에 직접 추가해 줄 수 있다.

```js
globalThis.authorName = "김성현";
console.log(authorName);
```

이렇게 전역 객체에 추가한 변수는 스크립트 어디서든 접근 가능하다. 물론 전역 변수를 만드는 건 좋지는 않다.

# 3. 기명 함수 표현식

기명 함수 표현식은 말 그대로 이름이 있는 함수 표현식이다.

다음 코드를 보자. 함수 표현식에 이름이 붙어 있다.

```js
let foo = function bar() {
    console.log("SH");
}
```

이렇게 한다고 해서 foo를 호출하지 못한다거나 하는 건 아니다. 일반적인 함수 표현식을 쓴 것과 똑같이 작동한다. 그럼 뭐가 다를까?

함수 표현식 내에서 자기 자신을 참조할 수 있으며 표현식 외부에선 그 이름을 사용할 수 없게 된다.

```js
let greeting = function func(name) {
    if (name) {
        console.log(`안녕하세요 ${name}님`);
    }
    else {
        func("김성현");
    }
}

greeting(); //안녕하세요 김성현님
func(); //기명 함수 표현식 밖에선 함수표현식의 이름에 접근할 수 없으므로 에러
```

그런데 이는 func 대신 그냥 greeting을 넣어서 작성해도 된다. 굳이 함수 표현식에 이름을 달지 않아도 되는 것이다. 그럼 이렇게 하면 뭐가 좋을까? greeting이 다른 함수에 할당될 때 발생한다.

```js
let greeting = function (name) {
    if (name) {
        console.log(`안녕하세요 ${name}님`);
    }
    else {
        greeting("김성현");
    }
}

greeting(); // 안녕하세요 김성현님
let foo = greeting;
greeting = null;
foo();
//foo의 외부 렉시컬 환경에서 greeting을 가져올 수 없으므로 에러
```

반면 기명 함수 표현식을 사용하면 함수 표현식의 이름은 함수의 지역 렉시컬 환경에 존재하므로 기존 함수의 이름이 어떻게 되든 함수 내부에서 표현식의 이름을 통해 함수 자체를 가져올 수 있다.

```js
let greeting = function func(name) {
    if (name) {
        console.log(`안녕하세요 ${name}님`);
    }
    else {
        func("김성현");
    }
}

greeting(); // 안녕하세요 김성현님
let foo = greeting;
greeting = null;
foo();
// 안녕하세요 김성현님
```

언제든지 함수 내부에서 함수 표현식의 내부 이름을 사용해서 자기 자신을 호출할 수 있다. JS는 이렇게 함수 표현식에 붙인 이름이 무조건 현재 함수만 참조하도록 보장한다.

## 3.1. 함수 프로퍼티

함수도 객체이므로 프로퍼티를 붙일 수 있다. 또한 name, length등의 기본 프로퍼티도 있다.



# 참고

https://coderwall.com/p/ta4caw/using-iife-to-create-private-members-in-javascript
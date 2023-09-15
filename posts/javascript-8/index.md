---
title: 모던 자바스크립트 튜토리얼 part 1.4 객체 기본 - 2
date: "2023-01-02T00:00:00Z"
description: "ko.javascript.info part 1-4 두번째"
tags: ["javascript"]
---

# 1. 메서드와 this

객체에도 메서드가 존재할 수 있다. 객체 프로퍼티에 값을 할당할 때 함수를 값으로 할당하면 메서드가 된다.

```js
let info = {
  name: "김성현",
  age: 25,
};

info.sayHi = function () {
  alert("안녕하세요");
};
```

위와 같이 객체를 선언한 경우 `info.sayHi()`로 메서드를 사용할 수 있다.

## 1.1 메서드의 단축 구문

객체 내부에 function 키워드를 사용하여 메서드를 선언하거나 단축 구문으로 함수 이름만 적어도 된다.

```js
// function 키워드 쓰기
let info = {
  name: "김성현",
  age: 25,
  sayHi: function () {
    alert("안녕하세요");
  },
};
// 단축 구문 쓰기
let info = {
  name: "김성현",
  age: 25,
  sayHi() {
    alert("안녕하세요");
  },
};
```

위의 2가지 방식은 약간의 차이가 있다. 먼저 단축 구문으로 선언한 메서드의 경우 생성자로 사용할 수 없다. 

```js
let info = {
  name: "김성현",
  blog: "https://www.witch.work/",

  method1() {},
  method2: function () {
    console.log(this.name);
  },
};
new info.method1(); // 단축 구문으로 생성한 메서드는 생성자로 사용시 에러 발생
new info.method2(); // 일반 구문으로 생성한 메서드는 생성자로 정상 실행
```

그리고 단축 구문으로 선언한 메서드는 `메서드 정의`라고도 불린다. 그 이름답게, 메서드 정의로 선언한 메서드에서만 super 키워드에 대한 접근이 가능하다.

# 1.2 메서드와 this

메서드 내부에서 this 키워드를 사용하면 메서드를 호출한 객체를 참조할 수 있다. 이 값은 런타임에 결정되며 문맥에 따라 달라진다. 같은 함수라도 다른 객체에서 호출하거나 문맥이 달라지면 this값이 달라질 수 있다. 아래 코드를 보면 sayHi를 호출한 객체에 따라 this가 달라지는 것을 확인할 수 있다.

```js
let user = {
  name: "김성현",
};
let member = {
  name: "김기동",
};
function sayHi() {
  alert(this.name);
}

user.f = sayHi;
member.f = sayHi;

user.f(); // 김성현
member.f(); // 김기동
```

물론 sayHi에서 `alert(user.name)`을 쓰는 식으로 외부 변수 접근을 통해 특정 객체를 참조하도록 강제할 수도 있다. 하지만 이럴 경우 user의 내용이 바뀌었을 경우 문제가 생길 수 있다.

이 내용은 다른 글에서 더 자세히 다루도록 한다.

# 2. new와 생성자

생성자 함수, new를 쓰면 유사한 객체를 쉽게 만들 수 있다. 생성자 함수는 일반 함수와 구분하기 위해 관례적으로 첫 글자를 대문자로 쓴다. 

또한 생성자 함수는 new를 붙여 호출하며, new를 붙이지 않고 호출하면 일반 함수로 동작한다. 다음은 Person이라는 생성자 함수를 만들고 사용한 예시이다.

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

let person = new Person("John", 30);
console.log(person.name);
```

`new Person`을 호출하면 다음과 같은 일이 일어난다. 먼저 빈 객체를 만들어 this에 할당하고 함수 본문을 실행한다. 그리고 this를 반환한다. 다음과 같은 코드를 통해서, 함수의 시작시 this가 빈 객체를 참조하고, 함수가 종료되면 만들어진 this가 반환되는 것을 확인할 수 있다.

```js
function Person(name, age) {
  console.log(this);
  this.name = name;
  this.age = age;
  console.log(this);
}

let person = new Person("John", 30);
```

new를 붙여 주면 어떤 함수든 생성자 함수로 실행된다. 생성자 함수의 첫 글자가 대문자인 건 관례이다.

## 2.1. new.target

new를 붙여 호출했는지 확인할 수 있는 함수 내의 특별한 프로퍼티이다. new를 붙여 호출했으면 new.target은 함수 자신을 참조하고, 그렇지 않으면 undefined를 참조한다.

## 2.2. 생성자의 return

생성자 함수에는 보통 return을 쓰지 않지만 쓰지 못하는 건 아니다. return을 쓰면 어떤 일이 일어날까?

객체를 리턴하면 this대신 객체가 반환된다. 만약 원시형을 리턴하면 this가 무시되고, 리턴된 값이 반환된다. 아무것도 리턴하지 않고 `return;`만 쓰는 경우에도 this가 반환된다.

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  return 3;
}
//person은 3이 아니라 생성자에서 반환한 this가 된다
let person = new Person("John", 30);
console.log(person);
```

또한 인수가 없는 생성자 함수의 경우 괄호를 생략하고 호출할 수도 있다. 그러나 좋은 코드 스타일은 아니다.

그리고 생성자 내에서 this에 메서드를 추가하는 것도 물론 가능하다.

# 3. 옵셔널 체이닝

우리가 객체의 속성에 접근할 때 만약 객체에 없는 속성에 접근 시도를 한다면 undefined가 반환된다. 그런데 `user.address.city`와 같이 객체의 속성에 중첩해서 접근할 경우, 중간에 존재하지 않는 속성이 있다면 에러가 발생한다. 옵셔널 체이닝은 이런 문제를 다룰 수 있게 해준다.

`?.`는 `?.`앞의 평가 대상이 undefined나 null이면 평가를 멈추고 undefined를 반환한다. 다음과 같이 쓸 수 있다.

```js
let user = null;
console.log(user?.address);
```

user가 널이므로 user?.address는 undefined가 된다. 만약 `user.address`를 썼다면 에러가 발생했을 것이다.

그러나 `?.`는 그 바로 앞의 평가 대상에 대해서만 작동한다. 만약 ?.의 결과로 undefined가 반환되었고 그 다음에 .을 통한 객체 접근 시도가 있다면 에러가 반환된다.

```js
let user = {
  name: "김성현",
  age: 25,
};
// user.address가 없으므로 undefined.city와 같고 따라서 에러 발생
console.log(user?.address.city);
```

그리고 ?.도 평가 대상이 없으면 에러가 발생한다.

```js
// user변수 자체가 없으므로 에러 발생
console.log(user?.address);
```

## 3.1. 메서드와 함께 쓰기

?.는 연산자가 아니고 함수 혹은 대괄호와 함께 쓰이는 특별한 문법 구조체이다. 따라서 메서드 호출과 함께도 쓸 수 있다. 예를 들어서 존재 여부가 확실치 않은 함수를 호출할 때.

다음과 같이 쓰인 경우, test 객체에 method2는 없다. 하지만 ?.를 통해 호출했으므로 에러는 발생하지 않고 그냥 평가가 멈춘다. 

test.method2는 undefined가 되는데 ?.가 undefined를 감지하므로 평가를 멈추는 것이다.

```js
let test = {
  method() {
    console.log("method");
  },
};

test.method();
test.method2?.();
```

비슷하게 `undefined?.()`도 에러를 발생시키지 않는다.

## 3.2. 대괄호와 함께 쓰기

. 대신 대괄호를 사용해 객체 프로퍼티에 접근하는 경우 `?.[]`를 사용할 수 있다. 해당 키의 존재가 확실하지 않아도 안전하게 프로퍼티를 읽는 것이다.

```js
let user = {
  name: "김성현",
  age: 25,
};
// undefined를 출력
console.log(user?.["house address"]);
```

?.는 할당 연산자 왼쪽에서 사용될 수 없다는 점에 주의하자. 쓰기에는 사용할 수 없다. 단 delete와 조합하여 '이 객체가 있을 경우 이 속성을 삭제'하는 용도로 사용할 수 있다.

# 4. 심볼형

심볼형에 관하여는 따로 글을 작성하였다. 

# 5. 객체를 원시형으로 변환하기

객체에 연산을 가하거나 alert로 출력하는 등의 동작을 하면 자동 형 변환이 일어난다. 객체가 원시값으로 변환되는 것이다. 그럼 이 변환은 어떻게 일어날까?

## 5.1. 원시형으로 변환하는 경우

논리형으로 변환하는 경우 객체는 무조건 true로 변환된다. 

```js
let emptyObject = {};
console.log(Boolean(emptyObject));
// true
```

숫자형으로 변환하는 건 객체끼리 빼는 연산을 하거나 수학 관련 함수를 적용할 때 일어난다. 

예를 들어 Date 객체를 숫자로 변환시 1970년 1월 1일부터 현재 시각까지 경과한 시간을 밀리세컨드 단위로 따진 숫자로 변환되는데, 따라서 Date객체끼리 빼면 두 날짜의 시간 차이가 밀리세컨드 단위로 반환된다.

문자형으로의 형변환은 alert, String 등의 함수를 적용할 때 일어난다.

## 5.2. ToPrimitive

ToPrimitive는 명세서의 추상 연산 중 하나이다. 이때 추상 연산이란 언어에 직접 들어가 있는 연산이 아니라 자바스크립트 엔진이 내부적으로 사용하는 연산이다.

이 중 하나로 형변환을 자동으로 해주는 메서드 ToPrimitive가 있는 것이다. 이 메서드는 객체를 원시값으로 변환하는데 사용되며 목표로 하는 자료형을 뜻하는 hint에 따라 3가지로 나뉜다.

### 5.2.1. hint가 "string"인 경우

alert 함수에 인수로 들어가는 경우와 같이 문자열을 기대하는 연산을 수행할 땐 hint가 "string"이다. 

객체를 문자열로 변환하게 되면 보통 [object Object]가 반환된다. 이는 객체의 toString 메서드를 호출한 결과이다. 이에 관해서는 다른 글에서 더 자세히 다룬다.

### 5.2.2. hint가 "number"인 경우

수학 연산을 적용하려 할 때 hint가 "number"가 된다. 이때 객체는 먼저 valueOf 메서드를 호출하고, 그 결과가 원시값이 아니라면 toString 메서드를 호출한다.

### 5.2.3. hint가 "default"인 경우

연산자가 기대하는 자료형이 확실치 않을 때 hint가 "default"가 된다. 스터디 자료에서 든 예시는 `+`인데 피연산자가 문자열일 수도 있고 숫자일 수도 있기 때문이다.

또한 `==`를 사용해 비교할 때도 마찬가지다. hint가 default가 된다.

그러나 대소 비교 연산자 `>,<`의 경우 피연산자에 문자열, 숫자 다 들어갈 수 있지만 hint는 "number"가 된다. 이는 명세서에 명시되어 있다.

하지만 Date 객체를 제외하면 모든 내장 객체가 hint가 default인 경우와 number인 경우를 동일하게 처리하므로 이런 걸 모두 알 필요는 없다.

## 5.3. 객체의 형변환 과정

객체의 형변환 알고리즘은 다음과 같다.

1. 객체에 `obj[Symbol.toPrimitive](hint)`메서드가 있는지 찾고, 있다면 메서드를 호출합니다.
2. hint가 "string"이라면 `obj.toString()`과 `obj.valueOf()`를 호출합니다.
3. hint가 "number"나 "default"라면 `obj.valueOf()`와 `obj.toString()`을 호출합니다.

여기 나온 것들을 하나하나 살펴보자.

### 5.3.1. Symbol.toPrimitive

이는 객체의 내장 심볼 함수인데 이 심볼은 다음과 같이 힌트를 받아서 그에 따른 변환값을 반환하는 함수이다. 또한 인수로 받는 hint는 "string", "number", "default" 중 하나여야 한다.

```js
let user = {
  name: "김성현",
  age: 25,

  [Symbol.toPrimitive](hint) {
    console.log(hint);
    return hint == "string" ? `{name: "${this.name}"}` : this.age;
  },
};

console.log(user);
// number, 25가 찍힘
console.log(Number(user));
// string, {name: "김성현"}이 찍힘
console.log(String(user));
```

위와 같이 Symbol.toPrimitive를 구현하면 객체를 숫자나 문자열로 변환할 때 Symbol.toPrimitive가 호출된다.

### 5.3.2. toString, valueOf

객체에 Symbol.toPrimitive가 없다면 toString과 valueOf를 호출한다. 이 둘은 모두 객체의 메서드이며 각각 원시값을 반환해야 한다.

만약 hint가 "string"이라면 toString이 먼저 호출되고, "number"이거나 "default"라면 valueOf가 먼저 호출된다. 그리고 보통 valueOf는 객체 자신을 반환하고 toString은 "[object Object]"를 반환한다.

만약 객체에 Symbol.toPrimitive와 valueOf가 없으면, toString이 모든 형 변환을 처리합니다. 그리고 만약 Symbol.toPrimitive, toString, valueOf가 모두 원시값을 반환하지 않는다면 에러가 발생한다.

그리고 만약 toString이나 valueOf가 원시값을 반환하지 않는다면 그 함수 호출로 인한 결과는 무시된다. 바로 다음 형변환으로 넘어가는 것이다.

예를 들어 다음 코드의 경우 user의 toString이 객체를 반환하므로 결과가 무시된다. 그 후 valueOf가 호출되어 원시값을 반환하므로 정상적으로 형변환을 진행한다. 로그창을 보면 toString도 호출은 되는 것을 알 수 있다.

```js
let user = {
  name: "김성현",
  age: 30,

  toString() {
    console.log("toString");
    return this;
  },

  valueOf() {
    console.log("valueOf");
    return this.name;
  },
};
console.log(String(user));
```

단 위 형변환 함수들이 항상 hint에 해당하는 자료형으로의 변환을 보장하지는 않는다. 원시값만 반환하면 된다. toString이 정수를 반환한다고 해도 에러가 발생하는 건 아니다.

```js
let user = {
  name: "김성현",
  age: 25,

  toString() {
    return this.age;
  },
};
// 둘 다 잘 동작한다.
console.log(+user);
console.log(String(user));
```

### 5.3.3. 추가 형변환

만약 객체가 피연산자로 쓰인다면 한번 형변환 된 후 연산자에 맞게 또 형변환될 수도 있다. 만약 toString등으로 변환된 원시값이 연산자에 맞지 않을 때 일어나는 일이다.

```js
let user = {
  toString() {
    return "10";
  },
};
console.log(user * 2);
```

위 코드는 20이 출력된다. user가 원시값 `"10"`으로 변환된 후 곱셈 연산자에 의해 또 정수로 변환되어 2와 곱해졌기 때문이다.

반면 다음과 같은 경우 연산이 `"10"+2`가 되어 102가 출력된다.

```js
let user = {
  toString() {
    return "10";
  },
};
console.log(user + 2);
```

# 참고

메서드 정의로 선언한 메서드의 차이 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions

ToPrimitive에 관하여 https://leesoo7595.github.io/javascript/2020/06/05/JavaScript_toPrimitive/
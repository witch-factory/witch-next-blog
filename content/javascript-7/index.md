---
title: 모던 자바스크립트 튜토리얼 part 1.4 객체 기본 - 1
date: "2023-01-01T00:00:00Z"
description: "ko.javascript.info part 1-4 첫번째"
tags: ["javascript"]
---

2023년 새해가 밝았다. 그리고 나는 JS를 정리하고 있다. 아아..

# 1. 객체의 개념

객체는 원시 타입과 달리 다양한 데이터를 저장할 수 있다. key-value 쌍으로 이루어진 프로퍼티를 여러 개 넣을 수 있는 것이다. 이때 key는 문자열, value는 아무 타입이나 가능하다. 해시로 관리되기에 key의 타입은 제한이 있다.

중괄호 `{}`나 생성자 `new Object()`로 객체를 만들 수 있다. 하지만 보통 중괄호를 쓴다.

## 1.1. 프로퍼티 다루기

객체의 key-value 쌍을 프로퍼티라고 한다. 이는 `.`을 통해 조회할 수 있다.

```js
let user={
  name:"김성현",
  nickname:"witch",
  age:25,
}

console.log(user.name); // "김성현" 을 출력한다.
```

물론 새로운 프로퍼티를 추가할 수도 있다. 그리고 `delete`연산자를 쓰면 프로퍼티 삭제도 가능하다.

```js
let user={
  name:"김성현",
  nickname:"witch",
  age:25,
}

user.gender="Male";
delete user.age;
console.log(user); // {name: '김성현', nickname: 'witch', gender: 'Male'}
```

만약 key 문자열이 띄어쓰기가 들어간 상태로 구성되어 있다면 따옴표로 묶어 줘야 한다.

```js
let user={
  name:"김성현",
  nickname:"witch",
  age:25,
  "now in":'서울',
}
```

또한 주의할 점은 객체가 상수로 선언되었더라도 프로퍼티를 수정할 수 있다는 점이다. 객체를 const로 선언하는 건 객체 내용을 고정하는 게 아니라 객체에 대한 참조를 고정하는 것이기 때문이다.

## 1.2. 대괄호 표기법

만약 key가 여러 단어로 이루어진 경우 `.`을 통해 객체 프로퍼티를 참고할 수 없다. `.`으로 객체 키를 참조할 수 있는 건 대부분 키가 유효한 변수명일 때이다.

단 다른 점이 있는데 객체 key는 for, let과 같은 JS의 예약어를 사용해도 된다.

key가 유효한 변수명이 아닐 경우 대괄호를 이용해 key 조회가 가능하다. 대괄호를 이용할 경우 모든 표현식의 평가 결과를 key로 조회 가능하다.

```js
let user={
  name:"김성현",
  nickname:"witch",
  age:25,
  "now in":'서울',
}

console.log(user["now in"]); // 서울
```

## 1.3. 계산된 프로퍼티

객체 리터럴을 만들 때 key를 대괄호로 둘러싼 경우 computed property라 하여 표현식의 평가 결과를 key로 쓸 수 있다. 예를 들어 prompt 창의 리턴값 같은 것들을 객체 키로 사용하게 된다.

```js
let name=prompt("당신의 이름을 입력해 주세요", "");

let info={
  [name]:"me",
}
console.log(info);
```

혹은 변수의 복잡한 연산 결과와 같은 걸 키로 사용할 수도 있다.

## 1.4. 프로퍼티 이름 제약

객체의 key는 변수명과 달리 for, let 같은 예약어를 사용할 수도 있다. 또한 어떤 문자형이나 심볼형 값을 사용할 수도 있다. 만약 다른 타입 값을 키로 사용하면 문자열로 자동 변환된다.

단 `__proto__`만은 역사적인 이유로 객체의 키로 사용할 수 없다. 여기에 대해서는 추후에 다시 다룰 것이다.

## 1.5. 프로퍼티 존재 여부 확인

만약 객체에 존재하지 않는 프로퍼티 키에 접근하려고 시도한다면 JS에서는 에러를 발생시키는 대신 undefined를 반환하도록 한다. 따라서 객체 키 조회 결과를 undefined와 비교하는 식으로 객체에 특정 키가 존재하는지 확인할 수 있다.

이와 같은 기능을 지원하는 걸로 `in`연산자가 있다. key 조회 후 undefined와 대조하는 것과의 차이는, `in`을 사용하면 value가 undefined인 경우를 가려낼 수 있다는 점이다. 물론 value를 굳이 undefined로 설정할 일이 별로 없긴 하다.

```js
let info={
  name:"김성현",
  nickname:"마녀",
}
console.log("name" in info); //name은 있으므로 true
console.log("age" in info); //age는 없으므로 false
```

## 1.6. 객체 순회

`for..in`을 사용하면 객체의 모든 키를 순회할 수 있다.

```js
let info={
  name:"김성현",
  nickname:"마녀",
}

for(let key in info){
  console.log(key);
}
```

## 1.7. 객체 정렬 방식

프로퍼티에도 순서가 있다. 이 순서는 `for..in`으로 객체를 순회할 때 확인 가능하다.

정수 형태의 프로퍼티(변형 없이 정수로 변환될 수 있어야 한다. 예를 들어 `+49`는 변형이 있어야 정수로 변할 수 있으므로 정수형태 프로퍼티가 아니다)는 자동으로 정렬되고 나머지는 추가한 순서대로 정렬된다.

# 2. 객체와 참조

원시 타입은 값 그대로가 저장된다. 예를 들어서 `let a=1`이라 할당하면 a에는 실제로 1이라는 값이 담긴다. 그러나 객체는 참조에 의해서 저장되고 복사된다. 따라서 다른 변수에 객체를 할당하면 그 객체에 대한 참조가 전달된다.

예를 들어 다음과 같이 정수값 1을 a에 담고 b에 할당시 b에도 값 1이 저장된다. 값이 저장된 것이므로 b를 변경해도 a는 똑같다.

```js
let a=1;
let b=a;
b=2;
console.log(a,b); // 1 2
```

하지만 객체를 다른 변수에 할당한 후 그 변수를 조작하면 원래 변수도 바뀐다. 참조를 할당하기 때문이다.

```js
let info={
  name:"김성현",
  nickname:"마녀",
}

let info2=info;
info2.name="김상준";
console.log(info, info2); //info, info2 모두 변경되었다.
```

## 2.1. 객체 비교

객체를 비교할 때 `==`과 `===`는 같은 동작을 한다. 둘 다 객체의 참조를 비교하기 때문이다. 예를 들어 다음 코드에서 a,b는 완전히 똑같은 내용의 객체이지만 메모리에 있는 서로 다른 객체를 가리키고 있기 때문에 `==`과 `===` 모두 `false`를 반환한다.

```js
let a = {
  name: "김성현",
  blog: "https://www.witch.work/",
};
let b = {
  name: "김성현",
  blog: "https://www.witch.work/",
};
console.log(a == b);
console.log(a === b);
```

## 2.2. 객체 복사

그런데 객체의 참조를 복사하지 않고 객체의 내용을 복사하고 싶을 때가 있다. 일단, 만약 객체의 각 프로퍼티 value가 원시형이라면 객체를 순회하며 복제하면 된다.

```js
let a = {
  name: "김성현",
  blog: "https://www.witch.work/",
};
let b = {};

for (let key in a) {
  b[key] = a[key];
}
console.log(b === a); //false
```

또는 Object.assign을 사용할 수도 있다. 이 함수는 2번째 인수부터 끝 인수까지 받은 객체를 첫 번째 인수 객체에 복사한다.

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

만약 첫 번째 인수 객체에 동일한 key를 갖는 프로퍼티가 있을 경우 뒤에 있는 객체의 프로퍼티가 덮어쓴다. 더 자세한 설명은 [여기](https://www.witch.work/javascript-object-assign/)로.

## 2.3. 객체의 깊은 복사

앞에서는 객체의 프로퍼티 value가 원시형이라면 객체를 순회하며 복제하면 된다고 했다. 

하지만 프로퍼티 value가 객체라면 어떻게 해야할까? 이 경우 앞선 방식을 사용하면 문제가 발생한다. 각 value의 참조가 복제되기 때문이다. 다음 코드에서 문제를 확인할 수 있다.

```js
let info1 = {
  name: "김성현",
  blog: "https://www.witch.work/",
  sizes: {
    height: 171,
    foot: 280,
  },
};

let info2 = info1;
info2.sizes.foot = 290;
//위에서 info2의 value를 수정하는 코드 때문에 info1도 수정된다.
console.log(info1);
```

이를 해결하기 위해서는 객체의 각 값을 검사하면서 값이 객체인 경우 그 구조도 복사해 주는 방법을 사용해야 한다. 이를 깊은 복사라고 한다.

이를 구현하기 위해서는 Structured cloning algorithm을 사용하거나 lodash의 cloneDeep 함수를 사용하면 된다. 

# 3. 가비지 컬렉션

JS는 사용하지 않는 메모리를 가비지 컬렉션으로 관리한다. 이 가비지 컬렉터는 모든 객체를 모니터링하고 도달할 수 없는 객체는 삭제한다. 여기서 도달 가능하다는 것은 어떻게든 접근하거나 사용할 수 있는 값이라는 것이다.

예를 들어서 현재 함수의 지역 변수, 매개변수, 중첩함수 체인 내에 있는 변수, 매개변수, 전역 변수 등은 삭제되지 않는다.

그럼 도달 불가능하다는 것은 무엇을 뜻하는가? 해당 객체를 참조하는 곳이 더 이상 없다는 의미이다.

```js
let info1 = {
  name: "김성현",
  blog: "https://www.witch.work/",
};
// 이제 info1이 가리키던 객체를 참조하는 곳은 없다.
info1=null;
```

하지만 객체의 참조가 다른 변수에 들어 있는 등 다른 경로를 통해 거기에 도달할 수 있다면 객체는 가비지 컬렉팅되지 않는다. 주의할 점은 객체끼리 서로를 참조하는 것으로는 충분하지 않다는 것이다. 우리가 프로그램 내에서 거기 접근할 방식이 있어야 한다.

이러한 도달 가능성을 알아내는 방식은 다음과 같다.

먼저 다음과 같은 값들을 루트라고 부른다.

- 현재 함수의 지역 변수, 매개변수
- 중첩 함수의 체인 내에서 사용되는 변수, 매개변수
- 전역 변수
- 그 외 기본적으로 접근 가능하다고 생각되는 것들. 콜스택에 들어 있는 개체들.

그리고 이 루트들을 통해 접근할 수 있는 모든 개체들에 mark한다. 개체들을 정점으로, 참조를 간선으로 하는 그래프가 있고 루트들에서 시작해서 그래프 탐색을 한다고 생각하면 된다.

이렇게 루트들을 시작으로 하는 모든 탐색을 끝냈을 때 도달할 수 없는 개체들이 가비지 컬렉팅의 대상이 된다.

# 참고

https://stackoverflow.com/questions/9748358/when-does-the-js-engine-create-a-garbage-collection-root
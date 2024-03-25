---
title: 모던 자바스크립트 튜토리얼 part 1.9 클래스
date: "2023-02-10T00:00:00Z"
description: "ko.javascript.info part 1-9 첫번째"
tags: ["javascript"]
---

# 1. 클래스와 기본 문법

같은 객체를 여러 개 생성할 때는 앞에서 배운 생성자 함수를 사용할 수도 있지만 모던 JS에서 도입된 클래스를 사용할 수 있다.

```js
class MyClass{
  constructor(){
    //생성자
  }
  method(){}
}
```

`new MyClass()`를 호출하면 객체가 만들어지고 constructor가 실행된다.

## 1.1. 클래스가 뭔가?

클래스는 함수의 한 종류이다. 

```js
class MyClass {}
console.log(typeof MyClass); //function
```

클래스 문법은 다음과 같이 작동한다. 먼저 클래스 이름과 같은 함수를 만들고, 함수 본문을 constructor 메서드에서 가져온다. 그리고 클래스 메서드를 클래스이름.prototype에 추가한다. 즉 클래스 메서드는 prototype에서 가져오는 것이다.

```js
class MyClass {
  constructor() {
    this.myVar = 1;
  }
  myMethod() {
    return this.myVar;
  }
}

console.log(MyClass === MyClass.prototype.constructor); // true
console.log(MyClass.prototype.myMethod); // 위 클래스에서 정의한 myMethod 함수 내용
```

## 1.2. 클래스와 생성자 함수

클래스는 생성자 함수와 비슷한 기능을 하므로 클래스와 같은 기능을 하는 생성자 함수를 만들 수도 있다. 그러나 클래스는 단순한 설탕이 아니다.

첫번째 차이는 class를 통해서 만들어진 같은 이름의 함수에는 `[[IsClassConstructor]]:true`내부 프로퍼티가 붙는다. 이 프로퍼티 때문에 class 생성자는 new를 붙여 호출하지 않으면 에러가 발생하게 된다.

문자열로 변환할 때도 마찬가지다. class를 문자열로 변환하면 class로 시작하는 문자열이 반환된다. 이때 클래스임을 구분하기 위해 IsClassConstructor 내부 프로퍼티가 사용된다.

```js
class MyClass {
  constructor() {
    this.myVar = 1;
  }
  myMethod() {
    return this.myVar;
  }
}

console.log(MyClass.toString()); // class로 시작함

function MyFunction() {
  this.myVar = 1;
  this.myMethod = function () {
    return this.myVar;
  };
}

console.log(MyFunction.toString());
// function으로 시작함
```

클래스에 있는 메서드는 enumerable이 아니다. 그래서 for..in 반복문에서는 나타나지 않는다. 또한 클래스는 항상 strict mode로 실행된다.

## 1.3. 클래스 표현식

함수 표현식과 비슷하다. 또한 클래스 표현식에 클래스 이름을 쓰면 클래스 내부에서만 사용할 수 있는 이름을 만들 수 있다.

```js
let MyClass = class {
  constructor() {
    this.myVar = 1;
  }
  myMethod() {
    return this.myVar;
  }
};

let myInstance = new MyClass();
console.log(myInstance.myMethod()); //1
```

물론 함수에서 클래스를 반환하는 식으로, 클래스의 동적 생성도 가능하다.

## 1.4. getter, setter, 계산된 프로퍼티

클래스에 getter, setter도 설정할 수 있다. 또한 `[]`를 이용해서 계산된 프로퍼티 이름도 쓸 수 있다.

```js
let MyClass = class {
  constructor(myName) {
    this.foo = myName;
    this.myNumber = 1;
  }
  get myNumber() {
    return this._myNumber;
  }
  set myNumber(value) {
    this._myNumber = value;
  }
  // 계산된 메서드 이름
  ["sung" + 1]() {
    console.log("hello");
  }
};

let myInstance = new MyClass("sunghyun");
console.log(myInstance.foo);
console.log(myInstance.myNumber);
myInstance.sung1(); // hello
```

## 1.5. 클래스 필드

`클래스 프로퍼티 이름=값`과 같이 클래스 필드를 만들 수 있다. 이는 개별 객체마다 클래스 필드를 따로 설정한다. 클래스 메서드와 달리 클래스이름.prototype이 아니라 클래스 인스턴스 자체에 저장된다.

```js
class MyClass {
  value = 1;
  constructor() {}
  method() {
    this.value = 2;
  }
}

let inst1 = new MyClass();
let inst2 = new MyClass();
inst1.method();
console.log(inst1.value, inst2.value); //2 1
```

위 코드를 통해 각 클래스 인스턴스에 저장된 클래스 필드는 별개라는 것을 알 수 있다.

## 1.6. 클래스 필드 활용

그럼 이는 어떻게 쓸 수 있을까? 클래스 필드를 이용해서 바인딩된 메서드를 만들 수 있다.

JS에서 this는 동적으로 결정된다. 따라서 다른 컨텍스트에서 객체 메서드를 호출하게 되면 this가 제대로 동작하지 않을 수 있다.

```js
function func(callback) {
  callback();
}

let obj = {
  value: 1,
  method() {
    console.log(this.value);
  },
};
obj.method(); // 1
func(obj.method); //undefined
// obj.method가 객체와 분리된 상태에서 저장되므로..
```

이를 해결하기 위해 래퍼 함수를 만들거나 bind, call 등을 사용할 수 있다. 그러나 클래스 필드를 사용할 수도 있다. 애초에 래퍼 함수를 클래스 필드로 하는 것이다.

기존에 작성한, this가 제대로 작동하지 않는 코드는 다음과 같다.

```js
function func(callback) {
  return callback();
}

class MyClass {
  constructor() {
    this.myVar = 1;
  }
  myMethod() {
    return this.myVar;
  }
}

const myClass = new MyClass();
console.log(myClass.myMethod()); //1
console.log(func(myClass.myMethod)); // this 참조가 안되므로 에러
```

클래스 필드 자체를 화살표 함수로 작성한다. 그러면 화살표 함수는 this가 없으므로 상위 스코프의 this를 참조한다. 따라서 여기서의 this는 MyClass를 참조하게 된다.

```js
function func(callback) {
  return callback();
}

class MyClass {
  constructor() {
    this.myVar = 1;
  }
  myMethod = () => this.myVar;
}

const myClass = new MyClass();
console.log(myClass.myMethod()); //1
console.log(func(myClass.myMethod)); // 1
```

## 1.7. 클래스 필드 화살표 함수 사용의 단점

스터디 자료에 달린 댓글에 있는 내용이다. 클래스 필드에 화살표 함수를 사용하는 위의 방법은 단점도 있다.

먼저 화살표 함수는 클래스의 메서드가 아니라 클래스 필드에 함수 객체를 넣은 것이다. 따라서 클래스이름.prototype에 저장되어 있지 않다.

```js
class MyClass {
  constructor() {}
  myFunc() {
    return 1;
  }
}

console.log(MyClass.prototype.myFunc()); //1

class MyClass2 {
  constructor() {}
  myFunc = () => {
    return 1;
  };
}

console.log(MyClass2.prototype.myFunc()); // 에러
```

따라서 테스트 케이스 작성 시 문제가 있다고 한다.

그리고 상속이 안 된다고 하는데 이는 이제 해결된 듯 하다.

# 2. 클래스 상속

extends 키워드로 클래스를 상속할 수 있다. 이때 이 상속은 프로토타입을 사용한다.

기존 클래
---
title: JS 탐구생활 - 프로토타입에 관한 잡다한 사실들
date: "2023-06-19T00:00:00Z"
description: "JS의 프로토타입을 정복하면서 따라나온 여러 이야기들"
tags: ["javascript"]
---

프로토타입에 관해 조사하고 정리하며 따라 나온 여러 이야기들을 모아 보았다. [CreeJee](https://github.com/CreeJee)님이 많은 키워드를 제공해 주셨다.

# 1. 프로토타입 오염 공격

기본 원리는 모든 객체 리터럴의 프로토타입은 `Object.prototype`이며 이를 `객체.__proto__`를 통해서 접근할 수 있다는 사실이다. 다음과 같이 하면 `obj`와는 아무 관계도 없는 `temp` 객체(사실은 모든 객체)에서도 프로토타입 체인을 통해 `witch` 프로퍼티에 접근할 수 있다!

```js
const obj={};
obj.__proto__.witch=1;
const temp={};
console.log(temp.witch); // 1
```

프로토타입 오염이란 결국 어떻게든 공격을 위한 데이터를 `Object.prototype`에 등록시키려는 것이다.

## 1.1. 예시

예를 들어서 두 객체를 병합하는 다음과 같은 함수 코드가 있다고 하자.

```js
function isObject(obj){
  return obj!==null && typeof obj === 'object';
}

function merge(objA, objB){
  for(let key in objB){
    if(isObject(objA[key]) && isObject(objB[key])){
      merge(objA[key], objB[key]);
    }
    else{
      objA[key]=objB[key];
    }
  }
  return objA;
}
```

그러면 다음과 같은 코드로 두 객체를 병합하는 과정에서 `Object.prototype`에 프로퍼티를 등록시킬 수 있다.

```js
const objA = {a:1, b:2};
const objB = JSON.parse('{"__proto__":{"attack":"attack_code"}}');

merge(objA, objB);
const objC = {};
console.log(objC.attack);
```

위처럼 하면 objB를 objA에 병합하는 과정에서 `__proto__`에 접근하여 `Object.prototype`에 `attack` 프로퍼티를 등록시키고, 이는 프로토타입 체인을 통해서 `Object` 생성자로 생성된 객체 `objC`에서도 접근할 수 있게 된다.

다른 예시는 [원본 글](https://blog.coderifleman.com/2019/07/19/prototype-pollution-attacks-in-nodejs/)에서 찾아볼 수 있다. 이를 해결하기 위해서는 Map을 쓰거나 [프로토타입 문법 정리 글](https://witch.work/posts/dev/javascript-prototype-grammar#3.4.-%EC%95%84%EC%A3%BC-%EB%8B%A8%EC%88%9C%ED%95%9C-%EA%B0%9D%EC%B2%B4)에서 다룬 아주 단순한 객체를 만들자.

# 2. util.inherits

## 2.1. 개요

오래전 `class`와 `extends`키워드가 없던 시절에도 객체 지향 프로그래밍의 핵심인 상속은 구현해야 했다. 물론 이전의 문법 글에서 본 것처럼 프로토타입 상속이 가능하다. 하지만 이를 계속 하기에는 불편했다. 그래서 nodeJS에서는 편의 함수로 `util.inherits`를 제공했다. 생성자 함수 간의 상속 관계를 만들어 주는 것이다.

```js
function Parent(){}

Parent.prototype.say=function(){
  console.log("부모 생성자 함수입니다.");
}

function Child(){}

utils.inherits(Child, Parent);

Child.prototype.greeting = function(){
  this.say();
  console.log("자식 생성자 함수입니다.");
}

const child=new Child();
child.greeting();
/* 부모 생성자 함수입니다.
자식 생성자 함수입니다. */

console.log(child instanceof Parent); // true
console.log(Child.super_===Parent); // true
```

위와 같이 쓰면, `child`에서 `greeting`을 호출할 시 해당 함수 내부의 `this`는 `child`가 되고 따라서 `child.say()`가 호출된다. 이때 `utils.inherit`에 의해 `Child` 생성자 함수가 `Parent` 생성자 함수를 상속하게 되었으므로 child는 프로토타입 체인을 따라 `Parent.prototype`의 `say` 함수를 사용할 수 있다. 그래서 위와 같은 결과가 나왔다.

그럼 어떻게 프로토타입 체인을 만들었길래 이렇게 생성자 함수 간의 상속 관계도 만들고 `super_`도 쓸 수 있게 해준 걸까?

## 2.2. 원리

[nodeJS 아카이브](https://github.com/nodejs/node-v0.x-archive/blob/master/lib/util.js#L572-L582)를 찾아보면 `utils.inherits`의 초기 버전을 찾을 수 있다.

```js
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};
```

이 코드를 보면 다음과 같은 관계를 만든다는 것을 알 수 있다. 프로퍼티 설명자는 그냥 `constructor`속성을 `for..in` 반복문에서 제외시키고 편집은 가능하도록 하기 위한 것뿐이다.

![utils.inherit 함수가 만드는 구조](./utils-inherit-archive.png)

즉 `#2.1.`의 코드에서 관찰할 수 있는 관계를 나타내면 다음과 같다. `child`에서 `say`를 사용하는 과정이 프로토타입 체인을 보면 와닿는다.

![utils-inherit-ex](./utils-inherit-ex.png)

## 2.3. 현재

[node의 현재 버전에서도 이 함수는 찾아볼 수 있다.](https://github.com/nodejs/node/blob/main/lib/util.js#L229) 물론 사용이 권장되지는 않는다. 

`ObjectDefineProperty`와 `ObjectSetPrototypeOf`는 적당히 중간에 `.`을 붙여서 생각하자. 그렇게 해석하면 약간의 검증 코드가 추가되기는 했지만 기본적인 원리는 위의 것과 같다는 것을 알 수 있다.

이 함수의 실행 결과 만들어지는 `ctor`, `superCtor` 사이의 구조도 위에서 본 것과 똑같다. 다만 이제는 `ctor.super_`의 `[[Prototype]]`이 null로 설정된다는 것 정도. 아마 생성자 함수의 `super`에 접근하는 것이 `super_` 속성을 통해서만 가능하도록 하기 위한 조치가 아닐까 한다.

```js
/* jsdoc은 생략 */
function inherits(ctor, superCtor) {

  if (ctor === undefined || ctor === null)
    throw new ERR_INVALID_ARG_TYPE('ctor', 'Function', ctor);

  if (superCtor === undefined || superCtor === null)
    throw new ERR_INVALID_ARG_TYPE('superCtor', 'Function', superCtor);

  if (superCtor.prototype === undefined) {
    throw new ERR_INVALID_ARG_TYPE('superCtor.prototype',
                                   'Object', superCtor.prototype);
  }
  ObjectDefineProperty(ctor, 'super_', {
    __proto__: null,
    value: superCtor,
    writable: true,
    configurable: true,
  });
  ObjectSetPrototypeOf(ctor.prototype, superCtor.prototype);
}
```

## 2.4. 문제

`utils.inherits`는 ES6에서 클래스가 나오고 상속을 정식으로 지원하게 된 지금, 역사 속으로 사라지려 하는 nodeJS 유틸리티 함수다. 

하지만 JS는 여전히 프로토타입을 버리지 않았고 여전히 잘 작동하는데 굳이 이 함수를 쓰지 말아야 할 이유가 있을까? JS가 프로토타입 기반 언어라는 건 다 아는 사실인데 class가 나왔다고 `Usage of util.inherits() is discouraged.(nodeJS 공식 문서 중)`라고 명시할 필요까지 있었을까?

이유는 이 함수 내부에서 `Object.setPrototypeOf()`를 사용하기 때문이다. 위의 `utils.inherit`구현을 보면 다음 구문을 찾아볼 수 있다.

```js
ObjectSetPrototypeOf(ctor.prototype, superCtor.prototype);
```

[해당 MDN 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)를 보면, JS 엔진들이 작동하는 방식 때문에 객체의 `[[Prototype]]`속성을 변경하는 건 매우 느리다.

이 원리는 [Mathias의 글](https://mathiasbynens.be/notes/prototypes)에서 찾아볼 수 있는데 해당 글에 관해서는 추후 자세히 분석하도록 한다.

아무튼 엔진 개발자들이 노력하고 있지만 현재로서는 객체의 프로토타입 변경은 매우 느린 연산이다. 때문에 상속을 구현하면서 성능을 고려한다면 객체에 `Object.setPrototypeOf`를 사용하는 대신 `Object.create`로 새로운 객체를 만들어서 상속을 구현하는 게 더 좋다.

### 2.4.1. 왜 개선 불가능한가?

그러면 `utils.inherits`를 `Object.create`를 사용하도록 바꾸면 되지 않는가? 가령 다음과 같이 말이다.

```js
function inherits(ctor, superCtor) {

  if (ctor === undefined || ctor === null)
    throw new ERR_INVALID_ARG_TYPE('ctor', 'Function', ctor);

  if (superCtor === undefined || superCtor === null)
    throw new ERR_INVALID_ARG_TYPE('superCtor', 'Function', superCtor);

  if (superCtor.prototype === undefined) {
    throw new ERR_INVALID_ARG_TYPE('superCtor.prototype',
                                   'Object', superCtor.prototype);
  }
  ObjectDefineProperty(ctor, 'super_', {
    __proto__: null,
    value: superCtor,
    writable: true,
    configurable: true,
  });
  ctor.prototype=ObjectCreate(superCtor.prototype);
}
```

하지만 내가 생각하는 걸 똑똑한 Nodejs 개발자들이 생각 못 했을 리는 없다. 위의 코드는 역시 느리다. 왜냐 하면 결국 `[[Prototype]]`을 변경하는 건 마찬가지이기 때문이다.

생성자 함수는 생성될 때 이미 `prototype` 속성으로 `{constructor:생성자 함수 자신}`을 가지고 있다. 따라서 위 코드에서 `ctor` 생성자 함수를 인자로 받아서 `ctor.prototype=ObjectCreate(~~);`를 실행하는 시점에 이미 `ctor.prototype`의 `[[Prototype]]`이 존재하고 따라서 해당 문장 또한 결국 `[[Prototype]]`을 변경하는 것이다.

`Object.create`를 객체 생성 시점에 사용하지 않으면 프로토타입 변경으로 인한 성능저하를 피할 수 없고, 따라서 그냥 `Object.setPtototypeOf`를 사용하는 것이다.

## 2.5. 클래스 상속과의 차이

프로토타입 기반 시절이었던 JS의 상속과 클래스 상속과의 차이는 너무 많고, 또한 프로토타입 기반의 상속을 어떻게 하느냐에 따라 다르겠지만 `utils.inherits`에서의 가장 큰 차이는 생성자 함수 자체가 아니라 prototype이 상속된다는 점이다.

클래스 기반의 상속에서는 다음과 같이 클래스 그 자체가 상속되는 게 당연하다.

```js
class Parent{
  name="Lee";
  say(){
    console.log(`이름은 ${this.name}입니다.`);
  }
}

class Child extends Parent{
  greeting(){
    this.say();
  }
}

let parent=new Parent();
// 이름은 Lee입니다.
parent.say();
let child=new Child();
// 이름은 Lee입니다.
child.greeting();
```

하지만 `utils.inherits`는 원리를 보면 알겠지만 프로토타입만 상속한다. node 공식 문서에서도 이를 언급하고 있다.

```
Inherit the prototype methods from one constructor into another.
- utils.inherits 공식 문서 중
```

물론 위의 `utils.inherits`구조에서도 이를 알 수 있다. 아무튼 만약 생성자 함수의 내용들도 상속된다고 생각하고 사용하면 문제가 생긴다. 

애초에 이 상속 패턴 자체가 생성자 함수의 `prototype`은 해당 생성자 함수가 생성한 객체의 `[[Prototype]]`이 된다는 원리를 이용한 것이기 때문에, 생성자 함수의 `prototype`을 상속하는 것이지 생성자 함수 그 자체를 상속하는 게 아니다.

# 3. babel의 class transform

# 4. class와 prototype

class는 prototype의 문법적 설탕이라는 말이 있었다. 하지만 어쩌면 당연하게도 이 둘은 다르다.



# 참고

프로토타입 오염 공격 https://blog.coderifleman.com/2019/07/19/prototype-pollution-attacks-in-nodejs/

nodejs util.inherits https://nodejs.org/api/util.html#utilinheritsconstructor-superconstructor

utils.inherit에 관한 튜토리얼 하나 https://www.tutorialspoint.com/node-js-util-inherits-method

utils.inherits는 클래스 기반 상속과 다르다 https://github.com/nodejs/node/issues/4179

utils.inherit이 뭘 하는 건지 쉽게 설명 https://stackoverflow.com/questions/21358843/can-someone-explain-what-util-inherits-does-in-more-laymans-terms

`Object.setPrototypeOf()`의 MDN 문서 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf

왜 `utils.inherits`는 `Object.setprototypeof`를 사용하는가?
https://stackoverflow.com/questions/68731237/why-does-the-util-inherits-method-in-node-js-uses-object-setprototypeof
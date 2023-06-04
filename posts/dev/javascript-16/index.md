---
title: 모던 자바스크립트 튜토리얼 part 1.8 프로토타입
date: "2023-02-06T05:00:00Z"
description: "ko.javascript.info part 1-8 첫번째"
tags: ["javascript"]
---

# 1. 프로토타입 상속

다른 언어에서는 클래스로 상속을 구현하지만, JS에선 원래 프로토타입으로 상속을 구현한다. 요즘은 클래스 문법이 생겼지만 프로토타입을 알아보고 넘어가자.

## 1.1. 프로토타입 숨김 프로퍼티

JS 객체는 `[[Prototype]]`이라는 숨김 프로퍼티를 가지고 있다. 이는 null 혹은 다른 객체에 대한 참조인데, 만약 이게 다른 객체를 참조하는 경우 프로토타입이라 한다.

예를 들어 A의 `[[Prototype]]`이 B를 가리키고 있다고 하면 B가 A의 프로토타입이 된다. 이때 A에서 프로퍼티를 읽으려고 할 때 그 프로퍼티가 없다면 `[[Prototype]]`을 따라가서 찾는다. 이런 방식을 프로토타입 상속이라 한다.

이는 `__proto__`라는 프로퍼티를 통해 설정할 수 있다.

```js
let animal = {
  eats: true,
};

let dog = {
  barks: true,
};

dog.__proto__ = animal;
console.log(dog.eats); // animals의 eats를 읽어서 true
```

객체 선언시에 설정하는 것도 가능하다.

```js
let dog = {
  __proto__: animal,
  barks: true,
};
```

`Object.getPrototypeOf()`와 `Object.setPrototypeOf()`를 통해서도 프로토타입을 읽고 설정할 수 있다. 또한 하위 호환성 때문에 `__proto__`를 사용할 수는 있지만 앞의 두 메서드를 사용하는 것이 좋다.

그리고 이렇게 프로토타입을 추가할 때 제한 사항이 있다. 순환 참조가 안 되고, `__proto__`는 객체나 null만 가능하다는 것이다. 다른 자료형 설정시 무시된다.

그리고 this는 언제나 자신을 호출한 객체를 가리키도록 런타임에 결정되므로 프로토타입에 영향을 받지 않는다는 점에 주의한다.

```js
let animal = {
  walk() {
    if (this.sleeping) {
      console.log("동물이 자고 있습니다.");
    } else {
      console.log("동물이 걸어갑니다.");
    }
  },
  sleep() {
    this.sleeping = true;
  },
};

let dog = {
  name: "강아지",
  __proto__: animal,
};

dog.sleep(); //dog을 this로 하므로 dog.sleeping = true이다
animal.walk(); //animal을 this로 한다. 따라서 "동물이 걸어갑니다." 출력
```

## 1.2. 반복문

for..in 반복문은 상속받은 프로퍼티도 순회한다. 단 obj.hasOwnProperty(key)를 통해 상속받은 프로퍼티인지 확인할 수 있고 이걸 이용하면 상속 프로퍼티를 순회에서 제외할 수 있다.

obj.hasOwnProperty(key)는 key가 obj가 상속받은 게 아니라 obj에 직접 구현된 프로퍼티일 때 true를 반환한다. 그리고 Object.keys나 Object.values 또한 상속 프로퍼티를 제외하고 동작한다.

그리고 JS의 객체는 모두 Object.prototype을 상속받는데 for..in으로 객체를 순회하면 Object.prototype의 프로퍼티는 나오지 않는다. 이는 객체의 기본 메서드들의 enumerable설명자가 false이고 for..in은 열거 가능한 프로퍼티만 순회하기 때문이다.

# 2. 함수의 prototype 프로퍼티

생성자 함수로도 새로운 객체를 만들 수 있다. 그러면 그때 객체의 프로토타입은 어떻게 동작할까? 생성자 함수의 프로토타입이 객체인 경우, 이를 이용해 만든 객체는 생성자 함수와 같은 프로토타입을 가진다. 다음과 같이 생성자 함수에 `prototype`속성을 지정해 주면 된다.

```js
let animal = {
  eats: true,
};

function Dog(name) {
  this.name = name;
}
// 생성자 함수의 프로토타입 지정
Dog.prototype = animal;
// dog의 [[Prototype]]은 animal이 된다
let dog = new Dog("Happy");
console.log(dog.eats);
```

생성자 함수의 프로토타입이 런타임에 바뀌면 그 순간부터 해당 생성자 함수로 만든 객체는 새로운 프로토타입을 가진다. 그리고 이전 프로토타입은 더 이상 사용되지 않는다.

## 2.1. 디폴트 프로퍼티

모든 함수는 기본적으로 `prototype`프로퍼티를 가지고 있다. 이는 기본적으로 constructor 하나만 있는 객체를 가리키고, 그 constructor는 함수 자기 자신을 기리킨다.

```js
function func() {}
console.log(func.prototype.constructor === func); // true
```

따라서 특별한 조작을 가하지 않아도 `new`를 통해서 만든 객체 모두에서 constructor 프로퍼티를 사용할 수 있다. 다음 코드를 보자.

```js
function Animal() {}

let animal = new Animal();
console.log(animal.constructor === Animal); // true
```

`animal`객체에는 constructor가 없다. 따라서 prototype 참조를 따라가서 constructor를 검색하게 된다. 그런데 `animal`은 생성자 함수인 `Animal`과 같은 프로토타입을 가진다. 

그런데 Animal 함수는 기본적으로 constructor프로퍼티를 갖는 prototype을 갖고 있고 그것은 함수 자기 자신(여기서는 `Animal`)을 가리킨다. 따라서 `animal.constructor`는 `Animal`을 가리킨다.

## 2.2. constructor 프로퍼티

constructor는 기존에 있던 객체의 것을 사용할 수도 있다. 이는 객체가 있는데 그 생성자를 명확히 알 수 없을 때 사용할 수 있다.

```js
function Animal(name) {
  this.name = name;
}

let dog = new Animal("dog");
console.log(dog.name); //dog
let cat = new dog.constructor("cat");
console.log(cat.name); //cat
```

dog를 통해서 Animal 생성자를 불러와 보았다. 이러면 Animal을 모르더라도 dog -> Animal -> Animal.constructor에 접근하여 Animal을 찾아낼 수 있다.

함수에는 기본적으로 prototype 프로퍼티가 있고 여기에는 constructor가 들어 있다. 그런데 JS에서는 함수에 기본적으로 prototype 값이 설정된다는 것을 보장할 뿐, 여기에 constructor가 들어 있는 것을 보장하지는 않는다.

다음과 같이 생성자 함수 prototype을 덮어써 보자. 그러면 새 constructor가 기존 생성자 함수의 constructor와 다른 것을 가리키고 있는 것을 알 수 있다. 그냥 일반 객체의 생성자를 가리킨다. 즉 생성자 함수의 constructor가 생성자 함수인 것은 보장되지 않는다.

```js
function Animal(name) {
  this.name = name;
}

let animal1 = new Animal("Animal");
// true
console.log(animal1.constructor === Animal);

Animal.prototype = {
  eats: true,
};
let animal2 = new Animal("Animal");
// false
console.log(animal2.constructor === Animal);
//true
console.log(animal2.constructor === Object.prototype.constructor);
```

따라서 생성자 함수의 prototype에 뭔가를 하고 싶을 땐 prototype 자체에 할당하지 말고 기본 prototype에 추가적으로 프로퍼티를 만들자.

```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.say = function () {
  console.log(this.name);
};
```

또한 prototype을 실수로 덮어썼더라도 다시 만들어 주면 된다.

```js
Animal.prototype.constructor=Animal;
```

## 2.3. 추가 정보

다음 코드를 보자. 다음 코드는 true를 출력한다. 왜일까?

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.eats = true;

let dog = new Animal("Dog");
delete dog.eats;
console.log(dog.eats);
```

delete 연산은 객체의 프로퍼티를 삭제한다. 그러나 프로토타입 체인을 따라가면서 프로퍼티를 찾는 것이 아니라 오로지 자기 자신의 것만 삭제한다.

위의 경우에도 dog의 eats속성은 자신의 것이 아니라 생성자 함수인 Animal의 프로토타입에서 eats를 가져온 것이다. 따라서 dog의 eat를 제거하려는 시도를 하면 dog에 직접 속한 eats가 없으므로 아무 일도 일어나지 않는다.

# 참고

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/delete
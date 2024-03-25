---
title: JS 탐구생활 - Proxy와 Reflect
date: "2023-10-22T00:00:00Z"
description: "ES6에서 도입된 Proxy, Reflect에 대해 알아보자"
tags: ["javascript"]
---

TS의 데코레이터를 공부하다가 어디선가 Proxy에 대해서 언급한 것을 보아서, 이전부터 한번 정리하려고 했던 해당 부분을 정리해보았다.

# 1. Proxy의 기본

## 1.1. Proxy 선언

프록시는 객체를 감싸서 객체에 가해지는 작업을 가로채서 처리하거나 어떤 추가 작업을 하는 객체이다. 추가 작업 이후에는 원래 객체가 처리하도록 전달하기도 한다.

프록시 객체는 다음과 같은 형태로 생성한다.

```js
let proxy = new Proxy(target, handler);
```

`target`은 프록시가 감쌀 객체로 JS의 모든 객체가 가능하다. `handler`는 프록시가 가로챌 작업과 가로챘을 때의 동작을 정의하는 객체로 반드시 필요하다. 객체의 동작을 가로채는 `handler`의 각 메서드는 `trap`이라고 부른다.

이렇게 생성한 프록시 객체에 작업이 가해졌을 때 `handler`에 해당 작업에 대응하는 트랩이 있다면 트랩이 실행되고, 트랩이 없다면 프록시는 원래 객체에 작업을 전달한다.

다음과 같은 경우 `handler`에 아무 트랩도 없으므로 `proxy`에 가해지는 모든 작업은 그대로 `target`에 전달된다. proxy는 일반 객체와 달리 프로퍼티가 없다.

```js
let target = {};
let proxy = new Proxy(target, {});
```

## 1.2. 트랩의 종류

트랩을 사용해 프록시가 가로챌 수 있는 작업은 다음과 같다. 이들은 원래 객체의 내부 메서드가 하는 작업인데 프록시의 트랩을 통해서 이런 내부 메서드 호출을 가로챌 수 있다.

해당 표는 [Proxy와 Reflect](https://ko.javascript.info/proxy)글에서 가져왔다.

| 트랩 이름 | 대응하는 내부 메서드 | 호출 시점 |
| --- | --- | --- |
| get | [[Get]] | 프로퍼티를 읽을 때 |
| set | [[Set]] | 프로퍼티에 값을 쓸 때 |
| has | [[HasProperty]] | in 연산자를 사용할 때 |
| deleteProperty | [[Delete]] | delete 연산자를 사용할 때 |
| apply | [[Call]] | 함수 호출 시 |
| construct | [[Construct]] | new 연산자 사용시 |
| getPrototypeOf | [[GetPrototypeOf]] | Object.getPrototypeOf |
| setPrototypeOf | [[SetPrototypeOf]] | Object.setPrototypeOf |
| isExtensible | [[IsExtensible]] | Object.isExtensible |
| preventExtensions | [[PreventExtensions]] | Object.preventExtensions |
| defineProperty | [[DefineOwnProperty]] | Object.defineProperty, Object.defineProperties |
| getOwnPropertyDescriptor | [[GetOwnProperty]] | Object.getOwnPropertyDescriptor, for..in, Object.keys/values/entries |
| ownKeys | [[OwnPropertyKeys]] | Object.getOwnPropertyNames, Object.getOwnPropertySymbols, for..in, Object.keys/values/entries |

### 1.2.1. 트랩 사용 규칙

트랩을 사용할 때는 다음과 같은 규칙을 지켜야 한다.

값을 쓰는 처리가 성공했다면 `[[Set]]`은 true를 반환하고 그렇지 않은 경우 false를 반환해야 한다.

값을 지우는 처리가 성공했다면 `[[Delete]]`는 true를 반환하고 그렇지 않은 경우 false를 반환해야 한다.

프록시 객체에 `[[GetPrototypeOf]]`가 적용되면 target 객체에 `[[GetPrototypeOf]]`를 적용한 것과 동일한 값이 반환되어야 한다. 둘의 프로토타입은 같은 것이 당연하기 때문이다.

다른 규칙들은 [프록시의 내장 메서드들 명세의 각 NOTE들에서 찾을 수 있다.](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)



# 2. 트랩 사용 예시

## 2.1. get 트랩

`get` 트랩은 프로퍼티를 읽을 때 실행된다. `get` 트랩은 `get(target, property, receiver)` 형태로 정의된다.

`target`은 동작을 전달할 객체, `property`는 프로퍼티 이름, `receiver`는 프록시 객체 또는 프록시 객체를 상속받은 객체로 getter가 호출되는 시점의 this이다. receiver는 일단 없어도 된다.

객체에 해당 key를 갖는 프로퍼티가 없을 경우 메시지를 출력하고 주어진 key를 그대로 반환하도록 해보자.

```js
let target={};
let proxy=new Proxy(target, {
  get(target, property, receiver){
    if(property in target){
      return target[property];
    }
    else{
      console.log("no such property in the given target!");
      return property;
    }
  }
})

target[1]="A";
// A
console.log(proxy[1]);
// no such ...
// 2
console.log(proxy[2]); 
```

## 2.2. set 트랩

`set`트랩은 프로퍼티에 값을 쓰려고 할 때 호출된다. `set(target, property, value, receiver)` 형태로 정의된다.

당연히 `target`은 동작을 전달할 객체, `property`는 프로퍼티 이름, `value`는 프로퍼티에 쓰려는 값, `receiver`는 get 트랩에서와 같다.

배열에 숫자만 추가되도록 하려면 다음과 같이 한다.

```js
let target=[];

let proxy=new Proxy(target, {
  set(target, property, value){
    if(typeof value==="number"){
      console.log(value, "is added to the array!")
      target[property]=value;
      return true;
    }
    else{
      console.log("only number can be added to the array!");
      return false;
    }
  }
})
```

`push`와 같은 메서드들도 내부적으로 `[[Set]]`을 사용하기 때문에 값 추가 메서드들에 대해서도 프록시가 잘 동작한다.

`set`트랩을 사용할 때는 지켜야 할 규칙이 있다. 값을 쓰는 처리가 성공했다면 `[[Set]]`은 true를 반환하고 그렇지 않은 경우 false를 반환해야 한다. falsy 값을 반환시 `TypeError`가 발생하기 때문이다.

## 2.3. has 트랩

`has` 트랩은 `in` 연산자를 사용할 때 호출된다. `has(target, property)` 형태로 정의된다.

property에 대한 특정 검증을 하도록 할 수 있다. 예를 들어서 다음과 같이 하면 `in` 연산자를 호출했을 때 range의 범위를 넘어가는지 검증할 수 있다.

```js
let range={
  start:1,
  end:10
};

range=new Proxy(range, {
  has(target, property){
    return target.start<=property && property<=target.end;
  }
});

console.log(5 in range); // true
```

이외에도 참고 자료 페이지들에서 여러 트랩의 사용을 볼 수 있다.

# 프록시의 한계점

프록시는 기존 객체의 동작을 가로채서 추가 작업을 할 수 있게 해준다. 하지만 프록시에도 한계점이 있다. 프록시는 객체의 내부 메서드를 가로채는 방식으로 동작하는데 몇몇 객체들은 다른 내부 메서드를 통해서 동작하기 때문이다.

`Map`객체는 `[[Set]]`과 `[[Get]]`을  `[[MapData]]`라는 특수 슬롯에 데이터를 저장한다. 따라서 프록시가 

# 3. Reflect

## 3.1. Reflect의 기본

`Reflect`는 Proxy와 비슷하게 내부 메서드들을 직접 사용할 수 있는 방법을 제공한다. 하지만 새로운 객체를 만드는 것이 아니라 기존 객체의 내부 메서드를 사용할 수 있게 해준다. 생성자 함수나 클래스가 아니므로 인스턴스를 만들거나 `new`로 호출할 수는 없다.

`Reflect`가 가진 메서드들은 `Proxy`에서 제공하는 핸들러와 완전히 같다. 첫 번째 인수는 내부 메서드를 적용할 `target`이고 나머지 인수들은 `Proxy`의 각 핸들러와 같다.

예를 들어 `Reflect.get`은 `[[Get]]`내부 메서드를 사용하도록 해준다.

```js
const obj={
  foo:1,
  bar:2,
}

console.log(Reflect.get(obj, "foo")); // 1
```

물론 `Proxy`와 함께 사용할 수도 있다.

```js
const obj={
  foo:1,
  bar:2,
}

const proxy=new Proxy(obj, {
  get(target, property){
    console.log("get is called!");
    return Reflect.get(target, property);
  }
})
```

`new`, `delete`같은 호출 연산자들도 각각 `Reflect.construct`, `Reflect.deleteProperty`를 통해 함수처럼 사용할 수 있다.

그런데 이런 동작들은 굳이 `Reflect`를 사용하지 않아도 할 수 있다. 그냥 `obj.foo`를 하면 되지 않는가? 따라서 `Reflect`를 쓰는 것의 장점을 알아보자.

## 3.2. Reflect의 장점

`name`속성을 다음과 같이 핸들링하는 객체가 있다고 하자. 그리고 프록시 객체를 통해서 해당 객체의 `name`속성을 가져온다.

```js
let user={
  _name:"김성현",
  get name(){
    return this._name;
  }
};

let userProxy=new Proxy(user, {
  get(target, property, receiver){
    return target[property];
  }
})

console.log(userProxy.name); // 김성현
```

이렇게 한번 `userProxy`를 만들고 나면 `user`대신 `userProxy`를 쓰는 게 맞다. 하지만 이렇게 하고 나서 `userProxy`를 상속하는 객체가 생기면 어떻게 될까?

```js
let userOnline={
  __proto__:userProxy,
  _name:"마녀",
}

// this의 작동 방식 상 `마녀`가 나오는 게 맞는 것 같은데 `김성현`이 나온다.
console.log(userOnline.name);
```

`userOnline`에는 `name`속성이 없으므로 프로토타입인 `userProxy`로 가서 처리하게 되는데 `userProxy`의 get 트랩은 `target[property]`를 반환하도록 되어 있으므로 `user`의 `name`속성을 반환하게 된다.

`Reflect`를 사용하면 이런 문제를 해결할 수 있다. `Reflect`를 사용하여 `userProxy`의 get 트랩을 다음과 같이 바꾼다.

이제 `receiver`가 알맞은 `this`에 대한 레퍼런스를 보관하고 `Reflect.get`에 전달하므로 제대로 `userOnline`의 `name`속성을 반환하게 된다.

```js
let user={
  _name:"김성현",
  get name(){
    return this._name;
  }
};

let userProxy=new Proxy(user, {
  get(target, property, receiver){
    // return Reflect.get(...arguments)로 쓸 수도 있다
    return Reflect.get(target, property, receiver);
  }
})

let userOnline={
  __proto__:userProxy,
  _name:"마녀",
}
// 마녀 출력
console.log(userOnline.name);
```





# 참고

모던 JS 튜토리얼, Proxy와 Reflect https://ko.javascript.info/proxy

JavaScript Proxy. 근데 이제 Reflect를 곁들인
https://ui.toast.com/posts/ko_20210413

자바스크립트의 프록시 https://yceffort.kr/2021/03/javascript-proxy
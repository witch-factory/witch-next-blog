---
title: 모던 자바스크립트 튜토리얼 part 1.7 객체 프로퍼티 설정
date: "2023-02-06T00:00:00Z"
description: "ko.javascript.info part 1-7"
tags: ["javascript"]
---

# 1. 프로퍼티 플래그와 설명자

프로퍼티는 값과 함께 속성 플래그 3가지를 가진다. writable, enumerable, configurable이다. 기본적으로 셋 모두 true로 설정되어 있다. 각 속성에 대한 설명은 아래와 같다.

writable : 값을 수정할 수 있는지
enumerable : for..in 루프나 Object.keys와 같은 메서드로 프로퍼티를 나열할 수 있는지
configurable : 프로퍼티를 삭제하거나 플래그 수정할 수 있는지

프로퍼티에 대한 정보는 다음 메서드로 확인할 수 있다. 이 메서드는 프로퍼티 값과 플래그 정보가 담긴 프로퍼티 설명자 객체를 반환한다.

```
Object.getOwnPropertyDescriptor(obj, property) 
```

다음과 같이 쓸 수 있는 것이다.

```js
let me = {
  firstName: "김성현",
};
console.log(Object.getOwnPropertyDescriptor(me, "firstName"));
/*
{
  value: '김성현',
  writable: true,
  enumerable: true,
  configurable: true
}
*/
```

`Object.defindProperty` 메서드를 사용하면 프로퍼티 플래그를 수정할 수 있다.

```js
Object.defineProperty(obj, propertyName, descriptor)
```

이때 descriptor는 프로퍼티 설명자 객체인데, 플래그 정보를 전달하지 않으면 자동으로 false로 설정된다.

각 프로퍼티 플래그 설정에 따라 프로퍼티에 특성이 생긴다. writable이 false면 값을 쓸 수 없게 되고, enumerable이 false면 for..in 루프나 Object.keys와 같은 메서드로 프로퍼티를 나열할 수 없게 된다. 

configurable이 false면 프로퍼티를 삭제하거나 플래그를 수정할 수 없게 된다. 예를 들어 Math.PI는 변경할 수 없는 상수이므로 configurable이 false이다.

이렇게 configurable을 false로 설정하면 돌이킬 수 없다. defineProperty를 써도 이 플래그 수정은 불가능하다.

`Object.defineProperties`를 쓰면 프로퍼티 여러 개 설정 가능하다.

`Object.getOwnPropertyDescriptors(obj)`를 쓰면 프로퍼티 설명자를 전부 가져올 수 있다. defineProperties를 쓰면 객체 복사 시 플래그까지 복사하는 것도 가능하다.

그리고 for..in을 통한 복사는 객체의 심볼형 프로퍼티는 복사하지 않는 데에 반해 아래 방법은 심볼형 프로퍼티까지 잘 복사한다.

```js
// 설명자까지 복사한 객체 리턴
Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```

# 2. 프로퍼티 getter, setter

객체의 프로퍼티는 데이터 프로퍼티와 접근자 프로퍼티로 나뉜다. 데이터 프로퍼티는 우리가 일반적으로 사용하는 데이터를 담는다. 반면 접근자 프로퍼티는 본질적으로 함수지만, getter와 setter 역할을 한다.

get, set 키워드를 이용해서 선언할 수 있고 사용할 때는 실제 프로퍼티가 있는 것처럼 사용한다. 아래는 getter를 사용한 예시이다.

```js
let me = {
  firstName: "성현",
  lastName: "김",

  get fullName() {
    return this.lastName + this.firstName;
  },
};
console.log(me.fullName);
// 김성현
```

아직 세터 메서드가 없으므로 fullName 프로퍼티는 읽기 전용이다. 값을 직접 할당하려고 해도 제대로 되지 않는다.

```js
me.fullName = "이성현";
console.log(me.fullName);
// 김성현
// 실제로는 fullName 프로퍼티가 없으므로 값이 바뀌지 않았다
```

여기에 세터를 만들면, 일반적으로 객체 프로퍼티를 사용하는 것처럼 fullName에 값을 할당할 수 있다.

```js
let me = {
  firstName: "성현",
  lastName: "김",

  get fullName() {
    return this.lastName + this.firstName;
  },

  set fullName(value) {
    [this.lastName, this.firstName] = value.split(" ");
  },
};
console.log(me.fullName);
// 김성현
me.fullName = "이 성현";
console.log(me.fullName);
// 이성현
```

## 2.1. 접근자 프로퍼티의 설명자

접근자 프로퍼티는 데이터 프로퍼티와는 다른 설명자를 가지고 있다. get, set, enumerable, configurable 플래그가 있다. value와 writable이 없어졌다.

다른 건 get, set인데 get은 인수가 없는 함수로 프로퍼티 값을 읽을 때 호출되고, set은 인수가 하나인 함수로 프로퍼티 값을 쓸 때 호출된다. 나머지 설명자는 데이터 프로퍼티에서와 같다.

이 설명자들도 defineProperty로 설정할 수 있다. 그런데 프로퍼티들은 접근자 혹은 데이터 둘 중 하나이므로 get, value를 동시에 설정하면 에러가 난다.

## 2.2. getter, setter 활용

값을 설정할 시 특정 값 이상일 때만 설정되도록 하고 싶은 등, 값을 통제하고자 할 때 쓸 수 있다.

```js
let obj = {
  get num() {
    return this._num;
  },
  set num(value) {
    if (value < 10) {
      console.log("value is too small");
    } else {
      this._num = value;
    }
  },
};

obj.num = 5;
console.log(obj.num); // 값이 10보다 작으므로 설정되지 않는다
obj.num = 15;
console.log(obj.num);
```
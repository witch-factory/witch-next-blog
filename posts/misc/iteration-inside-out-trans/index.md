---
title: 반복에서 동시성까지
date: "2023-07-25T00:00:00Z"
description: "Iteration Inside and Out을 읽고"
tags: ["study", "language"]
---

반복에 관한 글인 [Iteration Inside and Out](http://journal.stuffwithstuff.com/2013/01/13/iteration-inside-and-out/), [그리고 해당 글의 2번째 시리즈](http://journal.stuffwithstuff.com/2013/02/24/iteration-inside-and-out-part-2/)를 골자로 이해한 대로 정리하였다.

# 1. 시작

대부분의 개발자들은 어떤 것을 반복하는 문법이 프로그래밍 언어에서 아주 간단한 문제라고 생각할 것이다. 50년 전의 컴퓨터에서 작동하던 FORTRAN에서조차도 이러한 반복문이 이미 존재했을 정도니까, 당연한 생각이다. FORTRAN의 반복문은 다음과 같이 작동하였다.

```c
do i=1,10
  print i
end do
```

그럼 우리가 프로그래밍 언어, 예를 들어서 [새 프로그래밍 언어 Magpie(Iteration Inside and Out의 저자가 만들고 있는 언어라고 한다)](http://magpie-lang.org/)를 만든다면 이렇게 하면 되지 않을까?

1. 다른 언어들의 반복문을 조사한다.
2. 그중 가장 awesome하게 보이는 것을 고른다.
3. 그것을 내 프로그래밍 언어에 추가한다.

문제는 이렇게 반복문을 만드는 것이 단순히 몇 번 같은 작업을 반복하거나 특정 숫자 범위만 왔다갔다하는 문제가 아니었다는 것이다.

원초적인 질문으로 돌아가서, 반복(iteration)이란 대체 무엇인가? 물론 우리는 다음과 같은 간단한 반복문을 생각할 수 있다.

```c
int i;
for(i=0;i<n;i++) {
  printf("%d\n", i);
}
```

하지만 이런 반복도 있지 않은가? JS에서는 `for..of`와 같이 객체의 원소 전체를 반복하는 반복문도 있다. JS가 특별한 것도 아니고 Python이나 C++도 이런 기능을 지원한다.

```js
let fruits=["사과", "바나나", "포도"];

for(const fruit of fruits){
  console.log(fruit);
}
```

그럼 꼭 for문의 형태를 해야 하는가? JS의 `forEach`같은 건 어떤가? 객체의 원소 전체를 반복하며, 그 원소들에 대해 콜백 함수를 실행한다.

```js
let fruits=["사과", "바나나", "포도"];

fruits.forEach((fruit)=>console.log(fruit));
```

반복을 어떤 추상적인 시퀀스에 대하여 그것을 순회하는 것으로 생각한다면 트리의 순회는 어떤가? 아니면 소수 전체를 순회하면서 어떤 조건을 만족하는 소수가 나올 때까지 연산하는 것은? 반복은 그렇게 간단한 문제가 아니다.

먼저 반복문에 있는 2가지의 다른 스타일, internal iteration과 external iteration를 알아보았다. 각각은 서로의 명확한 장단점이 있다.

# 2. External iteration

External iteration는 말 그대로 외부에서 반복자(iterator)를 제어하는 것이다. 객체에는 반복자가 있고, 다음 원소에 접근할 수 있는 방법이 있다.

C++, Java, C#, Python, PHP등의 많은 OOP 언어에서 사용한다. for, foreach(JS의 `forEach`와 같은 메서드가 아니라 객체의 전체 원소를 순회하는 것을 일반적으로 칭한 단어이다) 문을 제공한다. 다음 언어는 dart이지만 다른 언어 사용자라고 해도 충분히 인식할 수 있을 것이다.

```dart
for (var i = 0; i < 10; i++) {
  print(i);
}

var elements = [1, 2, 3, 4, 5];
for (var i in elements) print(i);
```

위 코드가 실제로 어떻게 동작하는지를 보자.

```dart
var elements = [1, 2, 3, 4, 5];
var __iterator = elements.iterator();
while (__iterator.moveNext()) {
  var i = __iterator.current;
  print(i);
}
```

`.iterator()`, `moveNext()`, `.current`를 반복 프로토콜이라 한다. 만약 직접 반복문을 만들고 싶다면 앞의 프로토콜을 지원하는 타입을 만들면 된다. 그러면 for 문이 컴파일되면서 해당 프로토콜 메서드를 호출하게 되고, 따라서 해당 프로토콜 메서드들이 있는 타입은 반복문에서 잘 동작한다.

Java와 Dart에서는 `Iterable<T>`, C#은 `IEnumerable<T>`타입을 제공하며, Python에서는 반복 프로토콜로 `__iter__`와 `__next__`를 구현하면 반복이 실현 가능하다.


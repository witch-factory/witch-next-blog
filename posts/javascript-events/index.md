---
title: JS 이벤트
date: "2023-08-21T01:00:00Z"
description: "JS를 알아본 기록"
tags: ["javascript"]
---

# 1. 이벤트 소개

이벤트는 프로그램에서 일어나는 사건들을 일반적으로 칭하는 말이다. JS에도 이를 다루는 방법이 있다. 

## 1.1. 이벤트 핸들러

이 이벤트들은 발생 시 몇몇 신호들을 만드는데, 여기에는 대응하는 이벤트 핸들러가 있어서 이벤트 발생 시 실행할 코드를 지정할 수 있다.

이벤트 발생 -> 이벤트 리스너가 이벤트 발생 신호 수신 -> 이벤트 핸들러 실행의 순서다. 단 주의할 점은 웹 이벤트는 JS 표준에서 정의된 부분은 아니라는 것이다. 이는 WebAPI의 일부다.

`onclick`, `onfocus`, `onblur`, `onkeydown`, `ondblclick`등의 다양한 이벤트 핸들러 속성들이 있다. 이는 `button.onclick=function(){...}`과 같이 DOM 요소의 프로퍼티로도 지정될 수 있다.

`<button onclick="handleClick()">`과 같이 인라인 이벤트 핸들러를 쓸 수도 있지만 이는 권장되지 않는다. HTML과 JS를 분리하는 것이 좋고 또한 여러 개의 DOM 요소에 같은 이벤트 핸들러를 적용하고 싶을 때는 하나하나 이벤트를 추가해 줘야 하기 때문에 매우 힘들어진다.

이벤트 핸들러를 설정할 때는 `addEventListener` 메서드를 쓰는 것이 가장 좋다. [문서 링크](https://developer.mozilla.org/ko/docs/Web/API/EventTarget/addEventListener)

```js
btn.addEventListener('click', handleClick);
```

이에 반대되는 메서드는 `removeEventListener`다. 제거할 핸들러와 같은 단계에 있어야 함을 기억하자.

이런 `addEventListener` 메서드를 쓰면 하나의 요소에 2개 이상의 이벤트도 등록 가능하다.

단 `btn.onclick`과 같은 방식으로 이벤트 핸들러를 지정하면 같은 이벤트 핸들러 함수를 2개 이상 등록할 수 없다. 대신 옛날 브라우저에도 지원되는 등 크로스 브라우저 호환성이 더 좋다.

## 1.2. 이벤트 객체

이벤트 핸들러 함수는 `func(e){}`와 같이 `e` 혹은 `event`같은 이름으로 명명되는 이벤트 객체 매개변수를 가지고 있는 경우가 많다. 이는 이벤트 핸들러에 자동으로 전달되는 이벤트 객체이며 추가적인 기능과 정보를 제공한다. 

예를 들어 `e.target`은 항상 이벤트가 발생된 요소에 대한 참조이며 같은 이벤트 핸들러를 여러 다른 요소에 적용하고 싶을 때 유용하다.

그리고 `e.preventDefault()`는 사용자 에이전트가 이벤트에 대해 정의한 기본 동작을 실행하지 않도록 한다.


# 2. 이벤트 버블링과 캡처링

이는 같은 이벤트 타입의 두 이벤트 핸들러가 한 요소에서 작동되었을 때 발생하는 일을 기술한다.

예를 들어 다음과 같은 코드를 보자.

```html
<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
    <title>나의 테스트</title>
    <style>
      .parent{
        width:300px;
        height:300px;
        background-color: red;
      }
      .child{
        width:100px;
        height:100px;
        background-color: blue;
      }
    </style>
  </head>

  <body>
    <div class="parent">
      <div class="child"></div>
    </div>
    <script>
      const parent = document.querySelector('.parent');
      const child = document.querySelector('.child');
      parent.addEventListener('click', function(){
        parent.style.backgroundColor = 'green';
        console.log('parent');
      });
      child.addEventListener('click', function(){
        child.style.backgroundColor = 'yellow';
        console.log('child');
      });
    </script>
  </body>
</html>
```

이 HTML을 브라우저에서 연 뒤 child의 파란색 네모를 클릭하면 parent 박스의 색까지 모두 바뀐다. child가 parent에 포함되어 있기 때문이다.

부모 요소를 가지고 있는 요소에서 이벤트 발생시 브라우저는 캡처링과 버블링을 실행한다.

## 2.1. 캡처링

캡처링은 요소의 가장 최상위 조상에서 시작해서 캡처링 이벤트를 검사하고 그것을 실행하는 것을 말한다. 그리고 내부 요소로 이동하면서 선택된 요소에 닿을 때까지 해당 동작을 반복하는 것이다.

캡처링 단계를 이용하는 경우는 흔치 않다. 캡처링 단계에서 이벤트를 처리하려면 `addEventListener`의 세 번째 인자 객체에 capture 옵션 `true`를 전달하면 된다. 혹은 3번째 인자로 true를 전달해도 된다.

```js
// 이 이벤트가 캡처링 단계에서 처리되도록 한다
elem.addEventListener(..., ..., true);
elem.addEventListener(..., ..., {capture: true});
```

## 2.2. 버블링

버블링은 캡처링과 반대의 경우다. 이벤트가 발생한 요소에서 시작해서 가장 최상위 조상까지 올라가면서 버블링 이벤트를 검사하고 실행하는 것을 말한다. 제일 깊은 곳에서 최상위 조상까지 올라가는 게 거품이 떠오르는 것 같다고 해서 버블링이라 한다. 이때 버블링이 진행되면서 `event.target`은 변치 않는다.

현대 브라우저에서 모든 이벤트 핸들러는 버블링 단계에 등록되어 있다. 따라서 자식 요소에서 시작해서 최상위 조상 요소까지 올라가며 이벤트를 실행하게 된다.

위 코드에서도 순서를 따진다면 child의 이벤트 핸들러가 먼저 실행되고 그 후 parent의 이벤트 핸들러가 실행된다.

이런 동작을 막기 위해선 이벤트 객체 e에 `e.stopPropagation()`을 사용하면 된다. 이는 이벤트가 조상 요소로 전파되는 것을 막는다. 즉 이벤트가 발생한 요소에서 이벤트가 끝나게 된다. 위 코드 같은 경우 child의 이벤트리스너를 변경하면 된다.

```js
child.addEventListener('click', function(e){
  e.stopPropagation();
  child.style.backgroundColor = 'yellow';
  console.log('child');
});
```

`e.stopImmediatePropagation`은 요소의 같은 이벤트에 할당된 다른 모든 핸들러의 동작도 막는다. 단 이렇게 버블링을 막아야 할 일들은 거의 없다.

## 2.3. 이벤트 위임

버블링은 이점도 있다. 이벤트 위임을 가능하게 하는 것이다. 많은 자식 요소가 있고 그 중 하나를 선택했을 때의 코드를 실행하길 원한다고 해보자.

그러면 모든 자식에 이벤트 리스너를 설정하는 대신 부모 요소에 이벤트 리스너를 설정하면 된다. 자식 요소에서 이벤트가 발생하면 해당 이벤트가 부모로 버블링되어 올라갈 것이다.

예를 들어 리스트 아이템들이 선택되었을 때 메시지를 띄우길 원한다면 다음과 같이 할 수 있다.

```html
<ul id="parent-list">
  <li id="post-1">Item 1</li>
  <li id="post-2">Item 2</li>
  <li id="post-3">Item 3</li>
  <li id="post-4">Item 4</li>
  <li id="post-5">Item 5</li>
  <li id="post-6">Item 6</li>
</ul>
```

```js
const parentList = document.querySelector('#parent-list');
parentList.addEventListener('click', function(e){
  const id = e.target.id;
  alert(`You clicked on item #${id}`);
});
```

이렇게 하면 모든 리스트 아이템에 이벤트 리스너를 설정할 필요가 없다. 리스트 아이템에서 발생한 이벤트가 버블링되어 부모 요소에 전달되기 때문이다.


# 참고

https://developer.mozilla.org/ko/docs/Learn/JavaScript/Building_blocks/Events

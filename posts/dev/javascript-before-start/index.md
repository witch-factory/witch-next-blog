---
title: JS 시작을 위한 지식
date: "2022-12-03T00:00:00Z"
description: "ko.javascript.info part 1-1"
tags: ["javascript"]
---

# 1. 자바스크립트란?

자바스크립트는 브라우저에서 작동하는 프로그래밍 언어이다. 이는 브라우저에 V8, 스파이더몽키 등 JS 가상 머신(엔진)이 내장되어 있기 때문이다. 이 엔진은 스크립트를 읽고 기계어로 전환하고 실행한다.

# 2. 브라우저에서 할 수 없는 일

JS는 브라우저를 조작할 수 있는 언어이다. 요즘은 서버에서도 JS를 사용할 수 있지만, 기본적으로는 브라우저에서 작동한다. 하지만 브라우저에서도 할 수 없는 일들이 다음과 같이 있다. JS에서 할 수 없는 일이라고 생각해도 무방하다.

먼저 디스크에 저장된 임의의 파일을 다룰 수 없다. `<input type="file">`태그를 쓰는 등 특수한 경우에만 가능하다.

사용자의 명시적인 허가 없이 카메라, 마이크, 위치 정보 등을 가져올 수 없다. 이는 보안상의 이유로 브라우저에서 제한되어 있다. 일반적으로 볼 수 있는 '카메라 권한 허용'등이 이런 것에 대해 사용자의 허가를 얻는 것이다.

일반적으로 브라우저 내의 서로 다른 탭, 창은 서로의 정보를 알 수 없다. Same Origin Policy 때문이다. 따라서 두 페이지 간의 데이터 교환을 위해서는 서로가 데이터 교환에 동의해야 하고 특정한 js 코드를 포함해야 한다.

# 3. 참고하면 좋은 자료

JS의 공식문서라 할 수 있는 ECMA-262 https://www.ecma-international.org/publications/standards/Ecma-262.htm
그러나 공부할 땐 MDN이 더 낫다.

MDN에서 제공하는 레퍼런스 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference

브라우저가 특정 기능을 지원하는지 확인 https://caniuse.com/

# 4. 세팅하기

본격적으로 JS 문법을 배우기 전에 먼저 JS를 사용하기 위한 세팅을 해야 한다. 물론 브라우저에서 실행할 수도 있고 [code playground](https://playcode.io/)같은 곳도 있지만 나는 HTML 파일을 사용하겠다.

script 태그를 사용하면 JS 코드를 HTML 문서에 삽입할 수 있는데, 이 기초가 되는 파일을 먼저 만들자. js-study 폴더를 만들고 index.html 파일을 만들자.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Study Page</title>
  </head>
  <body>
    <h1>마녀</h1>
  </body>
</html>
```

vscode의 Open in browser 익스텐션을 사용하면 html파일을 vscode를 통해서 바로 열 수 있다. index.html을 vscode 상에서 우클릭하고 Open in Default browser를 선택하면 브라우저에서 열린다.

다음과 같이 js를 삽입하여 사용할 것이다.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Study Page</title>
  </head>
  <body>
    <script>
      alert("Hello World");
    </script>
  </body>
</html>
```

## 4.1. script 태그 속성

script 태그에도 속성이 붙어 있을 때가 있다. `async`나 `defer`와 같은 몇몇 중요한 속성도 있지만 지금 당장은 그것들 대부분이 중요하지 않다. 따라서 몇 가지만 알고 넘어가자.

### 4.1.1. language 속성

현재 사용하고 있는 스크립트 언어를 나타낸다. 하지만 지금은 deprecated되었고 대신 type속성을 사용한다.

### 4.1.2. type 속성

HTML4에서는 이 속성을 꼭 명시해야 했다. 또한 이전에는 이 파일이 어떤 스크립팅 언어를 사용하는지를 명시하는 역할을 했다. 하지만 HTML5에서는 이 속성을 생략해도 된다. 기본값은 JS MIME타입이다. 오히려 이를 생략함으로써 JS MIME 타입을 굳이 명시하지 않는 것을 권장한다.

이 속성은 JS 모듈을 명시하는 데에도 사용된다. `type="module"`로 설정하면 이 태그 안의 코드가 JS 모듈이라는 것을 의미한다.

### 4.1.3. 외부 스크립트 사용하기

script 태그의 src 속성을 사용하면 외부 스크립트(파일, URL등)를 사용할 수 있다. JS코드가 길어질 경우 이런 식으로 .js파일로 분리하고 불러오는 방식으로 사용하는 것이 좋다.

```html
<script src="./script.js"></script>
```

만약 script 태그가 src 속성을 가지고 있다면 태그 내부의 코드는 무시된다.

다음과 같이 `script.js`를 작성한다.

```js
alert("안녕");
```

그리고 같은 위치에 index.html을 이렇게 작성한다.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Study Page</title>
  </head>
  <body>
    <script src="./script.js">
      alert("Hello World");
    </script>
  </body>
</html>
```

그리고 index.html을 실행하면 `안녕`이라고 쓰인 alert창만 뜨는 것을 확인할 수 있다.

# 5. 코드 구조

statement(문)은 어떤 작업을 수행하는 문법 구조, 명령어이다. 코드엔 원하는 만큼 문을 작성할 수 있는데 서로 다른 문은 `;`로 구분한다. 그리고 가독성을 위해 보통 한 줄에 한 문을 작성한다.

```js
alert("Hello");
alert("World");
```

## 5.1. 세미콜론

앞에서 각 문은 세미콜론으로 구분한다고 배웠다. 그런데 줄 바꿈이 있으면 세미콜론을 생략할 수 있다. 예를 들어서 다음과 같은 코드는 문제가 없다. 각 문 뒤에 세미콜론이 자동으로 붙기 때문이다.

```js
alert("Hello World")
alert("my code")
```

줄바꿈을 암시적으로 세미콜론으로 해석하는 방식을 automatic semicolon insertion이라 한다. 대부분의 경우 줄바꿈은 세미콜론을 의미하는 것이다. 이것에 관한 구체적인 규칙은 [이 글에 있는데 일반적으로는 statement 사이에 세미콜론을 다 붙여 주는 게 좋다는 것이 결론이다.](https://witch.work/posts/dev/javascript-semicolon-insertion)

## 5.2 주석

주석은 스크립트의 어느 곳에나 작성 가능하고 JS 엔진에 의해 무시되기 때문에 주석의 위치도 실행에 영향을 주지 않는다.

한 줄짜리 주석은 `//`로 만든다. 그리고 여러 줄 주석은 `/*`와 `*/`로 만든다.

```js
// 한 줄 주석
/* 여러
줄
주석 */
```

그리고 주석을 중첩해서 사용할 수 없다는 점에 주의하자. `/* */` 안에 `/* */`를 넣으면 에러가 발생한다.

### 5.2.1 주석 만들기 단축키

여러 줄을 선택한 후에 `Ctrl + /`를 누르면 주석을 만들 수 있다. mac 같은 경우 `Cmd + /`를 누르면 된다. 그리고 주석으로 처리된 부분을 선택한 후 해당 단축키를 다시 누르면 일괄적으로 주석이 해제된다.

vscode와 같은 대부분의 에디터에서 지원하는 편리한 기능이니 알아두자.

# 6. strict mode

JS는 ES5로 넘어오면서 새로운 기능이 추가되고 기존 기능 중 일부를 변경하기도 했다. 이러면서 하위 호환성 문제가 있었다. 따라서 ES5부터는 strict mode라는 기능이 추가되었다. 이 기능을 사용하면 ES5 변경사항이 적용된다. 그렇지 않으면 이전의 규칙을 따른다.

strict mode를 사용하려면 스크립트 맨 위에 `"use strict"`를 작성하면 된다. 스크립트 최상단이 아니면 엄격 모드가 적용되지 않는다.

그리고 한번 strict mode가 적용되면 다시 해제할 수 없다.

## 6.1 use strict 생략

모던 자바스크립트에선 클래스와 모듈이라는 구조를 제공한다. 이를 사용하고 있다면, 또한 script 태그에 `type="module"` 속성이 있다면 자동으로 엄격 모드가 코드에 적용된다. 이 경우 `"use strict"`를 생략해도 된다.

따라서 만약 클래스나 모듈을 사용하는 모던 자바스크립트를 사용하고 있다면 `"use strict"`를 굳이 쓰지 말자.

# 참고

[MDN의 script 태그의 type 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-type)

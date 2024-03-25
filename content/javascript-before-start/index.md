---
title: 자바스크립트 배경지식
date: "2023-08-21T00:00:00Z"
description: "자바스크립트의 몇 가지 배경지식을 알아보자"
tags: ["javascript"]
---

# 1. JS 소개

## 1.1. JS의 용도

HTML이 웹 콘텐츠의 구조를 짜고 의미를 부여하며, CSS가 콘텐츠에 스타일을 적용할 수 있게 한다면 JS는 콘텐츠를 동적으로 만들어준다. 

이 JS는 브라우저에서 작동하는 프로그래밍 언어이다. 브라우저에 내장된 V8, 스파이더몽키 등의 JS 가상 머신(엔진)이 JS 스크립트를 읽고 기계어로 전환하고 실행한다.

이를 이용하면 페이지를 동적으로 만들 수 있다. 예를 들어서 페이지의 모든 요소(DOM element)에는 style 속성이 존재하며 해당 요소의 인라인 CSS 스타일을 모두 담고 있는데, JS를 이용하면 이를 변경하여 스타일을 동적으로 제어할 수 있다.

그리고 클라이언트 사이드 JS에서는 브라우저 API(DOM API나 Canvas, [오디오/비디오 API](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery)등)는 물론 많은 서드파티 API를 사용해서 더 많은 일을 할 수도 있다.

물론 [express](https://expressjs.com/ko/)와 같은 걸 이용해서 서버사이드에서 JS를 쓸 수도 있다.

## 1.2. JS의 동작

웹 페이지를 브라우저로 불러오게 되면 먼저 HTML과 CSS를 불러온다. 그리고 HTML을 파싱하면서 DOM을 만들고, CSS를 파싱하면서 CSSOM을 만든다. 그리고 이 둘을 합쳐서 렌더 트리를 만든다. 

이 렌더 트리는 브라우저 화면에 표시되는 노드들로 구성된다. 그 다음 JS를 코드가 작성된 순서대로 실행하여 렌더 트리를 동적으로 수정하고 UI를 업데이트한다. 그리고 JS는 기본적으로 인터프리터 언어이지만 JIT 컴파일러를 통해 자주 실행되는 코드를 바이트코드로 변환하여 성능 향상을 꾀한다.

이때 실행되는 원리를 자세히 보려면 [wishone님의 블로그](https://velog.io/@wish/JavaScript%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%BB%B4%ED%8C%8C%EC%9D%BC%EB%90%A0%EA%B9%8C)에 설명되어 있다. 

## 1.3. JS로 할 수 없는 일

브라우저에서도 할 수 없는 일들이 몇 가지 있다. JS에서 할 수 없는 일이라고 생각해도 무방하다.

먼저 디스크에 저장된 임의의 파일을 다룰 수 없다. `<input type="file">`태그를 쓰거나 `FormData`객체를 사용하는 등 특수한 경우에만 가능하다.

그리고 사용자의 명시적인 허가 없이 카메라, 마이크, 위치 정보 등을 가져올 수 없다. 이는 보안상의 이유로 브라우저에서 제한되어 있다. 웹에서 몇몇 프로그램을 사용하다 보면 볼 수 있는 '카메라 권한 허용'등이 이런 것에 대해 사용자의 허가를 얻는 것이다.

또 일반적으로 브라우저 내의 서로 다른 탭, 창은 서로의 정보를 알 수 없다. Same Origin Policy 때문이다. 따라서 두 페이지 간의 데이터 교환을 위해서는 서로가 데이터 교환에 동의해야 하고 특정한 js 코드를 포함해야 한다.

# 2. 세팅과 몇몇 정보

본격적으로 JS 문법을 배우기 전에 먼저 JS를 사용하기 위한 세팅을 해야 한다. 물론 브라우저에서 실행할 수도 있고 [code playground](https://playcode.io/)같은 곳도 있지만 나는 HTML 파일을 사용하겠다.

HTML 문서의 `<head>` 태그 안에 `<script>` 태그를 넣어 스크립트를 실행할 수 있다. 이 때, `src` 속성을 이용해 외부 스크립트 파일을 로딩할 수도 있다. JS코드가 길어질 경우 이런 식으로 `.js`파일로 분리하고 불러오는 방식으로 사용하는 것이 좋다.

아무튼 JS를 실행할 배경이 되는 HTML 파일을 먼저 만들자. js-study 폴더를 만들고 index.html 파일을 만들자.

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

## 2.1. `<script>`

여담이지만, `<script>` 태그에도 속성이 붙어 있을 때가 있다. 몇 가지만 알고 넘어가자.

language 속성은 현재 사용하고 있는 스크립트 언어를 나타낸다. 하지만 지금은 deprecated되었고 대신 type속성을 사용한다.

type속성은 파일이 어떤 스크립팅 언어를 사용하는지를 명시하는 역할을 했으며 HTML4에서는 이 속성을 꼭 명시해야 했다.

하지만 HTML5에서는 이 속성을 생략해도 된다. 기본값은 JS MIME 타입이다. 요즘은 오히려 이를 생략함으로써 JS MIME 타입을 굳이 명시하지 않는 것이 권장된다.

이 속성은 또한 JS 모듈을 명시하는 데에도 사용된다. `type="module"`로 설정하면 이 태그 안의 코드가 JS 모듈이라는 것을 의미한다.

앞서 말했듯 src 속성을 사용하면 외부 스크립트(파일, URL등)를 사용할 수 있다.

```html
<script src="./script.js"></script>
```

만약 `<script>` 태그가 src 속성을 가지고 있다면 태그 내부의 코드는 무시된다. 다음과 같은 파일의 경우 `script.js`의 내용만 실행된다.

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

## 2.2. 스크립트 로딩 관련

HTML 문서의 `<head>` 태그 안에 `<script>` 태그를 넣어 스크립트를 실행할 수 있다. 이 때, `src` 속성을 이용해 외부 스크립트 파일을 로딩할 수도 있다.

그런데 문제는 모든 HTML이 순서 그대로 불려온다는 것이다. 다음과 같은 경우를 생각해 보자.

```js
const buttons = document.querySelectorAll('button');

for (const button of buttons) {
  button.addEventListener('click', createParagraph);
}
```

```html
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>My test page</title>
    <script src="test.js"></script>
  </head>
  <body>
    <button>문단 추가 버튼</button>
  </body>
</html>
```

위 코드가 정상적으로 작동한다면, 버튼을 누를 때마다 문단이 추가되어야 한다. 그러나 코드를 실행해 보면 그렇지 못하다는 것을 알 수 있다.

body의 button 태그가 로딩되기 전에 head태그의 script 태그가 먼저 불려와서 JS의 `addEventListener`를 실행해 버리기 때문이다. HTML이 순서대로 로딩되는 건 이런 문제를 낳는다. 이를 해결하는 방식은 3가지 있다.

가장 고전적인 방법은 `<script>`태그를 본문의 맨 마지막 줄, body의 닫는 태그 바로 앞에 쓰는 것이다. 그러면 모든 HTML이 로딩된 후에 스크립트가 로딩된다. 이렇게 하면 HTML을 모두 불러오기 전에는 스크립트를 전혀 실행할 수 없다는 문제가 있다.

다른 하나는 `DOMContentLoaded`를 쓰는 방법이다. 이는 브라우저가 HTML 문서를 다 읽었다는 것을 나타내는 이벤트를 수신한 시점에 스크립트를 실행한다.

```html
<script>
  document.addEventListener("DOMContentLoaded", (event)=>{
    // 실행할 JS 코드
  });
</script>
```

async, defer 속성을 사용할 수도 있는데 이는 다음 섹션에서 알아보자.

## 2.3. async, defer

위 문제 해결을 위해 async 혹은 defer 속성을 이용할 수 있다.

`defer`속성을 `<script>`태그에 지정하면 HTML 문서가 다 읽힌 후에 스크립트를 실행하도록 한다. 

즉 HTML 분석이 끝나서 DOM이 준비된 이후, `DOMContentLoaded` 이벤트가 발생하기 전에 실행된다. 그리고 HTML 분석(파싱) 동안에도 별도 스레드에서 스크립트를 로딩하게 하여 로딩 시간을 줄여 준다. 스크립트 로딩이 완료될 시 해당 스크립트 실행은 페이지 구성이 끝날 때까지 지연된다.

그러나 외부 스크립트를 불러올 때만 사용할 수 있다. `<script>`태그에 `src`속성이 없으면 `defer`속성은 무시된다.

```html
<script src="script.js" defer></script>
```

script에 `async`속성을 지정할 수도 있다. 이 경우 스크립트는 페이지 로딩과 완전히 독립적으로 동작한다.

`async` 속성이 지정된 스크립트는 백그라운드에서 다운로드되고 다운로드가 끝나면 즉시 실행된다. 스크립트가 실행되는 동안은 페이지 렌더링이 잠시 중단되고, 스크립트 실행이 끝나면 이어서 진행된다.

기존 script 태그같은 경우 HTML 분석 중 script를 만나게 되면 HTML 분석을 멈추고 로딩+실행을 하고 나서 다시 HTML 분석을 시작한다.

하지만 async를 쓰면 HTML 파싱 동안에도 스크립트 로딩을 할 수 있다. 딱 로딩된 JS 스크립트의 실행 시간만큼만 HTML 분석을 멈추게 된다.

단 단점은 HTML 분석 동안 스크립트들을 병렬로 로딩하기 때문에 스크립트들의 실행 순서가 보장되지 않는다는 것이다. 먼저 로딩되는 것부터 실행된다. 따라서 독립적인 스크립트에만 사용하자. 실행순서가 중요하다면 `defer`를 사용하자.

![async와 defer의 차이](./async-defer.jpg)

출처 [MDN 문서](https://developer.mozilla.org/ko/docs/Learn/JavaScript/First_steps/What_is_JavaScript#%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8_%EB%A1%9C%EB%94%A9_%EC%A0%84%EB%9E%B5)

`async`, `defer`모두 브라우저가 HTML을 파싱하는 동안 스크립트를 로딩할 수 있게 해준다. 스크립트를 가져오는 동안에도 페이지 로딩이 이루어질 수 있도록 해주는 것이다.

의존성 없는 스크립트를 불러오는 대로 바로바로 실행하려면 `async`를, 의존성이 있거나 DOM 로딩 이후에 실행되어야 할 스크립트들을 순서대로 실행하려면 `defer`를 사용하자.


# 3. 코드 구조

statement(문)은 어떤 작업을 수행하는 문법 구조, 명령어이다. JS에서도 코드에 원하는 만큼 문을 작성할 수 있는데 서로 다른 문은 `;`로 구분한다. 그리고 가독성을 위해 보통 한 줄에 한 문을 작성한다.

```js
alert("Hello");
alert("World");
```

## 3.1. 세미콜론

앞에서 각 문은 세미콜론(`;`)으로 구분한다고 배웠다. 그런데 줄 바꿈이 있으면 세미콜론을 생략할 수 있다. 예를 들어서 다음과 같은 코드는 문제가 없다. 각 문 뒤에 세미콜론이 자동으로 붙기 때문이다.

```js
alert("Hello World")
alert("my code")
```

줄바꿈을 암시적으로 세미콜론으로 해석하는 방식을 automatic semicolon insertion이라 한다. 대부분의 경우 줄바꿈은 세미콜론을 의미하는 것이다. 

이것에 관한 구체적인 규칙은 [이 글에 있는데 일반적으로는 statement 사이에 세미콜론을 다 붙여 주는 게 좋다는 것이 결론이다.](https://witch.work/posts/javascript-semicolon-insertion)

## 3.2 주석

주석은 스크립트의 어느 곳에나 작성 가능하고 JS 엔진에 의해 무시되기 때문에 주석의 위치도 실행에 영향을 주지 않는다.

한 줄짜리 주석은 `//`로 만든다. 그리고 여러 줄 주석은 `/*`와 `*/`로 만든다.

```js
// 한 줄 주석
/* 여러
줄
주석 */
```

그리고 주석을 중첩해서 사용할 수 없다는 점에 주의하자. `/* */` 안에 `/* */`를 넣으면 에러가 발생한다.

약간의 팁인데, vscode에서 코드 여러 줄을 선택한 후에 `Ctrl + /`를 누르면 주석을 만들 수 있다. mac 같은 경우 `Cmd + /`를 누르면 된다. 그리고 주석으로 처리된 부분을 선택한 후 해당 단축키를 다시 누르면 일괄적으로 주석이 해제된다.

vscode뿐 아니라 대부분의 에디터에서 지원하는 편리한 기능이니 알아두자.

# 4. strict mode

JS는 ES5로 넘어오면서 새로운 기능이 추가되고 기존 기능 중 일부를 변경하기도 했다. 이러면서 하위 호환성 문제가 있었다. 따라서 ES5부터는 strict mode라는 기능이 추가되었다. 이 기능을 사용하면 ES5 변경사항이 적용된다. 그렇지 않으면 이전의 규칙을 따른다.

strict mode를 사용하려면 스크립트 맨 위에 `"use strict"`를 작성하면 된다. 스크립트 최상단이 아니면 엄격 모드가 적용되지 않는다.

그리고 한번 strict mode가 적용되면 다시 해제할 수 없다.

## 4.1. use strict 생략

모던 자바스크립트에선 클래스와 모듈이라는 구조를 제공한다. 이를 사용하고 있다면, 또한 script 태그에 `type="module"` 속성이 있다면 자동으로 엄격 모드가 코드에 적용된다. 이 경우 `"use strict"`를 생략해도 된다.

따라서 만약 클래스나 모듈을 사용하는 모던 자바스크립트를 사용하고 있다면 `"use strict"`를 굳이 쓰지 말자.

# 5. 참고하면 좋은 자료

JS 시리즈는 MDN의 JS 이야기를 주로 참고해서 글을 쓴다. https://developer.mozilla.org/ko/docs/Web/JavaScript

깊이있는 자료들은 다음과 같은 곳에서 얻을 수 있다.

JS의 공식문서라 할 수 있는 ECMA-262 https://www.ecma-international.org/publications/standards/Ecma-262.htm
그러나 공부할 땐 MDN이 더 낫다.

MDN에서 제공하는 레퍼런스 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference

브라우저가 특정 기능을 지원하는지 확인 https://caniuse.com/

# 참고

[MDN의 script 태그의 type 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-type)

defer, async 스크립트 https://ko.javascript.info/script-async-defer
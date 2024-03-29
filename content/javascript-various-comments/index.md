---
title: JS 탐구생활 - JS의 주석은 //과 /* */뿐만이 아니다
date: "2024-01-06T00:00:00Z"
description: "JS 주석의 종류, 그리고 이야기들"
tags: ["javascript"]
---

# 썸네일

![JS 주석 이미지](./js-comment.webp)

# 시작

Javascript 명세 등 여러 자료를 보면서 알게 된 주석 관련 이야기들을 정리하였다.

`//`와 `/* */`로 각각 한 줄 주석과 여러 줄 주석을 만들 수 있다는 것은 알고 있었다. 

하지만 명세에는 `#!`로 시작하는 Hashbang Comments와 HTML 주석 형식인 `<!--`와 `-->`로 감싸는 HTML-like Comments등 다른 것도 정의되어 있었다.

또한 주석은 일반적으로 공백처럼 동작하는 것, `/* */`주석이 어디에서 유래되었는지 등도 알게 되었다. 이렇게 알게 된 점들을 여기 기록한다.

먼저 기본적인 주석 문법부터 시작하자.

# 1. 한 줄 주석

JS를 처음 배울 때 주석은 `//`로 시작하는 한 줄 주석과 `/* */`로 감싸는 여러 줄 주석이 있다는 것을 배운다. 당연하게도 이는 명세에도 잘 정의되어 있다. 이것들이 어떻게 명세에 정의되어 있는지 먼저 알아보자.

## 1.1. 문법

한 줄 주석은 간단하다. `//`로 시작하는 한 줄을 주석 처리한다. 한 줄 주석은 `LineTerminator`를 제외한 모든 유니코드 글자를 포함할 수 있다. 토큰은 가능한 한 길게 해석되는 규칙이 있기 때문에 한 줄 주석은 항상 `//` 부터 줄 끝까지의 모든 글자로 구성된다.

이때 LineTerminator란 말 그대로 줄바꿈을 의미하는 문자인데 명세상 다음과 같은 것들이 LineTerminator에 해당한다.

- LF: Line Feed, U+000A
- CR: Carriage Return, U+000D
- LS: Line Separator, U+2028
- PS: Paragraph Separator, U+2029

명세에서 한 줄 주석은 `SingleLineComment`로 정의되어 있다. `//` 다음에 오는 `SingleLineCommentChars` 형식이다.

```
SingleLineComment ::
  // SingleLineCommentChars(option)
```

`SingleLineCommentChars`는 `LineTerminator`가 아닌 모든 글자로 이루어진 시퀀스라는 걸 알 수 있다.

```
SingleLineCommentChars ::
  SingleLineCommentChar SingleLineCommentChars(option)

SingleLineCommentChar ::
  SourceCharacter but not LineTerminator
```

## 1.2. 취급

한 줄 주석은 일반적으로 공백처럼 동작한다. 그리고 줄 끝의 LineTerminator는 한 줄 주석에 속한 걸로 간주되지 않는다. 이는 문법적으로 별도로 인식된다.

따라서 한 줄 주석은 LineTerminator를 포함하지 않으므로 자동 세미콜론 삽입에 영향을 주지 않는다. 자동 세미콜론 삽입에 대해서는 [JS 탐구생활 - 세미콜론 자동 삽입](https://witch.work/posts/javascript-semicolon-insertion)을 참고할 수 있다.

# 2. 여러 줄 주석

## 2.1. 문법

여러 줄 주석은 `/*`로 시작해서 `*/`로 끝나는 주석이다. 여러 줄 주석은 중첩될 수 없다. 명세를 보면 `MultiLineComment`로 정의되어 있다. 이는 `/*`, `*/`로 감싸인 `MultiLineCommentChars`이다.

```
MultiLineComment ::
  /* MultiLineCommentChars(option) */
```

`MultiLineCommentChars`는 `*`로 시작하는 `PostAsteriskCommentChars`혹은 `*`이 아닌 글자로 시작하는 `MultiLineCommentChars`이다. 그리고 `PostAsteriskCommentChars`는 `*`도 `/`도 아닌 글자로 시작하는 `MultiLineCommentChars`이거나 `*`로 시작하는 `PostAsteriskCommentChars`자기 자신이다.

```
MultiLineCommentChars ::
  * PostAsteriskCommentChars(option)
  MultiLineNotAsteriskChar MultiLineCommentChars(option)

PostAsteriskCommentChars ::
  MultiLineNotForwardSlashOrAsteriskChar MultiLineCommentChars(option)
  * PostAsteriskCommentChars(option)
```

`PostAsteriskCommentChars`가 `/`로 시작하면 안되는 이유는 해당 토큰 이전에는 `*`이 오는데 이 토큰이 `/`로 시작하면 `*/`이 완성되어 여러 줄 주석이 끝나버리기 때문이다.

즉 풀어 써보면 여러 줄 주석은 다음과 같은 형태를 가진다. 여러 줄 주석은 `/* */` 사이에 있는 문자열인데 `*`로 시작하는 줄은 `/`로 시작하면 안되고 나머지는 상관없는 것이다.

```
/*
  MultiLineNotAsteriskChar MultiLineCommentChars(option)
  * MultiLineNotForwardSlashOrAsteriskChar MultiLineCommentChars(option)
*/
```

## 2.2. 취급

`/* */`형식의 주석이 한 줄이라면 한 줄 주석과 같이 공백으로 취급된다.

단 만약 여러 줄 주석이 LineTerminator를 포함하면 전체 주석은 파싱을 위해 LineTerminator로 간주된다.

## 2.3. 유래

`/* */` 로 감싼 여러 줄 주석 형식은 C보다도 먼저 나왔던 PL/1이라는 언어에서 비롯되었다. 이 언어는 1964년에 IBM에서 만들었는데 당시에 용도별로 분리되어 있던 많은 언어들을 하나로 통합하고자 하는 시도였다.

PL/1에서는 문자열 리터럴을 제외하고는 `/* */`이 문자 조합이 거의 나타나지 않았기 때문에 이를 주석으로 사용하였다. 하지만 JS에서는 정규 표현식에서도 이런 조합이 나타날 수 있다. 그래서 이 주석 방식은 문제를 일으킬 수 있다.

더글라스 크락포드의 '자바스크립트 핵심 가이드'에서는 다음과 같은 코드를 예시로 제시한다. 이 코드는 구문 오류를 발생시킨다.

```js
/*
  var rm_a = /a*/.match(s);
*/
```

그래서 Javascript에서는 `//`를 사용하는 게 권장될 때가 많다.

# 3. Hashbang Comments

ECMA 명세에는 다른 종류의 주석들도 정의되어 있다. Hashbang Comments와 HTML-like Comments이다. 이 섹션에서는 Hashbang Comments에 대해서 알아보자.

## 3.1. 문법

이는 hashbang 혹은 shebang이라고 부르는 `#!`로 시작하는 한 줄 주석이다. 그리고 `#!` 이전에 공백이 있으면 안된다.

한 줄 주석이므로 역시 주석을 끝내는 `LineTerminator`를 제외한 모든 글자를 쓸 수 있다. 명세는 다음과 같다.

```
HashbangComment ::
  #! SingleLineCommentChars(option)
```

이 주석은 그 특성상 스크립트 혹은 모듈의 첫 시작 부분에서만 유효하다. 어떤 특성인지는 다음 섹션에서 알아본다.

## 3.2. Hashbang Comments의 목적

이는 원래 Unix계열의 운영체제에서 사용되던 것이다. `#!`로 시작하는 문자열이 첫 줄에 있는 파일은 해당 파일을 실행할 때 `#!` 이후의 문자열을 인터프리터로 사용한다. 예를 들어 `#!bin/bash`로 시작하는 파일은 bash 쉘 인터프리터로 실행된다.

Javascript에서도 비슷한 목적으로 해당 주석 형식이 도입되었다. 이는 스크립트나 모듈 파일에 처음에 선언되어서 해당 코드를 실행할 때 어떤 Javascript 인터프리터를 사용할지 명시하는 역할을 한다. 그리고 문법적으로는 한 줄 주석과 같다.

스크립트가 쉘에서 돌아가지 않는 이상 이 주석은 일반적인 한 줄 주석과 완전히 같은 의미를 갖는다.

```js
#!/usr/bin/env node

console.log("Hello world");
```

이는 서버사이드 Javascript에서 유용하다. 서버에는 여러 Javascript 인터프리터가 있을 수 있는데 이 주석을 통해서 어떤 인터프리터를 사용할지 명시할 수 있기 때문이다.

그런 유용한 점 때문에 표준에 도입되기 전에도 Node.js와 같은 브라우저 이외의 Javascript 환경에서 사실상의 표준(de facto standard)로 사용되었다.

당연하지만 이 hashbang comment를 한 줄 주석을 위해 써서는 안된다. 스크립트 혹은 모듈의 첫 줄에서만 유효하기 때문이다. 사용할 인터프리터를 명시하기 위함이라는 주석의 목적을 생각해도 한 줄 주석을 위해 쓰면 안된다.

# 4. HTML-like Comments

ECMA-262 명세의 [B.1 Additional Syntax](https://tc39.es/ecma262/#sec-additional-syntax)항목을 보면 첫 항목에 HTML-like comments가 정의되어 있다. 이는 HTML 주석 문법인 `<!--`와 `-->`를 이용한 주석이다.

## 4.1. 문법

`<!--`은 `SingleLineHTMLOpenComment`로 정의되어 있다. 한 줄 주석과 똑같이 작동하여 `LineTerminator`를 제외한 모든 글자를 포함할 수 있다.

```
SingleLineHTMLOpenComment ::
  <!-- SingleLineCommentChars(option)
```

이런 식으로 쓰일 수 있다.

```js
console.log(1); <!-- 한줄주석
```

`-->`은 `SingleLineHTMLCloseComment`로 정의되어 있다. 주석 내용 자체는 한 줄 주석과 똑같이 작동하여 `-->` 다음에 오는 같은 줄의 글자들을 주석 처리한다. 단 `-->`이전에는 공백, 줄바꿈 혹은 한 줄로 제한된 주석만 있어야 하고 다른 글자가 있으면 안된다.

명세의 구조를 풀어 쓰면 다음과 같다.

```
SingleLineHTMLCloseComment ::
  LineTerminatorSequence WhiteSpaceSequence(option)  SingleLineDelimitedCommentSequence(option) --> SingleLineCommentChars(option)
```

이런 식으로 쓰는 것이다.

```js
*/ --> 주석내용
--> 한줄주석
console.log(1); --> 한줄주석 // 이건 --> 이전에 다른 글자가 와서 안된다.
```

## 4.2. 목적[^1]

Javascript는 1995년에 처음 나왔는데, 그 이전에 나온 브라우저들도 있었다. 따라서 Javascript의 초기에는 Javascript를 지원하지 않는 구식 브라우저들이 많았다.

예를 들어 1993년에 나온 모자이크에는 Javascript를 처리하는 기능이 없었다. Javascript를 처음으로 도입했던 건 1995년 9월에 나온 넷스케이프 네비게이터 2라는 브라우저였다. 당연히 Javascript를 포함하는 `<script>`태그를 제대로 처리할 수도 없었다.

따라서 Javascript를 HTML 문서의 `<script>`태그에 포함한 경우 구식 브라우저에서의 호환성 문제가 있었다. 구식이지만 당시 많은 사람들이 사용하고 있었던, Javascript를 지원하지 않는 브라우저들의 경우 `<script>` 요소를 만나면 해당 요소의 본문을 웹 페이지에 일반 텍스트로 표시해버렸다.

이 문제는 HTML 주석으로 스크립트 본문을 감싸는 것으로 방지할 수 있었다. 이런 식으로 말이다.

```html
<script>
  <!-- This is an HTML comment surrounding a script body
  alert("this is a message from JavaScript"); // not visible to old browsers
  // the following line ends the HTML comment
  -->
</script>
```

이런 코딩 패턴을 사용하면 구식 브라우저는 전체 스크립트 본문을 HTML 주석으로 인식하고 페이지에 표시하지 않았다. 하지만 이런 패턴을 사용시 HTML의 주석 구분자 `<!--`이 Javascript 코드에서 문법적으로 유효하지 않았기 때문에 Javascript를 지원하는 브라우저가 스크립트 본문을 제대로 파싱하고 실행하지 못했다.

이 문제를 피하기 위해 Javascript 1.0에서는 `<!--`가 한 줄 주석의 시작으로 인식되도록 했다. 당시에는 `-->`는 주석이 아니기는 했다. 이 패턴을 사용할 때 `-->`의 앞에 `//`를 두는 것으로 충분했기 때문이다.

아무튼 HTML 문서에 Javascript를 삽입할 때 이제 다음과 같이 하면 하위 호환성을 지킬 수 있었다. 

```html
<script>
  <!-- This is an HTML comment in old browsers and a JS single line comment
  alert("this is a message from JavaScript"); // not visible to old browsers
  // the following line ends the HTML comment and is a JS single line comment
  // -->
</script>
```

이런 방법이 오래도록 많은 웹 개발자들에게 사용된 결과 표준화된 것이 위의 문법이다.

# 5. 결론

이렇게 Javascript에 존재하는 여러 주석 형식들을 알아보았다. 이 중에서도 Hashbang Comments와 HTML-like Comments는 특별한 목적을 위해 도입된 것이다. 따라서 결국은 `//`을 한 줄 주석으로, `/* */`를 여러 줄 주석으로 사용하는 게 가장 좋다. 코드 작성시에 굳이 다른 주석 형식을 사용할 필요는 없다.

하지만 이런 주석 형식들이 왜 도입되었는지, 어떤 목적을 위해 도입되었는지 알아보는 것은 많은 토막지식들을 전해 주었다. 브라우저가 아닌 환경에서 Javascript 실행시 사용할 인터프리터를 정하는 Hashbang Comments, Javascript의 초기에 브라우저 호환성을 위해 사용되던 HTML-like Comments 등은 Javascript가 걸어온 길들의 단면을 보여 준다.

# 참고

더글라스 크락포드 저, 김명신 옮김, 더글라스 크락포드의 자바스크립트 핵심 가이드, 한빛미디어, 2008

ECMA-262의 12.4 Comments https://tc39.es/ecma262/#sec-comments

ECMA-262의 B.1 Additional Syntax https://tc39.es/ecma262/#sec-additional-syntax

Hashbang Comments - The Third Way of Adding Comments in Javascript Code https://usefulangle.com/post/273/javascript-hashbang-comments

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#hashbang_comments

Javascript HTML-like Comments https://pakss328.medium.com/javascript-commnet-%EC%A2%85%EB%A5%98-b047be8a8696

해시뱅(#!)에 대해서... https://blog.outsider.ne.kr/698

JavaScript: the first 20 years https://dl.acm.org/doi/10.1145/3386327

[^1]: 이 문단은 Javascript의 20년간의 역사를 다룬 [Javascript: the first 20 years](https://dl.acm.org/doi/10.1145/3386327)를 참고해서 쓰였다.
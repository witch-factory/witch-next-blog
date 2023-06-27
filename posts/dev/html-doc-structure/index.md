---
title: HTML 페이지의 구조
date: "2023-06-27T01:00:00Z"
description: "HTML 페이지는 어떻게 구성되는가?"
tags: ["web", "study", "front", "HTML"]
---

# 1. HTML 공부의 시작

HTML 요소들 중 대부분이 그 자체로 의미를 가진다. 예를 들어서 `<p>`태그는 paragraph의 약자로 단락을 나타내고, `<table>`태그는 말 그대로 표를 나타낸다. 이러한 요소들은 브라우저에게 콘텐츠의 의미와 구조를 알려준다.

하지만 내가 만들어온 페이지들을 포함한(이 블로그를 만들 때는 그래도 그러지 않으려 노력하기는 했다) 많은 페이지들이 `<div>`태그만 엄청나게 써가며 CSS로 시각적인 구분만을 만들어왔다. 

이는 HTML의 의미를 완전히 무시한 것이며 스크린 리더 등으로 페이지를 볼 때 그리고 SEO 등에서 문제가 생길 수 있다. 

HTML 마스터가 될 필요는 없다. 하지만 div와 5가지 정도 되는 기본 태그만으로 모든 걸 해결하는 건 탈피해야겠다고 생각해서 HTML에 대한 MDN 문서를 보며 몇 가지 정리해 본다.

그리고 프론트의 경우 테스트를 할 때 사용자의 경험과 같은 방식으로 테스트하는 것이 권장되는데 이것에서도 HTML의 의미를 생각해 가며 사용하는 것이 중요하다.

HTML 태그들에는 공식 role이 정해져 있는데 이걸 생각해 가면서 짜야 하는 것이다. `getByRole`등의 함수를 참고하면 쉽게 알 수 있다.

# 2. HTML 문서 구조

가장 먼저 간단한 HTML 문서를 작성해 본다. 여기서 다루는 태그들은 아주 기본적인 태그다.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>HTML 문서</title>
  </head>
  <body>
    <h1>HTML 문서</h1>
    <p>HTML 문서입니다.</p>
  </body>
</html>
```

이 구성 요소들을 하나씩 살펴본다.

## 2.1. DOCTYPE 선언

이 선언은 웹 페이지를 호환 모드나 표준 모드 중 무엇으로 렌더링할지 결정할 때 사용된다. DOCTYPE 선언이 있으면 웹 페이지가 완전 표준 모드로 렌더링된다.

그리고 만약 우리의 페이지가 Content-Type HTTP 헤더를 `application/xhtml+xml` MIME 타입으로 설정함으로써 XHTML로 제공된다면 DOCTYPE 선언은 필수가 아니다. 이 경우 브라우저는 항상 페이지를 표준 모드로 렌더링한다.

W3C에서 웹 표준을 제정할 당시 대부분의 웹사이트들은 새로운 표준을 지키지 않고 있었다. 때문에 브라우저들은 새로운 표준을 지키지 않는 웹사이트들을 렌더링할 때 기존의 방식대로 렌더링하도록 했다. 이를 호환 모드(Quirks Mode)라고 한다.

요즘은 거의 표준 모드만 쓰이고 있지만 원래 웹브라우저에선 호환 모드, 거의 표준 모드, 표준 모드의 3가지 방식의 레이아웃 엔진을 지원한다. 

호환 모드에서는 웹 표준을 지키지 않는 웹사이트들을 렌더링할 때 기존의 방식대로 렌더링하도록 했다. 또한 완전 표준 모드에서는 HTML, CSS에 의해서만 웹 페이지가 표시된다. 거의 표준 모드에선 몇 가지 호환 모드 요소만 지원한다.

## 2.2. HTML 요소

`<html>` 태그. 이 요소는 페이지 전체를 감싸는 루트 요소이다. 즉 HTML 태그 트리의 최상단에 위치해야 한다. 이 요소는 두 개의 자식 요소를 가지는데 head와 그 뒤를 따르는 body 요소이다.

## 2.3. head

이는 페이지를 조회하는 사용자에게 보여주는 콘텐츠가 아니라 문서에 관한 메타데이터를 담는다. 문서가 사용할 제목, 스크립트, CSS 등을 담을 수 있다. 이후에 더 자세히 살펴볼 것이다.

## 2.4. meta

`meta`태그는 script, title 등 다른 메타 관련 요소로 나타낼 수 없는 문서의 메타데이터를 나타낸다. 가령 문서의 제작자, 설명, 키워드 등을 나타낼 수 있다.

`<meta charset="utf-8">`은 문서가 사용해야 할 문자 집합을 utf-8 유니코드로 설정한다. 또한 

head 태그 내에 위치해야 하며 name, http-equiv, charset, itemprop 특성을 가질 수 있다.

그리고 name을 메타데이터 이름으로, content를 값으로 하여 문서 메타데이터를 이름-값 쌍 형태로 제공할 수 있다. 다음과 같이 사용하는 것이다.

```html
<meta name="author" content="김성현">
<meta name="description" content="HTML 문서입니다.">
```

여기서 제공되는 표준 메타데이터 이름은 [이곳](https://developer.mozilla.org/ko/docs/Web/HTML/Element/meta/name)에서 볼 수 있다. viewport등 다양한 메타데이터를 제공할 수 있다.

그리고 creator, robots등 다양한 비표준 메타데이터도 존재하는데 이 역시 meta 태그를 이용해 지정한다.

## 2.5. title

title 요소는 브라우저의 제목 표시줄, 페이지 탭 등에 보이는 문서 제목을 정의한다. 텍스트만 포함할 수 있고 태그는 포함할 수 없으며 포함해도 무시된다. head 요소에 딱 하나만 포함될 수 있다.

이는 SEO에 큰 영향을 주므로 제목을 잘 설정하는 게 좋다.

## 2.6. body

사용자들에게 보여주길 원하는 모든 컨텐츠를 포함한다. 문서의 내용을 나타내는 것이다. 그리고 html 요소의 2번째 요소여야 한다.

# 3. HTML 태그

HTML은 콘텐츠 구조를 정의하여 우리가 보는 웹페이지가 어떻게 구조화되어 있는지 브라우저가 알 수 있게 해준다. 각 HTML은 열고 닫는 태그, 그리고 그 사이의 내용으로 구성된 요소(elements)로 이루어져 있다. 이들은 웹페이지의 컨텐츠를 감싸서 특정 기능을 수행한다. 요소 중첩도 가능하다.

요소는 속성도 가질 수 있다. 실제 콘텐츠로 표시되기를 원하지 않는 추가적인 정보를 담고 있다. img 태그의 source를 표시하거나 클래스 속성을 이용해 스타일을 설정하는 등의 일을 할 수 있다.

```html
class속성을 사용한 p태그
<p class="myclass">Hello World!</p>
```

head, title 등 여러 가지 요소들이 있는데 [이는 다음과 같이 구분된다.](https://developer.mozilla.org/ko/docs/Web/HTML/Element)이들을 여러 가지로 구분하여 하나씩 알아보자.

## 3.1. 메인 루트

문서의 최상단 요소로서, 문서의 전체 내용을 감싼다. `<html>`태그가 있다. 모든 다른 요소는 `<html>` 요소의 후손이어야 한다.

lang 특성을 지정할 수 있는데 이를 유효한 특성으로 지정할 시 스크린 리더가 음성 표현에 사용할 언어를 선택할 때 도움이 된다. 그리고 이렇게 유효한 lang 선언을 해야 title과 같이 중요한 메타데이터를 정확한 발음으로 표현할 수 있다.

```html
<html lang="ko">
```

## 3.2. 문서 메타데이터

페이지 자체에 대한 정보를 가진다. 문서의 제목, 스타일 시트를 포함한다. 그리고 검색 엔진, 브라우저 등이 페이지를 탐색하고 렌더링하는 데에 도움을 주는 정보들을 가진다. 이 정보들은 페이지 안에서 정의될 수도 있고 해당 정보를 가진 다른 파일 링크를 제공함으로써 제공될 수도 있다. 

`<base>`, `<head>`, `<link>`, `<meta>`, `<style>`, `<title>` 태그를 포함한다. `<head>`태그에 감싸여 사용되며 head 태그 스스로도 메타데이터 태그다.

### 3.2.1. base

`base`요소는 문서의 모든 상대 URL이 사용할 기준 절대 URL을 지정한다. 따라서 문서엔 하나의 `base`요소만 존재 가능하다.

```html
<base href="https://developer.mozilla.org/" target="_blank">
```

href는 base URL을 설정하고 target은 링크 등이 동작시 새로운 탭에서 열리도록 설정한다. 이를 설정할 시 해당 문서의 링크를 클릭하면 `언제나` 새 탭에서 열리게 된다.

## 3.3. 섹션 루트

문서의 내용 섹션을 나타낸다. `<body>`태그가 있는데 이 태그는 문서에 하나만 존재 가능하다.

## 3.4. 콘텐츠 구획

문서의 콘텐츠를 논리적으로 분류하는 기능을 한다. 예를 들어 페이지의 헤더, 푸터, 본문, 사이드바 등을 나타낸다.

`<address>`, `<article>`, `<aside>`, `<footer>`, `<header>`, `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`, `<main>`, `<nav>`, `<section>` 태그를 포함한다.

제목 태그들을 묶을 때 사용하는 `<hgroup>`태그도 있었으나 W3C HTML 명세에서는 제거되었다.

## 3.5. 텍스트 콘텐츠

텍스트 콘텐츠 태그를 통해서 `<body>`내부의 콘텐츠 구획을 정리하며 콘텐츠 구획의 목적이나 구조 판별에 사용한다. 접근성과 SEO에 중요하다.

`<blockquote>`, `<dl>`, `<dt>`, `<dd>`, `<div>`, `<figcaption>`, `<figure>`, `<hr>`, `<li>`, `<menu>`, `<ol>`, `<p>`, `<pre>`, `<ul>` 태그를 포함한다.

## 3.6. 인라인 텍스트 시맨틱

인라인 텍스트의 구조나 스타일을 정의한다. 종류가 엄청나게 많은데, `<a>`, `<br>`, `<cite>`, `<code>`, `<q>`, `<small>`, `<span>`, `<strong>`, `<time>`, `<sup>` 등이 있다.

모든 인라인 텍스트 시맨틱 태그가 의미를 가지고 있는 건 아니다. `<b>`처럼 특별한 중요도 부여는 없고 CSS가 지원되지 않는 브라우저에서의 기본적인 텍스트 스타일링을 위해서 사용되는 태그들도 있다.

## 3.7. 이미지 & 멀티미디어

HTML은 멀티미디어 리소스를 이용할 수 있는 태그를 제공한다.

`<area>`, `<audio>`, `<img>`, `<map>`, `<track>`, `<video>` 태그를 포함한다.

## 3.8. 내장 콘텐츠

멀티미디어 콘텐츠 외에도 다양한 기타 콘텐츠를 포함할 수 있게 해준다.

`<embed>`, `<iframe>`, `<object>`, `<portal>`, `<picture>`, `<source>` 태그를 포함한다.

svg와 mathML을 HTML 문서에 직접 삽입할 수 있게 해주는 `<svg>`, `<math>` 태그도 있다.

## 3.9. 스크립트

HTML 문서에 스크립트(특히 JS)를 포함할 수 있게 해준다.

`<canvas>`, `<noscript>`, `<script>` 태그를 포함한다.

## 3.10. 표 컨텐츠

표 형식 데이터를 생성하고 처리할 때 사용한다.

`<caption>`, `<col>`, `<colgroup>`, `<table>`, `<tbody>`, `<td>`, `<tfoot>`, `<th>`, `<thead>`, `<tr>` 태그를 포함한다.

## 3.11. 양식

여러 입력 가능한 요소를 제공한다.

`<button>`, `<datalist>`, `<fieldset>`, `<form>`, `<input>`, `<label>`, `<legend>`, `<meter>`, `<optgroup>`, `<option>`, `<output>`, `<progress>`, `<select>`, `<textarea>` 태그를 포함한다.

## 3.12. 기타

텍스트의 특정 부분이 수정되었다는 것을 표시해 주는 `<del>`, `<ins>` 태그가 있다.

상호작용 가능한 UI 객체를 만드는 데에 사용하는 `<details>`, `<dialog>`, `<summary>` 태그가 있다.

웹 컴포넌트 요소를 만드는 데에 사용하는 `<slot>`, `<template>` 태그가 있다. 앞으로 여러 글들을 통해 살펴볼 것이다.

참고로, HTML 요소는 태그(<태그이름>)를 사용해서 문서의 다른 텍스트와 구분되며 태그 안의 요소 이름은 대소문자 구분을 하지 않는다. `<div>`로 작성하나 `<Div>`로 작성하나 상관없다는 것이다.

# 3. 주요 HTML 요소

## 3.1. 제목 요소

h1~h6 태그는 제목을 나타낸다. h1은 가장 중요한 제목, h6은 가장 덜 중요한 제목이다. heading role을 가지고 있다.

이는 제목의 의미를 가지므로 글씨를 굵게 하기 위해 사용되어서는 안 된다.

## 3.2. 단락 요소

p 요소는 문단을 표현하기 위해 사용된다.

## 3.3. 목록 요소

ul 요소는 unordered list로 순서 없는 목록을 나타내고 ol 요소는 ordered list로 순서 있는 목록을 나타낸다. 

두 태그 안에는 li 요소가 존재하는데 이는 list item으로 목록의 항목을 나타낸다.

```html
<ul>
  <li>사과</li>
  <li>배</li>
  <li>딸기</li>
</ul>
```

## 3.4. 링크 요소

a 요소는 anchor로 링크를 나타낸다. href(hypertext reference의 약자) 특성을 통해 링크의 목적지를 지정할 수 있다.

```html
<a href="https://www.google.com">구글</a>
```

# 참고

MDN HTML 입문서 - HTML 시작하기 https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/Getting_started

모질라 재단 HTML 사이트 https://developer.mozilla.org/ko/docs/Web/HTML

HTML 소개 https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML

HTML 요소 참고서 https://developer.mozilla.org/ko/docs/Web/HTML/Element

https://developer.mozilla.org/ko/docs/Glossary/Doctype

https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode
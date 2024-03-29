---
title: 블로그 내의 HTML 정보사전
date: "2023-08-15T00:00:00Z"
description: "블로그 내 HTML 사전"
tags: ["HTML"]
---

# 들어가면서

HTML 마스터가 될 필요는 없다. 하지만 div와 5가지 정도 되는 기본 태그만으로 모든 걸 해결하는 건 탈피해야겠다고 생각해서 HTML에 대한 정리와 분류를 시작한다. 온전히 HTML에 관한 내용만은 아니지만..

그리고 프론트의 경우 테스트를 할 때 사용자의 경험과 같은 방식으로 테스트하는 것이 권장되는데 이것에서도 HTML의 의미를 생각해 가며 사용하는 것이 중요하다.

HTML 태그들에는 공식 role이 정해져 있는데 이를 지키면서 페이지를 작성하고 테스트하라는 것이다. `getByRole`등의 함수를 참고하면 쉽게 알 수 있다.

아무튼 그래서 이렇게 HTML에 관해 작성한 글들을 정리하기 시작한다.

# 1. HTML이란

HTML은 웹 페이지와 그 컨텐츠를 구조화하고 해당 구조를 브라우저로 하여금 알 수 있게 하는 데 쓰이는 마크업 언어이다. 컨텐츠의 서로 다른 부분들을 다른 형식으로 보이게 하거나 하이퍼링크와 같이 특정 방식으로 동작하게 하기도 한다.

각 HTML 요소는 여는 태그와 닫는 태그, 내용, 속성으로 구성된다. 태그와 요소는 다른데, 태그는 소스코드에서 요소의 시작과 끝을 표시하는 데에 쓰이는 것이고 요소는 DOM의 일부이다.

## 1.1. HTML 요소들의 의미

HTML 요소들 중 대부분이 그 자체로 페이지 구조 내에서 의미를 가진다. 예를 들어서 `<p>`태그는 paragraph의 약자로 단락을 나타내고, `<table>`태그는 말 그대로 표를 나타낸다. 이러한 요소들은 브라우저에게 콘텐츠의 의미와 구조를 알려준다.

하지만 내가 만들어온 페이지들을 포함한 많은 페이지들이 `<div>`태그만 엄청나게 써가며 CSS로 시각적인 구분만을 만든다.

이는 HTML의 의미를 완전히 무시한 것이며 스크린 리더 등으로 페이지를 볼 때 그리고 SEO 등에서 문제가 생길 수 있다.

물론 CSS나 폰트 크기를 통해서 사이트의 각 파트를 구분하고 표시할 수도 있다. 하지만 아예 스크린 리더를 사용하거나 혹은 색을 통해서 구분할 수 없는 정도의 사용자도 많다.

약 8%의 남자와 0.5%의 여자가 색맹(colorblind)이다. 세계의 약 4~5%가 색맹인 것이다. 이는 우리가 그렇게 지원하려고 노력하는 레거시 브라우저 사용자들보다도 많은 수치이지만 많은 경우 색맹 이용자들은 레거시 브라우저 사용자들에 비해 간과된다.

이럴 때 각각의 의미를 생각해가며 HTML 태그들을 사용하는 것은 사이트 구조를 명백하게 드러내는 데 도움이 된다. 이는 스크린 리더 사용자들이 페이지를 명확히 구분하여 이용하도록 해준다.

# 2. HTML 요소의 구분

구체적으로 요소들을 알아보기 전에, HTML의 모든 요소는 블록 요소와 인라인 요소로 나뉜다는 것을 알고 가자.

## 2.1. 블록 레벨 요소

웹페이지 상에 블록을 만들고 공간을 차지하는 요소이다. 앞뒤 요소 사이에 새로운 줄을 만들며, 페이지의 구조적 요소를 나타낸다. 예를 들어서 p 태그, div 태그 등이 있다. 일반적으로 공간을 차지해야 한다고 생각되는 요소들이다.

블록 요소는 블록 요소 내부에 중첩될 수 있지만 인라인 요소 내부에는 중첩될 수 없다. 예를 들어서 a태그 내에 div 태그가 중첩될 수 없다.

## 2.2. 인라인 요소

항상 블록 레벨 요소 내에 포함되어 있다. 한 단락과 같이 큰 범위에는 적용될 수 없다. 대신 문장이나 단어와 같은 작은 부분에 적용되며 새로운 줄을 만들지 않고 단락 내에 나타난다. a태그, strong 태그 등이 있다.

이렇게 구분되는 HTML 요소들은 head, title 등 여러 가지 요소들이 있는데 [전체는 HTML 참고서에서 확인할 수 있다.](https://developer.mozilla.org/ko/docs/Web/HTML/Element) 이 글에서는 자주 쓰이는 태그들을 중심으로 다룰 것이다.

## 2.3. 주의

여기의 블록 요소, 인라인 요소는 CSS의 `display`속성과는 다르다. 상관관계가 없지는 않지만 CSS의 display 속성을 변경하더라도 HTML 요소의 기본 분류는 변경되지 않는다.

가령 `<h1>`요소를 `display:inline;`으로 설정하더라도 HTML에선 여전히 블록 요소로 취급되며 요소가 포함할 수 있는 요소, 포함될 수 있는 요소 등의 표준은 똑같이 블록 레벨 요소로 적용된다.

[HTML5에서는 이런 혼동을 막기 위해 블록, 인라인 용어를 삭제하고 새롭고 더 엄밀한 구분을 도입하였다.](https://html.spec.whatwg.org/multipage/indices.html#element-content-categories)

# 3. 주석

`<!-- 주석 -->` 형태로 작성한다. 주석은 브라우저에 표시되지 않는다. 주석은 코드를 설명하거나 코드를 임시로 비활성화할 때 사용한다.

# 4. 문서 메타데이터 태그

[HTML의 문서 메타데이터 태그](https://witch.work/posts/html-metadata-tag) 글에서 다루었다.

# 5. 콘텐츠 구획 태그

[HTML의 콘텐츠 구획 태그](https://witch.work/posts/html-section-tag) 글에서 다루었다.

# 6. 텍스트 콘텐츠 태그

[HTML 텍스트 태그](https://witch.work/posts/html-text-tag) 글에서 다루었다.

[HTML의 링크 태그를 따로 다룬 글도 썼다.](https://witch.work/posts/html-link-tag)

# 7. 멀티미디어 임베딩

[HTML 멀티미디어 임베딩](https://witch.work/posts/html-multimedia-tag) 글에서 다루었다.

[HTML에서 반응형 이미지 삽입하기](https://witch.work/posts/html-responsive-image)

[간단한 페이지에 미디어를 삽입하는 예제](https://witch.work/posts/mdn-simple-page-test)

[오디오, 비디오 전송](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery)도 참고할 만 하다.

# 8. 표 컨텐츠

표 형식 데이터를 생성하고 처리할 때 사용한다.

`<caption>`, `<col>`, `<colgroup>`, `<table>`, `<tbody>`, `<td>`, `<tfoot>`, `<th>`, `<thead>`, `<tr>` 태그를 포함한다.

[HTML로 표 만들기](https://witch.work/posts/html-table-tags)글에서 다루었다.

# 9. 양식

여러 입력 가능한 요소를 제공한다.

`<button>`, `<datalist>`, `<fieldset>`, `<form>`, `<input>`, `<label>`, `<legend>`, `<meter>`, `<optgroup>`, `<option>`, `<output>`, `<progress>`, `<select>`, `<textarea>` 태그를 포함한다.

[기본적인 HTML 폼 요소 정보](https://witch.work/posts/html-form-tag)
[input태그 같은 경우 따로 글을 작성하였다.](https://witch.work/posts/html-input-tag)

[HTML 폼 유효성 검사](https://witch.work/posts/html-form-validation)
[HTML 폼 요소 스타일링](https://witch.work/posts/html-form-styling)

# 10. 스크립트

HTML 문서에 스크립트(특히 JS)를 포함할 수 있게 해준다.

`<canvas>`, `<noscript>`, `<script>` 태그를 포함한다.

# 여담

## 엔티티

살펴보았다시피 HTML 태그에는 속성값을 쓸 수 있다. 예를 들어 다음과 같은 것이다.

```html
<a href="https://www.naver.com/" title="naver">naver</a>
```

이때 속성값은 모두 따옴표로 감싸 주는 게 권장된다. 그런데 이 따옴표로 표시된 속성값 안에 따옴표를 쓰고 싶으면 어떻게 할까?

HTML에서 미리 예약된 이런 따옴표같은 문자들이 있는데 이런 문자들을 기존 의미 그대로 표시하기 위해서 별도로 사용하는 문제 셋이 있다. 이를 엔티티라고 부른다.

사용 예시를 들자면, HTML 요소의 내용에서 공백을 아무리 많이 사용해도 HTML 파서가 모두 단일 공백으로 바꿔버린다. 이럴 때 공백을 연속해 사용하려면 `&nbsp;` 엔티티를 사용하면 된다.

엔티티들 중 대표적인 건 다음과 같다.

- `&lt;` : <
- `&gt;` : >
- `&amp;` : &
- `&quot;` : "
- `&apos;` : '
- `&nbsp;` : 공백
- `&copy;` : 저작권 표시

이런 방식으로 표현할 수 있는 문자들은 더 많다. [발음 구별 부호, 심볼 특수문자 등이 있다.](http://www.tcpschool.com/html/html_text_entities)

```html
<p>In HTML, you define a paragraph using the &lt;p&gt; element.</p>
```

## 기타 태그들

텍스트의 특정 부분이 수정되었다는 것을 표시해 주는 `<del>`, `<ins>` 태그가 있다.

상호작용 가능한 UI 객체를 만드는 데에 사용하는 `<details>`, `<dialog>`, `<summary>` 태그가 있다.

웹 컴포넌트 요소를 만드는 데에 사용하는 `<slot>`, `<template>` 태그가 있다. 앞으로 여러 글들을 통해 살펴볼 것이다.

참고로, HTML 요소는 태그(<태그이름>)를 사용해서 문서의 다른 텍스트와 구분되며 태그 안의 요소 이름은 대소문자 구분을 하지 않는다. `<div>`로 작성하나 `<Div>`로 작성하나 상관없다는 것이다.

## 유효성 검사

[HTML 유효성 검사 사이트](https://validator.w3.org/#validate_by_upload)를 통해 HTML 문서를 검사하고 디버깅할 수 있다. 웹페이지 주소를 올리거나 파일을 올리거나 HTML 코드를 직접 올리는 등의 방법을 사용할 수 있다.

HTML 표준에 맞는지 다 검사해 준다.

## DOM 인터페이스가 없는 요소

[어떤 HTML 요소들은 따로 DOM 인터페이스가 존재하지 않는다. 이에 대해 탐구해 보았다.](https://witch.work/posts/html-dom-missing-element)

# 참고

HTML 기본 https://developer.mozilla.org/ko/docs/Learn/Getting_started_with_the_web/HTML_basics

MDN HTML 입문서 - HTML 시작하기 https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/Getting_started

모질라 재단 HTML 사이트 https://developer.mozilla.org/ko/docs/Web/HTML

HTML 소개 https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML

HTML 요소 참고서 https://developer.mozilla.org/ko/docs/Web/HTML/Element

https://developer.mozilla.org/ko/docs/Glossary/Doctype

https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode

https://happycording.tistory.com/entry/HTML-Role-%EC%99%9C-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%95%BC%EB%A7%8C-%ED%95%98%EB%8A%94%EA%B0%80

https://discourse.mozilla.org/t/marking-up-a-letter-assessment/24676

https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track

https://medium.com/harrythegreat/%ED%94%8C%EB%9E%98%EC%8B%9C%EC%9D%98-%EB%AA%B0%EB%9D%BD%EC%9C%BC%EB%A1%9C-%EB%B3%B4%EB%8A%94-%EC%9B%B9%EC%9D%98-%EC%97%AD%EC%82%AC-ce6e387b60f

https://kkamagistory.tistory.com/808

embed와 object https://stackoverflow.com/questions/1244788/embed-vs-object

SVG에 관한 더 많은 정보 https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Getting_Started

https://frontdev.tistory.com/entry/strong-%ED%83%9C%EA%B7%B8%EC%99%80-em-%ED%83%9C%EA%B7%B8%EC%9D%98-%EC%B0%A8%EC%9D%B4
---
title: HTML 복습 - 문서 메타데이터
date: "2023-08-13T00:00:00Z"
description: "HTML의 문서 메타데이터"
tags: ["HTML"]
---

# 1. 간단한 문서 예시

가장 먼저 간단한 HTML 문서를 작성해 본다. 여기서 다루는 태그들은 아주 기본적인 태그들인데, 여기서 `<body>`내부의 태그들은 제외하고 먼저 문서의 메타데이터를 다루는 태그들을 알아보자.

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

이 문서의 요소들을 하나씩 살펴보자.

# 2. DOCTYPE 선언

이 선언은 웹 페이지를 호환 모드나 표준 모드 중 무엇으로 렌더링할지 결정할 때 사용된다. DOCTYPE 선언이 있으면 웹 페이지가 표준 모드로 렌더링된다. 이는 좋은 HTML로 인정받기 위해서 HTML 페이지가 따라야 할 규칙과의 연결 통로로 쓰였다.

그리고 만약 우리의 페이지가 Content-Type HTTP 헤더를 `application/xhtml+xml` MIME 타입으로 설정함으로써 XHTML로 제공된다면 브라우저는 항상 페이지를 표준 모드로 렌더링하기 때문에 DOCTYPE 선언이 필요 없다.

W3C에서 웹 표준을 제정할 당시 대부분의 웹사이트들은 새로운 표준을 지키지 않고 있었다. 때문에 브라우저들은 새로운 표준을 지키지 않는 웹사이트들을 렌더링할 때 기존의 방식대로 렌더링하도록 했다. 이를 호환 모드(Quirks Mode)라고 한다.

요즘은 거의 표준 모드만 쓰이고 있지만 원래 웹브라우저에선 호환 모드, 거의 표준 모드, 표준 모드의 3가지 방식의 레이아웃 엔진을 지원한다. 

호환 모드에서는 웹 표준을 지키지 않는 웹사이트들을 렌더링할 때 기존의 방식대로 렌더링하도록 했다. 또한 완전 표준 모드에서는 HTML, CSS에 의해서만 웹 페이지가 표시된다. 거의 표준 모드에선 몇 가지 호환 모드 요소만 지원한다.

# 3. 메인 루트

문서의 최상단 요소로서, 문서의 전체 내용을 감싼다. 메인 루트는 늘 `<html>`태그이며 모든 다른 요소는 `<html>` 요소의 후손이어야 한다. 즉 메인 루트 요소는 HTML 태그 트리의 최상단에 위치해야 한다. 이 요소는 두 개의 자식 요소를 가지는데 head와 그 뒤를 따르는 body 요소이다.

lang 특성을 지정할 수 있는데 이를 유효한 특성으로 지정할 시 스크린 리더가 음성 표현에 사용할 언어를 선택할 때 도움이 된다. 그리고 이렇게 유효한 lang 선언을 해야 title과 같이 중요한 메타데이터를 정확한 발음으로 표현할 수 있다.

```html
<html lang="ko">
```

# 4. base

`base`요소는 문서의 모든 상대 URL이 사용할 기준 절대 URL을 지정한다. 따라서 문서엔 하나의 `base`요소만 존재 가능하다. 반드시 `<head>`태그 내에서 사용되어야 한다는 점에 유의한다.

```html
<base href="https://developer.mozilla.org/" target="_blank">
```

href는 상대 URL이 사용할 base URL을 설정하고 target은 해당 속성을 명시하지 않은 a, area, form 요소가 탐색을 할 때 그 결과를 보여줄 맥락을 지정한다. 예를 들어 `_blank`로 지정하면 결과를 새로운 브라우징 맥락에 보여준다.

`base` 태그 여러 개를 지정할 시 첫 번째 것만 사용되며 `og`태그에는 영향을 주지 않는다.

# 5. head

`html`태그의 첫번째 자식 태그로 배치되며 사용자에게 보여지는 데이터가 아니라 브라우저가 식별할 수 있는 문서 메타데이터를 담는다. 제목, 스크립트, 사용할 스타일시트 파일 등을 담을 수 있다. 

```html
<head>
  <title>HTML 문서</title>
</head>
```

# 6. link

현재 문서와 외부 리소스의 관계를 명시한다. CSS 스타일 시트 연결, [파비콘 설정](https://witch.work/posts/favicon) 등에 사용된다.

```html
<link rel="stylesheet" href="style.css">
<link rel="icon" href="favicon.ico">
<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
```

`media` 프로퍼티를 사용해서 미디어 쿼리에 따라 리소스를 불러오도록 할 수 있다.

```html
<link rel="stylesheet" href="print.css" media="print">
```

# 7. meta

`meta`태그는 script, title 등 다른 메타 관련 요소로 나타낼 수 없는 문서의 메타데이터를 나타낸다. 가령 문서의 제작자, 설명, 키워드 등을 나타낼 수 있다.

`<meta charset="utf-8">`은 문서가 사용해야 할 문자 집합을 utf-8 유니코드로 설정한다. 다른 문자 집합을 사용하도록 할 수도 있다. utf-8이 일반적이긴 하지만 말이다.

head 태그 내에 위치해야 하며 name, http-equiv, charset, itemprop 특성을 가질 수 있다.

그리고 name을 메타데이터 이름으로, content를 값으로 하여 문서 메타데이터를 이름-값 쌍 형태로 제공할 수 있다. 다음과 같이 사용하는 것이다.

```html
<meta name="author" content="김성현">
<meta name="description" content="HTML 문서입니다.">
```

여기서 제공되는 표준 메타데이터 이름은 [이곳](https://developer.mozilla.org/ko/docs/Web/HTML/Element/meta/name)에서 볼 수 있다. viewport등 다양한 메타데이터를 제공할 수 있다.

그리고 creator, robots등 다양한 비표준 메타데이터도 존재하는데 이 역시 meta 태그를 이용해 지정한다.

한때는 `<meta name="keywords" content="...">` 처럼 검색 엔진에 키워드를 제공하는 기능 등도 있었지만 이는 스팸에서 키워드 목록에 수백 개의 키워드를 채워버리는 등의 악용 사례가 있었기 때문에 이제는 많은 검색 엔진에서 이를 무시한다.

단 `og:image`처럼 여전히 많이 사용하는 메타데이터도 존재한다. `og:`나 `twitter:`와 같은 메타데이터들은 여러 기업에서 더 풍부한 메타데이터 제공을 위해 발명한 메타데이터 프로토콜이다.

# 8. style

이 태그는 문서나 문서 일부에 대한 스타일 정보를 포함한다. 일반적으로는 외부 스타일시트에 작성하고 `link`로 연결하는 편이 좋지만 `style` 태그를 이용한 문서 스타일링도 가능하다.

`type="text/css"`와 미디어 쿼리를 의미하는 `media`속성 등을 가질 수 있다.

# 9. title

title 태그는 브라우저의 제목 표시줄이나 페이지 탭에 보이는 문서의 제목을 나타낸다. title 태그는 head 태그 내에 있어야 한다. 그리고 head 요소에 딱 하나만 포함될 수 있다.

이 태그 내용은 검색 결과에도 표시되고 사이트를 북마크할 때 추천되는 북마크 이름으로도 사용된다. SEO를 잘 수행하려면 문서를 잘 설명하는 제목을 짓는 것이 중요하다.

제목의 의미를 가지는 h1 태그와는 다르며 다른 태그를 포함할 수 없다. 텍스트만 포함 가능하며 포함된 다른 태그는 무시된다.

# 10. body

사용자들에게 보여주길 원하는 모든 컨텐츠를 포함한다. 문서의 내용을 나타내는 것이다. 그리고 html 요소의 2번째 자식 요소여야 한다.

# 11. 주석

`<!-- 주석 -->` 형태로 작성한다. 주석은 브라우저에 표시되지 않는다. 주석은 코드를 설명하거나 코드를 임시로 비활성화할 때 사용한다.

# 12. 여담

## 12.1. 엔티티

살펴보았다시피 HTML 태그에는 속성값을 쓸 수 있다. 예를 들어 다음과 같은 것이다.

```html
<a href="https://www.naver.com/" title="naver">naver</a>
```

이때 속성값은 모두 따옴표로 감싸 주는 게 권장된다. 그런데 이 따옴표로 표시된 속성값 안에 따옴표를 쓰고 싶으면 어떻게 할까?

HTML에서 미리 예약된 이런 따옴표같은 문자들이 있는데 이런 문자들을 기존 의미 그대로 표시하기 위해서 별도로 사용하는 문제 셋이 있다. 이를 엔티티라고 부른다.

사용 예시를 들자면, HTML 요소의 내용에서 공백을 아무리 많이 사용해도 HTML 파서가 모두 단일 공백으로 바꿔버린다. 이럴 때 공백을 연속해 사용하려면 `&nbsp;` 엔티티를 사용하면 된다.

엔티티들 중 대표적인 건 다음과 같다.

- &lt; : <
- &gt; : >
- &amp; : &
- &quot; : "
- &apos; : '
- &nbsp; : 공백
- &copy; : 저작권 표시

이런 방식으로 표현할 수 있는 문자들은 더 많다. [발음 구별 부호, 심볼 특수문자 등이 있다.](http://www.tcpschool.com/html/html_text_entities)

```html
<p>In HTML, you define a paragraph using the &lt;p&gt; element.</p>
```

# 참고

HTML 기본 https://developer.mozilla.org/ko/docs/Learn/Getting_started_with_the_web/HTML_basics
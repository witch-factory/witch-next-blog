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

## 2.2. 메인 루트

`<html>` 태그. 이 요소는 페이지 전체를 감싸는 루트 요소이다. 즉 HTML 태그 트리의 최상단에 위치해야 한다. 이 요소는 두 개의 자식 요소를 가지는데 head와 그 뒤를 따르는 body 요소이다.

## 2.3. head

이는 페이지를 조회하는 사용자에게 보여주는 콘텐츠가 아니라 문서에 관한 메타데이터를 담는다. 문서가 사용할 제목, 스크립트, CSS 등을 담을 수 있다. 이후에 더 자세히 살펴볼 것이다.

## 2.4. meta

`meta`태그는 script, title 등 다른 메타 관련 요소로 나타낼 수 없는 문서의 메타데이터를 나타낸다. 가령 문서의 제작자, 설명, 키워드 등을 나타낼 수 있다. `#5`에서 더 자세히 설명한다.

## 2.5. title

title 요소는 브라우저의 제목 표시줄, 페이지 탭 등에 보이는 문서 제목을 정의한다. 텍스트만 포함할 수 있고 태그는 포함할 수 없으며 포함해도 무시된다. head 요소에 딱 하나만 포함될 수 있다.

이는 SEO에 큰 영향을 주므로 제목을 잘 설정하는 게 좋다.

## 2.6. body

사용자들에게 보여주길 원하는 모든 컨텐츠를 포함한다. 문서의 내용을 나타내는 것이다. 그리고 html 요소의 2번째 요소여야 한다.

## 2.7. 주석

주석은 다음과 같이 쓴다.

```html
<!-- 주석 -->
```

# 3. HTML 태그

HTML은 콘텐츠 구조를 정의하여 우리가 보는 웹페이지가 어떻게 구조화되어 있는지 브라우저가 알 수 있게 해준다. 각 HTML은 열고 닫는 태그, 그리고 그 사이의 내용으로 구성된 요소(elements)로 이루어져 있다. 이들은 웹페이지의 컨텐츠를 감싸서 특정 기능을 수행한다. 요소 중첩도 가능하다.

요소는 속성도 가질 수 있다. 실제 콘텐츠로 표시되기를 원하지 않는 추가적인 정보를 담고 있다. img 태그의 source를 표시하거나 클래스 속성을 이용해 스타일을 설정하는 등의 일을 할 수 있다.

```html
class속성을 사용한 p태그
<p class="myclass">Hello World!</p>
```

## 3.1. 엔티티

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

또한 HTML 요소의 2가지 분류를 알아보자.

## 3.2. 블록 레벨 요소

웹페이지 상에 블록을 만들고 공간을 차지하는 요소이다. 앞뒤 요소 사이에 새로운 줄을 만들며, 페이지의 구조적 요소를 나타낸다. 예를 들어서 p 태그, div 태그 등이 있다. 일반적으로 공간을 차지해야 한다고 생각되는 요소들이다.

블록 요소는 블록 요소 내부에 중첩될 수 있지만 인라인 요소 내부에는 중첩될 수 없다. 예를 들어서 a태그 내에 div 태그가 중첩될 수 없다.

## 3.3. 인라인 요소

항상 블록 레벨 요소 내에 포함되어 있다. 문장이나 단어와 같은 작은 부분에 적용되며 새로운 줄을 만들지 않고 단락 내에 나타난다. a태그, strong 태그 등이 있다.

이렇게 구분되는 HTML 요소들은 head, title 등 여러 가지 요소들이 있는데 [이는 다음과 같이 구분된다.](https://developer.mozilla.org/ko/docs/Web/HTML/Element)이들을 여러 가지로 구분하여 하나씩 알아보자.

# 4. 메인 루트

문서의 최상단 요소로서, 문서의 전체 내용을 감싼다. `<html>`태그가 있다. 모든 다른 요소는 `<html>` 요소의 후손이어야 한다.

lang 특성을 지정할 수 있는데 이를 유효한 특성으로 지정할 시 스크린 리더가 음성 표현에 사용할 언어를 선택할 때 도움이 된다. 그리고 이렇게 유효한 lang 선언을 해야 title과 같이 중요한 메타데이터를 정확한 발음으로 표현할 수 있다.

```html
<html lang="ko">
```

# 5. 문서 메타데이터

페이지 자체에 대한 정보를 가진다. 문서의 제목, 스타일 시트를 포함한다. 그리고 검색 엔진, 브라우저 등이 페이지를 탐색하고 렌더링하는 데에 도움을 주는 정보들을 가진다. 브라우저 화면에 표시되지는 않는다.

이 정보들은 페이지 안에서 정의될 수도 있고 해당 정보를 가진 다른 파일 링크를 제공함으로써 제공될 수도 있다. 

`<base>`, `<head>`, `<link>`, `<meta>`, `<style>`, `<title>` 태그를 포함한다. `<head>`태그에 감싸여 사용되며 head 태그 스스로도 메타데이터 태그다.

## 5.1. base

`base`요소는 문서의 모든 상대 URL이 사용할 기준 절대 URL을 지정한다. 따라서 문서엔 하나의 `base`요소만 존재 가능하다. 반드시 `<head>`태그 내에서 사용되어야 한다는 점에 유의한다.

```html
<base href="https://developer.mozilla.org/" target="_blank">
```

href는 상대 URL이 사용할 base URL을 설정하고 target은 해당 속성을 명시하지 않은 a, area, form 요소가 탐색을 할 때 그 결과를 보여줄 맥락을 지정한다. 예를 들어 `_blank`로 지정하면 결과를 새로운 브라우징 맥락에 보여준다.

`base` 태그 여러 개를 지정할 시 첫 번째 것만 사용되며 `og`태그에는 영향을 주지 않는다.

## 5.2. head

`html`태그의 첫번째 자식 태그로 배치되며 브라우저가 식별할 수 있는 문서 메타데이터를 담는다. 제목, 스크립트, 사용할 스타일시트 파일 등을 담을 수 있다. 

```html
<head>
  <title>HTML 문서</title>
</head>
```

## 5.3. link

현재 문서와 외부 리소스의 관계를 명시한다. CSS 스타일 시트 연결, [파비콘 설정](https://witch.work/posts/misc/favicon) 등에 사용된다.

```html
<link rel="stylesheet" href="style.css">
<link rel="icon" href="favicon.ico">
<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
```

`media` 프로퍼티를 사용해서 미디어 쿼리에 따라 리소스를 불러오도록 할 수 있다.

```html
<link rel="stylesheet" href="print.css" media="print">
```

## 5.4. meta

`meta`태그는 script, title 등 다른 메타 관련 요소로 나타낼 수 없는 문서의 메타데이터를 나타낸다. 가령 문서의 제작자, 설명, 키워드 등을 나타낼 수 있다.

`<meta charset="utf-8">`은 문서가 사용해야 할 문자 집합을 utf-8 유니코드로 설정한다. 이는 브라우저가 문서를 렌더링할 때 사용할 문자 집합을 알려준다. 

이 태그는 head 태그 내에 위치해야 하며 name, http-equiv, charset, itemprop 특성을 가질 수 있다.

그리고 name을 메타데이터 이름으로, content를 값으로 하여 문서 메타데이터를 이름-값 쌍 형태로 제공할 수 있다. 다음과 같이 사용하는 것이다.

```html
<meta name="author" content="김성현">
<meta name="description" content="HTML 문서입니다.">
```

여기서 제공되는 표준 메타데이터 이름은 [이곳](https://developer.mozilla.org/ko/docs/Web/HTML/Element/meta/name)에서 볼 수 있다. viewport등 다양한 메타데이터를 제공할 수 있다.

그리고 creator, robots등 다양한 비표준 메타데이터도 존재하는데 이 역시 meta 태그를 이용해 지정한다.

## 5.5. style

이 태그는 문서나 문서 일부에 대한 스타일 정보를 포함한다. 일반적으로는 외부 스타일시트에 작성하고 `link`로 연결하는 편이 좋지만 `style` 태그를 이용한 문서 스타일링도 가능하다.

`type="text/css"`와 미디어 쿼리를 의미하는 `media`속성 등을 가질 수 있다.

## 5.6. title

title 태그는 브라우저의 제목 표시줄이나 페이지 탭에 보이는 문서의 제목을 나타낸다. title 태그는 head 태그 내에 있어야 한다. 이 태그 내용은 검색 결과에도 표시된다. 그리고 사이트를 북마크할 때 추천되는 북마크 이름으로도 사용된다.

제목의 의미를 가지는 h1 태그와는 다르며 다른 태그를 포함할 수 없다. 텍스트만 포함 가능하며 포함된 다른 태그는 무시된다.

SEO를 잘 수행하려면 문서를 잘 설명하는 제목을 짓는 것이 중요하다.

# 6. 섹션 루트

문서의 내용 섹션을 나타낸다. `<body>`태그가 있는데 이 태그는 문서에 하나만 존재 가능하다.

`onblur`, `onerror`, `onfocus`, `onload`, `onresize`, `onpopstate` 등의 이벤트 핸들러를 가질 수 있다. 이들은 문서에서 특정 이벤트가 생겼을 때 실행되는 함수를 지정한다. 더 많은 이벤트 핸들러는 [body 태그의 MDN 문서](https://developer.mozilla.org/ko/docs/Web/HTML/Element/body#%ED%8A%B9%EC%84%B1)에서 볼 수 있다.

# 7. 콘텐츠 구획

일반적인 문서는 다음과 같은 영역으로 구성된다.

header : 큰 제목과 로고 등이 있는 띠. 주요 정보가 정리되어 있다. 보통 다른 페이지들에서도 똑같이 나타난다.

nav : 페이지 내에서 다른 페이지로 이동할 수 있는 링크들이 있는 영역. 주로 메뉴, 링크, 탭이 들어가고 다른 페이지들에서도 일관적으로 나타난다. 보통 header 영역에 들어가지만 필수 사항은 아니다.

main : 페이지의 가장 주요 내용이 들어가는 영역. 이야기나 페이지의 중요한 비디오 등이 들어간다.

sidebar : 주변의 정보, 링크, 인용부호 등이 들어가는데 메인 컨텐츠에 따라 내용이 다르다. 기사 페이지라면 sidebar에는 작성자나 관련 기사 링크를 포함할 것이다. 보통 main 영역의 옆에 위치한다.

footer : 페이지 바닥의 줄로 페이지에 관한 작은 정보나 연락처를 적는다. 사이트맵이나 인기 컨텐츠 바로가기 링크가 있을 수도 있다.

이 각각의 페이지 요소들에 대해서 적절한 태그들을 사용해야 한다. 그리고 HTML에서는 정말로 이들에 대한 적절한 태그를 제공한다. 

header를 나타내는 header, nav bar를 나타내는 nav, 문서의 주요 컨텐츠에 쓰일 main, article, section, div 등등, sidebar는 aside, footer는 footer를 제공한다.

전체를 이야기하자면, `<address>`, `<article>`, `<aside>`, `<footer>`, `<header>`, `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`, `<main>`, `<nav>`, `<section>` 태그를 포함한다.

제목 태그들을 묶을 때 사용하는 `<hgroup>`태그도 있었으나 W3C HTML 명세에서는 제거되었다.

## 7.1. 간단한 페이지

간단한 페이지를 한번 구성해 보고, 쓰인 태그들의 의미를 하나하나 짚어보자.

```js
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="author" content="Kim Sung Hyun" />
    <title>My Sementic Page</title>
  </head>
  <body>
    <header>
      <h1>My Sementic Page</h1>
    </header>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <label for="search-input">Search</label>
      <input id="search-input" type="search" placeholder="Search" />
      <input type="submit" value="Search" />
    </nav>
    <main>
      <article>
        <h2>Home</h2>
        <p>Home page 내용</p>
      </article>
      <aside>
        <h2>About</h2>
        <ul>
          <li><a href="#">About 1</a></li>
          <li><a href="#">About 2</a></li>
          <li><a href="#">About 3</a></li>
        </ul>
      </aside>
    </main>
    <footer>
      <p>My Sementic Page</p>
      <p>Contact : <address>soakdma37@gmail.com</address></p>
    </footer>
  </body>
</html>
```

이걸 실행해 보면 끔찍하다. 왜냐하면 아무런 스타일이 없기 때문이다. 후에 CSS를 정리할 때 스타일을 적용해 볼 수 있을 것이다. 하지만 지금은 시맨틱한 페이지를 만든 것에 만족하고 태그들을 살피자.

## 7.2. header

header 태그는 구획을 요약하고 소개, 탐색에 도움을 주는 컨텐츠 그룹을 나타낸다. 만약에 body에 바로 포함되어 있다면 문서 전체의 헤더를 나타낸다. 

section, article, nav, aside 등의 요소 안에 포함되어 있다면 해당 요소의 헤더를 나타낸다. 즉 영역의 제목과 간단한 설명 등을 감싸는 데에 사용할 수 있다.

단 address, footer나 다른 header의 자손으로는 사용될 수 없다.

header는 h1~h6, nav, form, section, article, aside, header, footer, address 등의 요소를 포함할 수 있다.

## 7.3. footer

footer 태그는 가장 가까운 구획의 footer를 나타낸다. 일반적으로 작성자, 저작권 정보, 관련 문서 바로가기 등을 담는다. 예를 들어 address 요소를 포함하는 게 일반적이다. 단 구획 콘텐츠는 아니라서 개요에 새로운 구획을 생성하지는 않는다.

footer가 body 요소의 자식이면 footer는 전체 페이지에 적용된다.

## 7.4. main

main은 페이지의 주요 컨텐츠이다. 문서의 핵심 주제나 핵심 기능에 직접적으로 연결된 컨텐츠를 말한다.

주요 컨텐츠인 만큼 hidden 속성이 없는 한 문서에 하나만 존재해야 한다. main은 article, section, div 등의 태그들을 포함할 수 있으며 요소 개요에 영향을 주지 않는다. 또한 이상적으로는 body에 바로 포함되어야 하며 다른 요소 안에 포함되어서는 안 된다.

## 7.5. article

article은 페이지의 나머지 요소와 상관없이 독립적으로 구분되고 재사용할 수 있는 컨텐츠 블록을 나타낸다. 뉴스 기사나 블로그 포스트 같은 것.

하나의 문서가 여러 개의 article을 포함할 수 있는데, 사용자가 스크롤하면 계속 다음 글을 보여주는 블로그의 경우 각 글이 article 태그가 될 것이다.

사용할 때 의미론적으로 생각해야 할 건 다음과 같다.

- 각 article은 독립적으로 구분되어야 한다.
- article을 식별할 수단이 필요하다. 제목 요소를 article에 포함시키는 방법이 일반적이다.
- article이 중첩되어 있을 경우 안쪽 article은 바깥쪽 article에 관련된 글이다.
- address 태그를 이용해서 작성자 정보를 제공할 수 있다.
- article의 작성요소와 시간은 time의 datetime을 이용해서 표시할 수 있다.

## 7.6. aside

aside 태그는 페이지의 메인 컨텐츠와 직접 관련이 있지는 않지만 페이지의 주제와 간접적인 관련이 있는 컨텐츠를 나타낸다. 주로 사이드바로 표현되며 작성자의 정보, 용어 사전, 관련 링크 등이다.

## 7.7. nav

nav 태그는 페이지의 주요 링크를 모아놓은 구획을 나타낸다. 주로 메뉴나 목차를 만들 때 사용한다. 단 문서의 모든 링크를 포함할 필요는 없고, 주요 링크만 있으면 된다. 나머지 링크들은 footer에 포함될 때가 많다.

또한 페이지 내에 목적에 따라 nav 여러 개를 가질 수 있는데 접근성 향상을 하려면 nav에 aria-labelledby을 추가해야 한다. 스크린리더도 nav를 참고하기 때문에 접근성에 영향을 미칠 수 있다.

## 7.8. address

가까운 HTML 요소의 사람, 단체, 조직 등에 대한 연락처 정보를 나타낸다. 주소, 이메일, 전화번호, SNS 등 어떤 정보라도 포함할 수 있다. 

헤더에 제작자의 연락처를 적는 데 사용할 수도 있고 article 내에 배치해서 해당 글의 작성자를 나타내는 데 쓸 수도 있다. footer 안에 흔히 쓰인다.

```html
<address>
  <p>Written by <a href="mailto:soakdma37@gmail.com">soakdma37</a>.</p>
</address>
```

단 연락처 외의 정보를 담아서는 안된다. 가령 날짜 같은 것을 담으면 안된다.

## 7.9. section

section은 HTML 문서에서 하나의 기능을 수행하는 독립적인 구획을 나타낸다. 더 적합한 의미 요소가 없을 때 사용한다. 제목을 포함할 수도 있고 아닐 수도 있는데 제목이 아니라도 각 section을 식별할 수단이 필요하다.

단 콘텐츠가 외부와 구분되어 단독으로 존재할 수 있다면 article 태그를 쓰는 것이 나을 수 있다. 그리고 section은 일반 컨테이너로 사용하는 게 아니라 문서에 해당 구획이 논리적으로 구분되어야 할 때 사용한다. 스타일링만이 목적이라면 div를 쓰자.

section은 article과 비슷하다. 차이라고 한다면 article은 독립적으로 구분되어야 하지만 section은 그렇지는 않다. 그리고 맥락에 따라 article을 여러 개의 section으로 구성하거나 하나의 section을 여러 article로 구성할 수 있다.

```html
<section>
  <h2>Heading</h2>
  <img src="./my-image.png" alt="페이지 예시 이미지" />
</section>
```

## 7.10. heading

`<h1>`에서 `<h6>`까지의 요소는 6단계의 구획 제목을 나타낸다. `<h1>`이 제일 큰 제목이다.

`<h1>`태그는 페이지당 1개만 있는 것이 좋으며, 제목 태그 자체를 한 페이지에 3개 이상 사용하는 것은 좋지 않다. 많은 단계의 목차를 가진 경우 다루기 쉽지 않기 때문이다. 이런 상황에서는 컨텐츠를 여러 페이지로 나누는 것이 좋다.

그리고 `<h1>`을 쓴 구획 내에서는 `<h2>`를 다음으로 사용하는 등 제목 단계를 순차적으로 쓰는 것이 좋다. 그것이 스크린 리더 사용자의 접근성에 좋다.

h1~h6태그에는 기본 스타일링이 있지만, 이는 의미와는 상관이 없다. 

예를 들어서 span 태그의 텍스트에 css를 적용하여 h1 태그의 기본 스타일링처럼 보이게 했다고 해도 두 태그의 근본적인 의미 차이는 바꿀 수 없다. 

제목 텍스트에 이 태그들을 쓰고, 폰트 사이즈 스타일링 등이 필요하다면 `font-size` CSS를 사용하자.

# 8. 텍스트 콘텐츠

텍스트 콘텐츠 태그를 통해서 `<body>`내부의 콘텐츠 구획을 정리하며 콘텐츠 구획의 목적이나 구조 판별에 사용한다. 접근성과 SEO에 중요하다.

`<blockquote>`, `<dl>`, `<dt>`, `<dd>`, `<div>`, `<figcaption>`, `<figure>`, `<hr>`, `<li>`, `<menu>`, `<ol>`, `<p>`, `<pre>`, `<ul>` 태그를 포함한다.

## 8.1. blockquote

blockquote 요소는 블록 레벨 컨텐츠가 인용된 것을 나타낸다. 별도의 블록이 필요하지 않은 짧은 인용문은 이후에 인라인 텍스트 시맨틱에서 다룰 `<q>`태그를 사용하자. 

아무튼 cite 속성을 사용하면 인용의 출처를 나타낼 수 있다. 출처 텍스트도 `<cite>`태그를 통해 제공할 수 있다.

```html
<blockquote cite="https://www.naver.com/">네이버에서 인용한 무언가</blockquote>
```

주로 들여쓰기된 단락으로 나타낸다.

그리고 blockquote, q 태그의 cite 속성은 페이지에 표시되지 않는다. 이런 인용 출처를 화면에 나타나게 하고 싶다면 역시 이후에 다룰 cite 태그를 사용하면 된다.

## 8.2. dl, dt, dd

단순한 목록을 표시하는 ul, ol 태그와 비슷하게 이 태그들을 이용하면 설명 목록을 만들 수 있다. 각 항목과 관련된 설명을 표시하는 것이다.

dl 태그는 dt, dd 태그를 포함하는데 dt(description term)는 각 항목을 나타내고 dd(description definition)는 항목에 대한 설명을 나타낸다. 용어 사전 구현이나 키-값 쌍 목록으로 된 메타데이터 표시에 사용한다.

dt는 용어, 질문, 또는 제목을 나타내고 dd는 정의나 답변을 나타낼 수 있다. 참고로 dt, dd 그룹을 `<div>`로 감쌀 수 있다. 스타일링 등에 유용하다.

```html
<dl>
  <dt>HTML</dt>
  <dd>웹페이지를 구조화하는 데에 사용된다.</dd>
  <dt>CSS</dt>
  <dd>웹페이지의 스타일링에 사용된다.</dd>
  <dt>JavaScript</dt>
  <dd>웹페이지를 동적으로 구성하도록 해준다.</dd>
</dl>
```

브라우저에서 제공하는 기본 스타일에 의해서 하위 항목 들여쓰기가 적용된다. 물론 들여쓰기를 목적으로 이 요소를 사용하는 건 좋지 않다. 

그리고 dt,dd는 일대일이 아니고 하나의 dt에 여러 dd가 붙어 있을 수 있다.

## 8.3. div

div는 블록 레벨의 의미없는 요소를 제공하는 컨테이너이다. 페이지의 주요 콘텐츠와 관련이 없을 수도 있다.

다른 요소들과 달리 div는 어떤 의미도 가지지 않는다. 그래서 div를 사용할 때는 `<article>`등의 의미를 가지는 요소를 사용할 수 없는지 고민해보고, 정 사용할 수 없다면 div를 사용해야 한다.

## 8.4. figure, figcaption

figure 요소는 독립적인 콘텐츠를 표현하며 내부에 figcaption 요소를 사용해 설명을 붙일 수 있다. 다음 코드에서는 이미지에 캡션을 다는 역할을 수행한다.

```html
<figure>
  <img src="assets/profile.jpg">
  <figcaption>내 프로필 사진</figcaption>
</figure>
```

물론 같은 형태의 디자인을 div, img, p 태그를 이용해서 구현할 수도 있지만 위처럼 하면 특정 이미지에 캡션을 연결해 준다는 의미를 브라우저에 전달할 수 있다.

이때 figure 태그내의 요소가 꼭 이미지일 필요는 없다. 동영상이나 표, 코드 등이 올 수 있다.

## 8.5 hr

hr 태그는 문단의 분리나 테마의 전환 등 문단 레벨 요소들의 구분을 위해 사용된다. 브라우저에서는 수평선으로 그려진다.

단 주제의 분리라는 의미를 가진 요소이므로 단순한 수평선을 그리려는 목적이라면 CSS를 사용하자.

빈 요소이므로 닫는 태그가 있으면 안 된다.

## 8.6. ul, ol, li

ul 요소는 unordered list로 순서 없는 목록을 나타내고 ol 요소는 ordered list로 순서 있는 목록을 나타낸다.

두 태그 안에는 li 요소가 존재하는데 이는 list item으로 목록의 항목을 나타낸다. `li` 요소는 반드시 ul, ol, menu 태그 내부에 위치해야 한다.

```html
<ul>
  <li>사과</li>
  <li>배</li>
  <li>딸기</li>
</ul>

<ol>
오늘 할 일
  <li>HTML 공부</li>
  <li>CSS 공부</li>
  <li>JS 공부</li>
</ol>
```

ul, ol의 차이라면 ol은 순서가 중요하다는 점이다. 항목에 순서가 있다면 ol을 사용해야 한다. 

순서가 있는 목록답게 `ol`은 목록의 순서 역전 여부를 나타내는 `reversed`, 항목의 순서 시작점을 나타내는 `start` 속성을 가진다. 또한 항목의 순서 카운터 스타일을 지정하는 `type` 속성을 가진다.

## 8.7. menu

menu 태그는 사용자가 수행할 수 있는 명령 묶음을 말한다. 메뉴 이름을 뜻하는 label과 메뉴의 종류를 나타내는 type 속성을 가진다.

그런데 내부에 쓰이는 `menuitem` 태그는 deprecated되었고, `menu` 태그 자체도 실험적인 기술이므로 현재 기준으로는 넘어가도 될 듯 하다.

[menu 태그 MDN 문서 링크](https://developer.mozilla.org/ko/docs/Web/HTML/Element/menu)

## 8.8. p

하나의 문단을 나타내는 블록 요소이다. 해당 태그를 이용해 컨텐츠를 문단 단위로 나누면 페이지의 접근성을 높인다. 아주 예전에는 ¶(필크로)특수문자를 사용해서 문단을 구분했지만 이제는 p 태그를 사용한다.

브라우저에서는 기본적으로 한 줄의 간격으로 분리하며 다른 스타일은 CSS를 사용해서 지정한다. 앞서 보았던 다른 태그들처럼, 문단 사이 여백 추가를 위해 p 태그를 사용하면 안된다.

```html
<p>첫 번째 문단</p>
<p>두 번째 문단</p>
```

## 8.9. pre

미리 서식을 지정한 텍스트를 나타내며 문서에 작성한 내용 그대로를 표현한다. 요소 내 공백 문자도 그대로 유지한다. 

일반적으로 HTML에서 공백을 여러 개 반복해 사용하면 파서가 하나의 공백으로 줄여 버리지만 pre 태그를 사용하면 pre 태그 내부 내용에서는 공백을 그대로 유지한다는 것이다. 따라서 아스키 아트 등을 표현할 때 사용할 수 있다.

접근성을 고려하면 pre요소에 대한 대체 설명을 지정해야 한다. figure, figcaption, id, aria-labelledby 등을 사용할 수 있다.

```html
<figure role="textbox" aria-labelledby="my-code">
  <pre>
    <code>
      function sayHello() {
        console.log('Hello, World!');
      }
    </code>
  </pre>
  <figcaption id="my-code">
    Hello, World!를 출력하는 함수를 Javascript로 작성한 코드
  </figcaption>
</figure>

```

# 9. 인라인 텍스트 시맨틱

인라인 텍스트의 구조나 스타일을 정의한다. 종류가 엄청나게 많은데, `<a>`, `<br>`, `<cite>`, `<code>`, `<q>`, `<small>`, `<span>`, `<strong>`, `<time>`, `<sup>` 등이 있다. 꽤 자주 쓰이는 것만 여기 정리한다.

모든 인라인 텍스트 시맨틱 태그가 의미를 가지고 있는 건 아니다. `<b>`처럼 특별한 중요도 부여는 없고 CSS가 지원되지 않는 브라우저에서의 기본적인 텍스트 스타일링을 위해서 사용되는 태그들도 있다.

## 9.1. a

a 태그는 anchor로 다른 페이지 혹은 같은 페이지의 특정 위치, 파일 등 어떤 URL로의 하이퍼링크를 나타낸다. href(hypertext reference의 약자) 특성을 통해 링크의 목적지를 지정할 수 있다.

```html
<a href="https://www.google.com">구글</a>
```

위의 a태그 내에 `구글`이라고 작성했듯이, a태그 내의 콘텐츠는 접근성을 위해 링크 목적지의 설명을 나타내야 한다. 

그리고 `target="_blank"`로 새 창을 열거나 다운로드를 시작하는 링크의 경우 링크 클릭시 발생하는 일을 링크 텍스트에 명시해야 한다.

```html
<a href="https://www.google.com" target="_blank">구글(새 탭에서 열림)</a>
```

그리고 a 태그 내에 이미지 등을 넣어 링크의 행동을 나타낼 땐 alt 텍스트를 꼭 지정하자.

[a태그에 관련해서는 자세한 설명 글을 따로 작성하기도 했다](https://witch.work/posts/misc/html-link-tag)

## 9.2. br

텍스트 안에서 끊고 싶은 지점에 삽입하여 줄바꿈을 지정한다. 단 줄바꿈을 삽입하는 요소일 뿐이므로 문단 구분을 `<br>`요소로 하지는 말자. 

문단 구분에는 `<p>`태그를 사용하는 게 좋고 여백을 두는 데에는 margin CSS를 쓰는 게 좋다.

## 9.3. cite

출처 표기에 사용하며 제목을 포함해야 한다. 책, 논문, 악보, 게임 등 다양한 저작물을 출처로 포함할 수 있다.

`<blockquote>`나 `<q>`태그와 함께 사용하면 인용문의 출처를 나타낼 수 있다.

일반적인 브라우저는 이 태그 콘텐츠를 기울임꼴로 표기한다.

```html
<p>
  부동 소수점 표현은 <cite>IEEE-754</cite>규격을 따른다.
</p>
```

## 9.4. code

짧은 코드 조각을 나타내는 인라인 요소이다. 기본 스타일은 사용자 에이전트에서 지원하는 고정폭 글씨체다.

해당 태그는 보통 한 줄의 코드만 나타내므로 여러 줄의 코드를 나타내려면 `<pre>`태그를 사용하자.

## 9.5. em, i

em 태그는 emphasis의 약자로 텍스트의 강조를 나타내고 기본 스타일은 이탤릭체다. 단 단순히 기울임꼴이 필요해서 이 태그들를 쓰면 안된다. 그럴 땐 CSS를 써야 한다.

```js
<p>HTML은 <em>텍스트</em>를 올바르게 표시할 수 있도록 설계되었다.</p>
```

이렇게 em태그를 쓰거나 비슷한 의도의 strong 태그를 쓰면 스크린 리더에서도 다른 톤의 목소리로 표현된다.

i 태그는 어떤 이유로 구분해야 하는 텍스트를 나타낸다. 기술 용어나 외국어 등이다. 예전에는 b 태그처럼 i 태그도 이탤릭체 적용을 위해서만 쓰였지만 지금은 구분이라는 특정한 의미를 지니게 되었다.

i 태그도 이탤릭체 결과를 내놓는다. 하지만 em은 강조를 위해 사용하는 태그이고 i는 외국어, 독백 등 일반적인 맥락에서 벗어났을 경우 사용한다.

## 9.6. mark

현재 맥락에 관련이 깊거나 관심을 가져야 할 중요한 부분을 나타낸다. 형광펜으로 강조 표시를 하는 것과 같다고 생각하면 된다.

단 표시를 위해서만 사용하면 안 된다. 그럴 땐 CSS를 사용하자.

## 9.7. q

짧은 인라인 인용문. cite 속성을 써서 출처 표기 가능

```html
<p>이 문장은 <q cite="https://www.naver.com/">네이버에서 인용한 무언가</q>를 인용했다.</p>
```

인라인 인용구는 기본적으로 따옴표로 묶인 일반 텍스트로 표현된다.

## 9.8. span

본질적으로는 아무 의미도 나타내지 않는 통용 인라인 컨테이너다. 스타일 적용이나 어떤 특성을 공유하는 요소를 묶을 때 쓸 수 있다. 의미를 갖지 않는 요소를 제공한다는 점에서 인라인 버전의 `div`라고도 할 수 있겠다.

## 9.9. strong

전체 문서에서 중대하거나 긴급한 콘텐츠, 혹은 주변 콘텐츠와 비교해서 매우 중요한 부분을 나타낸다. 경고 혹은 페이지의 텍스트에 대한 노트를 나타낼 수 있다. 보통은 브라우저에서 굵은 글씨로 표시된다.

단 단순히 굵은 글씨체를 위해서만 사용하면 안 된다. 장식의 의미로 굵은 글씨를 쓰고 싶다면 CSS를 사용하자. 그리고 중요의 의미 없이 그저 주의를 집중시키고 싶을 뿐이라면 b 태그를 사용하자. 

그런데 `<em>`도 강조하는 태그 아닌가? 라고 생각할 수 있다. 그러나 `<em>`은 강조를 위한 태그이고 `<strong>`은 중요성을 나타내는 태그이다.

`<em>`은 말할 때 특정 부분에 강조하는 세를 넣는 것과 같다. '난 *네가* 좋아'라고 하는 것과 '난 네가 *좋아*'에서 어디에 강세를 넣는지에 따라서 의미가 달라진다. 하지만 `<strong>`은 문장 자체에 중요성을 주입할 때 사용한다. '**경고!** 위험한 물질임' 같은 느낌이다.


## 9.9. time

시간의 특정 지점 또는 구간을 기계가 읽을 수 있는 형식으로 나타낸다. datetime 특성 값을 지정해 시간을 나타내는 문자열을 사용자 에이전트에 제공할 수 있다.

datetime 특성이 없는 경우 요소의 텍스트 콘텐츠를 datetime 특성값으로 간주하며 이럴 경우 자식 요소를 두어서는 안된다.

```html
<p>최종 수정일: <time datetime="2023-06-28">2023년 6월 28일</time></p>
```

datetime 속성을 설정할 경우 datetime 내부의 날짜 표기는 사용자의 마음대로 할 수 있지만, datetime 속성에는 기계가 읽을 수 있는 형식으로 표기해야 한다.

# 10. 이미지 & 멀티미디어

HTML은 멀티미디어 리소스를 이용할 수 있는 태그를 제공한다.

`<area>`, `<audio>`, `<img>`, `<map>`, `<track>`, `<video>` 태그를 포함한다.

## 10.1. img

HTML에서 이미지를 넣기 위해서는 img태그를 사용한다. img태그는 내부 내용이나 닫는 태그가 없지만 src 속성 하나는 사용되어야 한다.

이때 src 속성에는 사용자 에이전트가 지원하는 파일 형식을 제공해야 한다. [웹 브라우저의 지원 이미지 형식 안내서](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types)

src 속성은 삽입할 이미지의 경로를 나타내는데, 이는 절대경로, 상대경로, 또는 URL로 표현할 수 있다. 검색 엔진은 이미지 파일 이름도 읽고 SEO에 포함시키므로 파일 이름에도 주의하자.

```html
<img src="assets/profile.jpg">
```

이미지는 inline 요소이지만 기본적으로 이미지 크기를 차지하므로 `inline-block`요소처럼 보인다.

`<img>`는 [대체 요소](https://developer.mozilla.org/ko/docs/Web/CSS/Replaced_element)이다. 현재 문서 스타일 영향을 받지 않으며 표현 결과가 CSS 서식 모델과 분리되어 외부 객체로 취급된다는 것이다. `div`등의 박스에 넣고 `object-fit`속성 등으로 제어하는 게 낫다.

### 10.1.1. alt 속성

img 태그의 alt 속성에 문자열을 할당해서 이미지가 로드되지 않았을 때 대체 텍스트를 넣을 수 있다. 이는 path나 파일명을 잘못 적거나 로드가 실패했을 때 표시된다.

또한 스크린 리더는 alt 속성을 읽어주므로, 이미지가 아닌 텍스트로 표현할 수 있는 경우 alt 속성을 사용하는 도움이 된다. 그리고 검색 엔진은 alt 속성을 읽어서 SEO에 포함시키므로 검색 최적화에도 도움이 된다.

Lynx와 같은 브라우저는 텍스트만 지원하므로 이런 브라우저의 사용자에게도 alt 속성이 필요하다.

따라서 alt 속성에는 이미지가 나타나지 않을 때 사용자에게 대신 제공할 수 있는 설명을 넣어주자.

```html
<img src="assets/profile.jpg" alt="프로필 사진">
```

alt 특성을 아예 지정하지 않은 경우 이미지가 콘텐츠의 중요 부분이 아니거나 텍스트로 표현될 수 없음을 의미한다.

빈 문자열로 지정한 경우에도 이미지가 콘텐츠의 중요 부분이 아니라는 것을 나타낸다.

### 10.1.2. 다른 속성들

width, height 속성으로 이미지의 크기를 지정할 수 있다. 하지만 HTML 속성을 통해 이미지 크기를 지정하는 것보다는 CSS를 통해 지정하는 것이 좋다. 혹은 이미지 편집기를 쓰거나.

title 속성으로 이미지 제목을 설정할 수 있다. 그러면 이미지에 마우스 호버 시 이미지 제목이 나타난다. 다만 이 속성은 많은 스크린 리더가 읽어주지 않으므로 이미지에 대한 설명이 사용자에게 중요한 정보를 포함한다면 alt 속성을 사용하는 게 좋다.

### 10.1.3. figcaption으로 캡션 달기

이미지에 캡션을 달 때, div 태그로 감싼 후 div태그 내부에 img 태그와 p 태그를 넣어줄 수도 있다.

하지만 이렇게 하면 특정 이미지에 캡션을 연결해 주는 의미가 전달되지 않는다. 따라서 HTML5의 figure와 figcaption 태그를 사용할 수 있다.

이 태그는 이미지에 캡션을 다는 역할을 수행한다.

```html
<figure>
  <img src="assets/profile.jpg">
  <figcaption>내 프로필 사진</figcaption>
</figure>
```

이때 figure 태그내의 요소가 꼭 이미지일 필요는 없다. 동영상이나 표, 코드 등이 올 수 있다.

이미지를 넣을 때 CSS의 background-image 속성 등을 사용할 수도 있다. 하지만 그렇게 하면 이미지를 사용할 수는 있어도 이미지에 어떤 의미를 페이지 자체에서 부여할 수는 없다. 이런 시맨틱을 위해서 img 태그로 이미지를 넣는 것이다.

### 10.1.4. 이미지를 가져올 수 없을 때

src 속성이 비거나 null이거나 현재 URL과 같을 때, 혹은 이미지 자체나 메타데이터의 손상, 지원하지 않는 이미지 형식 등의 이유로 이미지를 불러올 수 없을 때 오류가 발생한다.

`onerror`(전역 속성)에 오류 핸들러를 등록했다면 위와 같은 오류가 발생했을 때 해당 핸들러가 호출된다.

## 10.2. map, area

`<map>`은 `<area>`와 함께 쓰여서 클릭 가능한 이미지 맵을 정의한다. `<map>` 내부에 area 태그 여러 개가 있으며, img의 `usemap` 속성을 이용해서 map과 이미지를 연결한다.

`<map>` 태그에는 반드시 name 속성이 있어야 한다. 이는 모든 문서 내의 map에서 유일해야 하며 id 특성이 있을 경우 name과 동일해야 한다.

`<area>` 요소는 map 요소 안에서만 사용 가능하며 이미지 영역을 정의하고 하이퍼링크를 추가할 수 있다.

[imagemap.org](https://imagemap.org/)라는 사이트에서 이미지에 해당하는 map 태그를 생성할 수 있다.

## 10.3. audio

`<audio>` 태그를 사용하면 오디오 파일을 페이지에 삽입할 수 있다. src 속성 또는 내부의 source 요소를 삽입해서 오디오 소스를 지정할 수 있다. 다수의 오디오 소스를 지정한 경우 가장 적절한 소스를 브라우저가 고른다.

```html
<audio controls>
  <source src="assets/audio.mp3" type="audio/mpeg">
  <source src="assets/audio.ogg" type="audio/ogg">
  <!-- 여기에 fallback content가 들어갈 수도 있다. -->
</audio>
```

오디오 태그는 보여줄 시각 컨텐츠가 없으므로 width, height 속성을 사용할 수 없다. 같은 이유로 poster 속성도 지원하지 않는다.

그런데 접근성을 생각하면 오디오 또한 캡션과 자막을 제공하는 게 맞다. 문제는 audio 태그가 WebVTT를 현재로서는 제공하지 않는다는 것이다. 따라서 이를 제공하는 라이브러리를 찾거나 직접 구현해야 한다. 

혹은 video 태그를 사용해서 audio를 제공하는 것도 방법이다. 오디오 소스는 audio 태그를 이용하는 게 사용자 경험이 더 낫긴 하지만.

## 10.4. video

`<video>`태그를 쓰면 동영상을 페이지에 삽입할 수 있다. 이 태그는 src 속성을 가지는데 이는 img 태그에서와 같이 넣을 동영상의 경로를 지정한다.

controls 속성을 지정하여 사용자에게 비디오 되감기, 볼륨 조절, 탐색 등의 인터페이스를 제공할 수 있다. 이를 사용하면 비디오 플레이어의 모든 컨트롤 요소가 표시된다.

```html
<video src="assets/video.mp4" controls></video>
```

controls 속성을 사용하지 않고 JS의 HTMLMediaElement API를 사용하여 컨트롤 요소를 직접 만들 수도 있다.

video 태그 안에 p 태그 등을 넣어서 비디오가 지원되지 않는 브라우저에 대비할 수도 있다. 비디오가 표시되지 않을 때 사용자에게 보여줄 일종의 fallback content를 만드는 것이다. 비디오로 가는 링크를 넣는다거나 하는 것이다.

### 10.4.1. 여러 비디오 소스 제공하기

브라우저에 따라서 지원하는 비디오 포맷이 다르기 때문에 우리가 제공한 source의 비디오가 재생되지 않을 수 있다. 

우리는 `audio`나 `picture` 등에서 한 것처럼 이런 문제를 보완하기 위해 여러 소스를 제공하여 브라우저가 지원하는 포맷을 찾아 재생할 수 있도록 할 수 있다. source 태그를 쓸 수 있다.

```html
<video controls>
  <source src="assets/video.mp4" type="video/mp4">
  <source src="assets/video.webm" type="video/webm">
  <source src="assets/video.ogv" type="video/ogg">
</video>
```

지금까지는 video 태그의 src 속성에 비디오 파일의 경로를 넣었는데, 이제는 source 태그를 사용하여 여러 소스를 제공한다. 이렇게 하면 브라우저는 source 태그들의 src를 훑으면서 브라우저가 지원하는 코덱을 가진 첫 비디오를 찾아 재생한다.

이렇게 여러 소스를 제공하는 데에 쓸 수 있는 source 태그는 picture, audio, video 태그에 모두 쓸 수 있다.

그리고 source 태그에는 type 속성을 이용해서 파일의 미디어 타입(MIME 타입)을 명시할 수 있다. 이렇게 하면 브라우저가 지원하지 않는 비디오 코덱 타입을 바로 넘어가도록 할 수 있다.

만약 type 속성을 지정하지 않으면 브라우저는 파일을 로드하고 코덱을 확인한 후 재생할 수 있는지를 판단한다. 이는 시간이 걸리기 때문에 type 속성을 명시하는 게 좋다.

### 10.4.2. video 기타 속성

그 외에도 width, height 태그도 있다. 이 속성을 사용하면 비디오의 크기를 지정할 수 있지만 aspect ratio는 유지된다. 만약 ratio가 다른 높이/너비를 지정한다면 비디오는 가로로 늘어나서 화면을 채울 것이고 안 채워진 부분은 기본 배경색으로 채워진다.

autoplay, loop, muted 속성도 있다. autoplay는 비디오를 자동으로 재생하고, loop는 비디오를 반복 재생하고, muted는 음소거한다.

poster 속성은 비디오가 로드되기 전에 보여줄 이미지를 지정한다. preload는 버퍼링 관련 속성이다.

### 10.4.3. 비디오에 자막 넣기

귀가 잘 들리지 않는 사람이나 시끄러운 환경에 있는 사람, 영상의 언어를 모르는 사람 같은 경우 자막이 필요할 수 있다.

이런 사람에게 자막을 제공할 수 있다. webVTT파일과 track 태그를 사용하면 된다.

webVTT 파일은 간단히 말해서 자막 파일이다. 여러 줄의 자막 문자열과 해당 자막마다 자막을 표시할 시작 시간과 끝 시간을 지정할 수 있다. 자막 위치 등을 지정할 수도 있다.

```html
<video controls>
  <source src="assets/video.mp4" type="video/mp4">
  <source src="assets/video.webm" type="video/webm">
  <source src="assets/video.ogv" type="video/ogg">
  <track src="assets/subtitles.vtt" kind="subtitles" srclang="en" label="English">
</video>
```

track 태그의 kind 속성을 이용하여 자막의 종류를 지정할 수 있다. subtitles, captions, descriptions, chapters, metadata 등이 있다.

자막은 subtitles, 자막은 captions, 설명은 descriptions, 단원 구분은 chapters, 메타데이터는 metadata 등이다.

이때 .vtt 파일은 track 태그를 통해 지정하는데 모든 source 태그보다 뒤에 와야 한다. 그리고 track 태그에 srclang 속성을 이용하여 자막의 언어를 지정할 수 있고 label 속성을 이용하여 사람들이 자막의 언어가 어떤 것일지 알 수 있도록 할 수 있다.

## 10.5. track

위에서 보았듯이, `<track>`요소는 미디어 요소의 자식으로서 자막 등 시간별로 필요한 텍스트 트랙을 지정하는 데 사용한다. 

# 11. 내장 콘텐츠

멀티미디어 콘텐츠 외에도 다양한 기타 콘텐츠를 포함할 수 있게 해준다.

`<embed>`, `<iframe>`, `<object>`, `<portal>`, `<picture>`, `<source>` 태그를 포함한다.

svg와 mathML을 HTML 문서에 직접 삽입할 수 있게 해주는 `<svg>`, `<math>` 태그도 있다.

## 11.1. 간략한 역사

예전에는 웹사이트의 작은 부분을 frame이라 하고, 메인이 되는 문서인 frameset이라는 문서에 frame을 넣어서 만들었다. 즉 페이지를 frame들의 집합으로 보았던 것이다.

그리고 90년대 후반 Flash의 등장으로 영상, 애니메이션 같은 여러 콘텐츠를 웹에 삽입할 수 있게 되었다. 액션스크립트를 통해서 동영상을 제어할 수 있고, 애니메이션을 훨씬 더 적은 용량으로 만들 수 있게 한 플래시는 2000년대를 풍미했다. 

object, embed 요소 등을 이용해서 같은 작업을 할 수 있었지만 별로 쓰이지 않았다.

그러다 플래시가 여러 문제들로 인해 인기가 사그라들고 HTML5가 등장하면서 iframe, embed, object 태그를 이용해서 웹 페이지에 다른 콘텐츠를 넣을 수 있게 되었다.

## 11.2. iframe

iframe 태그는 다른 HTML 페이지를 현재 페이지 안에 삽입할 수 있게 해준다. iframe 태그의 src 속성을 이용해서 다른 웹 페이지를 지정할 수 있다.

유튜브에서 공유-퍼가기를 선택하면 그 동영상에 해당하는 iframe 태그를 복사할 수 있다. 다음과 같은 식이다.

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/b7Pt4hHGi2I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
```

이렇게 삽입된 다른 페이지는 각자 자신의 History를 가지고 있다. 뒤로가기 버튼을 눌렀을 때 현재 페이지가 아니라 삽입된 페이지의 이전 페이지로 이동한다. 그리고 아예 다른 문서로 관리되므로 페이지에 iframe을 추가할 때마다 자원을 더 사용하게 된다.

iframe에는 width, height, src, allowfullscreen속성이 주로 쓰인다. width, height, src속성은 당연히 각각 크기와 삽입할 페이지를 지정한다.

이때 src 속성의 경우, 속도 향상을 위해서는 메인 페이지 로딩 이후 JS를 통해 지정하는 것이 좋다. 페이지 로딩 시간을 더 줄여 준다.

allowfullscreen속성은 Fullscreen API를 사용하여 iframe에 삽입된 페이지가 전체화면으로 보이게 할 수 있는지를 지정한다.

또한 iframe 태그 사이에 삽입된 내용은 iframe 태그가 지원하지 않는 브라우저에서 fallback으로 보여진다.

### 11.2.1. iframe의 보안 문제

다음과 같이 iframe 태그로 내 페이지에 네이버 페이지를 삽입하려고 해보자.

```html
<iframe
  src="https://www.naver.com/"
  width="100%"
  height="500"
  allowfullscreen
>
</iframe>
```

그런데 이렇게 하면 네이버 페이지가 제대로 로딩되지 않는다.

![iframe 로딩 안됨](./iframe-denied.png)

이는 iframe이 해커들의 공격 벡터가 될 수 있기 때문이다. 해커들은 iframe을 이용하여 특정 페이지를 악의적으로 수정하거나 민감한 정보를 유출하기를 시도할 수 있다.

HTML 인젝션 중에서도 iframe 인젝션이라고 하는 공격이 있다. 페이지 내에 iframe 태그를 삽입하고 사이즈를 0으로 설정하여 숨기는 것이다. 따라서 사용자는 iframe이 삽입되었다는 것을 시각적으로 알 수 없고 의도치 않게 악성 페이지를 로드하게 된다.

그리고 유명한 페이지의 경우 많은 사람들이 임베드하고 싶어할 것이므로 이를 모두 허용하면 서버비가 더 많이 들 것이다. 이를 대비해서 iframe을 막아 놓는 경우도 있다.

따라서 필요한 경우에만 삽입하고, 저작권에도 주의하자.

그 외에 해야 할 것들은 HTTPS 사용하기가 있고 좀더 자세히 살펴볼 만한 것은 다음과 같다.

### 11.2.2. sandbox 속성

iframe에는 sandbox 특성이 있다. 이는 삽입된 콘텐츠에 대해 필요한 작업만 허용하도록 할 수 있다.

sandbox 특성이 없는 콘텐츠는 JS를 실행하거나 새 창을 띄우는 등의 작업을 할 수 있기 때문에 악의적 공격 가능성이 늘어난다.

sandbox 특성은 문자열인데 이는 콘텐츠가 허용하는 작업을 지정한다. 만약 sandbox=""로 지정되어 있다면 모든 작업이 허용되지 않는다.

예를 들어서 allow-modals를 sandbox 문자열에 추가한다면 iframe으로 삽입한 페이지에서 모달 창을 띄울 수 있게 된다. 이외에도 띄어쓰기를 통해서 여러 작업을 iframe sandbox 속성을 통해 허용할 수 있다.

단 주의할 점은 allow-scripts와 allow-same-origin 옵션을 sandbox에 동시에 적용할 시 iframe 콘텐츠는 same origin policy를 우회하여 sandbox 특성을 해제하는 JS를 실행할 수 있게 된다. 따라서 이 두 옵션은 동시에 적용하지 않는 것이 좋다.

### 11.2.3. CSP 지시어 설정

CSP는 XSS 공격과 같은 보안 위협으로부터 페이지를 보호하기 위한 추가적인 보안 계층이다. 이는 HTML 문서 보안을 개선하기 위해 고안된 HTTP 헤더를 제공한다.

iframe의 보안 문제 해결을 위해서는 CSP 설정을 통해 X-Frame-Options 헤더를 전송하도록 설정 가능하다. 이 헤더는 해당 페이지를 iframe으로 삽입할 수 있는지를 지정한다.

만약 deny로 설정할 시 같은 사이트 내에서의 frame 접근도 막는다. sameorigin으로 설정할 시 같은 사이트 내에서만 frame 접근이 가능하다. 이런 식으로 적절한 X-Frame-Options 헤더를 설정하면 iframe 보안 문제를 어느 정도 해결 가능하다.

이러한 CSP 설정은 meta 요소를 통해서도 할 수 있지만 웹서버를 구성할 때 하는 것이 좋다. 특히 위에서 다룬 X-Frame-Options 헤더의 경우 meta 태그를 통해서 CSP 정책을 구성할 수 없다.

만약 nginx라면 http, server, location 설정에 설정을 추가하는 식이다.

## 11.3. embed, object

iframe은 다른 HTML페이지를 페이지 내에 삽입하는 기능을 했다. embed, object는 PDF와 같은 외부 콘텐츠를 페이지에 포함하기 위한 기능을 한다. 단 이 요소들을 사용하는 경우가 많지는 않다. 플러그인 콘텐츠를 삽입하기 위해 사용되는 경우가 있다.

```html
<embed src="./dummy.pdf" type="application/pdf" width="100" height="200" />
<object data="./dummy.pdf" type="application/pdf" width="100" height="200">
  <p>대체 텍스트</p>
</object>
```

object 태그가 일반적으로 페이지에 무언가를 삽입할 때 더 많이 쓰인다. 또한 embed는 대체 콘텐츠를 넣을 방법이 없지만 object는 태그 사이에 대체 콘텐츠를 넣는 방식으로 대체 콘텐츠도 지원한다.

단 embed 태그만 지원되는 낡은 브라우저도 있으므로 만약 정말 모든 브라우저에 대응해야 한다면 두 태그를 모두 사용해야 한다. 다음과 같이 object의 대체 콘텐츠로 embed를 넣는 식이다.

```html
<object type="application/pdf"
    data="/media/examples/In-CC0.pdf"
    >
    <embed type="application/pdf"
    src="/media/examples/In-CC0.pdf">
</object>
```

## 11.4. svg

[SVG](https://developer.mozilla.org/ko/docs/Web/SVG)는 Scalable Vector Graphics의 약자로 2차원 벡터 그래픽을 XML로 서술하는 언어이다.

텍스트를 HTML로 기술하듯이 그래픽을 SVG로 기술하는 것이다. `<circle>` 태그를 통해 원을 그리고 `<rect>` 태그를 통해 사각형을 그리는 등이다. 여기에도 여러 태그들이 있는데 이를 이용하면 다양한 그래픽을 그릴 수 있다. [SVG에 관한 더 많은 정보](https://developer.mozilla.org/en-US/docs/Web/SVG)

```html
<svg width="100%" height="100%">
  <rect width="100%" height="100%" fill="black" />
  <circle cx="150" cy="100" r="90" fill="red" />
</svg>
```

간단한 SVG는 위와 같이 직접 만들 수 있지만 복잡한 그래픽을 그리려면 SVG를 직접 구성하는 건 매우 어렵다. 그럴 땐 [Inkscape](https://inkscape.org/ko/)와 같은 프로그램을 이용해야 한다.

그러나 SVG는 쉽게 복잡해지기 때문에 파일 크기가 커질 수 있고 만들기 어렵다는 단점도 있다. 사진과 같은 복잡한 이미지의 경우 래스터 이미지를 쓰는 게 낫다.

### 11.4.1. svg를 페이지에 넣기

svg를 페이지에 넣는 것에는 여러 가지 방법이 있다. 일단 img 태그의 src 속성에 svg파일을 넣음으로써 페이지에 SVG를 넣을 수 있다.

이 방법은 익숙한 문법이라 쉽고 alt text 등의 기능을 사용할 수 있다. 이미지를 하이퍼링크로 만들 수도 있고 브라우저에서 이미지를 캐싱하여 빠르게 로딩할 수 있다.

그러나 이미지를 JS로 제어할 수 없고 CSS를 넣으려고 하면 SVG 코드에 인라인 CSS를 포함시켜야 한다. SVG 파일에 외부 CSS 스타일시트를 넣으면 무시된다. 같은 이유로 SVG에 의사 클래스 CSS(:hover 등)를 적용할 수 없다.

몇몇 브라우저의 경우 SVG를 지원하지 않는데 이 경우 srcset 속성을 사용해서 대체 콘텐츠를 만들어줄 수 있다. 다만 srcset 속성도 최신 브라우저만 지원하는 기능이다. 따라서 SVG를 지원하는 브라우저는 srcset 속성의 SVG 파일을 사용하고, 지원하지 않는 브라우저는 src 속성의 PNG 파일을 사용한다.

```html
<img src="image.png" srcset="image.svg" alt="SVG image" />
```

css의 배경 이미지를 사용하여서도 svg를 삽입할 수 있는데, img 태그를 사용할 때와 같이 JS로 svg를 제어할 수 없다는 같은 단점이 있다.

이런 단점을 극복하기 위해 inline SVG로 svg를 삽입할 수 있다.

SVG를 페이지에 직접 넣는 방법이다. svg 파일을 텍스트 에디터로 열어서 코드를 복사한 다음 HTML 파일에 붙여넣으면 된다.

이렇게 하면 HTTP 요청을 줄일 수 있어서 로딩 시간을 줄일 수 있고 svg 요소에 class, id등을 통해 스타일을 적용할 수 있다. inline SVG는 CSS 상호작용과 CSS 애니메이션을 svg에 적용할 수 있게 하는 유일한 방법이다.

그러나 HTML 파일 내에 SVG 코드를 직접 삽입하기 때문에 코드가 길어지고, 재사용이 불가능하다. 또한 브라우저가 svg 파일 캐싱을 할 수 없다.

마지막으로 iframe 태그를 써서 svg 파일을 넣을 수 있다. iframe 태그의 src 속성에 svg 파일을 넣음으로써 페이지에 SVG를 넣는 것이다.

그러나 SVG와 웹페이지가 같은 origin을 가지고 있으므로 SVG에 JS를 적용할 수 없고 iframe을 사용할 수 없는 브라우저에서는 SVG 지원이 있어도 동작하지 않는다는 단점이 있다. 일반적으로 iframe 태그를 써서 svg를 렌더링하는 건 좋은 선택이 아니다.

## 11.5. 반응형 이미지 넣기

[HTML로 반응형 이미지 가져오기](https://witch.work/posts/dev/html-responsive-image)글을 따로 작성하였다. picture 태그를 사용한다.

## 11.6. portal

다른 HTML 페이지를 임베딩하는 것을 지원하는, `iframe`과 비슷한 태그라고 하는데 아직 실험적인 기능이라서 지원하는 브라우저가 현재로서는 사실상 없다. [언젠가 이 문서를 보고 공부해야 할지도](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/portal)

# 12. 스크립트

HTML 문서에 스크립트(특히 JS)를 포함할 수 있게 해준다.

`<canvas>`, `<noscript>`, `<script>` 태그를 포함한다.

# 13. 표 컨텐츠

표 형식 데이터를 생성하고 처리할 때 사용한다.

`<caption>`, `<col>`, `<colgroup>`, `<table>`, `<tbody>`, `<td>`, `<tfoot>`, `<th>`, `<thead>`, `<tr>` 태그를 포함한다.

# 14. 양식

여러 입력 가능한 요소를 제공한다.

`<button>`, `<datalist>`, `<fieldset>`, `<form>`, `<input>`, `<label>`, `<legend>`, `<meter>`, `<optgroup>`, `<option>`, `<output>`, `<progress>`, `<select>`, `<textarea>` 태그를 포함한다.

# 15. 기타

텍스트의 특정 부분이 수정되었다는 것을 표시해 주는 `<del>`, `<ins>` 태그가 있다.

상호작용 가능한 UI 객체를 만드는 데에 사용하는 `<details>`, `<dialog>`, `<summary>` 태그가 있다.

웹 컴포넌트 요소를 만드는 데에 사용하는 `<slot>`, `<template>` 태그가 있다. 앞으로 여러 글들을 통해 살펴볼 것이다.

참고로, HTML 요소는 태그(<태그이름>)를 사용해서 문서의 다른 텍스트와 구분되며 태그 안의 요소 이름은 대소문자 구분을 하지 않는다. `<div>`로 작성하나 `<Div>`로 작성하나 상관없다는 것이다.

# 16. HTML 디버깅

[HTML 유효성 검사 사이트](https://validator.w3.org/#validate_by_upload)를 통해 HTML 문서를 검사하고 디버깅할 수 있다. 웹페이지 주소를 올리거나 파일을 올리거나 HTML 코드를 직접 올리는 등의 방법을 사용할 수 있다.


# 참고

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
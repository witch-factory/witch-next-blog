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

# 3. HTML 태그

HTML은 콘텐츠 구조를 정의하여 우리가 보는 웹페이지가 어떻게 구조화되어 있는지 브라우저가 알 수 있게 해준다. 각 HTML은 열고 닫는 태그, 그리고 그 사이의 내용으로 구성된 요소(elements)로 이루어져 있다. 이들은 웹페이지의 컨텐츠를 감싸서 특정 기능을 수행한다. 요소 중첩도 가능하다.

요소는 속성도 가질 수 있다. 실제 콘텐츠로 표시되기를 원하지 않는 추가적인 정보를 담고 있다. img 태그의 source를 표시하거나 클래스 속성을 이용해 스타일을 설정하는 등의 일을 할 수 있다.

```html
class속성을 사용한 p태그
<p class="myclass">Hello World!</p>
```

head, title 등 여러 가지 요소들이 있는데 [이는 다음과 같이 구분된다.](https://developer.mozilla.org/ko/docs/Web/HTML/Element)이들을 여러 가지로 구분하여 하나씩 알아보자.

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

현재 문서와 외부 리소스의 관계를 명시한다. 스타일 시트 연결, 파비콘 설정 등에 사용된다.

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

header를 나타내는 header, nav bar를 나타내는 nav, main 컨턴츠에 쓰일 main, article, section, div 등등, sidebar는 aside, footer는 footer를 제공한다.

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

단 연락처 외의 정보를 담아서는 안된다. 가령 날짜 같은 것을 담으면 안된다.

## 7.9. section

section은 HTML 문서에서 하나의 기능을 수행하는 독립적인 구획을 나타낸다. 더 적합한 의미 요소가 없을 때 사용한다. 제목을 포함할 수도 있고 아닐 수도 있는데 제목이 아니라도 각 section을 식별할 수단이 필요하다.

단 콘텐츠가 외부와 구분되어 단독으로 존재할 수 있다면 article 태그를 쓰는 것이 나을 수 있다. 그리고 section은 일반 컨테이너로 사용하는 게 아니라 문서에 해당 구획이 논리적으로 구분되어야 할 때 사용한다. 스타일링만이 목적이라면 div를 쓰자.

section은 article과 비슷하다. 차이라고 한다면 article은 독립적으로 구분되어야 하지만 section은 그렇지는 않다. 그리고 맥락에 따라 article을 여러 개의 section으로 구성하거나(이게 좋을 듯?) 하나의 section을 여러 article로 구성할 수 있다.

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

브라우저에서 제공하는 기본 스타일에 의해서 하위 항목 들여쓰기가 적용된다. 물론 들여쓰기를 목적으로 이 요소를 사용하는 건 좋지 않다. 그리고 dt,dd는 일대일이 아니고 하나의 dt에 여러 dd가 붙어 있을 수 있다.

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

미리 서식을 지정한 텍스트를 나타내며 문서에 작성한 내용 그대로를 표현한다. 요소 내 공백 문자도 그대로 유지한다. 따라서 아스키 아트 등을 표현할 때 사용한다.

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

인라인 텍스트의 구조나 스타일을 정의한다. 종류가 엄청나게 많은데, `<a>`, `<br>`, `<cite>`, `<code>`, `<q>`, `<small>`, `<span>`, `<strong>`, `<time>`, `<sup>` 등이 있다.

모든 인라인 텍스트 시맨틱 태그가 의미를 가지고 있는 건 아니다. `<b>`처럼 특별한 중요도 부여는 없고 CSS가 지원되지 않는 브라우저에서의 기본적인 텍스트 스타일링을 위해서 사용되는 태그들도 있다.

# 10. 이미지 & 멀티미디어

HTML은 멀티미디어 리소스를 이용할 수 있는 태그를 제공한다.

`<area>`, `<audio>`, `<img>`, `<map>`, `<track>`, `<video>` 태그를 포함한다.

# 11. 내장 콘텐츠

멀티미디어 콘텐츠 외에도 다양한 기타 콘텐츠를 포함할 수 있게 해준다.

`<embed>`, `<iframe>`, `<object>`, `<portal>`, `<picture>`, `<source>` 태그를 포함한다.

svg와 mathML을 HTML 문서에 직접 삽입할 수 있게 해주는 `<svg>`, `<math>` 태그도 있다.

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

https://happycording.tistory.com/entry/HTML-Role-%EC%99%9C-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%95%BC%EB%A7%8C-%ED%95%98%EB%8A%94%EA%B0%80
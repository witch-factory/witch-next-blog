---
title: 프론트 지식 익히기 HTML - 3
date: "2023-03-09T01:00:00Z"
description: "MDN HTML 학습지-3"
tags: ["web", "study", "front", "HTML"]
---

# 1. 고급 텍스트 포매팅

https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/Advanced_text_formatting 내용을 정리한 글입니다.

비교적 알려지지 않은 HTML 요소들을 사용해 고급 시맨틱으로 HTML을 구성해 본다.

## 1.1. 설명 리스트

ul, ol 리스트를 사용해서 목록을 표시할 수 있다. 그리고 dl(description list) 요소를 사용하면 설명 목록을 만들 수 있다. 각 항목과 관련 설명을 표시하는 것이다.

dl 태그는 dt, dd 태그를 포함하는데 dt(description term)는 각 항목을 나타내고 dd(description definition)는 항목에 대한 설명을 나타낸다.

dt는 용어, 질문, 또는 제목을 나타내고 dd는 정의나 답변을 나타낼 수 있다.

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

브라우저에서 제공하는 기본 스타일에 의해서 하위 항목 들여쓰기가 적용된다. 그리고 dt,dd는 일대일이 아니고 하나의 dt에 여러 dd가 붙어 있을 수 있다.

## 1.2. 인용

blockquote 요소는 블록 레벨 컨텐츠가 인용된 것을 나타낸다. cite 속성을 사용하면 인용의 출처를 나타낼 수 있다.

```html
<blockquote cite="https://www.naver.com/">네이버에서 인용한 무언가</blockquote>
```

브라우저는 기본적으로 인용구 표현 시 들여쓰기된 단락으로 나타낸다.

인라인 인용 태그도 있다. q 태그는 짧은 인용구를 나타낼 때 사용한다. 역시 cite 속성을 사용하면 인용의 출처를 나타낼 수 있다.

```html
<p>이 문장은 <q cite="https://www.naver.com/">네이버에서 인용한 무언가</q>를 인용했다.</p>
```

인라인 인용구는 기본적으로 따옴표로 묶인 일반 텍스트로 표현된다.

그리고 blockquote, q 태그의 cite 속성은 사실 페이지에 표시되지 않는다. 이런 인용 출처를 화면에 나타나게 하고 싶다면 cite 태그를 사용하면 된다.

cite 태그는 기본적으로 이탤릭체로 나타난다.

```html
<p>이번에는 <code>console.log('Hello World!')</code>라는 코드를 작성해 보았다.</p>
```

## 1.3. 약어

abbr 태그를 사용하면 약어를 표시할 수 있다. title 속성을 사용하면 약어의 전체 표현을 나타낼 수 있는데 이는 마우스를 올렸을 때 나타난다.

```html
<p><abbr title="HyperText Markup Language">HTML</abbr>은 약어이다.</p>
```

acronym 태그도 abbr 태그와 같은 기능을 한다. 하지만 acronym은 더 이상 사용되지 않는다. 따라서 abbr을 사용하도록 하자.

## 1.4. 연락처 세부정보

address 태그를 사용하면 HTML 문서를 작성한 사람의 연락처 정보를 표현할 수 있다.

```html
<address>
  <p>Written by <a href="mailto:soakdma37@gmail.com">soakdma37</a>.</p>
</address>
```

## 1.5. 위첨자, 아래첨자

sub, sup 요소를 사용하면 각각 아래첨자, 위첨자를 사용할 수 있다.

```html
<p>2<sup>2</sup> = 4</p>
```

## 1.6. 코드 나타내기

code 태그를 사용하면 짧은 코드 조각을 표시할 수도 있다. pre 태그는 공백을 유지하기 위해 사용한다. 일반적으로 HTML에서 공백을 여러 개 반복해 사용하면 파서가 하나의 공백으로 줄여 버리지만 pre 태그를 사용하면 pre 태그 내부 내용에서는 공백을 그대로 유지한다.

var 태그는 변수 이름을 특별하게 표시한다. kbd 태그는 키보드 입력을 나타낸다. samp 태그는 컴퓨터 프로그램의 출력을 나타낸다.

## 1.7. 시간과 날짜

time 요소를 사용하면 기계가 읽을 수 있는 형식으로 날짜와 시간을 표시할 수 있다. datetime 속성을 사용하면 날짜와 시간을 표시할 수 있다.

즉 날짜의 표기는 내 마음대로 하지만 datetime 속성에는 기계가 읽을 수 있는 형식으로 표기해야 한다.

```html
<p>오늘은 <time datetime="2023-03-09">2023년 3월 9일</time>이다.</p>
```

<p>오늘은 <time datetime="2023-03-09">2023년 3월 9일</time>이다.</p> 과 같이 표시된다.

# 2. 문서와 웹사이트 구조

https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure 을 정리한 내용이다. 웹 페이지 구조를 어떻게 시맨틱하게 표현할 수 있는지 알아보자.

## 2.1. 일반적인 문서의 영역들

일반적인 문서는 다음과 같은 영역으로 구성된다.

header : 큰 제목과 로고 등이 있는 띠. 주요 정보가 정리되어 있다. 보통 다른 페이지들에서도 똑같이 나타난다.

nav : 페이지 내에서 다른 페이지로 이동할 수 있는 링크들이 있는 영역. 주로 메뉴, 링크, 탭이 들어가고 다른 페이지들에서도 일관적으로 나타난다. 보통 header 영역에 들어가지만 필수 사항은 아니다. 

main : 페이지의 가장 주요 내용이 들어가는 영역. 이야기나 페이지의 중요한 비디오 등이 들어간다.

sidebar : 주변의 정보, 링크, 인용부호 등이 들어가는데 메인 컨텐츠에 따라 내용이 다르다. 기사 페이지라면 sidebar에는 작성자나 관련 기사 링크를 포함할 것이다. 보통 main 영역의 옆에 위치한다.

footer : 페이지 바닥의 줄로 페이지에 관한 작은 정보나 연락처를 적는다. 사이트맵이나 인기 컨텐츠 바로가기 링크가 있을 수도 있다.

이 각각의 페이지 요소들에 대해서 적절한 태그들을 사용해야 한다.

## 2.2. 페이지 구성

위와 같은 시맨틱한 페이지 구성을 위해 HTML은 다음과 같은 태그들을 제공한다.

header를 나타내는 header, nav bar를 나타내는 nav, main 컨턴츠에 쓰일 main, article, section, div 등등, sidebar는 aside, footer는 footer를 제공한다.

간단한 페이지를 다음과 같이 구성해 본다.

```html
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
      <p>Contact : soakdma37@gmail.com</p>
    </footer>
  </body>
</html>
```

이걸 실행해 보면 끔찍하다. 왜냐하면 아무런 스타일이 없기 때문이다. 후에 CSS를 정리할 때 스타일을 적용해 볼 수 있을 것이다...하지만 지금은 시맨틱한 페이지를 만든 것에 만족하자.

## 2.3. 위에서 쓰인 HTML 요소들

### 2.3.1. header

header 태그는 구획을 요약하는 컨텐츠 그룹을 나타낸다. 만약에 body에 바로 포함되어 있다면 문서 전체의 헤더를 나타낸다. 만약에 section, article, nav, aside 등의 요소 안에 포함되어 있다면 해당 요소의 헤더를 나타낸다. 즉 영역의 제목과 간단한 설명 등을 감싸는 데에 사용할 수 있다.

단 address, footer나 다른 header의 자손으로는 사용될 수 없다.

header는 h1~h6, hgroup, nav, form, section, article, aside, header, footer, address 등의 요소를 포함할 수 있다.

### 2.3.2. footer

footer 태그는 가장 가까운 구획의 footer를 나타낸다. 일반적으로 작성자, 저작권 정보, 관련 문서 바로가기 등을 담는다. 예를 들어 address 요소를 포함하는 게 일반적이다.

footer가 body 요소의 자식이면 footer는 전체 페이지에 적용된다.

### 2.3.3. main

main은 페이지의 주요 컨텐츠이다. hidden 속성이 없는 한 문서에 하나만 존재해야 한다. main은 article, section, div 등의 태그들을 포함할 수 있으며 요소 개요에 영향을 주지 않는다. 또한 이상적으로는 body에 바로 포함되어야 하며 다른 요소 안에 포함되어서는 안 된다.

### 2.3.4. article

article은 페이지의 나머지 요소와 상관없이 독립적으로 구분되고 재사용할 수 있는 컨텐츠 블록을 나타낸다. 뉴스 기사나 블로그 포스트 같은 것.

하나의 문서가 여러 개의 article을 포함할 수 있는데, 사용자가 스크롤하면 계속 다음 글을 보여주는 블로그의 경우 각 글이 article 태그가 될 것이다.

사용할 때 의미론적으로 생각해야 할 건 다음과 같다.

- 각 article은 독립적으로 구분되어야 한다.
- article을 식별할 수단이 필요하다. 제목 요소를 article에 포함시키는 방법이 일반적이다.
- article이 중첩되어 있을 경우 안쪽 article은 바깥쪽 article에 관련된 글이다.
- address 태그를 이용해서 작성자 정보를 제공할 수 있다.
- article의 작성요소와 시간은 time의 datetime을 이용해서 표시할 수 있다.

### 2.3.5. section

section은 HTML 문서에서 하나의 기능을 수행하는 독립적인 구획을 나타낸다. 더 적합한 의미 요소가 없을 때 사용한다. 제목은 포함할 수도 있고 아닐 수도 있는데 어쨌든 각 section을 식별할 수단이 필요하다.

단 콘텐츠가 외부와 구분되어 단독으로 존재할 수 있다면 article이 나을 수 있다. 그리고 section은 일반 컨테이너로 사용하는 게 아니라 문서에 해당 구획이 논리적으로 구분되어야 할 때 사용한다. 스타일링만이 목적이라면 div를 쓰자.

section은 article과 비슷하지만 article은 독립적으로 구분되어야 하지만 section은 그렇지는 않다. 그리고 맥락에 따라 article을 여러 개의 section으로 구성하거나(이게 좋을 듯?) 하나의 section을 여러 article로 구성할 수 있다.

위의 요소들을 사용하면 다음과 같은 문서를 만들 수 있다.

```html
<article>
  <header>
    <h2>블로그 글 제목</h2>
    <p>블로그 글 간단한 설명</p>
  </header>
  <section>
    <h3>블로그 글 제목</h3>
    <p>블로그 글 내용</p>
    <p>블로그 글 내용 문단 2</p>
  </section>
  <section>
    <h3>다른 영역 2</h3>
    <p>다른 내용</p>
    <p>다른 내용 문단 2</p>
  </section>
  <footer>
    <p>
      이 글은
      <time datetime="2023-03-09">2023년 3월 9일</time>작성되었습니다.
    </p>
  </footer>
</article>
```

### 2.3.6. aside

aside 태그는 페이지의 메인 컨텐츠와 직접 관련이 있지는 않지만 페이지의 주제와 간접적인 관련이 있는 컨텐츠를 나타낸다. 작성자의 정보, 용어 사전, 관련 링크 등이다.

### 2.3.7. nav

nav 태그는 페이지의 주요 링크를 모아놓은 구획을 나타낸다. 주로 메뉴나 목차를 만들 때 사용한다. 단 문서의 모든 링크를 포함할 필요는 없고, 주요 링크만 있으면 된다. 나머지 링크들은 footer에 포함될 때가 많다.

또한 페이지 내에 목적에 따라 nav 여러 개를 가질 수 있는데 접근성 향상을 하려면 nav에 aria-labelledby을 추가해야 한다.

## 2.4. 의미없는 래퍼 태그

몇몇 항목을 함께 묶을 때 딱히 의미가 없는 경우가 있다. 몇 개의 항목을 한번에 스타일링하고 싶거나 컨텐츠들을 래핑할 때 특별한 의미를 찾을 수 없는 경우가 그렇다.

이런 경우를 위해 div, span 태그가 있다. div는 블록 레벨, span은 인라인 레벨의 의미없는 래퍼태그이다.

### 2.4.1. div

div는 블록 레벨의 의미없는 요소를 제공한다. 페이지의 주요 콘텐츠와 관련이 없을 수도 있다.

다른 요소들과 달리 div는 어떤 의미도 가지지 않는다. 그래서 div를 사용할 때는 의미를 가지는 요소를 사용할 수 없는지 고민해보고, 정 사용할 수 없다면 div를 사용해야 한다.

### 2.4.2. span

span은 인라인 레벨의 의미없는 요소를 제공한다. 페이지의 주요 콘텐츠와 관련이 없을 수도 있다. 또한 페이지의 논리 구조에서 특별한 의미는 없지만 어떤 텍스트를 다른 부분과 구분되게 스타일링하고 싶을 때 사용할 수 있다.

## 2.5. 줄 구분

### 2.5.1. br

br은 줄바꿈을 나타낸다. br은 빈 요소이며 텍스트 안에 줄바꿈을 생성한다. 줄 구분이 중요한 내용 작성시 유용하다.

단 이를 문단을 구분하고 문단 사이의 여백을 두는 데에 사용하면 안 된다. 그런 목적이라면 p 태그의 margin CSS를 써야 한다.

### 2.5.2. hr

hr은 수평선을 나타낸다. hr은 빈 요소이며 시각적으로 수평선을 생성한다. 이야기를 구분하거나 문단간 주제 분리에 사용할 수 있다.

# 3. HTML 디버깅

[HTML 유효성 검사 사이트](https://validator.w3.org/#validate_by_upload)를 통해 HTML 문서를 검사하고 디버깅할 수 있다. 웹페이지 주소를 올리거나 파일을 올리거나 HTML 코드를 직접 올리는 등의 방법을 사용할 수 있다.

# 참고

https://discourse.mozilla.org/t/marking-up-a-letter-assessment/24676

각종 MDN 문서들

```
HTML 로드맵
+-- HTML 기본
+-- HTML 입문서
  +-- HTML 소개
  +-- HTML 시작하기
  +-- HTML 메타 데이터
  +-- HTML text
  +-- 하이퍼링크 만들기
  +-- 고급 텍스트 포매팅
  +-- 문서와 웹사이트 구조
  +-- HTML 디버깅
  -- 완료
  +-- Marking up a letter
  +-- 페이지 콘텐츠 구조화
+-- 멀티미디어와 임베딩
  +-- 소개
  +-- HTML의 이미지
  +-- 비디오와 오디오 컨텐츠
  +-- object에서 iframe
  +-- 벡터 그래픽 추가하기
  +-- 반응형 이미지
+-- HTML 테이블
  +-- 소개
  +-- 기초
  +-- 고급 기능과 접근성
+-- HTML 폼
+-- HTML 문제 해결하기
+-- 고급 주제들
```
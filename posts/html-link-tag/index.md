---
title: HTML의 링크 태그에 관하여
date: "2023-06-28T01:00:00Z"
description: "HTML의 하이퍼링크 태그"
tags: ["HTML"]
---

a태그는 다른 페이지로 이동하는 것 외에도 여러가지를 할 수 있다.

# 1. 기본

a 태그는 anchor로 다른 페이지 혹은 같은 페이지의 특정 위치, 파일 등 어떤 URL로의 하이퍼링크를 나타낸다. href(hypertext reference의 약자) 특성을 통해 링크의 목적지를 지정할 수 있다.

이때 웹 상의 어떤 페이지로 이동할 때 쓰이는 텍스트 문자열은 URL이라 하고 Uniform Resource Locator의 약자이다. 그리고 그 내부의 특정 파일을 찾을 때 사용되는 경로 문자열이 path다.

예를 들어 `https://www.naver.com/index.html`에서 `https://www.naver.com`은 URL이고 `/index.html`은 path다.

```html
<a href="https://www.google.com">구글</a>
```

위의 a태그 내에 `구글`이라고 작성했듯이, a태그 내의 콘텐츠는 접근성을 위해 링크 목적지의 설명을 나타내야 한다. 

그리고 `target="_blank"`로 새 창을 열거나 다운로드를 시작하는 링크의 경우 링크 클릭시 발생하는 일을 링크 텍스트에 명시해야 한다.

```html
<a href="https://www.google.com" target="_blank">구글(새 탭에서 열림)</a>
<a href="https://www.youtube.com/watch?v=QH2-TGUlwu4">노래 듣기(동영상 재생)</a>
```

a 태그 내에 이미지 등을 넣어 링크의 행동을 나타낼 땐 alt 텍스트를 꼭 지정하자.

# 2. URL 지정

## 2.1. 외부 URL

앞서 본 것처럼 href 속성에 URL을 넣으면 된다.

```html
<a href="https://www.google.com">구글</a>
```

상대 URL을 넣을 수도 있다. 혹은 `href="../projects/index.html"`과 같이 파일 상대 경로를 지정할 수도 있다.

## 2.2. 같은 페이지의 문서 조각

문서 조각이란 문서 내의 특정 위치를 가리키는 것이다. 문서 조각은 `#`으로 시작하며, 문서 내의 특정 id를 가리킨다.

다음과 같이 하면 문서 내의 `id="section-1"`을 가진 요소로 이동한다.

```html
<a href="#section-1">섹션 1로 이동</a>
```

물론 이는 다른 페이지에도 가능하다. 가령 `https://www.google.com`의 `#section-1`로 이동하고 싶다면 다음과 같이 하면 된다.

```html
<a href="https://www.google.com#section-1">구글의 섹션 1로 이동</a>
```

## 2.3. 다운로드 링크

브라우저에서 페이지를 여는 것이 아니라 다운로드할 리소스에 연결할 경우 `download` 특성을 사용하여 다운로드될 파일의 기본 이름을 지정할 수 있다.

```html
<a href="다운로드 링크" download="blabla.pdf">구글 다운로드</a>
```

## 2.4. 이메일 주소

href 속성에 `mailto:`를 사용하여 이메일 주소를 지정할 수 있다.

```html
<a href="mailto:soakdma37@gmail.com">블로그 주인에게 이메일</a>
```

사실 이메일 주소도 지정하지 않을 수 있는데 이를 생략하면 브라우저는 그냥 사용자의 메일 클라이언트를 이용해 새로운 메일 보내기 창을 띄운다.

또한 속성도 몇 개 지정할 수 있는데 subject(제목), cc(참조), bcc(숨은 참조), body(본문) 등을 지정할 수 있다. 이는 URL 쿼리스트링 형식과 같이 쓴다.

`?`를 사용하고 `&`로 구분하여 입력하면 된다.

```html
<a href="mailto:soakdma37@gmail.com?
cc=참조메일주소1, 참조메일주소2&
bcc=숨은참조메일주소1, 숨은참조메일주소2&
subject=메일제목&
body=메일본문">형식을 지정한 이메일 링크</a>
```

## 2.5. 전화번호

href 속성에 `tel:`을 사용하여 전화번호를 지정할 수 있다.

```html
<a href="tel:010-1234-5678">블로그 주인에게 전화</a>
```

이 링크는 장치에 따라 동작이 바뀐다. 휴대전화에선 번호를 자동으로 입력하며 데스크톱에선 Skype등 전화를 걸 수 있는 프로그램을 실행한다.


# 3. 상대 링크 vs 절대 링크

링크 목적지를 만들 때 상대 URL, 절대 URL 중 어느 것을 사용하는 것이 좋을까? 

문서의 구조가 바뀌면 상대 URL을 사용한 링크는 더 이상 제대로 작동하지 않을 수 있다. 따라서 절대 URL을 사용하는 것이 좋다고 생각할 수 있다.

하지만 동일한 사이트 내의 다른 위치에 연결할 때는 가능한 상대 링크를 사용하는 것이 좋다. 이유는 2가지가 있다.

첫째로 상대 링크가 일반적으로 더 짧기 때문에 코드를 읽기 쉽다.

둘째로 성능이 좋아진다. 절대 URL을 사용시 브라우저가 새로운 페이지를 불러오기 위해 DNS 서버에 쿼리를 날리고 해당 서버에서 요청된 파일을 찾는 작업을 하게 된다(사실 동일한 페이지에 있는 링크라면 이럴 필요가 없는데도!). 

반면 상대 URL 사용시 브라우저는 같은 서버에서 해당 URL을 탐색하기만 하면 되기 때문에 성능이 좋아진다. 절대 URL을 사용하면 브라우저가 추가 작업을 해야 하기 때문에 성능이 떨어진다.

# 4. 부가기능

## 4.1. title

title 속성을 넣어서 마우스 호버 시 나오는 링크 제목을 지정할 수 있다.

```html
<a href="https://www.google.com" title="구글로 이동">구글</a>
```

단 title에 지정된 정보가 정말로 중요하다면 해당 정보를 링크 태그의 컨텐츠에 넣어 주어야 한다. 이렇게 지정한 `title`은 키보드로만 페이지를 탐색하면 접근할 수 없기 때문이다.

## 4.2. 가짜 버튼

권장되는 방식은 아니지만 a 태그를 버튼처럼 사용할 수도 있다. 어차피 role을 무시하고 사용하는 시점에서 굳이 할 필요 없을 수도 있지만, `role="button"`을 지정해 주어야 한다.

href를 `javascript:void(0)`으로 지정하면 클릭 시 아무런 일도 일어나지 않는다. 그리고 여기 click 이벤트 핸들러를 등록하면 버튼이 된다.

```html
<a href="javascript:void(0)" role="button">구글</a>
```

하지만 당연하게도 링크의 복사/드래그, 링크를 열 때, 스크립트 오류가 발생했을 때 등의 상황에 예측되지 않는 동작을 발생시킬 수 있고 접근성도 떨어진다. `button` 태그를 사용하는 게 올바른 선택이다.

## 4.3. URL 표시 위치

`target="_blank"`를 설정하면 링크의 목적지가 새로운 브라우징 맥락에서 표시되는 건 유명하다. 여기서 발생하는 [보안 문제도 있다.](https://witch.work/posts/misc/security-of-link-tag)

아무튼 target 속성을 이용해서 링크한 URL을 표시할 위치를 지정할 수 있다.

기본값은 `_self`이며 현재 브라우징 맥락에 링크 목적지를 표시하는 것이. 그리고 앞서 말한 `_blank`는 새 브라우징 맥락에 링크 목적지를 표시한다.

`_parent`는 URL을 현재 브라우징 맥락의 부모에 표시한다. 부모가 없을 시 `_self`와 같이 동작.

`_top`은 URL을 최상위 브라우징 맥락에 표시한다. 부모가 없을 시 `_self`와 같이 동작.

# 참고

https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks#%EC%9D%B4%EB%A9%94%EC%9D%BC_%EB%A7%81%ED%81%AC

https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks

https://developer.mozilla.org/ko/docs/Web/HTML/Element/a#%EC%A0%88%EB%8C%80_url%EB%A1%9C_%EC%97%B0%EA%B2%B0
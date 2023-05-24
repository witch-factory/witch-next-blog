---
title: 프론트 지식 익히기 CSS-7
date: "2023-04-16T00:00:00Z"
description: "MDN CSS 튜토리얼 - 7"
tags: ["web", "study", "front", "css"]
---

MDN CSS 튜토리얼의 텍스트 스타일링을 마무리한다.

# 1. 링크 스타일링

잘 몰랐던 것만 간단히 정리하자.

## 1.1. 링크의 상태

링크는 다음과 같은 상태들을 가지는데 이는 의사 클래스(`:hover`와 같은) 선택자를 통해 스타일링 가능하다.

`:link`는 방문하지 않은 링크를 의미한다. 반면 방문한 링크는 `:visited`로 나타난다. `:hover`는 마우스를 올렸을 때의 상태를 의미하며, `:active`는 링크를 클릭했을 때의 상태를 의미한다. 

tab 키나 focus 함수를 통해 링크에 포커스가 갔을 때의 상태는 `:focus`로 나타난다.

이런 상태들의 스타일링 순서는 일반적으로 다음과 같다.

```css
a{}

a:link{}

a:visited{}

a:focus{}

a:hover{}

a:active{}
```

이런 순서를 따르는 것은 겹치는 상태가 있기 때문이다. 당연히 `a{}`의 스타일은 나머지 모든 선택자에도 적용될 것이다. 그리고 active상태인 링크는 만약 사용자가 마우스를 사용해 링크를 클릭했다면 hover 상태이기도 할 것이다.

이런 식으로 중첩되는 상태들이 있기 때문에 위 순서를 지켜 스타일링하는 것이 좋다.

## 1.2. 외부 링크 선택

링크를 걸 때 외부 링크를 걸 수도 있고 내부 링크를 걸 수도 있다. 예를 들어서 `href="#id`와 같이 링크를 걸면 해당 페이지에서 해당 id를 가진 요소로 이동한다. 혹은 `href="/login"`과 같이 상대 경로를 사용할 수도 있다. 

그런데 외부 페이지로 가는 링크에만 특별한 스타일을 적용하고 싶을 수 있다. 그러면 만약 링크를 제대로 사용하고 있다면, 외부 링크는 `http`로 시작할 것이다.

따라서 `a[href^="http"]`와 같은 선택자를 사용하면 외부 링크를 선택할 수 있다. 이는 `href` 속성이 `http`로 시작하는 모든 링크를 선택한다.

# 2. 웹 폰트

CSS에서는 웹에 있는 폰트를 다운로드받아 사용하는 게 가능하다. 페이지에 접근할 때 해당 폰트를 다운로드 받아 사용할 수 있도록 하는 것이다.

CSS의 시작 부분에 `@font-face`를 사용하면 된다. 이는 폰트를 다운로드 받을 때 사용할 이름을 지정해주는 것이다.

```css
@font-face {
  font-family: "MyWebFont";
  src: url("fonts/myfont.woff") format("woff"),
       url("fonts/myfont.woff2") format("woff2");
}
```

대부분의 브라우저는 `woff`와 `woff2`를 지원한다. 이는 웹 폰트를 압축한 파일 형식이다. MDN에서는 [Font squirrel](https://www.fontsquirrel.com/)에서 다운받기를 추천하고 있다. 

나같은 경우 따로 폰트를 다운받기 싫어서 특별한 폰트를 쓸 때는 google-font에서 온라인 다운로드를 받는 방법을 많이 썼었다.

그 다음부터 `font-family` 속성을 사용해 다운받은 웹 폰트를 사용할 수 있다.

## 2.1. font-face 잘 사용하기

`@font-face`는 다음과 같은 양식으로 작성한다.

```css
@font-face {
  font-family: "MyWebFont";
  src: url("fonts/myfont.woff2") format("woff2"),
        url("fonts/myfont.woff") format("woff");
  font-weight: bold;
  font-style: italic;
}
```

`font-family`는 폰트를 다운로드 받을 때 사용할 이름을 지정해주는 것이다. 이는 나중에 `font-family` 속성을 사용할 때 사용할 이름이다. 사실 이거 말고 나머지 속성이 더 중요하다.

src에는 위에서 보다시피 쉼표로 구분해서 여러 폰트를 넣어 줄 수 있다. 그리고 format도 전달해 줄 수 있는데 이는 필수는 아니다. 하지만 브라우저가 해당 폰트를 사용할 수 있는 것인지 판단하는 데에 도움을 줄 수 있으므로 넣어주는 게 좋다.

또한 브라우저는 src에 선언된 폰트를 순서대로 하나씩 시험해 보면서 가장 먼저 사용할 수 있는 것을 사용하므로, `woff2` 포맷 폰트와 같이 먼저 사용하고 싶은 폰트를 먼저 넣어주자.

`font-weight`와 `font-style`은 폰트의 굵기와 기울기를 지정해주는 것이다. 물론 다른 속성을 가진 폰트마다 따로 폰트 이름을 지정할 수 있다. `myFont-bold` 나 `myFont-italic`과 같이 말이다.

하지만 이렇게 `@font-face`에서 weight, style을 지정해 주면 다른 스타일의 폰트를 같은 이름으로 지정해서 다운로드받더라도 `font-weight`와 `font-style`을 사용해 원하는 스타일의 폰트를 사용할 수 있다. 아래 [참고에 있는 링크](#참고) 에서 더 자세히 설명되어 있다.

# 참고

https://www.456bereastreet.com/archive/201012/font-face_tip_define_font-weight_and_font-style_to_keep_your_css_simple/
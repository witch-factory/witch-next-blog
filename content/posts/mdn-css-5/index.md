---
title: 프론트 지식 익히기 CSS-5
date: "2023-04-13T00:00:00Z"
description: "MDN CSS 튜토리얼 - 4"
tags: ["web", "study", "front", "CSS"]
---

# 1. CSS 구성

CSS를 쉽게 관리할 수 있게 하는 방법들을 알아본다.

## 1.1. 코딩 스타일 가이드라인

다른 사람들과 함께 작업하는 경우 프로젝트의 스타일 가이드라인을 정하고 일관성있게 따라야 한다. class의 이름 지정 규칙이나 색상을 표현하는 방법, 형식 등을 정하고 이를 모두가 따라야 한다.

예를 들어서 [MDN 코드 예제들의 CSS가이드라인](https://developer.mozilla.org/ko/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/CSS)이 있다.

이런 가이드라인을 정할 때 한 줄에 하나의 규칙만 넣는 등, 가독성을 고려한 선택을 하는 것이 좋다.

## 1.2. 주석 남기기

CSS에도 설명을 위한 주석을 남기는 게 좋다. 특히 주석을 남겨야 할 부분은 특정한 이유로 인해 직관적이지 않은 CSS를 작성했을 때이다. 예를 들어 오래된 브라우저에서 지원하지 않는 특성을 사용했을 때 그 대체 속성을 적어둘 수 있는데 이런 경우 왜 대체 속성이 있는지 주석을 남기는 것이 좋다.

```css
.container{
  /* linear gradient를 지원하지 않는 브라우저의 경우 대비 */
  background-color: purple;
  background-image: linear-gradient(to right, #ff0000, #aa0000);
}
```

## 1.3. 스타일시트에 논리적인 구획 만들기

CSS에는 여러 가지 규칙들이 있는데 이들을 역할에 따라 분류하고 다른 구역에 위치시키는 건 가독성을 높인다.

첫번째로 공통 스타일을 적는 것이 좋다. 흔히 reset CSS라고 불리는 기본 스타일을 지정해 놓는 것이다. `p`, `h1`, `ul`, `ol`등의 태그 스타일을 보통 정의한다.

두번째로는 유틸리티 클래스들을 지정한다. 많은 컴포넌트에서 공통으로 사용될 스타일들을 지정하는 것이다.

세번째로는 사이트에서 전체적으로 사용되는 것들의 스타일을 지정한다. 페이지 레이아웃이라거나, 네비게이션 바 같은 것들이다.

마지막으로는 특정한 컴포넌트의 스타일을 지정한다. 특정 페이지에서만 사용되는 컴포넌트 등이다. 이것은 가장 마지막에 작성하는 것이 좋다.

구역의 구분은 주석으로 한다.

## 1.4. 너무 specific하지 않은 셀렉터 쓰기

너무 specific한 셀렉터를 쓰게 되면 다른 컴포넌트에 그 스타일을 적용할 때 번거로워질 수 있다. 예를 들어서 다음과 같은 클래스를 쓰는 것이다.

```css
section.container p.title{
  color: red;
}
```

이렇게 하면 container 클래스를 가진 section 컴포넌트의 후손 중 title 클래스를 가진 p 태그에만 적용된다. 이렇게 specific한 셀렉터를 쓰면 이 스타일을 다른 데에 적용하는 것이 거의 불가능하기 때문에, 이 스타일을 또 쓰고 싶다면 새로운 셀렉터를 정의해야 할 것이다.

따라서 새로운 클래스를 만들어 주는 게 낫다.

```css
.title-box{
  color: red;
}
```

## 1.5. OOCSS

OOCSS는 Object Oriented CSS의 약자로, CSS를 객체지향적으로 작성하는 방법이다. 이는 CSS를 재사용 가능한 객체들로 분리한다는 발상에 기반을 둔다. 

만약 이런 방식을 사용하지 않는다면 우리는 약간 다른 스타일을 가진 컴포넌트를 만들 때마다 새로운 클래스를 만들어야 한다. 이는 코드의 중복을 증가시키고 유지보수를 어렵게 만든다.

그러면 어떻게 재사용할 것인가? OOCSS에서는 역할과 디자인을 분리한다. 예를 들어서 버튼을 만든다고 하자. 그러면 `.button` 클래스에는 버튼에 대한 디자인을 지정한다. 

하지만 이는 버튼의 역할을 위한 클래스이기 때문에 여기에 그라데이션 배경 등을 지정하면 안 된다. 배경을 위한 디자인 클래스를 따로 만든 뒤에 `.button` 클래스에 덧붙여서 사용해야 한다.

또한 컨테이너와 콘텐츠를 CSS에서 분리해야 한다. 컴포넌트의 위치에 따라서 콘텐츠의 스타일이 달라지는 건 OOCSS에서 권장되지 않는다.

예를 들어서 다음과 같이 하면 안된다. li의 위치에 따라 `.list-item` 클래스의 스타일이 달라지기 때문이다.

```css
ul li.list-item{
  color: red;
}
```

## 1.6. BEM

BEM은 Block, Element, Modifier의 약자로, CSS를 작성할 때 클래스 이름을 지을 때 사용하는 방법이다. 이 방법을 사용하면 CSS를 작성할 때 클래스 이름을 지을 때 일관성을 유지할 수 있다.

Block은 독립적으로 존재할 수 있는 컴포넌트를 의미한다. 버튼이나 메뉴, 로고 등이다. 그리고 Element는 Block의 일부분을 이루는 요소를 의미한다. 예를 들어서 버튼의 텍스트나 목록의 아이템(`<li>`와 같은)과 같은 것이다.

Modifier는 Block이나 Element의 상태를 나타낸다. 예를 들어서 버튼이 활성화되었는지, 비활성화되었는지, 또는 버튼의 크기가 큰지 작은지 등이다.

BEM에서는 클래스 이름을 다음과 같이 지어야 한다.

```css
.block__element--modifier{
  // CSS 속성
}
```

이런 `_`, `-`의 많은 사용을 보면 BEM 방법론을 사용한 줄 바로 알 수 있다.

이외에도 Atomic CSS등 여러 방법론이 있다.

# 2. 사용자 지정 CSS 속성

CSS에서도 재사용 가능한 변수를 만들 수 있다. 사용자 지정 속성이라고도 한다. 이런 변수는 `--`로 시작하는 전용 표기법을 사용해서 정의하며 `var()`함수를 통해 접근할 수 있다. 유효한 CSS 값이라면 뭐든 넣을 수 있다.

이때 변수도 일반적인 CSS 속성 정의와 같이 셀렉터 내에서 정의된다.

```css
selector{
  --main-color: #eebefa;
}
```

문서 트리의 루트 요소를 선택하는 `:root`셀렉터를 사용해서 전역으로 사용하는 패턴이 흔하다. 물론 특정 컴포넌트 내에서만 사용하고 싶은 변수의 경우 해당 컴포넌트의 최상위 요소에 정의하면 된다.

```css
:root{
  --main-color: #eebefa;
}
```

이를 가져올 땐 `var()`함수를 사용한다.

```css
p{
  color: var(--main-color);
}
```

## 2.1. 변수의 상속

이러한 변수는 부모 요소로부터 상속되기도 한다. 즉 특정 요소에 변수를 정의하지 않았다면 그 요소의 부모 요소에서 변수를 찾는다.

```css
.parent{
  --bg-color: #eebefa;
}

.child{
  background: var(--bg-color);
}
```

위와 같이 CSS를 정의하고 `.child` 요소를 렌더링하면 `.child` 요소의 배경색은 `#eebefa`가 된다.

```html
<div class="parent">
  부모 요소
  <div class="child">자식 요소</div>
</div>
```

참고로 이들은 진짜 변수가 아니라 필요할 때만 계산되는 속성이다. 즉 이 요소를 따로 검색하거나 할 수는 없다.

## 2.2. 대체 속성값

주어진 변수가 아직 정의되지 않았거나 유효하지 않을 때 대체 속성값을 `var()`를 이용해 지정할 수 있다.

```css
p{
  color: var(--main-color, #99e9f2);
}
```

위와 같이 하면 `--main-color`가 정의되어 있지 않거나 유효하지 않을 때 `#99e9f2`가 적용된다.

## 2.3. 변수 값의 유효성

CSS의 변수 값을 계산할 때 브라우저는 이 값들이 어디서 사용될지 모른다. 따라서 거의 모든 값을 유효하게 간주한다. 만약 이런 유효하지 않은 값이 들어가게 되면 브라우저는 우선적으로 부모에게 상속된 값을 사용하고 그런 값이 없을 경우 기본값을 사용한다.

```css
:root{
  --primary-color: 16px;
}

p{
  color: var(--primary-color);
}
```

이 경우 브라우저는 `var(--primary-color)`를 16px로 대체하지만 이는 유효한 값이 아니다. 따라서 p태그에는 기본값인 검은색이 사용된다.

다음과 같이 대체 값을 사용해도 마찬가지이다. 브라우저가 `var(--primary-color)`라는 변수를 찾을 수 있고 유효하지 않은 값이라도 채워넣을 수 있기 때문이다.

```css
p{
  color: var(--primary-color, #66d9e8);
}
```

즉 위와 같이 해도 대체 속성이 쓰이지는 않는다. p는 기본값인 검은색이 적용된다.

# 3. 글자 박스 만들어보기

MDN에서 제공하는 흔한 예제를 한번 따라해 보도록 하겠다. 대강 HTML로 div 박스 하나를 만들자.

```html
<!DOCTYPE html>
<html lang="ko-KR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>박스 만들기</title>
    <link href="index.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <div>
      <p>뭔가 보여드리겠습니다</p>
    </div>
  </body>
</html>
```

이제 index.css를 작성해 보자.

박스에 적절한 크기를 만들어 주고 배경색을 넣어서 박스 영역을 식별할 수 있도록 하자. 또한 글자를 가운데 정렬하고 박스도 페이지의 가운데 오도록 하자.

```css
.box{
  width:200px;
  height:200px;
  background-color:var(--bg-color);
  text-align:center;
  margin:0 auto;
}
```

폰트 크기도 조절하고 색도 넣어주자. 그림자를 넣는 text-shadow 속성도 넣었다.

```css
.text-content{
  font-size:1rem;
  color:var(--text-color);
  text-shadow: 1px 1px 2px black;
}
```

아직 박스에 디자인할 게 남았다. 따라서 클래스를 새로 만들어서 디자인을 적용해보자. 모서리를 둥글게 하고 테두리를 넣고, 그라데이션을 적용했으며 박스에 그림자가 지게 만들었다.

```css
.box-layout{
  width:200px;
  height:200px;
  text-align:center;
  margin:0 auto;
}

.box-design{
  background-color:var(--bg-color);
  border-radius:10px;
  border:3px solid var(--text-color);
  background-image: linear-gradient(135deg, rgba(0,0,0,0), rgba(0,0,0,0.2) 30%);
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}
```

이제 html에 클래스를 적용하고 렌더링해보자.

```html
<div class="box-layout box-design">
  <p class="text-content">뭔가 보여드리겠습니다</p>
</div>
```

![cool-box](./cool-box.png)

디자인은 정말 별로지만 어쨌든 박스가 완성되었다..

# 참고

https://clubmate.fi/oocss-acss-bem-smacss-what-are-they-what-should-i-use
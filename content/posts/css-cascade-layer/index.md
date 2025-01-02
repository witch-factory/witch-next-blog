---
title: CSS의 캐스케이드 레이어에 관하여
date: "2023-03-31T01:00:00Z"
description: "CSS의 캐스케이드 레이어 관리하기"
tags: ["web", "study", "front", "CSS"]
---

여러 사람이 협업하여 CSS를 작성하다 보면 여러 CSS가 섞이게 된다. 하지만 이 모든 CSS 선언은 author style sheet origin에 속하게 된다. 따라서 CSS의 cascade에서 class, id 등 셀렉터의 구체성을 고려하여 작성해야 한다.

하지만 어떤 사람은 class로 셀렉터를 구분할 수도 있고 어떤 사람은 id를 쓸 수도 있다. 이런 게 섞이다 보면 충돌은 금방 일어나고, 이런 걸 빨리 고치기 위해서 `!important` 태그를 쓰거나 그렇지 않더라도 조율에 많은 비용을 쓰게 된다.

cascade layer를 사용하면 이런 문제를 해결할 수 있다. cascade 레이어는 cascade 알고리즘에 하나의 단계를 더 만듦으로써 각 스타일시트에 우선순위를 부여할 수 있게 한다. 이에 대해서 알아보자.

먼저 앞서 언급된 cascade 알고리즘부터 짚고 넘어가자.

# 1. CSS cascade 알고리즘이란?

CSS는 Cascading Style Sheets의 약자이다. 여기서 Cascading이란 브라우저가 요소에 적용할 하나의 스타일을 결정하는 알고리즘이다. 같은 요소를 선택하는 선택자는 여러 개가 있을 수 있는데 이 중 어떤 선택자의 스타일을 적용할지에 관한 문제를 해결하는 것이다.

그럼 이 cascade는 어떻게 작동할까?

## 1.1. cascade의 재료

cascade에는 속성-값의 쌍인 CSS 선언만이 쓰인다. `@font-face`와 같은 at-rule들은 cascade에 영향을 주지 않는다.

# 2. cascade 알고리즘의 고려 요소

cascade 알고리즘은 다음과 같은 조건들을 고려한다. 가장 우선적으로 고려되는 조건부터 나열하였다.

## 2.1. 유래와 importance

importance는 CSS 선언에 `!important`를 붙여서 선언했는지를 뜻한다. `!important`를 붙이면 cascade 알고리즘에서 우선순위가 가장 높아진다. 이를 붙이는 게 권장되는 건 아니라서 꼭 필요할 때만 붙여야 하지만.

그럼 유래라는 것은 뭘까? cascade 알고리즘에서 고려하는 CSS 선언은 3곳에서 유래될 수 있는데 이 유래가 어느 곳인지에 따라 우선순위가 달라진다.

### 2.1.1. User agent style sheet

브라우저는 모든 요소에 대해 기본 스타일을 제공한다. 예를 들어서 `<h1>` 요소는 기본적으로 `font-size: 2em`을 가지고 있다.

몇몇 브라우저는 스타일시트를 직접 사용하기도 하고 이런 기본 스타일링을 코드로 만들어내기도 하지만 최종 결과는 같다.

이렇게 브라우저가 제공하는 기본 스타일을 User agent style sheet라고 한다.

### 2.1.2. Author style sheet

author style sheet는 페이지의 개발자가 직접 작성한 스타일이다. HTML 문서에 선언(link나 style 태그를 통해)된 CSS 스타일로써 프론트엔드 개발자가 직접 작성한 스타일을 author style sheet라고 한다.

### 2.1.3. User style sheet

브라우저의 사용자가 정의한 스타일이다. 예를 들어서 사용자가 브라우저의 설정에서 폰트 크기를 변경하면 이런 스타일이 적용된다. 브라우저의 스타일을 덮어쓰고 싶은 사용자가 작성해서 적용한 스타일을 뜻한다.

### 2.1.4. 우선순위 결정

유래와 importance를 고려하여 cascade 알고리즘은 다음과 같은 우선순위를 가진다. 가장 우선순위가 높은 것부터 낮은 것 순으로 나열하였다.

1. User-Agent && !important
2. User && !important
3. Author && !important
4. CSS 애니메이션, @keyframes (예외적인 경우로, author style sheet에 속하지만 브라우저는 일반적인 author style sheet보다 애니메이션을 더 우선적으로 처리한다)
5. Author
6. User
7. User-Agent

## 2.2. 셀렉터의 구체성(specifity)

개발자는 선언의 유래를 바꿀 수도 없고 `!important`를 붙이는 것도 그렇게 권장되지 않는다. 따라서 개발자가 cascade를 고려할 때는 대부분 이 부분에서 고려한다.

셀렉터는 더 구체적일수록 더 우선적으로 고려되어 스타일이 적용된다. 이 순서는 이런 식이다.

```
인라인 스타일 > id 셀렉터> 클래스/어트리뷰트/가상 셀렉터 > 태그/가상 요소 셀렉터 > 전체 셀렉터 > 상위 요소에 의해 상속된 속성
```

만약 CSS 선언에서 같은 우선순위 선택자가 있다면, 셀렉터 숫자까지 고려된다. 만약 다음과 같이 쓴다면 두 선언은 모두 id 셀렉터를 가지고 있으므로 우선순위가 같지만, id 셀렉터의 개수가 더 많은 선언이 더 우선순위가 높아서 title 아이디를 갖는 태그는 보라색이 된다.

```css
#title#title {
  color: purple;
}

#title {
  color: red;
}
```

그리고 이는 높은 우선순위를 갖는 셀렉터의 숫자가 같을 때도 마찬가지다. 같은 요소를 가리키는 셀렉터 2개가 하나는 `#title.myclass1` 이고 하나는 `#title2.myclass1.myclass2`라면 클래스 셀렉터 숫자가 더 많은 후자를 우선한다.

## 2.3. 선언 순서

간단하다. 나중에 선언된 스타일이 더 우선순위가 높다.

이는 link 태그를 통해 css 파일을 로드할 때도 적용된다. 나중에 쓰인 link 태그가 로드하는 css 파일이 더 우선적으로 적용된다.

## 2.4. 기본/상속 속성

요소에 해당하는 CSS 선언이 없을 경우에 영향을 미친다. color 등의 속성들은 부모 요소에서 기본적으로 상속되기 때문이다. 그리고 상속되지 않는 속성들에 대해서는 보통 기본값이 있다. 이를테면 `background-color`는 기본값이 `transparent`이다.

# 3. cascade layer 이론

cascade 알고리즘에서 사실 고려하는 게 하나 더 있다. 바로 cascade layer이다. importance와 origin을 고려한 후, 셀렉터의 구체성을 고려하기 전에 cascade layer를 고려한다.

즉 cascade 알고리즘은 다음과 같은 순서로 CSS 선언들을 고려하는 것이다.

1. 유래와 importance
2. cascade layer
3. 셀렉터의 구체성
4. 선언 순서
5. 기본/상속 속성

## 3.1. cascade layer의 우선순위

cascade layer는 모든 유래로부터 온 CSS 선언들에 대해 sub-origin 레벨을 만들어서 우선순위를 정할 수 있게 한다. 각 origin 레벨에 대해서 여러 개의 cascade layer가 있을 수 있고 이 레이어들간의 순서는 만들어진 순서에 따라 결정된다.

normal origin 즉 !important가 없는 유래를 가진 CSS 선언들에 대해서, layer들은 선언된 순서대로의 우선순위를 갖는다. 즉 가장 나중에 선언된 레이어의 CSS 선언이 가장 우선적으로 고려된다. 또한 레이어가 없는 스타일이 레이어가 있는 스타일보다 우선적으로 고려된다.

importance origin을 가진 CSS 선언들에서도 가장 처음 선언된 레이어의 CSS 선언이 가장 우선적으로 고려되는 것은 같다. 하지만 이때는 레이어가 있는 스타일이 레이어가 없는 스타일보다 더 우선적으로 고려된다.

## 3.2. 중첩 레이어

중첩 레이어 또한 만들 수 있는데 이는 특정 조건 하에서 다른 스타일링을 하고 싶을 때 유용하다. 예를 들어서 미디어 쿼리를 적용한다고 하자. 그러면 components 레이어를 만든 후, 그 내부에 화면 너비에 따라 달라질 스타일링을 넣은 여러 레이어를 만들고 그 레이어들을 조건에 따라 보여주거나 숨기면 된다.

그리고 이렇게 중첩 레이어를 만들면 레이어의 이름 충돌에 관한 우려도 없어진다.

# 4. cascade layer 문법

## 4.1. cascade layer 만들기

cascade layer는 다음과 같이 만들 수 있다.

```css
// 1. components 레이어 선언
@layer components;
// 2. components 레이어에 속한 스타일링과 함께 선언
@layer components {
  .button {
    color: red;
  }
}
// style.css 파일을 components 레이어로 만들기
@import url(style.css) layer(components);
```

위에 있는 3가지 방법들은 만약 해당 이름의 레이어가 아직 없다면 새로운 레이어를 만들고, 만약 해당 이름의 레이어가 이미 있다면 그 레이어에 속한 스타일링을 추가한다.

그리고 이런 레이어 선언에 레이어 이름이 없다면 새로운 익명의 레이어가 만들어진다.

그럼 레이어 생성 방법들을 좀 더 알아보자.

## 4.2. @layer로 이름 가진 레이어 생성하기

다음과 같이 하면 theme, layout, utilities 레이어가 만들어진다. 만약 해당 이름의 레이어가 없다는 가정 하에서 그렇다. 그리고 각 레이어의 우선순위는 선언된 순서를 따른다. 이 말은 나중에 선언된 레이어가 더 우선적이라는 것이다. 

```css
// theme < layout < utilities 순으로 우선순위
@layer theme, layout, utilities;
```

이런 선언은 cascade layer를 정의하고 우선순위를 정할 때 쓰인다. 또한 CSS 파일의 첫 줄에 레이어 선언을 해놔서 우선순위를 제어하는 것도 좋다. 한번 그렇게 정해진 우선순위는 바뀌지 않기 때문이다.

```css
// 이렇게 하면 style2가 더 나중에 선언된 레이어이므로 우선적으로 고려되어 h1 태그는 파란색으로 표시되게 된다.
@layer style1 {
  h1 {
    color: red;
  }
}

@layer style2 {
  h1 {
    color: blue;
  }
}
```

또한 앞서 이야기한 것처럼 레이어에 들어 있지 않은 스타일이 더 우선적으로 고려된다. 이는 레이어에 있지 않은 스타일이 어디 위치해 있는지와는 상관없다.

```css
// unlayered h1 태그가 더 먼저 선언되었지만 레이어에 속한 스타일보다 우선적으로 고려되어 h1 태그는 보라색으로 표시된다.
h1 {
  color: purple;
}

@layer style1 {
  h1 {
    color: red;
  }
}
```

또한 위에서 본 것과 같이 `@layer` 선언 이후에 레이어 식별자와 스타일 블록이 따라오면 해당 식별자 이름을 가진 레이어가 만들어지고 그 블록의 스타일이 레이어에 추가된다. 

만약 식별자 없이 스타일 블록만 따라오면 해당 스타일 블록의 익명 레이어가 만들어진다. 당연히 익명 레이어에도 우선순위가 있고 이는 선언 순서를 따른다.

```css
// layout 레이어를 만들고 스타일을 지정한다. layout 레이어가 이미 있다면 그 레이어에 스타일을 추가한다.
@layer layout{
  .container {
    width: 100%;
  }
}
```

익명 레이어에 스타일을 연속해서 지정하면 하나의 익명 레이어에 스타일이 계속 추가되는 게 아니라 서로 다른 익명 레이어가 계속 생기는 것에 주의하자.

## 4.3. @import로 레이어 가져오기

`@import`는 사용자가 다른 스타일시트를 가져올 때 사용할 수 있다. 이렇게 스타일시트를 가져올 때 `@import`는 어떤 CSS 스타일이나 `<style>` 블럭 이전에 위치해야 한다.

하지만 `@layer`를 이용해서 레이어를 선언하는 것은 `@import` 블록 앞에 위치해도 상관없다. 단 이렇게 레이어를 생성할 때 스타일을 지정하는 것은 안 된다.

아무튼 이 import를 사용해서, 이름이 있는 레이어에 스타일시트를 추가할 수 있다. 중첩 스타일시트에도 가능하다.

```css
@import url("style.css") layer(layer1);
```

중첩 레이어에도 스타일을 추가할 수 있다. 다음 코드는 style.css의 스타일시트를 layer1 레이어 내부에 있는 layer2 레이어에 추가한다.

```css
@import url("style.css") layer(layer1.layer2);
```

하나의 레이어에 여러 CSS 파일 추가도 가능하다.

```css
@import url("style1.css") layer(layer1);
@import url("style2.css") layer(layer1);
```

미디어 쿼리나 피쳐 쿼리를 사용해서 조건부로 레이어를 가져올 수도 있다.

```css
@import url("style.css") layer(layer1) (width<30rem);
```

이렇게 `@import`를 써서 스타일시트를 레이어에 넣는 건 스타일시트에 @layer를 직접 선언하는 것을 할 수 없을 때 해야 한다.

## 4.4. 미디어 쿼리와 레이어

미디어 쿼리나 피쳐 쿼리(`@supports`)를 사용해서 레이어를 만들 수 있다. 이렇게 하면 미디어 쿼리가 만족될 때만 해당 레이어가 만들어진다.

다음과 같이 하면 미디어 쿼리(화면 너비 최소 600px)가 만족될 때만 desktop 레이어가 만들어진다.

```css
@media (min-width: 600px) {
  @layer desktop {
    .button {
      color: red;
    }
  }
}
```

## 4.5. 중첩 레이어

중첩 레이어를 사용하면 레이어 이름의 충돌에 대한 걱정 없이 레이어를 계층적으로 구성할 수 있다.

중첩 레이어를 선언하는 방법은 그냥 다른 레이어의 블록 내에 `@layer`를 선언하는 것이다.

```css
@layer base {
  @layer components {
    .button {
      color: red;
    }
  }
}
```

또는 `@import`를 사용할 수도 있다.

```css
@import url("style.css") layer(base.components);
```

이러면 base 레이어 내에 components 레이어가 만들어지고 style.css에 선언된 레이어가 있다면 base.components 레이어에 추가된다.

물론 중첩 레이어에 스타일을 추가할 수도 있는데 다음과 같이 하면 된다.

```css
@layer base.components{
  .my-button {
    color: purple;
  }
}
```

# 5. 레이어 우선순위, 다시

레이어들의 우선순위는 다음과 같이 정해진다. 우선순위가 높은, 즉 스타일에서 가장 먼저 고려되는 것부터 나열한다.

1. 트랜지션 스타일(transition-xxx)
2. 인라인 && !important
3. 레이어가 있는 스타일 && !important
4. 레이어에 속해 있지 않은 스타일 && !important
5. 애니메이션 스타일(animation-xxx)
6. 인라인 스타일
7. 레이어에 속해 있지 않은 스타일
8. 레이어에 속해 있는 스타일

같은 우선순위를 가진 스타일이 있다면, important가 아닌 normal style에서는 나중에 선언된 스타일이 더 우선적으로 적용된다. 

하지만 important 스타일에서는 먼저 선언된 스타일이 더 우선적으로 적용된다. 많은 것에서 normal 스타일과 important 스타일이 반대된다는 것을 기억하자.

그리고 트랜지션 스타일은 모든 스타일보다 우선하지만 트랜지션이 일어날 동안만 적용되므로 일시적이다.

따라서 인라인이면서 important인 스타일은 일시적인 스타일 외에는 더 우선인 스타일이 없으므로, 오버라이드할 수 없다. 따라서 주의해서 써야 한다.

## 5.1. 중첩 레이어의 우선순위

중첩 레이어의 경우에도 이러한 우선순위가 똑같이 적용된다.

normal 스타일의 경우 non-nested 스타일이 더 우선적으로 고려된다. important 스타일의 경우에는 반대다. 그리고 선언 순서에 따른 우선순위도 반대다.

```css
@layer base {
  .button {
    color: red;
    font-size: 1rem !important;
  }
}

@layer base.components {
  .button {
    color: blue;
    font-size: 2rem !important;
  }
}

@layer base.utilities {
  .button {
    color: green;
    font-size: 3rem !important;
  }
}
```

normal style의 경우 unnested layer가 더 우선적으로 고려되므로 button 클래스의 color는 red가 된다.

반면 important 스타일의 경우 nested layer가 우선적으로 고려된다. 그런데 여기서 nested layer의 font-size의 important 스타일은 2개 있다. base.components의 것과 base.utilities의 것이다. 

important 스타일의 경우에는 선언 순서가 먼저인 게 더 우선적으로 고려된다. 따라서 base.components의 font-size가 우선적으로 적용된다. 즉 font-size는 2rem이 된다.


# 참고

https://developer.mozilla.org/ko/docs/Web/CSS/Cascade

CSS cascade에 관하여 https://blog.logrocket.com/how-css-works-understanding-the-cascade-d181cd89a4d8/

https://wit.nts-corp.com/2022/05/24/6528
---
title: JS 탐구생활 - JS에서 DOM 속성 접근하기
date: "2022-05-20T00:00:00Z"
description: "JS에서 DOM 속성으로 할 수 있는 일"
tags: ["javascript"]
---

# 1. DOM 객체 프로퍼티

브라우저에서 대부분의 HTML들에게 주어진 HTML 속성(어트리뷰트)는 그로 인해 만들어지는 DOM 객체의 프로퍼티가 된다. 예를 들어서 다음과 같은 경우를 생각해 볼 수 있다.

```html
<h1 id="greeting" style="color:blue">안녕하세요. 저는 마녀입니다.</h1>

<script>
  let greet=document.getElementById('greeting');
  console.log(greet.style.color)
  console.log(greeting.style.color) //id와 같은 이름으로 선언된 전역 변수로 엘리먼트에 접근하는 방식
</script>
```

h1에 style 속성을 주었고, 위 코드를 실행시켜 보면 그 속성 중 하나인 color에 접근하여 blue가 로그에 찍히는 것을 볼 수 있다.

이런 DOM 객체 프로퍼티는 사용자가 원하는 대로 만들 수도 있다. 그냥 DOM 객체에 추가하기만 하면 된다.

```html
<h1 id="greeting" style="color:blue">안녕하세요. 저는 마녀입니다.</h1>

<script>
  let greet=document.getElementById('greeting');
  greet.data='이름';
  greet.sayTagName = function() {
    console.log(this.tagName);
  };
  console.log(greet.data)
  greet.sayTagName();
</script>
```

greet DOM 객체에 추가한 데이터와 함수가 잘 작동함을 위 코드를 실행시켜 보면 확인할 수 있다.

# 2. 속성과 프로퍼티

HTML 태그를 통해 엘리먼트를 생성할 때 주어진 속성이 만약 명세서에 있는 표준 속성일 경우, HTML 태그에 주어진 속성은 자동으로 그로 인해 생성된 DOM 객체의 프로퍼티가 된다. 위에서 `greet.style.color` 가 `h1` 태그의 속성으로 주어졌지만 `greet` DOM 객체의 프로퍼티로도 들어가 있는 것이 단적인 예시이다.

그러나 이렇게 HTML을 파싱해서 DOM 객체를 만들 때 그 HTML의 표준 속성이 아닌 속성이 있다면 그 속성은 DOM 객체의 프로퍼티로 들어가지 않는다. 다음과 같이, h1 태그에 test라는 속성을 주고 거기에 접근을 시도한다. 그러면 test는 h1 태그의 표준 속성이 아니므로 제대로 접근이 안 되는 것을 볼 수 있다. test 속성이 DOM 객체의 프로퍼티로 들어가지 않았기 때문이다.

```html
<h1 id="greeting" style="color:blue" test="test-property">
  안녕하세요. 저는 마녀입니다.
</h1>

<script>
  let greet=document.getElementById('greeting');
  console.log(greet.test) //undefined가 출력된다
</script>
```

이런 비표준 속성은 `getAttribute` 라는 메서드를 통해 접근할 수 있다. 이때 HTML 속성의 값은 항상 문자열이며 대소문자를 구분하지 않음에 주의한다. 그리고 속성의 값은 모두 문자열로 변환된다.

```html
<h1 id="greeting" style="color:blue" test="test-property">
  안녕하세요. 저는 마녀입니다.
</h1>

<script>
  let greet=document.getElementById('greeting');
  console.log(greet.getAttribute('test')) //test-property가 출력된다
  console.log(greet.getAttribute('tEsT')) //HTML 속성은 대소문자를 구분하지 않으므로 이렇게 접근하는 것도 가능하다
</script>
```

`getAttribute`외에도 엘리먼트에 적용할 수 있는 `setAttribute`, `hasAttribute`,  `removeAttribute` 메서드도 있다. 이 메서드들을 통해 HTML에서 지정한 비표준 속성도 DOM 객체에서 조작할 수 있다.

# 3. 비표준 속성의 사용

그런데 이런 비표준 속성이 어디에 사용될까? 우리는 대부분 표준 속성만을 사용해 HTML을 작성하는데 말이다.

비표준 속성들은 사용자가 직접 지정한 데이터를 HTML에서 JS로 넘기고 싶은 경우나, JS로 조작할 HTML 요소를 표시하는 데에 사용할 수 있다. 

다음 코드는 `info`속성을 가진 객체들을 모두 순회하면서 그 객체의 `info` 속성에 해당하는 값을 그 객체의 innerHTML로 넣어주는 코드이다. HTML 태그에 비표준 속성인 `info`를 넣어 놓고 JS로 조작하는 것이다.

```html
<div info="name"></div>
<div info="likes"></div>

<script>
  let myInfo={
    name:'김성현',
    likes:'커피'
  };

  for(let div of document.querySelectorAll('[info]')){
    let field=div.getAttribute('info');
    div.innerHTML=myInfo[field];
  }
</script>
```

이렇게 비표준 속성들을 사용해서 객체들을 조작하게 되면, 클래스 등을 이용해서 조작하는 것에 비해서 더 쉽게 변경할 수 있는 객체를 얻을 수 있게 된다고 한다.

그런데 `info` 같은 속성은 꽤 일반적인 이름이다. 충분히 어떤 태그의 표준 속성으로 들어갈 수도 있다. 그 외에도, 비표준인 속성을 이용하는 코드를 작성했는데 그 속성이 표준으로 들어가는 경우는 있을 수 있다. 이런 경우를 방지하기 위해서 JS에서는 특정 접두사의 속성을 개발자가 용도에 맞게 사용할 수 있도록 예약해 놓았다. 이게 바로 `data-*` 속성이다. 

이렇게 작성한 `data-`속성은 DOM 객체에서 dataset 프로퍼티를 사용하면 접근 가능하다. `data-` 로 시작하는 속성을 케밥케이스로 작성하면 카멜케이스로 변환되어 모두 DOM 객체의 dataset 프로퍼티에 저장된다.

```html
<h1 id='test' data-test-text="test">테스트를 위한 텍스트</h1>

<script>
  let t=document.getElementById('test')
  console.log(t.dataset.testText)
</script>
```

이때 `data-test-text` 속성이 `testText` 프로퍼티가 된 것에 주의한다. `data-` 접두사는 빠지고, 표기가 카멜 표기법으로 바뀌었다.

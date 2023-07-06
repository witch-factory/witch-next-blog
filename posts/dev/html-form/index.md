---
title: HTML의 폼 양식 만들기
date: "2023-07-01T00:00:00Z"
description: "HTML만으로도 제출 양식을 만들 수 있다"
tags: ["html"]
---

# 1. 시작

HTML 폼은 사용자가 웹사이트와 상호작용할 수 있는 많은 기능을 제공한다. 회원가입이나 로그인 등에 필요한 get, post 요청도 날릴 수 있다. 하지만 그렇게 주목받지 못하고 있다. 솔직히 나도 몇 번 써본 적이 없다.

![html-form](./login-with-html.png)

따라서 [MDN의 HTML 폼 가이드](https://developer.mozilla.org/ko/docs/Learn/Forms)와 그간 주워들은 몇 가지를 정리하는 시간을 가지고자 한다. 만약 이 글을 읽게 되는 사람이 있다면 기본적인 HTML 지식과 약간의 개발 경험이 있다고 간주한다.

# 2. 간단한 서버 열기

`express-server`라는 폴더를 만들고 내부에서 `npm init`

그리고 express와 body-parser를 설치한다.

```bash
npm install express --save
npm install body-parser
```

폴더 내부의 `index.js` 파일을 다음과 같이 작성한다.

```js
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/', (req, res) => {
  console.log(req.body);
  res.send('Got a POST request');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

이제 `node index.js`를 실행하면 `localhost:8080`으로 서버에 접속할 수 있다. 그리고 `localhost:8080`에서는 get, post 요청을 처리할 수 있게 될 것이다.

# 3. HTML 폼 기본

다음과 같이 `localhost:8080`으로 post 요청을 보내는 폼을 만들어보자. 간단한 로그인 폼이다.

```html
<form action="http://localhost:8080/" method="post">
  <label for="userid">아이디</label>
  <input type="text" id="userid" name="userid" placeholder="id" />
  <label for="userpw">비밀번호</label>
  <input type="password" id="userpw" name="userpw" placeholder="pw" />
  <button type="submit">로그인</button>
</form>
```

form의 action 속성은 데이터를 보낼 URL을, method 속성은 어떤 HTTP 메서드를 사용할지를 지정하는 데 쓰인다.

이 폼을 만들고 제출하게 되면 `localhost:8080`에서는 다음과 같은 로그가 출력될 것이다.

```bash
{ userid: '입력한 id', userpw: '입력한 비밀번호' }
```

input에 지정한 name은 서버에서 받을 때 사용할 key가 된 것을 알 수 있다.

# 4. 폼 태그 탐구

사용자 폼을 만들기 위한 태그들은 꽤 많고, form 태그를 써본 적 없는 사람이라도 한번쯤은 써봤을 많은 유명한 태그들이 있다. 

예를 들어서 `<input>`이나 `<button>`과 같은 태그들은 [사실 폼 관련 태그로 분류된다.](https://developer.mozilla.org/ko/docs/Web/HTML/Element#%EC%96%91%EC%8B%9D) 이들은 모두 form 태그 바깥에서도 사용할 수 있기 때문에 다른 곳에서도 쓰이는 경우가 많다. 그 경우 해당 요소들은 폼과 관련이 없으며 JS로 관련 동작을 정의해 주게 된다.

하지만 우린 지금 폼에 대해서 알아보고 있으므로, 이 요소들을 폼과 관련해서 하나씩 알아보도록 하자.

## 4.1. form

form 태그는 폼을 정의하는 태그이다. HTML로 폼을 정의할 때는 언제나 이 요소로 시작해야 한다. 단 form을 다른 form 태그로 둘러싸는 것은 제한되어 있으며 그렇게 할 경우 예측할 수 없는 방식으로 작동할 수 있다.

[가질 수 있는 속성](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form#%ED%8A%B9%EC%84%B1)들은 다음과 같다.

- `accept-charset`: 폼을 서버로 제출할 때 사용할 문자 인코딩을 지정한다. 기본값은 `unknown`이다.
- `action`: 폼을 통해서 서버로 정보를 전송할 때 사용할 URL을 지정한다.
- `autocomplete(기본값은 on)`: 브라우저가 form 항목을 사용자의 과거 입력값에 기반하여 채워넣을 수 있는지. 기본값은 on
- `enctype`: 폼을 전송할 때 사용할 콘텐츠 MIME 타입을 지정한다. 기본값은 `application/x-www-form-urlencoded`
- `method`: 폼을 전송할 때 사용할 HTTP 메서드를 지정한다. 기본값은 get
- `name`: 폼의 이름을 지정한다. 반드시 문서 폼 가운데 고유해야 한다.
- `novalidate`: 폼을 서버로 제출할 때 유효성 검사를 하지 않도록 지정한다. 기본값은 false
- `target`: 폼 요청 전송 후 응답을 어떻게 받을지를 지정한다. 기본값은 `_self`

### 4.1.1. enctype

이 속성 중 `enctype`은 폼 데이터를 어떻게 인코딩해서 폼을 제출할지를 결정한다.

[UTF-8 유니코드로 문자를 인코딩하는 encodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)를 사용하는 `application/x-www-form-urlencoded`가 기본값이다.

`multipart/form-data`는 FormData API를 사용해서 폼을 제출하며 Ajax로 전송된다. 폼을 이용할 때는 반드시 이 enctype을 사용해야 한다.

`text/plain`은 폼을 제출할 때 폼 데이터를 인코딩하지 않고 일반 텍스트로 전송한다. HTML5에서 디버깅 용도로 추가되었으며 실제로 디버깅 용도로 대부분 사용된다.

## 4.2. fieldset, legend

`<fieldset>`은 같은 목적을 가진 폼 요소들을 묶을 때 사용된다. `<legend>`는 부모 `<fieldset>`의 요소를 설명하는 데에 쓰인다.

대부분의 스크린 리더들 또한 이를 인식하여 fieldset 내용을 읽기 전 legend를 읽어준다.

위의 로그인 폼을 이 요소들을 사용해서 보강해 보자.

```html
<form action="http://localhost:8080/" method="post">
  <fieldset>
    <legend>로그인</legend>
    <label for="userid">아이디</label>
    <input type="text" id="userid" name="userid" placeholder="id" />
    <label for="userpw">비밀번호</label>
    <input type="password" id="userpw" name="userpw" placeholder="pw" />
    <button type="submit">로그인</button>
  </fieldset>
</form>
```

이렇게 하면 fieldset과 legend가 묶인 폼이 만들어진다. 아무 CSS를 넣지 않았지만 누가 보아도 묶인 form이라는 것을 알 수 있다.

![fieldset-legend](./fieldset-legend.png)

fieldset 요소에 disabled 속성을 지정할 경우 일반적으로 회색으로 표시되며, 자손 컨트롤을 비활성화한다. 또한 모든 브라우저 이벤트를 받지 않게 된다. 예외적으로 `<legend>`안의 폼은 비활성화되지 않는다.

그리고 fieldset은 블록 레벨 요소이고, legend도  블록 레벨 요소이다.

이때 [엣지, 크롬 브라우저에선 현재 fieldset 내부에서 flex, grid 디스플레이를 사용할 수 없는 버그가 존재한다.](https://github.com/w3c/csswg-drafts/issues/321)

## 4.3. label

label로 폼 내 UI의 설명을 나타낼 수 있다. `for`속성으로 지정한 id의 UI와 묶여진다. 

이렇게 UI를 연관시키면 사용자가 label을 누를 시 해당하는 UI가 활성화되고 click 이벤트도 동작한다. 체크박스나 라디오버튼을 쓸 때 특히 유용하다.

물론 label로 해당 UI를 둘러싸는 방식으로 둘을 연관시킬 수도 있다. 

하지만 이런 방식으로 label과 UI를 연관시킬 경우 몇 가지 종류의 보조 기술이 `label`과 해당 UI의 관계를 이해하지 못할 수 있어 `for` 속성으로 id를 지정하는 게 좋다. 위의 로그인 폼에서도 `for`속성을 사용하였다.

접근성을 고려할 때 label 내부에 button 같은 인터랙티브 요소를 배치하지 않는 게 좋다.

label은 인라인 요소이다.

여러 개의 라벨을 하나의 요소에 연결하는 건 좋지 않으며 그럴 경우 label 내부에 `span` 태그를 넣어서 해결하자. 또한 특별히 읽어져야 하는 요소가 있다면 `aria-label` 속성을 사용한다.

```html
<label for="username">Name: <span aria-label="required">*</span></label>
<input id="username" type="text" name="username" required />
```

## 4.4. output

사용자의 입력을 받아서 계산 출력을 보여주는 데 사용된다. `for` 속성으로 다른 요소의 id를 지정하여 어떤 요소의 출력인지를 지정할 수 있다.

예를 들어서 사용자가 입력한 ID를 위의 로그인 폼에서 실시간으로 보여주고 싶다면 다음과 같이 한다.

```html
<form 
  action="http://localhost:8080/" 
  method="post" 
  id="loginForm"
  oninput="result.value='사용자가 입력한 ID '+userid.value"
>
  <fieldset form="loginForm">
    <legend>로그인</legend>
    <label for="userid">아이디</label>
    <input type="text" id="userid" name="userid" placeholder="id" />
    <label for="userpw">비밀번호</label>
    <input type="password" id="userpw" name="userpw" placeholder="pw" />
    <output name="result" for="loginForm">사용자가 입력한 ID </output>
  </fieldset>
  <button type="submit" form="loginForm">로그인</button>
</form>
```

사용자의 ID 인풋 값만 보여주면 되니까 input에 for를 지정해도 된다.

```html
<form 
  action="http://localhost:8080/" 
  method="post" 
  id="loginForm"
  oninput="result.value=userid.value"
>
  <fieldset form="loginForm">
    <legend>로그인</legend>
    <label for="userid">아이디</label>
    <input type="text" id="userid" name="userid" placeholder="id" />
    <label for="userpw">비밀번호</label>
    <input type="password" id="userpw" name="userpw" placeholder="pw" />
    <output name="result" for="userid"></output>
  </fieldset>
  <button type="submit" form="loginForm">로그인</button>
</form>
```

## 4.5. input

사용자의 데이터를 받을 수 있는 요소를 생성한다. `type` 속성으로 어떤 종류의 데이터를 받을지를 지정할 수 있고 이외에도 다양한 특성을 가지고 있다.

너무 길어져서 글을 분리하였다.



## 4.6. textarea

여러 줄의 일반 텍스트를 입력할 수 있는 컨트롤을 생성한다. 

`cols`와 `rows` 속성으로 컨트롤의 크기를 지정할 수 있고 `wrap` 속성으로 줄바꿈 방식을 지정할 수 있다. 

textarea 사이에 텍스트를 넣으면 콘텐츠의 기본값이 된다.

`minlength`와 `maxlength` 속성으로 입력할 수 있는 문자의 최소, 최대 길이를 지정할 수 있다.

## 4.5. 구조화

`ul`이나 `ol` 태그 내부의 `li` 요소들을 통해서 폼 요소들을 감싸거나, `p`, `div`요소들도 흔한 래퍼로 쓰인다. 여러 개의 체크박스나 라디오버튼을 묶을 때도 목록 요소들이 흔히 사용된다.

그리고 fieldset 내부에 복잡한 양식이 있을 때는 section 요소로 요소들을 분류하고 제목 태그를 다는 것도 흔하다.


# 5. 폼 밖에서 폼 연관시키기

HTML을 하다 보면 `<button>`과 같은 요소들을 폼과 관련 없는 부분에서도 사용할 때가 많다. 그러면 이들을 폼과 연관시키기 위해서는 어떤 방법이 필요할까?

폼 내부에 버튼을 포함시키면 된다. 하지만 그럴 수 없다면? 그럴 때 `form` 속성이 등장한다.

`form` 속성은 폼과 연관시킬 수 있는 요소들에 사용할 수 있다. 이 속성은 폼의 id를 가리키는데, 이를 통해서 폼과 연관시킬 수 있다. 가령 button 요소를 form 안에 넣지 않고 폼과 연관시켜 보겠다.

```html
<form action="http://localhost:8080/" method="post" id="loginForm">
  <fieldset>
    <legend>로그인</legend>
    <label for="userid">아이디</label>
    <input type="text" id="userid" name="userid" placeholder="id" />
    <label for="userpw">비밀번호</label>
    <input type="password" id="userpw" name="userpw" placeholder="pw" />
  </fieldset>
</form>
<button type="submit" form="loginForm">로그인</button>
```

이는 form 바깥에 있는 fieldset 요소를 폼에 포함해야 할 때도 사용할 수 있다. fieldset 요소에 연결할 form 요소 id를 `form` 속성에 지정하면 된다.

`<label>` 요소도 form 속성을 통해서 외부에 있는 폼과 연관시킬 수 있다. 이렇게 하면 `label`이 폼 요소 내부에 있지 않아도 어디에서나 폼과 연관시킬 수 있다.




# 참고

HTML 참고서, 양식 부분 https://developer.mozilla.org/ko/docs/Web/HTML/Element#%EC%96%91%EC%8B%9D

HTML 폼 가이드 https://developer.mozilla.org/ko/docs/Learn/Forms

express 공식 문서 https://expressjs.com/ko/starter/hello-world.html

express와 body-parser https://expressjs.com/en/resources/middleware/body-parser.html

https://tech.devsisters.com/posts/functional-react-state-management/

https://dev.to/dailydevtips1/submit-button-outside-the-form-2m6f
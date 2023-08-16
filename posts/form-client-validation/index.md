---
title: 클라이언트 form 데이터 검증
date: "2023-08-16T01:00:00Z"
description: "폼의 데이터 검증을 어떻게 처리해야 잘 처리했다고 소문이 날까"
tags: ["HTML"]
---

# 1. 폼의 데이터 검증

프론트 개발을 하다 보면 폼을 통해서 사용자에게 값을 입력받고 서버로 전송해야 할 때가 많다. 하지만 단순히 입력한다고 전부가 아니다. 대부분의 폼에는 입력에 대한 제한이 있다. 예를 들어서 ID가 10자 이하여야 한다거나 전화번호 입력창에는 전화번호 형식을 맞춰서 입력해야 하는 등이다.

이는 서버에서 해당 데이터를 전송받은 후 따로 검증을 거칠 수도 있다. 전화번호라고 온 데이터의 형식이 맞는지를 서버에서 검증한 후 아니라면 아니라는 응답을 보내는 식이다.

하지만 이는 서버에 부담도 될 뿐더러 실시간으로 입력값을 검증하기 어렵다(가능하더라도 부하가 많아진다). 그래서 많은 경우 클라이언트 쪽에서도 입력값에 대한 검증을 하는 경우가 많다.

물론 정말 마음먹은 해커에게는 이것이 전혀 문제가 되지 않는다. postman 등을 통해서 직접 서버로 데이터를 보내면 되기 때문이다. 하지만 실시간 값 검증이나 서버의 부하를 줄인다는 점에서 클라이언트 사이드 유효성 검사는 애용되고 있다.

이렇게 많이 쓰이니 방법도 많다. 따라서 유효성 검사를 수행하는 여러 가지 방법을 모아 소개한다. 글의 코드들은 react를 사용해서 작성하였다.

# 2. HTML을 이용

HTML의 양식 요소, 특히 `<input>`태그는 기본적으로 유효성 검사 기능을 제공한다. `required`정도는 꽤나 자주 보인다. 하지만 이외에도 길이나 형식 등을 검사할 수 있다. JS 없이도 양식 제출과 검증까지도 해낼 수 있다!

![JS 없이도 양식 제출 가능](./login-with-html.png)

HTML의 유효성 검사 기능만을 이용해서 로그인 폼을 만든다고 해보자.

## 2.1. 로그인 폼

사실 이건 react의 기능을 특별히 쓸 것도 없는 HTML 구조이다.

```tsx
// src/App.tsx
function App() {
  return (
    <main>
      <form>
        <fieldset className="login-form">
          <legend>로그인</legend>
          <div>
            <label htmlFor="id">아이디</label>
            <input type="text" id="id" name="id" />
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input type="password" id="password" name="password" />
          </div>
          <button type="submit">로그인</button>
        </fieldset>
      </form>
    </main>
  );
}

export default App;
```

`login-form` 클래스는 그냥 입력창을 세로로 배열하고 너비에 약간 제한을 두기 위한 것이다. 디자인이 중요한 건 아니므로 넘어가자.

```css
// src/index.css
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width:10rem;
}
```

## 2.2. 기본적인 유효성 검사

HTML `<input>`태그에서 제공하는 유효성 검사에 관한 속성들은 다음과 같다. 

- `minlength`, `maxlength`: 입력할 수 있는 최소/최대 글자 수를 지정한다.
- `min`, `max`: 어떤 값을 갖는 input에서 입력할 수 있는 최소/최대 숫자를 지정한다.
- `spellcheck`: 브라우저가 맞춤법 검사를 지원할 경우 입력한 텍스트의 맞춤법을 검사하도록 할 수 있다. 단 브라우저가 이를 지원하지 않을 수 있다.
- `pattern`: 유효성 검사를 위한 정규식을 지정한다. 특정 규칙을 만족하는 텍스트만 입력 가능하도록 할 수 있다.
- `required`: 폼 제출시 이 input의 값을 필수로 만들어서 이 input이 비어있으면 폼 제출이 되지 않도록 할 수 있다.
- `type`: input의 타입을 지정한다. `number`, `email`, `tel` 등을 지정하면 input의 값에 대한 유효성 검사가 자동으로 진행된다.

이를 이용해서 아이디와 비밀번호를 필수 입력으로 지정하고 아이디를 이메일 형식으로 입력하도록 하고, 아이디에 대해서 이메일 형식 검증이 이루어지도록 할 수 있다. 다음과 같이 말이다.

```tsx
function App() {
  return (
    <main>
      <form>
        <fieldset className="login-form">
          <legend>로그인</legend>
          <div>
            <label htmlFor="id">아이디</label>
            <input 
              type="email" 
              id="id" 
              name="id" 
              placeholder="이메일 형식으로 입력해주세요."
              minLength={5}
              maxLength={30}
              required
            />
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              minLength={5}
              maxLength={20}
              required
            />
          </div>
          <button type="submit">로그인</button>
        </fieldset>
      </form>
    </main>
  );
}
```

이렇게 하면 예를 들어서 아이디를 양식에 맞지 않게 입력하거나 충분한 길이로 입력하지 않으면 경고창이 뜨는 등 제출시에 검증이 이루어진다.

![HTML을 이용한 이메일 형식 검증 결과](./email-html-validation.png)

그리고 `<input>`태그는 정규식을 사용해서도 검증할 수 있다. `pattern` 속성에 사용하고 싶은 정규식을 넣으면 된다. 예를 들어서 미국의 전화번호 형식을 검증하고 싶다면 다음과 같이 할 수 있다. [여기 쓰인 정규식은 여러 정규식 예시를 제공하는 사이트](https://regexlib.com/)에서 가져왔다.

```html
<input 
  type="text" 
  id="id" 
  name="id" 
  placeholder="이메일 형식으로 입력해주세요."
  pattern="^[2-9]\d{2}-\d{3}-\d{4}$"
  required
/>
```

만약 해당 input의 값이 정규식을 만족하지 않는 상태로 폼을 제출하게 되면 `요청한 형식과 일치시키세요.`라는 경고창이 뜨면서 제출이 되지 않게 된다.





https://tech.osci.kr/introduce-react-hook-form/

https://tech.devsisters.com/posts/functional-react-state-management/

https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-FormData-%EC%A0%95%EB%A6%AC-fetch-api

https://jeonghwan-kim.github.io/dev/2020/06/08/html5-form-validation.html
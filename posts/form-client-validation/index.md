---
title: 클라이언트 form 데이터 검증
date: "2023-08-18T01:00:00Z"
description: "폼의 데이터 검증을 어떻게 처리해야 잘 처리했다고 소문이 날까"
tags: ["HTML"]
---

# 0. 시작

사용자가 작성한 값을 서버로 제출하는 페이지는 매우 흔하게 쓰인다. 그리고 이런 사용자의 입력값을 클라이언트에서 검증하는 일도 많다. `비밀번호는 8자 이상에 특수문자를 하나 이상 입력해 주세요`와 같이 입력한 내용의 형식을 지적하는 메시지를 누구나 한 번쯤 본 적이 있다.

이런 클라이언트 유효성 검사에 대해서 살펴볼 만한 건 두 가지가 있다. 첫번째는 유효성 검사 그 자체를 어떻게 만들 것인가에 대한 것이다. 그리고 두번째는 이런 유효성 검사를 거쳐야 하는 많은 입력창의 정보를 어떻게 관리할지에 대한 것이다.

당연히 이를 위한 여러 방법들이 있다. 간단한 로그인, 회원가입 폼을 이리저리 가공해 보면서 이 두 가지에 대해서 알아보자.

# 1. 클라이언트 데이터 검증

## 1.1. 개요

회원가입과 같이, 어떤 값을 입력한 후 그것을 서버에 제출해야 하는 페이지를 생각해 보자. 인터넷을 사용하는 사람이라면 그런 폼을 직접 사용해 본 적이 몇 번은 있을 것이다.

그러다 보면 흔히 이런 메시지를 보게 된다. `비밀번호는 8자 이상에 특수문자를 하나 이상 입력해 주세요`라거나 `이메일 형식에 맞게 입력해 주세요`와 같이 입력한 내용의 형식을 지적하는 메시지 말이다. 그리고 이런 메시지가 뜨면 폼 제출도 되지 않는다. 내용을 형식에 맞게 수정한 후에야 제출할 수 있다.

이런 내용 검증은 어떻게 이루어지고 있는 걸까? `onChange` 핸들러 같은 걸 이용해서 내용이 바뀔 때마다 서버에 전송하고 해당 데이터를 서버에서 검증한 결과를 따로 표시해 줄 수 있겠다. 회원가입 폼의 비밀번호라고 온 데이터의 형식이 맞는지를 서버에서 검증한 후 아니라면 아니라는 응답을 보내는 식이다.

하지만 이렇게 하면 서버에 부담이 간다. 그리고 실시간으로 검증을 하기 어렵다. 물론 디바운싱과 같은 테크닉을 이용해서 구현하지 못할 건 없다. 하지만 부하가 많아지고 코드가 복잡해진다. 그래서 많은 경우 이런 실시간 내용 검증은 클라이언트 쪽에서 입력값에 대한 검증을 하는 경우가 많다.

글의 코드들은 react를 사용해서 작성하였다.

## 1.2. 보안 관련

물론 정말 마음먹은 해커에게는 이런 클라이언트 유효성 검사가 전혀 문제가 되지 않는다. postman 등을 통해서 직접 서버로 데이터를 보내면 되기 때문이다. 따라서 이런 클라이언트단의 입력값 유효성 검사만으로 보안을 해결할 수는 없다. 서버에서도 사용자가 제출한 값에 대한 유효성 검사를 따로 해야 한다. 

하지만 이런 클라이언트 단의 입력값 검사는 서버에 부담을 주지 않고 사용자에게 피드백을 주는 데에 꽤나 효과적이기에 애용되고 있다.

# 2. HTML을 이용

간단한 로그인 폼을 만든다고 해보자. 로그인을 위한 정보 입력 시에는 일반적으로 입력값에 대한 검증이 없거나 적게 이루어지지만 예시를 위해 최대한 간단한 양식을 생각하다가 로그인 폼으로 하기로 했다.

HTML의 양식 요소, 특히 `<input>`태그는 기본적으로 유효성 검사 기능을 제공한다. `required`정도는 꽤나 자주 보인다. 하지만 이외에도 길이나 형식 등을 검사할 수 있다. JS 없이도 양식 제출과 검증까지도 해낼 수 있다!

![JS 없이도 양식 제출 가능](./login-with-html.png)

HTML의 유효성 검사 기능만을 이용해서 로그인 폼을 만든다고 해보자.

## 2.1. 로그인 폼 기본구조

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

HTML `<input>`태그에서 제공하는 유효성 검사에 관한 속성들은 다음과 같다. `<input>`태그가 깊이 궁금하다면 [해당 태그를 자세히 다룬 글을 참고하자.](https://witch.work/posts/html-input-tag)

- `minlength`, `maxlength`: 입력할 수 있는 최소/최대 글자 수를 지정한다.
- `min`, `max`: 어떤 값을 갖는 input에서 입력할 수 있는 최소/최대 숫자를 지정한다.
- `spellcheck`: 브라우저가 맞춤법 검사를 지원할 경우 입력한 텍스트의 맞춤법을 검사하도록 할 수 있다. 단 브라우저가 이를 지원하지 않을 수 있다.
- `pattern`: 유효성 검사를 위한 정규식을 지정한다. 특정 규칙을 만족하는 텍스트만 입력 가능하도록 할 수 있다.
- `required`: 폼 제출시 이 input의 값을 필수로 만들어서 이 input이 비어있으면 폼 제출이 되지 않도록 할 수 있다.
- `type`: input의 타입을 지정한다. `number`, `email`, `tel` 등을 지정하면 input의 값에 대한 유효성 검사가 자동으로 진행된다.

이를 이용해서 아이디와 비밀번호를 필수 입력으로 지정하고 아이디를 이메일 형식으로 입력하도록 하고, 아이디에 대해서 이메일 형식 검증이 이루어지도록 할 수 있다. 다음과 같이 말이다.

`type="email"`을 이용해서 이메일 형식에 대한 검증을 하도록 했고 `required`를 이용해서 필수 입력으로 지정했다. 그리고 `minlength`과 `maxlength`를 이용해서 입력값의 길이 범위를 제한했다.

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

# 3. `Constraint Validation API`

## 3.1. API 소개

지금까지 한 것만 해도 형식에 대한 어느 정도의 검증이 가능하다. 하지만 경고 메시지의 내용이나 스타일도 바꾸고, 유효성 검사를 통과하거나 통과하지 못했을 때 어떤 동작을 취하게 하고 싶을 수도 있다.그리고 실제로 그런 식으로 디자인된 페이지도 많다. 하지만 지금까지 한 내용만으로는 그것이 불가능하다.

이를 위해서는 `Constraint Validation API`를 사용해야 한다. 

이는 form 요소들에서 사용가능한 메서드와 속성들로 구성되어 유효성 검사에 실패했을 때의 메시지를 변경하거나 특정 동작을 하게 하거나, 스타일을 변경하는 데에 도움을 준다.

`Constraint Validation API`를 지원하는 DOM 요소는 다음과 같다. 즉 다음 요소들에서 유효성 검사에 관련된 `validity`같은 프로퍼티들을 사용할 수 있다.

- `<input>`(HTMLInputElement)
- `<select>`(HTMLSelectElement)
- `<button>`(HTMLButtonElement)
- `<textarea>`(HTMLTextAreaElement)
- `<fieldset>`(HTMLFieldSetElement)
- `<output>`(HTMLOutputElement)

## 3.2. 유효성 검사 메시지 내용 바꾸기

`Constraint Validation API`를 이용하면 폼의 유효성 검사에 따라서 커스텀 메시지를 보여줄 수 있다. 이는 몇 가지 장점이 있는데 첫째는 폼의 메시지를 CSS로 스타일링할 수 있다는 것이고 둘째는 폼의 메시지를 사용자에게 일관적으로 보여줄 수 있다는 것이다.

기본 유효성 검사 메시지는 브라우저마다, 국가마다 내용도 디자인도 다르다. 그런데 JS로 이런 유효성 검사 메시지를 커스텀하면 사용자에게 일관적인 내용의 유효성 관련 메시지를 보여줄 수 있다. 아무튼 이를 이용해서 커스텀 메시지를 보여줘보자.

가장 간단한 건 메시지의 내용을 바꾸는 것이다. `setCustomValidity(message)` API를 이용하면 된다. 다음과 같이 유효성 검사 객체의 결과에 따라 메시지를 설정하는 함수를 만들어서 `<input>`의 `onChange` 핸들러에 넘겨주면 된다.

```tsx
const checkValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
  const {validity}=e.target;
  if(validity.typeMismatch){
    e.target.setCustomValidity("이메일 형식 커스텀 메시지")
  }
  else if(validity.tooShort){
    e.target.setCustomValidity("최소길이 미만일 때 커스텀 메시지")
  }
  else if(validity.tooLong){
    e.target.setCustomValidity("최대길이 초과일 때 커스텀 메시지")
  }
}
```

만약 `setCustomValidity`의 인수를 빈 문자열로 전달했다면 유효한 것으로 판단된다.

## 3.3. API 속성들

더 많은 커스텀을 해보기 전에 `Constraint Validation API`는 어떤 속성들을 제공하는지 간략히 정리한다.

`willValidate`는 해당 요소가 폼 제출 시 유효성 검사가 진행되는 요소일 경우 true, 아니면 false를 반환한다. 

`validity`는 요소의 유효성 검사 결과를 담은 `ValidityState` 객체이다. `validationMessage`는 요소가 유효하지 않을 경우 그 상태를 설명하는 메시지를 반환한다. 만약 유효하거나 요소의 `willValidate`가 false라면 빈 문자열을 반환한다.

이 객체의 키들은 각각의 유효성 검사 결과에 따라서 불린값을 가진다. 가령 `pattern`유효성 검사에서 실패하면 `patternMismatch`가 true가 된다. `tooLong`, `tooShort`, `typeMismatch`, `valueMissing` 등의 객체 프로퍼티들이 더 있다.

요소의 값의 전체 유효성 검사 결과를 반환하는 `checkValidity()` 메서드와 유효성 검사 결과를 조사하기만 하는 `reportValidity()`메서드가 간간이 쓰인다. 커스텀 에러 메시지를 설정하는 `setCustomValidity(message)`메서드도 존재한다.

## 3.4. 메시지 커스텀 고급

`<form>` 요소에 `novalidate` 어트리뷰트를 주어서 기본 유효성 검사를 끈 후 아예 새로 메시지를 만들 수도 있다. 굳이 메시지가 말풍선으로 나올 필요는 없지 않은가?

먼저 에러 메시지를 표시할 `<span>`태그를 각 input 아래에 배치한다. HTML 구조만 표현해 보면 다음과 같다.

```html
<main>
  <form noValidate>
    <fieldset className='login-form'>
      <legend>로그인</legend>
      <div>
        <label htmlFor='email'>이메일</label>
        <input 
          type='email'
          id='email' 
          name='email' 
          placeholder='이메일'
          required
          minLength={5}
          maxLength={30}
        />
        <span className='error' aria-live='polite'>
          여기 이메일 입력값 검증 메시지가 들어갈 것이다.
        </span>
      </div>

      <div>
        <label htmlFor='password'>비밀번호</label>
        <input 
          type='password' 
          id='password'
          name='password'
          placeholder='비밀번호'
          required
          minLength={5}
          maxLength={20}
        />
        <span className='error' aria-live='polite'>
          여기 비밀번호 값 검증 메시지가 들어갈 것이다.
        </span>
      </div>
      <button type='submit'>로그인</button>
    </fieldset>
  </form>
</main>
```

`<form>`태그의 `novalidate` 속성을 설정한다고 해서 `<input>`태그의 유효성 검사가 사라지는 것도 아니고 `:valid`같은 CSS 의사 클래스 기능을 못 쓰게 되는 것도 아니므로 `Constraint Validation API`를 이용해서 커스텀을 진행하면 된다.

다음과 같이 에러 메시지와 유효성 여부에 따른 테두리 색상 등을 스타일링해준다.

```css
.login-form {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  gap: 1rem;
  width:15rem;
}

input{
  appearance: none;
  border: 1px solid #ccc;
  margin: 0;
  margin-bottom:0.5rem;

  box-sizing: border-box;
}

input:invalid{
  border: 1px solid red;
}

/* 입력창 포커스시 빨간 테두리가 사라지도록 */
input:focus:invalid{
  border: 1px solid #ccc;
  outline: none;
}

.error{
  display:block;
  width: 100%;
  padding:0;

  font-size:0.8rem;
  color: red;
}
```

그리고 다음과 같이 유효성 검사 여부에 따라서 에러 메시지를 바꿔주는 함수를 만들고 적용하자. 가령 이메일에 대한 유효성 검사 메시지를 만드는 함수는 이렇다.

```tsx
const [emailError, setEmailError] = useState('이메일을 입력해주세요.');

const emailValidation= (e: React.ChangeEvent<HTMLInputElement>) => {
  const {validity}=e.target;

  if (validity.typeMismatch) {
    setEmailError('이메일 형식이 아닙니다.');
  }
  else if (validity.tooShort) {
    setEmailError('이메일은 5자 이상이어야 합니다.');
  }
  else if (validity.valueMissing) {
    setEmailError('이메일을 입력해주세요.');
  }
  else {
    setEmailError('');
  }
};
```

그리고 해당 함수를 `<input>`의 `onChange` 핸들러에 넘겨주고 에러 메시지를 표시할 `<span>`태그에는 `emailError`를 넣어주면 된다.

```tsx
<input 
  type='email'
  id='email' 
  name='email' 
  placeholder='이메일'
  required
  minLength={5}
  maxLength={30}
  onChange={emailValidation}
/>
<span className='error' aria-live='polite'>
  {emailError}
</span>
```

이러면 입력창의 값이 바뀜에 따라서 커스텀한 에러 메시지가 표시된다.

![유효성 검사 실패시](./login-validation-failure.png)

단 지금 `<form>`의 `novalidate`속성을 활성화시켰으므로 이런 유효성 검사가 실패해도 제출이 가능하다. 따라서 유효성 검사 결과에 따라 제출을 막는 기능을 위해 다음과 같은 `handleSubmit`함수를 만들어서 `<form>`의 `onSubmit`핸들러에 넘겨주는 방법을 쓸 수도 있다.

```tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  /* 
  e.target.email.checkValidity(), 
  e.target.password.checkValidity()
  와 같이 validation API를 이용해서 유효성 검사를 진행할 수도 있다. 
  */
  if (emailError || passwordError) {
    alert('이메일과 패스워드를 형식에 맞게 입력해 주세요.');
    return;
  }
  // 아무튼 뭔가 제출하는 동작
  alert('로그인 성공');
};
```

## 3.5. onChange 핸들러 사용하기



# 4. 유효성 검사 래퍼

하지만 이렇게 수많은 로직을 모두 한 컴포넌트에 때려넣는 게 좋지 않다는 건 뻔하다. 만약에 이게 로그인 폼이 아니라 회원가입 폼이거나 그룹의 관리에 관련된 폼이라서 입력해야 할 창이 수십 개라면? 이런 식으로 중앙에서 에러 메시지를 모두 관리하는 방식은 전혀 좋지 않다.

따라서 이를 적당히 재사용 가능한 무언가로 만드는 방법을 생각해 볼 수 있다.

## 4.1. 컴포넌트 만들기

따라서 이를 컴포넌트로 만들어서 관리할 수 있겠다. 다음과 같이 에러 메시지와 입력의 값이 바뀔 때마다 검증을 진행하는 함수 그리고 input이 가질 유효성 검사 속성들을 넘겨주는 방식을 생각해 볼 수 있다.

```tsx
type InputProps = {
  type: string;
  title: string
  id: string;
  name: string;
  placeholder: string;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validProps: Record<string, number | boolean | string>;
};

function Input(props: InputProps) {
  const {type, id, name, placeholder, handleChange, validProps, error}=props;
  return (
    <div>
      <label htmlFor={props.id}>{props.title}</label>
      <input 
        type={type}
        id={id} 
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        {...validProps}
      />
      <span className='error' aria-live='polite'>
        {error}
      </span>
    </div>
  );
}
```

이렇게 하면 `handleChange` 내부에서 `setCustomValidity()`를 이용해서 사용자가 원하는 커스텀 유효성 검사를 진행하는 것도 쉽다.

하지만 





# 참고

https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation

constraint validation API https://web.dev/constraintvalidation/

https://tech.osci.kr/introduce-react-hook-form/

https://tech.devsisters.com/posts/functional-react-state-management/

https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-FormData-%EC%A0%95%EB%A6%AC-fetch-api

https://jeonghwan-kim.github.io/dev/2020/06/08/html5-form-validation.html

react에서 Constraint validation API 쓰기 https://omwri.medium.com/react-constraints-api-better-validations-d9adba6f6e63


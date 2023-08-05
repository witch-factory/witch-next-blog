---
title: 프로젝트 트러블 슈팅 - react-router-dom child route 만들기
date: "2022-08-19T00:00:00Z"
description: "React Router에서 nested route를 다루는 문제"
tags: ["web", "study", "front", "HTML", "react"]
---

# 1. 문제의 발생

진행하고 있는 프로젝트에서는 SPA인 리액트로 여러 페이지를 구성하기 위해 `react-router-dom`을 사용한다. 이때 비슷한 url을 가지는 여러 개의 라우트를 사용해야 하는 경우가 있다. 예를 들어서 계정에 관련된 라우트는 account로 시작하고 어떤 목적으로 쓰이는 페이지인지에 따라서 다른 URL을 가지게 할 것이다.

즉 다음과 같은 라우트들이 있는 건 자연스럽다. 로그인 라우트, 가입한 이메일을 찾는 기능을 하는 라우트, 비밀번호를 찾는 라우트가 있다.

```jsx
<Routes>
  <Route path="account/login" element={<LoginPage />} />
  <Route path="account/find/email" element={<FindEmailPage />} />
  <Route path="account/find/password" element={<FindPasswordPage />} />
</Routes>
```

그러나 분명 공통된 부분이 있는데 이 부분을 전혀 살리지 못하고 있다. 따라서 이렇게 다양한 라우트들을 묶는 방법을 정리한다.

# 2. 문제 해결의 시작 - Nested Route

먼저 예시를 위해 다음과 같은 `App.tsx` 코드를 작성하였다.

```jsx
// BrowserRouter는 index.tsx에서 처리해 주었다
import { Routes, Route } from "react-router-dom";

function MainPage() {
  return <div>메인 페이지</div>;
}

function LoginPage() {
  return <h1>로그인 페이지</h1>;
}

function FindEmailPage() {
  return <h1>이메일 찾기 페이지</h1>;
}

function FindPasswordPage() {
  return <h1>비밀번호 찾기 페이지</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account/login" element={<LoginPage />} />
      <Route path="account/find/email" element={<FindEmailPage />} />
      <Route path="account/find/password" element={<FindPasswordPage />} />
    </Routes>
  );
}

export default App;
```

이렇게 하면 `/account`를 공통으로 갖는 라우트가 메인 페이지로부터 3개 생긴다. 이를 묶는 가장 간편한 방법은 공통되는 부분을 Route로 만들어 준 후 다음 URL을 그 Route 컴포넌트로 감싸는 것이다. 위 코드에서 `App`컴포넌트를 다음과 같이 바꾸는 것이다.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account">
        <Route path="login" element={<LoginPage />} />
        <Route path="find/email" element={<FindEmailPage />} />
        <Route path="find/password" element={<FindPasswordPage />} />
      </Route>
    </Routes>
  );
}
```

좀 더 공통 부분을 묶고자 한다면 `find/` URL도 묶어서 다음과 같이 작성할 수도 있을 것이다.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account">
        <Route path="login" element={<LoginPage />} />
        <Route path="find">
          <Route path="email" element={<FindEmailPage />} />
          <Route path="password" element={<FindPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

## 2-1. 가능한 이유

이게 가능한 이유는 Route 컴포넌트의 default element가 `<Outlet />`이기 때문이다. 이 Outlet 컴포넌트는 route의 nesting이 일어날 때 자식 Route 컴포넌트를 어디에 보여줄지를 결정할 수 있도록 해준다.

만약 위에서 URL prefix가 `account`인 라우트에 모두 `Account page`라는 문구를 넣어줘야 한다면 이렇게 할 수 있다. 먼저 다음과 같은 `AccountPage`컴포넌트를 작성한다.

```jsx
function AccountPage() {
  return (
    <div>
      <h1>Account Page</h1>
      <Outlet />
    </div>
  );
}
```

이 `AccountPage`컴포넌트는 Outlet 컴포넌트 위치를 통해서 이 컴포넌트를 element로 쓰는 라우트의 자식 컴포넌트로 들어갈 Route의 element가 어디에 들어갈지 설정해 준다. `AccountPage`에서는 h1태그의 위치 아래에 위치하도록 했다.

만약 h1태그와 Outlet의 순서를 바꾸면 `Account page`문구가 위에 오게 된다.

이러한 Outlet 태그가 Route 태그의 default element이기 때문에 우리가 굳이 element를 명시해 주지 않아도 nested Route는 우리 생각대로 잘 동작한다. 만약 element가 Outlet 자체라면 부모 Route는 일치하는 자식 Route의 element를 그대로 보여주면 되기 때문이다.

# 3. 좀더 복잡한 경우의 문제 - parent route도 다룰 경우

좀 더 복잡한 문제는 parent route의 URL에도 어떤 컴포넌트가 렌더링되어야 할 경우에 생긴다. 물론 부모 route와 자식 route에 어떤 공통 요소가 있고 자식 요소는 그저 부모 route에 어떤 요소를 더한 것일 경우에는 위에서 다룬 Outlet을 적절히 사용하면 된다. 그런데 그 둘이 전혀 다른 컴포넌트를 렌더링해야 한다면?

만약 계정 찾기 페이지가 따로 있고, 여기서 이메일 찾기 페이지 혹은 비밀번호 찾기 페이지로 접근할 수 있다고 하자. 즉 이메일 찾기 페이지/비밀번호 찾기 페이지로 이동하기 전에 계정 찾기 페이지를 보여줘야 하는 것이다.

(굳이 여기서 계정 찾기 페이지를 만들 필요는 없다. 프로젝트에서는 중간 역할을 하는 페이지가 있는 게 지금 예시보다 좀 더 자연스러운 경우였다. 하지만 예시의 일관성을 위해 계정 찾기 페이지로 똑같이 예시를 든다)

그럼 `account/find` URL에서는 계정 찾기 페이지를 보여주고 `account/find/email`페이지에서는 이메일 찾기 페이지를, `account/find/password`에서는 비밀번호 찾기 페이지를 보여주면 된다.

따라서 다음과 같이 라우트를 짜면 될 거라고 생각할 수 있다.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account" element={<AccountPage />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="find" element={<FindAccountPage />}>
          <Route path="email" element={<FindEmailPage />} />
          <Route path="password" element={<FindPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

하지만 이렇게 하면 우리가 원하는 결과를 보여주지 않는다. `account/find`URL의 페이지는 `FindAccountPage`컴포넌트를 잘 보여준다. 하지만 `account/find/email`과 `account/find/password`에서는 우리가 element로 넣어준 컴포넌트가 제대로 렌더링되지 않는다.

이는 부모 컴포넌트인 `<Route path="find" />`의 element에 들어간 `FindAccountPage`컴포넌트에 그 자식 라우트의 element를 어디 보여줄지를 결정하는 `Outlet`컴포넌트가 없기 때문이다. 자식 라우트를 렌더링하는 컴포넌트가 없는데 자식 라우트가 렌더링될 리가 있겠는가?

# 3.1 해결1 - 빈 URL 자식 컴포넌트를 만들기

이는 조금만 생각하면 쉬운 해결 방식이 하나 있다. 부모 라우트에는 element로 Outlet을 전달하고(즉 element를 명시적으로 Outlet으로 넣어 주거나 넣어 주지 않아서 default element로 쓰도록 하는 것) 자식 라우트만 적절히 작성해 주면 된다.

즉 다음과 같이 App 컴포넌트를 써주면 된다.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account" element={<AccountPage />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="find" element={<Outlet />}>
          <Route path="" element={<FindAccountPage />} />
          <Route path="email" element={<FindEmailPage />} />
          <Route path="password" element={<FindPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

그러나 빈 URL을 쓰는 게 그렇게 마음에 들지 않는다. 뭔가 좀 더 부모 라우트와 연관되어 있다는 것을 명시적으로 드러낼 수 있는 방법이 있었으면 좋겠다.

# 3.2 해결2 - index 사용하기

이는 Route에 index props를 사용하여 해결할 수 있다. index props가 붙은 Route는 default child route처럼 지정되어 부모 Route URL + '/'경로에 렌더링된다. 즉 3.1에서 작성한 App 컴포넌트는 다음과 같이 다시 쓸 수 있다.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="account" element={<AccountPage />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="find" element={<Outlet />}>
          <Route index element={<FindAccountPage />} />
          <Route path="email" element={<FindEmailPage />} />
          <Route path="password" element={<FindPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

예상대로 `account/find`경로에는 `FindAccountPage`가 렌더링되고 자식 라우트의 요소들도 생각하던 대로 잘 렌더링된다. default child route라고 해서 잘못 이해할 수 있지만 index로 지정한 Route도 부모 Route URL + '/'경로 외에 다른 URL경로에는 아무것도 렌더링해주지 않는다. 예를 들어서 `account/find/123` 과 같은 경로에는 아무 Route URL도 일치하지 않으므로 그 URL에는 아무것도 없다.

만약 하나의 부모 라우트에 index로 지정된 자식 라우트가 2개 이상 있다면 먼저 나온 것을 먼저 렌더링한다.

또한 path props를 전달한 Route는 index로 지정할 수 없다. Route에 path props를 전달하는 순간 index props의 type이 false로 지정되어서 만약 path가 전달된 Route에 index props를 전달하려는 순간 에러가 뜬다(`Type 'true' is not assignable to type 'false'`). 다만 이는 type에 의한 것이니 당연히 타입스크립트 기준이다.

# 참고

리액트 라우터 공식문서의 Route 컴포넌트 https://reactrouter.com/docs/en/v6/components/route
리액트 라우터 공식문서의 Outlet 컴포넌트 https://reactrouter.com/docs/en/v6/components/outlet
스택오버플로우 질문답변 https://stackoverflow.com/questions/66266216/how-can-i-exactly-match-routes-nested-deeply-in-react-router-6

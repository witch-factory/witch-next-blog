---
title: React Testing Library와 함께 간단한 TodoList 만들어보기
date: "2023-03-07T00:00:00Z"
description: "프론트에 테스트 도입을 위한 공부, 간단한 페이지 만들기 2"
tags: ["javascript"]
---

인프런의 '따라하며 배우는 리액트 테스트'를 참고하였습니다. 페이지는 새롭게 설계하였습니다.

아주 간단한 TodoList를 만들고 테스트를 작성해 보자.

# 1. 프로젝트 생성

create-react-app으로 프로젝트를 생성한다. typescript를 사용해볼 것이다.

```bash
npx create-react-app todolist-with-test --template typescript
```

이제 필요한 라이브러리를 깔아 주자. testing library와 같은 경우 cra로 어플리케이션 생성시 기본적으로 깔려 있다. eslint만 깔아주자.

```bash
npm install eslint-plugin-testing-library eslint-plugin-jest-dom --save-dev
```

CRA로 앱을 만들 때 자동으로 설정된 eslint config가 package.json에 있다. 이를 삭제하자.

```json
// 이 부분 삭제
"eslintConfig": {
  "extends": [
    "react-app",
    "react-app/jest"
  ]
},
```

그리고 루트에 `.eslintrc.json` 파일을 만들고 다음과 같이 작성한다. react, jest, testing-library, jest-dom에 대한 eslint 설정을 해주는 것이다.

```json
{
  "plugins": ["testing-library", "jest-dom"],
  "extends": [
    "react-app",
    "react-app/jest",
    "plugin:testing-library/react",
    "plugin:jest-dom/recommended"
  ]
}
```

그리고 페이지가 약 3개가 될 것으로 예상되므로 react router를 설치한다.

```bash
npm install react-router-dom
```

이 정도로 하고 당장 todo list를 만들어보자.

# 2. TodoList 설계

설계는 단순하다. 로그인 페이지를 만들고 로그인을 하면 todo list 페이지로 넘어가는 것이다. 이때 로그인이 성공할 시 해당 유저에 대해 저장된 todolist 항목들이 불러와진다.

todo list 페이지는 todo를 추가하고 삭제할 수 있어야 한다. 

우리는 로그인 페이지, todo list 페이지, 페이지를 찾지 못했을 때 이동하는 만들 것이다.

먼저 src/pages 폴더를 만들고 LoginPage, TodoListPage, NotFoundPage폴더, 그리고 각각에 속한 index.tsx를 만들어준다.

간단하게 각 페이지에는 각 페이지의 이름을 출력하는 컴포넌트를 만들어준다.

```tsx
// src/pages/LoginPage/index.tsx
function LoginPage() {
  return <div>로그인 페이지입니다.</div>;
}

export default LoginPage;
```

```tsx
// src/pages/TodoListPage/index.tsx
function TodoListPage() {
  return <div>to do list 페이지입니다.</div>;
}

export default TodoListPage;
```

```tsx
// src/pages/NotFoundPage/index.tsx
function NotFoundPage() {
  return <div>페이지 이동을 실패했을 때 오는 페이지입니다.</div>;
}

export default NotFoundPage;
```

이제 각 페이지들을 라우터에 추가해 줄 것이다. App.tsx와 App.css 그리고 App.test.tsx는 지우고 index.tsx를 다음과 같이 수정한다. react-router는 어째 늘 문법이 조금씩 바뀌는 것 같다. 다시 공식 문서를 찾아서 그대로 했다.

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import TodoListPage from "./pages/TodoListPage";

const router = createBrowserRouter([
  { path: "/", element: <TodoListPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

# 3. TodoList 페이지

이제 볼품없게나마 todo list 페이지를 만들어보자.




# 1. Mock Service Worker

Mock Service Worker는 서버와의 통신을 모킹해주는 라이브러리다. 이를 사용하면 서버가 없어도 테스트를 할 수 있다.

이는 브라우저에 서비스 워커를 등록하여 서버에 요청을 보낼 때 외부로 나가는 요청을 가로채고, 가로챈 요청에 대한 응답을 Mock Service Worker의 클라이언트 사이드에서 만들어주는 방식으로 동작한다. 

이 응답은 핸들러에서 처리하며 이렇게 만든 응답은 브라우저로 다시 보내진다.

이때 브라우저 대신 서버를 생성한 후 Node로 서버를 직접 만들어 줄 수도 있다.

# 참고

https://www.daleseo.com/mock-service-worker/

https://tech.kakao.com/2021/09/29/mocking-fe/

https://reactrouter.com/en/main/start/tutorial
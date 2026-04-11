---
title: 메모장 만들기 프로젝트 - 4. 로그인 페이지 기본 만들기
date: "2021-09-04T00:00:00Z"
description: "웹 메모장 프로젝트, 그 삽질의 기록4"
tags: ["react", "web"]
---

# 1. 페이지 라우터 설정

로그인 페이지를 제작하기 전에 먼저 로그인 페이지가 들어갈 주소를 만들어 줘야 한다. 개별 페이지에서 조건부 렌더링을 해 주는 게 아니고 회원가입 페이지 - 로그인 페이지 - 메모장 페이지 이 3개를 각각 다른 주소에서 라우팅되도록 하려고 하므로 이는 필수적이다. 

먼저 로그인 페이지를 라우팅해줄 주소에 들어갈 페이지를 간단하게 만들자. client/src 폴더에 `login.js` 를 생성하자.

```jsx
//src/login.js
import React from 'react';

const Login = () => (
  <h1>로그인 페이지입니다</h1>
);

export default Login;

```

그리고 client/src/App.js의 라우팅 경로에 `/login` 을 추가해 준다. 하는 김에 아까 `Note` 컴포넌트를 홈 페이지에서 뜨도록 한 것도 `/memo` 경로에서 뜨도록 바꿔 주자.

```jsx
//App 컴포넌트
function App() {
  return (
    <>
      <NoteGlobalStyle />
      <Route path="/memo" component={Note} exact />
      <Route path="/login" component={Login} exact />
    </>
  );
}
```

참고로 Route 컴포넌트의 exact 옵션은 '정확히' 그 경로일 때만 우리가 지정한 컴포넌트를 보여주게 하는 옵션이다. 그렇지 않으면 그걸 포함하는 모든 경로에서 저 컴포넌트를 띄워 준다. 가령 `"/"` 경로에 지정한 컴포넌트가 있다면 `/login` 경로에서도 뜬다. `/login`은 `/` 를 포함하기 때문이다.

이 상태로 `yarn start` 를 실행하면 `http://localhost:3000/memo` 에서 `Note` 컴포넌트에 만들어 둔 메모장이, 또 `http://localhost:3000/login` 에서는 `Login` 컴포넌트에 넣어 둔 간단한 텍스트가 뜨게 된다. 이제 우리가 할 것은 `Login` 컴포넌트에 실제 로그인 페이지 레이아웃이 들어가도록 하는 것이다.

# 2. 로그인 페이지 컴포넌트 작업

## 2.0 컨테이너 사용하기

로그인 페이지 작업을 시작하기 전에 먼저 아까 만든 컨테이너들을 재사용할 수 있도록 따로 파일로 분리하자. `src/container.js` 를 생성한다. 그리고 아까 만들었던 컨테이너들을 이곳으로 옮겨 주자.

```jsx
//container.js
import styled from 'styled-components';

const FlexContainer = styled.div`
  display:flex;
`;

const ColumnContainer = styled(FlexContainer)`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  flex-direction: column;
`;

const RowContainer = styled(FlexContainer)`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  flex-direction: row;
`;

export { FlexContainer, ColumnContainer, RowContainer };

```

물론 note.js에서는 `ColumnContainer, RowContainer` 를 import 해줘야 한다.

## 2.1 아이디/비밀번호 창 넣기

로그인 페이지에는 사실 대단한 무언가가 없다. 아이디와 비밀번호를 입력할 창 2개와 제출 버튼만 있으면 사실 더 필요한 것은 없다. 따라서 일단 가장 필수적인 입력창과 제출 버튼부터 만들자. 그 다음에 조금 꾸며 볼 것이다.

input tag를 조금 고쳐서 기본적인 input보다 좀 큼지막한 입력창을 만들자. 알아보기 쉬우라고 매우 크게 만들었다. 추후 조금 조정될 수도 있다.

```jsx
const UserInput = styled.input`
  width:20rem;
  height:3rem;
  margin:5px;
  font-size: 1.5rem;
`;
```


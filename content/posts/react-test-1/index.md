---
title: React Testing - Jest 1
date: "2023-02-04T03:00:00Z"
description: "프론트에 테스트 도입을 위한 공부, 기초"
tags: ["javascript"]
---

테스트를 위해 공부한 내용을 간략히 정리하는 목적이다.

# 1. React Testing Library

CRA로 프로젝트를 생성하면 기본적으로 RTL이 설치되어 있다. 이는 DOM Testing Library를 기반으로 리액트를 위한 API를 붙여서 만들어졌다. 

리액트 컴포넌트를 테스트하는 목적으로, 행위 주도 테스트 방법론을 사용한다. 즉 값의 교환에 초점을 맞추는 것이 아니라 어떤 행위로 인해 화면이 변경되는 부분에 초점을 맞춘다.

# 2. 웹페이지 빌드 과정

브라우저는 HTML 문서를 읽고 스타일(CSS)을 입히고 뷰포트에 표시한다. 이때 HTML을 DOM으로, CSS를 CSSOM으로 변환한 후 브라우저가 둘을 합쳐 렌더 트리를 만든다. 이는 추후 다른 글에서 더 자세히 다룰 것이다.

이때 DOM 트리는 HTML 파일을 파싱하고 HTML 표준에 맞게 토큰을 만든 후 트리 구조로 구축한다. 이렇게 브라우저가 HTML 파일을 구조화해서 표현한 것을 DOM이라고 한다. 

React 테스트를 할 때는 이런 DOM의 노드를 잡아서 테스트하게 된다.

# 3. 테스트 시작하기

CRA를 사용해서 프로젝트를 생성하자. 앱 이름은 적당히 지었다.

```
npx create-react-app react-test-app --template typescript
```

## 3.1. Jest

React Testing Library를 통해서 DOM을 렌더링하고 그 DOM을 Jest를 이용해 테스트하게 될 것이다.

CRA로 앱을 만들면 Jest도 미리 설치되어 있다. 이 jest는 `[파일이름].test.js`나 `[파일이름].spec.js`로 끝나는 파일을 찾아서 테스트를 실행한다. 또한 tests라는 이름의 폴더 안에 있는 파일들도 테스트 파일로 인식한다.

이 Jest의 구조는 describe와 it으로 구성된다. describe는 테스트를 그룹화하고, it은 각 테스트의 내용을 정의한다. it는 test로 쓸 수도 있다.

```js
// describe(name, function) 형식
describe('테스트 그룹 이름', () => {
  // it(name, function, [timeout]) 형식
  it('테스트 이름', () => {
    // 테스트 내용
  });
});
```

테스트는 기본적으로 expect, matcher로 이루어진다. expect는 테스트 대상을 정의하고, matcher는 테스트 대상의 상태를 검증한다. 

예를 들어서 `expect(sum(1,3)).toBe(2)`는 sum(1,3)이 2가 되는지를 검사한다. `expect(somthing).not.toBe(a)`처럼 not을 붙여 쓸 수도 있다.

## 3.2. React Testing Library

이제 드디어 RTL을 써보자. CRA로 앱을 만들었을 경우 `npm test`로 테스트를 실행시킬 수 있다. 이때 `App.test.tsx` 파일이 실행된다.

이 파일은 다음과 같은 구조이다.

```js
test('renders learn react link', () => {
  render(<App />);
  // learn react라는 텍스트를 가진 링크 요소를 가져온다
  const linkElement = screen.getByText(/learn react/i);
  // 가져온 링크 요소가 DOM에 존재하는지 확인하는 toBeInTheDocument() matcher를 사용
  expect(linkElement).toBeInTheDocument();
});
```

render는 인자로 받은 컴포넌트를 DOM에 렌더링해주는 함수다. 위의 경우 App 컴포넌트를 렌더링할 것이다. 그리고 RTL에서 제공하는 쿼리 함수(getByText 등)을 담고 있는 객체를 리턴한다. 물론 위와 같이 screen이라는 객체를 사용할 수도 있고 이쪽이 더 권장된다.

### 3.2.1. RTL 쿼리 함수

쿼리 함수는 테스트 라이브러리가 페이지에서 특정 요소를 찾는 데에 사용된다. getByX(), queryByX(), findByX() 등이 있다.

- getByX() : 요소를 찾으면 찾은 요소를 리턴하고, 없으면 에러를 발생시킨다. 둘 이상의 요소가 발견되어도 에러다. 만약 여러 요소가 예상될 경우 getAllByX를 쓰자.

- findByX() : 요소를 찾으면 resolve되는 Promise를 리턴하고, 해당 요소가 없거나 기본 제한시간(1초) 후에 해당 요소가 2개 이상이면 reject Promise를 리턴한다.

- queryByX() : 요소를 찾으면 찾은 요소를 리턴하고, 없으면 null을 리턴한다. getBy처럼 둘 이상의 요소가 발견되어도 에러다.

waitFor을 쓰면 일정 시간 동안 테스트 통과를 기다릴 수도 있다.

# 4. ESlint 설치

코드 작성할 때 문법 오류를 잡고 스타일을 맞추기 위해 eslint, prettier를 설치하자.

먼저 CRA로 앱을 만들 때 자동으로 설정된 eslint config가 package.json에 있다. 이를 삭제하자.

```json
// 이 부분 삭제
"eslintConfig": {
  "extends": [
    "react-app",
    "react-app/jest"
  ]
},
```

그리고 루트에 `.eslintrc.json` 파일을 만들고 testing플러그인 설치

```
npm install eslint-plugin-testing-library eslint-plugin-jest-dom --save-dev
```

플러그인 깔아 준 것에 맞게 eslintrc 변경

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

# 참고

https://www.daleseo.com/react-testing-library/

https://leehyungi0622.github.io/2021/05/05/202105/210505-React-unit-test-questions/

https://testing-library.com/docs/queries/about
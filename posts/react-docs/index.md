---
title: React 공식 문서를 읽으면서
date: "2023-07-28T00:00:00Z"
description: "개편된 React 공식 문서를 읽어보았다"
tags: ["front", "react"]
---

나는 지금은 레거시로 분류되어 있는 [react 이전 공식문서](https://ko.legacy.reactjs.org/)를 보면서 리액트를 처음 시작했었다. 아마 거기 있던 틱택토를 만들어 보는 문서부터 시작해서 조금 깔짝거리다가 [벨로퍼트의 모던 리액트](https://react.vlpt.us/)로 넘어가서 투두리스트를 만들며 개발로 넘어왔던 걸로 기억한다.

하지만 꽤 오래전 이야기이고 [지금은 리액트 공식문서가 개편되었다.](https://react.dev/) 그래서 거기의 문서들을 한번 읽어 보면서 몰랐던 부분들만 간략히 정리해본다.

HTML을 JSX로 많이 바꿔야 한다면 [온라인 컨버터를 쓸 수 있다.](https://transform.tools/html-to-jsx)

# 1. 리액트 훅

`use`로 시작하는 함수들은 리액트에서 훅이라고 불리는데 이 훅들은 컴포넌트 코드 혹은 다른 훅(아마도 커스텀 훅)의 최상위에서만 호출되어야 한다.

# 2. lifting state

여러 개의 자식 컴포넌트에서 같은 상태를 관리한다면 부모 컴포넌트에 state를 두고 props로 자식 컴포넌트에 상태를 내려 주는 게 공식 문서에서도 권장되고 있다. 이를 lifting state라고 부른다. 이렇게 하면 자식 컴포넌트들이 동기화된 상태를 쉽게 유지할 수 있다.

# 3. key props

JS의 배열 메서드인 `.map(item, index)`를 써서 배열에 들어 있는 요소들을 컴포넌트로 렌더링할 때 `key`라는 값을 넣어줘야 한다. 이는 리액트가 각 컴포넌트를 보고 무엇이 바뀌었는지를 감지하게 해줄 수 있는 고유한 컴포넌트의 아이디 같은 것이다.

리스트가 리렌더링되면 리액트는 이전의 리스트와 업데이트된 리스트의 key값을 가지고 원소들을 비교한다. 

그래서 업데이트된 리스트가 이전에 없었던 key를 가지고 있다면 해당 key를 위한 컴포넌트를 만든다. 그리고 이전에 있었던 key가 업데이트된 리스트에 없다면 해당 key를 가진 컴포넌트를 제거한다. 만약 key가 이전 리스트에도, 업데이트된 리스트에도 있다면 해당 key에 대응되는 컴포넌트를 업데이트하거나 이동시킨다.

즉 key는 리액트가 각 컴포넌트의 고유값을 알려주고 리렌더링될 때 어떤 컴포넌트가 추가되고, 제거되고, 업데이트되는지를 알려주는 역할을 한다. 

key는 그냥 props처럼 보이지만 특별하고 reserved된 속성이며 리액트는 내부적으로 key 속성을 사용해서 어떤 컴포넌트를 업데이트할지 결정한다.

따라서 동적인 리스트를 렌더링할 때 적당한 key를 할당하는 것은 매우 중요하다. 예를 들어서 배열의 인덱스를 key로 쓰는 것은 좋지 않다.(만약 key를 따로 지정하지 않으면 리액트는 에러를 발생시키며 자동적으로 배열의 인덱스를 key로 사용한다.)

key가 바뀌면 리액트가 컴포넌트를 제거하고 새로 만드는데 배열의 인덱스는 배열 편집에 따라 너무 쉽게 바뀌는 값이기 때문이다. 반면 배열 원소마다 가지고 있는 어떤 고유한 값을 key로 쓴다면 배열에서 편집된 원소에 대응되는 컴포넌트만 업데이트할 수 있다.

그리고 key는 당연히 전역적으로 유일할 필요는 없고 컴포넌트와 그 형제(sibling)들 사이에서만 유일하면 된다.

# 4. 리액트 프레임워크

create-react-app이나 vite를 통한 생성처럼 리액트 프로젝트를 간단히 시작하게 해주는 보일러플레이트도 많다. 하지만 리액트 프로젝트를 하다 보면 흔히 필요해지는 라우팅이나 데이터 페칭, HTML 생성같은 기능들을 포함한 여러 프레임워크들도 있다.

대표적으로는 이 블로그를 만든 NextJS가 있다. 그리고 비슷한 풀스택 리액트 프레임워크인 [Remix](https://remix.run/), 정적 사이트 생성기로 유명한 [Gatsby](https://www.gatsbyjs.com/), 리액트 네이티브를 지원하는 [Expo](https://expo.dev/) 등이 있다. NextJS는 Vercel, Gatsby는 Netlify에 의해서 관리된다.

## 4.1. 리액트에서 프레임워크 사용을 권장하는 이유

프레임워크 없이 리액트를 사용하는 것도 가능하다. 리액트는 원래 `render`등을 통한 점진적인 마이그레이션이 가능하다는 것이 장점인 라이브러리였다. 하지만 만약 페이지 전부를 리액트로 구축하려 한다면 프레임워크를 쓰는 것이 좋다.

개발을 하다 보면 라우팅이나 데이터 페칭, 프리로딩 등을 구현하거나 라이브러리를 통해서 환경을 구성해야 할 때가 많다. 이런 것들을 직접 구현하려면 많은 시간과 노력이 들어가고 라이브러리를 쓰려면 라이브러리를 쓰는 방법을 익혀야 한다. 또한 그렇게 스스로 환경을 구성했다 해도 다른 사람의 도움을 받기 쉽지 않다. 사람마다 구성해 본 환경이 다르기 때문이다.

하지만 프레임워크를 쓰면 이런 것들을 이미 구성해 놓았기 때문에 빠르게 개발을 시작할 수 있다. 또한 오류가 생겨도 프레임워크의 커뮤니티를 통해서 도움을 받을 수 있다.

## 4.2. 프레임워크와 리액트

리액트 팀은 몇몇 유명한 리액트 프레임워크 개발자들과 협력하고 있다. 예를 들어 [리액트 서버 컴포넌트](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)와 같은 리액트 피쳐들에 대해서 Nextjs와 같은 리액트 프레임워크 개발자들과 의견을 나누고 있다.

[nextJS 앱 라우터 공식문서](https://nextjs.org/docs)에서 이런 서버 컴포넌트를 미리 사용해볼 수 있다. 서버 컴포넌트와 Suspense 같은 것들은 리액트 피쳐지만 리액트에 바로 적용하기에는 무리가 있기 때문에 Nextjs에서 먼저 구현되었다.

## 4.3. 에디터 설정

[VSCode 설정시 도움될 만한 공식문서 일부](https://react.dev/learn/editor-setup)

# 5. 기존 프로젝트에 리액트 더하기

지금은 CRA 등의 리액트 보일러플레이트의 등장으로 모든 프로젝트를 처음부터 리액트로 짜는 것이 당연하게 여겨진다. 하지만 리액트는 원래 점진적인 마이그레이션이 가능하다는 것이 강점이었다. 당연히 기존 프로젝트에 리액트를 조금씩 더해 가는 것도 가능하다.

## 5.1. 리액트 페이지를 더하기

다른 서버 기술로 만들어진 페이지가 있다고 하자. `witch.com`이라고 하는 것이다. 그러면 먼저 리액트 프레임워크로 해당 페이지를 만든 후 프레임워크의 설정 파일에서 base path를 설정해 주면 된다.

[NextJS라면 `next.config.js`를 편집해준다.](https://nextjs.org/docs/app/api-reference/next-config-js/basePath) 다음과 같이 하면 `기존사이트URL/witch`가 리액트 페이지의 루트가 된다.

```js
module.exports = {
  basePath: '/witch',
}
```

그리고 서버에서 `/witch`로 가는 모든 요청을 리액트 페이지로 보내도록 프록시 설정을 하면 된다.

## 5.2. 기존 페이지에 리액트 컴포넌트 더하기

기존 페이지의 일부 컴포넌트만 리액트로 쓸 수도 있다. 이는 Meta에서 꽤 오랫동안 리액트를 사용했던 방식이기도 하다. 이는 먼저 npm을 통해서 JSX 문법, 리액트 라이브러리 등을 설치한다. 그리고 원하는 곳에 리액트 컴포넌트를 만들어서 렌더링하면 된다.

그리고 JS 모듈을 컴파일하는 설정도 해야 하는데 이는 Vite를 통해서 간단하게 할 수 있다. [Vite를 여러 백엔드 프레임워크와 통합하는 코드를 모은 레포지토리도 있다.](https://github.com/vitejs/awesome-vite#integrations-with-backends)

아무튼 먼저 리액트부터 설치한다.

```bash
npm install react react-dom
```

그리고 다음과 같이 DOM 엘리먼트 내부에 `createRoot`와 `render`를 통해서 리액트 컴포넌트를 렌더링한다.

```js
import {createRoot} from 'react-dom/client';

const root = document.getElementById('root');

createRoot(root).render(<App />);
```

이는 바로 Vite의 Typescript 템플릿으로 처음 프로젝트를 생성했을 때 `main.tsx`의 구조에서도 비슷하게 볼 수 있다.

```tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

물론 이런 동작은 기존 앱의 어떤 태그에도 할 수 있다. 유일한 id를 주고 `getElementById`를 통해서 해당 태그를 찾고 `createRoot`, `render`를 통해서 리액트 컴포넌트를 렌더링하면 된다. 그런 식으로 페이지의 요소 하나하나를 리액트로 바꿔가며 마이그레이션할 수 있다.

# 6. 리액트의 타입들

리액트 사용자를 위해 리액트 요소들의 타입을 제공해 주는 `@types/react`패키지의 몇 가지 타입을 소개하는 섹션이 있다.

## 6.1. DOM 이벤트

리액트는 DOM 이벤트를 래핑해서 제공한다. 이런 이벤트에 타입을 제공할 수 있고 제네릭을 통해서 어떤 태그의 이벤트인지도 지정 가능하다.

```tsx
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log('button clicked');
}

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log('input changed');
}
```

그리고 모든 이벤트 타입의 base type은 `React.SynthenticEvent`이다.

## 6.2. style props

리액트에서 인라인 스타일을 적용할 때 `React.CSSProperties`를 사용한다. 이는 모든 가능한 CSS 프로퍼티의 유니언 타입이라서 유효한 CSS 프로퍼티를 넘기는지를 이 타입을 이용해 검사할 수 있다.
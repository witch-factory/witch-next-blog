---
title: React 공식 문서를 읽으면서
date: "2023-10-11T00:00:00Z"
description: "개편된 React 공식 문서를 읽어보았다"
tags: ["front", "react"]
---

나는 지금은 레거시로 분류되어 있는 [react 이전 공식문서](https://ko.legacy.reactjs.org/)를 보면서 리액트를 처음 시작했었다. 아마 거기 있던 틱택토를 만들어 보는 문서부터 시작해서 조금 보다가 [벨로퍼트의 모던 리액트](https://react.vlpt.us/)로 넘어가서 투두리스트를 만들며 개발로 넘어왔던 걸로 기억한다.

하지만 꽤 오래전 이야기이고 [지금은 리액트 공식문서가 개편되었다.](https://react.dev/) 그래서 거기의 문서들을 한번 읽어 보면서 몰랐던 부분들만 간략히 정리해본다.

# 1. JSX

HTML을 JSX로 많이 바꿔야 한다면 [온라인 컨버터를 쓸 수 있다.](https://transform.tools/html-to-jsx)

jsx는 HTML보다 엄격하다. `<br />`같이 무조건 태그를 닫아야 하고 여러 JSX 태그를 리턴할 수 없다. 이는 JSX가 사실 JS이기 때문으로 JS 함수가 여러 값을 리턴할 수 없는 것과 같다.

# 2. 리액트 훅

`use`로 시작하는 함수들은 리액트에서 훅이라고 불리는데 이 훅들은 컴포넌트 코드 혹은 다른 훅(아마도 커스텀 훅)의 최상위에서만 호출되어야 한다. 즉 훅을 조건문이나 반복문 내에서 바로 사용하는 건 불가능하다. 그럴 경우 새로운 컴포넌트를 만들어서 해야 한다.

리액트에서 제공하는 `useState`같은 훅들도 있는데 사용자는 이들을 조합해서 새로운 훅을 만들 수 있다. 이런 훅들을 커스텀 훅이라고 부른다.

# 3. lifting state

여러 개의 자식 컴포넌트에서 같은 상태를 관리한다면 부모 컴포넌트에 state를 두고 props로 자식 컴포넌트에 상태를 내려 주는 게 공식 문서에서도 권장되고 있다. 이를 lifting state라고 부른다. 이렇게 하면 자식 컴포넌트들이 동기화된 상태를 쉽게 유지할 수 있다.

# 4. 리액트로 설계하기

리액트로 UI를 짠다면 먼저 UI를 컴포넌트 단위로 쪼갠 다음 각 컴포넌트에서 보여주어야 할 상태들을 생각할 것이다. 그리고 컴포넌트들 간에 어떤 데이터가 어떻게, 어디서 어디까지 흐를지를 설계하게 된다.

## 4.1. 컴포넌트 나누기

컴포넌트를 나눌 때는 단일 책임 원칙을 따라서 한 역할을 하는 부분을 컴포넌트로 빼거나, CSS를 기반으로 클래스 셀렉터를 잘 쓸 수 있도록 컴포넌트를 나눌 수 있다.

디자인 구성을 생각해서 나누는 것도 좋다. 그러나 UI와 데이터 모델은 보통 같이 가기 때문에 데이터가 잘 짜여 있다면 컴포넌트를 그에 따라 나누는 것은 어렵지 않다.

## 4.2. 상태 관리하기

사이트의 구조 설계가 끝났다면 컴포넌트의 정적 구조는 다 잡혀 있을 것이다. 그러면 앱이 가져야 할 상태를 최소한으로 설계해야 한다. 최소한으로.

예를 들어서 배열이 state로 저장되어 있다면 배열의 길이는 state로부터 계산될 수 있으므로 상태로 존재하면 안된다. 혹은 불변의 값도 상태로 존재하면 안된다. state는 사용자와의 상호작용을 위해 존재하는 것이다.

이렇게 최소한의 상태를 구상하고 나면 해당 상태들이 어떤 컴포넌트에 state로 저장되어야 하는지도 생각해야 한다.



# 3. key props

JS의 배열 메서드인 `.map(item, index)`를 써서 배열에 들어 있는 요소들을 컴포넌트로 렌더링할 때 `key`라는 각 컴포넌트별로 고유한 값을 넣어줘야 한다. 이는 리액트가 각 컴포넌트를 보고 무엇이 바뀌었는지를 감지하고 어떤 것을 리렌더링할지 결정할 수 있게 하는, 컴포넌트의 고유한 아이디 같은 것이다.

```jsx
const listItems = numbers.map((number) =>
  <li key={number}>
    {number}
  </li>
);
```

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

개발을 하다 보면 라우팅이나 데이터 페칭, 프리로딩 등을 구현하거나 라이브러리를 통해서 환경을 구성해야 할 때가 많다. 정적 HTML 빌드 등을 원할 수도 있다. 이런 것들을 직접 구현하려면 많은 시간과 노력이 들어가고 라이브러리를 쓰려면 라이브러리를 쓰는 방법을 익혀야 한다. 또한 그렇게 스스로 환경을 구성했다 해도 다른 사람의 도움을 받기 쉽지 않다. 사람마다 구성해 본 환경이 다르기 때문이다.

하지만 프레임워크를 쓰면 이런 것들을 이미 구성해 놓았기 때문에 빠르게 개발을 시작할 수 있다. 또한 오류가 생겨도 프레임워크의 커뮤니티를 통해서 도움을 받을 수 있다.

## 4.2. 프레임워크와 리액트

리액트 팀은 몇몇 유명한 리액트 프레임워크 개발자들과 협력하고 있다. 예를 들어 [리액트 서버 컴포넌트](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)와 같은 리액트 피쳐들에 대해서 Nextjs와 같은 리액트 프레임워크 개발자들과 의견을 나누고 있다.

[nextJS 앱 라우터 공식문서](https://nextjs.org/docs)에서 이런 서버 컴포넌트를 미리 사용해볼 수 있다. 서버 컴포넌트와 Suspense 같은 것들은 리액트 피쳐지만 리액트에 바로 적용하기에는 무리가 있기 때문에 Nextjs에서 먼저 구현되었다.

## 4.3. 에디터 설정

[VSCode 설정시 도움될 만한 공식문서 일부](https://react.dev/learn/editor-setup)

# 5. 기존 프로젝트에 리액트 더하기

지금은 CRA 등의 리액트 보일러플레이트의 등장으로 모든 프로젝트를 처음부터 리액트로 짜는 것이 당연하게 여겨진다. 하지만 리액트는 원래 점진적인 마이그레이션이 가능하다는 것이 강점이었다. 당연히 기존 프로젝트에 리액트를 조금씩 더해 가는 것도 가능하다.

일부 페이지를 리액트로 구성하는 것, 그리고 개별 페이지의 일부를 리액트 컴포넌트로 렌더링하는 것 2가지 방법이 있다.

## 5.1. 리액트 페이지를 더하기

루비 온 레일즈 같은, 다른 서버 기술로 만들어진 페이지가 있다고 하자. `witch.com`이라고 하자. 여기에 특정 라우트는 리액트로 만들고 싶다면 어떻게 해야 할까? 예를 들어 `/witch`로 시작하는 모든 라우트를 리액트로 만들고 싶다고 하자.

그럼 먼저 해당 페이지를 리액트로 구성한다. nextjs같은 프레임워크를 쓸 수도 있다. 그리고 프레임워크의 설정 파일에서 base path로 해당 경로를 설정한다. 만약 `/witch`라는 경로를 리액트 페이지의 루트로 설정하고 싶다면 다음과 같이 설정한다.

[NextJS라고 한다면 `next.config.js`를 편집해준다.](https://nextjs.org/docs/app/api-reference/next-config-js/basePath) 다음과 같이 하면 `기존사이트URL/witch`가 리액트 페이지의 루트가 된다.

```js
module.exports = {
  basePath: '/witch',
}
```

그리고 서버에서 `/witch`로 가는 모든 요청을 리액트 페이지로 보내도록 프록시 설정을 하면 된다.

## 5.2. 기존 페이지에 리액트 컴포넌트 더하기

기존 페이지의 일부 컴포넌트만 리액트로 쓸 수도 있다. 이는 Meta에서 꽤 오랫동안 리액트를 사용했던 방식이기도 하다.

먼저 npm을 통해서 JSX 문법, 리액트 라이브러리 등을 설치한다. 그리고 원하는 곳에 리액트 컴포넌트를 만들어서 렌더링하면 된다.

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

이런 방식은 Vite의 Typescript 템플릿으로 처음 프로젝트를 생성했을 때 `main.tsx`의 구조에서도 비슷하게 볼 수 있다. `root`라는 id를 가진 태그를 찾고 그 내부에 `createRoot`를 통해서 리액트 컴포넌트를 렌더링하는 것이다.

```tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

물론 이런 동작은 기존 앱의 어떤 태그에도 할 수 있다. 유일한 id를 주고 `getElementById`를 통해서 해당 태그를 찾고 `createRoot`, `render`를 통해서 리액트 컴포넌트를 렌더링하면 된다.

예를 들어서 원래 헤더 역할을 하던 페이지가 있다면 그 페이지의 헤더 태그에 리액트 컴포넌트를 렌더링할 수 있다.

```html
<!-- ...생략... -->
<header>
  <div id="header"></div>
</header>
<!-- ...생략... -->
```

다음과 같이 id가 `header`인 태그를 찾고 그 내부에 리액트 컴포넌트를 렌더링한다.

```js
import { createRoot } from 'react-dom/client';
// 헤더 내부에 들어갈 컴포넌트는 이미 만들어져 있다고 하자
import Header from './Header';

const header = document.getElementById('header');
const root = createRoot(header);
root.render(<Header />);
```

그런 식으로 페이지의 요소 하나하나를 리액트로 바꿔가며 마이그레이션할 수 있다.

# 6. 리액트의 타입들

리액트 사용자를 위해 리액트 요소들의 타입을 제공해 주는 `@types/react`와 `@types/react-dom` 패키지의 몇 가지 타입을 소개하는 섹션이 있다. 훅에 관련된 타입도 있고 몇 가지 유용한 타입들이 더 있다.

리액트 타입의 설치는 당연히 `npm install @types/react @types/react-dom`으로 할 수 있다. 그리고 `.tsx` 파일 형식을 사용해야 JSX에 ts를 사용할 수 있다.

## 6.1. useState

`useState`는 리액트의 가장 기본적인 훅이다. 이 훅은 전달된 초기 상태를 기반으로 상태의 타입을 추론한다.

```tsx
// count의 타입은 number로 추론된다.
// setCount의 타입은 number 혹은 number를 리턴하는 함수를 받는 함수 타입으로 추론된다.
const [count, setCount] = useState(0);
```

제네릭을 이용해서 `useState`의 상태 타입을 직접 제공할 수도 있다. 이는 유니언 타입 상태를 정의할 때 등에 유용하다.

```tsx
type Theme = 'light' | 'dark';

const [theme, setTheme] = useState<Theme>('light');
```

## 6.2. useReducer

`useReducer`는 `useState`와 비슷하지만 리듀서를 통해서 상태를 업데이트한다. 역시 리듀서 함수의 타입도 초기 상태를 통해서 추론된다. 물론 제네릭을 통해서 직접 타입을 제공할 수도 있지만 초기 상태를 통해 추론되도록 하는 게 보통 더 좋다.

```tsx
type Action = { type: 'increment' } | { type: 'decrement' };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
  }
}

// 이후 사용될 때
const [count, dispatch] = useReducer(reducer, 0);
```

## 6.3. useContext

`useContext`훅은 props를 통호지 않고 컴포넌트 트리에 데이터를 내려줄 때 사용한다. 흔히 자식 컴포넌트에 값을 전달하는 커스텀 훅을 만들어서 사용한다.

context에서 제공되는 값의 타입은 `createContext` 함수에 전달되는 값을 통해서 추론된다. 제네릭으로 따로 제공도 가능하다.

```tsx
type Theme = 'light' | 'dark';

const ThemeContext = React.createContext<Theme>('light');
```

만약 초기 값이 없는 경우가 있다면 제네릭에 제공하는 타입을 `Theme | null`로 설정한 후 `useContext`를 사용할 때 `null` 체크를 해줘서 타입을 좁히도록 하자.

## 6.4. useMemo, useCallback

`useMemo`와 `useCallback`은 첫번째 인수로 전달받는 함수의 리턴 타입으로 훅의 결과를 추론한다. 훅에 타입 제네릭을 제공할 수도 있다.

```tsx
// computeExpensiveValue의 리턴 타입으로 memoizedValue 타입이 추론된다
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

`useCallback`은 콜백 함수의 파라미터 타입과 리턴 타입을 통해서 훅의 결과를 추론한다.

```tsx
// onClick의 타입은 (e: React.MouseEvent<HTMLButtonElement>) => void로 추론된다.
const onClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
  console.log('button clicked');
}, []);
```

취향에 따라서 리액트 타입에서 제공하는 `EventHandler`라는 타입을 사용할 수도 있다.

```tsx
const handleClick=useCallback<React.ClickEventHandler<HTMLButtonElement>>((e) => {
  console.log('button clicked');
}, []);
```

## 6.5. DOM 이벤트

리액트는 DOM 이벤트를 래핑해서 제공한다. 이벤트 타입은 이벤트 핸들러로부터 추론될 수 있을 때가 많지만 이벤트 핸들러에 전달될 함수를 따로 제작하고 싶을 경우 이벤트 타입을 직접 제공할 수 있다.

```tsx
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log('button clicked');
}

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log('input changed');
}
```

이벤트의 종류는 [mdn 이벤트 레퍼런스](https://developer.mozilla.org/en-US/docs/Web/Events)에서 볼 수 있다.

그리고 모든 이벤트 타입의 base type은 `React.SynthenticEvent`이다.

## 6.6. children

자식 컴포넌트를 표현할 수 있는 방법은 널리 쓰이는 2가지가 있다. 하나는 JSX의 자식으로 전달될 수 있는 모든 타입들의 유니온인 `React.ReactNode`이다.

두번째는 `React.ReactElement`인데 이는 JSX 요소만을 나타내며 문자열이나 숫자 같은 JS 원시값들은 포함하지 않는다.

그리고 특정 타입의 JSX 요소만을 자식으로 받는 children 타입은 불가능하다. 예를 들어서 `<section>`태그만 자식으로 받는 등의 동작은 불가능하다는 말이다.

## 6.7. style props

리액트에서 인라인 스타일을 적용할 때 `React.CSSProperties`를 사용한다. 이는 모든 가능한 CSS 프로퍼티의 유니언 타입이라서 유효한 CSS 프로퍼티를 넘기는지를 이 타입을 이용해 검사할 수 있다.

```tsx
interface Props {
  style: React.CSSProperties;
}
```
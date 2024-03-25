---
title: 프로젝트 트러블 슈팅 - 체크박스 이벤트 다루기
date: "2022-08-23T00:00:00Z"
description: "체크박스의 이벤트 핸들링 그리고 기본 상태"
tags: ["web", "study", "front", "react"]
---

# 0. 선요약

프로젝트에서 체크박스를 다루면서 2가지 문제를 맞닥뜨렸다. 하나는 onClick과 onChange 둘 중 어떤 이벤트 핸들러 함수를 사용할지에 관한 것이었다. IE까지 고려한다면 onClick이 더 나았다. 하지만 IE의 서비스가 종료되고 점유율도 변변치 못한 지금 크게 신경쓸 문제는 아니었다. 하지만 체크박스의 값을 바꾸는 것은 결국 클릭 이벤트라는 것을 고려해서 onClick 이벤트 핸들러를 사용하기로 했다.

이때 onClick을 사용할 시, 체크박스의 초기 상태를 지정하는 checked props를 사용하지 못한다는 문제가 생겼다. 따라서 defaultChecked를 사용하여 해결했다. 이 과정을 정리해 둔다.

# 1. onClick vs onChecked

체크박스의 체크 여부 변경에 따라 어떤 동작을 해줘야 하는 경우가 생길 수 있다. 진행한 프로젝트에서 그런 경우는 첫째로 약관 동의 체크박스를 사용하는 경우가 있었다. 그리고 하나의 페이지에서 다른 페이지로 넘어갈 때 다른 페이지로 전달되는 상태가 있었는데, 그 상태에 어떤 내용을 포함시킬지 정하는 체크박스를 다뤄야 했다.

이때 체크박스가 체크되거나 체크 해제되는 이벤트를 다루기 위해 사용할 수 있는 핸들러 함수는 2개가 떠오른다. `onChange`와 `onClick`이다. 그럼 이 둘의 차이는 뭘까?

App 컴포넌트에 다음과 같은 코드를 작성하였다.

```jsx
function App() {
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    console.log("체크박스 클릭됨" + e.currentTarget.checked);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("체크박스 변경됨" + e.target.checked);
  };

  return (
    <div>
      <h1>체크박스 테스트</h1>
      <label htmlFor="onclick-checkbox">onClick을 쓰는 체크박스</label>
      <input id="onclick-checkbox" type="checkbox" onClick={handleClick} />
      <label htmlFor="onchange-checkbox">onChange 쓰는 체크박스</label>
      <input id="onchange-checkbox" type="checkbox" onChange={handleChange} />
    </div>
  );
}
```

두 체크박스는 크롬 환경에서는 완전히 똑같이 동작한다. 그러나 IE에서는 onChange가, 체크박스에서 focus가 벗어나는 시점에 이벤트가 발생한다고 한다(엣지 브라우저에서는 이런 문제가 없다). 이를 해결하기 위해 onClick을 사용하는 것이 좋다.

# 2. onClick에서 발생하는 문제

그런데 이 체크박스가 초기에 체크되어 있도록 하고 싶을 수 있다. 그러면 checked props를 사용하는 방식을 생각해 보자.

```jsx
const [checked, setChecked] = useState(true);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setChecked(!checked);
};

<input
  id="onchange-checkbox"
  type="checkbox"
  checked={checked}
  onChange={handleChange}
/>;
```

이러면 체크박스의 체크 여부를 나타내는 `checked` state가 초기에 true로 설정된다. 따라서 체크박스가 초반에 체크되어서 렌더링된다. 또한 onChange에서 checked를 반전시키는 역할도 해준다. onChange가 없으면 체크박스의 체크 여부를 바꿀 수 없다.

그런데 onChange 대신 onClick을 사용하면?

```jsx
const [checked, setChecked] = useState(true);

const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
  console.log("체크박스 클릭됨" + e.currentTarget.checked);
  setChecked(!checked);
};

<input
  id="onclick-checkbox"
  type="checkbox"
  checked={checked}
  onClick={handleClick}
/>;
```

이렇게 하면 에러가 발생한다. 에러 메시지는 다음과 같다.

```
Warning: You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.
```

이 에러를 해결하는 방법은 그냥 에러 메시지에서 시키는 대로 하면 된다. 어차피 우리는 체크박스가 처음에 체크되어 있기만 하면 되기 때문에 defaultChecked를 설정해 주는 것이다.

```jsx
<input
  id="onclick-checkbox"
  type="checkbox"
  defaultChecked
  onClick={handleClick}
/>
```

이러면 에러 메시지도 사라지고 체크박스가 처음에 체크되어 있는 상태로 렌더링된다. onClick 이벤트도 잘 동작한다. 어떻게든 결과는 냈다. 그런데 이 에러는 왜 발생하는지 잠깐 알아보았다.

# 3. 에러의 발생 이유

리액트에는 폼(input도 포함)을 만드는 데 2가지 방법이 있다. Controlled component와 Uncontrolled Component이다. 이때 두 컴포넌트에는 요구되는 attribute들이 있는데 이것들을 제대로 설정해 주지 않았을 때 위의 에러가 발생한다.

Controlled component는 `value`와 `onChange` attribute를 요구한다. 이때 체크박스나 라디오버튼 컴포넌트의 경우 `value` 대신 `checked` attribute를 요구한다.

Controlled component의 경우 어떤 값을 제어하는 데 쓰이기 때문에 state 혹은 props로 된 값을 가져야 한다. 따라서 value 를 갖는 건 당연하다. 또한 이 값이 바뀌었을 경우 이벤트 핸들러를 통해 값이 변경되었고 리렌더링시 이를 반영해야 한다는 것을 React에 알려야 한다. onChange가 이를 수행한다. 이것이 Controlled component가 앞의 두 attribute를 요구하는 이유이다.

Uncontrolled component의 경우 state/props와 이벤트 핸들러가 아니라 DOM 자체에서 관리되는 컴포넌트이다. 따라서 value, onChange 이벤트핸들러 같은 건 필요없다. 만약 이런 uncontrolled component의 값을 가져오고 싶다면 useRef 혹은 id를 통해서(getElementById 등의 사용) 가져와야 한다.

이런 Uncontrolled component의 초기값을 설정해 주는 attribute는 defaultValue 혹은 위에서 사용한 defaultChecked(checkbox, radio type input에만)이다. 물론 이걸 통해 초기값을 제공해주는 게 필수는 아니다. controlled component의 value와 달리 핸들링도 안된다. 그저 초기값을 전달하는 것 뿐이다.

위의 에러는 체크박스에 `checked` 를 전달함으로써 체크박스를 controlled component라고 리액트에 전달했지만 controlled component라면 같이 전달해 줘야 하는 `onChange` 를 전달해 주지 않았기 때문에 일어난 것이다.

따라서 해결 방법은 위처럼 `checked`를 아예 지워서 Uncontrolled component로 만들고 초기값은 `defaultChecked`로 전달하고 값을 받아오는 작업은 `useRef`를 통해 진행하는 방법이 있을 수 있다. 체크박스의 값을 받아오는 것까지 작성하면 다음과 같이 된다.

```tsx
function App() {
  const checkedRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (checkedRef.current !== null) {
      console.log("체크박스 클릭됨" + checkedRef.current.checked);
    }
  };

  return (
    <div>
      <h1>체크박스 테스트</h1>
      <label htmlFor="onclick-checkbox">onClick을 쓰는 체크박스</label>
      <input
        ref={checkedRef}
        id="onclick-checkbox"
        type="checkbox"
        onClick={handleClick}
        defaultChecked
      />
    </div>
  );
}
```

체크박스를 Controlled component로 다루고 싶다면 `onClick` 대신 `onChange`로 이벤트를 핸들링하는 방법이 있다.

# 참고

https://devlog.jwgo.kr/2018/11/28/checkbox-error-with-react/

관련 스택오버플로우 질문답변 https://stackoverflow.com/questions/5575338/what-the-difference-between-click-and-change-on-a-checkbox

https://stackoverflow.com/questions/70022781/react-checkbox-event-preventdefault-breaks-onchange-function-why

https://stackoverflow.com/questions/36715901/reactjs-error-warning

리액트 공식 문서의 Uncontrolled Component와 Controlled Component에 대한 설명
https://reactjs.org/docs/uncontrolled-components.html
https://reactjs.org/docs/forms.html#controlled-components

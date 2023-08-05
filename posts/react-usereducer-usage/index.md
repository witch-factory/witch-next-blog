---
title: 프론트 지식 익히기 React - useReducer의 활용
date: "2022-09-18T00:00:00Z"
description: "React useReducer를 사용하는 이유에 대한 탐구"
tags: ["web", "study", "front", "react"]
---

# 1. 시작

이번 글에서는 useReducer를 왜 사용하는지에 대해 알아보고자 한다.

# 2. useReducer의 활용

그럼 이제 useReducer가 어떤 문법으로 작동하는지도 알았고 백엔드와 같이 특정 데이터를 api를 통해 관리하는 모델처럼 볼 수 있다는 점도 알았다. 이제 useReducer를 어떻게 활용할 수 있는지 알아보자.

여러 시행착오를 겪고 또 많은 사람들([이창희](https://xo.dev/)와 [유동근](https://github.com/CreeJee)님 등등)과 논의한 결과, useReducer를 사용할 때 얻을 수 이점은 다음과 같다.

1. 상태 관리 로직을 분리함으로써 상태 업데이트의 내부 로직을 알지 않아도 상태를 사용할 수 있게 되어 복잡한 상태 관리가 편해진다는 점. 즉 상태 업데이트 로직을 은닉할 수 있다는 점
2. 상태 업데이트 시 새로운 상태를 검증하는 등, 어떤 동작을 같이 해 줘야 할 경우 새로운 함수를 만들지 않고도 reducer에 로직을 추가하는 식으로 작성할 수 있다는 점
3. 상태 업데이트를 담당하는 dispatch가 순수 함수이므로 테스팅에 이점이 있다는 점
4. useState를 사용하는 것에 비해 리렌더링 최적화가 쉬울 수 있는 점

이 각각의 경우를 하나씩 알아보도록 하자.

# 3. 복잡한 state를 관리하는 경우

## 3.1 useState를 사용

useReducer를 사용하면 상태 로직을 컴포넌트에서 분리하여 여러 개의 state와 그 상태들이 얽힌 동작을 편리하게 관리할 수 있다는 장점이 있다. 예를 들어서 회원가입 컴포넌트를 만든다고 하자. 이 컴포넌트는 이름, 아이디, 이메일, 비밀번호, 비밀번호 확인 등의 정보를 입력받아야 한다. 일단 이 5개의 요소만 받아서 회원가입을 시켜준다고 해보자. 이렇게 여러 개의 state를 관리해야 하는 경우에는 useState를 사용하면 다음과 같이 폼 관리 로직을 작성할 수 있다.

```tsx
interface SignUpFormType {
  "User Name": string;
  "User ID": string;
  "User Email": string;
  "User Password": string;
  "User Confirm Password": string;
}

const initialSignUpForm: SignUpFormType = {
  "User Name": "",
  "User ID": "",
  "User Email": "",
  "User Password": "",
  "User Confirm Password": "",
};

function SignUpForm() {
  const [userSignUpForm, setUserSignUpForm] = useState(initialSignUpForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSignUpForm({
      ...userSignUpForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section>
      <h1>Sign Up</h1>
      <form
        style={{ display: "flex", flexDirection: "column", width: "180px" }}
      >
        {Object.keys(userSignUpForm).map((key) => (
          <label key={key}>
            {key}
            <input
              type="text"
              id={key}
              name={key}
              value={userSignUpForm[key]}
              onChange={handleChange}
            />
          </label>
        ))}
        <button type="submit">Sign Up</button>
      </form>
    </section>
  );
}
```

스타일링을 하지 않아서 별로 볼품은 없지만 다음과 같은 간단한 회원가입 폼이 완성되었다.

![signupform](./signupform.png)

## 3.2 useReducer를 이용한 경우

같은 타입과 `initialSignUpForm`을 사용하고 useReducer를 이용하여 같은 동작의 코드를 다음과 같이 작성할 수도 있다.

```tsx
const signUpReducer = (
  state: SignUpFormType,
  action: { type: string; payload: { key: string; value: string } }
) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

const ReducerSignUpForm = () => {
  const [state, dispatch] = useReducer(signUpReducer, initialSignUpForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE",
      payload: {
        key: e.target.name,
        value: e.target.value,
      },
    });
  };

  return (
    <section>
      <h1>Sign Up</h1>
      <form
        style={{ display: "flex", flexDirection: "column", width: "180px" }}
        onSubmit={handleSubmit}
      >
        {Object.keys(state).map((key) => (
          <label key={key}>
            {key}
            <input
              type="text"
              id={key}
              name={key}
              value={userSignUpForm[key]}
              onChange={handleChange}
            />
          </label>
        ))}
        <button type="submit">Sign Up</button>
      </form>
    </section>
  );
};
```

## 3.3 useState, useReducer의 비교

useReducer를 사용하는 코드를 보자. 업데이트 함수를 사용하는 측에서는 Action만 잘 만들어서 dispatch 함수로 전달하면 reducer함수가 알아서 상태를 변경해 준다. 상태 업데이트 내부 로직을 신경쓰지 않아도 코드를 짤 수 있게 된 것이다.

`ReducerSignUpForm` 컴포넌트에서는 다른 사람이 작성했을 수도 있을 dispatch 함수 내에서 어떻게 업데이트를 하는지 신경쓰지 않고도 상태를 업데이트할 수 있는 것이다! 반면 useState를 사용할 경우 상태 업데이트 로직은 `SignUpForm`내에 존재해야 한다.

이는 생각보다 편리한 기능이다. 예를 들어서 어떤 이유로 회원가입 폼을 리셋하는 기능을 만들어야 한다면 useState를 사용하는 경우 다음과 같은 함수를 회원가입 폼 컴포넌트 내에 새로 만들어 줘야 한다. 이 함수는 `SignUpForm`내에 작성해야 한다.

```tsx
const signUpFormReset = () => {
  setUserSignUpForm(initialSignUpForm);
};
```

그러나 reducer 함수를 사용한다면 reducer 함수에 적당한 리셋 로직을 추가해주면 된다. 이는 reducer 함수를 작성하는 사람이 알아서 해주면 되는 일이다. 그리고 사용하는 측에서는 그저 다음과 같이 쓰면 된다.

```tsx
const signUpFormReset = () => {
  dispatch({
    type: "RESET",
  });
};
```

이 회원가입 폼은 작은 컴포넌트이므로 모든 로직을 한 곳에 모아두는 것이 좋다고 생각할 수 있다. 하지만 컴포넌트가 커지고 복잡해지면 이런 방식은 유지보수하기가 어려워진다.

그럴 때는 useReducer를 사용하여 관리 로직을 다른 곳에 분리하는 것이 좋다. state업데이트 함수와 그 활용을 하나의 컴포넌트에 몰아넣는 것보다는 신뢰할 수 있는 reducer함수를 작성한 후 거기에 상태 관리를 맡기는 것이 더 유지보수하기 편해진다.

또한 useReducer와 useContext 훅을 함께 사용하는 테크닉도 있다. dispatch 함수를 ContextProvider를 이용해서 하위 컴포넌트로 내려보내면 하위 컴포넌트에서는 dispatch만을 이용해서 상태를 업데이트할 수 있다.

# 4. state를 설정할 때 특정 작업을 함께하는 경우

어떤 작업을 실행하기 전에 특정 작업을 함께 실행해야 하는 경우가 있다. 예를 들어서 회원가입 폼을 업데이트하기 전에 유효성 검사를 해야 하는 경우가 그렇다. 이런 경우에는 `useReducer`를 사용하면 편리하다.

회원가입 폼에 아이디를 작성할 때 10글자 이상은 타이핑할 수 없도록 한다고 해보자. 그러면 다음과 같이 handleChange 함수 자체를 바꿀 수도 있다.

```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (userSignUpForm["User ID"].length <= 10) {
    setUserSignUpForm({
      ...userSignUpForm,
      [e.target.name]: e.target.value,
    });
  }
};
```

`handleUserIDChange`와 같은 새로운 함수를 작성해서 할 수도 있다. 하지만 useState가 제공해 주는 `state`, `setState`는 게터와 세터의 역할을 한다고도 할 수 있다. 그런데 이를 사용하는 쪽에서 세터에 전달하는 값을 따로 검증해야 한다는 건 뭔가 이상하다. 세터에서 자체적으로 값을 검증하면 더 좋을 것 같다.

이런 방식의 코드를 useReducer에서 작성할 수 있다. 상태의 업데이트 자체를 담당하는 reducer 함수가 따로 있기에 가능하다. 다음과 같이 리듀서 함수를 작성해 주면 된다. 이렇게 하면 회원가입 폼 컴포넌트 코드는 단 한 글자도 바꾸지 않고도 회원가입 폼 입력시 검증이 가능해진다.

```tsx
const signUpReducer = (
  state: SignUpFormType,
  action: { type: string; payload: { key: string; value: string } }
) => {
  switch (action.type) {
    case "UPDATE":
      if (state["User ID"].length <= 10) {
        return {
          ...state,
          [action.payload.key]: action.payload.value,
        };
      } else {
        return state;
      }
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
```

물론 이 코드를 그대로 쓸 수는 없다. 사용자가 작성한 아이디가 어떤 이유로 10글자를 넘었을 경우 아예 다른 칸의 변경을 막아버리기 때문이다. 위의 코드는 `useReducer`를 사용할 경우 상태 업데이트 함수가 세터의 역할을 더 잘 수행할 수 있다는 것을 보여주기 위한 예시 코드이다.

# 5. 리렌더링 최적화를 할 경우

리액트는 상태가 변경되면 컴포넌트를 리렌더링한다. 그런데 컴포넌트가 리렌더링되는 것은 비용이 큰 작업이다. 그래서 리렌더링을 최소화하는 것이 중요하다.

그리고 리렌더링이 일어나는 조건 중 하나는 컴포넌트가 가지고 있는 state가 변경되는 것이다. 그런데 어떤 경우 하나의 함수에서 여러 개의 state를 업데이트해줘야 하는 경우가 있을 수 있다. 예를 들어서 3개의 색깔 칸을 표시하는 다음과 같은 코드를 보자.

```tsx
function Colors() {
  const [firstColor, setFirstColor] = useState("red");
  const [secondColor, setSecondColor] = useState("blue");
  const [thirdColor, setThirdColor] = useState("green");

  const setColorSet = () => {
    setFirstColor(secondColor);
    setSecondColor(thirdColor);
    setThirdColor(firstColor);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <button onClick={setColorSet}>Red</button>
      <div
        style={{ backgroundColor: firstColor, width: "100px", height: "100px" }}
      ></div>
      <div
        style={{
          backgroundColor: secondColor,
          width: "100px",
          height: "100px",
        }}
      ></div>
      <div
        style={{ backgroundColor: thirdColor, width: "100px", height: "100px" }}
      ></div>
    </div>
  );
}
```

이렇게 코드를 작성할 시 3번 리렌더링되게 된다.(React 17까지 그렇다.) 하지만 이를 useReducer로 작성하면 1번만 리렌더링되게 된다. reducer를 활용하면 상태가 1번만 변경되기 때문이다.

# 6. 테스트를 작성할 경우

동일한 인자를 주었을 때 늘 동일한 인자를 반환하며 부수 효과가 없는 순수 함수는 테스트하기 쉽다. 그리고 useReducer의 dispatch는 순수 함수로 작성하기 쉬운 편이다. 연관된 모든 요소를 action의 payload로 넘겨주기 때문이다. 그래서 useReducer를 사용할 경우 테스트를 작성하기 쉬워진다. 다만 구체적인 예시의 경우 아직 테스트 작성에 익숙하지 않아 작성하지 못했다. 언젠가 테스트 코드 작성에 능숙해지면 다시 와서 작성하도록 하겠다.

# 참고

벨로퍼트의 모던 리액트 useReducer 항목 [20. useReducer 를 사용하여 상태 업데이트 로직 분리하기 · GitBook](https://react.vlpt.us/basic/20-useReducer.html)

React 공식 문서의 useReducer https://ko.reactjs.org/docs/hooks-reference.html#usereducer

useReducer의 사용에 관한 구체적인 글 https://devtrium.com/posts/how-to-use-react-usereducer-hook

useReducer가 최적화에 도움이 될 때 https://stackoverflow.com/questions/54646553/usestate-vs-usereducer

useReducer를 언제 써야 하는지와 써야하는 이유에 관한 짧은 글 https://dev.to/spukas/3-reasons-to-usereducer-over-usestate-43ad#:%7E:text=useReducer()%20is%20an%20alternative,understand%20for%20you%20and%20colleagues

순수 함수에 관하여 https://www.learnhowtoprogram.com/react/functional-programming-with-javascript/pure-functions

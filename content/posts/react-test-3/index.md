---
title: React Testing - Jest 3
date: "2023-03-01T03:00:00Z"
description: "프론트에 테스트 도입을 위한 공부, 카운터 만들기"
tags: ["javascript"]
---

# 1. 카운터 제작

간단하게 +, - 버튼이 있고 누르면 숫자가 증가하고 감소하는 카운터를 만든다고 해보자. 핵심 기능은 무엇일까? 당연히 숫자가 증가하고 감소하는 것이다. 그럼 이 기능을 테스트 해보자.

물론 버튼이 제대로 렌더링되어 있는지, 숫자 컴포넌트가 제대로 렌더링되어 있는지 등도 테스트할 수 있을 것이다. 하지만 그런 건 리액트를 믿기로 한다. 우리가 해야 할 건 사용자가 버튼을 누르는 동작을 했을 때 그 의도가 제대로 작동하는지이다.

# 2. 테스트 작성

간단하게, section 요소 내부에 숫자를 보여주는 h1 요소, +, - 버튼을 보여주는 button 요소가 있다고 할 것이다. 그리고 그냥 cra로 만든 프로젝트에 기본으로 있는 App 컴포넌트에 이를 구현할 것이다.

그럼 +버튼을 눌렀을 때 1 증가하는 테스트는 다음과 같이 작성할 수 있다. 카운터 초기값은 0이라고 생각하자.

```js
test("when plus button is clicked then counter increases", () => {
  const user = userEvent.setup();
  render(<App />);
  const plusButton = screen.getByRole("button", { name: "+" });
  user.click(plusButton);
  const counterElement = screen.getByRole("heading");
  expect(counterElement).toHaveTextContent("1");
});
```

아니면 좀 더 세련되게 이렇게 작성할 수도 있겠다. 초기값이 0이라는 보장은 없으니까, 초기값을 가져와서 1을 더해주는 방식이다.

```js
test("when plus button is clicked then counter increases", () => {
  const user = userEvent.setup();
  render(<App />);
  const counterElement = screen.getByRole("heading");
  const counterValue = parseInt(counterElement.textContent || "0");
  const plusButton = screen.getByRole("button", { name: "+" });
  user.click(plusButton);
  expect(counterElement).toHaveTextContent((counterValue + 1).toString());
});
```

`npm test`를 해보면 당연히 테스트는 실패한다. 하지만 먼저 `-`버튼 테스트도 작성해 보자. 비슷하게 작성하면 된다.

```js
test("when minus button is clicked then counter decreases", () => {
  const user = userEvent.setup();
  render(<App />);
  const counterElement = screen.getByRole("heading");
  const counterValue = parseInt(counterElement.textContent || "0");
  const minusButton = screen.getByRole("button", { name: "-" });
  user.click(minusButton);
  expect(counterElement).toHaveTextContent((counterValue - 1).toString());
});
```

# 3. 컴포넌트 구현

이제 한번 카운터를 직접 구현해 보자. 간단한 것이니 금방 할 수 있다.

```js
function App() {
  const [count, setCount] = useState(0);

  return (
    <section title="counter">
      <h1>{count}</h1>
      <button
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          setCount((prev) => prev - 1);
        }}
      >
        -
      </button>
    </section>
  );
}
```

# 4. 테스트 고치기

음..하지만 이렇게 하면 테스트가 실패한다. 그런데 어플리케이션은 잘 동작한다. 왜 그럴까?

위 테스트 코드의 다음 부분을 본다. 

```js
user.click(plusButton);
expect(counterElement).toHaveTextContent((counterValue + 1).toString());
```

plusButton을 클릭한 후 counterValue를 가져와서 1을 더한 값을 텍스트로 가지고 있는지 확인하는 것이다. 그런데 이 테스트는 비동기적으로 동작한다. 일단 user.click부터가 Promise로 동작하니까. (그리고 Testing Lib 문서에서도 userEvent들에 await을 붙이고 있었다)

따라서 await을 붙여서 click이벤트가 끝난 후 요소에 접근하도록 하자. 다음과 같이 테스트를 수정한다.

```js
test("when plus button is clicked then counter increases", async () => {
  const user = userEvent.setup();
  render(<App />);
  const counterElement = screen.getByRole("heading");
  const counterValue = parseInt(counterElement.textContent || "0");
  const plusButton = screen.getByRole("button", { name: "+" });
  await user.click(plusButton);
  expect(counterElement).toHaveTextContent((counterValue + 1).toString());
});

test("when minus button is clicked then counter decreases", async () => {
  const user = userEvent.setup();
  render(<App />);
  const counterElement = screen.getByRole("heading");
  const counterValue = parseInt(counterElement.textContent || "0");
  const minusButton = screen.getByRole("button", { name: "-" });
  await user.click(minusButton);
  expect(counterElement).toHaveTextContent((counterValue - 1).toString());
});
```

이제 `npm test`를 해보면 테스트가 성공한다.

# 5. 테스트 추가

위의 테스트는 1번만 버튼을 눌러본다. 하지만 여러번 눌러도 제대로 동작하는지 테스트해야 한다. 그럼 다음과 같이 테스트를 추가해 보자.

```js
test("plus button 100 times", async () => {
  const user = userEvent.setup();
  render(<App />);

  const plusButton = screen.getByRole("button", { name: "+" });
  for (let i = 0; i < 100; i++) {
    await user.click(plusButton);
  }
  const counterElement = screen.getByRole("heading");
  expect(counterElement).toHaveTextContent("100");
});
```

npm test로 확인해 보면 카운터가 반복적인 클릭에도 잘 작동함을 확인할 수 있다. 카운터 감소 버튼에도 비슷하게 테스트를 작성할 수 있을 것이다.

CSS같은 건 설정하지 않아서 볼품없지만 일단은 테스트와 함께 카운터를 작성해 보았다.

# 참고

https://jbee.io/react/testing-2-react-testing/
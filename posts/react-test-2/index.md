---
title: React Testing - Jest 2
date: "2023-02-19T03:00:00Z"
description: "프론트에 테스트 도입을 위한 공부, Testing Library 기본"
tags: ["javascript"]
---

TDD로 개발할 때는 먼저 테스트를 만들고 테스트를 통과하는 코드를 작성하는 방식으로 제작해야 한다. 물론 반대 순서도 선택할 수 있지만 이름답게 테스트가 중심이 되어야 하는 건 마찬가지다.

먼저 Testing Lib 공식 문서에서 기본적인 내용을 알아본 후 다음 글에서 TDD로 카운터를 만들어 볼 것이다.

# 1. 기본

기초적인 테스트를 만들어 보자. CRA로 프로젝트를 생성하면 기본적으로 `App.test.tsx`파일이 있다. 여기에 다음과 같은 테스트를 만들자. 이는 App 컴포넌트에 있는 title 엘리먼트가 Document에 있는지 확인하는 테스트다.

```js
test("Title is in Document", () => {
  render(<App />);
  const titleElement = screen.getByTestId("title");
  expect(titleElement).toBeInTheDocument();
});
```

먼저 App 컴포넌트를 렌더링한 후, 그 내부에서 "title"이라는 testId를 가진 엘리먼트를 찾는다. 그리고 해당 엘리먼트가 Document에 있는지 확인한다.

다음과 같이 App 컴포넌트를 짜면 테스트가 통과된다. title testid를 가진 엘리먼트가 Document에 있기 때문이다.

```js
function App() {
  return (
    <div className="App" data-testid="title">
      안녕하세요
    </div>
  );
}
```

# 2. 쿼리 함수들의 동작에 따른 분류

위에서 자연스럽게 `screen.getByTestId`함수를 사용하여 엘리먼트에 접근했다. 다른 쿼리 함수들은 뭐가 있을까?

먼저 쿼리 함수들은 앞서 보았듯이 페이지 엘리먼트를 찾는 데 사용된다. 크게 분류하면 get, find, query 함수들이 있는데 이 함수들은 엘리먼트를 찾지 못했을 때의 동작이 다르다.

이렇게 엘리먼트를 찾고 나면 Event API나 user-event로 이벤트를 발생시킬 수 있다.

```js
test(테스트 제목, ()=>{
  render(컴포넌트)
  // 특정 엘리먼트를 찾는 쿼리 함수
  const element=screen.쿼리함수(/이름/);
})
```

그럼 이제 쿼리 함수들이 엘리먼트 찾기를 실패했을 때의 동작에 따른 분류를 알아보자. 또한 하나의 엘리먼트를 찾는 쿼리 함수와 여러 개의 엘리먼트를 찾는 쿼리 함수로 나눌 수도 있다. 여러 개의 엘리먼트를 찾을 경우 By 대신 AllBy가 붙는다. 이렇게 총 6가지의 분류가 생긴다.

### 2.1.1. getBy

`getBy...` 쿼리 함수는 조건에 맞는 엘리먼트를 찾으면 해당 엘리먼트를 반환한다. 만약 찾지 못하면 에러를 발생시킨다. 조건에 맞는 엘리먼트가 2개 이상 있어도 에러를 발생시킨다.

### 2.1.2. queryBy

`queryBy...` 쿼리 함수는 조건에 맞는 엘리먼트를 찾으면 해당 엘리먼트를 반환한다. 만약 찾지 못하면 null을 반환한다. 조건에 맞는 엘리먼트가 2개 이상 있으면 에러를 발생시킨다.

### 2.1.3. findBy

`findBy...` 쿼리 함수는 Promise를 반환한다. 이때 해당 쿼리에 맞는 엘리먼트를 찾으면 Promise는 resolve된다. 만약 못 찾으면 Promise는 reject된다.

그리고 기본 타임아웃 1000ms(1초)이후에 조건에 맞는 하나 이상의 엘리먼트가 발견되면 Promise는 reject된다.

### 2.1.4. getAllBy

`getAllBy...` 쿼리 함수는 조건에 맞는 엘리먼트들을 담은 배열을 반환한다. 만약 찾지 못하면 에러를 발생시킨다.

### 2.1.5. queryAllBy

`queryAllBy...` 쿼리 함수는 조건에 맞는 엘리먼트들을 담은 배열을 반환한다. 만약 찾지 못하면 빈 배열 `[]`을 반환한다.

### 2.1.6. findAllBy

`findAllBy...` 쿼리 함수는 Promise를 반환한다. 해당 쿼리에 맞는 엘리먼트를 찾으면 Promise는 해당 엘리먼트들이 담긴 배열로 resolve된다. 만약 기본 타임아웃인 1000ms후에 그런 엘리먼트를 못 찾으면 Promise는 reject된다.

findBy 쿼리 함수들은 getBy와 waitFor의 조합과 같다. 이 함수들은 마지막 optional argument로 wailFor의 옵션을 받는다.

# 3. 쿼리 함수의 우선순위

위에서 분류한 분류 각각이 수많은 쿼리 함수들을 가지고 있다. 이중에 위에서는 getByTestId를 사용했다. 그런데 screen.getByTestId를 사용해서 엘리먼트에 접근하는 건 권장되는 방식이 아니다. 그럼 어떤 쿼리를 사용해야 할까?

기본적인 원칙은 유저가 내 페이지와 상호작용하는 방식을 닮아야 한다. 그리고 모두가 접근할 수 있는 쿼리 함수들을 우선적으로 사용해야 한다.

따라서 getByRole, getByLabelText, getByText, getByDisplayValue 등을 사용하는 것이 좋다. 이 쿼리 함수들은 마우스나 시각을 사용하는 사람뿐 아니라 스크린 리더를 사용하는 등 다양한 상황에서도 잘 동작한다.

그 다음이 getByAltText, getByTitle 등의 시맨틱 쿼리다. 그 다음이 우리가 썼던 getByTestId인데, 이게 우선순위가 가장 낮다. 이는 TestId가 개발자에게만 의미가 있고, 사용자에게는 의미가 없기 때문이다.

그럼 먼저 Testing Library에 들어가서 제공되는 쿼리 함수들을 알아보았다.

# 3.1. Accessible to Everyone

마우스를 사용하는 사람뿐 아니라 스크린 리더를 사용하는 사람의 경험도 포함하는 쿼리들이다. 편의상 getBy로 설명하지만 같은 의미로 queryBy, findBy, getAllBy, queryAllBy, findAllBy도 있다.

### 3.1.3. getByRole

접근성 트리(DOM 트리를 기반으로 하며 접근성 관련 정보들을 포함한다)에 나와 있는 모든 요소에 사용 가능하다. 그리고 name으로 필터링도 할 수 있다. 이걸 사용하는 게 가장 권장된다. 그리고 문서에 의하면 대부분의 테스트를 이걸로 할 수 있을 거라고 한다. name 옵션과 함께 쓰일 때가 많다.

```js
screen.getByRole('button', {name: /submit/i})
```

### 3.1.2. getByLabelText

LabelText를 통해서 엘리먼트를 찾는다. form에 사용하기 좋다. 사용자는 form을 채우는 과정에서 label을 보게 되는데, 이 label을 통해서 엘리먼트를 찾는 것이다. 이 또한 가장 권장된다.

### 3.1.3. getByPlaceholderText

placeholder를 통해서 요소를 찾는다. 그러나 [placeholder 자체가 권장되지 않는다.](https://www.nngroup.com/articles/form-design-placeholders/) 다른 옵션이 있다면 다른 걸 쓰는 게 낫다.

### 3.1.4. getByText

사용자는 텍스트를 통해 요소를 찾기도 한다. 사용자와 상호작용하지 않는 요소들, div, span, p tag 등에 사용한다.

### 3.1.5. getByDisplayValue

input, textarea, select 등에서 현재 보여지고 있는 value를 통해서 요소를 찾는다. 

## 3.2. 시맨틱 쿼리 함수

### 3.2.1. getByAltText

alt text를 지원하는 img, area, input과 같은 태그로 이루어진 요소라면 이 함수를 통해 요소를 불러올 수 있다.

### 3.2.2. getByTitle

title 속성으로 요소를 불러오지만 이는 스크린 리더에 잘 읽히지도 않고 기본적으로는 보이지 않는다는 단점이 있다.

## 3.3. getByTestId

testid 속성으로 요소를 불러온다. 그러나 이는 사용자에게 보이지 않는 속성이기 때문에 role이나 text로 요소를 매칭시킬 수 없을 때 사용한다. text가 동적으로 변한다든지 하는 상황.


# 4. 쿼리함수 사용하기

Testing Library의 쿼리 함수는 첫 번째 인수로 container를 전달해야 한다. 그런데 React Testing Library를 포함한 대부분의 Testing Library에서 document.body는 워낙 많이 컨테이너로 전달되어, screen 객체를 통해서 쿼리 함수를 사용할 경우 자동으로 document.body를 컨테이너로 전달해준다.

쿼리가 요소를 찾을 때 쓰이는 인수는 문자열, 정규 표현식 혹은 함수가 될 수 있다. 그러면 이제 쿼리 함수에 문자열을 전달해서 요소를 찾은 다음 테스트해보자.

간단한 리액트 컴포넌트를 만든다.

```js
function App() {
  return <h1>안녕하세요</h1>;
}
```

그리고 테스트 코드를 작성한다. [여기](https://www.w3.org/TR/html-aria/#docconformance)를 보면 각 HTML 요소들의 기본 role을 볼 수 있는데, h1~h6 태그의 role은 heading이다. 그래서 getByRole을 사용한다. 

```js
test("Element is in Document", () => {
  render(<App />);
  const titleElement = screen.getByRole("heading");
  expect(titleElement).toBeInTheDocument();
});

test("Text check", () => {
  render(<App />);
  const titleElement = screen.getByRole("heading");
  expect(titleElement).toHaveTextContent("안녕하세요");
});
```

이 상태에서 npm test를 실행해 보면 테스트를 통과하는 것을 확인할 수 있다.

## 4.1. TextMatch

여러 쿼리 함수들이 TextMatch를 인수로 받는다. 그리고 이는 문자열, 정규 표현식, 함수가 될 수 있다. 이때 함수의 형태는 다음과 같다.

```js
(content?: string, element?: Element | null) => boolean
```

다음과 같이 쓰일 수 있는 것이다.

```js
screen.getByText('Hello World') // 문자열을 써서 탐색
screen.getByText(/World/) // 정규표현식으로 탐색
screen.getByText((content, element) => content.startsWith('Hello')) //함수를 이용해서 탐색
```

보통 정규 표현식을 써서 찾는 게 더 광범위하고 복잡한 탐색을 가능하게 한다.

### 4.1.1. TextMatch Options

TextMatch를 받는 함수들은 마지막 인수로 option들을 담은 객체를 전달하여 문자열 매칭을 조정할 수 있다. 그 옵션들은 다음과 같다.

- exact: true일 경우 대소문자를 구분하고 정확히 일치하는 문자열만 찾는다. 기본값은 true이다. false일 경우 대소문자 구분을 안하고 부분 문자열도 매칭한다.(문자열 인수인 경우에만 영향)
- normalizer : 문자열을 정규화하는 함수를 전달할 수 있다. 

### 4.1.2. 정규화

DOM의 텍스트 매칭 작업을 할 때 Testing Lib은 기본적으로 텍스틀 정규화한다. 기본 정규화의 경우 앞뒤 공백을 제거하고 공백을 하나로 합치고, 줄바꿈을 공백으로 바꾼다. 이는 사용자가 보는 텍스트와 일치시키기 위함이다.

만약 따로 정규화 함수를 만들고 싶다면 TextMatch Option들을 담은 객체의 normalizer에 정규화 함수를 전달하면 된다.

혹은 getDefaultNormalizer에 옵션을 전달해서 기본 정규화 함수를 약간 편집해서 사용할 수도 있다. 앞뒤 공백을 제거하는 옵션인 trim, 공백을 하나로 합치는 옵션인 collapseWhitespace를 조정할 수 있다.

```js
screen.getByText('text', {
  normalizer: getDefaultNormalizer({trim: false}),
})
```

위 코드는 'text'가 포함된 요소를 가져오는데 텍스트 정규화 함수가 trim을 하지 않도록 설정한 것이다.

## 4.2. 수동 쿼리

요소들을 가져오기 위해서 Testing Lib의 쿼리 함수들을 사용하는 대신 그냥 querySelector API 등을 사용할 수도 있다. 이렇게 하면 class나 id를 통해서 요소를 가져올 수 있다.

```js
const {container}= render(<App />);
const titleElement = container.querySelector("h1");
```

하지만 이런 부분은 사용자에게 보이는 것이 아니기 때문에 '사용자의 경험과 같은 방식으로 테스트한다'는 원칙에 어긋난다. 따라서 권장되지 않는다. 만약 굳이 시맨틱하지 않은 쿼리를 사용해야 한다면 testid를 사용하자.

# 5. 개별 함수들

앞서 쿼리 함수들의 우선순위에서 어떻게 요소를 찾는지에 따라 달라지는 쿼리 함수들을 간단히 알아보았다. 각 함수들을 공식 문서를 토대로 좀더 자세히 알아보았다. 다만 모든 선택 인수까지 다루기에는 시간이 없어서, 적당히 많이 쓰일 것 같은 기능만 일단 정리하였다.

## 5.1. ByRole

요소의 role을 기반으로 요소를 가져온다. 예를 들어서 button 태그의 role은 button, a 태그의 role은 link이다. role을 기반으로 요소를 가져오기 때문에 시맨틱한 HTML 요소를 사용하는 것이 중요하다.

각 요소의 기본 role은 [여기](https://www.w3.org/TR/html-aria/#docconformance)서 볼 수 있다.

이렇게 기본 설정된 role이나 aria-* 속성을 편집하는 것은 불필요하고 권장되지 않는다. 기본 role과 충돌할 수도 있고.

그리고 accessible name을 기반으로 요소를 가져오는 것도 가능하다. 가령 form 요소의 label, button 요소의 textContent, aria-label의 값 등으로 가져오는 것이다.

같은 역할을 하는 컴포넌트가 여러 개 있을 때 accessible name을 통해서 구분지을 수 있다. 예를 들어서 버튼이 여러 개 있을 때 이 요소들의 role은 모두 button으로 같겠지만 버튼의 accessible name이 다르다면 이를 통해서 구분할 수 있다. `getByRole('button', {name: 'Submit'})` 이런 식으로 말이다.

accessible name은 [이 글](https://www.tpgi.com/what-is-an-accessible-name/)에 더 자세히 설명되어 있다.

## 5.2. ByLabelText

이 쿼리 함수는 TextMatch를 받는다. 그리고 거기 맞는 label을 찾고 그 label에 엮여 있는 요소를 찾는다.

다음과 같은 컴포넌트를 테스트한다.

```js
function App() {
  return (
    <div>
      <label htmlFor="id-input">아이디</label>
      <input id="id-input" />
    </div>
  );
}
```

간단하게 input이 document 안에 있는지만 테스트한다. input 요소를 가져올 수 있는지만 체크하면 되기 때문에.

```js
test("Element is in Document", () => {
  render(<App />);
  const titleElement = screen.getByLabelText("아이디");
  expect(titleElement).toBeInTheDocument();
});
```

단 만약 라벨 텍스트와 input의 id가 다르다면 getByLabelText는 요소를 찾지 못한다. 이런 경우에는 getByRole을 사용하면 된다. aria-label 같은 걸 사용하는 것보다 이편이 더 권장된다.

```js
getByRole('textbox', {name: '아이디'})
```

## 5.3. 나머지 쿼리 함수들

나머지들은 거의 위에서 설명한 것 이상의 의미가 없었다. 그냥 TextMatch 인수만 잘 넣어주면 알아서 찾는다.

# 6. 이벤트 발생시키기

fireEvent 대신 userEvent를 사용하는 게 권장된다. userEvent도 fireEvent를 사용하지만 엘리먼트 타입에 따라서 더 적절한 반응을 보여준다. 클릭한 버튼이 focus되는 등이다. 따라서 userEvent를 사용하는 법을 간단히 보았다.

먼저 컴포넌트 렌더링 이전에 userEvent.setup()을 실행하고 거기서 리턴된 객체를 이용해 이벤트를 발생시키는 것이 권장된다. `userEvent.click(element)`와 같이 즉시 실행하는 것도 가능하지만 이는 v13에서 v14로의 마이그레이션을 수월하게 하기 위해서일 뿐이다.

그리고 userEvent.setup()에서 리턴된 객체들은 하나의 상태를 공유하므로 테스트를 계속 이어갈 수 있다. 예를 들어서 첫 번째 테스트에서 버튼을 클릭하고 두 번째 테스트에서 버튼이 클릭되었는지 확인할 수 있다.

```js
test("Button click", () => {
  const user=userEvent.setup();
  render(<App />);
  // Click me라고 쓰인 버튼을 가져온다
  const button = screen.getByRole("button",{name:"Click me"});
  user.click(button);
});
```

다음과 같은 App 컴포넌트를 작성하면 테스트가 통과된다.

```js
function App() {
  return (
    <div>
      <button>Click me</button>
    </div>
  );
}
```

## 6.1. userEvent api

pointer, keyboard, clipboard, click/dblClick/tripleClick 등 많은 사용자 이벤트가 있지만 좀 써보고 정리 예정

# 참고

https://testing-library.com/docs/queries/about
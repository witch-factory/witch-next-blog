---
title: JS의 템플릿 리터럴
date: "2022-12-22T00:00:00Z"
description: "JS의 템플릿 리터럴에 관하여"
tags: ["javascript"]
---

JS의 템플릿 리터럴 문법에 대해 정리하였다.

# 1. 개념

템플릿 리터럴은 ES6에 새로 들어온 문자열 표기법으로 문자열을 표기할 때 사용한다. 그리고 기존에 따옴표를 사용하던 표기 대신 백틱(`)을 사용한다. 다음과 같이 기존 문자열 표기와 똑같은 방식으로도 사용할 수 있다.

```js
let word=`witch`;
console.log(word);
```

그리고 기본적으로 여러 줄 문자열과 표현식 삽입이 가능하다. `${}`로 싸인 부분에 들어간 표현식은 평가되어서 문자열에 삽입된다.

```js
// 여러 줄 문자열 예시
let word=`저는
김성현
입니다`;
console.log(word);

// 표현식 삽입
let myName="김성현"
let word=`저는 ${myName}입니다`;
console.log(word);
```

그리고 템플릿 리터럴 안에서 `을 사용하기 위해서는 앞에 백슬래시를 붙여야 한다.

```js
let word=`\` <- 이건 백틱입니다.`;
console.log(word);
```

# 2. 태그 함수

이를 발전시킨 방식이 tagged template이다. 태그 함수를 사용해 템플릿 리터럴을 함수로 파싱하여 여러 동작을 할 수 있는 것이다. 태그 함수는 템플릿 리터럴을 인자로 받아서 처리한 후에 반환한다. 꼭 문자열을 반환할 필요는 없다.

사용 방식은 다음과 같다.

```js
태그함수명`템플릿 리터럴`
```

이때 태그함수의 첫번째 인자로는 `${}`로 감싸이지 않은 일반 문자열들이 `${}`를 단위로 구분되어 split된 배열이 들어가고 두번째 인자부터는 `${}`로 감싸인 표현식들이 들어간다.

예를 들어서 다음과 같은 코드가 있다고 하자.

```js
function tag(strings, arg1, arg2){
  console.log(strings, arg1, arg2);
}

let myName="김성현"
let myAge=25;

tag`저는 ${myName}이고 ${myAge}살입니다.`;
```

위 코드에서 tag 함수는 템플릿 리터럴을 파싱한 결과들이 인수로 들어가서 호출된다. 첫번째 인자로는 `${}`로 감싸이지 않은 문자열들 즉 `"저는 ", "이고 ", "살입니다"`가 담긴 배열이 들어가고 두번째 인자부터는 `${}`로 감싸인 표현식들이 들어간다. 즉, `myName`과 `myAge`가 들어간다.

따라서 tag 함수 내부의 console.log는 다음과 같은 결과를 출력한다.

```js
["저는 ", "이고 ", "살입니다"] "김성현" 25
```
주의할 점은 일반 문자열이 `${}`를 기준으로 split되므로 마지막 `${}`뒤에 아무 내용이 없더라도 빈 문자열이 들어간다는 것이다. 

예를 들어서 아래 코드의 tag 함수가 호출될 때 strings에는 `["저는 ", ""]`이 들어간다. `${myName}`뒤에 아무 내용이 없음에도 불구하고 빈 문자열이 파싱되어 들어간다.

```js
function tag(strings, arg1){
  console.log(strings, arg1);
}

let myName="김성현"

tag`저는 ${myName}`;
```

## 2.1. raw string

태그 함수로 String.raw를 사용하면 템플릿 리터럴의 원시 문자열을 얻을 수 있다. `${}`로 감싸인 문자열은 대체되지만 이스케이프 문자는 처리되지 않는 것이다.

```js
let str = String.raw`Hi \n${myName}!`;
// 이스케이프 문자가 처리되지 않아 Hi \nwitch! 가 출력된다.
console.log(str);
```

# 3. 응용

이런 템플릿 리터럴을 어떻게 사용할 수 있을까? 가장 대표적인 예로는 HTML 템플릿을 만드는 데에 사용할 수 있다.

예를 들어 다음과 같은 내 정보 객체가 있다고 하자.

```js
const me={
  name:"Kim Sung Hyun",
  blog:"https://www.witch.work/"
}
```

이 객체를 이용해서 다음과 같은 재사용 가능한 HTML 템플릿을 만드는 함수를 만들 수 있다. 

```js
function makeMarkUp({name, blog}){
  return `
    <div class="me">
      <h1>${name}</h1>
      <a href="${blog}">${blog}</a>
    </div>
  `;
}

console.log(makeMarkUp(me));
```

태그 함수를 이용하면 같은 동작을 더 세련되게도 할 수 있다. 

먼저 다음과 같은 태그 함수를 만들자. 위와 같은 동작을 위해서는 즉시 실행 함수를 리턴해 줘야 한다. 

```js
function templater(strings, ...keys){
  return function(data){
    // strings 복사본 만들기
    let temp = strings.slice();
    // 각 strings의 뒤에 오는 표현식(${}로 감싸였던 것)의 결과를 붙여 준다. 
    keys.forEach((key, idx)=>{
      temp[idx] = temp[idx] + data[key];
    });
    // 나눠진 문자열들을 붙여 준다.
    return temp.join('');
  }
}
```

그럼 똑같이 `makeMarkUp` 함수를 만들 수 있다. 

```js
const makeMarkUp = templater`
  <div class="me">
    <h1>${'name'}</h1>
    <a href="${'blog'}">${'blog'}</a>
  </div>
`;
console.log(makeMarkUp(me));
``` 

또한 이 templater 함수를 사용하면 다른 템플릿도 얼마든지 만들 수 있다.

```js
const costInfo={
	goods:"카페라떼",
  cost:4500,
}

const makeCostMarkUp = templater`
  <div class="cost">
    <h1>${'goods'}</h1>
    <h2>${'cost'}원</h2>
  </div>
`;

console.log(makeCostMarkUp(costInfo));
```

# 참고

MDN의 템플릿 리터럴 문서 https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals

MDN String.raw() https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/raw

poiemaweb의 템플릿 리터럴 설명 https://poiemaweb.com/es6-template-literals

CSS Tricks의 템플릿 리터럴에 관한 글 https://css-tricks.com/template-literals/

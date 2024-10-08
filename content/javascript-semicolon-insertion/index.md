---
title: JS 탐구생활 - 세미콜론 자동 삽입
date: "2024-08-23T01:00:00Z"
description: "JS는 코드에 세미콜론을 자동으로 넣어준다. 그 규칙을 알아보자."
tags: ["javascript"]
---

(2022.12.16 첫 작성)

(2024.08.23 업데이트)

# 1. 시작

## 1.1. 세미콜론 자동 삽입

Javascript는 원래 세미콜론을 생략하여 코드를 짤 수도 있는 언어이다. 다음과 같은 코드는 세미콜론이 전혀 없지만 잘 동작한다.

```js
const name = "마녀"

function greet() {
  return `안녕하세요, 저는 ${name}입니다.`
}

console.log(greet())
```

이런 코드가 동작하는 이유는 Javascript 엔진이 코드를 해석할 때 세미콜론을 자동으로 삽입해 주기 때문이다. 이를 세미콜론 자동 삽입(automatic semicolon insertion)이라고 하며 ECMAScript 표준 명세서에도 정의되어 있다.

하지만 이런 세미콜론 자동 삽입이 만능은 아니다. 대표적으로 다음과 같은 [예시](https://ko.javascript.info/structure)를 들 수 있다.

```js
alert("에러가 발생합니다.")

// TypeError: Cannot read properties of undefined (reading '2')
[1, 2].forEach(alert)
```

이 코드를 실행해 보면 `alert`까지만 잘 실행되고 그 뒤에 에러가 발생한다. 이는 Javascript가 위 코드의 대괄호 앞에 세미콜론을 자동 삽입하지 않기 때문이다. 그래서 위 코드는 다음과 같이 해석된다.

```js
alert("에러가 발생합니다.")[1, 2].forEach(alert)
```
이렇게 변환해 보니 에러가 발생하는 게 당연한 코드가 되었다.

세미콜론 자동 삽입은 세미콜론을 생략할 수 있게 해주어서 어떻게 보면 깔끔해 보이는 코드를 짤 수 있게 해주기도 하지만 이렇게 에러의 원인이 되기도 한다. 따라서 세미콜론을 생략하는 스타일로 코드를 짜고 싶다면 규칙과 주의사항을 잘 알고 있어야 한다.

그럼 대체 세미콜론 자동삽입이라는 게 어떤 규칙을 따르는 것인지, 또 세미콜론을 생략하려면 어떤 것을 주의해야 하는지 이 글을 통해 알아보자. ECMAScript 명세 그리고 "이펙티브 자바스크립트"등 몇 권의 책에서 풀어서 쓴 설명을 참고하였다.

## 1.2. 세미콜론으로 끝나는 문장

먼저 Javascript에서 세미콜론으로 끝나야 하는 종류의 문장들은 다음과 같다. 이 문장들이 이후 설명할 세미콜론 자동 삽입의 영향을 받는다고 생각할 수 있다.

- 빈 statement
- let, const, var statement
- expression statement
- do...while
- continue, break, throw, return
- import, export statement, 모듈 선언
- 클래스 필드 선언
- debugger


빈 statement와 expression statement가 낯설 수 있는데 이 의미는 다음과 같다.

- 빈 statement

말 그대로 아무것도 하지 않는 statement이다. 이는 세미콜론으로 끝나야 한다.

```js
;
```

예를 들어서 for문의 본문으로 쓸 수 있다. 다음 코드의 경우 `arr`의 모든 요소를 0으로 바꾸는 코드인데 for문의 반복 자체가 목적이므로 본문을 빈 statement로 두었다.

```js
let arr = [1, 2, 3, 4, 5];
for (let i = 0; i < arr.length; arr[i] = 0, i++);
```

- expression statement

표현식으로 이루어지는 statement이다. 이 표현은 평가되고 그 결과는 버려진다. 간단하게는 다음과 같은 것을 들 수 있다. 

```js
1 + 2; 
```

변수에 값을 할당하는 할당 연산자도 연산자기 때문에 할당문도 하나의 expression이다. 이런 식으로 side effect가 있는 expression이 사용된다.

```js
a = 3; //이는 3으로 평가되지만 결과는 버려진다
```

# 2. 네 가지 규칙

본격적으로 세미콜론 자동 삽입이 따르는 규칙을 알아보자. 이는 정리하면 4가지의 규칙으로 정리할 수 있다.

## 2.1. 첫번째 규칙

> 세미콜론은 다음 입력 토큰을 파싱할 수 없을 때에만 삽입된다.
>
> "이펙티브 자바스크립트" p. 27

Javascript 프로그램은 토큰들의 스트림으로 이루어져 있다. 이 토큰들의 스트림은 파서에 의해 왼쪽에서 오른쪽으로 파싱된다. 이때 토큰이란 파싱의 단위인데 단순히 말하면 Javascript의 예약어, 식별자, 리터럴, 구두점 등 코드를 구성하는 최소 단위를 말한다. 글의 주요한 주제는 아니므로 그냥 파싱의 단위 정도로 생각하면 된다.

그런데 이렇게 코드를 파싱하는 과정에서 문법적으로 맞지 않는 구문을 만드는 토큰(offending token)이 나올 때가 있다. 이때 두번째 규칙에서 설명할 조건이 만족되면 이러한 토큰 앞에 세미콜론을 삽입한다.

즉 세미콜론 자동 삽입은 문법을 위반하는 코드를 보정해 주는 역할을 한다고 할 수 있다. 예를 들어 이런 코드가 있다고 하자.

```js
a = b
func()
```

이 코드를 만약 `a = b func()`과 같이 파싱한다면 오류가 날 것이다. 따라서 offending token인 `func` 앞에 세미콜론이 삽입되어 `a = b; func()`로 해석된다.

## 2.2. 두번째 규칙

> 세미콜론은 한 줄 이상의 새로운 행이나 프로그램 입력의 마지막이나 `}` 토큰 전에만 삽입된다.
>
> "이펙티브 자바스크립트" p. 26

첫번째 규칙에서 설명한 것처럼 세미콜론은 문법적으로 맞지 않는 구문을 만드는 offending token 앞에 삽입된다. 그러나 파싱 과정에서 offending token이 나온다고 해서 무조건 세미콜론이 삽입되는 것은 아니다. 세미콜론이 삽입되는 조건들은 다음과 같다.

- offending token이 이전 토큰과 줄바꿈 기호로 구분되어 있을 때 offending token 앞에 세미콜론을 삽입
- offending token이 `}`일 때 offending token 앞에 세미콜론을 삽입
  - 예를 들어서 `{1 2} 3`에서 `}`이 파싱되면 문법적으로 맞지 않으므로, offending token인 `}` 이전에 세미콜론을 삽입한다. 따라서 `{1 2;} 3`으로 해석된다.
- 이전 토큰이 `)`이고 삽입된 세미콜론이 do-while문을 끝내는 세미콜론이 될 때 `)` 다음에 세미콜론을 삽입
- 토큰들의 입력 스트림이 끝났고 파서가 토큰 스트림을 하나의 완전한 프로그램으로 파싱할 수 없다면 입력 스트림의 끝에 세미콜론을 삽입

이때 줄바꿈 기호란 말 그대로 줄바꿈 문자이며 명세에서 `LineTerminator`로 정의되는 기호이다. 널리 알려진 `\n`(Line Feed) 외에도 `\r`(Carriage Return), `\u2028`(Line Separator), `\u2029`(Paragraph Separator) `\r\n`(Carriage Return + Line Feed)가 있다.

토큰 스트림을 하나의 완전한 프로그램으로 파싱할 수 없다는 것은 프로그램 코드를 파싱했을 때 완전한 프로그램으로 간주할 수 없는 경우를 말하는데, 간단한 예시로 다음과 같은 경우를 말한다.

```js
let a = 1
++a
```

그러면 파서는 먼저 `let a=1` 뒤에 세미콜론을 삽입한다. 이전 토큰인 `1`과 `++` 이 줄바꿈으로 구분되어 있고 이를 `a=1 ++a`로 해석하면 문법적으로 맞지 않아서 `++`가 offending token이기 때문이다.

그런데 이렇게 파싱된 토큰 스트림 `let a=1; ++a`는 완전한 프로그램으로 파싱될 수 없다. `++a`뒤에 세미콜론이 없기 때문이다. 따라서 자동으로 끝에 세미콜론을 삽입한다.

즉 자동 세미콜론 삽입의 결과는 다음과 같다.

```js
let a = 1;
++a;
```

다시 말해서 파싱된 코드가 완전한 프로그램으로 간주될 수 없다면 세미콜론이 자동으로 삽입된다는 것이다.

## 2.3. 세번째 규칙

> 자바스크립트는 파싱 오류로 판명되지 않더라도 강제적으로 세미콜론을 삽입하는 경우가 있다. 이것들은 소위 자바스크립트 문법의 제한된 생성(restricted production)이라고 부르는데, 두 토큰 사이에 새로운 행이 허용되지 않는다는 의미다.
>
> "이펙티브 자바스크립트" p. 31

프로그램을 파싱해서 나온 결과가 문법적으로 맞더라도, Javascript 명세에서는 특정한 키워드와 부가적인 인자 사이에 줄바꿈을 허용하지 않는다. 그런 자리에 줄바꿈이 들어가면 자동으로 세미콜론이 삽입된다.

이런 상황을 만드는 대표적인 키워드에는 `return` 이 있다. `return` 다음에 오는 리턴값 사이에 새로운 행이 포함되면 제대로 동작하지 않는다. 다음과 같은 코드를 보자.

```js
return
a + b
```

이를 `return a+b`로 파싱하더라도 문법적으로는 맞지만, `return`과 `a+b`사이에 줄바꿈이 들어갔기 때문에 자동으로 세미콜론이 삽입된다.

만약 이렇게 줄바꿈을 넣어서 `return`과 `a+b`를 구분하고 싶다면, `return` 다음에 괄호로 리턴값을 감싸줄 수 있다. [비슷한 예시를 React 공식 문서의 마크업 리턴에 관한 부분에서도 다루고 있다.](https://react.dev/learn/your-first-component#step-3-add-markup)

마크업이 `return` 키워드가 있는 줄을 벗어난다면 이렇게 괄호로 감싸는 것이다.

```jsx
return (
  <div>
    <h1>Hello, world!</h1>
  </div>
)
```

이 규칙이 적용되는 경우를 모두 쓰면 다음과 같다. 이러한 특정한 키워드와 부가적인 인자 사이에 줄바꿈 기호가 들어가게 되면 자동으로 그 자리에 세미콜론이 삽입된다. 다음 목록에서는 그런 자리를 `<여기>`로 표시하였다.

- break, continue와 명시적인 라벨 사이
  - `break <여기> label;`, `continue <여기> label;`
- return, throw와 표현식 사이
  - `return <여기> expression;`, `throw <여기> expression;`
- yield와 표현식/*로 시작하는 표현식 사이
  - `yield <여기> expression;`, `yield <여기> * expression;`
- 화살표 함수의 인자 목록과 화살표 사이
  - `(param1, param2...) <여기> => expr`
- async 키워드와 `function`, `function*`, 화살표 함수 선언 사이
  - `async <여기> function() {}`, `async <여기> function*() {}`, `async <여기> () => {}`(물론 화살표 함수 인자 목록과 화살표 사이에도 해당)
- async 키워드와 클래스 메서드 선언 사이
  - `async <여기> method() {}`, `async <여기> *method() {}`
- 표현식과 postfix expression 사이
  - `expression <여기> ++`, `expression <여기> --`

이때 postfix expression에 대해 이 규칙이 붙은 것은 다음과 같은 코드의 불확실성을 해소하려는 것이다. 예를 들어 다음 코드에 세미콜론이 자동 삽입되지 않는다면 `++`가 `a`에 대한 postfix인지 `b`에 대한 prefix인지 알 수 없게 된다.

```js
a
++
b
```

세번째 규칙에 의해 `a`와 `++` 사이에 세미콜론이 삽입되어 이 코드는 다음과 같이 해석된다.

```js
a;
++b;
```

2번째 규칙에 의해서 프로그램의 마지막에도 세미콜론이 삽입된 것을 볼 수 있다.

## 2.4. 네번째 규칙

> 세미콜론은 for 반복문의 구분자나 빈 선언문으로 절대 삽입되지 않는다.
>
> "이펙티브 자바스크립트" p. 33

for 루프의 구분자, 혹은 빈 문장(`;`)이 필요할 때는 반드시 명시적으로 세미콜론을 삽입해야 한다는 것이다. 달리 말하면 세미콜론이 삽입될 경우 for 루프의 구분자 혹은 빈 문장으로 간주될 경우에는 세미콜론이 삽입되지 않는다.

예를 들어 다음 코드에서는 offending token과 줄바꿈이 있지만 세미콜론이 삽입될 시 for 루프의 구분자로 해석되기 때문에 세미콜론이 삽입되지 않고 따라서 그냥 오류가 발생한다.

```js
for (let i = 0, total = 1
  i < 10
  i++) {
  total *= i;
}
```

같은 이유로 본문이 빈 문장인 루프문도 명시적으로 세미콜론을 넣어 줘야 한다.

```js
function loop() { while (false) } // 파싱 오류
function loop() { while (false); } // 잘 파싱된다
```

# 3. 세미콜론의 생략에 관하여

요즘은 세미콜론을 자동으로 넣어 주는 것이 권장되는 경우도 많고, 일부러 신경쓰지 않아도 자동으로 세미콜론을 넣어 주는 코드 교정 도구가 많다. 따라서 일반적으로 세미콜론을 늘 명시적으로 넣는 일이 많은 듯 하다.

하지만 세미콜론을 생략하는 스타일을 선호하는 사람도, 또 그런 스타일로 짜인 기존 코드들도 많다. 따라서 이런 스타일을 따르고 싶거나 사용하고 싶다면 세미콜론 자동 삽입의 규칙을 잘 알고 있어야 한다. 그렇지 않고 무작정 생략할 경우 코드가 의도대로 동작하지 않을 수도 있기 때문이다.

예를 들어 다음의 프로그램은 각 문장의 끝에 3개의 세미콜론이 삽입되어 잘 동작한다.

```js
a = b
var x
(f())
```

하지만 이 순서가 바뀌면 세미콜론이 삽입되지 않아 오류가 발생한다.

```js
a = b // 여기에 제대로 세미콜론이 삽입되지 않는다
(f())
var x
```

그래서 이 섹션에서는 무작정 세미콜론을 생략할 경우 생길 수 있는 경우들과 생략시 지켜야 할 규칙들을 알아본다.

## 3.1. 세미콜론 생략 문제사례

세미콜론 자동 삽입은 코드 파싱 과정에서 일어난다. 그렇기 때문에 문법적으로 말이 되는 코드라면 세미콜론이 삽입되지 않는다. 특히 `(`, `[`, `+`, `-`, `/`, <code>\`</code>를 조심해야 한다. 문맥에 따라 연산자 혹은 접두사로 해석될 수 있기 때문이다.

예를 들어 함수가 즉시 실행 함수 표현식이라 괄호로 싸여 있었다고 해보자.

```js
a = b
(function() { console.log('hello') })()
```

이 코드는 파싱 과정에서 `a=b(function(){console.log('hello')})()`로 해석될 수 있다. 만약 `b`가 함수라면 제대로 실행될 코드일 수도 있다. 이렇게 하나의 선언으로 잘 실행될 수도 있기에 중간에 세미콜론은 삽입되지 않는다. 앞서 보았던 `a = b`와 `(f())`사이에 세미콜론이 삽입되지 않은 것도 같은 이유이다. `a = b(f())`로 해석될 수 있기 때문이다.

`[`를 조심해야 하는 예시로 배열에 관한 예시도 있다. 이런 코드를 들 수 있다.

```js
func()
['ul', 'ol'].forEach(function(tag){ handleTag(tag) });
```

2행의 대괄호는 `func()`의 결과를 인덱싱하는 걸로, 대괄호 내의 쉼표는 쉼표 연산자로 해석된다. 따라서 다음 코드는 자동 세미콜론 삽입이 일어나지 않고, 의도치 않게 이렇게 해석된다.

```js
func()['ol'].forEach(function(tag){ handleTag(tag) });
```

`+`, `-`, `/`는 선언문 처음에 나타나는 경우는 많지 않지만 `/`같은 경우 정규 표현식 리터럴에 사용되기 때문에 주의해야 한다. 예를 들어 이런 코드를 보자.

```js
a = b
/hi/g.exec('hi');
```

이 코드는 `a=b/hi/g.exec('hi')`로 해석될 수 있다. 정규 표현식의 `/`가 나눗셈 연산자로 파싱되는 것이다. 따라서 세미콜론이 삽입되지 않고 당연히 의도대로 동작하지 않거나 에러가 발생한다.

따라서 세미콜론을 생략할 때는 다음 줄의 첫 토큰을 잘 살펴봐야 한다. 다음 줄의 첫 토큰이 이전 코드의 연장선으로 해석될 수 있다면 세미콜론을 생략할 경우 문제가 생길 수 있다.

이런 문제는 간단한 코드에서만 발생하는 것이 아니다. 스크립트 병합에서도 문제를 일으킬 수 있다. 이전에 모듈 시스템이 표준이 아니었던 시절에는 스크립트 병합 시 각 파일이 서로에게 영향을 받지 않도록 즉시 실행 함수 표현식으로 각 파일을 감싸는 게 추천되었다. 따라서 다음과 같은 코드들을 담은 파일들이 많았다.

```js
//file1.js
(function(){
  //code
})()

//file2.js
(function(){
  //code 2
})()
```

이때 파일들이 하나로 병합되어 실행된다면 다음과 같이 처리되어서 문제가 발생할 수 있다.

```js
(function(){
  //code
})()(function(){
  //code 2
})()
```

물론 스크립트 병합 도구에서 이런 부분들을 적절히 처리해 주면 좋을 것이다. 그러나 모든 스크립트 병합 도구가 잘 짜인 것은 아니기 때문에(by "이펙티브 자바스크립트") 병합될 가능성이 있는 파일들의 시작에 세미콜론을 넣어주는 스타일을 고려할 수 있다.

```js
//file1.js
;(function() {
  //code
})()
```

## 3.2. 세미콜론 생략시 지킬 규칙

세미콜론을 생략하는 스타일이 깔끔해 보여서 따르고 싶다면, 세미콜론 자동 삽입의 규칙을 잘 알고 있어야 한다.

일단 두번째 규칙에 따라, 세미콜론을 생략하려면 줄의 마지막 부분, 블록의 마지막 부분, 프로그램의 마지막 부분에만 세미콜론을 생략할 수 있다.

다음과 같이 줄바꿈이 없는 곳에 세미콜론을 생략했을 경우 자동 세미콜론 삽입이 제대로 되지 않아 오류가 발생한다.

```js
// Uncaught SyntaxError: Unexpected token 'return'
function area(r) {
  r = Number(r) return Math.PI * r * r;
}
```

그리고 앞서 언급한 줄바꿈을 허용하지 않는 키워드들 즉 restricted production을 생각하면서 넣어야 한다. 명세와 MDN에서 권장하는 규칙은 다음과 같다.

- postfix `++`, `--`는 피연산자와 같은 줄에 있어야 한다.
- `return`, `throw`, `break`, `continue`, `yield`는 다음 토큰과 같은 줄에 있어야 한다.
  - 만약 리턴값 등이 길어서 줄바꿈을 넣고자 한다면, 리턴값을 괄호로 감싸서 줄바꿈을 허용할 수 있다.
```js
return (
  someLongExpression
)
```
- 화살표 함수의 화살표는 인자 목록과 같은 줄에 있어야 한다.
- async 키워드는 다음에 오는 토큰(`function` 키워드, 메서드명 등)과 같은 줄에 있어야 한다.
- 만약 한 줄의 시작이 `(`, `[`, `+`, `-`, `/`, <code>\`</code> 중 하나라면 그 앞에 세미콜론을 넣어야 한다. 혹은 이전 줄의 끝에 세미콜론을 넣는다.
- 클래스 필드 선언은 늘 세미콜론으로 끝내는 게 좋다.
```js
class A {
  a = 1
  [b] = 2
  *gen() {} // 세미콜론 생략으로 인해 a = 1[b] = 2 * gen() {}로 해석되어 버린다!
}
```

개인적인 느낌과 경험으로는 Javascript로 개발 시 세미콜론을 넣어주는 것이 일반적으로 더 권장되는 편이었다. 그 이유는 위에서 본 것과 같이 자동 세미콜론 삽입 규칙이 복잡하며, 요즘은 어차피 그 정도는 자동 코드 교정 도구가 해주기 때문이라고 본다.

세미콜론을 넣어주는 게 그렇게 어려운 일도 아닌데, 파서가 에러를 정정할 기회를 주는 것 뿐인 자동 세미콜론 삽입을 믿고 코드를 짜는 것은 좋지 않다고 본다. 하지만 위와 같은 규칙들을 잘 지키면서 세미콜론을 생략하는 스타일을 따른다면 문제가 생길 가능성은 줄일 수 있을 것이다.

또한 이런 스타일로 짜인 기존 코드를 리팩토링하거나 그런 조직에 가게 되면 이런 것을 알고 있는 건 큰 도움이 될 것이다.

# 참고

모던 자바스크립트 튜토리얼, "코드 구조"

https://ko.javascript.info/structure

JavaScript/Automatic semicolon insertion

https://en.wikibooks.org/wiki/JavaScript/Automatic_semicolon_insertion

Lexical grammar

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar

Empty statement

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/Empty

https://tc39.es/ecma262/#sec-rules-of-automatic-semicolon-insertion

https://www.informit.com/articles/article.aspx?p=1997934&seqNum=6

악셀 라우슈마이어 지음, 한선용 옮김, "자바스크립트를 말하다"

데이비드 허먼 지음, 김준기 옮김, "이펙티브 자바스크립트"
---
title: JS 탐구생활 - 세미콜론 자동 삽입
date: "2022-12-16T01:00:00Z"
description: "JS는 코드에 세미콜론을 자동으로 넣어준다. 그 규칙을 알아보자."
tags: ["javascript"]
---

# 1. 시작 - 세미콜론을 삽입하자

JS에서는 줄바꿈이 일어나는 부분에 대해 대부분의 경우 세미콜론을 자동으로 삽입해 준다. 하지만 그렇지 않은 경우가 몇 가지 있고 만약 세미콜론을 명시적으로 삽입하지 않았을 경우 원하지 않는 동작이 일어날 수 있다. 따라서 세미콜론을 명시적으로 삽입해 주는 것이 권장된다.

하지만 규칙을 말하기 전에, 세미콜론 자동 삽입이 어떤 규칙에 따라 일어나며 어떻게 문제가 될 수 있는지 알아보자.

[이 글](https://ko.javascript.info/structure)에서는 먼저 다음과 같은 예시를 든다.

```js
alert(3 + 
1
+ 2);
```

직관적으로 3+1+2 가 하나의 표현식으로 해석되는 게 맞기 때문에 이렇게 동작한다는 것을 느낄 수 있다. 그러나 다음과 같은 경우는 어떨까? 이 역시 위 글에서 든 예시이다.

```js
alert("에러가 발생합니다.")

[1, 2].forEach(alert)
```

새롭게 추가한 alert만 잘 실행되고 그 뒤에 에러가 발생한다. 이는 js가 대괄호 앞에는 세미콜론을 자동 삽입하지 않기 때문이다. 그래서 위 코드는 다음과 같이 해석된다.

```js
alert("에러가 발생합니다.")[1, 2].forEach(alert)
```
이렇게 변환해 보니 에러가 발생하는 게 당연한 코드가 되었다.

그럼 대체 세미콜론 자동삽입이라는 게 어떤 규칙을 따르는 것이길래 이런 일이 일어나는지 알아보자.

# 2. 기본 규칙

몇몇 종류의 JS statement들은 세미콜론으로 끝나야 한다. 이들은 다음과 같다.

- 빈 statement
- let, const, var statement
- import, export statement, 모듈 선언
- expression statement
- debugger
- continue, break, throw, return

따라서 위의 종류들은 자동 세미콜론 삽입에 영향을 받게 된다. 이때 좀 낯선 것 2개가 있어서 간단히 설명하였다.

# 3. statement 설명

## 3.1. 빈 statement

말 그대로 아무것도 하지 않는 statement이다. 이는 세미콜론으로 끝나야 한다.

```js
;
```

예를 들어서 for문의 body에 쓸 수 있다. for문이 시행하는 반복 그 자체가 중요한 경우이다.

```js
let arr=[1,2,3,4,5];
for(let i=0;i<arr.length;arr[i]=0,i++);
```

위와 같이 한 경우 for문의 body는 빈 statement가 된다. 단 이를 일부러 사용할 경우 실수를 유발할 수 있으므로 주석을 꼭 달아주자.

```js
if(something);
  func(); //if문이 빈 statement로 해석되었으므로 func는 무조건 실행된다
```

## 3.2. expression statement

단순히 어떤 표현으로 이루어지는 statement이다. 이 표현은 평가되고 그 결과는 버려진다. 간단하게는 다음과 같은 것을 들 수 있다. 

```js
1+2;
```

변수에 값을 할당하는 할당 연산자도 연산자기 때문에 할당문도 하나의 expression이다. 이런 식으로 side effect가 있는 expression이 사용된다.

```js
a=3; //이는 3으로 평가되지만 결과는 버려진다
```

# 4. 자동 세미콜론 삽입 규칙

ECMAscript에서 설명하는 세미콜론 자동 삽입의 규칙들은 다음과 같다.

## 4.1. 첫번째 규칙

코드가 왼쪽에서 오른쪽으로 파싱되는 중에 문법에 의해 허용되지 않는 토큰(이를 offending token이라 한다)이 나올 때가 있다. 이때 다음 조건 중 하나 이상이 만족되면 해당 토큰 앞에 세미콜론을 삽입한다.

- offending token이 이전 토큰과 line terminator(라인 피드, 캐리지 리턴, 줄 구분 기호, 단락 구분 기호, 캐리지리턴+라인피드)로 구분되어 있을 때
- offending token이 }일 때
- 이전 토큰이 )이고 삽입된 세미콜론이 do-while문을 끝내는 세미콜론이 될 때

예를 들어서 `{1 2} 3`에서 `}`이 파싱되면서 문법적으로 맞지 않으므로, offending token인 } 이전에 세미콜론을 삽입한다. 따라서 `{1 2;} 3`으로 해석된다.

## 4.2. 두번째 규칙

토큰들을 왼쪽에서 오른쪽으로 파싱하다가, 토큰들의 스트림이 끝났고 파서가 토큰 스트림을 하나의 완전한 프로그램으로 파싱할 수 없다면 입력 스트림의 끝에 세미콜론을 삽입한다.

예를 들어서 다음과 같은 프로그램을 보자.

```js
let a=1
++a;
```

그러면 파서는 먼저 `let a=1` 뒤에 세미콜론을 삽입한다. `++`와 `1`사이에 줄바꿈 문자, 즉 line terminator가 있기 때문이다. 

그리고 `++a`를 파싱하면서 스트림이 끝나고 이는 완벽한 프로그램이 아니므로 자동으로 끝에 세미콜론을 삽입한다.

즉 자동 세미콜론 삽입의 결과는 다음과 같다.

```js
let a=1;
++a;
```

## 4.3. 세번째 규칙

특정한 statement 뒤에 line terminator가 나올 때 자동으로 그 뒤에 세미콜론이 삽입된다. 즉 다음과 같은 statement 뒤에 line terminator가 있을 때 자동으로 세미콜론이 삽입된다.

- continue
- break
- return
- yield, yield*
- module
- postfix expression(++, --)

```js
return
a+b
```

따라서 위 코드는 다음과 같이 변환된다. return 뒤에 세미콜론이 자동 삽입된 것이다.

```js
return;
a+b;
```

## 4.4. 네번째 규칙

위 세 가지 규칙들에 우선하는 규칙이 또 있다. 만약 세미콜론이 삽입되었을 경우 empty statement로 파싱되게 되거나 for문의 헤더에 필요한 2개의 세미콜론 중 하나로 간주되게 된다면, 세미콜론은 절대 삽입되지 않는다.

```js
for(let i=0
i<n;i++){
  console.log(i);
}
```

만약 `let i=0`뒤에 세미콜론이 삽입된다면 for문의 헤더에 있는 2개의 세미콜론 중 하나로 간주될 것이다. 이런 경우에는 세미콜론이 삽입되지 않는다. empty statement로 파싱되는 경우도 마찬가지이다.

```js
while(true)
```

여기의 뒤에 세미콜론이 삽입된다면 empty statement로 파싱되게 된다. 이런 경우에도 세미콜론이 삽입되지 않는다.

# 5. 세미콜론을 넣어야 하는 이유

JS에서도 명시적으로 세미콜론을 넣어 주는 것이 일반적으로 권장되고 있다. 그 이유는 위에서 본 것과 같이 자동 세미콜론 삽입의 규칙이 복잡하기 때문이다. 예를 들어서 다음과 같은 코드를 보자.

```js
a=b
func();
```

위 코드를 파싱할 때는 다음과 같이 해석될 것이다.

```js
a=b func();
```

이는 문법적으로 말이 되지 않는다. 문법에 맞지 않도록 만든 토큰은 func이고 이는 원래 코드를 보면 앞선 토큰과 line terminator로 구분되어 있다. 따라서 자동 세미콜론 삽입의 첫번째 규칙에 의해 `a=b; func()`로 해석된다.

그러나 다음 코드는 어떤가?

```js
a=b
(func());
```
다음 코드를 파싱하면 `a=b(func())`가 되는데 이는 b가 만약 함수라면 문법적으로 말이 된다. 그리고 js에서는 함수 또한 객체이기 때문에 b가 변수든 함수든 객체로 취급되고, 따라서 컴파일 타임에 파서가 `a=b(func())`의 오류를 잡아낼 수 없다.

세미콜론 자동 삽입은 파싱한 토큰이 제대로 작동할 수 없을 때만 일어난다. 하지만 이는 컴파일 타임에 알아낼 수 있는 부분만 해당된다. `문법적으로 말이 되기만 하면` 자동 세미콜론 삽입이 일어나지 않는다는 것이다.

따라서 자동 세미콜론 삽입을 믿으면서 코드를 짠다면 일단 `(, [, +, -, /`의 앞에서는 절대 세미콜론을 생략하면 안 되며, `return, throw, break, continue, ++, --`의 앞에서도 절대 세미콜론을 생략하면 안 된다. for문 헤더의 세미콜론도 그렇다.

세미콜론 넣어주는 게 어려운 일도 아닌데, 굳이 위같은 점을 고려하면서 자동 세미콜론 삽입을 믿고 코드를 짜는 것은 좋지 않다..

자동 세미콜론 삽입은 결국 파서가 에러를 정정할 기회를 주는 것 뿐인데 이를 신뢰하면서 코드를 짜는 건 에러를 일부러 발생시키는 것과 다름없다.

# 참고
https://en.wikibooks.org/wiki/JavaScript/Automatic_semicolon_insertion

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Lexical_grammar

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/Empty

https://tc39.es/ecma262/#sec-rules-of-automatic-semicolon-insertion

https://www.informit.com/articles/article.aspx?p=1997934&seqNum=6
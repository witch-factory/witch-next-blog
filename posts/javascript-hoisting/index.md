---
title: JS 탐구생활 - 호이스팅
date: "2022-08-23T00:00:00Z"
description: "호이스팅이란 무엇인가?"
tags: ["javascript"]
---

# 1. 호이스팅이란?

JS의 호이스팅은 인터프리터가 `var`로 선언한 변수와 함수를 위한 메모리 공간을 선언문 이전에 미리 할당하는 것을 의미한다.

즉 인터프리터가 변수의 선언과 초기화를 분리한 후 선언문만 코드의 최상단으로 옮기는 것과 같다. 따라서 변수나 함수를 정의하는 코드보다 사용하는 코드가 먼저 등장할 수 있다.

단 선언과 초기화를 함께 한 코드에서도 선언만 호이스팅된다. 이 코드에서 볼 수 있는데, `var`로 선언된 변수를 선언 이전에 사용하면 선언만 했을 시의 초기화 값인 `undefined`가 할당된다. 

함수는 선언문 이전에 사용해도 정상적으로 동작한다.

```js
console.log(a) // undefined
var a="안녕하세요."

foo(); // foo 함수입니다.
function foo(){
  console.log("foo 함수입니다.")
}
```

물론 다음과 같은 코드는 선언이 최상단으로 끌어올려진 상태에서 변수가 초기화되는 것이기 때문이 잘 작동한다.

```js
a="안녕하세요."
console.log(a) // 안녕하세요.
var a;
```

만약 선언 없이 초기화만 한 코드라면 암묵적인 선언은 호이스팅되지 않기 때문에 선언 전에 참조 시 에러가 발생한다.

```js
console.log(a) // ReferenceError: a is not defined
a="안녕하세요."
```

# 2. 호이스팅에 대한 해석

사실 JS의 호이스팅은 그렇게 큰 의도를 가지고 만들어진 건 아니다.

> Aravind Bharathy: 왜 Javascript는 호이스팅을 합니까? 왜 Javascript는 이런 식으로 디자인되었습니까? 이런 언어 디자인의 기반이 된 아이디어는 무엇입니까?
>
> Brendan Eich(JS의 창시자): 함수의 호이스팅은 탑다운식 프로그램 분해, 추가적인 비용 없는 'let rec', 선언 이전의 호출을 가능하게 한다. `var`로 선언된 변수의 호이스팅은 함수 호이스팅의 의도되지 않은 부작용이다. 1995년의 JS는 날림으로 만들어져서(rush job) 블록 스코프도 없었다. ES6의 `let`이 도움이 될 수 있다.
>
> Brendan Eich의 트윗(https://twitter.com/BrendanEich/status/522394590301933568)

여기 나오는 `let rec`이 무엇인지는 [잘 설명된 스택오버플로우 질문글이 있다.](https://stackoverflow.com/questions/16530534/scheme-when-to-use-let-let-and-letrec) [다른 글](https://stackoverflow.com/questions/9325888/why-does-ocaml-need-both-let-and-let-rec)

# 참고

호이스팅이란? https://developer.mozilla.org/ko/docs/Glossary/Hoisting

JS 창시자 브렌던 아이크의 호이스팅 의도 설명 https://twitter.com/BrendanEich/status/522394590301933568

https://github.com/jumaschion/You-Dont-Know-JS-1/blob/master/scope%20%26%20closures/ch4.md
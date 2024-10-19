---
title: JS 탐구생활 - 클로저 연대기
date: "2024-10-19T00:00:00Z"
description: "클로저, 수학에서 JavaScript의 스타가 되기까지"
tags: ["javascript", "history"]
---

# 이 글은 작성 중입니다.

# 시작

> 클로저는 함수와 그 함수가 선언될 당시의 렉시컬 환경의 조합이다. 
>
> MDN Web Docs, Closures

JavaScript 관련해서 공부하다 보면 클로저라는 말을 한번쯤 듣게 된다. 굉장히 중요하며 면접 때도 자주 나온다는 말이 따라오기도 한다.

그런데 문제는 클로저가 뭔지 이해하더라도 이게 왜 그렇게 중요하고 어떤 맥락에서 나왔으며 어디에 쓰이는지 명확하지 않다는 점이다. 함수 그리고 그 함수가 선언될 당시의 렉시컬 환경과의 조합, 그리고 감싸는 함수가 종료된 다음에도 그 환경이 남아 있다. 그래서 뭐?

그래서 이 질문에 답하기 위해 관련된 사실들을 최대한 많이 찾아보고 정리해 보았다. 그래서 다음과 같은 것들을 다룬다.

- 클로저가 해결한 문제는 무엇인가?
- 클로저가 나와서 JavaScript에 들어가기까지의 역사적인 맥락은 무엇인가?
- 클로저는 JavaScript에서 어떻게 정의되고 사용되는가?

글에서 사용되는 코드는 특별한 언급이 없는 한 모두 JavaScript로 작성되었다. 단 개념의 설명을 위해 실제 JavaScript 문법과는 다르게 의도된 코드가 있을 수 있는데 이 경우 별도의 설명으로 표시하였다.

# 클로저가 해결한 문제

> 이 문제를 해결하기 위해 우리는 클로저의 개념을 도입한다. 클로저는 람다 표현식과, 그 람다 표현식이 인수에 적용될 때 사용될 환경을 포함하는 데이터 구조이다.
>
> Gerald Jay Sussman, Guy Lewis Steele Jr., "Scheme: An Interpreter For Extended Lambda Calculus", 1975.12, 21p

## 람다 계산법[^1]

클로저는 람다 계산법을 프로그래밍 언어로 구현하는 과정에서 나왔다. 함수를 다른 함수의 인자로 전달하거나 다른 함수의 결과로 반환하는 게 가능해야 했는데 이를 위해 클로저가 필요했다. 이를 제대로 이해하기 위해서 람다 계산법에 대해 짧게 알아보자.

역사적인 맥락은 글의 뒷부분에서 더 자세히 다루겠지만 람다 계산법은 "기계적으로 계산 가능한 것"을 정의하는 과정에서 나왔다. 다음 3가지만으로 현재 존재하는 모든 프로그램을 서술할 수 있다.

- 변수(variable): $x$와 같은 변수
- 추상화(abstraction): 어떤 입력을 받아서 그에 따른 출력을 반환하는 개념. $\lambda x.y$와 같은 형태로 표현한다. 이 경우 $x$를 받아 $y$를 반환하는 추상화이다.
- 적용(application): $(x\,y)$와 같은 형태로 표현한다. 이 경우 $x$에 $y$를 적용한 것이다.

이 3가지만으로 참/거짓 값이나 자연수도 표현할 수 있고 우리가 알고 있는 `if`와 같은 분기도 표현할 수 있으며 Y combinator라는 것을 통해 재귀를 실현하여 반복도 표현할 수 있다[^2].


## 추상화와 함수

변수와 그걸 이용해서 뭔가를 하는 추상화, 우리가 기존에 프로그래밍을 하면서 함수를 정의하는 방식과 비슷하다. 함수의 인자를 정의하고 그에 따른 결과를 반환하는 것이다. 예를 들어 $x$를 받아 $x+1$을 반환하는 함수는 JavaScript에서 다음과 같이 정의할 수 있다.

```js
function addOne(x) {
  return x + 1;
}
```

이를 람다 계산법의 추상화로 다시 쓰면 이렇게 쓸 수 있다.

$$
\lambda x.x+1
$$

## 추상화와 고차 함수

추상화를 보면서 약간의 의문이 든다. 추상화는 앞서 말했듯 프로그램에서 다루는 함수와 비슷하다. 그런데 문제는 추상화가 받는 인자가 하나뿐이라는 것이다! 이걸로 일반적인 함수를 표현할 수 있을까? 인자가 여러 개인 함수를 표현하려면 어떻게 해야 할까?

고차 함수를 이용하면 가능하다.[^3] 예를 들어 2개의 인자를 받아 더하는 다음과 같은 함수를 어떻게 람다 계산법으로 표현할 수 있을까?

```js
function add(x, y) {
  return x + y;
}
```

이렇게 할 수 있다. 먼저 $x$를 받는 함수가 $y$를 받는 함수를 반환하고 반환된 그 함수에서는 $x$와 $y$를 더해서 반환한다.

$$
\lambda x.\lambda y.x+y
$$

이렇게 인자가 여러 개인 함수를 고차 함수로 표현하는 기술을 수학자 하스켈 커리의 이름을 따 커링(Currying)이라고도 한다.

## bound variable과 free variable

다음 내용으로 넘어가기 전에 bound variable과 free variable에 대해 알아보자. 먼저 bound variable은 함수의 인자로 전달되었거나 함수 내부의 지역 변수로 정의된 변수를 뜻한다. 즉 변수의 값을 가져올 때 함수 정의 내부에서 찾을 수 있는 것이다.

반대로 free variable은 함수의 인자도 아니고 함수 내부의 지역 변수도 아닌 변수를 뜻한다. 예를 들어 다음과 같은 함수를 보자.

```js
function addY(x) {
  return x + y;
}
```

`addY` 함수의 경우 `x`는 함수의 인자이므로 bound variable이다. 반면 `y`는 함수의 인자도 아니고 함수 내부의 지역 변수도 아니므로 free variable이다.

람다 계산법의 언어로 하면 추상화 $\lambda x.y$ 에서 $y$ 의 표현 내에서 $x$가 나타나면 bound라고 하는 것이다. 또한 이렇게 $x, y$를 연관시켜주는 $\lambda x.$를 "binder"라고 한다.

그리고 표현식 내의 모든 variable이 bound variable이라면 "closed"라고 한다. 그렇지 않은 경우 "open"이라고 한다.

앞서 보았던 $\lambda x.\lambda y.x+y$ 를 본다면 전체 표현식은 closed이다. 사용된 변수 $x, y$ 모두 bound variable이기 때문이다. 하지만 내부 함수 $\lambda y.x+y$를 보면 $x$가 함수 인자도 지역변수도 아니며 함수의 외부에서 정의되어 있다. 따라서 이 경우 $x$가 free variable이며 $\lambda y.x+y$는 open이다. 그리고 이때의 free variable 바인딩은 함수가 정의된 곳을 따라간다.

## funarg problem

람다 계산법을 이용하면 이렇게 3가지 요소만으로 모든 프로그램을 서술할 수 있다. 인자가 여러 개인 함수도 고차 함수를 이용해 쉽게 표현할 수 있다.

하지만 스택 기반으로 메모리를 관리하는 언어에서 람다 계산법을 구현할 때 문제가 발생했다. 람다 계산법에서 함수는 다른 함수의 인자로 전달되거나 결과로 반환될 수 있어야 했다. 이를 구현하려면 다음과 같은 문제가 있었고 이를 funarg problem[^4]이라고 한다.

- upward funarg problem: 함수를 반환하는 함수에서, 반환된 함수에서 사용하는 외부 변수는 어디에 저장되어야 하는가?
- downward funarg problem: 함수를 인자로 전달할 때 그 함수가 외부 변수를 사용한다면 그 외부 변수는 어떻게 탐색되어야 하는가?

스택 기반의 메모리 할당을 사용한다면 함수가 종료되었을 때 해당 함수의 스택 프레임(혹은 activation record)은 스택에서 사라지기 때문에 이런 문제가 발생했다.

예를 들어 다음과 같은 코드에서 `a`는 `outer`가 종료된 이후에도 `inner`에서 사용될 수 있어야 한다.

```js
function outer() {
  let a = 1;
  return function inner() {
    return a;
  }
}
```

그런데 보통 스택으로 메모리를 관리하는 언어에서는 함수가 종료되면 그 함수의 지역 변수도 스택에서 사라진다. 그럼 위와 같은 코드에서 `a`는 **어디에** 남아 있어야 하는가? 함수가 인자로 전달될 수 있고 반환될 수 있는 값, 즉 일급 객체로 다루기 위해서는 이 funarg problem을 해결해야 했다. 위에서 든 예시는 정확히는 upward funarg problem이다.

물론 고차 함수를 만드는 걸 금지하거나 동적 스코프[^5]를 사용하면 이런 문제가 발생하지 않는다. 하지만 람다 계산법을 기반으로 한다면 함수는 일급 객체로서 인자로 전달하거나 결과로 반환될 수 있어야 했다. 그리고 free variable 바인딩은 함수가 정의된 곳을 따라가는 렉시컬 스코프를 사용해야 했다. 따라서 이 문제는 람다 계산법을 언어로 구현할 때 마주할 수밖에 없었다.

이러한 일급 객체 함수 구현에 관련된 문제는 클로저를 설명할 때 지금도 이야기된다. 따라서 이미 이 문제의 답이 클로저라는 걸 알고 있는 사람도 많을 것이다.

## 클로저 등장

이 문제를 해결한 것이 바로 클로저이다. 특히 함수를 다른 함수의 결과로서 반환할 때 발생하는 upward funarg problem을 해결한다. 역사적으로 downward funarg problem은 Algol 60등 다른 언어에서도 해결되어 있었다.

클로저는 함수의 정의뿐 아니라 함수가 정의될 당시의 렉시컬 환경도 같이 저장한 데이터이다. 그리고 클로저는 힙에 저장되어 함수가 반환된 이후에도 남아 있다. 이를 통해 함수가 반환되고 외부 함수가 종료된 이후에도 반환된 함수는 자신이 선언되었을 시점의 외부 스코프의 변수를 사용할 수 있게 된다.

즉 클로저는 free variable이 있는 "open"된 함수에 함수 정의 당시의 렉시컬 환경을 제공함으로써 free variable을 바인딩하고 함수를 "closed" 상태로 만들어 준다. 이런 의미로 이름을 클로저(closure)라고 한 것이다.

# 클로저, 람다 계산법에서 JavaScript까지

클로저가 람다 계산법을 프로그래밍 언어로 구현하는 과정에서 함수가 다른 함수의 결과로 반환될 때 생기는 문제를 해결하기 위해 나왔다는 걸 알아보았다. 그럼 다시 원래의 질문으로 돌아가서, 끝까지 따라가보자.

왜 JavaScript에서 클로저가 이렇게 중요하게 다루어질까? 클로저가 있는 다른 언어들과 달리 JavaScript는 처음부터 함수형의 영향을 받아 만들어지기도 했고 class도 없었기에 객체지향 구현에서 클로저를 많이 사용했기 때문이다.

그럼 왜 JavaScript에는 클로저가 들어갔을까? 클로저가 있던 함수형 언어인 Scheme[^6]의 영향을 받았기 때문이다.

이 클로저는 왜 나왔을까? 앞서 보았듯이 람다 계산법을 프로그래밍 언어로 구현하는 과정에서 funarg problem을 해결하면서 나왔다.

그럼 왜 람다 계산법을 프로그래밍 언어로 구현해야 했을까? 모든 기계적인 계산을 해내는 프로그래밍 언어를 만들기 위해서는 이를 구현해야 했기 때문이다.

그럼 왜 모든 기계적인 계산을 해내야 했을까? 그게 프로그래밍 언어고 컴퓨터니까.

클로저에서 이야기가 많이 부풀어올랐다. 그럼 이제 다시 오래전부터 시작해보자. 프로그래밍 언어가 만들어지던 시절로 돌아갔다가 다시 JavaScript 진영의 슈퍼스타가 되기까지 가보는 것이다.

## 수학계의 꿈과 그 좌절

> 우리는 마음속에서 영원한 속삭임을 듣는다: 여기 문제가 있다. 그 풀이를 찾아라. 너는 순수한 이성으로 그것을 찾을 수 있다. 왜냐면 수학에는 해결할 수 없는 문제란 없기 때문이다.
>
> David Hilbert, "Mathematical problems", Bulletin of the American Mathematical Society, vol 8 (1902), pp. 437-479

1928년, 당시 수학계를 이끌던 거물이었던 다비트 힐베르트는 대담한 생각을 했다. 수학자들이 해온 것을 보니 기존의 사실들에 몇 개의 추론 규칙을 반복해서 적용하는 게 다인 것 같았다.

그럼 "추론 규칙의 기계적인 적용"만으로 수학자들이 알아내야 할 모든 것을 알아낼 수 있지 않을까? 추론 규칙을 모두 찾고 이를 기존의 사실들에 계속 적용해 나가기만 하면 수학의 모든 사실을 만들어낼 수 있지 않을까?

하지만 그 유명한 쿠르트 괴델의 "불완전성 정리"로 인해 이 꿈은 좌절되었다. 규칙을 계속 적용하는 기계적인 방식으로는 참인 명제를 모두 찾아내는 게 불가능하다는 것이 증명된 것이다.

이는 수학자들에게 큰 충격을 주었다. 수학을 모순 없는 토대 위에 쌓으려던 힐베르트 프로그램이 타격을 받는 등 여러 여파가 있었다. 하지만 이 과정에서 나온 "기계적인 방식의 계산"이라는 아이디어는 컴퓨터 과학의 발전에 큰 영향을 주었다.

## 기계, 그리고 람다 계산법

기계적인 방식만으로 모든 참인 명제를 찾아내는 게 불가능하다는 것은 알았다. 그런데 이 "기계적인 방식" 그리고 "기계적으로 계산 가능"이란 대체 무엇인가? 이를 정의하기 위해 나온 방식 중 하나가 람다 계산법이다.

1931년 불완전성 정리를 처음 증명한 괴델은 부분 재귀 함수라는 개념을 사용하여 "부분 재귀 함수 꼴로 정의되는 함수"를 기계적으로 계산 가능하다고 정의했다.

이에 영감을 받은 앨런 튜링은 1936년 불완전성 정리를 다른 방식으로 증명한다. 이때 튜링은 5종류의 부품으로 구성된 단순한 기계, "튜링 기계"를 정의하고 "튜링 기계가 실행 가능한 것들"을 계산 가능하다고 정의했다. 이 튜링 기계가 현재의 컴퓨터의 이론적 원형이다.

비슷한 시기, 알론조 처치가 드디어 람다 계산법을 정의한다. 원래 집합 대신 함수를 기반으로 수학 기초를 정의하려는 노력의 일환에서 나왔지만 실패[^7]한 후 남은 계산 이론을 정리해 만든 것이다. 그리고 이 "람다 계산법으로 계산될 수 있는 것들"을 계산 가능하다고 정의했다.

그리고 이 세 정의는 모두 동치이다. 셋 중 하나의 "계산 가능"정의만 구현해도, 대부분의 프로그래밍 언어가 목표로 하는 "튜링 완전"하다고 할 수 있다. 물론 이 셋만 있는 것은 아니고 초기 Lisp가 기반을 둔 클레이니의 일차 재귀 함수를 이용한 계산 가능성 등 다양한 정의가 있다.

아무튼 괴델의 정의는 실제 계산과는 거리가 좀 있기 때문에 나머지 두 개인 튜링 기계와 람다 계산법이 프로그래밍 언어의 두 가지 기원이 되었다. 이때 람다 계산법에서 올라온 언어들은 함수를 중심으로 하여 함수형 언어라고 하기도 한다.

클로저는 이 람다 계산법을 기반으로 언어를 구현하는 과정에서 나타났다. 하지만 함수형 언어의 역사에서 클로저가 나타나기에는 중간 단계가 되는 역사들이 좀 더 있다.

## 람다 계산법에서 클로저까지

> 가장 중요하고 흥미로운 컴퓨터 언어 가운데 하나는, Algol이 만들어진 시기에 함께 만들어진 존 매카시의 언어 LISP이다.
>
> Douglas Hofstadter, "Godel, Escher, Bach: an Eternal Golden Braid", 1979

### Lisp

첫번째 함수형 언어는 1958년에 나온 Lisp이다. S-표현식 그리고 그 S-표현식에 대한 계산인 M-표현식을 사용했다. S-표현식은 `X`, `Y`와 같은 atom과 atom들을 괄호와 점으로 연결하는 걸로 이루어졌다. 다음과 같이 말이다.

```lisp
((X.Y).Z)
(ONE.(TWO.(THREE.NIL)))
```

다만 M-표현식 또한 S-표현식을 이용해 만들 수 있었기 때문에 의도와 달리 이후 Lisp에서는 S-표현식만을 사용하게 된다.

이 당시 Lisp의 함수는 일급 객체가 아니었다. 따라서 함수를 인자로 전달하거나 결과로 반환할 수 있는 기능이 없었다. Lisp는 람다 계산법에 이론적 배경을 둔 게 아니라 스티븐 클레이니의 일차 재귀 함수(first order recursive function) 이론에 배경을 두어서 함수를 고차로 다루지 않았다.

그런데 사실 언어에서 제대로 기능을 제공하지는 않았지만 S-표현식을 통하면 함수를 다른 함수의 인자로 전달할 수 있었다. 문제는 이렇게 하면 외부 스코프에 의존하는 변수의 바인딩이 제대로 이루어지지 않았다는 것이다.

함수가 정의된 곳을 기준으로 하는 렉시컬 스코프가 아니라, 함수가 호출된 곳을 기준으로 하는 동적 스코프가 사용된 것이다. JavaScript의 문법을 빌려 설명하자면 이런 것이다.

```js
// 동적 스코프가 사용됨
function outer(y){
  return function inner(x){
    return x + y;
  }
}

let a = 1;
let b = 2;
// outer(1)로 만들어진 함수이므로 x => x+1을 기대한다
let f = outer(a); 
// x => x+1의 기능을 잘 수행
f(b); // 3

a = 3;
// 그런데 동적 스코프라면 f를 호출하는 시점에 y에 해당하는 값이 3이므로 3 + 2 = 5가 나온다.
f(b); // 5
```

처음에 이것은 단순한 버그로 간주되었다. 하지만 이후에 이건 좀더 근본적인 문제라는 게 밝혀진다. 위에서 설명했던 funarg problem이다. 우리가 알고 있는 클로저 이외에도 많은 장치들이 funarg problem을 해결하기 위해 나왔었다. [Why the FUNARG Problem Should be Called the Environment Problem](https://web.archive.org/web/20170706125408/ftp://publications.ai.mit.edu/ai-publications/pdf/AIM-199.pdf)

### Algol 60

Algol은 포트란에 대항해서 유럽에서 만들어진 프로그래밍 언어로 요즘은 거의 쓰이지 않는다. 하지만 지금도 쓰이는 수많은 프로그래밍 개념의 원조이다. 렉시컬 스코프의 도입, BNF를 이용한 문법 구조 정의 등 많은 개념이 알골에서 처음 나왔다.

이 Algol은 일반적으로 함수형 언어로 분류되지는 않지만 함수에 관련된 규칙과 변수 바인딩은 람다 계산법과 관련이 있다. 특히 중첩된 함수와 함수를 인자로 전달하는 걸 공식적으로 지원했다. 아쉽게도 함수를 결과로 반환하는 건 불가능했다.

당연히 Algol도 앞서 언급한 (downward) funarg problem을 마주했다. 함수를 다른 함수에 인자로 전달해 사용한다면, 그 함수의 free variable을 바인딩할 때는 인자로 전달된 함수가 정의된 곳을 따라가야 했다. 그런데 어떻게 따라갈 것인가?

Algol은 스택 프레임에 함수를 호출한 곳에 대한 링크뿐 아니라 함수를 정의한 곳에 대한 정적 링크도 추가함으로써 이를 해결했다. 인자로 전달된 함수가 쓰일 때는 함수가 정의된 곳에 정적 링크로 연결된 스코프를 따라가서 변수를 찾으면 됐다.

앞서 언급했듯 Algol에서는 함수를 결과로 반환할 수 없었기 때문에 이는 잘 작동했다. 하지만 여전히 함수를 일급 객체로 다루어서 람다 계산법을 구현하기까지는 하나의 큰 산이 남아 있었다. 함수를 결과로 반환할 수 있어야 했다. 이 문제는 단순히 스택 프레임에 링크를 추가하는 걸로는 해결할 수 없었다. 함수가 반환되고 종료된 후에는 스택 프레임이 사라진다는 자체가 문제였기 때문이다.

이러한 upward funarg problem은 여전히 남아 있었다. 이를 해결하기 위해 드디어 클로저가 등장하는 것이다. 이제야 드디어 함수가 일급 객체가 될 수 있겠다.


## JavaScript와 클로저

> 내가 여러 번 말해왔고 Netscape의 다른 사람들도 확인해 줄 수 있는 사실인데, 나는 브라우저에서 "Scheme을 구현하는" 일을 할 거라는 약속을 받고 Netscape에 합류했다. (...) 아주 자랑스럽지는 않지만 Scheme과 같은 일급 함수와 Self와 같은 프로토타입(하나뿐이긴 하지만)을 JavaScript의 주요 요소로 선택한 것에 만족한다.
>
> JavaScript의 창시자 Brendan Eich, ["Popularity"](https://brendaneich.com/2008/04/popularity/)라는 글에서






























# 참고

- `클로저가 해결한 문제`에 참고

Lambda Calculus And Closure

https://www.kimsereylam.com/racket/2019/02/06/lambda-calculus-and-closure.html

Sussman, Gerald Jay and Steele, Guy L. Scheme: An Interpreter For Extended Lambda Calculus. 초창기 Lisp 연구자들의 언어학 고찰이 담긴 논문들 모음인 [Lambda Papers](https://research.scheme.org/lambda-papers/)에서 찾을 수 있다.

https://dspace.mit.edu/bitstream/handle/1721.1/5794/AIM-349.pdf

Wikipedia, Free variables and bound variables

https://en.wikipedia.org/wiki/Free_variables_and_bound_variables

Wikipedia, Funarg problem

https://en.wikipedia.org/wiki/Funarg_problem

Wikipedia, Lambda calculus

https://en.wikipedia.org/wiki/Lambda_calculus

ES3 ECMA-262-3 Closure. funarg problem 관련해서 참고하였다.

https://seonhyungjo.github.io/Javascript-Book/ES3/6-Closure.html

유튜브의 "Computerphile" 채널의 Lambda Calculus 영상

https://www.youtube.com/watch?v=eis11j_iGMs

- `클로저, 람다 계산법에서 JavaScript까지` 참고

불멸의 힐버트 1: 좋은 문제는 한 번 풀리지 않는다

https://horizon.kias.re.kr/15610/

위키백과, "힐베르트 프로그램"

https://ko.wikipedia.org/wiki/%ED%9E%90%EB%B2%A0%EB%A5%B4%ED%8A%B8_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8

Why is closure important for JavaScript?

https://softwareengineering.stackexchange.com/questions/88392/why-is-closure-important-for-javascript

D. A. Turner, "Some History of Functional Programming Languages", 2012

https://www.cs.kent.ac.uk/people/staff/dat/tfp12/tfp12.pdf

이광근, "컴퓨터과학이 여는 세계 : 세상을 바꾼 컴퓨터, 소프트웨어의 원천 아이디어 그리고 미래", 인사이트, 2021

이광근, SNU 4190.310 Programming Languages Lecture Notes

https://ropas.snu.ac.kr/~kwang/4190.310/11/pl-book-draft.pdf

Wikipedia, Lambda calculus

https://en.wikipedia.org/wiki/Lambda_calculus





- 클로저 정의 관련 참고

MDN Web Docs, Closures

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

[^1]: Lambda Calculus를 람다 계산법으로 번역하는 것은 서울대학교 이광근 교수님의 "컴퓨터과학이 여는 세계"의 표기를 따랐다.

[^2]: 구체적인 방식은 참고문헌의 "Some History of Functional Programming Languages", 서울대학교 Programming Languages 강의록 등을 참고

[^3]: 집합 $A, B, C$ 에 대해 $(A \times B) \rightarrow C$ 와 $A \rightarrow (B \rightarrow C)$ 가 일대일 대응이기 때문에 가능하다.

[^4]: 더 자세한 설명은 [ECMA-262-3 in detail. Chapter 6. Closures.](http://dmitrysoshnikov.com/ecmascript/chapter-6-closures/)에서 볼 수 있다.

[^5]: 프로그래밍 언어론 3-3-6강. 동적 스코프(Dynamic Scoping) https://chayan-memorias.tistory.com/119

[^6]: Scheme의 소개부터 람다 계산법 냄새가 진하다. ["Scheme: An Interpreter For Extended Lambda Calculus"](https://dspace.mit.edu/bitstream/handle/1721.1/5794/AIM-349.pdf)가 제목이다. 초창기 Lisp 연구자들의 언어학 고찰이 담긴 논문들 모음인 Lambda Papers에서 찾을 수 있다.

[^7]: 클레이니-로서 역설로 인해 실패했다. https://en.wikipedia.org/wiki/Kleene%E2%80%93Rosser_paradox


--- 주석 제대로 수정 중. 여기까지 완료












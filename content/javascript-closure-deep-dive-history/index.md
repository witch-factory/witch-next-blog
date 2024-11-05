---
title: JS 탐구생활 - 클로저 연대기 2. 람다 계산법에서 JS 면접의 단골 질문까지
date: "2024-11-05T00:00:00Z"
description: "수학, 기계적인 계산, 람다 계산법, 컴퓨터, Lisp, Algol을 거치면서 생긴 표현식의 평가에 대한 문제와 해결, 그리고 오늘날 우리는 클로저라 부른다."
tags: ["javascript", "history"]
---

![썸네일](./thumbnail.png)

# 클로저 탐구 시리즈

- [클로저 연대기 1. 클로저, 대체 무엇이고 어디에 쓸까?](https://witch.work/posts/javascript-closure-deep-dive-application)
- [클로저 연대기 2. 람다 계산법에서 JS 면접의 단골 질문까지](https://witch.work/posts/javascript-closure-deep-dive-history)

> 클로저는 렉시컬 환경에 대한 참조와 함께 묶인 함수의 조합이다.
>
> MDN Web Docs, Closures

JavaScript를 공부하다 보면 클로저라는 말을 한번쯤 듣게 된다. 굉장히 중요하다는 말이 따라올 때도 많다. 그런데 시간이 지나고 클로저에 대해 들은 횟수가 늘어가면서 두 가지 질문이 생겼다.

- 클로저는 무슨 의미이고 무엇을 할 수 있는 걸까?
- 클로저는 대체 어디서 나왔고 어떻게 JavaScript까지 들어가서 이렇게 유명해졌을까?

이 두 가지 질문에 대해 할 수 있는 한 많은 것을 찾아보고 정리하여 두 개의 글을 쓴다. 클로저가 무엇이고 뭘 할 수 있는지에 관해 하나, 클로저의 역사에 관해 하나다. 실용적인 내용은 첫번째 글에 더 많겠지만 개인적으로는 두번째 글에 훨씬 더 많은 시간과 관심을 쏟았다.

- 글에서 사용되는 코드는 특별한 언급이 없는 한 모두 JavaScript로 작성되었다. 단 개념의 설명을 위해 실제 JavaScript 문법과는 다르게 의도된 코드가 있을 수 있는데 이 경우 별도의 설명으로 표시하였다.

# 시작

이 글에서는 클로저의 역사적 맥락에 대해 다루며, 기본적인 JavaScript 지식을 상정하므로 클로저가 대략적으로 무엇인지 안다고 가정한다. 클로저가 무엇인지 모른다면 기본적인 부분을 다룬 [클로저 연대기 1. 클로저, 대체 무엇이고 어디에 쓸까?](https://witch.work/posts/javascript-closure-deep-dive-application)을 참고할 수 있다.

그럼 클로저가 무엇인지 알았다고 하자. 하지만 표현식을 환경과 묶어서 평가하는 게 왜 그리 중요한 맥락을 차지하고 있을까? 그만큼 많이 쓰이고 응용되어서 그렇다고 간단히 대답할 수도 있다. 하지만 생각하기에 따라 수많은 질문과 대답을 꼬리물어볼 수도 있다.

- 왜 JavaScript에서 클로저가 이렇게 중요하게 다루어질까?

클로저가 있는 다른 메이저 언어들과 달리 JavaScript는 처음부터 함수형의 영향을 받아 만들어졌다. 그리고 멀티 패러다임 언어답지 않게 class를 비롯한 객체지향 관련 문법도 오랫동안 없었다. 그래서 대부분의 개발 패러다임 구현에 클로저를 많이 사용했기 때문이다.

- 그럼 왜 JavaScript에는 클로저가 들어갔을까?

클로저의 원조 중 하나라고 할 수 있을 Scheme의 영향을 받았기 때문이다.

- 클로저라는 건 왜 나왔을까?

람다 계산법[^1]을 프로그래밍 언어에서 구현하는 과정에 발생한 funarg problem이라는 문제를 해결하려고 나왔다.

- 왜 람다 계산법을 프로그래밍 언어로 구현해야 했을까?

모든 기계적인 계산을 해내는 프로그래밍 언어를 만들기 위한 한 가지 방법이었기 때문이다.

- 왜 모든 기계적인 계산을 해내야 했을까?

그것이 바로 컴퓨터의 역할이며 프로그래밍 언어로 해야 하는 일이니까.

클로저에서 이야기가 많이 부풀어올랐다. 그럼 이제 다시 오래전부터 시작해보자. 프로그래밍 언어가 만들어지던 시절로 돌아갔다가 다시 JavaScript 진영의 스타가 되기까지 가보는 것이다. 이야기처럼 풀어내기 위해 노력하였다.

# 수학에서 프로그래밍까지

프로그래밍 언어, 컴퓨터, 이런 것들은 어디서부터 시작했을까? 생각하기에 따라 인간이 계산이라는 걸 다루던 최초의 시절로 거슬러 올라갈 수도 있을 것이다. 하지만 이 글에서는 20세기 초의 수학자들이 모든 것을 자동으로 계산하는 기계를 꿈꾸던 시절로부터 시작한다.

## 수학계의 꿈과 그 좌절

> 우리는 마음속에서 영원한 속삭임을 듣는다: 여기 문제가 있다. 그 풀이를 찾아라. 너는 순수한 이성으로 그것을 찾을 수 있다. 왜냐면 수학에는 해결할 수 없는 문제란 없기 때문이다.
>
> David Hilbert, "Mathematical problems", Bulletin of the American Mathematical Society, vol 8 (1902), pp. 437-479[^2]

1928년, 당시 수학계를 이끌던 거물이었던 힐베르트는 대담한 생각을 했다. 수학자들이 해온 것을 보니 기존의 사실들에 몇 개의 추론 규칙을 반복해서 적용하는 게 다인 것 같았다.

그럼 "추론 규칙의 기계적인 적용"만으로 수학자들이 알아내야 할 모든 것을 알아낼 수 있지 않을까? 추론 규칙을 모두 찾고 이를 기존의 사실들에 계속 적용해 나가기만 하면 수학의 모든 사실을 만들어낼 수 있지 않을까? 그대로 따르기만 하면 수학자들이 알아내야 하는 모든 것을 자동으로 척척 알아낼 수 있도록 하는 어떤 과정이나 규칙이 있지 않을까?

하지만 그 유명한 쿠르트 괴델의 "불완전성 정리"로 인해 이 꿈은 좌절되었다. 규칙을 계속 적용하는 기계적인 방식으로는 참인 명제를 모두 찾아내는 게 불가능하다는 것이 증명된 것이다.

이는 수학자들에게 큰 충격을 주었다. 수학을 모순 없는 토대 위에 쌓으려던 힐베르트 프로그램이 타격을 받는 등 여러 여파가 있었다. 하지만 이 과정에서 나온 "기계적인 방식의 계산"이라는 아이디어는 컴퓨터 과학의 발전에 큰 영향을 주었다.

## 기계, 그리고 람다 계산법

> 프로그래밍 언어는 사실, 컴퓨터라는 기계가 세상에 나오기 전부터 이미 있었다. 프로그래밍 언어가 컴퓨터를 돌리기 위해 만들어진 게 아니고, 컴퓨터가 프로그래밍 언어를 돌리기 위해 만들어 졌다고 할 수 있다. 역사적으로 프로그래밍 언어가 먼저라고 할 수 있기 때문이다. 1930-40년대에 이미 논리학자와 수학자들은 기계적으로 계산가능한 것이 무엇인지를 고민하기 시작했다.
>
> 이광근, SNU 4190.310 Programming Languages Lecture Notes, 121쪽[^3]

불완전성 정리로 인해서 모든 참인 명제를 기계적으로 찾아낼 수 없다는 건 알았다. 그런데 방금 "기계적으로" 라고 하지 않았나? 컴퓨터의 개념은 불완전성 정리의 징검다리일 뿐인 것처럼 언급된 이 단어의 의미에서 시작한다.

괴델의 위대한 업적으로 기계적인 방식만으로 모든 참인 명제를 찾아내는 게 불가능하다는 것은 알았다. 그런데 이 "기계적인 방식"이란 대체 무엇인가? 당연하지만 불완전성 정리를 처음 증명한 괴델이 이에 대해 가장 먼저 정의했다. 괴델은 1931년 불완전성 정리를 증명하면서 부분 재귀 함수라는 것을 정의하고 "부분 재귀 함수 꼴로 정의되는 함수"를 기계적인 방식으로 계산 가능하다고 했다.

이에 영감을 받은 앨런 튜링은 1936년 불완전성 정리를 다른 방식으로 증명한다. 이때 튜링은 5종류의 부품으로 구성된 단순한 기계, "튜링 기계"를 정의하고 "튜링 기계가 실행 가능한 것들"을 계산 가능하다고 정의했다. 이 튜링 기계가 현재의 컴퓨터의 이론적 원형이다.

그 비슷한 시기, 알론조 처치가 람다 계산법을 통해 계산 가능을 정의한다. 원래 이는 기존 수학 체계 구성에 많이 쓰였던 집합 대신 함수를 이용해서 새로운 논리 체계를 구성하려는 시도였다. 하지만 1930년대 초 그 체계가 일관성이 없다는 게 밝혀지면서 실패했다[^4].

그러나 함수를 통한 논리 체계 구성은 실패했어도 함수에 관한 탄탄한 계산 이론이 남았다. 이를 정리해서 만든 게 바로 람다 계산법이다. 처치는 "람다 계산법으로 계산될 수 있는 것들"을 계산 가능하다고 정의했다.

곧 밝혀졌지만 이 세 정의는 모두 동치이다. 셋 중 하나의 "계산 가능"정의만 구현해도, 대부분의 프로그래밍 언어가 목표로 하는 "튜링 완전"하다고 할 수 있다. 물론 이 셋 외에도 튜링 완전을 정의하는 방법이 여러 가지 있지만 이 셋이 가장 대표적이다.

이 중 괴델의 정의는 실제 계산의 수행과는 거리가 조금 있다. 그래서 나머지 두 개인 튜링 기계와 람다 계산법이 프로그래밍 언어의 두 가지 기원이 되었다. 이때 람다 계산법에서 올라온 언어들은 튜링 기계의 명령 중심 방식보다는 논리적인 함수를 중심으로 하여 함수형 언어라고 하기도 한다.

클로저는 이 람다 계산법을 기반으로 언어를 구현하는 과정에서 나타났다. 하지만 아직 클로저가 나타나기에는 중간 단계가 되는 역사들이 좀 더 있다.

## 컴퓨터의 등장과 언어

> 언어는 생각을 표현하는 도구일 뿐 아니라 인간이 사유하기 위한 장치이다.
>
> Kenneth E. Iverson(1979년 튜링상 수상), 튜링 상 기념 강연 중

클로저는 함수형 언어의 핵심이 되는 개념 중 하나이다. 그런데 컴퓨터의 초기 시대에는 함수를 프로그래밍의 중심에 둔다는 생각을 아무도 하지 않았다. 최초의 함수형 언어라고 할 수 있는 Lisp를 만든 매카시조차도 오랫동안, 프로그래밍을 단계별로 실행되는 알고리즘의 설계만으로 생각했다.

이는 컴퓨터가 어떻게 등장했는지에 영향을 받는다. 이는 초기 컴퓨터가 튜링 기계를 기반으로 했기 때문이다. 튜링 기계에 관해 자세히 설명하는 것은 이 글의 범위를 벗어나지만, 작동규칙에 따라 작동하는 단순한 기계라고 볼 수 있다. 오늘날 명령형 프로그래밍이라고 불리는 것과 비슷하다고 보면 된다.

이 튜링 기계를 통해서 모든 계산 가능한 것을 계산할 수 있고 현재 존재하는 모든 프로그램을 표현할 수 있다. 그리고 이렇게 주어진 명령대로 움직이는 튜링 기계를 전기 회로로 구현한 것이 최초의 컴퓨터였다. 1937년 클로드 섀넌(놀랍게도 당시 21세)이 전기 스위치로 튜링 기계를 만들 수 있다는 가능성을 보였고, 1948년 맨체스터 대학에서 맨체스터 마크 원이, 1952년 폰 노이만이 EDVAC을 만들었다. 즉 튜링 기계 이론을 기반으로 한 명령어를 알아듣도록 최초의 컴퓨터들이 만들어졌고 이게 지금까지 이어지고 있다.

물론 람다 계산법도 똑같은 능력을 가지고 있다. 만약 람다 계산법을 기반으로 한 명령을 알아듣는 기계가 최초의 컴퓨터로서 만들어졌다면 프로그래밍 언어의 역사는 많이 달랐을지도 모른다. 하지만 최초의 컴퓨터는 튜링 기계 기반이었고, 당연히 초기 프로그래밍 언어도 튜링 기계의 명령어를 기반으로 만들어졌다. 최초의 컴퓨터가 생기던 시절은 함수형 언어에서 나온 개념인 클로저가 나올 수 있는 환경이 아니었던 것이다.

람다 계산법을 기반으로 하는 언어의 경우에는 기계에게 이해시키기 위해 번역을 거쳐야 했다. 이 기술은 몇 년 뒤에야 나온다. 또한 지금도 람다 계산법 기반의 명령어를 사용하는 컴퓨터는 없다.

# 람다 계산법에 대해서

> 누군가가 계산을 하고 있다면, 다른 누군가는 꿈을 꾸어도 좋지 않겠는가?(At a time where so many scholars are calculating, is it not desirable that some, who can, dream?)
>
> Rene Thom(1958년 필즈상 수상), Structural Stability and Morphogenesis

이제 람다 계산법을 프로그래밍 언어로 구현하기까지의 역사를 알아보려고 한다. 그런데 이 과정에서 람다 계산법의 개념들이 어느 정도 언급될 것이다. 따라서 역사를 보기 전에 우선 람다 계산법에 대해 간단히 알아보자.

## 람다 계산법의 형식

앞서 보았다시피 람다 계산법은 "기계적으로 계산 가능한 것"을 정의하는 과정에서 나왔다. 다음 3가지 요소가 람다 계산법의 전부이며, 이 3가지만으로 기계적으로 계산 가능한 모든 것을 표현할 수 있고 따라서 현재 존재하는 모든 프로그램도 표현할 수 있다.

- 변수(variable): $x$와 같은 변수
- 추상화(abstraction): 어떤 입력을 받아서 그에 따른 출력을 반환하는 개념. $\lambda x.y$와 같은 형태로 표현한다. 이 경우 $x$를 받아 $y$를 반환하는 추상화이다.
- 적용(application): $(x\,y)$와 같은 형태로 표현한다. 이 경우 $y$에 $x$를 적용한 것이다.

이 3가지만으로 참/거짓 값이나 자연수도 표현할 수 있고 우리가 알고 있는 `if`와 같은 분기도 표현할 수 있으며 Y combinator라는 것을 통해 재귀를 실현하여 반복도 표현할 수 있다[^5].

## 추상화와 함수

변수와 그걸 이용해서 뭔가를 하는 추상화, 그리고 추상화를 적용하는 것. 우리가 기존에 프로그래밍을 하면서 함수를 정의하고 인수를 넣어 호출하는 방식과 비슷하다. 함수의 인자를 정의하고 그에 따른 결과를 반환하는 것이다. 예를 들어 $x$를 받아 $x+1$을 반환하는 함수는 JavaScript에서 다음과 같이 정의할 수 있다.

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

고차 함수를 이용하면 가능하다.[^6] 예를 들어 2개의 인자를 받아 더하는 다음과 같은 함수를 어떻게 람다 계산법으로 표현할 수 있을까?

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

마지막으로 bound variable과 free variable에 대해 알아보자. 람다 계산법에서는 추상화 $\lambda x.y$ 에서 $y$ 표현식 내에서 $x$가 나타나면 bound라고 한다. 또한 이렇게 $x, y$를 연관시켜주는 $\lambda x.$를 "binder"라고 한다. 

즉 변수의 값을 함수 정의 내부에서 찾을 수 있는 변수를 bound variable이라고 한다. 예를 들어 $\lambda x.x+1$에서 $x$는 bound variable이다.

반면 함수의 인자도 아니고 함수 내부의 지역 변수도 아닌 변수, 즉 함수 내부에서 값을 찾을 수 없는 변수를 해당 함수의 관점에서 free variable이라고 한다. 앞서 보았던 $\lambda x.\lambda y.x+y$ 의 경우 내부 함수 $\lambda y.x+y$ 의 관점에서 $x$ 는 함수 인자도 지역 변수도 아니다. 따라서 내부 함수의 관점에서 $x$는 free variable이다.

표현식 내의 모든 variable이 bound variable이라면 "closed"라고 한다. 그렇지 않은 경우 "open"이라고 한다. $\lambda x.\lambda y.x+y$ 는 closed이고, $\lambda y.x+y$ 는 open이다. 이때 free variable $x$의 바인딩은 함수가 호출된 곳이 아니라 해당 함수가 정의된 곳을 따라간다.

# 프로그래밍 초기에서 클로저까지

람다 계산법이 등장한 배경도 알았고, 람다 계산법의 내용이 뭔지도 알았다. 그럼 이제 그걸 컴퓨터로 구현하면서 클로저로 가기까지의 여정을 알아보자.

## Lisp와 funarg problem

> 가장 중요하고 흥미로운 컴퓨터 언어 가운데 하나는, Algol이 만들어진 시기에 함께 만들어진 존 매카시의 언어 LISP이다.
>
> Douglas Hofstadter, "Godel, Escher, Bach: an Eternal Golden Braid", 1979

프로그래밍이 처음 싹을 틔우던 1950년대 후반, 아무도 함수를 프로그래밍의 중심으로 생각하지 않았다. 함수의 개념은 있었지만 내장 함수들이 있었을 뿐 사용자가 함수를 정의할 수 있는 기능조차 없었다.

Lisp를 만든 존 매카시는 인공지능 연구자였는데, 1955년 이전부터 인공지능 연구에서 프로그래밍 언어가 얼마나 중요한지 느끼고 표현식들의 결합으로 나타낼 수 있는 수학적이고 논리적인 언어를 꿈꿨다.

그는 처음에 포트란을 확장하는 방식으로 이를 시도했고 어느 정도의 성공을 거두었다. 하지만 그가 설계하던 시스템에서 필요한 재귀, 함수 인수 등을 지원하기 위해서는 완전히 새로운 언어가 필요하다는 것이 점점 명확해졌다. 마침 설립된 MIT 인공지능 프로젝트의 지원을 받아 매카시는 1958년 최초의 함수형 프로그래밍 언어 Lisp를 만든다.

Lisp는 S-표현식 그리고 그 S-표현식에 대한 계산인 M-표현식을 사용했다. S-표현식은 `X`, `Y`와 같은 atom과 atom들을 괄호와 점으로 연결하는 걸로 이루어졌다. 다음과 같이 말이다.

```lisp
((X.Y).Z)
(ONE.(TWO.(THREE.NIL)))
```

다만 M-표현식 또한 S-표현식을 이용해 만들 수 있었기 때문에 의도와 달리 이후 Lisp에서는 S-표현식만을 사용하게 된다.

이 당시 Lisp의 함수는 일급 객체가 아니었다. Lisp는 람다 계산법이 아니라 스티븐 클레이니의 일차 재귀 함수 이론(물론 튜링 완전하기는 했다)에 배경을 두어서 함수를 고차로 다루지 않았다.

당연히 함수를 인자로 전달하거나 결과로 반환할 수 있는 기능도 없었다. 그런데 사실 언어에서 정식으로 기능을 제공하는 건 아니었지만 S-표현식과 `QUOTE`라는 걸 사용해서 함수를 다른 함수의 인자로 전달할 수 있었다.

문제는 이렇게 하면 외부 스코프에 의존하는 변수의 바인딩이 제대로 이루어지지 않았다는 것이다. 함수가 정의된 곳을 기준으로 하는 렉시컬 스코프가 아니라, 함수가 호출된 곳을 기준으로 하는 동적 스코프[^7]가 사용된 것이다. JavaScript의 문법을 빌려 설명하자면 이런 것이다.

```js
// 동적 스코프가 사용됨
function outer(y){
  return function inner(x){
    return x + y;
  }
}

let a = 1;
let b = 2;
// outer(1)의 맥락에서 만들어진 함수이므로 x => x+1을 기대한다
let f = outer(a); 
// x => x+1의 기능을 잘 수행
f(b); // 3

a = 3;
// 그런데 동적 스코프라면 f를 호출하는 시점에 y에 해당하는 값이 3이므로 3 + 2 = 5가 나온다.
f(b); // 5
```

처음에 이것은 단순한 버그로 간주되었다. 하지만 이후에 이건 좀더 근본적인 문제라는 게 밝혀진다. 이걸 funarg problem(중에서 downward funarg problem)이라고 하며 Scheme 이전의 Lisp 계열 언어들은 이 문제를 제대로 해결하지 못했다.

### funarg problem

Lisp가 겪은 이런 문제는 좀더 일반화되어 funarg problem이라고 불린다. 이는 일급 객체 함수를 프로그래밍 언어에서 구현할 때 생기는 문제다.

앞서 보았듯이 람다 계산법을 이용하면 3가지 요소만으로 모든 프로그램을 서술할 수 있다. 이 람다 계산법을 보면 함수는 다른 함수의 인자로 전달되거나 함수의 결과로 반환될 수 있다.

그런데 스택 기반으로 메모리를 관리하는 언어(앨런 튜링이 1945년 이미 콜스택까지 포함한 함수 시스템의 설계를 했으므로 이 당시 이미 기본이었음)에서 이를 구현하려면 다음과 같은 문제가 발생했다[^8].

- upward funarg problem: 함수를 반환하는 함수에서, 반환된 함수에서 사용하는 외부 변수는 어디에 저장되어야 하는가?
- downward funarg problem: 함수를 인자로 전달할 때 그 함수가 외부 변수를 사용한다면 그 외부 변수는 어떻게 탐색되어야 하는가?

스택 기반의 메모리를 쓰는 언어에서 현재 실행되고 있는 함수가 아닌 함수의 스택 프레임(혹은 activation record), 아니면 아예 종료되어 버린 함수의 스택 프레임에 접근하기가 어려웠기 때문에 이런 문제가 발생했다.

upward funarg problem의 경우 이런 것이다. 다음과 같은 코드는 요즘도 클로저를 설명할 때 자주 인용될 만한 코드인데, `a`는 `outer`가 종료된 이후에도 `inner`에서 사용될 수 있어야 한다.

```js
function outer() {
  let a = 1;
  return function inner() {
    return a;
  }
}
```

그런데 보통 스택으로 메모리를 관리하는 언어에서는 함수가 종료되면 그 함수의 지역 변수도 스택 프레임과 함께 스택에서 사라진다. 그럼 위와 같은 코드에서 외부 함수의 지역 변수였던 `a`를 **어디에** 남겨서 `inner`에서 접근할 수 있도록 할 것인가?

물론 C처럼 고차 함수를 만드는 걸 금지하거나 Lisp의 초기 버전처럼 동적 스코프를 사용하도록 하면 이런 문제가 발생하지 않는다. 하지만 람다 계산법을 기반으로 한다면 함수는 인자로 전달되거나 결과로 반환될 수 있어야 했고 렉시컬 스코프를 사용해야 했다. 따라서 이 문제는 람다 계산법을 언어로 구현할 때 마주할 수밖에 없었다.

이러한 일급 객체 함수 구현에 관련된 문제는 클로저를 설명할 때 지금도 이야기된다. 따라서 이미 이 문제의 답이 클로저라는 것도 꽤 잘 알려져 있다.

## Algol 60

> 처치, 커리, 매카시 그리고 ALGOL 60의 저자들은 그들의 각 분야에서 너무 큰 역사적인 역할을 했기 때문에 세부적인 공로를 모두 언급하는 것은 불완전하고 아마도 적절치 못할 것이다.
>
> P. J. Landin, "The mechanical evaluation of expressions", 1964, 320p

Algol은 포트란에 대항해서 유럽에서 만들어진 프로그래밍 언어로 요즘은 거의 쓰이지 않는다. 하지만 지금도 쓰이는 수많은 프로그래밍 개념의 원조이다. 렉시컬 스코프의 도입, BNF를 이용한 문법 구조 정의 등 많은 개념이 알골에서 처음 나왔다. 당시에도 Lisp 등 다른 언어들이 있었지만 동적 스코프를 사용하고 있었다.

이 Algol은 일반적으로 함수형 언어로 분류되지는 않지만 함수에 관련된 규칙과 변수 바인딩은 람다 계산법과 관련이 있다[^9]. 특히 중첩 함수와 함수를 인자로 전달하는 걸 공식적으로 지원했다. 아쉽게도 함수를 결과로 반환하는 건 불가능했다.

함수를 다른 함수의 인자로 전달하는 걸 허용하면서 Algol도 (downward) funarg problem을 마주했다. 함수를 다른 함수에 인자로 전달해 사용한다면, 그 함수의 free variable을 바인딩할 때는 인자로 전달된 함수가 정의된 곳을 따라가야 했다. 그런데 어떻게 따라갈 것인가?

Algol은 스택 프레임에 함수를 호출한 곳에 대한 링크뿐 아니라 함수를 정의한 곳에 대한 정적 링크도 추가함으로써 이를 해결했다. 인자로 전달된 함수가 쓰일 때는 함수가 정의된 곳에 정적 링크로 연결된 스코프를 따라가서 변수를 찾으면 됐다.

앞서 언급했듯 Algol에서는 함수를 결과로 반환할 수 없었기 때문에 이는 잘 작동했다. 하지만 여전히 함수를 일급 객체로 다루어서 람다 계산법을 구현하기까지는 하나의 큰 산이 남아 있었다. 함수를 결과로 반환할 수 있어야 했다.

이 upward funarg problem은 단순히 스택 프레임에 링크를 추가하는 걸로는 해결할 수 없었다. 함수가 반환되고 종료된 후에는 스택 프레임이 사라진다는 자체가 문제였기 때문이다. 이 문제를 해결하기 위해 드디어 클로저가 등장한다. 이제야 드디어 함수가 일급 객체가 될 수 있겠다.

## 클로저 등장

> Landin(1964)은 이 문제를 그의 SECD machine에서 해결했다. 함수는 클로저로 표현되고 클로저는 함수 코드와 자유 변수에 대한 환경으로 구성된다. 이 환경은 이름-값 쌍으로 이루어진 링크드 리스트이다. 클로저는 힙에 저장된다.
>
> D. A. Turner, "Some History of Functional Programming Languages", 8p

이 문제를 해결한 것이 바로 클로저이다. 특히 함수를 다른 함수의 결과로서 반환할 때 발생하는 upward funarg problem을 해결한다. 앞서 보았듯 downward funarg problem은 Algol 60등 다른 언어에서도 해결되어 있었다.

1964년 피터 랜딘은 클로저의 개념을 처음 제시한 논문[^10]을 발표한다. 이 논문에서는 다음 2가지의 관점을 다룬다.

- 프로그래밍 언어에서 사용하는 표현식들을 람다 계산법 형식으로 모델링하는 법
- 그러한 표현식들을 기계적으로 평가하여 값을 계산하는 법

랜딘은 이때 표현식을 평가함에 있어 외부 환경을 고려한다. 표현식 $X$를 평가할 때 $X$의 free variable로 나타난 식별자들에 값을 제공하는 외부 환경 $E$에 따라 값이 달라진다는 것이다.

따라서 (람다 표현식을 표현하는) 일반적인 표현식 $X$를 평가함에 있어 환경과 함께 $val(E)(X)$로 평가한다. 그리고 표현식의 평가 결과를 람다 표현식과 그게 평가되는 환경으로 이루어진 "클로저"로 표현한다.

표현식의 평가 결과가 값이 아니라 클로저인 것은 한 번 외부 환경에서 평가된 이후에도 또 다른 외부 환경에서 평가될 수 있기 때문이다. 2중 이상으로 중첩된 함수를 생각해 볼 수 있다.

```js
function grandparent(x) {
  return function parent(y) {
    return function child(z) {
      return x + y + z;
    }
  }
}
```

이때 `child`의 결과를 평가하기 위해서는 먼저 `parent` 함수의 스코프 환경 내에서 결과를 평가하고 그 다음 `grandparent`로 넘어간다. 이 중간에 생기는 평가 결과는 아직 평가되어야 할 자유 변수를 가지고 있다. 이를 일반화해 생각하면 표현식의 평가 결과는 클로저여야 한다.

클로저가 어떤 요소를 가져야 하는지도 이 논문에서 정의한다. 표현식이 갖는 클로저는 다음과 같은 부분으로 이루어진다.

- 환경
  - 해당 클로저의 외부 환경(outer reference)
  - 해당 클로저에서 정의된 식별자의 목록
- 해당 표현식의 내용

그리고 환경 $E$에 대해 표현식 $X$의 평가 결과를 다음과 같이 쓴다. $E$에 존재하는 $X$의 bound variable($bvX$)를 $E$에 따라 평가하고 그렇게 구축된 환경 내에서 $X$의 본문을 평가하는 것이다.

$$
constructclosure((E, bvX),\, unitlist(bodyX))
$$

예를 들어 $\lambda x.\lambda y.x+y$를 평가할 때 $x=1$인 환경에서 평가한다면 먼저 $x$가 1로 평가되었으며 $y$를 free variable로 갖는 새로운 환경을 생성하고 그걸 클로저로 하여 $\lambda y.1+y$($x$가 1로 대체됨)를 평가하는 것이다. 오늘날의 클로저 방식과 똑같다.

즉 최초의 클로저는 함수뿐 아니라 일반적인 표현식의 평가 결과를 나타내는 데에 쓰였으며 표현식의 정의와 그게 평가된 환경의 조합이었다. 그리고 함수 또한 표현식이므로 환경과 함께 평가되었기에 외부 함수가 종료된 이후에도 거기서 반환된 함수는 자신이 평가되던 외부 환경에 접근해서 그곳의 변수를 사용할 수 있었다. 이러한 동작을 위해 클로저는 힙에 저장되어 외부 함수가 반환된 이후에도 메모리에 남아 있었다.

즉 클로저는 free variable이 있는 "open"된 함수에 함수 정의 당시의 렉시컬 환경을 제공함으로써 free variable을 바인딩하고 함수를 "closed" 상태로 만들어 준다. 이런 의미로 이름을 클로저(closure)라고 한 것이다.

같은 논문에서 랜딘은 이를 기계적으로 평가하는 방법을 수학적으로 기술한 SECD Machine을 제시하고, 1966년의 다른 논문[^11]에서 이를 기반으로 이론적인 언어 모델인 ISWIM을 제안한다. SECD Machine과 ISWIM에 영감을 받아 프로그래밍 언어론 교육을 위한 언어이며 일급 객체 함수를 지원한 PAL이 나오지만 교육을 위한 언어였기에 실용적인 언어의 계보를 만들지는 못했다.

# 클로저에서 JavaScript까지

그럼 이렇게 나온 클로저는 어떻게 JavaScript로 이어졌을까? 이는 Lisp의 유명한 방언인 Scheme에서 클로저를 받아들였고 JavaScript가 Scheme의 영향을 받았기 때문이다.

## Scheme

> 스킴이 그전까지의 리스프와 중요한 차이를 보인 것은 람다에 대한 중요성을 부각시키고 람다의 행동에 대한 엄밀한 분석을 이룬 것이다.
>
> 안윤호, "해커 문화의 뿌리를 찾아서 Part 1: 리스프가 탄생하기까지", 2007

1975년 가이 스틸과 제럴드 서스만이 Scheme을 발표한다. 이 언어는 확실하게 람다 계산법을 기반으로 하고 있었다. 언어를 정의하는 문서의 이름부터가 "Scheme: An Interpreter for Extended Lambda Calculus"였다[^12].

Scheme 또한 람다 표현식의 평가를 기반으로 했다. 이때 클로저의 개념을 도입한다. 내부의 람다 표현식을 평가할 때, 외부의 bound variable이 바인딩된 환경과 함께 평가되어야 한다는 것이다.

언어 정의 문서[^13]에서는 다음과 같이 예시를 든다.

```scheme
(((LAMBDA (X) (LAMBDA (Y) (+ X Y))) 3) 4)
```

이 최종적인 결과를 평가하려면 `(+ X Y)`를 평가할 때 `X`는 3, `Y`는 4로 바인딩되어야 한다. 이는 내부 표현식 `(LAMBDA (Y) (+ X Y))`에 `Y=4`를 적용할 때 `X`가 3으로 바인딩된 환경과 함께 적용되어야 한다는 것이다.

여기서 클로저를 도입하면서 Scheme 문서에서는 funarg problem에 관한 조엘 모세스의 논문[^14]을 언급한다. 그리고 모세스는 해당 논문에서 클로저라는 용어를 처음 제시한 사람으로 피터 랜딘을 지목한다.

## JavaScript

> 내가 여러 번 말해왔고 Netscape의 다른 사람들도 확인해 줄 수 있는 사실인데, 나는 브라우저에서 "Scheme을 구현하는" 일을 할 거라는 약속을 받고 Netscape에 합류했다. (...) 사용할 언어가 Scheme이어야 하는지는 논쟁의 여지가 있었지만 내가 Netscape에 합류할 때의 미끼는 Scheme이었다. 이전에 내가 SGI에 있을 때 닉 톰슨이 내게 SICP를 소개해 주었다. (...) 아주 자랑스럽지는 않지만 Scheme과 같은 일급 함수와 Self와 같은 프로토타입(하나뿐이긴 하지만)을 JavaScript의 주요 요소로 선택한 것에 만족한다.
>
> JavaScript의 창시자 Brendan Eich, "Popularity"[^15]

1991년 HTML이 나오면서 월드 와이드 웹이라는 개념이 태어났고, 1993년 모자이크, 1994년 넷스케이프 네비게이터 브라우저가 나오면서 웹이 엄청난 인기를 끌기 시작했다.

이제 산업계에서는 사용자가 페이지와 상호작용하고 또 애플리케이션을 직접 만들 수 있도록 하기 위해 스크립트 언어를 개발하고자 했다. JavaScript의 창시자 브랜든 아이크가 이를 위해 1995년 4월 넷스케이프에 합류한다.

아이크는 이때 브라우저에서 Scheme을 구현하게 해주겠다는 약속을 받았다. 이는 아이크가 SICP를 매우 인상깊게 읽었기 때문이었다. 아이크가 처음 일을 시작했던 회사의 동료가 SICP를 소개해 주었다.

SICP는 컴퓨터 분야에서 유명한 고전인데, 그게 바로 Scheme으로 쓰여 있다.

이후 여러 문제로 인해 브라우저에 Scheme을 그대로 구현하는 것은 포기되었다. 그리고 우리가 알고 있는 스크립트 언어, 바로 JavaScript가 열흘만에 급하게 구현된다[^16].

하지만 아이크는 일정 압박과 몇몇 제한 이외에는 매우 많은 결정권이 있었다. 그는 Scheme의 영향을 받은 일급 객체 함수 개념을 JavaScript에 도입했다. 그러면서 자연스럽게 클로저도 JavaScript에 들어오게 되었다.

## JavaScript와 클로저

> 다른 언어에서는 네임스페이스나 모듈 패키지, 비공개 프로퍼티, 스태틱 멤버 등의 기능이 익숙하고 당연할지 몰라도, 자바스크립트에는 이런 것들을 위한 별도의 문법이 거의 없다.
>
> 스토얀 스테파노프 지음, 김준기, 변유진 옮김, "자바스크립트 코딩 기법과 핵심 패턴", 2011, 103p

JavaScript는 웹에서 사용자와 상호작용하기 위해 만들어졌다. 그리고 매우 심한 일정 압박과 인원 부족 속에서 만들어졌다. 이 두 가지 이유로 인해 클로저는 JavaScript에서 매우 큰 위치를 차지하게 된다.

JavaScript는 일급 객체 함수를 지원하고 프로토타입 기반의 상속을 구현하는 등 멀티 패러다임 언어로 구현되었다. 하지만 일정의 문제, Java와의 충돌 등으로 인해 다른 언어에서 지원하는 기본적인 기능과 객체 지향적 기능이 거의 없었다. 클래스, 모듈, 네임스페이스, private 멤버를 비롯한 정보 은닉 기능 등이 하나도 없었다.

이러한 기능들을 구현하기 위해 클로저가 많이 사용되었다. 객체를 리턴하는 함수를 만들고 함수 스코프 내에 변수를 숨겨서 정보 은닉을 구현하고, 코드를 즉시 실행 함수(IIFE)에 넣어서 네임스페이스와 모듈을 구현했다. 디자인 패턴 등의 다른 구현에도 많이 응용된 것은 물론이다.

그리고 JavaScript는 그 목적상 이벤트 기반 비동기 프로그래밍에 자주 사용된다. 이때 클로저는 비동기 작업에서 변수를 유지하는 데 매우 유용하다. 이벤트 핸들러나 타이머가 실행될 때도 변수 값을 '기억'할 수 있기 때문이다.

이러한 이유로 클로저는 JavaScript에서 매우 중요한 개념 중 하나로 자리 잡게 되었다. 단순히 지식이 중요했다기보다는 너무 많이 쓰였으니까.

# 결론

클로저는 물론 중요하지만 엄청나게 어렵거나 복잡한 개념은 아니다. 프로그래밍의 사고방식에 익숙하다면 오히려 자연스럽다고도 할 수 있다. 하지만 이는 프로그래밍의 역사에 깊이 닿아 있다.

컴퓨터는 기계적으로 계산 가능한 것들의 구현을 위해 설계되었다. 그리고 람다 계산법은 함수를 이용해 기계적인 계산이라는 개념을 표현하는 방식 중 하나이다.

이러한 함수 중심, 정확히는 람다 계산법 기반의 프로그래밍 언어를 제대로 만들기 위해 Lisp, Algol 그리고 SASL처럼 글에 언급되지도 않은 언어 등등 수많은 시도와 실패가 있었고 많은 사람들의 노력이 있었다.

그러면서 프로그래밍 언어상의 함수가, 람다 계산법에서와 똑같은 "일급 객체" 그러니까 함수의 인수도 될 수 있고 함수의 결과로 반환될 수도 있는 지위를 얻는 과정에서 클로저가 나왔다.

클로저는 람다를 강조한 언어 Scheme에 도입되면서 인기를 얻었고, Scheme의 영향을 받은 JavaScript에 도입되었다.

Java의 보조 언어로서 시작한 JavaScript는 멀티 패러다임 언어로 설계되었지만 급하게 만들어지느라 없는 게 많았다. 특히 객체지향을 지원할 수 있는 기능이 거의 없었다. 그래서 클래스, 모듈, 네임스페이스, 정보 은닉 등 객체지향적인 기능을 구현하기 위해 클로저가 많이 사용되었다.

그 과정에서 자연스럽게 다른 응용도 많이 생겨났고, JavaScript에서 매우 중요한 개념 중 하나로 떠오르게 되었다.

# 참고문헌

- 전체적인 참고

전체 문단에서 전반적으로 참고한 문서들이다. 해당 문서들은 전체적으로 글 작성에 필요한 내용들을 제공했고 필요한 키워드나 추가적인 문서를 찾는 단서가 되었다. 따라서 거의 모든 섹션의 내용에 직접적으로 연관되어 있거나 영향을 미쳤다.

D. A. Turner, Some History of Functional Programming Languages

https://www.cs.kent.ac.uk/people/staff/dat/tfp12/tfp12.pdf

이광근, "컴퓨터과학이 여는 세계 : 세상을 바꾼 컴퓨터, 소프트웨어의 원천 아이디어 그리고 미래", 인사이트, 2021

https://product.kyobobook.co.kr/detail/S000001033013

이광근, SNU 4190.310 Programming Languages Lecture Notes

https://ropas.snu.ac.kr/~kwang/4190.310/11/pl-book-draft.pdf

Herbert Stoyan, Early LISP History (1956 - 1959)

https://dl.acm.org/doi/pdf/10.1145/800055.802047

Wikipedia, Closure (computer programming)

https://en.wikipedia.org/wiki/Closure_(computer_programming)

Wikipedia, Lambda calculus

https://en.wikipedia.org/wiki/Lambda_calculus

- 수학에서 프로그래밍까지

불멸의 힐버트 1: 좋은 문제는 한 번 풀리지 않는다

https://horizon.kias.re.kr/15610/

위키백과, "힐베르트 프로그램"

https://ko.wikipedia.org/wiki/%ED%9E%90%EB%B2%A0%EB%A5%B4%ED%8A%B8_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8

Wikipedia, Functional programming

https://en.wikipedia.org/wiki/Functional_programming

SNUON_컴퓨터과학이 여는 세계_15.1 프로그래밍 언어의 두 기원_이광근

https://www.youtube.com/watch?v=NLND6AgMOBA

- 람다 계산법에 대해서

Lambda Calculus And Closure

https://www.kimsereylam.com/racket/2019/02/06/lambda-calculus-and-closure.html

Wikipedia, Free variables and bound variables

https://en.wikipedia.org/wiki/Free_variables_and_bound_variables

Kurly Tech Blog, Lambda Calculus에 대해 알아보자

https://helloworld.kurly.com/blog/lambda-calculus-1/

- 프로그래밍 초기에서 클로저까지

Joel Moses, The Function of FUNCTION in LISP, or Why the FUNARG Problem Should be Called the Environment Problem. 스택 프레임 기반 언어에서 어떻게 외부 환경에 접근하는지에 대한 어려움을 다룸. upward든 downward든 현재 실행되고 있는 함수가 아닌 다른 함수의 스택 프레임에 접근하는 데 있어 생기는 어려움이 바로 funarg problem이었다.

https://dspace.mit.edu/handle/1721.1/5854

P. J. Landin, "The mechanical evaluation of expressions"

https://www.cs.cmu.edu/~crary/819-f09/Landin64.pdf

P. J. Landin, "The Next 700 Programming Languages"

https://www.cs.cmu.edu/~crary/819-f09/Landin66.pdf

L. FOX, "ADVANCES IN PROGRAMMING AND NON-NUMERICAL COMPUTATION"(인터넷에 pdf가 떠돌아다님)

https://www.sciencedirect.com/book/9780080113562/advances-in-programming-and-non-numerical-computation

Gerald Jay Sussman, Guy Lewis Steele Jr., "Scheme: An Interpreter For Extended Lambda Calculus" 초창기 Lisp 연구자들의 언어학 고찰이 담긴 논문들 모음인 [Lambda Papers](https://research.scheme.org/lambda-papers/)에서 찾을 수 있다.

https://dspace.mit.edu/bitstream/handle/1721.1/5794/AIM-349.pdf

위 Scheme 문서의 텍스트로 된 버전 https://en.wikisource.org/wiki/Scheme:_An_Interpreter_for_Extended_Lambda_Calculus/Whole_text

Arthur Evans Jr., "PAL - a language designed for teaching programming linguistics"

https://dl.acm.org/doi/pdf/10.1145/800186.810604

안윤호, "해커 문화의 뿌리를 찾아서"

https://github.com/black7375/ReadabilityDocs/tree/master/%ED%95%B4%EC%BB%A4%20%EB%AC%B8%ED%99%94%EC%9D%98%20%EB%BF%8C%EB%A6%AC%EB%A5%BC%20%EC%B0%BE%EC%95%84%EC%84%9C

what the fuck is a closure

https://whatthefuck.is/closure

Wikipedia, John McCarthy (computer scientist)

https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)

Wikipedia, Function (computer programming)

https://en.wikipedia.org/wiki/Function_(computer_programming)

Wikipedia, Funarg problem

https://en.wikipedia.org/wiki/Funarg_problem

Wikipedia, Scheme (programming language)

https://en.wikipedia.org/wiki/Scheme_(programming_language)

Wikipedia, Scope (computer science)

https://en.wikipedia.org/wiki/Scope_(computer_science)

Wikipedia, History of programming languages

https://en.wikipedia.org/wiki/History_of_programming_languages

Wikipedia, PAL (programming language)

https://en.wikipedia.org/wiki/PAL_(programming_language)

PAL - a language designed programming linguistics for teaching

https://dl.acm.org/doi/pdf/10.1145/800186.810604

ES3 ECMA-262-3 Closure. funarg problem 관련해서 참고하였다.

https://seonhyungjo.github.io/Javascript-Book/ES3/6-Closure.html

The secret lives of JavaScript closures

https://dev.to/ziizium/the-secret-lives-of-javascript-closures-2o46

유튜브의 "Computerphile" 채널의 Lambda Calculus 영상

https://www.youtube.com/watch?v=eis11j_iGMs

- 클로저에서 JavaScript까지

안윤호, "해커 문화의 뿌리를 찾아서"

https://github.com/black7375/ReadabilityDocs/tree/master/%ED%95%B4%EC%BB%A4%20%EB%AC%B8%ED%99%94%EC%9D%98%20%EB%BF%8C%EB%A6%AC%EB%A5%BC%20%EC%B0%BE%EC%95%84%EC%84%9C

스토얀 스테파노프 지음, 김준기, 변유진 옮김, "자바스크립트 코딩 기법과 핵심 패턴", 인사이트, 2011

https://product.kyobobook.co.kr/detail/S000001032919

Allen Wirfs-Brock, Brandan Eich, JavaScript: the first 20 years

https://dl.acm.org/doi/10.1145/3386327

Brendan Eich, "Popularity"

https://brendaneich.com/2008/04/popularity/

Why is closure important for JavaScript?

https://softwareengineering.stackexchange.com/questions/88392/why-is-closure-important-for-javascript

MDN Web Docs, Closures

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

[^1]: Lambda Calculus를 람다 계산법으로 번역하는 것은 서울대학교 이광근 교수님의 "컴퓨터과학이 여는 세계"의 표기를 따랐다.

[^2]: 불멸의 힐버트 1: 좋은 문제는 한 번 풀리지 않는다(https://horizon.kias.re.kr/15610/)에서 인용

[^3]: SNU 4190.310 Programming Languages Lecture Notes https://ropas.snu.ac.kr/~kwang/pl-book-draft.pdf

[^4]: 클레이니-로서 역설로 인해 실패했다. https://en.wikipedia.org/wiki/Kleene%E2%80%93Rosser_paradox

[^5]: 구체적인 방식은 참고문헌의 "Some History of Functional Programming Languages", 서울대학교 Programming Languages 강의록 등을 참고

[^6]: 집합 $A, B, C$ 에 대해 $(A \times B) \rightarrow C$ 와 $A \rightarrow (B \rightarrow C)$ 가 일대일 대응이기 때문에 가능하다.

[^7]: 프로그래밍 언어론 3-3-6강. 동적 스코프(Dynamic Scoping) https://chayan-memorias.tistory.com/119

[^8]: 더 자세한 설명은 [ECMA-262-3 in detail. Chapter 6. Closures.](http://dmitrysoshnikov.com/ecmascript/chapter-6-closures/)에서 볼 수 있다.

[^9]: P. J. Landin, "A Correspondence Between ALGOL 60 and Church's Lambda Notation: Part I"

[^10]: P. J. Landin, "The mechanical evaluation of expression"

[^11]: P. J. Landin, "The Next 700 Programming Languages"

[^12]: 또한 Scheme의 설계 과정에서 전통적인 리스프 구현에 대한 의문 제기와 언어학적 고찰이 있었고 관련 논문들을 묶은 시리즈가 있는데, 이 이름도 Lambda Papers이다. [Lambda Paper를 볼 수 있는 링크](https://en.wikisource.org/wiki/Lambda_Papers)

[^13]: Gerald Jay Sussman, Guy Lewis Steele Jr., "Scheme: An Interpreter For Extended Lambda Calculus", 1975.12, 21p

[^14]: Joel Moses, The Function of FUNCTION in LISP, or Why the FUNARG Problem Should be Called the Environment Problem

[^15]: Popularity, https://brendaneich.com/2008/04/popularity/

[^16]: JavaScript 탄생에 대한 더 많은 배경은 Allen Wirfs-Brock, Brandan Eich, "JavaScript: the first 20 years"를 참고할 수 있다.

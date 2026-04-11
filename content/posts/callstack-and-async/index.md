---
title: 콜스택과 비동기 프로그래밍
date: "2023-07-26T00:00:00Z"
description: "What Color is Your Function?을 읽고"
tags: ["study", "CS"]
---

# 0. 개요

유명한 글인 [What Color is Your Function?](http://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/)과 [해당 글에 대한 토론](https://news.ycombinator.com/item?id=8984648)을 읽고 작성한 글이다.

개인적으로 비동기 프로그래밍의 어려움이 콜스택 관리에서 오며 이는 쉽게 해결 가능한 문제가 아니라는 것이 이 글의 시사점이라 생각한다.

원 글의 저자는 Ruby, Dart 등의 언어에 매우 익숙하기 때문에 원 글에서는 이런 언어들을 예시로 들고 있다. 하지만 JS, Python 등 내가 알고 있고 좀더 유명하기도 한 언어로 예시를 바꾸어 작성하도록 노력하였다.

그리고 나는 개인적으로 이 글의 논지 전부에 동의하지는 않는다. [Red & blue functions are actually a good thing](https://blainehansen.me/post/red-blue-functions-are-actually-good/)과 같이 동기와 비동기를 명확히 구분할 수 있는 것이 더 좋다는 것에 동의하는 편이다. 하지만 이 글에서 주장하는 바도 충분히 시사점이 있다고 생각하여 블로그에 남긴다.

# 1. 비동기의 전염성

이런 JS 코드를 작성한다고 해보자. A, B, C는 잘 출력되고 아무 문제도 없다.

```js
function A(){
  return "A";
}

function B(){
  console.log(A());
  return "B";
}

function C(){
  console.log(B());
  return "C";
}

console.log(C());
/* 
A
B
C
콘솔 출력
*/
```

그런데 만약 이렇게 연쇄적으로 호출되는 함수의 콜체인 중 `B`함수에서 비동기로 동작하는 `fetchData`함수의 데이터를 사용하게 되었다고 하자. 그럼 B는 데이터 페칭을 위해 비동기 작업을 포함하도록 바뀐다. 그리고 C에서 B의 결과물을 사용하기 위해서는 C도 비동기 함수가 되어야 한다. 그럼 전체적으로 다음과 같은 코드가 된다.

```js
async function B(){
  console.log(A());
  const data=await fetchData();
  return data;
}

async function C(){
  someJob(await B());
  return "C";
}
```

만약 `C()`의 결과를 `D()`에서도 사용해야 한다면 `D()`는 또 `C()`를 사용하기 위해서 비동기 함수가 되고...이런 비동기 함수의 전염성은 계속되어 간다. 비동기 함수는 비동기 함수 내부에서만 호출될 수 있기 때문이다. 서버 데이터 페칭 하나를 위해서 대체 몇 개의 함수가 비동기가 되어야 하는 것인지 알 수조차 없다.

이런 문제는 Promise를 사용해도 마찬가지고, JS에서는 무엇을 써도 마찬가지다(Web Worker가 있긴 하지만, 싱글스레드 환경에서는 그렇다는 이야기다). 

`B()`의 비동기성은 결국 전염된다. 비동기 함수의 결과를 사용한다면, 해당 코드가 완결될 때까지 비동기 함수의 결과를 기다려야 하기 때문이다.

```js
async function B(){
  console.log(A());
  const data=await fetchData();
  return data;
}

async function C(){
  console.log(await B());
  return "C";
}

async function D(){
  console.log(await C());
  return "D";
}
// ...
```

이 문제는 어떤 패러다임이나 개발자의 실력 문제가 아니고, 특정 라이브러리나 방법론을 통해서 깔끔하게 해결할 수 있는 것도 아니다.

이는 재사용될 수 있는 함수들로 프로그램을 구성하고, 그 결과들을 또 다른 함수에서 사용하는 기본적인 프로그래밍 방법에서 발생하는 문제이기 때문이다. [비동기 코드를 적절하게 배치하는 일은 지금도, 앞으로도 결코 간단하지 않을 것이다.](https://rinae.dev/posts/why-every-beginner-front-end-developer-should-know-publish-subscribe-pattern-kr/)

![비동기 처리의 어려움](./async-reality.png)

# 2. 원인

그러나 우리는 그럼에도 무언가 해야 한다. 그렇다면 가장 먼저 해야 할 일은 근본적인 원인의 탐구이다. 왜 JS에서 비동기 함수는 전염될 수밖에 없는가? 해결 방안을 알기 위해서는 원인을 알아야 한다.

먼저 비동기 함수를 다음과 같이 정의하자. Promise를 쓰거나 하는 것이 비동기 함수의 조건은 아니다. (async/await은 비동기를 동기처럼 쓸 수 있게 해줌으로써 다음 조건들 중 몇몇을 완화하고 동기처럼 쓸 수 있도록 해주지만 지금은 생각하지 말자.)

- 비동기 함수는 그 결과를 비동기적으로 반환하는 함수이다.
- 동기 함수는 값을 반환하지만 비동기 함수는 값을 반환하지 않고 콜백을 실행한다.
- 즉 동기 함수는 값을 통해서 결과를 전달하지만 비동기 함수는 콜백을 실행하는 것을 통해서 결과를 전달한다.

이러한 점 때문에 비동기 함수는 에러 핸들링이나 다른 여러 제어 흐름에 사용될 수 없다.

## 2.1. 비동기 작업의 맥락 유지

근본적인 이유는 JS가 싱글스레드이고 따라서 프로그램이 실행되고 있는 환경을 저장할 콜스택이 하나밖에 없기 때문이다.

그럼 싱글스레드가 왜 문제일까? 예를 들어서 다음과 같은 코드를 생각해보자. 비동기 작업을 하는 `asyncJob`이라는 함수가 있다. 이 함수는 비동기 작업을 하고 그 결과물을 반환한다. 그리고 그 결과물은 `useAsyncJobResult`라는 함수에서 사용된다.

```js
A()
const data=asyncJob();
useAsyncJobResult(data);
B();
C();
```

하지만 `useAsyncJobResult`에서 `data`를 사용하는 시점에 `asyncJob`은 완료되어 있을까? 당연하게도 비동기 작업과 그 뒤에 진행될 동기 작업의 순서가 꼬일 가능성이 높다. 운좋게 경쟁 상태에서 잘 처리되어서 우리가 원하는 대로 될 수도 있겠지만, 보장되는 것은 전혀 아니다.

![콜스택 이상과 현실](./callstack-ideal-and-real.png)

그럼 우리는 어떻게 해야 하는가? `asyncJob`이 완료될 때까지 메인 스레드를 블로킹할 수 있겠다. 실제로 이렇게 한다는 건 아니지만 그냥 비유적인 표현이다.

```js
A()
const data=asyncJob();
blockUntilAsyncDone();
useAsyncJobResult(data);
B();
C();
```

하지만 이렇게 하면 이미 비동기가 아니다. 그리고 B나 C같은 비동기 함수의 결과물을 사용하지 않는 함수들도 영향을 받아 버린다. 또한 fetch같은 진짜 비동기 내장 함수들을 제대로 다룰 수 있는 방식도 아니다.

그럼 어떻게 해야 하는가? 우리가 근본적으로 해야 할 일은 `asyncJob()`과 그것이 완료된 후 진행해야 할 작업인 `useAsyncJobResult(data)`사이의 순서를 보장하고 나머지 부분은 영향을 받지 않도록 하는 것이다.

이를 실현하기 위해서는 `asyncJob()`이 호출되는 시기의 환경(정확히는 콜스택)을 보존하고 해당 비동기 작업이 완료되는 시점에 그 환경을 다시 불러와서 비동기 작업의 결과물을 사용하는 작업을 진행해야 한다. 왜 환경을 보존해야 하는지는 다음과 같은 코드를 통해 알 수 있다.

```js
A();
let dataForJob=someData;
const data=asyncJob();
useAsyncJobResult(data);
dataForJob=otherData;
B();
C();
```

만약 이 환경을 보존하지 않고 `asyncJob`, `useAsyncJobResult`만 비동기로 어떻게 만들어서 사용한다고 하면 `useAsyncJobResult`가 실행되는 시점에 `dataForJob`이 변경되어 있을 수도 있다. 하지만 그러면 안된다! 따라서 비동기 작업들이 실행되는 환경을 보존해 놓고 비동기 작업이 완료되는 시점에 다시 불러오는 것은 필수적이다.

그런데 **어떻게?** 앞서 말했듯이 JS는 싱글스레드이고 콜스택이 하나뿐이다. 원래 이런 환경은 스레드에서 보존하는데 대체 메인 스레드 외에 **어디서** 이를 보존할 것인가? 콜백을 이용할 수 있다. '비동기 작업이 완료된 후 진행되어야 할 작업에 필요한 환경'들을 콜백을 이용해 모두 하나의 함수에 탑재되도록 하는 것이다.

달리 말하면 JS에서는 이런 실행 환경을 저장할 수 있는 콜스택이 하나밖에 없다는 점을 극복하기 위해 '비동기 작업 이후에 진행할 코드의 실행 환경'을 콜백 함수를 통해 개발자가 직접 설정해 주는 것이다.

```js
A();
/* 비동기 작업 완료시 실행시킬 함수를 콜백으로 받는다 */
asyncJob(function(data){
  useAsyncJobResult(data, function(secondData){
    //...
  });
});
B();
C();
```

JS의 Promise가 왜 나왔는지에 대해서 검색해 본다면 반드시 나오는 말인 '콜백 지옥'이 바로 여기서 기인한다. 예전에는 비동기 처리에 콜백만을 썼는데 이러다가 콜백 지옥이 생겼고 Promise를 쓰면 콜백 지옥을 해결할 수 있고 신뢰성도 늘어나고...하는 말들은 유명하다.

아무튼 이렇게 콜백을 통해서 비동기 작업 환경을 보존해 주는 방법으로 인해서 엄청난 콜백의 연쇄가 만들어지게 된다. 진짜 콜백 지옥 코드라면 아마 저기에 errorback 함수도 들어가 있겠지만 콜백 지옥 해설이 목적이 아니므로 넘어가자.

```js
A();
/* 비동기 작업 완료시 실행시킬 함수를 콜백으로 받는다 */
asyncJob(function(data){
  useAsyncJobResult(data, function(secondData){
    useAsyncJobResultOther(data, function(someData){
      // ...
    });
    //...
  });
});
B();
C();
```

아마 해당 콜백 함수들의 내부는 이런 식으로 비동기 처리가 되어 있을 것이다. Eventemitter나 커스텀 이벤트를 사용해서 더 똑똑하게 비동기 완료를 감지할 수도 있겠으나 이게 주제가 아니므로 적당히 했다.

```js
function useAsyncJobResult(data, callback){
  setTimeout(function(){
    callback(data);
  }, 100);
}
```

이렇게 하면 비동기 작업의 실행 환경을(적어도 비동기 완료 이후 실행할 작업에 필요할 환경 정보들을) 보존할 수 있다. 아래와 같은 코드에서 만약 `asyncWrapper`가 `asyncJob`과 그 콜백보다 먼저 종료되더라도 `asyncJob` 내부에서 콜백이 실행될 때는 함수 인수를 통해 `data`내용이 힙에 보존되어 있고 이는 `useAsyncJobResult`에 전달된다. 우리가 원하는 비동기 작업 실행 -> 그 결과물을 이용한 작업의 순서가 보장되었고 당연히 이는 전부 비동기로 처리되기 때문에 다른 부분에 영향을 주지도 않는다.

```js
function asyncWrapper(){

  // do something

  asyncJob(function(data){
    useAsyncJobResult(data, function(secondData){
      //...
    });
  });
}
```

이런 실행 환경의 보장을 위해서는 당연히 비동기 함수가 전염되어야 한다. 만약 `asyncJob`의 결과물을 가공하는 함수들의 체인이 있다면 그것들은 모두 `asyncJob`의 인수로 넘어가는 콜백 내부의 콜백 내부의 ... 내부의 콜백이 되어야 할 것이다.

이는 [continuation-passing style](http://dogfeet.github.io/articles/2012/by-example-continuation-passing-style-in-javascript.html)이라고 불리는 기존 패턴과 비슷한데 실제로 컴파일러에서 코드를 최적화할 때 사용하는 방식이다. (C#의 `.NET`의 경우 컴파일러에서 await을 이런 continuation-passing style로 변환하기 때문에 따로 await에 대한 런타임 지원이 없다고 한다)

하지만 이는 너무 복잡하다. Node에서도 이런 continuation-passing style방식을 쓰긴 하지만 개발에서 많이 쓰이지 않는 방식인 이유이다.

더 큰 문제는 복잡성도 복잡성이지만, 이런 환경 전달의 복잡성이 근본적으로 싱글스레드에서는 쉽게 해결할 수 없는 문제라는 것이다. 

콜스택이 하나뿐이라 비동기 함수가 완료된 후 실행되어야 할 콜백과 해당 콜백이 가져야 할 환경을 개발자가 직접 콜백의 연쇄 호출을 통해 하나하나 설정해 줘야 한다는 게 근본적인 원인이기에, 개발자는 어떤 변수가 힙에 남아 있어야 하고 어떤 맥락이 비동기 함수 완료시 남아 있어야 하는가를 직접 설정해 줘야 한다. 이를 따져주며 콜백을 만드는 개발자의 머리가 터져나가는 소리가 과거에서 들려오는 것 같다. 

음, 전통적인 콜백보다 나은 것은 없을까? 무언가 이런 비동기 작업의 실행환경 보장을 좀더 깔끔하게 해줄 수 있는 무언가가...?

## 2.2. Promise와 async

이를 개선하기 위해 나온 것이 Promise이다. Promise가 이런 복잡성의 해결을 위해서만 나온 건 아니지만 Promise 역시 이 글의 주제가 아니므로 깊이 다루지는 않겠다. 그냥 문제를 좀 완화시켰다는 것 정도만 쓰고 넘어가자. Promise를 사용해 함수들을 변경했다는 가정 하에 다음과 비슷하게 변할 것이다.

```js
A();
asyncJob().then((data)=>{
  useAsyncJobResult(data);
});
B();
C();
```

혹은 좀더 현대 문법인 async/await을 사용할 수도 있겠다. Top-level await인지 아닌지는 여기서 그렇게 중요한 게 아니다. top-level await이 싫다면 이 코드도 그냥 어떤 async 함수 내부에 있다고 생각하면 된다.

```js
A();
const data=await asyncJob();
useAsyncJobResult(data);
B();
C();

/* 이는 논리적으로 사실 다음과 같다. */
A();
asyncJob().then((data)=>{
  useAsyncJobResult(data);
  B();
  C();
})
```

await이 실제로 작동하는 방식을 생각하면 이는 Promise의 then을 사용하는 코드와 큰 차이는 없지만 어쩐지 동기와 비동기의 진행 방향이 비슷해진 것 같다.

그런데 이건 결국 상황을 약간 낫게 할 뿐 근본적으로 해결할 수 없는 미봉책이다. [What color is your function?](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/)
에서는 심지어 이들을 약장수의 약 같은 걸로 비유되는 snake oil로 표현하고 콜백 대신 이걸 사용해서 비동기를 처리하는 것은 배를 맞거나 성기를 맞거나 둘 중 하나를 선택하는 급의 일일 뿐이라고 한다.

왜 그런가? Promise를 사용하더라도 비동기 함수의 완료 이후 실행되어야 할 작업의 맥락은 그 수단이 콜백 지옥이 아니다 뿐이지 직접 `then`을 통해 전해줘야 하기 때문이다. 그리고 async/await은 Promise를 내부적으로 숨겨서 비동기 함수를 마치 동기의 맥락에 있는 것처럼 사용하게 해줄 뿐이지 근본적인 문제 해결이 아니기 때문이다.

실제로 하나의 await만 함수의 콜체인에 있어도 비동기 함수의 상위 함수들은 모두 비동기가 되지 않는가? 이런 것들을 생각해보면 위의 비유는 극단적이기는 하지만 근본적인 문제 해결을 하지 못한다는 것은 분명하다.

## 2.3. 비동기 전염성을 그냥 없애 버린다면?

약간 다르게 접근해서, JS의 싱글스레드 환경에서 비동기 함수가 전염되지 않는 상황을 가정하고 비동기가 필요한 작업을 한다고 생각해보자. `asyncJob`이라는, 비동기 함수(`fetch`)를 사용하는 함수를 생각한다. 다음과 같은 코드가 될 것이다.

```js
function asyncJob(){
  const data=fetch("https://example.com");
  /* fetch의 결과물을 사용하는 작업 */
}
```

JS에서 비동기 함수를 사용할 때는 일반적으로 해당 함수의 결과를 사용해서 실행해야 하는 코드가 있기 마련이므로 fetch 이후에는 해당 결과를 사용하는 작업이 있다고 가정했다. 예를 들어서 서버에서 데이터를 가져온 후 그걸 화면에 보여주는 작업이라든지.

그러면 [비동기는 호출 스레드를 블로킹하지 않으므로](https://stackoverflow.com/questions/44894691/why-await-requires-async-in-function-definition) fetch 다음에 오는 `asyncJob` 내부 코드는 바로 실행된다.

하지만 이렇게 하면 fetch의 결과물을 사용하는 작업은 제대로 진행될 수 없다. 해당 작업이 실행되는 시점에 fetch의 결과물이 존재한다는 보장이 안 되기 때문이다. 비동기 처리는 잘 되었지만 우리는 그걸로 아무것도 제대로 할 수가 없다!

![await 없는 비동기](./async-without-await.png)

그럼 이제 다음처럼 바꿀 수 있다고 해보자. await을 이용해서 fetch를 기다리고 따라서 return 이전에 fetch가 완료된다는 것을 보장하였다. 비동기의 전염성은 여전히 없다고 가정하므로 `asyncJob`함수는 async를 붙이지 않는다.

```js
function asyncJob(){
  const data=await fetch("https://example.com");
  /* fetch의 결과물을 사용하는 작업 */
  return resultFromJob;
}
```

그런데 위 코드에 있는 `fetch의 결과물을 사용하는 작업`부분은 어디서 실행되어야 하는가? 그 작업 또한 JS코드일 것이므로 JS 런타임의 하나뿐인 메인 스레드에서 실행되어야 한다. 따라서 `asyncJob`함수에서는 `fetch`가 끝날 때까지 메인 스레드를 블로킹해야 한다.

그리고 이 함수를 다음과 같은 코드에서 쓴다고 가정하자. `asyncJob`의 결과물을 `B()`함수에서 사용하고 있다.

```js
A();
const data=asyncJob();
B(data);
```

하지만 `B()`에서 `asyncJob`의 결과물을 사용하기 위해서는 비동기 연산을 포함하는 `asyncJob`이 끝나기를 기다려야 한다. 엔진 쪽에서 이를 알 수 있을까? 없다. 따라서 우리는 `asyncJob` 호출에도 await을 붙여서 해당 함수에는 비동기 작업이 있으며 우리는 그것이 끝날 때까지 기다려야 한다는 것을 알려줘야 한다.

```js
A();
const data=await asyncJob();
B(data);
```

`asyncJob`내부의 비동기성이 전염되고 있는 것을 볼 수 있다. 싱글스레드에서는 이런 전염성이 있을 수밖에 없는 것이다.

## 2.4. 여담 - 왜 async를 쓰는가?

그런데 JS를 아는 사람이라면 위 글을 읽다가 의문이 들 수 있다. 우리는 지금까지 JS를 하면서 비동기 함수를 사용할 때 async를 붙여서 사용했다.

하지만 위의 예시에서 async는 코빼기도 보이지 않는다. 그렇게 썼다고 해서 크게 이상한 것도 없지 않은가? await을 사용해서 비동기 함수를 기다렸고 해당 작업이 완료된 후에는 비동기 함수 결과물을 사용하는 작업을 진행할 수 있었다.

그러면 우리는 왜 JS에서 async 함수 내부에서만 await을 쓰는 것일까? 몇 가지 이유가 있다.

첫번째는 성능상의 이유다. 만약 우리가 위의 예시처럼 await을 사용한다고 하자. 

```js
function asyncJob(){
  const data=await fetch("https://example.com");
  /* fetch의 결과물을 사용하는 작업 */
  return resultFromJob;
}

A();
const data=await asyncJob();
B(data);
```

그럼 우리는 await이 기다리는 작업이 끝날 때까지 메인 스레드를 블로킹해야 한다(JS는 싱글스레드 언어니까). fetch가 끝날 때까지 기다리고, 또 fetch의 결과물을 사용하는 작업이 끝나고 `asyncJob`에서 결과를 리턴할 때까지 메인스레드는 기다려야 한다.

async를 사용하면 어떻게 되는데? 또 async가 시작되지...가 아니라 Promise가 리턴되게 된다.

```js
async function asyncJob(){
  const data=await fetch("https://example.com");
  /* fetch의 결과물을 사용하는 작업 */
  return resultFromJob;
}

/* 위 함수는 다음과 같이 동작하게 된다. */
function asyncJob(){
  return fetch("https://example.com").then((data)=>{
    /* fetch의 결과물을 사용하는 작업 */
  });
}
```

따라서 fetch가 끝나면 진행할 작업을 마이크로태스크 큐로 넘김으로써 fetch가 진행되는 동안 메인 스레드가 블로킹되지 않도록 할 수 있다. 이는 성능상의 이점이 있다.

물론 이런 처리를 직접 해줌으로써 async를 쓰지 않고도 비동기 작업 동안 메인스레드의 블로킹을 막을 수 있다. 하지만 async 키워드를 쓰면 이런 작업을 쉽게 할 수 있고 실수 가능성도 줄어든다. 비동기 처리가 연쇄되다 보면 위처럼 직접 Promise를 사용하다가는 실수할 가능성이 높아질 수밖에 없다.

[왜 async를 함수에 붙여야 하는가에 대한 스택오버플로 답변에서는 더 복잡해지는 예시를 제공하고 있다.](https://stackoverflow.com/a/39384160)

```js
async function test() {
  const user = await getUser();
  const report = await user.getReport();
  report.read = true
  return report;
}

/* 위 함수는 다음과 같이 동작하게 된다. */
function test() {
  return getUser().then(function (user) {
    return user.getReport().then(function (report) {
      report.read = true;
      return report;
    });
  });
}
```

이런 코드를 작성하면서 실수하지 않기는 쉽지 않을 것이다.

await을 async 함수 내부에서만 써야 하는 두번째 이유는 후방 호환성을 위해서이다. ES2017 이전에는 `await`이 JS의 키워드가 아니었다. 

따라서 `await`을 그냥 도입할 시 이전에 `await`을 변수명 등으로 썼던 코드들은 모두 에러를 일으키게 될 것이었다. [실제로 await키워드를 핵심적으로 사용했던 라이브러리도 있었다.](https://www.npmjs.com/package/asyncawait)

이런 문제를 해결하기 위해 JS에서는 `async`라는 키워드를 도입하고 `await`은 `async`함수 내부에서는 식별자가 아니라 예약어로 취급하도록 하여 이전 코드와의 호환성을 유지한 것이다.

JS에서 async/await을 도입하기 이전에 C#에서 해당 키워드를 도입했기 때문에 영향을 받았다는 주장도 있는데, 물론 키워드를 따라했을 수는 있다. 하지만 [C#에서 async 키워드를 도입한 이유도 근본적으로는 await을 식별자가 아니라 예약어로 취급하라는 정보를 프로그램 실행시 제공하는 것이었다.](https://www.sysnet.pe.kr/2/0/11129) 

[또한 원래 async는 await을 식별자로 처리하도록 하기 위한 키워드였을 뿐이므로 처음에는 이름도 async가 아니라 `function^ foo(){}`와 같이 `^`를 사용해서 함수에 표시하는 것이었다.](https://stackoverflow.com/questions/44184006/js-async-await-why-does-await-need-async)

그리고 세번째의 작은 이유가 하나 더 있다. async는 JS 파서에 비동기 함수에 대한 단서(marker)를 제공한다. 이 함수는 비동기로 작동하며 함수의 종료까지 좀 시간이 걸릴 수 있다는 걸 알려주는 것이다.

async가 있으면 파서에서는 어떤 함수가 비동기인지 결정하기 위해서 해당 함수를 전부 검토하는 것이 아니라 async 키워드가 붙은 함수를 비동기로 분류하면 되고 이는 파싱 성능을 향상시킨다.

# 3. 비동기 전염성 문제 해결?

그럼 이렇게 비동기 함수의 결과 사용 하나를 위해서 그걸 감싸는 모든 함수가 비동기가 되어야 하는 이런 비동기의 전염성 문제를 어떻게 해결할 수 있을까?

Promise나 async/await은 앞서 보았듯이 근본적인 문제를 해결할 수 없다. 근본적인 문제는 함수의 실행 맥락 유지이기 때문이다.

## 3.1. 해결 가능한가?

이런 문제가 없는 언어가 있는가? 부터 살펴봐야 하겠다. 있다. java의 non-blocking IO나 C#의 `Task<T>`와 같은 것들을 보면 이런 비동기의 전염성 문제가 없다. Go에서는 고루틴을, Ruby에서는 fiber, Lua는 coroutine을 사용하여 이런 비동기 전염성 문제를 해결한다.

그럼 위 언어들의 공통점은 뭘까? 멀티스레딩을 한다, 더 정확하게는 여러 독립적인 콜스택이 있고 그들 간에 스위칭이 가능하다는 것이다.

이렇게 하면 모든 함수의 실행이 병렬로 진행되고 결과값을 가지고 스레드끼리 통신하여 결과를 합칠 수 있다. 이렇게 하면 비동기 함수의 전염성 문제는 해결된다.

핵심은 스레드가 여러 개라는 게 아니라 멀티스레딩으로 인해 콜스택이 여러 개라서 이들간의 스위칭이 가능하다는 것이다. 비동기 함수와 그 이후 작업에 대한 맥락이 저장된 콜스택을 따로 둘 수 있기 때문에 이런 비동기 함수 전염성 문제가 해결된 것이다.

## 3.2. 멀티스레드가 답은 아니다 - 그럼?

여기부터는 원 글의 생각이라기보다는 [와이콤비네이터 페이지에 올라온 해당 글의 댓글창](https://news.ycombinator.com/item?id=8984648) 내용을 나의 선호대로 정리하여 작성하였다.

[What Color is Your Function?](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/)에서는 Go와 같은 언어를 답으로 제시하고 있다.

Go는 모든 작업이 비동기로 흘러가고 많은 스레드를 통해서 이 비동기 작업들을 관리한다. 고루틴을 통해서 모든 함수에서 이를 제어하는 것도 가능하다.

따라서 모든 함수에서 동기함수와 비동기 함수 실행이 가능하고 비동기 함수의 전염성은 없다. 모든 작업이 비동기고 채널을 통해 각 스레드간의 통신을 하며 내부적으로는 async/await을 사용중이기 때문이다. 즉 모든 작업이 비동기지만 동기처럼 보이게 된다.

현대의 많은 언어들이 모든 작업을 비동기로 처리하도록 한 후 내부적으로 async await을 심어두고 외부에는 이를 숨기는 이런 방법을 택하고 있다.

하지만 요즘 장치들의 성능이 좋아져서 문제가 없어 보이지만 스레드는 결국 제한된 자원이며 생성과 스위칭 비용이 큰 자원이다. 그리고 동기화도 되어야 한다. 멀티스레드가 장점만 있지 않다는 건 기본적인 CS과목에도 나오지 않는가? 운영체제에 나오는 그 멀티스레딩이 진짜 이 비동기의 전염성에 대한 해답일까? 진짜?

[What Color is Your Function?](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/)의 저자인 Bob Nystrom의 머릿속에 들어가 볼 수는 없지만, OS에 나오는 그 멀티스레딩을 해법으로 제시한 건 아니라고 본다. 글에서 제안하는 현존 최고의 솔루션이 Go의 고루틴이며, 이런 글을 쓸 정도의 사람이 운영체제 멀티스레딩에서의 문제들에 대해 아예 모를 리는 없는데 스레드의 생성에 대해서는 전혀 언급하지 않고 있다는 점에 주목해야 한다고 본다.

Bob이 실제로 원하고 있는 것은 진짜 스레드가 아니라 콜스택 환경의 스위칭이다. Go언어는 실제 운영체제의 스레드를 여러 개 쓰는 게 아니다. 좀 더 경량이고 생성, 스위칭 비용이 적은 그린 스레드를 사용하며 고루틴은 그보다도 더 경량이다.

심지어는 진짜 콜스택이 여러 개 있을 필요도 없다. 해당 글의 멀티스레딩에 대한 제안은 진짜 그 뜻인 게 아니라 문법적인 것이므로(his concern is syntactic, not semantic)만약 스레드를 만드는 것처럼 보이지만 실제로는 CPS로 컴파일되어서 콜스택 여러 개 없이도 비동기 함수의 전염성 문제를 해결할 수 있다면 Bob은 분명 좋아할 것이다.

```
Since he's a Go fan, he might prefer lightweight threads running in an event loop rather than real threads with their context-switches. Moreover his concern is syntactic, not semantic: so maybe he'd like something which "looks thread-like" but "complies-to-CPS" too.

와이콤비네이터 페이지에 올라온 해당 글에 대한 drostie의 댓글 중 하나에서 발췌
https://news.ycombinator.com/item?id=8984648
```

하지만 이렇게 멀티스레딩(혹은 그것처럼 보이는) 방식의 해결은 성능상 문제가 없을지는 몰라도 오히려 코드 작성을 복잡하게 만들 수 있다. 비동기 함수의 전염성이 없어진 건 좋지만, 이제 그들의 순서를 보장하기 위해서 또 개발자는 채널이나 뮤텍스를 쓰면서 머리를 싸매야 한다.

따라서 개인적으로는 이 글의 시사점은 결국 비동기 함수의 전염성에 완벽한 해결책은 없으며 어느 쪽으로 가도 폭탄뿐인 길이라는 거라고 생각한다. Go와 같은 언어에서 폭탄을 좀 제거하기는 했지만 결국은 비슷하다...

사실 어떤 결론이 있으리라고 기대했는데, 생각보다는 그렇지 않았다. 그냥 비동기 함수의 전염성 문제는 깔끔하게 해결할 수 없다는 글이었다. 무언가 전염성을 퇴치할 마법이 있는 줄 알았는데, 그런 건 없었다.

그리고 개인적으로는 둘 중 그냥 async-await이 더 나은 해결책이라고 생각한다. 비동기의 전염성은 프로그램을 망치는 것이 아니라 '프로그램이 망쳐질 수 있다'는 걸 알려주는 수단이라고 보이기 때문이다.

> Inconvenient knowledge is better than convenient ignorance
> 
> [Red & blue functions are actually a good thing](https://blainehansen.me/post/red-blue-functions-are-actually-good/)에서 발췌

# 참고

https://willowryu.github.io/2021-05-21/

https://rinae.dev/posts/why-every-beginner-front-end-developer-should-know-publish-subscribe-pattern-kr

https://medium.com/technofunnel/javascript-async-await-c83b15950a71

https://inpa.tistory.com/entry/%F0%9F%94%84-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%A3%A8%ED%94%84-%EA%B5%AC%EC%A1%B0-%EB%8F%99%EC%9E%91-%EC%9B%90%EB%A6%AC

https://stackoverflow.com/questions/66113393/why-is-async-required-to-call-await-inside-a-javascript-function-body

https://stackoverflow.com/questions/44184006/js-async-await-why-does-await-need-async

https://stackoverflow.com/questions/31483342/es2017-async-vs-yield/41744179#41744179

https://www.sysnet.pe.kr/2/0/11129

https://stackoverflow.com/questions/35380162/is-it-ok-to-use-async-await-almost-everywhere

https://medium.com/technofunnel/javascript-async-await-c83b15950a71

https://stackoverflow.com/questions/62196932/what-are-asynchronous-functions-in-javascript-what-is-async-and-await-in-ja

https://dev.to/thebabscraig/the-javascript-execution-context-call-stack-event-loop-1if1

https://medium.com/sjk5766/call-stack%EA%B3%BC-execution-context-%EB%A5%BC-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90-3c877072db79

https://blainehansen.me/post/red-blue-functions-are-actually-good/

https://curiouscactus.wixsite.com/blog/post/async-await-considered-harmful

https://frozenpond.tistory.com/148

https://news.ycombinator.com/item?id=8984648
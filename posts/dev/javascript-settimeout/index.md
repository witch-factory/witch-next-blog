---
title: JS 탐구생활 - setTimeout의 부정확성과 이벤트 루프
date: "2023-01-30T01:00:00Z"
description: "JS의 setTimeout 함수는 정확하지 않다. 그 이유는?"
tags: ["javascript"]
---

# 1. setTimeout

setTimeout 함수는 브라우저에서 제공하는 함수로, 주어진 시간이 지난 후에 함수를 실행시킨다.

```js
let tid=setTimeout(func, time, arg1, arg2, ...);
```

그런데 이렇게 사용하면, 정확한 시간이 지난 후에 함수가 실행되지 않을 수 있다. 이런 이유들은 여러 가지 있는데 이를 하나씩 알아보자.

# 2. 중첩 타임아웃

HTML 표준은 중첩 타이머의 실행 간격에 관한 제약도 정의하고 있다. 5번째 중첩 타이머 이후에는 대기시간을 최소 4ms로 강제하는 것이다. setTimeout, setInterval 모두 마찬가지다.

```js
let start = Date.now();
let times = [];

setTimeout(function tick() {
  times.push(Date.now() - start);
  // 시작한 지 100ms가 지나면 각 함수의 호출 시간들을 담은 배열을 출력
  if (start + 100 < Date.now()) {
    console.log(times);
  } else {
    setTimeout(tick, 0);
  }
});
// [0, 0, 1, 1, 5, 10, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59, 64, 69, 74, 79, 84, 89, 94, 99, 104]
```

아래 코드를 실행하면 물론 세부적인 배열의 숫자들은 약간 다를 수 있겠지만 5번째 중첩 호출부터는 함수의 호출 간에 최소 4ms의 지연이 있다는 것을 알 수 있다. 실제로 setTimeout에는 0의 딜레이만 지정했는데도 말이다.

이런 제약 때문에 setTimeout은 완벽히 정확한 시간 간격을 보장하지 않는다.

# 3. 브라우저의 비활성 탭 관리

다음 코드는 1초마다 'tick'이라는 로그를 찍도록 하는 코드이다.

```js
setTimeout(function tick() {
  console.log("tick");
  setTimeout(tick, 1000);
}, 1000);
```

그런데 이 코드를 실행하고 브라우저의 탭을 비활성화(그냥 다른 탭을 보고 있으면 된다)한 후 10초를 세고 다시 탭을 열어 보면, 로그가 10개 미만으로 찍혀 있는 것을 볼 수 있다. 

이는 브라우저가 비활성화된 탭에서는 최소 딜레이를 강제하기 때문이다. 백그라운드 탭으로 인한 부하를 줄이기 위해서다.

# 4. 늦은 타임아웃

페이지나 OS, 브라우저가 다른 작업으로 인해 바쁠 경우 타임아웃이 더 지연될 수 있다. setTimeout을 호출한 스레드의 종료 이전에는 setTimeout의 콜백이 실행되지 않기 때문이다.

다음 코드로 이를 확인할 수 있다.

```js
setTimeout(() => {
  console.log("a");
});
console.log("b");
// b a
```

위 코드는 브라우저에서 실행하면 'b'가 먼저 출력되고 'a'가 출력된다. 현재 스레드에서 처리하고 있던 스크립트가 먼저 완료되어 'b'가 출력되고 그 이후에서야 'a'가 출력되는 것이다.

그런데 만약 위 코드에서 `console.log('b')`에 해당하는 부분이 시간이 굉장히 많이 걸리는 코드라면 setTimeout에 전달한 함수의 실행은 매우 늦어질 것이다. 이런 이유로 setTimeout이 지정한 지연 시간이 부정확하게 적용될 수 있다.

## 4.1. setTimeout의 실행 과정

setTimeout 실행 과정은 다음과 같다.

1. setTimeout이 실행된다.
2. 이 setTimeout은 WebAPI에 전달된다.
3. WebAPI는 setTimeout이 지정한 delay가 지나면 setTimeout의 콜백 함수를 태스크 큐로 전달한다.
4. 이벤트 루프가 돌다가 콜스택이 비어있으면 태스크 큐의 top에 있는 콜백 함수를 꺼내서 콜스택에 넣는다.

그런데 만약 콜스택이 현재 어떤 코드를 실행시키고 있다면 이벤트 루프는 block된다. 즉, 만약 브라우저에서 어떤 작업을 굉장히 바쁘게 실행하고 있다면 이벤트 루프는 계속 block되어 있을 테고 따라서 setTimeout의 콜백은 태스크 큐에서 콜스택으로 전달되지 못할 것이다.

이런 JS의 비동기 실행에 관한 것은 [이 글](https://www.witch.work/javascript-event-loop-dive/)에 더 자세히 다루었다.

# 5. 기타 이유들

파이어폭스는 현재 탭이 로딩중일 시 setTimeout의 타이머 실행을 지연시킨다.

그리고 WebExtension에서는 setTimeout을 신뢰할 수 없으므로 alarm API를 사용해야 한다.

IE, 크롬, 파이어폭스 등의 브라우저는 딜레이를 내부적으로 32비트 부호있는 정수로 저장한다. 따라서 2147483647ms(약 24.8일)보다 큰 딜레이를 주면 정수 오버플로우로 인해 타이머가 즉시 만료된다.

# 참고

https://developer.mozilla.org/ko/docs/Web/API/setTimeout#%EB%94%9C%EB%A0%88%EC%9D%B4%EA%B0%80_%EC%A7%80%EC%A0%95%ED%95%9C_%EA%B0%92%EB%B3%B4%EB%8B%A4_%EB%8D%94_%EA%B8%B4_%EC%9D%B4%EC%9C%A0

https://ssocoit.tistory.com/249

https://ko.javascript.info/settimeout-setinterval

https://negabaro.github.io/archive/js-async-detail

https://velog.io/@seongkyun/fetch-setTimeout%EC%9D%80-%ED%91%9C%EC%A4%80-API%EC%9D%BC%EA%B9%8C-len7n3gc

https://joooing.tistory.com/entry/%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A3%A8%ED%94%84-setTimeout%EC%9D%98-%EC%8B%9C%EA%B0%84%EC%9D%80-%EC%A0%95%ED%99%95%ED%95%A0%EA%B9%8C

https://felixgerschau.com/javascript-event-loop-call-stack/#web-apis
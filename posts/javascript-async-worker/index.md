---
title: Javascript와 비동기 - 워커
date: "2023-08-26T00:00:00Z"
description: "JS의 한계를 극복하기 위해 별도의 스레드를 두는 워커"
tags: ["javascript"]
---

# 1. 워커 소개

JS는 싱글스레드 언어이다. 그래서 한 번에 한 가지 작업만 수행할 수 있고 이는 페이지 전체에 적용된다. 아주 무거운 작업을 하나의 컴포넌트에서 진행하고 있다면 다른 컴포넌트의 동작은 막히는 식이다.

워커는 이 문제를 어느 정도 해결해준다. 별도의 작업 흐름(스레드)을 만들어서 다른 스레드에서 작업을 실행할 수 있는 기능을 제공하는 것이다. 흔히 이야기하는 멀티스레드의 문제점 그러니까 스레드 간의 동기화 문제 등을 만들게 되지만 메인 스레드의 응답성을 얻게 된다.

이런 문제를 해결하기 위해 워커와 메인스레드 코드는 서로의 변수에 직접 접근할 수 없고 메시지를 통해서 소통한다. 특히 워커는 DOM에 접근할 수 없다.

# 2. 워커 사용해보기

## 2.1. 기존의 코드

워커를 이용해서 작업을 다른 스레드에 넘기는 것을 실습해 보자. 먼저 `index.html`을 다음과 같이 만든다. `<input>`태그에 있는 숫자만큼의 소수를 생성하는 코드를 만들 것이다. 

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
    <title>오~~래 걸리는 작업</title>
  </head>
  <body>
    <label>
      <span>소수의 개수</span>
      <input type="text" value="1000000">
    </label>
    <button id="generate">소수 생성 시작</button>
    <button id="reload">재시작</button>
    <div id="result"></div>
    <textarea>소수 생성 동안 이곳은 사용 불가능해진다.</textarea>

    <script src="./main.js"></script>
  </body>
</html>
```

`main.js`는 다음과 같이 작성한다. 이렇게 하면 `generatePrimes`함수가 실행되는 동안에는 `textarea`를 사용할 수 없다. 

```js
// main.js
function generatePrimes(q){
  function isPrime(n){
    for(let c=2;c*c<=n;c++){
      if(n%c===0){
        return false
      }
    }
    return true;
  }

  const primes=[];
  const mx=1000000;

  while(primes.length<q){
    const n=Math.floor(Math.random()*(mx+1));
    if(isPrime(n)){
      primes.push(n);
    }
  }
  return primes;
}

document.getElementById('generate').addEventListener('click',function(){
  const q=document.querySelector('input').value;
  const primes=generatePrimes(q);
  const result=document.getElementById('result');
  document.getElementById('result').textContent=`소수 ${q}개 생성 완료`;
})

document.getElementById('reload').addEventListener('click',function(){
  location.reload();
})
```

## 2.2. 워커를 이용한 개선

이제 `generate.js`를 만들고 `main.js`를 다음과 같이 수정한다.

```js
// `generate.js`의 코드를 가져와서 워커 생성
const worker=new Worker('./generate.js');

document.getElementById('generate').addEventListener('click',function(){
  const q=document.querySelector('input').value;
  // 워커에 메시지를 보내자.
  /* command는 워커가 수행할 작업을 식별할 문자열, q는 생성할 소수 개수 */
  worker.postMessage({
    command:'generate', q:q,
  });
})

// 워커에서 작업이 완료되었다는 메시지가 도착할 시 실행할 함수 지정
worker.addEventListener('message',(msg)=>{
  document.getElementById('result').textContent=`소수 ${msg.data}개 생성 완료`;
});

document.getElementById('reload').addEventListener('click',function(){
  location.reload();
})
```

`generate.js`는 다음과 같다.

```js
// 워커가 만들어지자마자 이 코드가 실행된다.
addEventListener('message',(msg)=>{
  // msg.data는 main.js에서 메시지로 전달된 인수의 복사본
  if(msg.data.command==='generate'){
    generatePrimes(msg.data.q);
  }
});

function generatePrimes(q){
  function isPrime(n){
    for(let c=2;c*c<=n;c++){
      if(n%c===0){
        return false
      }
    }
    return true;
  }

  const primes=[];
  const mx=1000000;

  while(primes.length<q){
    const n=Math.floor(Math.random()*(mx+1));
    if(isPrime(n)){
      primes.push(n);
    }
  }
  // 작업이 끝나면 메인 스크립트로 메시지를 보낸다.
  postMessage(primes.length);
}
```

이를 실행하기 위해서 [로컬 테스트 서버 설정](https://developer.mozilla.org/ko/docs/Learn/Common_questions/Tools_and_setup/set_up_a_local_testing_server)을 했다.

파이썬 설치

```
brew install python3
-> 설치 버전 확인
python3 --version
```

그리고 위의 index.html이 있는 폴더에서 서버 구동

```
python3 -m http.server
```

이러면 기본적으로 8000번 포트에서 서버가 구동된다. 이제 브라우저에서 `localhost:8000`으로 접속하면 된다. 그러면 위에서 만든 `index.html`을 시험해 볼 수 있다.

이제 소수를 생성하는 동안 textarea를 사용할 수 있다! 이렇게 워커를 사용하면 작업을 별도의 스레드로 넘길 수 있다. 이때 워커는 메인스레드와 변수를 공유하지 않고 메시지로만 소통한다. 워커가 DOM에 접근할 수는 없지만 메인 스레드의 응답성에는 도움을 줄 수 있다.

다른 유형의 워커도 있는데 언젠가 알아보자.
[우리가 사용한 건 웹 워커](https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API/Using_web_workers)
[서비스 워커](https://developer.mozilla.org/ko/docs/Web/API/Service_Worker_API/Using_Service_Workers)
[공유 워커](https://developer.mozilla.org/ko/docs/Web/API/SharedWorker)
[같이보기](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Asynchronous/Introducing_workers#%EA%B0%99%EC%9D%B4_%EB%B3%B4%EA%B8%B0)

# 참고

https://developer.mozilla.org/ko/docs/Learn/JavaScript/Asynchronous/Introducing_workers
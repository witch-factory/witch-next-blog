---
title: SWR로 전역 상태 관리해보기
date: "2023-03-21T02:00:00Z"
description: "SWR로 전역 상태 관리도 가능하다고?"
tags: ["web", "study", "front", "project"]
---

# 1. SWR로도 전역 상태 관리가 가능하다?

SWR은 React에서 사용하는 라이브러리로, 데이터를 가져오는 것을 도와주는 라이브러리이다. 클라이언트와 서버의 관심사를 분리해야 한다는 철학에서 나왔다. 따라서 서버 데이터를 fetching하는 것을 도와준다.

이는 recoil, jotai 등의 전역 상태 관리 라이브러리와는 분명 다른 목적에 쓰라고 만들어졌다. 하지만 SWR을 사용하면 전역 상태 관리도 가능하다고 한다. 따라서 그 방법을 알아보았다.

SWR은 설치되어 있다고 가정하겠다.

# 2. 전역 상태 관리하기, context API로

전역 상태 관리를 위해서는 두 다른 컴포넌트가 같은 데이터를 공유하도록 하면 된다. 예를 들어서 다음과 같은 상황에서 A, B 컴포넌트에 같은 데이터를 공유하도록 하면 된다. 물론 MyPage에서 관리하는 데이터를 props를 통해서 A, B에 전달하는 것이 아니라, A에서 필요한 데이터를 A에서 즉시 불러와서 사용할 수 있도록 하는 것이다. 

만약 React에서 기본적으로 제공하는 context API를 사용해서 전역 상태 관리를 구현하면 다음과 같이 될 것이다.

```jsx
export const MyContext = React.createContext("default value");

function MyPage() {
  const contextData = "못의 날개는 세기의 명곡이다";

  return (
    <MyContext.Provider value={contextData}>
      <section>
        <A />
        <B />
      </section>
    </MyContext.Provider>
  );
}
```

Provider에 감싸인 컴포넌트에서는 컨텍스트 값을 가져와서 사용할 수 있다.

```jsx
function A() {
  const context = React.useContext(MyContext);
  return <div>{context}</div>;
}

function B() {
  const context = React.useContext(MyContext);
  return <div>{context}</div>;
}
```

이걸 SWR을 사용해서 똑같이 해보자.

# 3. SWR로 전역 상태 관리하기

SWR은 fetch한 데이터를 로컬 어딘가에 캐싱해 놓는다. 그리고 이를 fetch에 쓰인 key와 연동한다. 그리고 갱신 요청이 없다면 그 캐시를 사용한다.

예를 들어서 `/data`라는 URL에 어떤 데이터가 저장되어 있다. 그리고 `/data`에 저장된 데이터가 필요한데 그게 없다면 새로 fetch한다. 하지만 만약 그 데이터가 이미 fetch된 상태이며 갱신될 필요가 없다면 SWR은 그것을 가져와서 주는 것이다. 이렇게 SWR은 데이터를 캐싱해 놓는다.

즉 클라이언트 어딘가에 데이터를 캐싱해 놓는다는 뜻이다! 이걸 보면 간단한 전역 상태 관리를 할 수 있다고 생각할 수 있다.

## 3.1. 상태 만들기

SWR로 전역 상태를 관리하는 것은 SWR이 useSWR에 주어진 key에 데이터를 연동하는 것을 이용해서 구현한다. 다음과 같이 쓰는 것이다. 일단 SWR로 상태를 하나 만들자.

```jsx
const { data, mutate } = useSWR("global", {
  fallbackData: "뭐든 할 수 있을 것만 같던 매일 밤 차오르는 마음은",
});
```

이렇게 짜면 "global"이라는 키와 연동된 클라이언트 캐시가 없으므로 SWR은 `http://localhost:3000/global`에 fetcher로 요청을 보내게 된다. 그런데 우리는 fetcher 인수를 전달하지 않았다. 따라서 default fetcher로 요청을 보내게 된다. 그 fetcher는 다음과 같다.

```jsx
fetcher = window.fetch(url).then(res => res.json())
```

`http://localhost:3000/global`에는 아무것도 없다. 당연히 fetcher에선 에러가 발생한다. 하지만 이를 catch하는 코드가 없으므로 그냥 넘어간다. 그러나 fetch의 실패는 인식되므로 클라이언트 캐시에 fallbackData가 사용되고 이는 우리가 전달한 key인 "global"과 엮인다.

즉 현재 클라이언트 캐시에는 "global"이라는 키와 "뭐든 할 수 있을 것만 같던 매일 밤 차오르는 마음은"라는 데이터가 연동되어 있다. 그리고 이를 data인수로 조회할 수 있다.

```jsx
function A() {
  const { data, mutate } = useSWR("global", {
    fallbackData: "뭐든 할 수 있을 것만 같던 매일 밤 차오르는 마음은",
  });
  if (!data) {
    return <div>로딩중</div>;
  }
  return <div>{data}</div>;
}
```

## 3.2. 상태 변경하기

그럼 이렇게 저장한 전역 상태를 어떻게 변경할 수 있을까? mutate를 사용하면 된다. SWR의 mutate는 클라이언트 캐시를 변경하게 해준다. 이 API에 관한 자세한 내용은 [공식 문서](https://swr.vercel.app/ko/docs/mutation)를 참고하자.

mutate에 비동기 함수를 전달하여 서버에서 데이터를 변경하는 작업을 할 수도 있지만, 우리는 클라이언트 캐싱을 이용하여 전역 상태 관리를 할 뿐이므로 단순히 캐시 업데이트만 해주자.

위의 전역 상태 데이터는 노래 가사인데, 버튼을 누르면 다음 가사 한 소절을 표시해 주는 것을 구현해보자.

```jsx
function A() {
  const { data, mutate } = useSWR("global", {
    fallbackData: "뭐든 할 수 있을 것만 같던 매일 밤 차오르는 마음은",
  });
  if (!data) {
    return <div>로딩중</div>;
  }
  return (
    <div>
      {data}
      <button
        onClick={() => {
          mutate("아물지 못하는 어제를 끌어안고 썩어버린 채 말이 없네");
        }}
      >
        다음 소절
      </button>
    </div>
  );
}
```

위 코드의 mutate는 useSWR의 리턴값을 사용했으므로 key는 기본적으로 바인딩되어 있다. 따라서 클라이언트 캐시를 어떤 값으로 업데이트할지만 전달해 주면 된다. 즉 위 코드에서 버튼을 누르면 "global"에 바인딩된 클라이언트 캐시가 변경되는 것이다.

그리고 mutate로 클라이언트 캐시를 최신화하고 나면 자동으로 useSWR의 리턴값인 data가 서버 데이터 fetch를 통해 최신화된다. 하지만 우리가 짠 코드에선 어차피 서버 데이터를 fetch할 수 없기 때문에(정확히는 에러 발생) 우리가 mutate로 업데이트한 클라이언트 캐시가 계속 사용된다.

우리는 클라이언트 캐시를 마치 전역 상태처럼 사용함으로써 SWR의 상태 관리를 하는 것이다.

## 3.3. fetch 최소화

데이터 fetch 요청은 많을수록 좋지 않다. 그럼 우리의 코드는 지금 얼마나 많은 fetch 요청을 보내고 있을까?

fetch를 할 때마다 콘솔 메시지를 출력하도록 해서 얼마나 많은 요청이 가고 있을지를 알아보자. 다음과 같이 fetcher 함수를 작성한다. 기본 fetcher에 콘솔을 찍는 기능을 추가한 것 뿐이다.

```jsx
const fetcher = (url: string) => {
  console.log("fetch 요청");
  return fetch(url).then((res) => res.json());
};
```

그리고 이를 아까 코드의 useSWR 인수에 추가한다.

```tsx
function A() {
  const { data, mutate } = useSWR("global", fetcher, {
    fallbackData: "뭐든 할 수 있을 것만 같던 매일 밤 차오르는 마음은",
  });
  if (!data) {
    return <div>로딩중</div>;
  }
  return (
    <div>
      {data}
      <button
        onClick={() => {
          mutate("아물지 못하는 어제를 끌어안고 썩어버린 채 말이 없네");
        }}
      >
        다음 소절
      </button>
    </div>
  );
}
```

이 상태에서 A 컴포넌트를 렌더링하면 콘솔에 fetch 요청이 반복되어 출력되는 것을 볼 수 있다. 나는 한번도 클라이언트 캐시를 갱신하지 않았는데도. 그리고 mutate를 하고 나면 더 자주 fetch된다.

우리의 최적 목표는 클라이언트 캐시를 최신화할 때만 fetch를 하고, 그 외에는 fetch를 하지 않는 것이다. 그럼 이를 어떻게 구현할 수 있을까? 필요없는 fetch를 생각해서 없애 보자.

먼저 fetcher에서 에러가 발생했을 때 재시도하는 게 있다. 하지만 우리는 클라이언트 캐시만 이용하므로 이 옵션은 사실상 필요가 없다. 이는 useSWR 옵션에서 shouldRetryOnError를 false로 설정하면 재시도를 막을 수 있다.

```tsx
const { data, mutate } = useSWR("global", fetcher, {
  fallbackData: "뭐든 할 수 있을 것만 같던 매일 밤 차오르는 마음은",
  shouldRetryOnError: false,
});
```

그리고 SWR에서는 자동 갱신 옵션들이 있다. revalidateIfStale, revalidateOnFocus, revalidateOnReconnect가 자동으로 켜져 있는데, 이로 인해서 갱신이 많이 되는 것이다. 물론 focusThrottleInterval이 기본적으로 5초로 설정되어 있기 때문에 너무 자주 갱신되지는 않도록 조절되고 있지만 굳이 필요없는 요청을 보낸다는 것은 변함이 없다.

이런 모든 종류들의 자동 갱신을 비활성화하는 useSWRImmutable을 쓰자.

```tsx
const { data, mutate } = useSWRImmutable("global", fetcher, {
  fallbackData: "뭐든 할 수 있을 것만 같던 매일 밤 차오르는 마음은",
  shouldRetryOnError: false,
});
```

이렇게 쓰고 나면 상태를 갱신할 때만 fetch가 일어나는 것을 볼 수 있다.

# 4. 커스텀 훅 만들기

이를 커스텀 훅으로 만들면 비로소 전역 상태 관리와 같이 쓸 수 있어진다.

## 4.1. 첫번째 커스텀 훅

우리는 앞서 노래 가사를 전역 상태로 관리했으므로, useSong이라는 전역 store hook을 만들어 보자.

```tsx
function useSong() {
  const { data: song, mutate: setSong } = useSWRImmutable("song", fetcher, {
    fallbackData: "뭐든 할 수 있을 것만 같던 매일 밤 차오르는 마음은",
    shouldRetryOnError: false,
  });
  return [song, setSong];
}
```

이는 useState와 비슷하게 쓸 수 있다.

```tsx
function A() {
  const [song, setSong] = useSong();
  return (
    <div>
      {song}
      <button
        onClick={() => {
          setSong("아물지 못하는 어제를 끌어안고 썩어버린 채 말이 없네");
        }}
      >
        다음 소절
      </button>
    </div>
  );
}
```

다른 컴포넌트에서도 useSong을 사용할 수 있고, 상태도 공유되는 것을 알 수 있다.

## 4.2. 개선된 커스텀 훅

아예 useSWRStore라는 훅을 만들어서 key와 초기값을 설정하여 쓸 수 있도록 하자. key가 같으면 같은 상태를 공유하도록 하자.

```tsx
function useSWRStore(key: string, initialData: any) {
  const { data, mutate } = useSWRImmutable(key, fetcher, {
    fallbackData: initialData,
    shouldRetryOnError: false,
  });
  return [data, mutate];
}
```

이러면 useSong이 쓰였던 위 컴포넌트를 다음과 같이 바꿀 수 있다.

```tsx
function A() {
  const [song, setSong] = useSWRStore(
    "song",
    "뭐든 할 수 있을 것만 같던 매일 밤 차오르는 마음은"
  );
  return (
    <div>
      {song}
      <button
        onClick={() => {
          setSong("아물지 못하는 어제를 끌어안고 썩어버린 채 말이 없네");
        }}
      >
        다음 소절
      </button>
    </div>
  );
}
```

그런데 문제가 있다. initialData를 모든 전역 상태 훅에 인수로 전달함으로 인해서 여러 가지 상태가 공존할 수 있게 된다. 

이는 useSWRStore 훅에서 initialData 인수를 제거한 후 상위 SWRConfig에서 fallback을 설정하는 식으로 해결할 수 있을 것으로 생각된다.

예를 들어서 다음처럼 하는 것이다. song이라는 key에 대해서는 "초기값"이라는 값을 fallback으로 설정하는 것이다. 그러면 A, B 컴포넌트에서 `useSWRStore("song");`을 쓸 때 자동으로 초기값이 "초기값"으로 설정된다. 그리고 편집은 똑같이 하면 된다.

```tsx
<SWRConfig
  value={{
    fallback: {
      song: "초기값",
    },
  }}
>
  <section>
    <A />
    <B />
  </section>
</SWRConfig>
```

A 컴포넌트에서 useSWRStore를 쓰는 예시

```tsx
function A() {
  const [song, setSong] = useSWRStore("song");
  return (
    <div>
      {song}
      <button
        onClick={() => {
          setSong("아물지 못하는 어제를 끌어안고 썩어버린 채 말이 없네12");
        }}
      >
        다음 소절
      </button>
    </div>
  );
}
```

점점 복잡해지는 느낌이 들지만 어쨌든 SWR의 클라이언트 캐싱을 이용해서 전역 상태를 관리하는 게 가능하다는 것이다. 하지만 복잡한 전역 상태가 생긴다면 zustand나 Recoil등 전역 상태관리를 위한 라이브러리를 따로 쓰는 게 더 낫겠다.

# 5. 번외

위에서 본 기본 fetcher는 fetch가 실패했을 때 Promise를 catch하는 부분이 없다. 그래서 이상했는데, 핸들링하지 못하는 에러라면 catch를 하지 않는 것이 더 낫다고 한다.

Promise의 catch를 하는 이유는 에러가 발생할 수 있는 부분에서 실제로 에러가 발생했을 때 어떤 대처를 하고 다른 동작을 하기 위함이다. try-catch를 쓰는 이유와 같다. 

하지만 만약 catch에서 어떤 에러 핸들링을 하지 않고 그저 `console.log(err)`따위만 한다면 에러 핸들링이 아니다.

그리고 요즘 JS는 unhandled promise rejection을 따로 처리해줄 수 있는 방법도 있기 때문에 굳이 catch를 쓰지 않아도 된다.

[참고1](https://stackoverflow.com/questions/54892213/creating-reusable-promises-without-catch)

[참고2](https://stackoverflow.com/questions/50896442/why-is-catcherr-console-errorerr-discouraged)

# 참고

https://velog.io/@e_juhee/Global-state

https://paco.me/writing/shared-hook-state-with-swr

SWR의 디폴트 fetcher https://github.com/vercel/swr/discussions/910

fetch https://www.daleseo.com/js-window-fetch/

https://ko.javascript.info/promise-error-handling

https://velog.io/@code-bebop/SWR-%EC%8B%AC%EC%B8%B5%ED%83%90%EA%B5%AC
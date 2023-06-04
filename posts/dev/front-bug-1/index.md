---
title: 프로젝트 트러블 슈팅 - 사용자 프로필의 업데이트
date: "2022-08-13T00:00:00Z"
description: "React에서 서버와 통신하면서 발생한 문제"
tags: ["web", "study", "front", "react", "axios"]
---

# 1. 문제의 발생

현재 밴드 운영을 도울 수 있는 웹사이트를 제작하는 프로젝트를 진행하고 있다. 나는 프론트를 맡아서 제작하고 있다. 이때 프로젝트에서 다루는 사용자 프로필에서 활동 지역과 선호하는 음악 장르, 주로 활동하는 요일 등 밴드 활동을 하는 사람이라면 으레 가지고 있을 정보들을 적는 영역이 있다. 이 영역에 대한 정보도 당연히 사용자와 연관되어서 서버에 저장되어 있다. 이때 이 정보들을 수정하는 api를 구현하면서 문제가 발생했다.

즉 특정 후보군 중 몇몇을 골라서 표시하는 필드일 때 사용자가 이 내용을 편집하고 서버에 저장할 수 있게 하는 기능을 구현하고 있었다. 이 글에서는 프로젝트에서 내가 맞닥뜨렸던 상황과 문제들을 구체적으로 서술하면서 일반적인 상황에 대한 해법을 찾은 과정을 정리해 둔다.

# 2. 프로젝트의 상황

밴드에 관련된 서비스이기 때문에 일반적으로 이 서비스의 사용자는 여러 음악 장르들 중 몇 개를 좋아할 것이다. 따라서 좋아하는 장르를 설정하고 보여줄 수 있는 필드를 만들었다. 그런데 이를 업데이트하고 싶은 상황이 있을 수 있다. 좋아하는 음악 장르가 바뀌는 건 많이 있는 일이다.

![editfield](./editfield.png)

그래서 위와 같은 선호 장르를 편집하는 필드에서 K-POP 을 삭제하고 J-POP을 새로운 선호 장르로 추가하고 싶다고 하자. 그러면 유저는 화면에서 K-POP을 삭제한 후 J-POP을 추가하여 저장할 것이다.

이 수정 내역의 저장이 일어날 때 서버에 가야 하는 요청은 2개이다.(유저가 편집 필드에서 수정하는 대로 서버에 반영되는 게 아니라, "수정 완료" 버튼을 누르면 한번에 수정이 완료되고 서버에 한꺼번에 반영된다)

1. 선호 장르에서 K-POP을 삭제한다.
2. 선호 장르에 J-POP을 추가한다.

# 3. 가장 단순한 해법 - 전부 따로 저장해 놓기

가장 단순한 해법을 생각했을 땐 삭제된 장르와 추가된 장르를 따로 저장해 놓은 후 서버에 저장되는 시점에 그 2개의 요청을 보내는 것을 생각할 수 있다.

그러면 선호 장르를 관리하는 컴포넌트에서 deletedGenres, addedGenres 를 state로 만들어 둔 후 하위 컴포넌트에 props로 전달하게 된다. 선호 장르를 관리하는 컴포넌트가 `GenreField` 컴포넌트라면 그 컴포넌트에서 각 장르 아이템을 렌더링하는 `GenreItem`과 같은 컴포넌트와 장르 추가를 담당하는 `GenreAddButton`과 같은 컴포넌트가 있을 것이다.

이 모든 컴포넌트들이 장르의 업데이트를 위해 deletedGenres, addedGenres를 props로 전달받아야 한다. 또한 서술한 하위 컴포넌트들은 선호 장르의 업데이트 또한 담당한다. 그러면 그 컴포넌트들은 deletedGenres, addedGenres를 업데이트하는 setDeletedGenres, setAddedGenres 함수까지 props로 받게 된다. 장르 업데이트 하나를 위해 props를 4개나 늘리고 또한 하위 컴포넌트로 drilling시키는 건 그렇게 좋은 전략이 아니라고 보인다.

# 4. 좀 더 생각한 해법 - 서버의 상태와 비교해 업데이트하기

결국 우리가 하고자 하는 것은 다음과 같다.

```
사용자의 선호 장르가 편집된 내용을 편집 완료 시점에 서버로 보내 저장한다.
```

그럼 편집된 내용은 무엇에 비해서 편집된 것인가? 당연히 기존에 서버에 저장되어 있던 사용자의 선호 장르다. 따라서 기존에 서버에 저장되어 있던 선호 장르와 사용자가 편집한 내용을 비교해서 서로 다른 부분에 대해서만 편집 완료 시점에 서버에 보내는 방식을 생각할 수 있다. 선호 장르를 서버에 추가하고, 삭제하는 API는 이미 있다. 또한 편집 필드의 경우 `사용자가 편집 중인 값`은 어차피 가지고 있어야 한다. 따라서 서버에 기존에 저장되어 있는 선호 장르를 저장하는 state만 가지고 있으면 된다.

그 둘을 가지고 있다고 할 때, 편집 완료 시점(즉 수정 완료 버튼을 눌렀을 때)에 서버에 보내야 하는 요청은 다음과 같다.

1. 서버에 저장되어 있던 내용 중 사용자가 편집한 내용에 없는 부분을 서버에서 삭제한다.
2. 현재까지 사용자가 편집한 내용 중 서버에 없는 내용이 있으면 서버에 그 부분을 추가한다.

이를 프로젝트에서 함수로 나타낸 결과는 다음과 같았다. 이때 `deleteUserGenre` 함수와 `addUserGenre` 함수는 axios로 서버와 통신한다.

```jsx
function updateUserGenres(curUserGenres, serverUserGenres) {
  for (const genre of serverUserGenres) {
    // 기존에는 있었지만 사용자가 삭제한 장르를 서버에서도 삭제한다
    if (curUserGenres.find((g) => g.id === genre.id) === undefined) {
      UserProfileAPI.deleteUserGenre(genre.id);
    }
  }

  for (const genre of curUserGenres) {
    // 기존에는 서버에 없었지만 사용자가 추가한 장르를 서버에 추가한다
    if (serverUserGenres.find((g) => g.id === genre.id) === undefined) {
      UserProfileAPI.addUserGenre(genre.id);
    }
  }
}
```

# 5. 다 지운 후 새로 넣기 - race condition 발생과 해결

하지만 위와 같이 코드를 짤 경우 하나를 추가/삭제할 때마다 기존 요소들 중 그것이 존재하는지에 대해 모두 검색해야 하는 단점이 있다. 시간복잡도가 O(n^2)가 되는 것이다. 음악 장르의 개수가 몇만 개 급으로 많지 않을 것이고 사용자의 프로필 편집이 아주 자주 일어나는 연산이 아니기 때문에 큰 속도 지연은 없겠지만 비효율적인 코드이다.

따라서 기존에 서버에 저장되어 있던 선호 장르를 다 지운 후 새로 넣는 방식을 사용하도록 해보았다. 이러면 시간복잡도가 O(n)이 된다. 해야 할 일은 다음과 같다.

1. 서버에 저장되어 있던 선호 장르를 다 지운다.
2. 사용자가 편집한 선호 장르의 내용 전체를 서버에 추가한다.

이때 서버에 저장된 선호 장르를 다 지우는 것을 먼저 해야 한다. 만약 사용자가 편집한 선호 장르의 내용을 추가하는 것을 먼저 한 후 서버에 저장되어 있던 선호 장르를 지우는 경우, 사용자가 편집하지 않았기에 그대로 남아 있어야 하는 선호 장르도 지워져 버리기 때문이다. 따라서 await을 사용해서 순서를 강제해 주었다.

```jsx
async function updateUserGenres(curUserGenres, serverUserGenres) {
  // 사용자의 선호 장르를 서버와 동기화
  const UserGenreDeletePromises = serverUserGenres.map((genre) => {
    return UserProfileAPI.deleteUserGenres(genre.id);
  });

  const UserGenreAddPromises = curUserGenres.map((genre) => {
    return UserProfileAPI.addUserGenres(genre.id);
  });

  await Promise.all(UserGenreDeletePromises);
  await Promise.all(CurUserGenreAddPromises);
}
```

이 코드를 짤 때는 서버에 저장되어 있는 선호 장르를 모두 지우는 동작에 대한 Promise들을 먼저 시행한 후 사용자의 편집 내역에 있는 선호 장르를 추가하는 동작에 대한 Promise를 실행하면 될 것이라 생각했다. 하지만 이렇게 할 경우 생각대로 동작하지 않았다. 자꾸 아무 편집도 하지 않은 내용이 지워지는 일이 발생했다.

이는 내가 await을 사용해서 순서를 강제했다고 생각한 부분이 생각대로 동작하지 않았기 때문이다. 내가 짠 코드의 `UserProfileAPI.deleteUserGenres`와 `UserProfileAPI.addUserGenres`는 다음과 같이 구성되어 있었다.

```jsx
addUserGenre: (genreID) => {
  return request.post(`/api/users/${userID}/genres/${genreID}`, genreID);
},
deleteUserGenre: (genreID) => {
  return request.delete(`/api/users/${userID}/genres/${genreID}`);
},
```

위에서 작성한 `updateUserGenres`함수의 코드에서 `UserGenreDeletePromises`와 `UserGenreAddPromises` 배열을 만들고 있는 시점에 `addUserGenre`와 `deleteUserGenre`함수의 리턴 Promise가 생성되면서 이미 axios의 요청이 서버로 전송되었던 것이다. 이때 이 axios 요청의 Promise들은 비동기로 처리된다. 따라서 서버에 저장된 선호 장르를 지우는 동작과 사용자의 편집 내역의 선호 장르를 서버에 추가하는 동작의 순서가 꼬이는 race condition이 발생할 수 있다.

이 상황은 다음과 같이 코드를 작성하여 axios 요청 순서를 강제하는 방식으로 해결했다.

```jsx
async function updateUserGenres(curUserGenres, serverUserGenres) {
  try {
    await Promise.all(
      serverUserGenres.map((genre) => {
        return UserProfileAPI.deleteUserGenre(genre.id);
      })
    );
    await Promise.all(
      curUserGenres.map((genre) => {
        return UserProfileAPI.addUserGenre(genre.id);
      })
    );
  } catch (err) {
    console.log(err);
  }
}
```

위와 같이 코드를 짜면

```jsx
serverUserGenres.map((genre) => {
  return UserProfileAPI.deleteUserGenre(genre.id);
});
```

이 api 요청들은 Promise.all로 인해서 하나의 Promise로 묶인다. 즉 deleteUserGenre 함수에서 일어나는 사용자의 기존 선호 장르 삭제 요청들이 하나로 묶여서 비동기적으로 실행되게 된다. 그리고 그 하나로 묶인 Promise가 resolve될 때까지 기다린 다음에 다른 코드를 실행하도록 하여 순서를 강제하는 역할을 await이 맡는다.

사용자의 선호 장르를 삭제하는 요청이 모두 해결되고 난 다음 사용자의 선호 장르를 추가하는 요청을 보내야 한다. 이 순서를 강제하는 부분은 await이 맡는다. 사용자의 선호 장르를 삭제하는 요청들(Promise.all로 묶여 있다)이 모두 resolve 되고 난 후에야 다음 코드로 실행한다.

그런데 선호 장르를 삭제하는 요청 각각, 그리고 사용자의 선호 장르를 추가하는 요청 각각은 순서대로 실행될 필요가 없다. 그럴 경우 실행 결과는 똑같은데 실행 시간만 길어지게 된다. 따라서 그 각각의 요청들은 Promise.all로 묶어서 각각의 요청들이 비동기로 실행되게 하였다.

# 6. 개선의 여지

하지만 이는 선호 장르를 추가, 삭제하는 api가 선호 장르 하나씩 추가, 삭제하는 것만 존재했기 때문에 했던 일이다. 사실 서버로는 사용자가 편집한 선호 장르 내역을 list로 한번에 보낸 후 서버에서 알아서 추가/삭제를 하도록 하는 게 좋다. 요청을 이렇게 여러 개 묶어서 보내게 되면 문제가 발생하기 너무 쉽고 서버 리퀘스트도 많아져서 좋지 않다.

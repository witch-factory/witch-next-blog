---
title: 프론트 지식 익히기 React - react query 사용기 1
date: "2022-08-05T00:00:00Z"
description: "React 지식 2번째, React-query"
tags: ["web", "study", "front", "react"]
---

# 1. 문제의 발생

지금 진행하고 있는 프로젝트에서 유저 프로필 정보를 관리히고 있다. 이는 서버에 저장되어 있는 데이터이고 필요한 순간에 불러와서 사용하게 된다. 따라서 이 유저 프로필 데이터를 사용하는 컴포넌트에서 서버의 프로필 데이터를 불러온 후 이를 컴포넌트의 State로 저장하여 사용하였다.

이는 2가지 문제를 발생시켰다. 첫번째는 서버 데이터와 클라이언트 데이터의 경계가 모호해진다는 점이다. 물론 서버에 저장되어 있는 데이터의 일부를 클라이언트에서 가지고 있어야 하는 경우가 있을 수 있다.

예를 들어서 유저 프로필을 편집하는 창이 있다면 프로필을 편집 중인 순간순간의 데이터를 서버와 계속 동기화시킬 필요는 없다. 편집 중인 프로필 데이터는 클라이언트에 저장하고 있다가 유저가 편집한 프로필 데이터를 저장하는 순간 서버에 보내 주는 것이 맞다고 생각한다.

하지만 유저 프로필을 사용하는 컴포넌트들은 대부분 유저 프로필 전체 혹은 일부를 그저 보여주는 용도로 쓰일 뿐이다. 이 컴포넌트들에서 굳이 서버에서 데이터를 받은 후 컴포넌트의 state로 저장하는 과정이 필요할까? 클라이언트 데이터와 서버 데이터를 분리하는 게 깔끔하게 보인다.

두번째 문제는 코드가 더러워졌다. 사실 react query를 도입한 배경도 이 코드 문제 때문에 다른 사람들과 이야기하다가 나온 것이다. 유저 프로필은 여러 페이지에서 쓰이기 때문에 zustand를 이용해 전역으로 관리하고 있었다. 그런데 이를 보여주기 위해 제작한 컴포넌트들은 다른 정보를 보여주는 데에도 쓰이기 때문에 어떤 정보를 보여줄지도 props로 넘겨받아야 했다.

하지만 그 컴포넌트들에서는 유저 프로필을 변경시킬 수 있는 기능도 담아야 했다. 따라서 유저 프로필 편집에 필요한 정보들을 모두 props로 받게 되었다. 또한 그 컴포넌트들은 각자 하위 컴포넌트들로 나누어져서 하위 컴포넌트들에서도 유저 프로필 보여주기와 유저 프로필 편집 기능들을 나눠 갖게 되었다. 따라서 이 모든 기능을 위한 정보와 함수 등이 props로 내려가면서 5~6개의 props가 drilling되는 일이 생겼다.

전역 상태를 사용하는 이유는 특정 정보가 필요없는 컴포넌트에서도 하위 컴포넌트에 정보를 전달하기 위해 props가 컴포넌트를 타고 내려가는 일을 방지하고 정보가 필요한 시점에 전역에서 불러서 간편하게 사용할 수 있게 하기 위함이라고 생각한다. 하지만 전역을 사용함에도 불구하고 props로 전달되는 데이터가 많이 생기는 것을 보는 건 그렇게 유쾌하지 않았다.

따라서 이런 문제를 해결하기 위해 열심히 고민하고 다른 사람들에게도 이 문제에 대해 물어보며 다녔다.

# 2. React query

이를 열심히 물어보며 다녔더니 누군가 react-query를 알려 주었다. 서버에 있는 데이터와 클라이언트에 있는 데이터를 분리할 수 있게 해주는 툴이었다. 그런데 내가 원하는 정보를 정리해 놓은 곳이 없었다. 그래서 공식 문서와 여러 블로그를 보고, 또 내가 여러 가지로 시도해 보면서 알아낸 내용을 여기 적는다.

# 3. 실습 환경 구성

먼저 실습을 진행할 환경을 vite로 구성하였다. 프로젝트에서는 react + typescript를 사용하므로 react-ts 템플릿을 사용하였다.

```
npm create vite@latest react-query-start -- --template react-ts
```

그리고 서버 상태를 대강 구성하기 위해서 json-server를 사용하였다.

```
npm i json-server
```

그리고 react-query-start 폴더에 `db.json` 파일을 생성한다. 그 내용은 다음과 같이 구성해 보았다.

```json
{
  "userprofile": [
    {
      "id": 1,
      "name": "John",
      "nickname": "John123",
      "email": "asdf@asdf.com"
    },
    {
      "id": 2,
      "name": "Jane",
      "nickname": "Jane321",
      "email": "bcfd@bcfd.com"
    },
    {
      "id": 3,
      "name": "Jack",
      "nickname": "Jack456",
      "email": "jack877@asdf.com"
    }
  ]
}
```

`package.json` 파일의 script항목에 아래와 같은 키-밸류 쌍을 추가하자. `"server-json": "json-server --watch db.json --port 4000"`

이제 터미널에서 `npm run server-json`를 실행하면 서버가 시작된다. `http://localhost:4000/userprofile`에 접속하면 위에서 정의한 데이터를 볼 수 있다.

그리고 데이터를 주고받을 때 사용할 axios와 이 글의 주제인 react-query를 설치한다.

```
npm i axios
npm i @tanstack/react-query
```

# 4. 컴포넌트 구성

이제 App 컴포넌트를 구성하자. Context API를 사용하는 방식과 비슷하다. query를 사용할 컴포넌트를 QueryClientProvider로 감싸준다.

```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      ...우리가 사용할 컴포넌트가 여기에 있어야 합니다.
    </QueryClientProvider>
  );
}

export default App;
```

그리고 서버 데이터를 사용할 컴포넌트를 구성하자. src/components 폴더를 만들고 UserProfile.tsx 파일을 생성한다. 먼저 컴포넌트에서 데이터를 받아오는 것을 위해서 useQuery를 사용만 해보자.

```tsx
// src/components/UserProfile.tsx
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function UserProfile() {
  const { data } = useQuery(["user-profile"], () => {
    return axios.get("http://localhost:4000/userprofile");
  });

  useEffect(() => {
    //    데이터를 확인하는 부분은 좀더 세련되게 짤 수도 있다. 이따가 다룬다.
    if (data) {
      console.log(data.data);
    }
  }, [data]);

  return <h1>User Profile</h1>;
}

export default UserProfile;
```

이제 App 컴포넌트의 QueryClientProvider 사이에 UserProfile 컴포넌트를 추가하고 페이지를 렌더링할 때 개발자 도구를 열어서 콘솔을 확인해 보자. 서버에서 데이터를 받아오면서 data가 변경될 때 useEffect에 의해 db의 데이터가 찍히는 것을 확인할 수 있다.

그럼 이제 useQuery를 좀더 자세히 알아보자.

# 5. Query

쿼리는 비동기 데이터 소스(보통 서버)에 대한 의존성이며 unique key로 식별될 수 있다. 이는 Axios나 fetch 등 Promise 기반의 메서드를 사용하여 서버에서 데이터를 가져오는 데 사용할 수 있다. 만약 서버 데이터를 수정하는 메서드를 만들고 싶다면 Mutation을 사용하자. (useMutation이라는 훅을 사용하며 다음 글에서 다룰 예정이다) 즉 서버 데이터 중 일부를 unique key와 엮어서 가져와 준다는 것이다. 딱 내가 필요한 부분 중 하나이다.

컴포넌트나 커스텀 훅에서 이런 쿼리를 사용하려면 위에서 이미 한번 사용해 봤던 `useQuery`훅을 사용해야 한다. 이는 인자로 쿼리에 사용할 unique key와 데이터 fetch에 사용할 함수를 기본으로 줘야 한다. 그 외에도 옵션을 줄 수 있는데 이는 당장 사용과는 큰 관련이 없으니 필요할 때 쓰도록 하겠다.

공식 문서의 `useQuery`사용 예시는 다음과 같다.

```
const result = useQuery(['todos'], fetchTodoList)
```

첫번째로 들어간 인자가 쿼리에 사용할 키이다. 다른 곳에서도 이 키로 같은 정보를 관리한다. 또한 두번째로 들어갈 인자가 함수 이름답게 데이터를 fetch해 오는 함수이다. 이 함수는 오류에 대한 throw 기능도 갖춰야 한다고 하지만 그냥 axios를 쓰면 된다.

mutation까지 들어가 있는 코드

```tsx
// src/components/UserProfile.tsx
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AxiosResponse } from "axios";

const addProfile = (newProfile: {
  name: string;
  nickname: string;
  email: string;
}): Promise<AxiosResponse> => {
  console.log("프로필 추가 함수 실행");
  return axios.post("http://localhost:4000/userprofile", newProfile);
};

const useAddProfile = () => {
  const qc = useQueryClient();
  return useMutation(addProfile, {
    onSuccess: () => {
      qc.invalidateQueries(["user-profile"]);
    },
  });
};

function UserProfile() {
  const [curID, setCurID] = useState(4);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  const { isLoading, isError, data, error } = useQuery(["user-profile"], () => {
    return axios.get("http://localhost:4000/userprofile");
  });

  const { mutate } = useAddProfile();

  const profileMutation = () => {
    console.log("버튼으로 프로필 추가");
    const newProfile = { name: name, nickname: nickname, email: email };
    mutate(newProfile);
  };

  if (isLoading) {
    return <span>profile Loading...</span>;
  }
  if (isError) {
    return <span>error occurred</span>;
  }
  return (
    <>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button onClick={profileMutation}>새로운 프로필 추가</button>
      <ul>
        {data.data.map(
          (profile: {
            id: number;
            name: string;
            nickname: string;
            email: string;
          }) => {
            return <div key={profile.id}>{profile.name}</div>;
          }
        )}
      </ul>
    </>
  );
}

export default UserProfile;
```

# 참고

react query 튜토리얼 글 https://velog.io/@cjy0029/React-Query-%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC

react query v4 공식 문서 https://tanstack.com/query/v4/docs/overview

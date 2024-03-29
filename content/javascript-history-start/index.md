---
title: JS의 소리를 찾아서 - 시작하면서
date: "2024-01-19T00:00:00Z"
description: "Javascript의 숨겨진 이야기를 찾아서"
tags: ["javascript", "history"]
---

# JS의 소리를 찾아서 시리즈

|시리즈|
|---|
|[JS의 소리를 찾아서 - 시작하면서](https://witch.work/posts/javascript-history-start)|
|[JS의 소리를 찾아서 - Javascript의 탄생](https://witch.work/posts/javascript-history-the-birth)|
|[JS의 소리를 찾아서 - Javascript의 초기 실수와 선택들](https://witch.work/posts/javascript-history-initial-decisions)|

# 서론

> 최고의 시절이자 최악의 시절, 지혜의 시대이자 어리석음의 시대였다. 믿음의 세기이자 의심의 세기였으며, 빛의 계절이자 어둠의 계절이었다. 희망의 봄이면서 곧 절망의 겨울이었다.
> 우리 앞에는 모든 것이 있었지만 한편으로 아무것도 없었다. 우리는 모두 천국으로 향해 가고자 했지만 우리는 엉뚱한 방향으로 걸었다.
> 말하자면, 지금과 너무 흡사하게, 그 시절 목청 큰 권위자들 역시 좋든 나쁘든 간에 오직 극단적인 비교로만 그 시대를 규정하려고 했다.
>
> 찰스 디킨스 저, 이은정 옮김, '두 도시 이야기', 펭귄클래식코리아, 13쪽

누가 뭐래도 Javascript는 웹을 지배하고 있다. Javascript를 싫어하는 사람이라도 Javascript와 거기서 파생된 수많은 것들이 웹에 끼치고 있는 영향력을 무시할 수는 없다. 나 또한 프론트 개발자로서 Javascript와 친해져야만 했고 그게 정답이라 생각했다. 아마 많은 사람들이 그렇게 말할 것이다.

하지만 그런 것 치고 Javascript에는 이상한 부분들이 많다. 자동 형변환 규칙이라든지 `==`연산자 등 자잘한 이상한 동작부터 프로토타입 상속이나 클로저 같은 언어 설계에 해당하는 부분들까지, Javascript에는 온통 낯설고 이상한 것 투성이다. [이상한 나라의 JS](https://zerolog.vercel.app/posts/weird-js)처럼 그런 낯선 부분들을 다룬 글도 산더미처럼 있다.

물론 Python이나 Java 같은 다른 주류 언어들도 각자 수많은 비판을 받고 있다. 하지만 Javascript만큼 빠와 까를 모두 미치게 하는 언어도 없다.

그럼, 대체 Javascript는 어쩌다 이런 모습으로 오늘날에 이르렀을까? 그리고 그 이상한 부분들은 어떻게 쓰일 수 있고 어떻게 처리되고 있을까?

나는 Javascript에 기여한 사람도 아니고 모든 것을 완벽히 파헤칠 수 있을 만큼의 실력자도 아니다. 지금 시점에선 이미 많은 시간이 흘러서 알 수 없게 된 것들도 있다.

하지만 여러 책, 문서, 인터뷰 등이 아직 많이 남아 있다. 그것들을 통해 Javascript 언어의 역사 그리고 그때 그 사람들이 무슨 생각을 했고 왜 이런 선택을 했는지 되짚어보는 시도를 해볼 수 있다.

이런 것들을 궁금해하는 사람들은 많은 데에 비해 자료는 별로 없다고 느꼈다. 그래서 되는 대로 끌어모아 글을 하나하나 써본다. 다음에는 누군가 나보다 더 뛰어난 사람이 더 좋은 글을 쓰는 데에 조금이라도 기반이 되었으면 좋겠다.

내가 더 많은 자료를 접하고 성장하면서 이 시리즈는 점차 늘어나고 개정되어갈 것이다. 완성에는 오랜 시간이 걸릴 걸로 예상한다. 2024년 1월 현재 다음과 같은 시리즈들이 있다.

|시리즈|
|---|
|[JS의 소리를 찾아서 - 시작하면서](https://witch.work/posts/javascript-history-start)|
|[JS의 소리를 찾아서 - Javascript의 탄생](https://witch.work/posts/javascript-history-the-birth)|
|[JS의 소리를 찾아서 - Javascript의 초기 실수와 선택들](https://witch.work/posts/javascript-history-initial-decisions)|
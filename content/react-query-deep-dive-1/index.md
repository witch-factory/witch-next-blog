---
title: react query 파고들기 - query core
date: "2024-08-05T00:00:00Z"
description: "react query의 내부, query core에 대해 알아보자"
tags: ["web", "study", "front", "react"]
---

react query를 분석해 보기로 했다. 먼저 query-core의 코드를 살펴보자. [tanstack/query](https://github.com/tanstack/query)의 `packages/query-core` 폴더에 query-core의 코드가 있다. 이는 react-query의 핵심 기능들에 대한 코드가 있고 react-query에서는 이를 훅으로 만든 것이다. 먼저 1편에서는 핵심인 query-core부터 살펴볼 것이다.





# 참고

https://github.com/tanstack/query
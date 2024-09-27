---
title: pnpm workspace로 프로젝트 관리하기
date: "2024-09-25T00:00:00Z"
description: "pnpm workspace로 모노레포 만들고 관리하기"
tags: ["web", "study"]
---

# 설계

기존 프로젝트들이 클라이언트, 서버 그리고 홈페이지 레포지토리로 나누어져 있었다. 이를 pnpm을 이용해 모노레포로 통합하기로 했다. prisma 등 공유하고 있는 라이브러리가 많고 타입도 통합하면 좋을 것 같아서 결정하였다.

모노레포에 포함된 프로젝트의 수가 많지 않으므로 pnpm workspace를 사용하기로 했다. 그러나 폴더 구조에 있어서는 nx 문서에 나온 폴더 구조를 따르기로 했다. apps, libs 폴더에 넣는 것이다.

```
apps
  client
  server
  homepage
libs
  shared
  ...
```

# 참고

Nx docs Folder Structure

https://nx.dev/concepts/decisions/folder-structure

프론트엔드 모노레포 구축 삽질기 (1) - 도입 이유, yarn workspaces, berry

https://9yujin.tistory.com/100

모노리포에서 Prisma 사용하기

https://0916dhkim.medium.com/%EB%AA%A8%EB%85%B8%EB%A6%AC%ED%8F%AC%EC%97%90%EC%84%9C-prisma-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-fb811c189997
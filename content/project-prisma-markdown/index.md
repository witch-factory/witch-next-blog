---
title: Prisma Schema에서 문서를 생성해주는 Prisma Markdown을 써보자
date: "2024-07-16T00:00:00Z"
description: "Prisma Schema에서 마크다운 문서를 생성해 주는 도구가 있다?"
tags: ["typescript", "javascript", "web"]
---

# 이 글은 작성 중입니다.


# 1. prisma-markdown 도입 배경

[라이브러리 제작자이신 samchon님이 직접 작성하신 글 "I made ERD and documents genertor of Prisma ORM"](https://dev.to/samchon/i-made-erd-and-documents-genertor-of-prisma-orm-4mgl?utm_source=oneoneone)

[ICPC Sinchon](https://icpc-sinchon.io/)에서 진행하는 알고리즘 캠프의 출석 관리 시스템을 만들고 있다. 백엔드는 Prisma ORM과 NodeJS 서버로 구축했다. DB 구조는 먼저 ERDCloud로 설계하고 Prisma Schema로 구현하였다. 많은 부분을 혼자 하고 있었기에 각각의 싱크가 조금 안 맞는 일이 생겨도 내가 거의 모든 맥락을 알고 있기에 큰 문제가 되지 않았다.

그런데 DB 설계가 많이 바뀌고 또 팀원들이 내가 하는 일과 완전히 분리되지 않은 코드를 건드리게 되면서 문제가 조금씩 생겼다. ERDCloud에서 변경된 부분이 아직 Prisma Schema에 반영되지 않은 경우도 많았고 문제가 있어서 급하게 Prisma Schema를 수정했는데 ERDCloud에 반영하는 걸 깜빡했다든가 하는 일도 생겼다.

또한 설계가 바뀌었다 해도 이 의도나 변경 사항을 모두에게 전달하기가 쉽지 않았다. 문서를 만들 수도 있었지만 Prisma Schema와 ERDCloud로 이미 정보가 나뉘어 있고 지금도 동기화가 힘든 상태에서 문서가 하나 더 생긴다고 해서 뭔가 좋아질 거 같지 않았다.

그런데 [samchon](https://github.com/samchon)님이 만드신 라이브러리 중에 Prisma의 자동 마크다운 문서 생성기 [prisma-markdown](https://github.com/samchon/prisma-markdown)이 있다는 걸 오픈채팅방에서 다른 분들의 대화를 듣던 중 마침 알게 되었다. 깃헙 스타 수 등을 보았을 때 아주 많이 알려져 있는 라이브러리 같지는 않았다. 하지만 제작자가 워낙 유명한 분이시고 지금 하고 있는 게 문서에서 뭔가 약간 잘못된다 한들 크게 문제가 될 만한 프로젝트도 아니기에 써보기로 했다.

그런데 배우기도 아주 쉽고 또 적용도 빠르게 할 수 있어서 기록도 할 겸 이 글을 쓰게 되었다.

이 글은 prisma와 prisma/client 등은 깔려 있고 스키마도 세팅되어 있다고 가정한다. [나는 이전 글에서 서버를 구성하면서 prisma를 설치하고 스키마를 작성하는 작업까지 해놓았다.](https://witch.work/posts/project-backend-gcp-deploy#3-nodejs-%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%84%B1)

다만 저 글에는 달랑 학생 스키마 하나뿐이지만 실제 스키마는 좀더 복잡했다. 이후 글에서는 실제 스키마를 사용할 것이지만, 중요한 것은 prisma-markdown이므로 스키마 구조를 하나하나 설명하지는 않을 예정이다.

# 2. 설치와 세팅

[prisma-markdown 공식 README의 설명](https://github.com/samchon/prisma-markdown)이 워낙 친절해서 어려울 게 없었다. 먼저 prisma-markdown을 설치한다.

```bash
npm i -D prisma-markdown
```

그리고 schema.prisma 파일에 다음과 같이 제너레이터를 추가한다. 이 제너레이터는 `prisma generate` 명령을 실행했을 때 생성되는 애셋을 결정해 주는데, 이 경우에는 markdown 파일을 생성해 주는 제너레이터이다.

```prisma
generator markdown {
  provider = "prisma-markdown"
  output   = "./ERD.md"
  title    = "Sinchon ICPC Camp ERD"
}
```

이렇게 하고 나서 `npx prisma generate` 명령을 실행하면 `prisma/ERD.md` 파일이 생성된다. 이 파일을 열어보면 다음과 같이 테이블 구조를 적당히 만들어서 보여주는 mermaid 코드와 그 밑에 각 테이블의 속성을 나열한 것을 볼 수 있다.

그런데 이를 vscode로 열어보면 mermaid 다이어그램이 제대로 보이지 않는다. 이를 보기 위해서는 [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) 익스텐션을 깔아야 한다. 아마 다른 에디터에서도 플러그인이 존재할 것이다.

이렇게 플러그인을 깔고 `prisma/ERD.md`를 미리보기로 열면 mermaid 다이어그램을 볼 수 있다.

![mermaid로 만든 다이어그램](./erd-mermaid-diagram.png)

나는 프론트 개발자이긴 하지만 작은 프로젝트를 하다 보면 백엔드나 DB 테이블 구조를 조금은 보게 될 때가 많다. 하지만 문서와 실제 테이블 구조의 싱크를 잘 맞추기가 생각보다 어렵다. 그럴 때 Prisma schema를 쓰고 또 `prisma generate` 명령 시에 자동으로 문서를 생성해 주는 prisma-markdown을 쓰면 좋을 것 같다.

# 참고

prisma Generators 문서

https://www.prisma.io/docs/orm/prisma-schema/overview/generators

221006_Mermaid를 이용한 Markdown 작성

https://velog.io/@brown_eyed87/221006Mermaid%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-Markdown-%EC%9E%91%EC%84%B1

Prisma ORM의 ERD 및 문서 생성기를 만들었습니다.

https://oneoneone.kr/content/940dc121
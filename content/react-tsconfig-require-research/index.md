---
title: React 프로젝트에서 필요한 tsconfig 설정에 대하여
date: "2024-09-04T01:00:00Z"
description: "React 프로젝트에서 필요한 tsconfig 설정에 대하여 알아보자"
tags: ["react", "typescript"]
---

React 공식 문서 중 "TypeScript 사용하기"라는 섹션이 있다. 여기에 ["기존 React 프로젝트에 TypeScript 추가하기"](https://react.dev/learn/typescript#adding-typescript-to-an-existing-react-project)를 보면 TS 설정 파일인 `tsconfig.json`에 다음과 같은 컴파일러 옵션을 설정하라고 한다.

> 1. dom은 lib에 포함되어야 합니다(주의: lib 옵션이 지정되지 않으면, 기본적으로 dom이 포함됩니다).
> 2. jsx를 유효한 옵션 중 하나로 설정해야 합니다. 대부분의 애플리케이션에서는 preserve로 충분합니다. 라이브러리를 게시하는 경우 어떤 값을 선택해야 하는지 jsx 설명서를 참조하세요.

그런데 이게 대체 무슨 뜻일까? 일반적으로 ts가 설치된 프로젝트의 `node_modules/typescript` 폴더의 `lib`을 가보면 `lib.es5.d.ts`라거나 `lib.dom.d.ts`처럼 이런저런 타입이 정의된 선언 파일들이 있고 이 파일들을 뜯어 보면 

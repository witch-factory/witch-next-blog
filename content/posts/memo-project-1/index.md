---
title: 메모장 만들기 프로젝트 - 1. 설계
date: "2021-08-27T00:00:00Z"
description: "웹 메모장 프로젝트, 그 삽질의 기록1"
tags: ["web"]
---

# 1. 사이드 프로젝트의 시작

약 1년 정도 진행해 온 스터디가 있다. 처음에는 `전문가를 위한 파이썬` 을 읽고 정리하는 스터디였다. 그 다음에는 Django 백엔드와 React 프론트를 공부하려는 스터디로 넘어갔다.  `전문가를 위한 파이썬 책까지 공부했으니 이제 파이썬으로 무언가를 만들어 보자!` 라는 마음에서였다. 그러나 Django가 너무 복잡하다는 이야기가 많아서(내 의견도 그랬다. 백엔드가 처음이어서였는지 너무 어려웠다) Express 백엔드로 갈아탔다. 어느새 파이썬과는 전혀 상관없는 스터디가 되어 버렸다.

그래서 React + Express 조합으로 간단한 클론코딩을 진행해 왔고 이제 그것도 막바지에 다다랐다. 나는 Express를 이용한 백엔드를 맡았고 말이다. 생각보다 지지부진하긴 했지만 나름 배우는 것도 많았다. 꽤 괜찮은 과정이었다고 생각한다. 모든 게 다 완벽하게 착착 맞아돌아갈 수는 없고 심지어 나 자신조차도 그러지 못하니까.

어쨌거나 그것도 이제 막바지고 하니 이제 지금까지 잡다하게 공부한 것들을 활용해서 간단한 프로젝트를 만들고 그 과정을 정리해서 블로그에 올리고자 한다.

무엇을 만들까 하다가 웹 메모장을 만들어 보기로 했다. 회원 시스템이 있고 로그인을 하면 내 메모를 관리할 수 있는 그런 간단한 웹 메모장 말이다.

# 2. 설계

프론트는 React, 백엔드는 Express, DB는 MySQL을 사용할 것이다. 또 styled-components를 이용해서 스타일링, React Router로 페이지 관리, passport로 로그인/회원가입 시스템을 만들기로 했다. 큰 틀은 이렇게 잡고 중간중간 필요한 라이브러리가 있으면 추가할 것이다. 가령 회원 정보 암호화를 이용한 crypto 라이브러리라든지.

먼저 가장 핵심적인 메모장 기능을 하는 부분은 이전에 React를 공부하면서 메모장을 간단하게나마 만들어 놓은 적이 있어서, 그것을 조금 고쳐서 사용하고자 한다. https://witch-factory.netlify.app/ 에 올려 놓은 것이다. 물론 디자인만 끌어올 것이고 코드는 처음부터 다시 짤 것이다. 저기에 폴더 기능과 회원별 메모 DB등을 넣을 것이다.

그리고 로그인과 회원가입 페이지는 메모장과 비슷한 색감의 페이지에 간단한 input 창들 정도만 만들고 나서 디자인을 조금씩 손보려고 한다. 디자인을 먼저 완벽히 해놓기에는 내가 디자인 능력이 없기도 하고 경험이 전혀 없기 때문이다.

지금 필요하다고 생각하는 페이지는 메모장, 로그인 페이지, 회원가입 페이지뿐이지만 후에 필요하다고 생각되는 페이지가 더 생기면 그때 추가할 것이다. 일단 부딪쳐 보겠다.

그리고 메모장 디자인에 상당히 많이 참고하는 상용 메모장 사이트가 있다. [솜노트](https://somcloud.com/apps/note) 이고 한때 나도 굉장히 애용했었다. 저 디자인이 아주 좋다고 생각하는 건 아니다. 이미 거슬리는 부분들이 있기 때문에 분명 색이나 구성 같은 부분에서 차이를 둘 것이다. 노트를 폴더로 묶어서 관리할 수 있고 수정 버튼을 누르는 것을 통해 삭제가 가능한 등...말로 표현하기는 힘들지만 구성 등에서 유사한 면이 많을 수 있다.

만약 추후 설계가 더 탄탄해지면 이 글에 내용을 추가할 수도 있다.

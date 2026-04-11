---
title: 프론트 지식 익히기 tailwind - 3
date: "2022-07-29T00:00:00Z"
description: "프로젝트 tailwind 사용기 - 태그 정리 2"
tags: ["web", "study", "front"]
---

# 1. 두번째 태그 정리
이전 글에 이어서 tailwind의 태그들을 간단히 정리해 올려 놓는다. 어떤 태그가 있는지 쭉 훑어보면서 알아 두고 나중에 더 제대로 쓸 때는 공식 문서를 찾아보면서 프로젝트를 진행할 예정이다.

# 2. Backgrounds
 
배경과 관련한 속성들이다.

- Background Attachment
배경 이미지가 뷰포트의 스크롤과 함께 움직일지를 결정하는 속성이다. 
bg-fixed : 배경을 뷰포트에 대해 고정한다. 요소에 스크롤이 존재해도 배경은 함께 스크롤되지 않는다. 
bg-local : 배경을 요소 콘텐츠에 대해 고정한다. 요소에 스크롤이 존재하면 배경은 콘텐츠와 함께 스크롤된다.
bg-scroll : 배경을 요소 자체에 대해 고정한다. 요소에 스크롤이 존재해도 배경은 함께 스크롤되지 않는다. 즉 요소의 테두리에 배경 이미지를 부착한 것과 같은 효과를 낸다.

- Background Clip
요소의 배경이 테두리, 안쪽 여백, 콘텐츠 박스 중 어디까지 차지할지를 결정한다.
bg-clip-{border, padding, content, text}

- Background Color
말 그대로 배경색을 지정한다. bg-{color이름} 클래스명을 사용하며 컬러 팔레트는 위에서 나온 공식 문서의 팔레트와 같다.

- Background Origin
배경의 원점을 테두리 시작점, 테두리 내부, 안쪽 여백 내부 중 어느 것으로 지정할지를 결정한다.
bg-origin-{border, padding, content}

- Background Position
배경 이미지의 위치를 결정한다. 8방향과 중앙까지 9방향을 지원한다.
bg-{bottom, top, ..., center}

- Background Repeat
배경 이미지의 반복을 결정한다. 반복 여부와 어떤 축으로 반복할지, 잘리지 않도록 배경 이미지 크기를 조절하거나(round) 끝에서 끝까지 고르게 분배(space)할 수도 있다. 
bg-{repeat, no-repeat, repeat-x, repeat-y, repeat-round, repeat-space}

- Background Size
요소 배경 이미지의 크기를 결정한다. 그대로 두거나, 늘리고 줄이거나, 공간에 맞출 수 있다. bg-{auto, cover, contain}

- Background Gradient
배경색에 그라데이션 같은 것을 줄 수 있다. 
bg-gradient-to-r from-cyan-500 to-blue-500 은 cyan-500에서 오른쪽으로 갈수록 blue-500이 되는 그라데이션이다. 또한 bg-gradient-to-{t, tr, r, br, b, bl, l, tl} 을 이용해서 그라데이션 방향도 조절 가능하다. 로고 색 등을 입힐 때 요긴하게 사용될 것 같아 정리해 둔다.


# 3. Borders

당연히 테두리에 관련된 속성들이다.

- Border Radius
모서리를 둥글게 깎아 주는 옵션이다. 매우 자주 쓰이기 때문에 모서리 4개 각각에 대해 깎는 옵션도 따로 있고 크기도 다양하다.

- Border Width
테두리의 굵기를 정하는 옵션이다. border-숫자 형식의 클래스로 지정한다. 

- Border Color
테두리의 색깔을 지정한다. border-색깔명 클래스로 지정하며 색깔 이름은 tailwind 공식 문서의 컬러 팔레트에 있는 것과 같다. 

- Border Style
테두리 스타일은 solid한 실선이 될 수도 있지만 점선이나 이중 실선이 될 수도 있다. 이를 결정하는 옵션이다.
border-{solid, dashed, dotted, double, hidden, none}

- Divide Width
요소들 간의 경계 테두리를 정하는 속성이다. divide-x-숫자, divide-y-숫자 형식으로 사용한다.

- Divide Color
요소들 간의 경계의 색상을 결정한다. divide-색이름 과 같이 사용하며 색 이름은 참고 부분의 컬러 팔레트를 따른다.

- Divide Style
역시 요소 경계가 점선인지 이중 실선인지 등을 결정한다.

- Outline
Outline도 width, color, style(점선, 실선...) 스타일링이 가능하다.

- Ring
비슷하게 Ring 이라는 것도 스타일링이 가능한 것 같다. 당장 쓸 일이 없을 듯해 넘어갔다.


# 4. Effects

- Box Shadow
요소의 그림자를 설정하는 옵션이다. 
shadow-{sm, md, lg, xl, 2xl, inner, none}과 같은 클래스로 사용할 수 있다. shadow 클래스로 기본 그림자를 줄 수도 있다.

- Box Shadow Color
역시 요소의 그림자를 설정한다. shadow-색이름 과 같은 클래스로 사용하며 tailwind 기본 팔레트를 사용할 수 있다.

- Opacity
요소의 불투명도를 설정한다. opacity-0 부터 opacity-100 까지 10 단위로 설정 가능하다. 이때 100이 완전히 불투명한 것이다.

- Mix Blend Mode
요소의 콘텐츠가 자신의 배경 및 부모와 어떻게 혼합되어야 하는지 결정한다. 
mix-blend-{normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn} 비슷한 것으로 Background Blend Mode 가 있다.

---
이외에도 많은 속성이 있지만 당장 필요한 건 이 정도인 것 같아 추후에 더 많은 속성을 정리하도록 하겠다.

# 참고
background attachment from MDN https://developer.mozilla.org/ko/docs/Web/CSS/background-attachment 외 많은 CSS 속성 MDN 문서
https://developer.mozilla.org/ko/docs/Web/CSS/blend-mode 등등...

tailwind 컬러 팔레트 https://tailwindcss.com/docs/customizing-colors#default-color-palette
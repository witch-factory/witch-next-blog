---
title: 프론트 지식 익히기 tailwind - 1
date: "2022-07-27T00:00:00Z"
description: "프로젝트에서 tailwind를 사용하는 기록"
tags: ["web", "study", "front"]
---

# 0. 프론트 공부 정리
프로젝트에서 프론트를 맡아 구현하면서 여러 가지를 공부하고 있다. 그러면서 알게 되는 지식들을 이곳에 일단 난잡하게나마 쌓아 두는 식으로 정리한다. 아마 tailwind와 HTML 태그들, 그리고 React 관련 토막 지식들이 들어가지 않을까 한다.

# 1. tailwind 사용 시작

원래 하던 프로젝트에서는 styled-component로 프론트 페이지 제작을 진행하였다. 그러나 컴포넌트 이름을 짓기가 점점 힘들어지고 커스터마이징을 어느 정도로 해야 할지 늘 고민해야 했다. 그래서 사용을 추천받은 것이 tailwind와 DaisyUI였다. 하지만 tailwind는 초반 러닝커브가 꽤 있는 라이브러리였다. 특히 tailwind에서 자체적으로 정리한 클래스명을 사용해야 했다. tailwind의 기초와 이런 클래스명들을 익히며 여기 간단히 기록을 남긴다. tailwind 공식 문서를 참고하여 공부하였다. 이 글은 tailwind 공식 문서의 Core Concepts에 있는 페이지들을 간단히 정리하였다.

# 2. tailwind를 쓰는 이유 - Utility-First Fundamentals

일단 가장 간편하게는 미리 정의된 클래스명인 `w-12`(특정 너비를 의미한다) 등을 사용할 수 있다. 물론 컴포넌트 하나에 클래스명이 10개도 넘게 붙어 있는 것이 보기에는 난잡한 코드로 보일 수 있다. 하지만 더 이상 클래스명을 짓기 위한 고민을 안 해도 되고 한번 tailwind 클래스명을 익혀 놓으면 생산성도 크게 좋아진다.

inline style과도 비슷해 보이지만 매직 넘버를 안 써도 되고 반응형 디자인을 쉽게 구현할 수 있으며 hover, focus 등의 상태 디자인도 할 수 있다는 점에서 더 범용적이고 편리하다. 가령 컴포넌트에 마우스를 올렸을 때 특정 색이 뜨게 하고 싶다면 `hover:bg-my-color` 와 같은 className을 주면 된다.

# 3. tailwind에서 제공하는 상태들 - Hover, Focus, and Other States

`hover`, `focus`, `active`, `visited` 등의 유사 클래스를 제공한다. 

그리고 컴포넌트 자신이 부모 컴포넌트의 첫번째 자식, 혹은 마지막 자식일 때 발현되는 modifier인 `first`, `last`가 있고 짝수, 홀수 번째 자식일 때 발현되는 `even` `odd`도 있다. 

폼의 상태를 나타내는 `disabled` `invalid` `required` `read-only`등의 유사 클래스도 있다.

이외에도 엄청나게 많은 modifier를 제공한다. 몇 가지를 아래 정리한다.

부모 컴포넌트의 상태에 따라서 자식 컴포넌트의 CSS를 바꿔야 할 수도 있다. 예를 들어 부모 컴포넌트에 hover하면 그 자식 컴포넌트의 텍스트 색이 흰색으로 바뀌는 것을 들 수 있다. 이런 건 부모 컴포넌트에 `group`이라는 클래스명을 준 후 부모 컴포넌트 상태에 따라 바꾸고 싶은 자식 컴포넌트에 `group-hover:stroke-white`와 같이 `group-*`으로 시작하는 상태명을 주면 된다.

sibling의 상태에 따라 스타일링하는 것도 sibling에게 `peer`클래스를 부여한 후 `peer-*:*` 와 같은 클래스를 쓰는 것으로 가능하다. 단 sibling의 상태에 따라 디자인을 바꾸고 싶은 컴포넌트가 더 뒤쪽에 와야 가능하다. (`peer` 컴포넌트를 더 위쪽에 정의해야 한다.)

input이나 textarea의 placeholder도 `placeholder:*` 와 같은 modifier로 스타일링할 수 있다.

또한 input(file type)컴포넌트의 파일 업로드 버튼도 `file:*` modifier로 스타일링한다.

`<li>` 컴포넌트의 list marker도 `marker`를 이용해서 스타일링 가능하다. li 컴포넌트에 `marker:text-sky-400`과 같은 클래스명을 주면 된다. 이는 상속되기 때문에 li 컴포넌트 각각에 써도 되지만 상위 컴포넌트인 ul 컴포넌트 등에 적용해도 잘 상속되어 적용된다.

highlighted text는 `selection:*`을 이용해 스타일링한다. 문단(p 태그)의 첫 줄과 첫 단어도 `first-line` `first-letter` modifier로 스타일링 가능하다.

`<dialog>` 태그를 사용한다면 다이얼로그 뒤에 뜨는 창 색상인 듯한 backdrop도 `backdrop:bg-gray-50`과 같은 클래스명으로 스타일링할 수 있다. dialog나 details 태그를 사용한다면 그 태그가 열렸을 때에 대한 스타일링을 하는 `open` modifier도 사용할 만 하다.

반응형 디자인을 할 때는 `sm:*`, `md:*` 와 같은 클래스명을 사용하게 된다. 화면의 크기에 따라 sm~2xl까지 존재한다.

만약 유저가 웹에서 최소한의 움직임만 허용하는 prefers-reduced-motion 미디어 쿼리를 요청했을 경우를 대비하여 `motion-reduce:*` modifier를 사용할 수 있다.

사용자가 커스텀한 셀렉터를 modifier로 사용할 수도 있다. 이는 대괄호로 표시돤다. 예를 들어 다음과 같이 셀렉터를 이용한 modifier는 컴포넌트가 부모의 3번째 자식일 때에만 발현된다. `[&:nth-child(3)]:underline`

사용자 정의 셀렉터에 띄어쓰기가 필요하면 언더스코어를 사용하자. 자손 컴포넌트의 모든 p 태그를 선택하는 셀렉터의 modifier class는 다음과 같다. `[&_p]:*`

이런 사용자 정의 셀렉터 중 반복되는 게 있으면 `addVariant`API를 이용해서 새로 정의할 수도 있다. (https://tailwindcss.com/docs/hover-focus-and-other-states 의 `Creating a plugin`항목 참고)

모든 유사 클래스 정보는 레퍼런스를 참고하자. (https://tailwindcss.com/docs/hover-focus-and-other-states?email=geor%40ustrial&password=Bosco#disabled)


# 4. 반응형 디자인 하기 - Responsive Design

tailwind에서는 모든 클래스를 화면 크기에 따라 적용할 수 있도록 해놓았다. sm, md, lg, xl, 2xl의 prefix는 화면의 크기가 얼만큼의 경계를 넘어서냐에 따라서 적용되거나 적용되지 않는다. 예를 들어 `w-16 md:w-32 lg:w-48`이라는 class가 있다면 이는 너비가 768px가 넘는 화면에선 `w-32`, 1024px가 넘는 화면에선 `w-48`로 보일 것이다.

그리고 tailwind는 mobile-first이다. 따라서 스타일링의 기본은 모바일이 되어야 한다. prefix가 없는 클래스라면 모든 화면 사이즈에 적용될 것이고 sm: 과 같은 prefix를 붙인다면 그 경계선을 넘는 크기의 화면부터 그 클래스의 화면이 적용될 것이다. 따라서 모바일 화면을 위해서는 unprefixed utility를 쓰고 더 큰 화면의 대비를 위해서는 sm: 등의 화면 breakpoint를 나타내는 prefix를 써서 스타일링하는 게 맞다.

또한 max-width breakpoint가 없음에 유의하라. 만약 medium 크기의 화면에만 어떤 미디어 쿼리를 적용하고 싶다면 md: 에 그걸 적용한 후 lg: 화면에서는 원래대로 되돌리면 된다.

이런 미디어 쿼리 breakpoint는 tailwind.config.js에서 커스텀할 수 있다.
theme의 screens 항목을 만들어서 'tablet':'640px'(min-width 640px인 화면 미디어 쿼리가 만들어짐) 등의 항목을 추가하면 된다. 자세한 커스텀 내용은 https://tailwindcss.com/docs/screens 참조.

# 5. 다크 모드

다크 모드를 지원하는 페이지가 많다. tailwind에서도 `dark:*`클래스를 이용해서 다크모드일 경우를 스타일링할 수 있게 하고 있다. 이는 미디어 쿼리 중 `prefers-color-scheme`를 이용하게 한다. 

그러나 다크모드를 토글할 수 있게 하는 페이지도 많다. 이는 tailwind.config.js에서 darkMode항목을 media 대신 class로 바꾸면 된다. 그러면 html 태그(정확히는 HTML트리에서 더 앞에 있는 태그 중 아무거나) class가 'dark' 클래스를 가지고 있는지에 따라 다크모드가 적용되고 안 되고가 바뀐다.

# 6. 스타일 재사용

프로젝트가 커질수록, 특정 스타일 유틸리티의 조합이 반복되는 경우가 많아지게 된다. 가령 똑같은 class 조합이 들어간 버튼만 수십 개가 된다거나..이런 반복되는 스타일을 잘 다루는 법도 가이드에 적혀 있다.

물론 이런 반복되는 스타일을 따로 클래스로 빼는 법도 존재한다. 그러나 VScode 등에서 제공하는 multi-cursor editing(https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor)으로 모든 반복되는 클래스를 한번에 편집하는 식으로 다루는 것도 가능하다. 반복되는 스타일이 한 파일에만 있다면 이렇게 하는 것이 새로운 추상화 클래스를 만드는 것보다 좋을 수 있다.

혹은 반복되는 요소들의 내용을 배열에 담은 후 map 등을 이용해서 코드의 반복을 피하는 것도 방법이다. 그러면 실제 요소의 코드가 쓰이는 건 한 번뿐이다.

React 등의 프론트엔드 프레임워크를 사용하고 있다면 반복되는 요소를 컴포넌트로 만드는 것이 가장 좋은 방법이다. 반복되는 요소에서 달라지는 부분을 파악해 `children`등의 props와 다른 props를 정의하여 컴포넌트를 제작해 반복 요소를 처리할 수 있다.

이런 반복되는 요소를 따로 css class로 뺄 수도 있다. 그러나 그렇게 하면 결국 클래스명은 여러 컴포넌트에서 똑같이 반복되게 된다. 따라서 그보다는 컴포넌트를 따로 만들어서 추상화하는 게 더 좋은 방법이다.

# 7. 커스텀 스타일

프레임워크를 사용하면서 가장 힘든 점 하나는 프레임워크가 해주지 않는 부분을 직접 핸들링할 때이다. tailwind는 이런 것을 tailwind.config.js에서 어느 정도 확장하고 핸들링할 수 있게 제작되었다.

만약 컬러 팔레트나 spacing 스타일, 글씨체 등을 바꾸고 싶다면 tailwind.config.js의 theme section을 편집하면 된다.

그리고 tailwind에서 제공하는 색, 크기, 간격 등 외에 아예 다른 임의의 값을 사용하고 싶을 수도 있다. 그러면 `[]`를 이용해서 그 값을 적어넣으면 된다. 예를 들어서 `bg-[#bada55]`를 사용하면 background color가 내가 설정한 색으로 설정된다. 이는 `hover`등의 state와도 쉽게 같이 사용될 수 있다. 

`[mask-type:luminance]` 과 같이 아예 tailwind에서 지원하지 않는 CSS 프로퍼티를 통째로 집어넣을 수도 있다. 이는 정말 인라인 스타일과 비슷하지만 역시 hover등의 state와 같이 쓰일 수 있는 게 장점이다.

만약 `[]` 내에서 띄어쓰기가 필요하다면 언더스코어로 대신하면 된다. 그러면 tailwind가 알아서 빌드할 때 변환해 준다. 만약 정말 언더스코어가 필요한 경우 보통 tailwind가 알아서 변환을 안하지만 모호한 경우 백슬래시를 붙여서 언더스코어로 무조건 쓰이도록 할 수 있다.

이외에도 `@apply`를 사용하는 등 많은 스타일링 방법이 있지만 그렇게 많이 사용하지는 않는다고 한다.

# 8. Functions & Directives
directives는 Tailwind CSS에서 특별한 기능을 만드는 데에 쓰인다. 또 몇 가지 함수들을 제공한다. 대부분 커스텀 스타일과 관련된 부분인데 나중에 필요할 때 읽으면 될 것 같다. 빠르게 tailwind를 익히는 것과는 큰 상관이 없어 보이는데, 개발하면서 만약 중요한 부분인 것 같으면 돌아와서 보강하도록 하겠다.



---
title: 프론트 지식 익히기 tailwind - 2
date: "2022-07-28T00:00:00Z"
description: "프로젝트 tailwind 사용기 - 태그 정리"
tags: ["web", "study", "front"]
---

# 1. 두번째 글의 목적

첫번째 글에서는 tailwind 개론과 제공하는 몇 가지 기능들을 다루었다. 이 글에서는 tailwind를 본격적으로 시작하기 전에 어떤 클래스들이 존재하는지 간단히 정리해 두는 글이다. 물론 그때그때 부딪쳐 가면서 배울 수도 있겠지만 먼저 한번 정리해 두는 것이 더 효율적이라고 느낀다. 대충 뭐가 있는지 알아야 부딪치든 말든 하니까.

# 2. 기본 스타일

tailwind에서는 브라우저별로 다른 기본 CSS 설정 등을 싹 밀어 주고 어느 정도 통일된 기반에서 시작하게 해주는 preflight를 자동으로 제공한다. index.css에 들어 있는 `@tailwind base;`에서 알아서 주입해 준다. 뭐가 있는지는 공식 문서의 스타일시트를 참고하면 된다. 최대한 직관적으로 짜였다는 것 정도만 알고 넘어갔다.

만약 다른 Base style이 있는 프로젝트와 합병 등의 이유로 preflight를 아예 사용하지 않고 싶다면 역시 tailwind.config.js에서 설정 가능하다. corePlugins 항목에서 `preflight:false;`로 바꾸면 된다.

# 3. Layout 관련 스타일
필요해 보이는 것만 몇 개 정리한다. 

- Aspect ratio : 컴포넌트의 가로세로비 조절
aspect-auto, aspect-square(가로세로 비율 1:1), aspect-video(16:9)

- Columns : 요소 내부의 열 개수를 조절
columns-{n}, columns-{size}
요소 안의 열 개수를 지정하거나 특정 너비마다 열이 새로 생기게 할 수 있다.

- Box Sizing : 각 요소의 크기를 padding, margin 포함해서 측정하게 할 것인지를 결정
box-border : 요소의 크기에 padding, margin이 포함된다.
box-content : 요소의 크기에 요소 내부의 내용만 포함된다.

- Display : 요소의 디스플레이 타입을 결정한다.
block, inline-block, inline, flex, inline-flex, table, inline-table, table-caption등이 있다.
block, inline-block, inline, flex, grid, hidden 정도만 알고 넘어가자.

- Float : 한 요소가 흐름으로부터 빠져서 텍스트나 인라인 요소들이 그 주위를 감싸게 할 때 그 요소의 위치를 지정한다. 가령 이미지와 텍스트가 어우러질 때 이미지가 어느 곳에 정렬될 것인지를 결정.
float-right, float-left, float-none(요소와 인라인 요소가 섞이지 않는다)

- Object Fit
한 요소가 다른 요소 안에 포함되어 있을 때(박스 안의 이미지처럼)포함된 요소가 어떻게 크기가 조절될지를 결정한다.
object-contain, object-cover, object-fill, object-none, object-scale-down
이것들은 모두 object-fit css의 하나를 지정한 것과 같다.

- Object Position
내부 요소가 컨테이너에 어느 위치에 있는지를 결정한다.
object-bottom, object-left, object-left-top, object-center 등 9개의 위치 중 하나를 지정할 수 있다.

- Overflow
내부 요소가 컨테이너에서 넘칠 때 어떻게 처리할지를 결정한다.
overflow-{auto, hidden, clip, visible, scroll, x-auto, y-auto, x-hidden, y-hidden, x-clip, y-clip, x-visible, y-visible, x-scroll, y-scroll}

- Overscroll Behavior
페이지에서 스크롤했을 때 스크롤 가능한 영역이 2개 이상일 때 한쪽의 스크롤이 끝난 상태에서 스크롤을 더 하면 더 큰 쪽의 스크롤도 내려가는 스크롤 체이닝 현상이 발생한다. 이를 조정하는 클래스이다. overscroll-contain 을 주면 이런 스크롤 체이닝을 막을 수 있다.(기본은 overscroll-auto)

- Position
요소가 DOM에서 어떻게 배치되는지를 나타내는 유틸리티. static, fixed, absolute, relative, sticky가 있다. position css와 같다. https://developer.mozilla.org/ko/docs/Web/CSS/position top-{n}, bottom-{n} 등으로 해당 위치 지정 방법에 따라 위치를 지정할 수도 있다.

- Visibility
요소가 보이는지 안 보이는지를 조정한다. visible, invisible 2가지뿐이다.

- z-index
말 그대로 요소의 z-index를 조정한다. 요소가 얼만큼 우선적으로 보일지 결정한다. z-0, z-10...z-50까지 있다. z-auto도 있다. z-뒤 숫자가 높을수록 더 우선적으로 보인다.

# 4. Display(Layout) 관련 스타일

- Flex Direction
flex-direction을 지정하는 것. flex-row, flex-col, flex-row-reverse, flex-col-reverse가 있다. 

- Flex Wrap
flex 컨테이너 내의 요소들이 컨테이너 영역을 벗어나더라도 강제로 한 줄에 배치되게 할 것인지 wrap(줄바꿈되더라도 컨테이너 내부에 위치)하게 할 것인지를 결정한다.
flex-wrap, flex-nowrap, flex-wrap-reverse가 있다.

- Flex
flex 컨테이너 내의 요소들이 grow/shrink하는 것을 결정. flex-grow(grow, grow-0으로 설정 가능), flex-shrink(shrink, shrink-0으로 설정 가능), flex-basis(basis-{n}으로 설정가능)의 shortcut이다.
flex-initial : `flex:0 1 auto`와 같음. 요소가 내용 크기에 맞춰 줄어들긴 하지만 늘어나진 않고 initial size 유지
flex-1 : `flex: 1 1 0%;`와 같음. 요소가 초기 사이즈를 무시하고 필요한 만큼 늘어나거나 줄어든다.
flex-auto : `flex: 1 1 auto;`와 같음. 요소가 초기 사이즈를 어느 정도 고려해서 늘어나거나 줄어든다.
flex-none : 요소가 늘어나거나 줄어들지 않는다.

- Grid Template Columns
grid display에서 열 개수를 결정한다.
grid-cols-{n} 이 `grid-template-columns: repeat(n, minmax(0, 1fr));`과 같다.

- Grid Column Start / End
grid display에서 요소가 몇 개의 열을 차지할지, 혹은 어떤 열에서 시작해서 어떤 열까지 차지할지를 결정한다.
col-span-n : 이 요소는 열 n개를 차지(span)한다.
col-start-n : 이 요소는 열 n에서 시작한다. (왼쪽 맨 끝이 1, 한 열이 더해질 때마다 1씩 늘어난다)
col-end-n : 이 요소는 열 n에서 끝난다.

- Grid Template Rows, Grid Row Start / End
grid display에서 요소의 행 개수를 결정하고 요소가 몇 개의 행을 차지하거나 몇 행에서 시작해서 몇 행에서 끝날지를 결정한다.
column의 경우와 비슷하게 grid-rows-n, row-span-n, row-start-n, row-end-n 을 쓴다.

- Grid Auto Flow
아이템이 자동 배치되는 흐름을 결정한다. row의 경우 아이템으로 한 행을 채운 후 다음 행으로 넘어가는 식이다. grid-flow-row, grid-flow-col, grid-flow-dense, grid-flow-row-dense, grid-flow-col-dense

- Grid Auto Columns / Rows
grid-template의 통제를 벗어난 그리드 트랙의 크기를 지정한다. 만약 row나 column의 개수를 알 수 없는 경우 사용한다.
auto-cols-{auto, min, max, fr}
auto-rows-{auto, min, max, fr}

- Gap
그리드 행, 열 혹은 flexbox item들 간의 간격을 설정한다. gap-n으로 설정할 수 있고 혹은 gap-x-n, gap-y-n으로 x,y축 방향으로도 설정할 수 있다.

- Justify Content
컨테이너의 메인 축을 따라서 아이템들이 배열되는데 이때 가로 방향으로 어떻게 위치하는지를 결정한다. 예를 들어 justify-start 는 아이템이 컨테이너의 시작부터 메인 축을 따라 채워지게 한다. display grid의 경우, grid 아이템들의 너비를 모두 합한 값이 grid 컨테이너의 너비보다 작을 때 아이템들을 통째로 정렬하게 된다.
justify-{start, end, center, between, around, evenly}

- Justify Items
grid 요소들이 컨테이너 내부에서 어떻게 배열되는지를 결정하는 컨테이너 속성이다. 즉 inline axis상에서의 위치를 결정한다. 아이템의 가로 방향 정렬이라고 생각하면 된다.
justify-items-{start, end, center, stretch}

- Justify Self
컨테이너가 아닌, 배치할 요소 스스로에 쓰인다. 해당 아이템을 가로로 정렬하는 데에 쓰인다.
justify-self-{auto, start, end, center, stretch}

- Align Content
컨테이너의 메인 축을 따라서 아이템들이 배열되는데 이때 세로 방향으로 어떻게 위치하는지를 결정한다. display grid의 경우, grid 아이템들의 높이를 모두 합한 값이 grid 컨테이너의 높이보다 작을 때 아이템들을 통째로 세로 정렬하게 된다.
content-{center, start, end, between, around, evenly}

- Align Items
inline axis에 교차되는 축 방향으로 아이템이 어떻게 배열되는지를 결정한다. grid에서는 아이템의 세로 방향 정렬이라고 생각하면 된다.
items-{start, end, center, baseline, stretch}

- Align Self
컨테이너가 아닌, 배치할 요소 스스로에 쓰인다. 해당 아이템을 세로로 정렬하는 데에 쓰인다.
self-{auto, start, end, center, stretch, baseline}

- Place Content
justify, align content가 같은 정렬로 이루어질 때 shortcut으로 사용한다.
place-content-{center, start, end, between, around, evenly, stretch}

- Place Items
justify, align items가 같은 방식 정렬로 이루어질 때 shortcut으로 사용한다.
place-items-{start, end, center, stretch}

- Place Self
하나의 요소에 justify-self와 align-self가 같은 방식 정렬로 이루어질 때 사용된다.
place-self-{auto, start, end, center, stretch}

# 5. Spacing styles

- Padding
요소의 padding을 결정한다. 이때 padding, margin의 차이는 border의 바깥쪽의 여백인지의 차이이다. margin은 테두리 바깥의 여백이고 padding은 그 안쪽에, 요소의 자식 요소들을 배치할 때 테두리와 내부 요소간의 여백이다.
p-n(n은 1당 0.25rem, 즉 4px이다)이 있고 가로 여백과 세로 여백을 뜻하는 px-n, py-n이 있다. padding-top, bottom, left, right를 나타내는 pt, pb, pl, pr이 있다.

- Margin
요소의 margin을 결정한다. 이 역시 m-n으로 결정되는데 n은 1당 0.25rem=4px이다. 예를 들어 m-1은 4px margin이다. padding과 마찬가지로 가로, 세로 마진을 주는 mx, my와 상하좌우 마진을 뜻하는 mt, mb, ml, mr이 있다.

- Space Between
자식 요소간의 간격을 설정한다. space-x-n은 margin-left를 부여해서 간격을 주고 space-y-n은 margin-top으로 간격을 준다. 이것 역시 n 1당 0.25rem=4px 간격이다.

# 6. Sizing style

- Width
요소의 너비를 설정한다. w-n. n당 0.25rem=4px. 숫자별 크기는 이 페이지를 참고하자. https://tailwindcss.com/docs/width w-3/5 등 화면 크기의 일정 비율을 차지하는 너비도 가능하다. 100%는 w-full.

- Min-Width
요소의 최소 너비를 설정한다.
min-w-0, min-w-full이 있고 min-content와 max-content의 크기에 따라서 최소 너비를 정하는 min-w-min, min-w-max가 있다. min-w-fit도 있다.

- Max-Width
요소의 최대 너비를 설정한다. max-w-* 로 설정하는데 너무 많기 때문에 구체적인 수치는 공식 문서를 참고하면서 필요할 때마다 찾아 쓸 예정이다.

- Height
요소의 높이를 결정한다. h-*으로 정의하며 width의 경우와 비슷하게 1당 0.25rem=4px이고 fraction height(h-3/5와 같은)도 지원한다.

- Min-Height, Max-Height
Min/Max-Width와 비슷하다.

# 7. Typography

- Font Family
글씨체를 결정한다. sans style, serif style, mono style 글씨체들을 각각 모아서 정의하고 있다. 요소의 폰트를 적당히 브라우저가 지원하는 그 스타일의 글씨체로 만들어 준다.
font-sans, font-serif, font-mono

- Font Size
당연히 폰트 크기를 결정한다. 이때 이 속성을 설정하면 한 줄의 높이를 설정하는 속성인 `line-height`도 적절하게 같이 설정된다.
text-{xs, sm, base, lg, xl, 2xl, ..., 9xl}
각 속성의 크기는 공식 문서를 참고하자.

- Font Smoothing
폰트를 더 부드럽게 표현해 주는 속성이라고 한다. 단 비표준이라고 하고 당장 필요한 기능도 아닌 것 같아서 넘어간다.

- Font style
italic 과 not-italic 을 지원한다. 더 설명이 필요한가?

- Font Weight
요소의 폰트 굵기를 바꾼다. font-weight css 설정과 같다.
font-{thin, extralight, light, normal, medium, semibold, bold, extrabold, black} : 각각이 font-weight 100부터 900까지에 해당된다.

- Font Variant Numeric
숫자의 스타일을 결정한다. 가령 0에 사선을 그을 것인지 말 것인지 등을 결정. 당장 크게 쓰일 일은 없을 것 같아 넘어간다.

- Letter Spacing
자간을 설정한다.
tracking-{tighter, tight, normal, wide, wider, widest}

- Line Height
한 줄의 높이를 설정한다. leading-{숫자} 로 설정할 수 있다. 그러나 font size를 설정할 때 자동으로 적절히 같이 설정되기도 한다.

- List Style Type
리스트가 bullet point를 쓸 건지 1., 2., ... 와 같은 숫자 표기를 쓸 것인지 결정한다.
list-{none, disc, decimal}

- List Style Position
리스트에서 bullet point와 같은 리스트의 구분 표시가 리스트 영역의 밖에 있을지를 결정한다.

- Text Align
말 그대로 텍스트 정렬이다. justify의 경우 한 줄 한 줄을 꽉 채우고 넘어가는 것이다.
text-{left, center, right, justify, start, end}

- Text Color
요소의 텍스트 색을 나타낸다. text-{color이름} 과 같은 클래스명으로 설정할 수 있다. 이 색 팔레트는 공식 문서의 컬러 페이지에서 확인 가능하다. https://tailwindcss.com/docs/customizing-colors#default-color-palette 

- Text Decoration
텍스트에 밑줄, 윗줄 등을 그을 수 있는 옵션이다.
underline, overline, line-through, no-underline 클래스가 있다.

- Text Decoration Color
텍스트의 밑줄 등의 컬러를 설정한다. decoration-{color이름} 클래스명으로 설정할 수 있고 가능한 색은 위에 있는 색 팔레트와 같다. 물론 커스터마이징도 가능하다. https://tailwindcss.com/docs/customizing-colors#customizing

- Text Decoration Style
밑줄을 두 줄로 칠 수도 있고 점선으로 칠 수도 있다. 이런 텍스트 장식 스타일을 지정한다.
decoration-{solid, double, dotted, dashed, wavy}

- Text Decoration Thickness
텍스트 장식(밑줄 등)의 굵기를 지정한다. decoration-숫자 형식으로 지정하며 decoration-from-font로 폰트에 따라 알아서 스타일이 결정되도록 설정할 수도 있다.

- Text Underline Offset
텍스트와 밑줄의 간격을 설정한다.

- Text Transform
텍스트를 대문자, 혹은 소문자 혹은 첫 글자 대문자 등으로 바꾼다.

- Text overflow
텍스트가 요소의 너비를 넘어갔을 때 어떻게 처리할지를 결정한다. 
truncate, text-ellipsis, text-clip이 있다. text-clip을 제외하고는 모두 넘치는 문자를 ellipsis(...)로 처리한다.

- Text Indent
텍스트의 들여쓰기 크기를 결정한다. indent-숫자 형식이다.

- Vertical Alignment
텍스트의 세로 정렬을 결정한다. 실제로 vertical-align css를 설정하는 것과 같다.
align-{baseline, top, middle, bottom, text-top, text-bottom, align-sub, align-super}

- Whitespace
요소가 공백 문자를 처리하는 법을 지정한다.
whitespace-{normal, nowrap, pre, pre-line, pre-wrap}

- Word Break
단어를 그대로 표시하면 요소의 크기를 넘기게 될 때 어떻게 처리할지를 결정한다.
break-{normal, words, all}

# 참고
CSS grid https://studiomeal.com/archives/533

padding, margin의 차이 https://ofcourse.kr/css-course/margin-padding-%EC%86%8D%EC%84%B1

font-smooth에 대하여 https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth
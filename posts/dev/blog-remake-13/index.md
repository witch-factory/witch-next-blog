---
title: 블로그 만들기 - 13. 아이콘 색상, 링크 추가 etc.
date: "2023-06-11T01:00:00Z"
description: "자잘한 수리를 해보자."
tags: ["blog", "web"]
---

# 블로그 만들기 시리즈

- [1. 기본 세팅](https://witch.work/posts/dev/blog-remake-1)
- [2. 메인 페이지의 HTML 설계](https://witch.work/posts/dev/blog-remake-2)
- [3. 글 상세 페이지의 구조 설계](https://witch.work/posts/dev/blog-remake-3)
- [4. 이미지를 상대 경로로 쓸 수 있도록 하기](https://witch.work/posts/dev/blog-remake-1)
- [5. 자잘한 페이지 구성 개선과 배포](https://witch.work/posts/dev/blog-remake-5)
- [6. 페이지 요소의 배치 설계](https://witch.work/posts/dev/blog-remake-6)
- [7. 메인 페이지 컴포넌트 디자인](https://witch.work/posts/dev/blog-remake-7)
- [8. 글 목록/내용 페이지 컴포넌트 디자인](https://witch.work/posts/dev/blog-remake-8)
- [9. 글 썸네일 자동 생성하기](https://witch.work/posts/dev/blog-remake-9)
- [10. 폰트, 카드 디자인 등의 디자인 개선](https://witch.work/posts/dev/blog-remake-10)
- [11. 글에 조회수 달기](https://witch.work/posts/dev/blog-remake-11)
- [12. 페이지 테마와 글 검색 기능](https://witch.work/posts/dev/blog-remake-12)
- [13. 테마 아이콘과 썸네일 레이아웃 개선 등](https://witch.work/posts/dev/blog-remake-13)

- [메인 페이지의 연산 최적화](https://witch.work/posts/dev/blog-opt-1)
- [글 목록 페이지네이션 만들기](https://witch.work/posts/dev/blog-opt-2)
- [이미지를 CDN에 올리고 placeholder 만들기](https://witch.work/posts/dev/blog-opt-3)
- [검색 페이지에 무한 스크롤 구현하기](https://witch.work/posts/dev/blog-opt-4)

# 1. 헤더 아이콘 색상

화면 너비가 작아지게 되면 헤더의 메뉴가 드롭다운으로 바뀌는데 이 아이콘 색상은 테마에 상관없이 검은색으로 일정하게 되어 있다. 따라서 다크모드에선 불편하다.

이걸 테마에 따라 아이콘 색상이 달라지게 해보자. [icons8](https://icons8.com/)에서 iOS의 햄버거 메뉴/닫기 아이콘을 가져와서 `Toggler` 컴포넌트에 적용한다.

```tsx
// src/components/header/menu/toggler/index.tsx
import Image from 'next/image';
import { useTheme } from 'next-themes';

import styles from './styles.module.css';

const hamburgerIcon: {[key: string]: string} = {
  'light':'/icons/icons8-hamburger.svg',
  'dark':'/icons/icons8-hamburger-dark.svg',
  'pink':'/icons/icons8-hamburger-pink.svg',
};

const cancelIcon: {[key: string]: string} = {
  'light':'/icons/icons8-cancel.svg',
  'dark':'/icons/icons8-cancel-dark.svg',
  'pink':'/icons/icons8-cancel-pink.svg',
};

function Toggler({isMenuOpen, toggle}: {isMenuOpen: boolean, toggle: () => void}) {
  const {theme} = useTheme();
  
  return (
    <button className={styles.button} onClick={toggle}>
      <Image
        src={isMenuOpen ?
          cancelIcon[theme || 'light'] :
          hamburgerIcon[theme || 'light']
        }
        alt='Menu' 
        width={32} 
        height={32} 
      />
    </button>
  );
}

export default Toggler;
```

그리고 이를 클라이언트 사이드에서 보이도록 하기 위해 메뉴 컴포넌트에서는 dynamic import를 한다.

```tsx
// src/components/header/menu/index.tsx

import dynamic from 'next/dynamic';

/* import문 일부 생략 */
/* dynamic import */
const Toggler = dynamic(() => import('./toggler'), { ssr: false });

/* 타입 생략 */

function Menu({navList}: {navList: PropsItem[]}) {
  /* 컴포넌트 내용은 이전과 똑같으므로 생략 */
}

export default Menu;
```

# 2. 자동 생성 썸네일의 간격 조정

현재 자동 생성 썸네일은 `src/plugins/make-thumbnail.mjs`에서 remark 플러그인 함수를 통해 생성하고 있다. 그런데 지금 코드의 경우 제목이 너무 길어서 여러 줄로 썸네일에 들어갈 경우 밑의 컨텐츠(헤딩 목록)가 유연하게 간격이 조절되지 않고 무조건 고정된 위치에 렌더링된다.

이 코드를 수정하자. `drawHeadings` 함수만 수정하면 된다.

```js
// src/plugins/make-thumbnail.mjs
/* 나머지 함수들 생략 */
function drawHeadings(ctx, title, headingTree) {
  title=stringWrap(title, 15);
  title=title.split('\n');
  
  if (title.length>3) {return;}

  const thumbnailHeadings=headingTree.slice(0, 2);
  const headingTexts=[];
  for (let h of thumbnailHeadings) {
    const headingText=h.data.hProperties.title.replaceAll('. ', '-');
    headingTexts.push(headingText);
  }
  headingTexts[headingTexts.length-1]+='...';
  ctx.font = '20px NotoSansKR';
  for (let i=0; i<headingTexts.length; i++) {
    ctx.fillText(headingTexts[i], 20, 50+50*title.length+25*i);
  }
}
```

그리고 `drawHeading`을 쓸 때 title도 같이 인수로 넣어준다.

```js
drawHeadings(ctx, title, headings);
```

# 3. 카테고리에 링크 추가

메인 페이지의 `Category`에서 표시하는 게시판 제목에 링크를 추가하자. 해당 컴포넌트에서는 props로 category의 URL을 이미 받고 있으므로 쉽다.

링크가 있음을 표시하기 위해서 링크 표시 유니코드 `U+1F517`을 사용하였다.

```tsx
// src/components/category/index.tsx
function Category(props: Props) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        <Link href={props.url}>
          {props.title} {'\u{1F517}'}
        </Link>
      </h2>
      
      <ul className={styles.list}>
        {props.items.map((item) => {
          return (
            <li key={item.url}>
              <Card
                {...propsProperty(item)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

그리고 hover시 텍스트 색상 스타일링 추가

```css
// src/components/category/styles.module.css
.container{
  margin-bottom:2rem;
}

.title:hover{
  color:var(--textLightIndigo);
}

.list{
  list-style:none;
  padding:0;
  display: grid;
  gap:1rem;
  margin:0;
}

@media (min-width:768px){
  .list{
    grid-template-columns:repeat(3,1fr);
  }
}
```

# 참고


---
title: 블로그 만들기 - 13. 아이콘 색상, 링크 추가 etc.
date: "2023-06-11T01:00:00Z"
description: "자잘한 수리를 해보자."
tags: ["blog", "web"]
---

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

# 2. 도메인을 Vercel로

이전에 배포를 vercel로 하도록 했다. 따라서 `witch.work` 도메인을 이쪽으로 향하게 해보자.


---
title: 블로그 만들기 - 12. 페이지 테마, 댓글, 검색
date: "2023-06-09T00:00:00Z"
description: "댓글 기능과 다크 테마를 달고 검색 기능을 구현하자"
tags: ["blog", "web"]
---

# 블로그 만들기 시리즈

|제목|링크|
|---|---|
|1. 기본 세팅|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. 메인 페이지의 HTML 설계|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. 글 상세 페이지의 구조 설계|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. 이미지를 상대 경로로 쓸 수 있도록 하기|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. 자잘한 페이지 구성 개선과 배포|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. 페이지 요소의 배치 설계|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. 메인 페이지 컴포넌트 디자인|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. 글 목록/내용 페이지 컴포넌트 디자인|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. 글 썸네일 자동 생성하기|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. 폰트, 카드 디자인 등의 디자인 개선|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. 글에 조회수 달기|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. 페이지 테마와 글 검색 기능|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. 테마 아이콘과 썸네일 레이아웃 개선 등|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. 글 분류를 태그 기반으로 변경|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|메인 페이지의 연산 최적화|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|글 목록 페이지네이션 만들기|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|이미지를 CDN에 올리고 placeholder 만들기|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|검색 페이지에 무한 스크롤 구현하기|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

# 1. 페이지 테마(특히 다크모드)

긴 최적화의 강을 건너왔다. 내 블로그는 좀더 좋아졌을까? 좋아졌으면 좋겠다...아무튼 이제 기능 구현으로 다시 돌아가보자. 무엇이 남았는가? 당장은 페이지 테마, 댓글 기능, 검색 기능 정도가 생각이 난다. 일단 개발자의 친구 다크 모드를 구현해 보자.

## 1.1. 라이브러리 설치

페이지 테마를 쉽게 구현할 수 있도록 해주는 [next-themes](https://github.com/pacocoursey/next-themes)라이브러리를 사용했다. 먼저 설치한다. 30KB 정도밖에 안 되는 작은 라이브러리다.

```bash
npm install next-themes
```

이 라이브러리에서 제공하는 `ThemeProvider` 컴포넌트로 `_app.tsx`의 모든 페이지 컴포넌트를 감싸주자. Head나 SEO 컴포넌트는 굳이 감싸줄 필요가 없다.

```tsx
// src/pages/_app.tsx
export default function App({ Component, pageProps }: AppProps) {
  /* Google Analytics 이벤트 발생 코드 생략 */
  
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <DefaultSeo {...SEOConfig} />
      <ThemeProvider>
        <Header navList={blogCategoryList} />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
      <GoogleAnalytics />
    </>
  );
}
```

## 1.2. 토글 버튼 구현

그리고 라이트-다크모드 토글 버튼을 구현해보자. 먼저 버튼에 들어갈 그림을 그려보자. 이미지를 찾기도 귀찮기 때문에 [excalidraw](https://excalidraw.com/)에서 허접하게 그렸다.

![라이트모드 그림](./light-mode.svg)

![다크모드 그림](./dark-mode.svg)

토글 버튼은 헤더에 들어갈 것이므로 `src/components/header/themeChanger`에 작성하자. 해당 폴더를 만들고 index.tsx와 styles.module.css 생성.

그리고 [next-themes github README](https://github.com/pacocoursey/next-themes)를 참고하여 themeChanger를 작성했다. 기본 system theme이 나오는 걸 회피하기 위해 그냥 `theme` 대신 `resolvedTheme`을 사용했다.

```tsx
// src/components/header/themeChanger/index.tsx
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import styles from './styles.module.css';

function ThemeIcon({isDark}: {isDark: boolean}) {
  if (!isDark) {
    return (
      <Image 
        src='/light-mode.svg'
        alt='라이트모드 아이콘'
        width={50}
        height={40}
      />
    );
  }
  else {
    return (
      <Image 
        src='/dark-mode.svg'
        alt='다크모드 아이콘'
        width={50}
        height={40}
      />
    );
  }
}

const ThemeChanger = () => {
  const [mounted, setMounted]=useState<boolean>(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button 
      onClick={toggleTheme}
      className={styles.button}
      aria-label='theme toggle button'
      aria-pressed={isDark}
    >
      <ThemeIcon isDark={isDark} />
    </button>
  );
};

export default ThemeChanger;
```

토글버튼 스타일링은 당장 중요한 건 아니라고 생각되어 간단히 이 정도만 했다.

```css
// src/components/header/themeChanger/styles.module.css
.button{
  margin:0;
  padding:0;
  border:none;
  background:none;
}
```

그리고 이를 헤더 버튼에 넣어주었다.

```tsx
// src/components/header/index.tsx
function Header({
  navList
}: {
  navList: PropsItem[];
}) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <HomeButton />
          <div className={styles.wrapper}>
            <ThemeChanger />
            <Menu navList={navList} />
          </div>

        </div>
      </nav>
    </header>
  );
}
```

## 1.3. 색상 정리

이제 다크모드를 위해 global.css에서 각종 색상을 바꿔 정의하자. 이때 `:root`에 정의된 색상들은 기본 테마 색상이고 `[data-theme='dark']`에 정의된 색상은 다크테마 색상으로 들어간다. font나 레이아웃 같은 건 굳이 바꿀 필요가 없으니 넘어가자.

그럼 지금 색상들은 어떻게 쓰이고 있을까? 블로그의 모든 색상들은 변수로 정의된 값들만 사용하고 있다. 이 사용처를 한번 싹 정리하고 합칠 건 합쳐서 사용하는 색을 최소화한 후 다크모드에 해당하는 색상들을 정의하자.

여기 쓰이지 않은 변수명들은 어디에도 사용되지 않은 색상의 번호이다.

white
- 페이지네이션에서 현재 위치한 페이지 번호에 호버 시 텍스트 색상
- 헤더와 드롭다운 메뉴의 색상

gray1
- Card 컴포넌트 hover 시의 background
- 메인 페이지 자기소개 background
- 글 상세 페이지의 코드 블럭 background
- 글 상세 페이지에서 날짜-조회수 사이의 선 색

gray2
- footer background
- 헤더의 버튼/링크 hover 시의 background

gray3
- 헤더의 border

gray5
- 글 상세 페이지의 heading 밑에 달리는 border

gray6
- footer text color
- projectCard 컴포넌트의 그림자

gray7
- Table of Content의 글자색
- 글 상세 페이지의 blockquote 글자색

indigo0
- 프로젝트 소개의 기술 스택의 background
- 글 상세 페이지에서 작은 코드 블럭의 background

indigo1
- 글 정보 중 태그를 보여주는 컴포넌트의 background
- 페이지네이션에서 선택된 페이지 번호의 background
- 프로젝트 소개 펼쳐보기 버튼의 background
- toc에서 현재 위치한 목차의 background

indigo2
- 프로젝트 소개 펼쳐보기 버튼의 hover background
- toc에서 현재 위치한 목차 hover시 background

indigo5
- 페이지네이션에서 선택된 페이지 번호 hover시 background
(잘못된 선택이었다고 생각하지만 호버시 매우 진해지도록 디자인했었다)

indigo6
- about 페이지의 링크 색상
- toc의 링크 호버 시 텍스트 색상
- 프로젝트의 기술 스택을 나타내는 블록의 텍스트 색상
- 프로젝트 카드 호버시 텍스트 색상
- 메인 페이지 자기소개 컴포넌트의 링크 텍스트 색상
- 글 카드 호버 시 텍스트 색상

indigo7
- 글 카드의 태그 컴포넌트의 텍스트 색상(이는 indigo6으로)
- 글 상세 내용 페이지에서 내용 중 링크의 텍스트/밑줄 색상

indigo8
- 페이지네이션 컴포넌트에서 선택되어 있는 페이지의 텍스트 색상
- 프로젝트 소개 펼쳐보기 버튼 텍스트 색상
- toc에서 현재 위치한 목차의 텍스트 색상
- 글 상세 페이지에서 글 태그 컴포넌트의 텍스트 색상(통일 필요...)

indigo9
- 글 상세 내용 페이지에서 작은 코드 블럭의 텍스트 색상

이들을 용도에 따라 통합하고 정리한다.

```
white -> bgColor

gray1 -> bgGray
gray2 -> bgGrayHover
gray3 -> headerBorderColor
gray5 -> borderGray
gray6 -> shadowGray
gray7 -> textGray(footer 텍스트도 이 색으로)

indigo0 -> codeBlockBgColor
indigo1 -> bgIndigo
indigo2 -> bgIndigoHover
indigo5 -> 용도 삭제후 indigo2로 표현
indigo6 -> textLightIndigo
indigo7 -> linkColor
indigo8 -> textIndigo
indigo9 -> codeBlockTextColor
```

따라서 `src/styles/globals.css`의 `:root`에 다음과 같은 CSS 변수들을 추가한다.

```css
// src/styles/globals.css
// :root 중간에 추가
  --bgColor: #ffffff;
  --bgGray: #f1f3f5;
  --bgGrayHover: #e9ecef;
  --headerBorderColor: #dee2e6;
  --borderGray: #adb5bd;
  --shadowGray:#868e96;
  --textGray:#495057;

  --codeBlockBgColor:#edf2ff;
  --bgIndigo:#dbe4ff;
  --bgIndigoHover:#bac8ff;
  --textLightIndigo:#4c6ef5;
  --linkColor:#4263eb;
  --textIndigo:#3b5bdb;
  --codeBlockTextColor:#364fc7;
```

그리고 기존에 grayX, indigoX들이 쓰이던 곳을 다 검색해서 위 변수들로 바꿔준다. `Ctrl + Shift + F`와 함께하면 노가다 작업일 뿐이다.

이제 다크모드에 해당하는 색상들을 `[data-theme='dark']`에 정의한다. 태그의 indigo 색상은 [color-hex의 Indigo palette 2 Color Palette](https://www.color-hex.com/color-palette/2793)에서 가져왔다.

각각의 색상을 정할 때는 기존 색과의 유사도보다는 가독성과, 원래 컴포넌트의 목적을 생각했다. 예를 들어서 태그나 기술 스택을 담는 블럭의 색은 너무 눈길을 끄는 게 좋지 않다고 생각하여, 눈길을 너무 끌지 않도록 배경과 매우 비슷한 느낌의 색을 택했다.

```css
// src/styles/globals.css
[data-theme='dark'] {
  --bgColor: #212529;
  --textColor: #ececec;

  --bgGray: #343a40;
  --bgGrayHover:#343a40;
  --headerBorderColor:#495057;
  --borderGray: #868e96;
  --shadowGray:#868e96;
  --textGray:#ced4da;

  --codeBlockBgColor:#343a40;
  --codeBlockTextColor:#edf2ff;
  --bgIndigo:#002395;
  --bgIndigoHover:#2b4aaf;
  --textIndigo:#edf2ff;
  --textLightIndigo:#748ffc;
  --linkColor:#91a7ff;
}
```

그리고 html, body의 폰트 색상과 배경 색상도 CSS 변수를 이용해서 정하도록 했다.

```css
// src/styles/globals.css
html, body {
  min-height:100vh;
  scroll-behavior: smooth;
  background-color:var(--bgColor);
  color:var(--textColor);
}
```

## 1.4. 코드 테마 변경

그런데 문제는 다크 모드로 바꿔도 코드가 여전히 라이트 테마의 색상으로 나온다는 것이다. 이는 `contentlayer.config.js`에서 rehype 플러그인이 코드를 변경할 때 옵션을 주면 된다.

```js
const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
};

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [MDXPost, Post],
  markdown: {
    remarkPlugins: [remarkGfm, changeImageSrc, headingTree, makeThumbnail],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
  mdx: {
    remarkPlugins: [remarkGfm, changeImageSrc, headingTree, makeThumbnail],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], highlight],
  },
});
```

그런데 이렇게 하면 글의 코드 블럭이 2개씩 보이게 된다. 하나는 라이트 테마, 하나는 다크 테마로.

이를 막기 위해서는 현재 `data-theme`과 다른 테마를 가지고 있는 pre 태그들을 DOM에서 제외시키면 된다. 다음 코드를 `src/styles/globals.css`에 추가하자.

```css
[data-theme='dark'] pre[data-theme='light']{
  display:none;
}

[data-theme='light'] pre[data-theme='dark']{
  display:none;
}
/* 시스템의 테마를 따라가도록 한다 */
@media (prefers-color-scheme: dark){
  html {
    data-theme:dark;
  }
}
```

# 2. 커스텀 테마 만들기

나는 vscode에서 [Light Pink Theme](https://marketplace.visualstudio.com/items?itemName=mgwg.light-pink-theme)이라는 별로 인기 없는 테마를 쓰고 있다. 그러나 인기없는 이 테마라도, 블로그에 비슷하게 적용한다면 흔한 라이트/다크 테마보다는 신선하지 않을까?

코드 블럭까지 커스텀하려면 길고 험한 여정이 예상되지만 한번 해보자. 색상은 [Open Color의 Pink](https://yeun.github.io/open-color/#pink), [DaisyUI의 Valentine theme Color](https://github.com/saadeghi/daisyui/blob/master/src/theming/themes.js)그리고 [Light Pink Theme의 color JSON](https://github.com/mgwg/light-pink-theme/blob/master/themes/Light%20Pink-color-theme.json)에서 체리피킹했다.

## 2.1. 색상 전환 버튼 만들기

이는 실험적 기능이므로 일단 footer에 만들자. footer에 색상 전환 버튼을 넣어둔다.

```tsx
// src/components/footer/index.tsx
function Footer() {
  const { setTheme } = useTheme();

  const pinkTheme = () => {
    setTheme('pink');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <p className={styles.copyright}>
          © {blogConfig.name}, Built with
            <Link href='https://github.com/witch-factory/witch-next-blog' target='_blank'> witch-next-blog</Link>, 
          2023
          </p>
          <Link href='https://github.com/witch-factory' className={styles.github}>
            <Image src='/github-mark.png' alt='Github' width={32} height={32} />
          </Link>
          <div className={styles.theme}>
            <p>Experimental Color Theme Changer</p>
            <button 
              className={styles.pinkTheme}
              onClick={pinkTheme}
            ></button>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

그리고 footer의 스타일을 추가한다.

```css
/* src/components/footer/styles.module.css */
.theme{
  padding-botton:20px;
}

.pinkTheme{
  height:40px;
  width:40px;
  background-color:var(--pink);
  border:none;
  border-radius:50%;
}
```

## 2.2. 테마 추가

ThemeProvider에도 `pink` 테마를 추가해야 한다.

```tsx
// src/pages/_app.tsx
export default function App({ Component, pageProps }: AppProps) {
  /* Google Analytics 이벤트 발생 코드 생략 */
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <DefaultSeo {...SEOConfig} />
      {/* attribute(data-theme)가  테마에 따라 value로 바뀐다.*/}
      <ThemeProvider
        defaultTheme='system'
        enableSystem={true}
        value={{ dark: 'dark', light: 'light', pink: 'pink' }}
        themes={['dark', 'light', 'pink']}
      >
        <Header navList={blogCategoryList} />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
      <GoogleAnalytics />
    </>
  );
}
```

그리고 `globals.css`에 색상 변수값들을 추가한다.

```css
// src/styles/globals.css
[data-theme='pink'] {
  --bgColor: #f5f0f3;
  --textColor: #632c3b;

  --bgGray: #f5e3ef;
  --bgGrayHover:#f5e3ef;
  --headerBorderColor:#ffdeeb;
  --borderGray: #af4670;
  --shadowGray:#868e96;
  --textGray:#d6336c;
  
  --codeBlockBgColor:#ffdeeb;
  --codeBlockTextColor:#a61e4d;
  --bgIndigo:#ffdeeb;
  --bgIndigoHover:#fcc2d7;
  --textIndigo:#c2255c;
  --textLightIndigo:#f06595;
  --linkColor:#d6336c;
}
```

`contentlayer.config.js`에서 rehype 플러그인이 코드를 변경할 때도 pink 테마에 대한 옵션을 준다.

```js
// contentlayer.config.js
const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    pink: 'light-plus',
    dark: 'github-dark',
  },
};
```

그리고 현재 `data-theme`과 다른 테마를 가지고 있는 pre 태그들을 DOM에서 제외시키는 CSS도 추가한다. 아까와 달리 `:not` 유사 클래스를 사용하자.

```css
// src/styles/globals.css
[data-theme='dark'] pre:not([data-theme='dark']){
  display:none;
}

[data-theme='light'] pre:not([data-theme='light']){
  display:none;
}

[data-theme='pink'] pre:not([data-theme='pink']){
  display:none;
}
```

이제 footer에 있는 `Experimental Color Theme Changer`아래의 핑크색 동그라미를 누르면 핑크 테마가 적용된다. 

추후에 다른 테마도 적용시켜서 여러 테마를 쓸 수 있도록 하고 싶다.

하지만 어차피 CSS 변수의 색들과 코드 테마만 정의해 주면 다른 거의 모든 것들을 라이브러리에서 알아서 한다. 따라서 테마는 색에 대한 영감만 있다면 명륜진사갈비처럼 무한으로 만들 수 있으니 이건 다른 기능들을 좀 더 달고 나서 나중에 하자.

# 3. 댓글 기능

댓글 기능도 만들어 보자. giscus라는 라이브러리에서 해당 기능을 제공한다.

github App으로 [giscus](https://github.com/apps/giscus)를 설치하자. 나는 내 블로그 레포지토리에만 설치하였다. 그리고 블로그 레포지토리의 Setting에 들어가서 [discussion을 활성화한다.](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository)

그다음에는 [공식 문서 가이드](https://giscus.app/ko)를 따라서 하면서 적절히 내 블로그에 맞게 고치자.

## 3.1. giscus 정보 config

giscus에서 제공된 정보들을 blog-config.ts에 추가.

```ts
interface BlogConfigType {
  name: string;
  title: string;
  description: string;
  picture: string;
  url: string;
  social: {
    Github: string;
    BOJ: string;
  };
  comment: {
      type: 'giscus';
      repo: string;
      repoId: string;
      category: string;
      categoryId: string;
      lang?: 'ko' | 'en'; // defaults to 'en'
      lazy?: boolean;
    };
  thumbnail: string;
  googleAnalyticsId?: string; // gtag id
}

const blogConfig: BlogConfigType = {
  name:'김성현(Sung Hyun Kim)',
  title:'Witch-Work',
  description:
    '대단한 뜻을 품고 사는 사람은 아닙니다. ' +
    '그저 멋진 사람들이 내는 빛을 따라가다 보니 여기까지 왔고, ' +
    '앞으로도 그렇게 살 수 있었으면 좋겠다고 생각하는 사람입니다. ' +
    '이곳에 찾아오신 당신과도 함께할 수 있어 영광입니다.',
  picture:'/witch.jpeg',
  url:'https://witch.work',
  social: {
    Github: 'https://github.com/witch-factory',
    BOJ: 'https://www.acmicpc.net/user/city'
  },
  /* comment 객체를 추가한다. */
  comment: {
    type: 'giscus',
    repo: 'witch-factory/witch-next-blog',
    repoId: 'R_kgDOJnEDaQ',
    category: 'General',
    categoryId: 'DIC_kwDOJnEDac4CXFDt',
  },
  thumbnail: '/witch.jpeg',
  googleAnalyticsId:'G-HBQKJEYL1K'
};
```

## 3.2. giscus 컴포넌트

댓글을 보여줄 컴포넌트를 만들자. `src/components/giscus/`폴더를 생성 후 늘 그랬듯 index.tsx를 생성한다.

giscus로 메시지를 보낼 일이 많으므로 해당 동작의 함수를 만든다.

```tsx
const sendMessage = (message: Record<string, unknown>) => {
  const iframe: HTMLIFrameElement | null = document.querySelector(
    'iframe.giscus-frame',
  );
  iframe?.contentWindow?.postMessage({ giscus: message }, 'https://giscus.app');
};
```

그리고 리턴되는 div 컴포넌트가 렌더링되는 시점에 useEffect를 사용하여 script 태그를 자식으로 심어서 iframe이 div 컴포넌트 안에 렌더링되도록 하는 방식으로 Giscus 컴포넌트를 구현한다.

또한 테마가 바뀔 때와 페이지가 이동할 때 해당 메시지를 `sendMessage`함수를 통해 iframe으로 보내서 갱신해준다.

```tsx
// src/components/giscus/index.tsx
function Giscus() {
  const ref=createRef<HTMLDivElement>();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme ?? 'dark';
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    if (blogConfig.comment?.type !== 'giscus') {
      return;
    }
    const config = {
      'data-repo': blogConfig.comment.repo,
      'data-repo-id': blogConfig.comment.repoId,
      'data-category': blogConfig.comment.category,
      'data-category-id': blogConfig.comment.categoryId,
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': theme,
      'data-lang': blogConfig.comment.lang ?? 'en',
      'data-loading': blogConfig.comment.lazy ? 'lazy' : undefined,
      src: 'https://giscus.app/client.js',
      crossOrigin: 'anonymous',
      async: true,
    };

    Object.entries(config).forEach(([key, value]) => {
      script.setAttribute(key, `${value}`);
    });
    /* 혹시 있을 자식들을 제거 */
    ref.current?.childNodes.forEach((children) => {
      ref.current?.removeChild(children);
    });

    ref.current?.appendChild(script);

    return () => {
      ref.current?.childNodes.forEach((children) => {
        ref.current?.removeChild(children);
      });
    };
  }, []);

  useEffect(() => {
    sendMessage({
      setConfig: {
        theme: theme,
      },
    });
  }, [theme]);

  useEffect(() => {
    sendMessage({ setConfig: { term: router.asPath } });
  }, [router.asPath]);

  if (blogConfig.comment?.type !== 'giscus') {
    return null;
  }
  return (
    <div className='giscus' ref={ref} />
  );
}
```

이걸 `src/pages/posts/[category]/[slug]/index.tsx`에 추가해준다. 하는 김에 글의 메타 정보를 나타내는 부분도 컴포넌트로 묶어주도록 하자. 

```tsx
// src/pages/posts/[category]/[slug]/index.tsx
interface PostMatter{
  title: string;
  date: string;
  SWRfallback: {[key: string]: number};
  slug: string;
  tagList: string[];
}

function PostMatter(props: PostMatter) {
  const {title, date, SWRfallback, slug, tagList}=props;
  const dateObj=new Date(date);
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.infoContainer}>
        <time className={styles.time} dateTime={toISODate(dateObj)}>
          {formatDate(dateObj)}
        </time>
        <div className={styles.line}></div>
        <SWRConfig value={SWRfallback}>
          <ViewCounter slug={slug} />
        </SWRConfig>
      </div>
      <ul className={styles.tagList}>
        {tagList.map((tag: string)=>
          <li key={tag} className={styles.tag}>{tag}</li>
        )}
      </ul>
    </>
  );
}

function PostPage({
  post, fallback
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEO 정보 생략 */
  const slug=post._raw.flattenedPath.split('/')[1];

  return (
    <main className={styles.page}>
      <NextSeo {...SEOInfo} />
      <article className={styles.container}>
        <PostMatter 
          title={post.title}
          date={post.date}
          SWRfallback={fallback}
          slug={slug}
          tagList={post.tags}
        />
        <TableOfContents nodes={post._raw.headingTree} />
        {'code' in post.body?
          <div className={contentStyles.content}>
            <MDXComponent code={post.body.code}/>
          </div>
          :
          <div
            className={contentStyles.content} 
            dangerouslySetInnerHTML={{ __html: post.body.html }} 
          />
        }
      </article>
      {blogConfig.comment?.type === 'giscus'?<Giscus />:null}
    </main>
  );
}
```

각 장의 상세 페이지에 댓글이 잘 달리는 것을 확인할 수 있다.

# 4. 검색 기능

검색 기능을 하는 페이지를 구현하자. 검색은 다음과 같이 구현될 것이다.

1. 검색을 위해 전체 글을 보여주는 페이지를 만든다.
2. 마크다운 파일이 변환될 때 파일의 메타데이터를 수집한다.(remark 플러그인 활용)
3. 해당 메타데이터를 통해 검색을 수행한다.
4. 그렇게 나온 객체들만 카드 객체를 통해 화면에 보여준다.

## 4.1. 검색 페이지 만들기

일단 전체 글을 보여주는 페이지를 만들자. 예전에 남겨놓은 `src/pages/posts/index.tsx`가 유용하게 쓰일 때가 왔다.

```tsx
import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useRouter } from 'next/router';

import Card from '@/components/card';
import PageContainer from '@/components/pageContainer';
import { getSortedPosts } from '@/utils/post';
import { DocumentTypes } from 'contentlayer/generated';

import styles from './styles.module.css';

interface PostMetaData{
  title: string;
  description: string;
  date: string;
  tags: string[];
  url: string;
}

function AllPostListPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageContainer>
      <h2 className={styles.title}>{`${category} 검색`}</h2>
      <ul className={styles.list}>
        {postList.map((post: PostMetaData) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
    </PageContainer>
  );
}

export default AllPostListPage;

export const getStaticProps: GetStaticProps = () => {
  const postList = getSortedPosts().map((post: DocumentTypes) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
  return { props: { category:'전체 글', postList } };
};
```

그리고 간단한 검색 창을 만들자. `src/components/searchConsole/`폴더를 만들고 index.tsx와 styles.module.css를 만든다.

```tsx
// src/components/searchConsole/index.tsx
import styles from './styles.module.css';

function SearchConsole() {
  return (
    <input
      className={styles.input}
      placeholder='검색어를 입력하세요'
    />
  );
}

export default SearchConsole;
```

input의 스타일은 간단히 이 정도로 했다.

```css
// src/components/searchConsole/styles.module.css
.input{
  width: 100%;
  height: 2.5rem;
  border: 1px solid var(--borderGray);
  border-radius: 0.25rem;

  margin:1rem 0;
  padding:0.5rem 0.75rem;

  color: var(--textGray);
  font-size: 1rem;
  background-color: var(--bgColor);

  appearance: none;
}
```

## 4.2. 검색 기능

검색 기능의 본질은 어떤 검색어를 사용자가 입력하면 그 검색어를 기반으로 필터링한 결과를 보여주는 것이다. 따라서 검색어 데이터를 `src/pages/posts/index.tsx`의 `AllPostListPage`컴포넌트에서 가지고 있고 이를 기반으로 글들의 필터링을 하도록 하자.

일단 `PostMetaData` 타입 배열을 기반으로 제목, 글 설명을 검색어 기반으로 필터링하는 함수를 만들자. `src/pages/posts/filterPosts.ts`를 작성한다.

모든 키워드는 소문자로 취급하도록 한다.

```ts
// src/pages/utils/filterPosts.ts
import { PostMetaData } from '@/components/categoryPagination';

function filterPostsByKeyword(posts: PostMetaData[], keyword: string) {
  if (keyword==='') return posts;
  return posts.filter((post: PostMetaData) => {
    const titleMatched = post.title.toLocaleLowerCase().includes(keyword.toLocaleLowerCase());
    const descriptionMatched = post.description.toLocaleLowerCase().includes(keyword.toLocaleLowerCase());
    return titleMatched || descriptionMatched;
  });
}

export default filterPostsByKeyword;
```

그리고 `SearchConsole` 컴포넌트가 가지고 있는 Input 값을 기반으로 검색어를 필터링하도록 하자. `src/components/searchConsole/index.tsx`를 다음과 같이 수정한다.

input이 검색어 값과 현재 검색어 상태를 가지고 있을 수 있도록 props로 넘겨주는 것이다.

```tsx
import { ChangeEvent } from 'react';

import styles from './styles.module.css';

interface Props{
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function SearchConsole(props: Props) {
  const {value, onChange}=props;

  return (
    <input
      className={styles.input}
      placeholder='검색어를 입력하세요'
      value={value}
      onChange={onChange}
    />
  );
}

export default SearchConsole;
```

이를 `src/pages/posts/index.tsx`에서 사용하도록 하자. `searchKeyword` state를 만들고 `SearchConsole` 컴포넌트에 넘겨줄 `onKeywordChange`함수도 작성한다.

```tsx
// src/pages/posts/index.tsx
function PostSearchPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchKeyword, setSearchKeyword]=useState('');

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, []);

  const filteredPostList = filterPostsByKeyword(postList, searchKeyword);

  return (
    <PageContainer>
      <h2 className={styles.title}>{`${category} 검색`}</h2>
      <SearchConsole 
        value={searchKeyword}
        onChange={onKeywordChange}
      />
      <ul className={styles.list}>
        {filteredPostList.map((post: PostMetaData) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
    </PageContainer>
  );
}
```

이렇게 하면 검색어를 입력할 때마다 `searchKeyword` state가 변경되면서 컴포넌트가 다시 렌더링되게 되고, 따라서 `filteredPostList`가 변경되어서 필터링된 결과를 보여주게 된다.

## 4.3. 디바운싱으로 검색 최적화

지금은 검색창의 텍스트가 바뀔 때마다 `PostSearchPage`, 즉 거의 전체 페이지가 리렌더링되도록 하고 있는데 이는 꽤 부하가 큰 작업이다. 따라서 디바운싱을 이용해서 검색창의 텍스트가 바뀔 때마다 리렌더링되는 것을 방지하도록 하자.

300ms동안 입력이 없으면 검색어 입력이 완료되었거나 사용자가 잠시 멈춘 것으로 간주하고 그때 요청을 보내도록 하자. 이는 `searchKeyword` state를 커스텀 훅으로 관리함으로써 달성할 수 있다.

먼저 특정 value에 대한 디바운싱 값을 쓰게 해주는 `useDebounce` 커스텀 훅을 만들자.

```tsx
// src/pages/utils/useSearchKeyword.ts
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

그다음 `useSearchKeyword`을 만들어서 검색어와 검색어의 세터, 그리고 검색어의 디바운스 값을 리턴하도록 하자. 그런데 그전에 검색어를 주소에서도 쿼리스트링으로 가지고 있게 하자. 검색 결과를 다른 사람에게 공유하고 싶을 수도 있지 않은가?

가령 settimeout에 대해 검색한 결과를 `https://witch.work/?search=settimeout`와 같은 주소로 공유할 수 있다면 좋을 것이다. 이 기능을 `useSearchKeyword` 커스텀 훅 내부에 구현하자.

뒤로가기를 하면 언제나 검색 초기로 돌아가도록 하기 위해 `onpopstate` 이벤트를 활용하였고 쿼리스트링 처리는 `debouncedKeyword`가 바뀔 때마다 이루어지도록 하였다. 쿼리스트링 업데이트를 위해서는 [query-string](https://www.npmjs.com/package/query-string)을 사용하였다.

```ts
// src/pages/utils/useSearchKeyword.ts
function useSearchKeyword(): [string, string, (s: string) => void] {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  const onPopState = () => {
    const parsed = queryString.parse(location.search);
    setKeyword(parsed.keyword?.toString() || '');
  };
  
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    const {search}=parsed;
    if (search) {
      setKeyword(search.toString());
    }
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    const parsed = queryString.parse(location.search);

    if (debouncedKeyword===parsed.search) return;

    parsed.search = debouncedKeyword;

    const nextURL=queryString.stringifyUrl({
      url: location.pathname,
      query: parsed,
    }, {
      skipEmptyString: true,
      skipNull: true,
    });

    history.pushState(parsed, '', nextURL);
  }, [debouncedKeyword]);

  return [keyword, debouncedKeyword, setKeyword];
}
```

`useSearchKeyword`을 `src/pages/posts/index.tsx`에서 사용하여 검색되도록 하자. 이때 검색어 필터링은 부하를 줄이기 위해 debouncedKeyword를 기반으로 한다.

```tsx
// src/pages/posts/index.tsx
function PostSearchPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchKeyword, debouncedKeyword, setSearchKeyword]=useSearchKeyword();

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, [setSearchKeyword]);

  /* searchKeyword가 바뀔 때마다 컴포넌트가 리렌더링되지만
  검색 결과는 debouncedKeyword 기반으로 바뀌도록 한다 */
  const filteredPostList = filterPostsByKeyword(postList, debouncedKeyword);

  return (
    <PageContainer>
      <h2 className={styles.title}>{`${category} 검색`}</h2>
      <SearchConsole 
        value={searchKeyword}
        onChange={onKeywordChange}
      />
      <ul className={styles.list}>
        {filteredPostList.map((post: PostMetaData) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
    </PageContainer>
  );
}
```

## 4.4. 검색 페이지 라우팅

이는 현재 `/posts`라우트에서 가능하다. 이 페이지를 헤더에서 접근할 수 있도록 하자. [icons8에서 받은 ios의 검색 아이콘](https://icons8.com/icon/set/search/ios-filled)을 사용하였다.

`src/components/header/search` 폴더를 만들고 내부에 다음과 같이 `Search` 컴포넌트를 작성한다.

```tsx
// src/components/header/seacrh/index.tsx
/* import 생략 */
const searchIcon: {[key: string]: string}={
  'light':'/icons/icons8-search.svg',
  'dark':'/icons/icons8-search-dark.svg',
  'pink':'/icons/icons8-search-pink.svg',
};

const Search = () => {
  const { theme } = useTheme();

  return (
    <Link href='/posts' className={styles.search}>
      <Image 
        src={searchIcon[theme || 'light']} 
        alt='Search' 
        width={32} 
        height={50} 
        priority
      />
    </Link> 
  );
};

export default Search;
```

search 스타일은 이렇게.

```css
// src/components/header/search/styles.module.css
.search{
  width:40px;
  height:100%;
  display:flex;
  flex-direction:row;
  justify-content:flex-end;
  align-items:center;
}
```

이를 헤더에 추가해준다. 이때 클라이언트 사이드 렌더링을 해서 테마에 맞는 아이콘을 쓰도록 하기 위해 dynamic import 사용.

```tsx
/* src/components/header/index.tsx */
const Search = dynamic(() => import('./search'), { ssr: false });

interface PropsItem{
  title: string;
  url: string;
}

function Header({
  navList
}: {
  navList: PropsItem[];
}) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <HomeButton />
          <div className={styles.wrapper}>
            <ThemeChanger />
            <Menu navList={navList} />
            <Search />
          </div>
        </div>
      </nav>
    </header>
  );
}
```

# 참고

https://bepyan.github.io/blog/nextjs-blog/6-comments

https://giscus.app/ko

https://github.com/pacocoursey/next-themes

https://colorate.azurewebsites.net/Color/002395

각종 색들의 팔레트 https://yeun.github.io/open-color/

https://bepyan.github.io/blog/nextjs-blog/6-comments

daisyUI의 색들 https://github.com/saadeghi/daisyui/blob/master/src/theming/themes.js

daisyUI color 2 https://unpkg.com/browse/daisyui@2.0.9/src/colors/themes.js

shiki의 가능한 코드 테마 https://github.com/shikijs/shiki/tree/main/packages/shiki/themes

vscode light pink theme의 컬러셋 https://github.com/mgwg/light-pink-theme/blob/master/themes/Light%20Pink-color-theme.json

next-themes 공식 문서 https://github.com/pacocoursey/next-themes

검색 구현하기 https://medium.com/frontendweb/build-the-search-functionality-in-a-static-blog-with-next-js-and-markdown-33ebc5a2214e

디바운싱 https://www.zerocho.com/category/JavaScript/post/59a8e9cb15ac0000182794fa

query-string https://www.npmjs.com/package/query-string

https://taero.blog/posts/debouncing-with-react

https://dev.to/franklin030601/how-to-create-a-search-engine-with-debounce-effect-4hef#8

https://github.com/vercel/next.js/issues/10608
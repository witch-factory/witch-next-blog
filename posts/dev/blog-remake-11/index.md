---
title: 블로그 한땀한땀 만들기 - 11. 글 조회수 달기
date: "2023-06-04T00:00:00Z"
description: "글의 조회수를 카운팅해보자"
tags: ["blog", "web"]
---

이 글은 내 새로운 블로그에 조회수를 다는 과정이다. 정보 전달을 위해 [이전 블로그에 조회수를 달다가 만 과정](https://witch.work/blog-adding-view-count/)에서 몇 가지를 복붙했다.

# 1. 글 옮기기

일단 글들을 전부 새 블로그로도 옮기자.

# 2. busuanzi

busuanzi라는 중국 서비스가 있는데 이를 이용하면 페이지와 블로그 조회수를 제일 쉽게 추가할 수 있다. 이 부분은 [예전에 내가 쓴 글](https://witch.work/blog-adding-view-count/)에서 복붙했다.

[fienestar님의 가이드](https://fienestar.github.io/blog/2020/05/24/busuanzi%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%98%EC%97%AC-%EC%A0%95%EC%A0%81%EC%9D%B8-%ED%8E%98%EC%9D%B4%EC%A7%80%EC%97%90-%EC%8A%A4%ED%83%80%EC%9D%BC-%EB%B3%80%EA%B2%BD%EC%9D%B4-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%A1%B0%ED%9A%8C%EC%88%98-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0/)를 따라하면 된다. 단 내 블로그에 맞게 하기 위한 몇 가지 수정이 필요하다.

먼저 다음 코드를 사이트의 head 혹은 body에 추가해야 한다.

```html
<script async src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
```

내 블로그에는 `Seo`라는 컴포넌트가 있고 이는 블로그의 모든 페이지에 삽입된다. 그리고 이 `Seo` 컴포넌트는 react-helmet의 Helmet 컴포넌트로 이루어져 있는데 이 Helmet 컴포넌트는 head 태그에 들어가는 내용을 관리한다. (추가 : 아마 nextjs에선 Head 컴포넌트에 추가해 줘야 할 듯 싶다)

따라서 Helmet 컴포넌트 사이에 저 코드를 추가해 주면 된다.

```tsx
<Helmet
// SEO를 위한 메타 정보들이 들어가 있다.
// 여기서는 중요하지 않으므로 생략
>
  <script async src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'></script>
</Helmet>
```

## 2.1. 사이트 조회수와 방문자 수

사이트 조회수와 방문자 수는 다음 코드를 통해 추가할 수 있다. span에 붙은 id가 중요하다.

```html
<section style={{height:'20px'}}>
  조회수 <span id = 'busuanzi_value_site_pv' ></span> 회 <br />
  방문자 <span id = 'busuanzi_value_site_uv' ></span> 명
</section>
```

위 코드를 블로그의 페이지에 추가하면 된다. 내 블로그의 경우 메인 페이지를 나타내는 BlogIndex 컴포넌트에서 내 프로필 바로 아래에 추가했다.

이 조회수 표시를 위한 삽질을 하면서 블로그를 재구성해야겠다는 생각을 많이 했기 때문에 지금 굳이 스타일링을 하지는 않았다.

## 2.2. 페이지 조회수

단일 페이지의 조회수는 다음 코드로 추가한다.

```html
<span id="busuanzi_value_page_pv"></span>
```

이를 글 제목 아래에 적당히 추가하였다.

다른 삽질의 기록들은 아래에 적어두었다. 후에 블로그를 갈아엎을 때 이 지식을 쓰게 되길 바란다.

그리고 생각보다 빨리, 2달 만에 이 글을 다시 쓰게 되었다. 이번엔 nextjs이기 때문에 다시 쓴다.

# 3. google analytics로 조회수 달기

## 3.1. 계정 생성

구글 애널리틱스 계정을 새로 생성하자.

![create-account](./create-account.png)

그리고 웹사이트 속성도 설정한다.

![attr-set](./attr-setting.png)

비즈니스 정보도 적당히 설정한 후 약관 등에 동의하고 계정 생성을 마친다.

## 3.2. 블로그 이전하기

그리고 이제 내 블로그도 꼴이 좀 갖춰졌으니 내가 가지고 있는 `witch.work` 도메인이 새로 만든 블로그로 연결되도록 하자.

지금은 내가 gatsby로 만들었던 블로그 페이지에 연결되어 있다.

다음과 같이 cloudflare pages 메뉴에 들어간다.

![cloudflare-pages](./cloudflare-pages.png)

그리고 기존에 쓰던 프로젝트에 들어간 후 `사용자 설정 도메인`메뉴에서 `witch.work` 도메인을 삭제한다.

`witch-next-blog`에서 사용자 설정 도메인에 `witch.work`추가.

![next-blog-custom-domain](./next-blog-custom-domain.png)

## 3.3. 데이터 스트림과 태그 추가

그 다음 데이터 스트림 메뉴에 들어가서 페이지의 데이터 스트림을 추가해 주자.

![data-stream](./create-data-stream.png)

어..그런데 다음과 같은 경고가 뜬다. 데이터 수집이 활성화되지 않았다고 한다.

![site-no-data](./site-no-data.png)

## 3.4. 추적 코드 설정

데이터 수집 활성화를 위해선 앞에서 획득한 측정 ID를 등록해 줘야 한다. GA 추적 코드를 설정하자. 여기서는 프론트의 왕 [이창희](https://xo.dev/)에게 그리고 [김민지님의 블로그](https://mnxmnz.github.io/nextjs/google-analytics/)에서 도움을 받았다.

`blog-config.ts`에 구글 애널리틱스 ID를 추가해 주자. 다음과 같이 작성해 준다. GA 추적 코드는 구글 애널리틱스에 들어가면 알 수 있는 `G-`로 시작하는 그 코드다.

딱히 이게 git에 올라간다고 해서 보안상 문제가 있는 건 아니라서 이 파일에 작성해 줘도 상관없다.

```ts
// blog-config.ts
const blogConfig: BlogConfigType = {
  name:'김성현(Sung Hyun Kim)',
  title:'Witch-Work',
  description:
    '대단한 뜻을 품고 사는 사람은 아닙니다. ' +
    '그저 멋진 사람들이 내는 빛을 따라가다 보니 여기까지 왔고, ' +
    '앞으로도 그렇게 살 수 있었으면 좋겠다고 생각하는 사람입니다. ' +
    '이곳에 찾아오신 당신과도 함께할 수 있어 영광입니다.',
  picture:'/witch.jpeg',
  url:'https://witch-next-blog.vercel.app',
  social: {
    Github: 'https://github.com/witch-factory',
    BOJ: 'https://www.acmicpc.net/user/city'
  },
  thumbnail: '/witch.jpeg',
  /* 이 부분에 있는 걸 자신의 GA 추적 코드로 */
  googleAnalyticsId:'G-XXXXXXXXXX'
};
```

그리고 이걸 이용해 ga 추적을 하는 스크립트 컴포넌트를 만들어 준다. [ambienxo](https://github.com/blurfx/ambienxo)에서 적당히 가져온다.

ga 추적 코드를 삽입해 주는 스크립트 코드를 `next/script`로 래핑한 것에 불과하다. `src/componenets/GoogleAnalytics.tsx`를 만들고 다음과 같이 작성해 준다.

```tsx
// src/componenets/GoogleAnalytics.tsx
import Script from 'next/script';

import blogConfig from '../../blog-config';

const GoogleAnalytics = () => {
  if (blogConfig.googleAnalyticsId == null) {
    return null;
  }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${blogConfig.googleAnalyticsId}`}
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${blogConfig.googleAnalyticsId}');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
```

그리고 `_app.tsx`에 이 컴포넌트를 추가해 준다. 모든 페이지에 적용되어야 하므로 `_app.tsx`이 괜찮은 선택이다.

```tsx
// _app.tsx
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <DefaultSeo {...SEOConfig} />
      <Header navList={blogCategoryList} />
      <Component {...pageProps} />
      <Footer />
      {/* 여기에 추가 */}
      <GoogleAnalytics />
    </>
  );
}
```

# 4. DB 사용해서 조회수 측정



# 참고

https://curryyou.tistory.com/508

https://mnxmnz.github.io/nextjs/google-analytics/

https://ha-young.github.io/2020/gatsby/Add-Google-Analytics/

`_document.js` https://nextjs.org/docs/pages/building-your-application/routing/custom-document

`_app.js` https://nextjs.org/docs/pages/building-your-application/routing/custom-app

https://dev.to/ahmedmohmd/difference-between-appjs-and-documentjs-files-in-nextjs-3ah2

https://nextjs.org/docs/messages/next-script-for-ga

https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/

https://leerob.io/blog/real-time-post-views

https://bepyan.github.io/blog/nextjs-blog/5-google-analytics
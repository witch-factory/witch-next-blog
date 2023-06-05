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

# 3. google analytics - 등록

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

# 4. google analytics - 조회수 측정

## 4.1. API 활성화

GA API를 사용하기 위해 google api nodejs client를 설치한다.

```bash
npm install googleapis --save
```

[구글 개발자 콘솔](https://console.cloud.google.com/apis)로 이동해서 새 프로젝트 생성. 그리고 `사용자 인증 정보` 메뉴로 이동해서 `사용자 인증 정보 만들기`를 누른다. 그러면 API키, OAuth 클라이언트 ID, 서비스 계정을 선택할 수 있는데 서비스 계정을 선택한다. 그리고 적당한 이름으로 생성.

이제 좌측 메뉴에서 `사용 설정된 API 및 서비스`로 이동해서 `+ API 및 서비스 사용 설정`선택. 


## 4.1. page view를 받아오는 api를 만들자.




# 5. firebaseDB 사용해서 조회수 측정

[NextJS와 파이어베이스로 실시간 블로그 조회수 측정하기](https://leerob.io/blog/real-time-post-views)를 하는 글을 참고해서 DB를 사용해서도 조회수를 측정 가능하다.

특히, 구글 애널리틱스를 조회수에 사용할 경우 애드블럭 등의 이유로 약 [10% 정도의 조회수가 누락된다고 한다.](https://leerob.io/blog/real-time-post-views) 특히 기술 관련 블로그일 경우 더 그렇다고 한다. 아마 기술적인 내용을 읽는 사람들은 대부분 애드블럭을 써서 그런 듯 하다.

## 4.1. firebase 프로젝트 생성

firebase에 로그인하고 콘솔로 이동한다. 나는 구글 계정으로 로그인했다. 그리고 상단 메뉴에 '콘솔로 이동'을 눌러 콘솔로 이동한다.

그러면 프로젝트를 만들 수 있는 화면이 나오는데 당연히 프로젝트를 만들러 이동하자.

![create-project](./create-firebase-project1.png)

난 `witch-blog-views`라는 프로젝트를 만들었다. 그리고 구글 애널리틱스를 달 수도 있는데 나는 이전에 만들어 둔 계정이 있어서 그냥 달았다.

## 4.2. DB 생성

프로젝트가 만들어지면 DB를 생성하자. 좌측 메뉴의 빌드 카테고리에서 `Realtime Database`를 선택한다. 

![make-db](./make-realtime-db.png)

그리고 나오는 페이지에서 `데이터베이스 만들기`를 누른다. 대충 미국에 있는 DB 선택 후 테스트 모드로 시작.

그리고 좌측 상단 메뉴의 '프로젝트 개요'의 옆에 있는 톱니바퀴를 누르면 프로젝트 설정 페이지로 이동 가능하다. 그리고 `서비스 계정` 탭으로 이동한다.

거기서 `새 비공개 키 생성` 버튼을 누르고 나오는 json 파일을 잘 보관해 두자.

![create-key](./create-key.png)

## 4.3. DB 연결

이제 DB를 연결한다. firebase-admin 설치

```bash
npm i firebase-admin
```

그리고 `.env.local` 파일을 생성하고 이를 `.gitignore`에 추가한 후 다음과 같이 작성.

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=replace-me
FIREBASE_CLIENT_EMAIL=replace-me
FIREBASE_PRIVATE_KEY="replace-me"
```

이는 아까 다운받은 json 파일에서 비슷한 이름의 키워드를 찾아서 값을 붙여넣으면 된다. `PRIVATE_KEY` 값에는 `"`를 붙여줘야 한다.

그다음 `src/lib/firebase.js`를 만들고 다음과 같이 작성한다. 앱을 초기화하고 연결을 만드는 코드다.

```js
import * as admin from 'firebase-admin';
 
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}
 
const db = admin.firestore();
 
export { db };
```

이제 DB와의 연결을 만들었으니 특정 HTTP 요청마다 DB에 접근해서 view를 늘려 주는 함수를 API 라우트에 만들어 줘야 한다. [여기](https://www.pankajtanwar.in/blog/how-i-built-a-real-time-blog-view-counter-with-nextjs-and-firebase)에서 가져왔다.

```js
import db from '@/lib/firebase'

export default async (req, res) => {
  // increment the views
  if (req.method === 'POST') {
    const ref = db.ref('views').child(req.query.slug)
    const { snapshot } = await ref.transaction((currentViews) => {
      if (currentViews === null) {
        return 1
      }
      return currentViews + 1
    })

    return res.status(200).json({
      total: snapshot.val(),
    })
  }

  // fetch the views
  if (req.method === 'GET') {
    const snapshot = await db.ref('views').child(req.query.slug).once('value')
    const views = snapshot.val()

    return res.status(200).json({ total: views })
  }
}
```

이렇게 하고 `npm run dev`로 개발 모드 실행 후 `http://localhost:3000/api/views/this-is-blog-slug`와 같이 `/api/views/글제목`주소로 post 요청을 보낼 시 firebase realtime DB에서 view가 늘어나는 것을 확인할 수 있다. 나는 post 요청에 postman을 사용했는데 다른 걸 사용해도 상관없다.

## 4.4. Cloudflare 삽질



# 참고

https://curryyou.tistory.com/508

https://mnxmnz.github.io/nextjs/google-analytics/

https://ha-young.github.io/2020/gatsby/Add-Google-Analytics/

`_document.js` https://nextjs.org/docs/pages/building-your-application/routing/custom-document

`_app.js` https://nextjs.org/docs/pages/building-your-application/routing/custom-app

https://dev.to/ahmedmohmd/difference-between-appjs-and-documentjs-files-in-nextjs-3ah2

GA로 조회수 붙이기 https://arturocampos.dev/blog/nextjs-with-google-analytics

https://nextjs.org/docs/messages/next-script-for-ga

https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/

https://leerob.io/blog/real-time-post-views

https://bepyan.github.io/blog/nextjs-blog/5-google-analytics

https://andresrodriguez.dev/blog/count-blog-post-views-with-firebase

https://nextjs.org/docs/pages/building-your-application/routing/api-routes


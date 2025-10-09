---
title: Next.js 블로그 SEO 개선하기 - 사이트맵 정비와 구조화된 데이터 추가
date: "2025-05-25T00:00:00Z"
description: "블로그의 검색 유입이 줄어들기 시작했다. 사이트맵을 정비하고 JSON-LD로 구조화된 데이터를 넣어서 극복해 보자."
tags: ["blog", "web"]
---

# 시작

나는 내 블로그에 들어오는 트래픽을 자주 모니터링한다. 그런데 어느 날부턴가 내 블로그의 검색 유입이 줄어들기 시작했다. 내가 쓴 글과 같은 주제의 훌륭한 글들이 갑자기 쏟아져 나와서 내 블로그의 순위가 떨어졌을 수도 있겠지만 현실적으로 그럴 가능성은 낮았다. 블로그의 구조를 조금씩 바꾸는 과정에서 문제라면 문제가 생겼을 가능성이 높았다. 나는 검색 엔진 최적화의 전문가가 아니지만 그래도 내가 할 수 있는 최선을 다해 블로그의 검색 엔진 최적화를 시도해 보았다. 이 글은 그 과정을 기록한 것이다.

블로그의 제목, 설명, 키워드 삽입, og 이미지와 같은 기본적인 부분들은 이미 설정되어 있다. 따라서 그런 아주 기본적인 부분들은 제외하고 개선을 시도한 부분들에 대해서만 기록하겠다. 참고한 문서들은 글의 마지막에 정리해 놓았다.

# 사이트맵 개선

## 사이트맵에 언어별 페이지 추가

내 블로그에는 현재 사이트맵이 작성되어 있다. 기본적인 사이트맵 작성 과정에 대해서는 [블로그 고치기 - Next.js 페이지에 사이트맵 추가하기](https://witch.work/ko/posts/blog-nextjs-sitemap-generation)라는 글을 작성했었다.

문제는 이후 블로그에 영어 버전의 페이지를 추가했었는데 이 부분을 사이트맵에 반영하지 않았다는 것이다. 따라서 각 언어별 페이지를 사이트맵에 추가하였다. Next.js의 `sitemap.ts` 에서는 여러 언어로 된 페이지들이 따로 있을 경우 `alternates.languages`를 사용하여 페이지의 현지화된 버전을 작성할 수 있도록 지원한다.

각 언어별로 페이지가 따로 존재하는 사이트맵 항목을 작성하는 코드가 반복되어서 다음과 같이 함수로 분리하였다.

```ts
const createSitemapEntry = (path: string, lastModified: Date): MetadataRoute.Sitemap[number] => {
  return {
    url: blogConfig.baseUrl + path,
    lastModified,
    alternates: {
      languages: {
        ko: blogConfig.baseUrl + '/ko' + path,
        en: blogConfig.baseUrl + '/en' + path,
      },
    },
  };
};
```

이때 [Google 검색 센터의 사이트맵 관련 문서](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps)를 보면 구글 검색 봇은 priority와 changefreq를 무시한다고 한다. 따라서 위 함수에서도 priority와 changefreq는 설정하지 않았다.

참고로, 위처럼 `alternates.languages`를 사용하여 사이트맵을 작성하고 나면 `/sitemap.xml` 라우트에서 완성된 사이트맵을 확인할 수 있어야 한다. 그런데 크롬 등의 브라우저에서 `/sitemap.xml`을 열어보면 XML 형식으로 잘 보이지 않는 문제가 발생한다. 웬 텍스트들만 주르륵 나오게 된다.

하지만 개발자 도구의 네트워크 탭에 들어가 보면 정상적으로 사이트맵이 잘 생성된 걸 확인할 수 있다. 브라우저의 XML 뷰어가 제대로 동작하지 않는 문제다. [Next.js에도 해당 이슈](https://github.com/vercel/next.js/issues/67005#issuecomment-2474289548)가 올라와 있다. XML의 스키마 주소가 http에서 https로 자동 리다이렉트되면서 XML viewer가 제대로 동작하지 않는 거라고 한다.

다만 구글, Bing 등의 서치 콘솔, 사이트맵 유효성 검사기 등으로 확인해 본 결과 사이트맵 생성과 인식에는 문제가 없는 걸로 보인다. 따라서 브라우저에서 XML 뷰어가 제대로 동작하지 않는 문제는 무시해도 될 것 같다.

## 글 목록 페이지 추가

또한 개별 글 페이지가 아닌 글 목록 페이지도 사이트맵에 있어야 사이트맵을 통해 모든 페이지가 연결될 수 있다. 현재는 메인 페이지에서 글의 세부 페이지로 한번에 이동할 수 없는 경우도 있기 때문이다. 따라서 글 목록의 각 페이지들도 사이트맵에 추가하였다. 모든 글의 갯수를 상수로 저장하고 있는 걸 이용하였다.

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  // 각 글 목록 페이지에 대한 sitemap entry를 생성
  for (let page = 2; page <= Math.ceil(allPostNumber / ITEMS_PER_PAGE); page++) {
    const pagePath = `${staticRoutes.posts}/${page}`;

    sitemapForPostList.push(createSitemapEntry(pagePath, new Date()));
  }

  // ...
  return [
    ...defaultSiteMap,
    ...sitemapForPostList,
    ...sitemapFromPosts,
    ...sitemapFromTranslations,
  ];
}
```

혹은 각 태그별 페이지를 사이트맵에 추가할 수도 있다. 이 경우 post tag들을 순회하면서 각 태그별 페이지를 생성해 주면 된다.

## 컨텐츠 수정 날짜

사이트맵에는 페이지의 중요한 컨텐츠가 마지막으로 변경된 날짜인 `lastmod`를 넣는 게 권장된다. [이전에 검색된 URL에 대한 크롤링을 예약하기 위한 신호로 사용된다고 한다.](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping?hl=ko) 또 `lastmod`는 해당 페이지를 신뢰할 만한지에 대해 봇이 판단하는 데에도 영향을 미친다고 한다.

> 7년 전에 페이지가 변경되었음에도 lastmod 요소에서 어제 변경된 것으로 전달하면 Google에서는 마지막 페이지 수정 날짜를 더 이상 신뢰할 수 없게 됩니다.
>
> [Google 검색 센터, "사이트맵 핑 엔드포인트 지원 중단"](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping?hl=ko)

따라서 `new Date()`를 사용해서 넣어 주던 sitemap의 `lastmod`를 실제 컨텐츠 날짜로 변경해 주었다. 예를 들어 메인 페이지의 경우 가장 최근 글의 날짜를, 글의 세부 페이지는 해당 글의 날짜를 넣어 주었다.

```ts
// 기존의 메인 페이지 사이트맵 엔트리
createSitemapEntry(staticRoutes.home, new Date()),
// 변경 이후
createSitemapEntry(staticRoutes.home, new Date(getRecentPosts()[0].date)),

// 기존의 개별 글 페이지 사이트맵 엔트리 생성 코드
const sitemapFromPosts: MetadataRoute.Sitemap = postMetadata.map((post) => createSitemapEntry(post.url, new Date()));
// 변경 이후
const sitemapFromPosts: MetadataRoute.Sitemap = postMetadata.map((post) => createSitemapEntry(post.url, new Date(post.date)));
```

다만 각 태그별로 글 목록을 보여주는 페이지에는 `lastmod`를 넣지 않았다. 다른 페이지들을 모아서 보여주는 페이지의 경우 마지막 수정 날짜를 따지는 게 어렵기도 하고 [Google 검색 센터의 문서](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping)에서도 그럴 경우 딱히 `lastmod`를 넣지 않아도 된다고 한다.

# 페이지의 구조화된 데이터를 JSON-LD로 작성

페이지에 대한 구조화된 데이터를 작성하면 검색 엔진이 웹 페이지의 내용을 더 잘 이해할 수 있도록 도와준다고 한다. 또한 검색 엔진이 이 결과를 반드시 포함하는 건 아니지만 검색 결과에 추가 정보를 제공하여 사용자의 클릭율을 높이는 데에도 도움이 될 수 있다. 따라서 이를 작성해서 블로그의 검색 엔진 최적화를 시도해 보았다.

이런 구조화된 데이터를 작성할 수 있는 방식은 여러 가지가 있는데 나는 JSON-LD(JSON for Linking Data)를 사용해서 작성할 것이다. JSON이 내게 익숙하기도 하고 [Next.js에서 관련 가이드](https://nextjs.org/docs/app/guides/json-ld)도 제공하기 때문이다.

## 블로그 글의 구조화된 데이터

먼저 블로그 글을 보는 페이지에 구조화된 데이터를 추가하자. Google 검색 센터에서는 [Google 검색에서 지원하는 구조화된 데이터 목록](https://developers.google.com/search/docs/appearance/structured-data/search-gallery?hl=ko)을 제공한다. 이중에 블로그 글에 적합한 구조화된 데이터로는 `BlogPosting`이 있다. 이름부터 딱 적합해 보인다.

다음과 같이 작성했다. JSON-LD.com의 [Blog Post Schema Example](https://jsonld.com/blog-post/), GitHub에서 찾은 [BlogPosting Schema Example](https://gist.github.com/warnakey/2643c2501b2753bd8ba932f6a0bcf1d9), [Google 검색 센터의 구조화된 기사 데이터 가이드](https://developers.google.com/search/docs/appearance/structured-data/article?hl=ko)를 참고했고 Google에서 지원하는 속성은 전부 넣어주었다.

그리고 Next.js 공식 문서에 있는 예시를 참고하여 JSON-LD를 삽입하였다. `<script>` 태그를 이용하였다.

```tsx
async function PostPage({ params }: Props) {
  // 다른 코드 생략...
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.description,
    'url': blogLocalConfig[lang].url + post.url,
    'author': {
      '@type': 'Person',
      'name': blogLocalConfig[lang].name,
      'url': blogLocalConfig[lang].url,
    },
    'datePublished': post.date,
    'dateModified': post.date,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': blogLocalConfig[lang].url + post.url,
    },
    'image': {
      '@type': 'ImageObject',
      'url': post.thumbnail,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 블로그 글의 나머지 내용 */}
    </>
  );
}
```

## 블로그 메인 페이지의 구조화된 데이터

블로그 메인 페이지에도 구조화된 데이터를 추가하자. 블로그 메인 페이지는 아무래도 `WebSite` 유형의 구조화된 데이터가 적합하지 않을까? 하고 생각했다. 하지만 이건 Google에서 제공하는 구조화된 데이터 목록에는 없었다.

그래서 이건 나의 개인 블로그이므로 작성자의 정보와 함께 최근 활동도 포함할 수 있는 [`ProfilePage` 유형의 구조화된 데이터](https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ko)를 사용하기로 했다.

그렇게 다음과 같은 구조화된 데이터를 작성하고 페이지에 넣었다. [Blog Homepage Schema Example](https://gist.github.com/warnakey/5ada39a24ccc98c2b889e84c44d4a468)과 schema.org의 [Blog Schema](https://schema.org/Blog), [Google 검색 센터의 구조화된 프로필 페이지 데이터 가이드](https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ko)를 참고하였다. `hasPart` 속성을 사용하여 최근 글 3개를 포함하도록 했으며 `BlogPosting` 유형을 사용하여 각 글의 제목, 설명, URL, 작성 날짜 등을 구조화된 데이터로 작성했다.

```tsx
async function Home({ params }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    'mainEntity': {
      '@id': '#blog-owner',
      '@type': 'Person',
      'name': blogLocalConfig[lang].name,
      'alternateName': 'Witch',
      'url': blogLocalConfig[lang].url,
      'image': blogLocalConfig[lang].thumbnail.cloud,
      'description': blogLocalConfig[lang].description,
      'sameAs': [
        'https://github.com/witch-factory',
        'https://witch.work',
      ],
    },
    'hasPart': recentPosts.slice(0, 3).map((post) => ({
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.description,
      'url': blogLocalConfig[lang].url + post.url,
      'datePublished': post.date,
      'author': {
        '@id': '#blog-owner',
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 블로그 메인 페이지의 나머지 내용 */}
    </>
  );
}
```

이렇게 열심히 구조화된 데이터를 작성하고 나면 Google 검색 센터의 [리치 검색 결과 테스트 도구](https://search.google.com/test/rich-results)를 이용해 검사할 수 있다. 페이지에 구조화된 데이터가 잘 들어갔는지, 그리고 어떤 구조화된 데이터가 포함되어 있고 잘못 작성된 부분은 없는지 등을 확인 가능하다.

# 결론

이외에도 몇 가지 자잘한 개선을 했다. 가령 블로그의 코드에서 순서 없는 목록을 나타내는 부분에 `<ul>` 태그를 사용하도록 하여 좀 더 시맨틱한 HTML을 작성하도록 하기, `next/image`를 사용하여 이미지 최적화하기, Bing 서치 콘솔에도 사이트맵 등록하기 등이다. 하지만 이런 부분들은 일반적으로 적용할 수 있는 개선이라기보다는 상황에 따라 적용할 수 있는 부분이라고 생각해 생략하였다.

어쨌든 이렇게 블로그의 사이트맵에서 빠진 부분을 개선하고 페이지마다 구조화된 데이터를 추가하여 검색 엔진 최적화를 시도해 보았다. 이 작업이 당장 눈에 띄는 검색 유입 상승으로 이어지지는 않을 수도 있다. 또한 기술적인 SEO도 좋지만 좋은 컨텐츠를 꾸준히 생산하고 홍보하는 게 훨씬 중요하다는 것도 알고 있다.

하지만 신뢰할 수 있는 구조를 제공하는 웹사이트가 검색 엔진에서 더 나은 평가를 받지 않을까 하는 기대가 있다. 그리고 여러 자료를 학습하면서 내가 만든 페이지를 검색엔진이 어떻게 읽고 해석하는지, 그 관점을 이해하고 개선할 수 있었다는 점에서 이 작업은 충분히 의미 있었다고 생각한다. 앞으로 검색 유입이 개선되는지 지켜보고 필요하다면 이 글에 내용을 추가할 예정이다.

또한 SEO에는 페이지 성능도 상당히 중요한데 이는 [PageSpeed Insights](https://pagespeed.web.dev/?hl=ko), [CrUX 보고서](https://developer.chrome.com/docs/crux?hl=ko)와 같은 도구를 통해 확인할 수 있다. 페이지 성능에 대한 개선은 별도의 글로 작성할 예정이다.

# 참고

Next.js의 SEO Learn 문서

https://nextjs.org/learn/seo

검색엔진 최적화(SEO) 기본 가이드

https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko

구글 검색 센터의 구글 서치 콘솔 관련 웹툰

https://developers.google.com/search/blog/2021/05/search-console-webtoon-ep05?hl=ko

Sitemap attribute `<priority>` and `<last-modified>`

https://support.google.com/webmasters/thread/99881767/sitemap-attribute-priority-and-last-modified?hl=en

Build and submit a sitemap

https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

Issue with adding "alternates" in the sitemap #66574

https://github.com/vercel/next.js/issues/66574

Cannot create app router localized sitemap #67005

https://github.com/vercel/next.js/issues/67005#issuecomment-2474289548

Next.js의 sitemap 생성 소스코드

https://github.com/vercel/next.js/blob/main/packages/next/src/build/webpack/loaders/metadata/resolve-route-data.ts

사이트맵 핑 엔드포인트 지원 중단

https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping?hl=ko#changefreq-and-priority

Google 검색의 구조화된 데이터 마크업 소개

https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=ko

Google 검색에서 지원하는 구조화된 데이터 마크업

https://developers.google.com/search/docs/appearance/structured-data/search-gallery?hl=ko

구조화된 프로필 페이지(ProfilePage) 데이터

https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ko

How to implement JSON-LD in your Next.js application

https://nextjs.org/docs/app/guides/json-ld

Google에 페이지의 현지화된 버전 알리기

https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko#xdefault
---
title: 블로그에서 사용자의 언어에 맞게 컨텐츠 보여주기
date: "2025-01-27T00:00:00Z"
description: "사용자가 설정한 언어에 따라 다른 언어의 블로그 컨텐츠를 보여주는 방법을 알아보자."
tags: ["blog", "web"]
---

# 이 글은 퇴고 중입니다.

[이전 글](https://witch.work/posts/blog-auto-translation)에서 AI 번역을 통해 영어로도 볼 수 있는 블로그를 만들었다. [그리고 미들웨어의 `rewrite`를 이용해서](https://witch.work/posts/blog-auto-translation#22-%EA%B8%B0%EB%B3%B8-%EB%9D%BC%EC%9A%B0%ED%8A%B8%EB%A5%BC-%ED%95%9C%EA%B5%AD%EC%96%B4%EB%A1%9C-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0) 언어 정보가 없는 URL로 접속하면 한국어 페이지가 보이도록 했다.

하지만 단순히 영어 컨텐츠가 존재하는 것을 넘어 접속한 사용자가 설정한 언어에 따라 적절한 언어로 컨텐츠를 보여주면 좋겠다. 이번 글에서는 이를 구현해보자.

영어로 번역된 컨텐츠를 만들고 블로그에서 적절히 보여주는 방법에 대해서는 이전 글에서 다루었으므로 이 글에서는 다루지 않는다. 그리고 처음부터 완성된 형태만 설명할 수도 있겠지만 개발 과정에서 나름의 타협과 결정, 설계 변경들이 있었기에 그 과정을 함께 다루도록 하겠다.

# 요구사항과 설계

사용자에게 적절한 언어로 컨텐츠를 보여주기 위해서는 어떤 요구사항이 있을지 정리하자. 그리고 그걸 구체적으로 어떻게 구현할지 설계해보자.

## 요구사항 정리

물론 가장 기본이 되는 건 이것이다.

- 사용자가 사용하는 언어에 따라 적절한 언어로 컨텐츠를 보여준다.

하지만 이것만으로는 너무 막연하다. 또한 한계도 존재한다. 우리는 사용자가 브라우저에 설정한 언어를 볼 수 있을 뿐(`Accept-Language` 헤더를 이용한다) 사용자가 실제로 어떤 언어에 능숙하며 선호하는지 알 수 없다.

브라우저는 영어로 설정되어 있지만 한국어를 선호하는 사용자가 있을 수도 있고, 여행 중이라 이동하면서 우연히 한국어로 언어가 설정되어 있는 브라우저를 사용할 수도 있다. 따라서 사용자가 직접 언어를 선택할 수 있는 기능도 필요하다.

- 사용자가 직접 선택한 언어를 우선한다. 이 선택은 클라이언트가 기억하도록 한다.

이 사용자의 선택이란 여러 가지 방법이 있을 수 있다. 링크 등을 통해 `/en` 혹은 `/ko`가 붙은 URL로 접속한 사용자가 있을 수도 있고 언어 전환 UI를 통해 언어를 선택한 사용자가 있을 수도 있다. 이를 모두 감안해 구현해야 한다.

## 구현 설계

그럼 이제 어떻게 구현할지를 생각해 보자. 사용자가 페이지에 접속하면 어떻게 동작해야 할까?

앞선 요구사항을 구체화해보자. 사용자가 언어 선택 UI를 통해 언어를 선택한 것은 쿠키를 통해 기억하도록 하였다. 다음 사항을 미들웨어에 구현한다. 작성한 순서가 우선순위 그대로다.

1. 사용자가 URL에 언어 정보를 명시했을 때는 그 언어로 컨텐츠를 보여준다.
2. 만약 쿠키에 언어 정보가 있다면 그 언어로 컨텐츠를 보여준다.
3. HTTP 요청의 `Accept-Language` 헤더를 이용해서 사용자가 선호하는 언어를 알아내고 그 언어로 컨텐츠를 보여준다.
4. 그렇지 않다면 기본 언어로 컨텐츠를 보여준다.

그럼 언어를 바꾸는 UI의 동작은 어떻게 할까? 사용자가 언어를 전환하면 다음과 같은 동작을 하면 된다.

1. 쿠키에 새로운 언어 정보를 저장한다.
2. 새로운 언어 정보가 담긴 URL로 리다이렉트한다.

이때 쿠키는 기본적으로 서버가 브라우저에 전송하는 것이므로 클라이언트에서 설정하기는 힘들다. 따라서 Next.js의 라우트 핸들러를 이용하자.

라우트 핸들러에서는 새로 바꿀 언어를 쿼리스트링으로 받아서 쿠키에 저장한다. 또 리퍼러 헤더 정보와 새로 바꿀 언어의 정보를 이용해서 리다이렉트 응답을 주도록 하면 된다.

라우트 핸들러와 미들웨어의 동작을 설계해봤으니 첫번째 구현을 해보자.

# 라우트 핸들러 구현

사용자가 언어를 전환할 때 쿠키를 저장하고 리다이렉트하는 라우트 핸들러부터 구현해 보자. 이후 언어 전환에서도 이를 사용할 것이다.

## 필요한 정보를 가져와 보기

먼저 `src/[lang]/api/language/route.ts`로 라우트 핸들러를 만든다. `/api/language?locale=ko`와 같은 URL로 GET 요청을 보내면 앞서 설계한 대로 동작하도록 구현해보자.

설계한 동작의 구현을 위해 필요한 정보는 `locale` 쿼리스트링과 `referer` 헤더 정보이다. 이 정보들을 가공해서 결과를 만드는 걸 구현하기 전에, 이 정보들을 잘 가져올 수 있는지부터 구현해보자. 

[URL Query Parameters](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#url-query-parameters)를 이용해서 `locale` 쿼리스트링을 가져올 수 있다. 그리고 `referer` 헤더 정보는 `headers()` 함수를 이용해서 가져온다.

참고로 여기서 쓰인 [headers](https://nextjs.org/docs/app/api-reference/functions/headers) 함수는 Next.js 15부터 비동기로 바뀌었으므로 `await`을 붙여서 써줘야 한다. 하지만 내 블로그는 아직 Next.js 14를 사용하고 있으므로 그냥 쓰도록 하자.

```typescript
// src/[lang]/api/language/route.ts
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const selectedLocale = searchParams.get('locale') as Locale | undefined;

  // 유효하지 않은 로케일이면 406 Not Acceptable 에러
  if (!selectedLocale || !i18n.locales.includes(selectedLocale)) {
    return NextResponse.json(
      { error: 'Invalid locale' },
      { status: 406 },
    );
  }

  const headersList = headers();
  const referer = headersList.get('referer');

  return new Response(JSON.stringify({ selectedLocale, referer }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
```

이렇게 하고 해당 라우트 핸들러에 요청을 보내면 referer 헤더와 `locale` 쿼리스트링을 가져와서 JSON 형태로 잘 반환한다.

## 리다이렉트할 URL 만들기

이 라우트에서 하고자 하는 건 쿼리스트링으로 전달된 로케일을 쿠키에 저장하고 리다이렉트할 URL을 만드는 것이다. 이를 위해서는 기존의 URL 경로와 로케일을 이용해서 리다이렉트할 URL을 찾는 함수가 필요하다. 이를 위해서 `generateRedirectPath` 함수를 만들어보자.

`/en/posts`와 같은 URL 경로와 변환할 로케일을 받고, 해당 로케일의 동일한 콘텐츠 경로로 리다이렉트할 URL을 반환한다. 경로에 만약 언어가 없다면 추가하고 있다면 교체한다. 이때 기본 로케일의 경우 미들웨어에서 rewrite를 거치므로 언어 정보를 URL에 추가하지 않는다.

```typescript
export const i18n = {
  defaultLocale: 'ko',
  locales: ['ko', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

function generateRedirectPath(pathname: string, selectedLocale: Locale) {
  const pathSegments = pathname.split('/').filter(Boolean); // 경로를 '/'로 나누고 빈 값 제거
  const currentLangIndex = i18n.locales.includes(pathSegments[0] as Locale) ? 0 : -1;

  // 경로에 언어가 없는 경우 추가
  if (currentLangIndex === -1) {
    // 기본 로케일의 경우 언어 정보를 URL에 추가하지 않음
    return selectedLocale === i18n.defaultLocale ? pathname : `/${selectedLocale}${pathname}`;
  }

  pathSegments[currentLangIndex] = selectedLocale === i18n.defaultLocale ? '' : selectedLocale;
  return `/${pathSegments.filter(Boolean).join('/')}`;
}
```

## 라우트 핸들러 구현

라우트 핸들러에 쿼리스트링으로 전달된 로케일 정보와 referer 헤더 정보를 가져올 수 있었다. 그리고 이 정보들을 이용해 리다이렉트할 URL을 만들어주는 함수도 있다. 이들을 이용해서 앞서 설계한 대로 동작하도록 라우트 핸들러를 다음과 같이 작성하였다.

쿠키 설정에도 여러 옵션이 있지만, 언어 설정을 저장하는 건 어떻게 해도 크게 보안에 영향을 주지 않는다. 따라서 `httpOnly`나 `secure` 같은 옵션은 생략했다.

```typescript
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const selectedLocale = searchParams.get('locale') as Locale | undefined;

  // 유효하지 않은 로케일이면 406 Not Acceptable 에러
  if (!selectedLocale || !i18n.locales.includes(selectedLocale)) {
    return NextResponse.json(
      { error: 'Invalid locale' },
      { status: 406 },
    );
  }

  const headersList = headers();
  const refererUrl = new URL(headersList.get('referer') ?? blogConfig.ko.url);
  const { origin, pathname } = refererUrl;

  const newPath = generateRedirectPath(pathname, selectedLocale);
  const redirectUrl = new URL(newPath, origin);

  const response = NextResponse.redirect(redirectUrl);
  // 쿠키에 언어 정보 저장
  response.cookies.set(LOCALE_COOKIE_NAME, selectedLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 1달
    sameSite: 'lax',
  });

  return response;
}
```

## 언어 전환 UI에 사용

그럼 이렇게 만든 라우트 핸들러를 사용하여 언어 전환 UI를 만들 수 있다. 언어를 전환할 때 먼저 `/api/language?locale=바꿀 언어`로 GET 요청을 보내고 그 결과를 이용해서 리다이렉트하면 된다.

이를 그대로 `LanguageSwitcher` 컴포넌트의 `toggleLanguage` 함수에 적용했다.

```tsx
export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const router = useRouter();
  // 언어 교체 함수
  const toggleLanguage = async (newLang: Locale) => {
    if (lang === newLang) return; // 같은 언어일 경우 무시

    try {
      const response = await fetch(`/api/language?locale=${newLang}`);
      if (!response.ok) {
        throw new Error('Language change failed');
      }

      const redirectUrl = response.url;
      router.replace(redirectUrl);
    }
    catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    // UI 코드 생략
  );
}
```

# 사용자의 언어에 맞게 컨텐츠를 보여주는 미들웨어 구현

라우트 핸들러를 통해서 사용자가 언어 전환을 매끄럽게 하고 또 설정했던 언어를 쿠키에 저장할 수 있도록 했다. 그럼 이제 사용자가 내 블로그에 들어왔을 때 가장 사용자에게 적절한 언어로 컨텐츠를 보여줄 수 있도록 미들웨어를 구현해보자. 로직은 앞서 설계한 것과 같이 이렇게 할 것이다.

1. 사용자가 URL에 언어 정보를 명시했을 때는 그 언어로 컨텐츠를 보여준다.
2. 만약 쿠키에 언어 정보가 있다면 그 언어로 컨텐츠를 보여준다.
3. HTTP 요청의 `Accept-Language` 헤더를 이용해서 사용자가 선호하는 언어를 알아내고 그 언어로 컨텐츠를 보여준다.
4. 그렇지 않다면 기본 언어로 컨텐츠를 보여준다.

## 콘텐츠 협상을 통한 언어 결정

이 구현에서 가장 중요한 부분은 HTTP 콘텐츠 협상을 통한 사용자가 선호하는 언어의 결정이다. 이를 위해서는 브라우저가 전달하는 `Accept-Language` 헤더를 이용해야 한다. 그리고 이런 i18n에 관련된 지원을 해주는 라이브러리들은 많이 나와 있다.

Next.js의 [Internationalization 문서](https://nextjs.org/docs/app/building-your-application/routing/internationalization) 그리고 [Internationalized Routing 예시 코드](https://github.com/vercel/next.js/tree/canary/examples/i18n-routing)를 참고하여 라이브러리를 선택했다.

`negotiator`와 `Intl.LocaleMatcher`([현재 stage 1 proposal](https://formatjs.github.io/docs/polyfills/intl-localematcher/))의 폴리필인 `@formatjs/intl-localematcher`를 사용한다. 먼저 패키지를 설치했다.

```bash
pnpm install negotiator @formatjs/intl-localematcher
```

그리고 앞선 설계의 일부를 구현하는 데 필요한 `getUserLocale` 함수를 만들었다. request 객체를 받아서 쿠키에 저장된 언어를 검사하고 그 뒤에 콘텐츠 협상을 통해 사용자가 선호하는 언어를 결정하는 방식이다.

request 객체를 받아서 쿠키에 저장된 언어를 검사하고, 그 뒤에 브라우저가 전달하는 `Accept-Language` 헤더를 이용해서 사용자가 선호하는 언어를 결정하는 로직의 `getUserLocale` 함수를 만들었다.

```typescript
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getUserLocale(request: NextRequest): string {
  // 사용자의 쿠키 검사 -> 쿠키에 사용자가 설정했던 로케일이 있으면 해당 로케일로 결정
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value as Locale | undefined;
  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale;
  }
  // 쿠키에 로케일이 없으면 브라우저의 Accept-Language 헤더를 기반으로 로케일 결정
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const locales: string[] = i18n.locales;

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );
  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}
```

여기서 쓰는 `matchLocale`에서는 사용자가 선호하는 언어 목록과 블로그에서 지원하는 언어 목록, 그리고 기본 언어를 이용해서 사용자가 선호하는 언어를 결정한다.

## 미들웨어 구현

이를 이용해서 미들웨어를 구현하자. 미들웨어에서는 request의 URL이 언어 정보를 포함하고 있는지 검사한다. 그리고 만약 없다면 `getUserLocale` 함수로 결정된 로케일을 이용해서 적절한 언어로 리다이렉트한다.

그런데 `getUserLocale` 함수로 결정된 로케일은 사실 100% 사용자에 의해 결정되었다고 보기는 힘들다. 브라우저의 언어 설정을 기반으로 결정했기 때문이다. 심지어 이런 경우도 생각해 볼 수 있다.

- 사용자가 기존에 브라우저를 영어 설정으로 사용하고 있었기에 이를 쿠키에 저장
- 사용자가 브라우저를 한국어 설정으로 변경
- 그러면 사용자는 블로그의 언어 전환 UI를 이용해서 언어를 전환한 게 아니므로 브라우저의 언어 설정을 따라가야 하지만 쿠키에 저장된 기존 언어(이전의 영어 설정)로 결정

따라서 이 함수로 알아낸 사용자 로케일은 쿠키에 저장하지 않았다. 이러한 모든 사항들을 적용하여 미들웨어를 구현하였다.

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 사용자가 접근한 URL에서 로케일을 찾고 있으면 해당 로케일로 결정
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) {
    // 경로에 이미 로케일이 포함된 경우 추가 작업 없이 통과
    return NextResponse.next();
  }

  const userLocale = getUserLocale(request);

  const newPath = `/${userLocale}${pathname}`;
  const url = request.nextUrl.clone();
  url.pathname = newPath;

  const response = userLocale === i18n.defaultLocale
    ? NextResponse.rewrite(url)
    : NextResponse.redirect(url);

  return response;
}
```

# 최적화를 위한 동작 단순화

이렇게 하고 테스트를 해보았다. 그랬더니 동작은 잘 되었지만 언어 전환 UI를 이용할 때 생기는 지연이 생각보다 길었다. 이는 여러 가지 이유가 있을 수 있지만 가장 핵심적으로는 페이지 전환시 컨텐츠를 불러오는 시간, 그리고 쿠키 설정을 위해 서버에 요청을 날리는 데 걸리는 시간 때문이라고 보았다. 따라서 다음과 같이 동작을 좀 더 단순하게 변경하고 최적화를 하는 것이 좋겠다.

## 개선된 동작 설계

현재 다른 언어 페이지로 가는 동작을 보면 `router.replace`를 이용해서 페이지를 전환하고 있다. 그런데 이렇게 페이지의 언어를 전환하는 게 아주 우선순위가 높고 다른 작업을 블로킹해야 하는가 하면 그건 아니다. 따라서 다음과 같은 동작 변경을 할 수 있겠다.

- 페이지 전환 업데이트를 UI 블록킹 없이 처리
  - `useTransition`을 이용해서 우선순위가 낮은 상태 업데이트로 처리

그리고 페이지 전환 작업을 어차피 클라이언트에서 처리한다. 따라서 `referer` 헤더를 이용해서 리다이렉트할 URL을 만들 필요가 없다. 이를 클라이언트에서 처리하도록 하자.

- 다른 언어의 페이지로 가는 URL을 라우트 핸들러 대신 클라이언트에서 생성하고 리다이렉트

그러면 라우트 핸들러에서는 쿠키 설정만 처리하면 된다.

- 라우트 핸들러에서는 쿠키 설정만 처리

이렇게 단순해진 라우트 핸들러의 동작을 약간 변경하면 다음과 같은 최적화도 적용할 수 있다.

- Next.js 라우트 핸들러의 GET 메서드 캐싱을 사용
- 서버 요청과 쿠키 설정을 독립적으로 처리

구체적인 구현은 각 항목을 차례로 구현하면서 설명하겠다. 하나하나 해보자.

## UI 블로킹 없이 언어 전환

언어 전환 UI의 `toggleLanguage`를 보면 `router.replace`를 이용해서 페이지를 전환하고 있다. 그런데 이렇게 페이지의 언어를 전환하는 게 아주 우선순위가 높고 다른 작업을 블로킹해야 하는가 하면 그건 아니다. 따라서 이를 우선순위가 낮은 상태 업데이트를 처리하는 `useTransition`을 이용해서 최적화해 보자.

[app router에서 나온 `next/navigation`의 `router.push`와 `router.replace`는 내부적으로 `navigate`를 사용하고 이건 react의 `useReducer`를 사용한다.](https://github.com/vercel/next.js/discussions/54157#discussioncomment-6763231) 따라서 상태 업데이트 우선순위 조정에 쓰이는 `useTransition`을 사용하기 적절하다고 보았다.

또한 여기서 제공하는 `isPending` 상태를 이용해서 사용자가 언어를 전환할 때 로딩 상태를 보여줌으로써 사용자에게 언어 전환 중임을 알려줄 수도 있다.

`startTransition`에 페이지를 전환하는 동작을 넣는다. 그리고 버튼의 `disabled` 속성에 `isPending`을 넣어서 사용자가 언어 전환 중일 때 버튼을 비활성화했다.

```tsx
export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 언어 교체
  const toggleLanguage = async (newLang: Locale) => {
    if (lang === newLang || isPending) return; // 같은 언어이거나 이미 언어 전환 중인 경우 무시

    try {
      // 언어 전환에 따른 쿠키 설정
      // redirectUrl 생성 로직

      startTransition(() => {
        router.replace(redirectUrl);
      });
    }
    catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <nav className={styles.container}>
      {i18n.locales.map((locale) => (
        <button
          className={`${styles.button} ${locale === lang ? styles.activeButton : ''}`}
          key={locale}
          onClick={() => { toggleLanguage(locale); }}
          aria-label={content[locale].ariaLabel}
          aria-current={locale === lang ? 'page' : undefined}
          disabled={isPending}
        >
          <span role="img" aria-hidden="true">{content[locale].flag}</span>
          {' '}
          {content[locale].label}
        </button>
      ))}
    </nav>
  );
}
```

## 라우트 핸들러 단순화

기존에는 `/[lang]/api/language` 라우트 핸들러에서 쿠키를 설정하고 리다이렉트하는 작업까지 진행했다. 리다이렉트할 URL을 만들기 위해서 referer 헤더를 이용하기도 했다.

그런데 서버 요청을 하고 난 후에야 리다이렉트가 이뤄지기 때문에 사용자가 언어를 전환할 때 지연이 생긴다. 또한 어차피 페이지 전환은 `router.replace`를 이용해 클라이언트에서 처리하므로 굳이 라우트 핸들러에서 또 처리해 줄 필요가 없어 보인다.

따라서 앞서 설계한 대로 리다이렉트할 URL을 클라이언트에서 생성해서 URL을 변경하고 라우트 핸들러에서는 쿠키 설정만 처리하도록 하자.

그럼 라우트 핸들러에서 하는 동작은 매우 단순해진다. 그럼 캐싱을 이용할 수는 없을까? [Next.js 라우트 핸들러의 `GET` 메서드는 캐싱할 수 있다.](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#caching) `route.ts`에 다음과 같이 `dynamic` 변수를 지정해 주면 페이지가 정적으로 렌더링되고 캐시된다.

```typescript
export const dynamic = 'force-static';
```

이렇게 하면 앞서 사용했던 `headers()` 함수나 쿼리스트링을 가져오는 등 동적으로 처리했던 동작이 불가능해진다. 정적 렌더링되는 라우트에서는 `cookies`, `headers()`, `useSearchParams()` 함수가 빈 값을 리턴하기 때문이다.

물론 우리는 클라이언트에서 리다이렉트를 처리하기로 했으므로 `headers()`를 통해 리퍼러 정보를 가져올 필요는 없다. 하지만 쿼리스트링으로 전달해 주던 로케일은? 이것만 해결하면 우리는 이 언어 전환을 위한 라우트 핸들러를 캐싱할 수 있다.

간단하다. 이 라우트 핸들러 또한 `[lang]` 동적 라우트의 하위에 있으므로 로케일을 쿼리스트링 대신 동적 라우트 세그먼트로 전달하면 된다. 가령 한국어 로케일로 바꾸고자 한다면 `/ko/api/language`로 요청을 보내고 영어 로케일로 바꾸고자 한다면 `/en/api/language`로 요청을 보내면 된다. [라우트 핸들러에서도 동적 라우트 세그먼트를 가져올 수 있다.](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments)

이 결정에 따라 라우트 핸들러를 다음과 같이 변경한다. 요청이 온 URL의 동적 라우트 세그먼트를 이용해서 변경할 로케일을 알아내고, 해당 로케일을 쿠키로 설정하는 응답을 보내는 식이다. 또한 캐싱을 위해 `dynamic` 변수를 지정해 주었다.

```typescript
export const dynamic = 'force-static';

// /[lang]/api/language의 lang 동적 라우트 세그먼트를 통해서 언어 변경
export function GET(request: NextRequest, { params }: {
  params: { lang: Locale },
}) {
  const selectedLocale = params.lang;

  // 유효하지 않은 로케일이면 406 Not Acceptable 에러
  if (!i18n.locales.includes(selectedLocale)) {
    return NextResponse.json(
      { error: 'Invalid locale' },
      { status: 406 },
    );
  }

  const response = NextResponse.json({ locale: selectedLocale });
  response.cookies.set(LOCALE_COOKIE_NAME, selectedLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 1달
    sameSite: 'lax',
  });
  return response;
}
```

거기에 맞게 `languageSwitcher` 컴포넌트를 다음과 같이 변경한다. 변경할 로케일을 쿼리스트링 대신 동적 라우트 세그먼트로 삽입하여 요청을 보내도록 했다. 또한 리다이렉트할 URL도 클라이언트에서 생성하여 페이지 전환을 처리하도록 했다.

```tsx
export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  // 코드 생략
  const toggleLanguage = async (newLang: Locale) => {
    if (lang === newLang || isPending) return; // 같은 언어일 경우 무시
    
    const redirectPath = generateRedirectPath(pathname, newLang);
    try {
      // 변경할 로케일을 동적 라우트 세그먼트로 삽입하여 요청
      const response = await fetch(`/${newLang}/api/language`);
      if (!response.ok) {
        throw new Error('Failed to change language');
      }
      
      startTransition(() => {
        router.replace(redirectPath);
      });
    }
    // ...
  };

  return (
    // UI 코드 생략
  );
}
```

# 서버 요청 최적화

언어 전환 UI를 사용하여 언어를 전환하는 데에 지연이 여전히 길었다. 각 단계의 동작은 단순화되고 언어 전환도 UI 블로킹 없이 일어날 수 있게 되었지만 지연은 여전했다. 이는 근본적으로 쿠키 설정을 위한 서버 요청이 필요하기 때문이다.

## 문제

현재 클라이언트에서는 쿠키를 설정하는 라우트 핸들러에 GET 요청을 보내고 리다이렉트할 URL을 생성해 이동한다. 즉 이런 과정을 거쳐서 새로운 로케일의 페이지가 로딩된다.

1. 사용자가 언어 전환 UI 클릭
2. 클라이언트에서 fetch를 이용해 `/[lang]/api/language`로 GET 요청
3. 라우트 핸들러에서 쿠키 설정 응답을 보냄
4. 쿠키가 새로운 로케일로 설정됨
5. 클라이언트에서 리다이렉트할 URL을 생성하고 클라이언트 사이드 네비게이션
6. 새로운 URL로 이동하면 미들웨어가 작동하여 URL 경로 혹은 쿠키를 이용해 사용자의 언어를 결정

라우트 핸들러를 통해 쿠키가 설정되고 나서야 페이지가 이동하는 걸 볼 수 있다. 이 순서는 코드에서는 `await`을 이용해 강제되었다. 그런데 그렇게 하면 서버 요청 이후에야 페이지가 이동되기 때문에 지연이 발생한다. 이를 어떻게 해결할 수 있을까?

가장 먼저 생각나는 방식은 `fetch`를 통해 라우트 핸들러에서 쿠키를 설정하는 코드에서 `await`을 지우는 것이다. 페이지 전환 시 쿠키를 설정하는 것과 페이지를 이동하는 것을 독립적으로 처리하는 식이다.

```tsx
// 언어 교체
fetch(`/${newLang}/api/language`).catch((error: unknown) => {
  console.error('Failed to change language:', error);
});

startTransition(() => {
  router.replace(redirectPath);
});
```

그런데 이렇게 하면 제대로 페이지 전환이 이루어지지 않는다. 한국어 페이지의 경로는 `/콘텐츠 경로`이고 영어 페이지의 경로는 `/en/콘텐츠 경로`식이기 때문이다. 왜 이게 문제일까? 현재 페이지 전환 동작을 보면 알 수 있다. 그림으로 나타내면 다음과 같다.

![미들웨어와 현재의 페이지 전환 동작](./middleware.png)

한국어 페이지의 경우 미들웨어에서 쿠키를 검사함으로써 한국어 페이지로 이동하게 되는 걸 볼 수 있다. 내가 지금까지 했던 것처럼 한국어 페이지를 보여줄 때 URL에 로케일 정보 없이(그러니까 `/ko/`같은 prefix 없이) 동작하도록 하고 싶다면 페이지 전환 시 쿠키를 먼저 설정하고 페이지를 이동해야 한다.

만약 서버 요청과 페이지 전환이 독립적으로 일어나도록 하면 다음과 같은 상황이 일어날 수 있다.

1. 언어 교체 코드에서 router.replace가 먼저 실행되어 페이지 이동
2. 그런데 현재 한국어 페이지는 미들웨어에서 `rewrite`로 처리하기로 하여 `/`로 시작하기 때문에 URL에 로케일이 없으므로 미들웨어에서 로케일 결정
3. 미들웨어가 실행되어 쿠키에 저장된 로케일 혹은 사용자의 기본 로케일을 가져와서 페이지 이동
4. 이후에 fetch가 완료되어 쿠키에 새로운 로케일을 저장하지만 이미 기존 쿠키의 로케일에 해당하는 페이지로 이동한 상태

일반적으로 클라이언트 사이드 내비게이션이 서버 요청이 돌아오는 것보다 훨씬 빠르기 때문에 앞서 생각했던 것처럼 `fetch`의 `await`을 그냥 지울 경우 이런 상황이 거의 대부분 발생했다.

이를 그림으로 나타내면 다음과 같다.

![미들웨어 문제의 동작](./middleware-problem.png)

즉 사용자가 로케일 정보가 없는 `/`로 접속했을 때 다음 2가지 경우가 있는 게 문제다.

- 사용자가 한국어 컨텐츠를 보고 있는 경우
- 사용자가 그냥 `/`로 처음 접속했기 때문에 콘텐츠 협상으로 로케일을 알아내야 하는 경우

그래서 기존에는 사용자가 한국어 컨텐츠를 의도적으로 볼 경우 쿠키에 로케일을 저장하도록 하여 이 두 가지를 구분했다. 그러나 쿠키를 저장하고 나서야 `/`로 전환할 수 있는 문제가 있고 이는 페이지 전환 시 서버에 요청해야 하여 지연을 유발한다. 이걸 고칠 수 있을까?

## 해결

사실 아주 간단하다. 한국어 페이지를 보여줄 경우 `/ko`를 붙이도록 하면 된다. 그러면 미들웨어에서는 URL의 로케일 경로를 우선적으로 처리하도록 코드를 작성하였으므로 리다이렉트된 URL의 로케일을 따르게 된다. 또한 사용자가 로케일 정보 없이 접근했을 때는 콘텐츠 협상을 통해 `/ko`나 `/en`로 리다이렉트되므로 괜찮다. 기존 링크들도 잘 작동할 것이다.

미들웨어의 코드만 살짝 이렇게 변경해 주면 된다. 함수의 맨 마지막 부분에서 경우에 따라 `rewrite`로 처리하는 부분을 일괄적으로 `redirect`로 변경하였다.

```typescript 
// src/middleware.ts

// getUserLocale 함수 생략

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 사용자가 접근한 URL에서 로케일을 갖고 있으면 해당 로케일로 결정
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) {
    // 경로에 이미 로케일이 포함된 경우 추가 작업 없이 통과
    return NextResponse.next();
  }

  const userLocale = getUserLocale(request);

  const newPath = `/${userLocale}${pathname}`;
  const url = request.nextUrl.clone();
  url.pathname = newPath;

  // 일괄적으로 redirect로 변경
  return NextResponse.redirect(url);
}
```

# SEO

이렇게 다양한 언어의 페이지를 검색 엔진에 알리기 위한 SEO에 대해서도 고려해야 한다. 이에 대해서는, 구글 검색 엔진이 SEO의 전부는 아니지만 [Google에 페이지의 현지화된 버전 알리기](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko)를 참고할 수 있다.

해당 문서에서는 페이지의 현지화 버전을 검색 엔진에 알리기 위해 다음과 같은 방법을 제시한다.

- HTML 태그
- HTTP 헤더
- 사이트맵

이중 Next.js에서 쉽게 사용할 수 있는 건 HTML 태그와 사이트맵을 이용하는 방식이다. 그런데 세 방법은 구글의 관점에서는 동일하다고 하고, 또한 사이트맵을 통해 페이지의 현지화 버전을 알리는 것은 14.2.0 버전부터 지원한다. 따라서 이 글에서는 HTML 태그를 이용하는 방식과 사이트맵을 이용하는 방식을 둘 다 소개하겠지만 블로그에서는 HTML 태그를 이용하는 방식만을 사용하였다.

## HTML 태그

Next.js에서는 메타데이터 객체 혹은 `generateMetadata` 함수를 이용하여 페이지의 메타데이터를 생성할 수 있다. 그리고 이 메타데이터 객체의 `alternates` 속성을 이용하여 페이지의 현지화 버전을 알릴 수 있다.

나는 여러 페이지의 메타데이터를 만들어야 했기 때문에 반복되는 부분이 많아서 언어별로 메타데이터를 만드는 함수를 만들어 놓았다. 그 함수에서 생성하는 메타데이터를 이렇게 설정한다.

- `canonical` 속성에는 페이지의 대표 URL을 설정
- `alternates.languages` 속성에 다음과 같이 페이지의 각 언어별 URL을 설정

이러한 태그들은 "현재 페이지는 이러한 URL이고, 같은 콘텐츠를 담은 다른 언어의 페이지는 이러한 URL이다"라는 의미를 검색 엔진에 전달할 것이다.

```tsx
export const generateBlogLocalMetadata = (config: BlogConfigType, locale: Locale): Metadata => {
  return {
    metadataBase: new URL(config[locale].baseUrl),
    title: config[locale].title,
    description: config[locale].description,
    alternates: {
      // 대표 URL은 언어의 기본 URL로 설정
      canonical: config[locale].url,
      languages: {
        'x-default': config[locale].baseUrl,
        'ko': config.ko.url,
        'en': config.en.url,
      },
    },
    // 생략...
  };
};
```

`x-default` 속성은 페이지의 기본 URL을 나타낸다. 따라서 언어에 따라 리디렉션되기 전의 기본 페이지를 나타내는 `baseUrl`을 설정하였다.

> 특히 언어/국가 선택기 또는 자동으로 리디렉션되는 홈페이지의 경우 다른 페이지와 연결되지 않은 언어를 위한 대체 페이지를 추가하는 것이 좋습니다. x-default 값을 사용합니다.
>
> [Google에 페이지의 현지화된 버전 알리기](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko)

그리고 이러한 현지화 페이지들을 알리는 태그는 페이지들이 서로를 가리키고 있지 않으면 무시된다. 다른 사이트에서 악의적으로 해당 페이지를 alternates 버전으로 지정하여 임의로 페이지를 만드는 걸 방지하기 위함이라고 한다.

따라서 각 언어의 페이지들이 모두 서로를 가리키도록 하기 위해서 `langSwitch` 컴포넌트를 `useRouter` 기반에서 링크 기반으로 변경하였다.

## 사이트맵

Next.js에서는 `sitemap.ts`를 통해서 사이트맵을 동적으로 생성하는 기능을 제공한다. 사이트맵 추가에 대한 더 자세한 정보는 [블로그 고치기 - Next.js 페이지에 사이트맵 추가하기](https://witch.work/posts/blog-nextjs-sitemap-generation)를 참고할 수 있다.

사이트맵 생성 함수에서도 `alternates.languages` 속성을 이용하여 페이지의 현지화 버전을 알릴 수 있다. 공식 문서의 예시는 다음과 같다.

```tsx
import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es',
          de: 'https://acme.com/de',
        },
      },
    },
    // 같은 형식의 객체들 생략
  ]
}
```

따라서 다음과 같은 형식으로 `sitemap.ts`를 작성할 수 있다. `sitemapFromPosts`의 코드만 적었지만 다른 사이트맵 생성 코드도 같은 형식으로 작성하였다. 각 글의 url을 이용해서 각 언어의 대표 URL을 만들고 `alternates.languages` 속성에 설정한 걸 볼 수 있다.

```tsx
export default function sitemap(): MetadataRoute.Sitemap {
  // 다른 사이트맵 생성 코드 생략

  const sitemapFromPosts: MetadataRoute.Sitemap = postMetadata.map((post) => {
    return {
      url: blogConfig.baseUrl + post.url,
      lastModified: new Date(post.date),
      changeFrequency: 'daily',
      priority: 0.7,
      alternates: {
        languages: {
          ko: blogConfig.baseUrl + '/ko' + post.url,
          en: blogConfig.baseUrl + '/en' + post.url,
        },
      },
    };
  });

  return [
    ...defaultSiteMap,
    ...sitemapFromPosts,
    ...sitemapFromTranslations,
  ];
}
```

다만 이런 현지화를 사이트맵에서 지원하는 건 Next.js 14.2.0 버전부터 지원한다. 내 블로그는 14.1.3 버전을 사용하고 있어서 이 기능을 사용할 수 없었다. 따라서 나는 HTML 태그 방식만 사용하였지만, 블로그 Next.js 버전을 업데이트할 예정이기도 해서 사이트맵을 이용한 방식도 소개하였다.

# 참고

MDN, "Accept-Language"

https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Accept-Language

Next.js docs, "Internationalization"

https://nextjs.org/docs/app/building-your-application/routing/internationalization

Next.js docs, "Route Handlers"

https://nextjs.org/docs/app/building-your-application/routing/route-handlers

Next.js Issue #54157 "Understanding startTransition() with NextJS Router"

https://github.com/vercel/next.js/discussions/54157

React docs, "useTransition"

https://react.dev/reference/react/useTransition

Google에 페이지의 현지화된 버전 알리기

https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko

캐노니컬 태그 (Canonical tag)로 검색엔진 최적화하기

https://growthacking.kr/%EC%BA%90%EB%85%B8%EB%8B%88%EC%BB%AC-%ED%83%9C%EA%B7%B8-canonical-tag%EB%A1%9C-%EA%B2%80%EC%83%89%EC%97%94%EC%A7%84-%EC%B5%9C%EC%A0%81%ED%99%94%ED%95%98%EA%B8%B0/

Next.js docs, "generateMetadata"

https://nextjs.org/docs/app/api-reference/functions/generate-metadata

Next.js docs, "sitemap.xml"

https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

Use canonical and alternate URL correctly?

https://webmasters.stackexchange.com/questions/120947/use-canonical-and-alternate-url-correctly

Can setting canonical to another region subdirectory impact local seo?

https://support.google.com/webmasters/thread/130615008/can-setting-canonical-to-another-region-subdirectory-impact-local-seo?hl=en

Cookie path 설정

https://velog.io/@onerain130/Cookie-path-%EC%84%A4%EC%A0%95
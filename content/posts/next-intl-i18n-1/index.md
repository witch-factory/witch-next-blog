---
title: 국제화 제대로 학습해보기 - 1. next-intl 기본
date: "2026-08-31T00:00:00Z"
description: "Next.js에서 next-intl을 사용해 국제화 환경을 구성하고, 번역 메시지를 다루는 기본적인 방법들을 정리"
tags: ["front", "tip"]
---

# 시작

지금까지 몇몇 회사와 프로젝트에서 국제화(i18n)를 다루었다. 이 블로그도 영어로 대부분의 기능을 이용할 수 있도록 되어 있다. 이런 작업들을 하며 자연스럽게 [HTTP 콘텐츠 협상](https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Content_negotiation), [`Intl` 객체](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl)와 같이 국제화에 관련된 몇몇 지식들을 얻었다.

하지만 내가 실제로 수행했던 작업은 기존에 잘 만들어진 환경에서 번역된 메시지를 JSON 파일에 추가하고 사용하는 정도였다. 관련된 버그도 꾸준히 발견되었지만 우선순위가 그렇게 높지 않아 계속 미뤄졌고 제대로 작업할 기회가 없었다. 이해할 만한 우선순위 조정이었지만 뭔가 피상적으로 하고 있다는 느낌은 지울 수 없었다. 언젠가는 좀더 깊이 알고 싶었다.

그래서 우선 내가 주로 사용했던 next-intl 라이브러리의 기능들부터 시작해서 국제화에 대해 좀 더 알아보기로 했다. 이러한 API 하나하나가 중요하다기보다는 기능들을 공부하다 보면 국제화 자체에 대해서도 무엇을 하는 것인지 더 잘 알 수 있으리라 기대한다.

먼저 첫 글에서는 본격적인 국제화 관련 지식보다는 `next-intl` 라이브러리의 기본적인 사용에 초점을 맞췄다. 이후에 좀 더 많은 편의 기능들이나 실제로 국제화를 할 때 고려해야 할 더 많은 사항들에 대해서는 다음 글들에서 다루어 보려고 한다.

다만 이건 어디까지나 실무를 하는 개발자의 관점에서 탐구한 것이므로 단수/복수, 성별명사, 문화적 차이, 어순 등 국제화 그 자체에 대한 지식이 필요한 사람들은 [w3c의 국제화 가이드](https://www.w3.org/International/i18n-drafts/nav/learn)나 [ICU 메시지 포맷 문서](https://unicode-org.github.io/icu/userguide/format_parse/messages/) 등을 참고하는 게 좋겠다.

# 기본적인 설정

`next-intl`의 가장 기본적인 설정부터 해보고 기록한다. 라이브러리 설치는 되어 있다고 가정한다.

## 폴더 구조

간단하게 한국어, 영어만 지원하는 예제를 만들어보았다. next.js 프로젝트로 만들었고 구조는 다음과 같다. 실질적으로 관련 없는 부분은 생략하였다.

```
app
- page.tsx
i18n
- request.ts
messages
- ko.json
- en.json
next.config.ts
...
```

## 언어별 메시지 관리

서비스를 여러 언어와 문화에 맞게 보여주는 국제화를 위해서는 여러 가지가 필요하지만 가장 우선적이고 모두에게 익숙한 건 언어별로 다르게 보여줄 메시지들이다. 한국어 환경일 때 "취소", 영어 환경일 때 "cancel"을 보여주도록 할 거라면 이걸 어딘가에 설정해 놓아야 하는 것이다. 이걸 관리하는 방법은 여러 가지 있지만 일반적으로 각 메시지를 관리하는 파일을 둔다.

여기서는 `messages` 폴더에서 JSON 형태로 관리하도록 하자. `messages` 폴더에 `ko.json`과 `en.json`을 만든다. 설정 파일 경로는 따로 설정 가능하므로 다른 폴더명도 상관없다. 아무튼 이렇게 만들었으니, 다른 언어를 추가할 때면 해당 언어의 json 파일(`zh.json`이라거나)을 만들어서 메시지를 추가하면 된다.

예시를 위해 다음과 같이 작성했다.

```json
// messages/ko.json
{
  "home": {
    "title": "안녕하세요. 마녀입니다."
  }
}
// messages/en.json
{
  "home": {
    "title": "Hello. I'm witch."
  }
}
```

## 번역 사용을 위한 설정

메시지들을 잘 만들었다고 하자. 그럼 사용자가 접속했을 때 어떤 언어로 내용을 보여줄지에 대해 결정하는 과정이 필요하다.

사용자 언어 감지에 관해서도 여러 가지 방식이 있지만 여기서는 방법의 선택이 초점이 아니므로 일반적인 설정 중 하나로 진행했다. 사용자가 설정한 쿠키 > `accept-language` 헤더 > 기본값 순서로 우선순위를 갖도록 한 것이다.

먼저 `i18n/request.ts` 파일을 만든다. 서버 컴포넌트에서 언어를 감지해서 해당 언어의 메시지 파일을 불러오고 설정 객체를 만드는 역할을 하는 파일이다.[^1] 코드를 읽어 보면 앞서 설명한 우선순위에 따라 로케일(`locale` 변수)을 정하고 해당하는 파일을 불러와 `messages` 속성에 담는 걸 볼 수 있다.

```ts
// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // 사용자가 명시적으로 고른 값(쿠키) > 브라우저 언어(추측) > 기본값
  const cookieLocale = cookieStore.get("locale")?.value;
  const acceptLanguage = headerStore.get("accept-language") ?? "";
  const locale =
    cookieLocale ?? (acceptLanguage.startsWith("ko") ? "ko" : "en");

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

다음으로는 `next.config.ts` 에서 `i18n/request.ts`을 next-intl이랑 실제로 연결해 주는 플러그인을 설정한다. 참고로 위의 `request.ts` 내용을 다른 경로에 두고 싶다면 `createNextIntlPlugin`의 인자로 해당 경로를 넘기면 된다.

```ts
// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
```

root layout도 `NextIntlClientProvider`로 감싸준다. 이렇게 하면 `request.ts`에서 했던 `locale`과 `messages`등의 설정이 그대로 `NextIntlClientProvider`를 통해 클라이언트 컴포넌트에서도 쓸 수 있게 된다. 물론 클라이언트 컴포넌트에 대해 따로 언어별 메시지를 설정할 수도 있다.

```tsx
// app/layout.tsx
export default async function RootLayout(/* ... */) {
  // ...

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

여기까지 마치면 `useTranslations` 훅을 사용해서 번역된 메시지를 사용할 수 있다. 나는 `home.title`처럼 전체 key로 메시지를 불러왔다. 하지만 `useTranslations("home")`처럼 적당한 scope로 묶어서 불러올 수도 있다. 그럴 경우 `t("title")`처럼 해당 scope 기준으로 메시지를 불러오게 된다.

```tsx
// app/page.tsx
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
        {t("home.title")}
      </h1>
    </div>
  );
}
```

비동기 서버 컴포넌트에서는 훅을 사용할 수 없다. 따라서 `useTranslations` 훅 대신 `getTranslations` 함수를 사용한다. metadata 등 훅을 통해 메시지를 사용할 수 없는 위치에서도 `getTranslations`을 사용한다.

# next-intl 기능

언어별로 고려해야 하는 사항들은 기회가 되면 다음 글에서 언젠가 다루도록 하고, 현실적으로 i18n 전문가가 아닌 개발자(나)가 빠르게 구현할 때 필요해질 만한 기능들을 우선 정리했다.

## 메시지 관련 기능

기본적으로는 `t(key)` 형식으로 사용할 수 있는데 다른 형태로 메시지를 보여줄 수 있는 기능들도 있다. 링크를 메시지에 포함시켜야 하는 경우 등에 사용할 수 있다.

- 치환

`{}`로 감싸서 메시지 안에 변수를 넣을 수 있다.

```json
{
  "items": "{count} items"
}
```

사용할 때는 이렇게 한다.

```tsx
t("items", { count: 5 });
```

그런데 메시지 내에 중괄호로 감싼 문자열을 그대로 쓰고 싶을 수 있다. 그러면 그대로 출력하고 싶은 문자열을 작은따옴표로 감싸면 escape된다.

```json
{
  "example": "이름을 '{name}' 칸에 입력해주세요."
}
```

- rich text

메시지에 커스텀 태그를 사용하고 `t.rich`로 해당 태그를 실제 컴포넌트로 매핑할 수 있다. 예를 들어 문장 내에 특정 페이지로 가는 링크가 필요하다면 다음처럼 쓸 수 있다.

```json
{
  "home": {
    "link": "예시 페이지는 <example>예시 페이지 링크</example>를 통해 연결됩니다."
  }
}
```

위처럼 메시지를 작성한 후 다음과 같이 사용한다. 입력한 커스텀 태그가 어떻게 치환될지 지정할 수 있다. 여기서는 하지 않았지만 컴포넌트 중첩(nesting)도 가능하고 `a` 같은 기본 HTML 태그뿐 아니라 React 컴포넌트도 매핑할 수 있다.

```tsx
{
  t.rich("home.link", {
    example: (chunks) => (
      <a href="/example" className="text-blue-500 underline">
        {chunks}
      </a>
    ),
  });
}
```

`<br />`과 같이 self-closing으로 쓰이는 태그도 쓸 수 있다. 하지만 ICU 파서가 닫는 태그를 요구하기 때문에 다음과 같이 작성한다. 메시지에는 `<br></br>`처럼 작성하고 `t.rich`에서 `br: <br />`처럼 매핑해주는 식이다.

```json
// en.json
"message": "Hello,<br></br>how are you?"
```

```tsx
// 사용처
t.rich("message", {
  br: () => <br />,
});
```

`t.rich`는 React 노드 형태의 결과물을 반환한다. 반면 단순 문자열 형태의 raw HTML 마크업이 필요할 수도 있다. 이 경우 마크업 형태의 문자열만 만들어서 반환하는 `t.markup`을 사용할 수 있다.

보통은 `t.rich`를 사용하는 게 맞고 `t.markup`는 raw HTML이 필요한 특수한 경우에만 사용하는 게 좋다. 또한 `t.markup`을 사용할 때는 XSS 공격에 취약할 수 있기 때문에 사용자 입력에 기반한 값을 쓰지 말고, sanitize를 거치는 등의 조치가 필요하다.

- raw message

next-intl은 기본적으로 메시지를 1번 파싱한다. 앞서 설명한 치환이나 HTML 태그 사용 등을 위해서이다. 그러나 이런 해석 과정 없이 그대로 메시지를 사용해야 할 경우가 있다. 예를 들어 `"link": "예시 raw HTML <h1>링크</h1>"` 같은 메시지처럼 raw HTML 형태가 그대로 필요할 경우를 들 수 있겠다.

이런 경우 메시지를 해석 없이 그대로 전달하는 `t.raw`를 사용할 수 있다.

이런 경우 메시지를 해석하지 않고 그대로 전달하는 `t.raw`를 사용한다. 하지만 최근 next-intl에서 시도하고 있는 개선들과 방향이 맞지 않는 지점들이 있기에 공식에서는 다른 API를 사용하길 권장하고 있다.

- key 체크

`t.has(key)`로 해당 key가 존재하는지 체크할 수 있다. 언어마다 메시지 구성이 달라서 특정 메시지가 존재하는지 체크해야 하는 등의 경우에 사용한다.

## 포매팅

국제화를 하다 보면 메시지뿐 아니라 언어에 따라 다른 여러 표기 등도 신경써야 한다. 대표적으로 날짜가 있다. 예를 들어 우리나라는 보통 `YYYY/MM/DD` 형식이지만 미국에서는 `MM/DD/YYYY`로 쓴다.

따라서 JS에서도 이러한 `Intl` 객체를 통해 언어별로 다른 표기를 쉽게 지원할 수 있게 해준다. 그러나 `Intl.*`의 함수들을 그대로 쓰면 로케일을 매번 인자로 넘겨줘야 하고 반복되는 설정을 관리하기도 어렵다.

next-intl에서는 이를 해결하기 위해 `useFormatter`를 통해 현재 next-intl의 로케일에 자동으로 매핑하는 일종의 포매터를 제공한다. 다음과 같이 만든 `format` 객체를 통해 주로 사용한다.

사용 경험을 보면, 전반적으로 `Intl`에서 제공하는 API들을 좀 더 쉽게 관리할 수 있도록 해주는 래퍼 느낌이 강했다. 현재 로케일에 자동으로 맞춰 주고, `request.ts`나 Provider 인자 등을 통해 전역 설정을 할 수 있어서 반복되는 포맷을 쉽게 관리할 수 있는 등 대단한 편의기능은 아니지만 잘 쓰면 일관성 유지가 좀 더 편했다.

```ts
const format = useFormatter();
```

- 숫자

`format.number`를 이용한다. JS의 `Intl.NumberFormat` API에 기반한 옵션을 제공

```ts
const num = format.number(123456.789, { style: "currency", currency: "USD" });
```

- 날짜

날짜는 좀더 여러가지 API가 존재한다. 예를 들어 특정 기간을 나타낼 때 우리나라에서는 물결표(`~`)를 주로 사용하지만 하이픈(`-`)을 사용하는 나라도 상당하다.

그리고 이때 api에 넘기는 문자열 형태의 날짜들은 ISO 8601 형식에 맞추는 게 좋다. next-intl은 따로 날짜 파싱을 담당하지 않으므로 되도록 `Date`로 변환한 뒤 포매팅하자.

```ts
// 가장 단순한 날짜 포매팅
// JS `Intl.DateTimeFormat` API에 기반한 옵션 제공
const formattedDate = format.dateTime(dateTime, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// 상대적인 시간. 1번째 인자가 2번째 인자에 비해 상대적으로 어떤지. e.g. '5년 전'
const relativeDate = format.relativeTime(date2020, dateTime);

// 날짜 범위를 나타냄
const range = format.dateTimeRange(dateTimeA, dateTimeB, {
  year: "numeric",
  month: "long",
  day: "numeric",
});
```

현재 시간을 반환하는 `useNow` 훅도 제공하는데, `new Date()`를 사용하는 것에 비해 주기적인 업데이트(`updateInterval` 인자로 커스텀 가능)와 글로벌 설정 등이 가능하다.

- 목록, 식별자명

`format.list`가 언어별로 다른 목록 포맷을 제공한다. `Intl.ListFormat`과 같은 형식이다.

`format.displayName`은 특정 식별자를 언어별로 맞는 표현으로 바꿔준다. 예를 들어 "US"는 우리나라에서는 미국으로 읽지만 다른 언어로는 또 다르게 표현될 것이다. `Intl.DisplayNames`과 같은 기능이다.

이 두 기능은 내가 제대로 사용해 본 적은 없기에 제대로 이해하고 사용례를 들기가 어렵다.

- 전역 설정

앞의 예시처럼 포매팅할 때마다 어떻게 포매팅할지 직접 지정할 수도 있지만 자주 쓰는 포맷이라면 반복이 생긴다. 예를 들어 서비스 전반에서 통화는 소수점 2자리까지만 표기한다든지 하는 것들을 매번 반복하게 된다. 개발자들이 아주 싫어하는 짓이다. 당연히 next-intl에서는 이런 반복되는 포맷에 이름을 붙여 전역으로 설정해 놓을 수 있다. `request.ts` 혹은 `NextIntlClientProvider`의 `formats` 속성에서 정의할 수 있다.

```tsx
// i18n/request.ts
export const formats = {
  dateTime: {
    example: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
};

export default getRequestConfig(async () => {
  // 내용 생략

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    formats,
  };
});
```

서버 컴포넌트에 대해서는 위처럼 하고, `NextIntlClientProvider`에서 설정할 경우 `formats` props에 위에서 정의한 것과 같은 `formats` 객체를 그대로 넘기면 된다. 일반적으로는 `NextIntlClientProvider`가 `request.ts`의 전역 포맷 설정을 자동으로 상속하므로 굳이 따로 정의할 필요는 없다.

위처럼 정의하면 이렇게 사용자 정의 포매팅을 쓸 수 있다.

```ts
const formattedDateTimeA = format.dateTime(dateTimeA, "example");
```

또 이렇게 정의한 포매팅에 타입을 이용해, 오타로 인한 버그 등을 방지할 수 있다. 프로젝트 루트에 `global.ts`와 같이 타입 정의 파일을 생성한다.

```ts
// global.ts
import { formats } from "@/i18n/request";

declare module "next-intl" {
  interface AppConfig {
    // ...
    Formats: typeof formats;
  }
}
```

그리고 `request.ts`에서 정의한 `formats` 객체에 `satiefies Formats`를 붙여주면 된다. `formats` 객체를 export 한 상태여야 동작함에 주의한다.

```ts
// request.ts의 formats 객체
export const formats = {
  dateTime: {
    example: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
} satisfies Formats;
```

이제 `format.dateTime`과 같은 날짜 포매팅 API에 존재하지 않는 포맷 이름을 사용하면 타입 에러가 발생한다.

# 마무리

이번 글에서는 next-intl의 가장 기본적인 설정과 메시지, 포매팅 관련 기능을 살펴봤다. 원래는 JSON 파일과 `t()`를 이용한 사용밖에 몰랐는데 새로운 기능 습득과 함께 국제화를 더 잘 처리하기 위한 지식의 단서도 많이 잡을 수 있었다.

그러니 다음 글에서는 next-intl의 추가적인 편의 기능과 국제화 시 몇몇 선택 사항들, 또 실제로 국제화를 적용할 때 마주쳤던 문제들을 몇 가지 알아본다. 당시에는 알지 못했지만 이제 알게 된 해결책들(부분적이다)도 추가적으로 적어볼 예정이다.

# 참고

Next.js App Router internationalization https://next-intl.dev/docs/getting-started/app-router

next-intl Blog, useExtracted: The Tailwind of i18n? https://next-intl.dev/blog/use-extracted

[^1]: 정확히 말하면 `request.ts`는 서버 컴포넌트에서의 국제화 요청 담당이고 클라이언트 컴포넌트의 경우 `NextIntlClientProvider`가 담당한다. 하지만 `request.ts`에서 설정한 내용이 `NextIntlClientProvider`로도 대부분 전달되기 때문에 일단 서버에서 해보자. 경험상 실제로는 Next.js의 서버 컴포넌트로만은 불충분할 때가 많아서 `NextIntlClientProvider`에서의 설정도 진행해야 하기는 했다.

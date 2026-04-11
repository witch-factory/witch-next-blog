---
title: Displaying Content According to User's Language in Next.js Blog
date: "2025-01-27T00:00:00Z"
description: "Let's explore how to display blog content in different languages based on the user's language settings using Next.js features."
tags: ["blog", "web"]
---

In the [previous article](https://witch.work/posts/blog-auto-translation), I created a blog that can be viewed in English through AI translation. [Additionally, by using middleware's `rewrite`](https://witch.work/posts/blog-auto-translation#22-%EA%B8%B0%EB%B3%B8-%EB%9D%BC%EC%9A%B0%ED%8A%B8%EB%A5%BC-%ED%95%9C%EA%B5%AD%EC%96%B4%EB%A1%9C-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0), I ensured that accessing a URL without language information would show the Korean page.

However, it would be beneficial to display the appropriate language content based on the language set by the user accessing the blog. In this article, we will implement this feature.

The creation of the English-translated content and its proper display in the blog has been addressed in the previous article, so we will not cover that here. While it might be possible to describe only the completed implementation from the start, I will also discuss the compromises, decisions, and design changes that occurred during the development process.

# Requirements and Design

Let’s clarify what requirements are necessary to show content in the appropriate language to users. We will also design how to implement these requirements specifically.

## Requirements Overview

The most fundamental requirement is:

- Display content in the appropriate language based on the user’s language settings.

However, this requirement alone is too vague and has limitations. We can only see the language configured in the user's browser (`Accept-Language` header), but we cannot know which language the user is actually proficient in or prefers.

A user may have configured their browser in English but prefers Korean, or they might use a browser with Korean set while traveling without any specific preference. Thus, a feature allowing users to select their language directly is also needed.

- Prioritize the language selected by the user. This selection should be remembered by the client.

Users can select their preference through various means. Some may access URLs like `/en` or `/ko` via links, while others might choose their language using a language-switching UI. We need to implement support for all these scenarios.

## Implementation Design

Now, let's consider how to implement this. What should happen when users access the page?

Let's specify the requirements. When a user selects a language through the language selection UI, this choice should be remembered via cookies. The following actions will be implemented in middleware, in order of priority:

1. If the user specifies language information in the URL, display the content in that language.
2. If language information exists in the cookies, display content in that language.
3. Use the `Accept-Language` header in the HTTP request to identify the user’s preferred language and display content in that language.
4. If none of these conditions apply, display content in the default language.

What should the language switch UI do when the user changes the language? The steps are as follows:

1. Save the new language information in the cookies.
2. Redirect to a URL containing the new language information.

Since cookies are generally set by the server in the browser, it's challenging to establish them from the client side. Thus, we will use Next.js route handlers.

The route handler will accept the new language as a query string and store it in cookies. It will also respond with a redirect based on the `Referer` header and the newly set language information.

Now that we have outlined the operations of the route handler and middleware, let's proceed with the first implementation.

# Route Handler Implementation

Let's start by implementing the route handler that saves cookies and redirects when the user changes the language. This will also be used for language switching.

## Fetch Necessary Information

First, create the route handler at `src/[lang]/api/language/route.ts`. The GET request to `/api/language?locale=ko` should operate as planned.

To implement the designed functions, we need the `locale` query string and the `referer` header. First, let's ensure we can fetch these values properly.

We can use [URL Query Parameters](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#url-query-parameters) to obtain the `locale` query string. The `referer` header can be accessed using the `headers()` function.

Note that the `headers()` function has become asynchronous starting from Next.js 15, so we need to use `await`. However, since my blog is still using Next.js 14, we will use it synchronously.

```typescript
// src/[lang]/api/language/route.ts
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const selectedLocale = searchParams.get('locale') as Locale | undefined;

  // Return 406 Not Acceptable error for invalid locales
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

With this implementation, sending a request to the respective route handler successfully retrieves both the `referer` header and the `locale` query string in JSON format.

## Create the Redirect URL

What we want to achieve in this route is to store the locale provided through the query string in the cookies and create a redirect URL. To facilitate this, we need a function that uses the existing URL path and the locale to find the redirect URL. Let's create a `generateRedirectPath` function.

This function will receive a URL path like `/en/posts` and a locale to redirect to, returning the URL for the same content in that locale. If the path does not contain a language, it adds one; if it does, it replaces it. The default locale will be handled in the middleware, so we won't add language information to the URL for it.

```typescript
export const i18n = {
  defaultLocale: 'ko',
  locales: ['ko', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

function generateRedirectPath(pathname: string, selectedLocale: Locale) {
  const pathSegments = pathname.split('/').filter(Boolean); // Split path by '/' and remove empty segments
  const currentLangIndex = i18n.locales.includes(pathSegments[0] as Locale) ? 0 : -1;

  // If there is no language in the path, add it
  if (currentLangIndex === -1) {
    // Do not add language information in case of the default locale
    return selectedLocale === i18n.defaultLocale ? pathname : `/${selectedLocale}${pathname}`;
  }

  pathSegments[currentLangIndex] = selectedLocale === i18n.defaultLocale ? '' : selectedLocale;
  return `/${pathSegments.filter(Boolean).join('/')}`;
}
```

## Route Handler Implementation

Now that we can retrieve the locale information from the query string and the referer header, we can write the route handler to operate according to the previously designed plan. 

There are various cookie settings available, but saving the language setting does not significantly affect security, so the `httpOnly` and `secure` options can be omitted.

```typescript
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const selectedLocale = searchParams.get('locale') as Locale | undefined;

  // Return 406 Not Acceptable error for invalid locales
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
  // Save language information in the cookies
  response.cookies.set(LOCALE_COOKIE_NAME, selectedLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 1 month
    sameSite: 'lax',
  });

  return response;
}
```

## Use in Language Switch UI

Now that we have implemented the route handler, we can create the language switch UI. When the user changes the language, we will first send a GET request to `/api/language?locale=desired_language` and redirect based on the response.

This logic has been directly applied to the `toggleLanguage` function in the `LanguageSwitcher` component.

```tsx
export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const router = useRouter();
  // Language switch function
  const toggleLanguage = async (newLang: Locale) => {
    if (lang === newLang) return; // Ignore if it's the same language

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
    // UI code omitted
  );
}
```

# Implementing Middleware to Show Content According to User's Language

The route handler allows users to switch languages seamlessly and saves the chosen language in cookies. Now, we will implement middleware to show the content in the most appropriate language when users enter my blog. The logic will follow the previously designed flow:

1. If the user specifies language information in the URL, display the content in that language.
2. If language information exists in the cookies, display content in that language.
3. Use the `Accept-Language` header in the HTTP request to identify the user’s preferred language and display content in that language.
4. If none of these conditions apply, display content in the default language.

## Language Decision via Content Negotiation

The most critical part of this implementation is determining the user's preferred language through HTTP content negotiation. We will use the `Accept-Language` header provided by the browser. Many libraries support i18n functionalities.

I chose a library based on Next.js’s [Internationalization documentation](https://nextjs.org/docs/app/building-your-application/routing/internationalization) and the [Internationalized Routing example code](https://github.com/vercel/next.js/tree/canary/examples/i18n-routing).

We will use `negotiator` and the polyfill for `Intl.LocaleMatcher` ([current stage 1 proposal](https://formatjs.github.io/docs/polyfills/intl-localematcher/)), specifically the `@formatjs/intl-localematcher` package. First, we need to install the package.

```bash
pnpm install negotiator @formatjs/intl-localematcher
```

Next, let's create a `getUserLocale` function, which inspects the request object for the cookie stored language and then deduces the user's preferred language through content negotiation.

This function checks if a locale is stored in cookies and, if not, determines the locale based on the `Accept-Language` header sent by the browser.

```typescript
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getUserLocale(request: NextRequest): string {
  // Check user's cookies -> If a locale is stored in cookies, decide based on that
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value as Locale | undefined;
  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale;
  }
  // If there is no locale in cookies, decide based on the browser's Accept-Language header
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

The `matchLocale` function determines the user's preferred language using the list of preferred languages and the list of supported languages in the blog, as well as the default language.

## Middleware Implementation

With this, we can proceed to implement the middleware. The middleware will inspect whether the request’s URL contains language information. If not, it will redirect using the locale determined by the `getUserLocale` function.

However, the locale determined by the `getUserLocale` function cannot be 100% considered to be user-determined as it is based on the browser's language settings. We must consider scenarios such as:

- A user previously set their browser to English, and this was stored in cookies.
- The user has changed their browser setting to Korean.
- The user likely wants to align with the browser's language setting rather than the previously stored cookie language.

Thus, the locale identified by this function is not written to cookies. After considering all this, we implemented the middleware as follows.

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the URL accessed by the user contains a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) {
    // If the path already contains a locale, proceed without additional action
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

# Simplifying Operations for Optimization

After conducting tests with this setup, it operated correctly. However, the delay during language switching UI interaction was longer than expected. There could be various reasons for this, but it appears to stem primarily from the time taken to fetch content during page transitions and the time required to send requests to set cookies. Thus, it would be beneficial to adjust the operation for simplification and optimization.

## Improved Operation Design

Currently, when switching pages to a different language, the operation uses `router.replace`. However, switching the language on a page does not need to block other tasks as high-priority. Therefore, we can alter the operations to:

- Handle page transitions as UI non-blocking updates.
  - Use `useTransition` for lower-priority state updates.

Since the page transition task will be handled by the client anyway, there is no need to create a redirect URL using the `referer` header. We will solve this in the client-side.

- Generate the URL for the other language's page on the client and perform a redirect.

This means the route handler will solely process cookie settings.

- The route handler processes cookie settings exclusively.

With this simplified operation in the route handler, we can also implement further optimizations:

- Utilize caching for the GET method in Next.js route handlers.
- Process server requests and cookie settings independently.

I will provide detailed explanations as we implement each item step by step.

## Language Switch Without UI Blocking

In the language switch UI, the `toggleLanguage` function currently uses `router.replace` to switch the page. However, it doesn't need to be a high-priority operation blocking other tasks. Therefore, let’s use `useTransition` to optimize this.

[Functions like `router.push` and `router.replace` from `next/navigation` are implemented using `navigate`, which utilizes React's `useReducer`](https://github.com/vercel/next.js/discussions/54157#discussioncomment-6763231). Hence, using `useTransition` for state update priority adjustment seems appropriate.

Additionally, we can leverage the provided `isPending` state to indicate to the user that a language switch is in progress.

We will place the page transition operation within `startTransition`. Then, to inform users that the button is disabled during a language switch, we will add `isPending` to the button's `disabled` property.

```tsx
export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Language switch function
  const toggleLanguage = async (newLang: Locale) => {
    if (lang === newLang || isPending) return; // Ignore if it's the same or if already switching

    try {
      // Language switch related cookie setting
      // Redirect URL creation logic

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

## Simplifying the Route Handler

Previously, the `/[lang]/api/language` route handler was responsible for both setting cookies and handling redirects. However, since we are processing this in the client-side, there is no need to generate the redirect URL in the route handler.

Consequently, let’s simply have our route handler focus solely on cookie settings, eliminating the need for the `referer` header to create the redirect URL.

Additionally, we can apply caching to the route handler for language switching, as the [Next.js route handler's GET method can be cached](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#caching). Thus, we will set the `dynamic` variable in `route.ts` to allow for static rendering and caching of this endpoint.

```typescript
export const dynamic = 'force-static';
```

After this change, we need to refine the route handler so that it fetches the locale via the dynamic route segment rather than the query string. For example, to switch to the Korean locale, we will access `/ko/api/language`, and for English, `/en/api/language`. We can also retrieve the dynamic route segments in route handlers, as shown in the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments).

Let's modify the route handler accordingly. We will retrieve the locale to change based on the dynamic route segment and send a response that sets the locale in the cookies. Additionally, don't forget to set the `dynamic` variable for caching.

```typescript
export const dynamic = 'force-static';

// Get the language change through the lang dynamic route segment of /[lang]/api/language
export function GET(request: NextRequest, { params }: {
  params: { lang: Locale },
}) {
  const selectedLocale = params.lang;

  // Return 406 Not Acceptable error for invalid locales
  if (!i18n.locales.includes(selectedLocale)) {
    return NextResponse.json(
      { error: 'Invalid locale' },
      { status: 406 },
    );
  }

  const response = NextResponse.json({ locale: selectedLocale });
  response.cookies.set(LOCALE_COOKIE_NAME, selectedLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 1 month
    sameSite: 'lax',
  });
  return response;
}
```

We also need to update the `LanguageSwitcher` component to send requests using dynamic route segments instead of the query string. The redirect URL will be constructed client-side, ensuring clean separation of concerns.

```tsx
export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  // Code omitted for brevity
  const toggleLanguage = async (newLang: Locale) => {
    if (lang === newLang || isPending) return; // Ignore if it's the same language
    
    const redirectPath = generateRedirectPath(pathname, newLang);
    try {
      // Insert the locale to be changed as a dynamic route segment
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
    // UI code omitted
  );
}
```

# Server Request Optimization

Despite the optimizations applied, delays during language switching remained evident. Although the operations have been simplified, and the language switching is no longer UI-blocking, delays were still apparent. The core issue arises from the necessity of a server request to set cookies.

## Problem

Currently, the client sends a GET request to the cookie-setting route handler and generates a redirect URL when switching languages. The flow can be summarized as follows:

1. User clicks the language switch UI.
2. The client fetches the `/[lang]/api/language` endpoint.
3. The route handler sends a response as it sets cookies.
4. The cookies are updated with the new locale.
5. The client generates a redirect URL and performs client-side navigation.
6. After the URL transition, the middleware activates to determine the user's language via URL path or cookies.

The user only transitions to the new locale's page after the cookies are set, thus imposing a forced wait (`await`) in the code. This results in delays due to the dependency of the page loading on the successful server request response.

One potential solution would be to eliminate the `await` from fetching the route handler that sets the cookie, allowing cookie-related server requests and the page transition to happen independently.

```tsx
// Language switch
fetch(`/${newLang}/api/language`).catch((error: unknown) => {
  console.error('Failed to change language:', error);
});

startTransition(() => {
  router.replace(redirectPath);
});
```

However, prematurely executing `router.replace` may disrupt the page transition, as the current pages are expected to possess a language tag. If a user is currently viewing the Korean page with `/콘텐츠 경로`, and then tries to switch to the English page, the middleware must handle that subscription and lead the user to the correct page for that language. 

The potential for this scenario arises from how the middleware interprets user access to routes without locale information.

If we visualize this, we can identify a sequence in which the client-side navigation occurs first, followed by a cookie-setting fetch request that may lead to incorrect redirects after page transition.

To address this, we can differentiate situations where users land on the Korean content without appropriate language formatting by ensuring that any access to the Korean page has its language prefix (i.e., routes will be prefixed with `/ko`).

## Solution

This approach is straightforward: whenever the user is about to view the Korean content, ensure they receive a redirect to a URL prefixed with `/ko`. Then the middleware can handle and prioritize requests containing this language path accordingly, allowing for a smooth transition and timely responses.

Here's the adjusted middleware code that generically changes `rewrite` to `redirect` to handle prefixed `/`.

```typescript
// src/middleware.ts

// getUserLocale function omitted

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the URL the user accessed contains locale information, use that to determine the locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) {
    // If the path already contains a locale, proceed without additional action
    return NextResponse.next();
  }

  const userLocale = getUserLocale(request);

  const newPath = `/${userLocale}${pathname}`;
  const url = request.nextUrl.clone();
  url.pathname = newPath;

  // Change this to redirect
  return NextResponse.redirect(url);
}
```

# SEO

Given our implementations, we may consider how to inform search engines about multiple language pages via SEO. Though Google is not the sole search engine, we can refer to the [guidelines](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko) on informing Google of localized versions of pages.

The document suggests three primary methods of informing search engines about localized versions:

- HTML Tags
- HTTP Headers
- Sitemap

For this Next.js application, employing HTML tags and sitemaps can be valuable. According to the document, all three methods are fundamentally equivalent from Google’s perspective. Additionally, using site maps to inform about localized page versions has been supported since Next.js version 14.2.0. Thus, this article will present both HTML tags and sitemap utilization, though my blog has solely employed the HTML tag approach.

## HTML Tags

In Next.js, page metadata can be generated using the metadata object or the `generateMetadata` function. The `alternates` attribute within this metadata allows us to inform search engines of localized versions of the page.

Since I had to create metadata for multiple pages with repetitive elements, I created a function that generates metadata for each language. This function sets the following:

- The `canonical` attribute to represent the page's main URL.
- The `alternates.languages` attribute to define the URLs for each language.

These tags communicate to search engines that "this page is associated with these other language pages."

```tsx
export const generateBlogLocalMetadata = (config: BlogConfigType, locale: Locale): Metadata => {
  return {
    metadataBase: new URL(config[locale].baseUrl),
    title: config[locale].title,
    description: config[locale].description,
    alternates: {
      // The canonical URL is set as the basic URL for the language
      canonical: config[locale].url,
      languages: {
        'x-default': config[locale].baseUrl,
        'ko': config.ko.url,
        'en': config.en.url,
      },
    },
    // Omitted...
  };
};
```

The `x-default` property indicates the base URL for the page. Therefore, I set it to represent the basic URL prior to any language-directed redirection.

> It is recommended to provide an alternate page for languages not connected to other pages for cases like language/country selection or auto-redirection homepage. This helps prevent ambiguity in search engines. 
>
> [Informing Google of Localized Versions of Pages](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko)

Moreover, search engines will overlook any tags that point to localized pages that do not reference each other. This prevents malicious sites from misrepresenting their pages.

To ensure that all language pages recognize each other, I changed the `langSwitch` component from a `useRouter` to a link-based implementation.

## Sitemap

Next.js offers functionality for dynamically generating a sitemap via `sitemap.ts`. Further details regarding adding a sitemap can be found in the article [Adding Sitemap to a Next.js Blog](https://witch.work/posts/blog-nextjs-sitemap-generation).

In the sitemap generation functions, we can also utilize the `alternates.languages` attribute to signal the localized version of each page. An example from the official documentation shows how to implement this.

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
    // Omitted similar objects
  ]
}
```

Thus, a similar format for `sitemap.ts` would allow us to structure localized page URLs with the associated `alternates.languages` attributes as shown here:

```tsx
export default function sitemap(): MetadataRoute.Sitemap {
  // Other sitemap generation code omitted

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

It's worth noting that support for localization in sitemaps has been added since Next.js version 14.2.0. Since my blog operates on version 14.1.3, I couldn't employ this feature. Therefore, I solely implemented the HTML tag approach, but I plan to upgrade the Next.js version for my blog to utilize the sitemap method in the future.

# References

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

Informing Google of Localized Versions of Pages

https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko

Optimize Search Engines with Canonical Tags

https://growthacking.kr/%EC%BA%90%EB%85%B8%EB%8B%88%EC%BB%AC-%ED%83%9C%EA%B7%B8-canonical-tag%EB%A1%9C-%EA%B2%80%EC%83%89%EC%97%94%EC%A7%84-%EC%B5%9C%EC%A0%81%ED%99%94%ED%95%98%EA%B8%B0/

Next.js docs, "generateMetadata"

https://nextjs.org/docs/app/api-reference/functions/generate-metadata

Next.js docs, "sitemap.xml"

https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

Correctly Using Canonical and Alternate URLs

https://webmasters.stackexchange.com/questions/120947/use-canonical-and-alternate-url-correctly

Does Setting Canonical to Another Region Subdirectory Impact Local SEO? 

https://support.google.com/webmasters/thread/130615008/can-setting-canonical-to-another-region-subdirectory-impact-local-seo?hl=en

Setting Cookie Paths

https://velog.io/@onerain130/Cookie-path-%EC%84%A4%EC%A0%95
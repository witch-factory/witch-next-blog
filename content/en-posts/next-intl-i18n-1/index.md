---
title: Learning Internationalization Properly - 1. next-intl Basics
date: "2026-08-31T00:00:00Z"
description: "A summary of how to set up internationalization in Next.js with next-intl and the basic ways to work with translated messages"
tags: ["front", "tip"]
---

# Getting Started

So far, I’ve worked with internationalization (i18n) at a few companies and across several projects. This blog also lets you use most features in English. Through that work, I naturally picked up some i18n-related knowledge, such as [HTTP content negotiation](https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Content_negotiation) and the [`Intl` object](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl).

That said, the actual work I had done was mostly limited to adding translated messages to JSON files and using them within an already well-built setup. I kept finding related bugs, but since they weren’t high priority, they were repeatedly postponed and I never had a proper chance to work on them. The prioritization was understandable, but I still couldn’t shake the feeling that I was only dealing with things superficially. At some point, I wanted to understand it more deeply.

So I decided to start by revisiting the features of the `next-intl` library, which I’ve used most often, and then learn more about internationalization in general. It’s not that each individual API is the main point, but I expect that studying these features will also help me better understand what i18n itself is really doing.

For this first post, I focused less on i18n theory and more on the basic usage of the `next-intl` library. In later posts, I plan to cover more convenience features as well as additional things to consider when implementing internationalization in real projects.

That said, this is still an exploration from the perspective of a working developer. If you need deeper knowledge about internationalization itself—such as singular/plural forms, grammatical gender, cultural differences, or word order—it would be better to refer to resources like the [W3C internationalization guide](https://www.w3.org/International/i18n-drafts/nav/learn) or the [ICU message format documentation](https://unicode-org.github.io/icu/userguide/format_parse/messages/).

# Basic Setup

I’ll start by walking through the most basic `next-intl` setup and recording it here. I’ll assume the library is already installed.

## Folder Structure

I created a simple example that supports only Korean and English. It was built as a Next.js project, and the structure looks like this. Irrelevant parts have been omitted.

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

## Managing Messages by Language

Internationalization involves many things to present a service appropriately for multiple languages and cultures, but the first and most familiar part is language-specific messages.

If you want to show "취소" in a Korean environment and "cancel" in an English one, you need to define that somewhere. There are several ways to manage this, but the most common approach is to keep separate files for messages.

Here, we’ll manage them as JSON files in the `messages` folder. Create `ko.json` and `en.json` inside `messages`. Since the config file path can be customized, the folder name itself doesn’t matter. In any case, once this is set up, adding another language simply means creating that language’s JSON file, such as `zh.json`, and adding the messages there.

For this example, I wrote the following:

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

## Configuration for Using Translations

Now let’s say the messages are ready. The next step is deciding which language to show when a user visits.

There are many ways to detect a user’s language, but since choosing the detection strategy isn’t the focus here, I went with one common setup. The priority is: user-selected cookie > `accept-language` header > default value.

First, create the `i18n/request.ts` file. This file detects the language in a server component, loads the corresponding message file, and builds the config object.[^1] If you read the code, you’ll see that it determines the locale (`locale` variable) based on the priority described above, then loads the corresponding file into the `messages` property.

```ts
// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // User-selected value (cookie) > browser language (guess) > default
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

Next, configure the plugin in `next.config.ts` to actually connect `i18n/request.ts` with next-intl. For reference, if you want to place `request.ts` somewhere else, you can pass that path as an argument to `createNextIntlPlugin`.

```ts
// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
```

Wrap the root layout with `NextIntlClientProvider` as well. This allows the settings from `request.ts`, such as `locale` and `messages`, to be used in client components through `NextIntlClientProvider`. Of course, you can also configure language-specific messages separately for client components if needed.

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

Once you’ve done this, you can use translated messages via the `useTranslations` hook. I loaded the message using the full key like `home.title`. But you can also scope it, for example with `useTranslations("home")`. In that case, you would access the message relative to that scope, such as `t("title")`.

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

You can’t use hooks in async server components. So instead of the `useTranslations` hook, use the `getTranslations` function. You would also use `getTranslations` in places where hooks can’t be used, such as metadata.

# next-intl Features

I’ll leave broader language-specific concerns for another post if I get the chance. For now, I’ve summarized the features that are most likely to be useful when a developer who is not an i18n expert (me) needs to implement things quickly.

## Message-related Features

By default, you can use messages in the `t(key)` form, but there are also features for rendering messages in other ways. These are useful, for example, when you need to include links inside a message.

- Interpolation

You can insert variables into messages by wrapping them in `{}`.

```json
{
  "items": "{count} items"
}
```

Use it like this:

```tsx
t("items", { count: 5 });
```

Sometimes, though, you may want to include a string wrapped in curly braces literally in the message. In that case, wrap the part you want to output as-is in single quotes to escape it.

```json
{
  "example": "이름을 '{name}' 칸에 입력해주세요."
}
```

- Rich text

You can use custom tags in messages and map those tags to actual components with `t.rich`. For example, if you need a link to a specific page inside a sentence, you can write it like this:

```json
{
  "home": {
    "link": "예시 페이지는 <example>예시 페이지 링크</example>를 통해 연결됩니다."
  }
}
```

After writing the message like that, use it as follows. You can define how each custom tag should be replaced. I’m not doing it here, but component nesting is also possible, and you can map not only built-in HTML tags like `a` but also React components.

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

You can also use self-closing tags such as `<br />`. However, because the ICU parser requires a closing tag, you need to write it like this. In the message, use `<br></br>`, and in `t.rich`, map it like `br: <br />`.

```json
// en.json
"message": "Hello,<br></br>how are you?"
```

```tsx
// usage
t.rich("message", {
  br: () => <br />,
});
```

`t.rich` returns a React node. On the other hand, there are cases where you may need raw HTML markup as a plain string. In that case, you can use `t.markup`, which returns only a markup string.

In most cases, `t.rich` is the right choice, and `t.markup` should only be used in special situations where raw HTML is required. Also, when using `t.markup`, be careful about XSS vulnerabilities. Avoid using values based on user input, and take measures such as sanitization.

- Raw message

By default, next-intl parses messages once. This is necessary for things like interpolation and HTML-like tags mentioned above. But sometimes you need to use a message exactly as it is, without that interpretation step. One example would be a message like `"link": "예시 raw HTML <h1>링크</h1>"`, where the raw HTML itself needs to be preserved.

In that case, use `t.raw`, which returns the message as-is without interpretation.

When you do this, `t.raw` passes the message through without interpreting it. However, because this doesn’t align well with some of the recent improvements and direction of next-intl, the official docs recommend using other APIs where possible.

- Key checks

You can check whether a key exists with `t.has(key)`. This is useful when message structures differ between languages and you need to confirm whether a specific message is available.

## Formatting

When working with internationalization, you need to consider not only messages but also various locale-specific formats. Dates are a representative example. For instance, in Korea the common format is `YYYY/MM/DD`, while in the US it is `MM/DD/YYYY`.

JavaScript supports these locale-specific formats through the `Intl` object. However, if you use `Intl.*` APIs directly, you have to pass the locale every time, and managing repeated formatting options can become tedious.

To solve this, next-intl provides a formatter through `useFormatter` that automatically maps to the current next-intl locale. In practice, you mainly use it through a `format` object like this:

From my experience, it feels largely like a wrapper that makes the APIs provided by `Intl` easier to manage. It automatically aligns with the current locale, and because you can configure global settings through `request.ts` or provider props, it helps manage repeated formats more consistently. It’s not a huge convenience feature, but it does make consistency easier to maintain if used well.

```ts
const format = useFormatter();
```

- Numbers

Use `format.number`. It provides options based on the JS `Intl.NumberFormat` API.

```ts
const num = format.number(123456.789, { style: "currency", currency: "USD" });
```

- Dates

There are several APIs for dates. For example, when expressing a date range, Korean commonly uses a tilde (`~`), while many other languages use a hyphen (`-`).

Also, the date strings you pass into the API should ideally follow the ISO 8601 format. Since next-intl does not handle date parsing itself, it’s best to convert values to `Date` first and then format them.

```ts
// Simplest date formatting
// Provides options based on the JS `Intl.DateTimeFormat` API
const formattedDate = format.dateTime(dateTime, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Relative time. How the 1st argument relates to the 2nd one, e.g. '5 years ago'
const relativeDate = format.relativeTime(date2020, dateTime);

// Represents a date range
const range = format.dateTimeRange(dateTimeA, dateTimeB, {
  year: "numeric",
  month: "long",
  day: "numeric",
});
```

It also provides a `useNow` hook that returns the current time. Compared with using `new Date()`, it supports periodic updates (customizable through the `updateInterval` argument) and global settings.

- Lists and display names

`format.list` provides locale-specific list formatting. It works like `Intl.ListFormat`.

`format.displayName` converts a specific identifier into the appropriate expression for the current language. For example, "US" is read as 미국 in Korean, but it would be expressed differently in other languages. It works like `Intl.DisplayNames`.

I haven’t used these two features enough myself, so I can’t confidently explain them or provide good examples.

- Global settings

As shown in the earlier examples, you can manually specify formatting options every time. But if it’s a format you use often, that creates repetition. For example, if your service always displays currency with only two decimal places, repeating that everywhere would be exactly the kind of thing developers hate. Naturally, next-intl lets you define these recurring formats globally by giving them names. You can define them in `request.ts` or in the `formats` prop of `NextIntlClientProvider`.

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
  // omitted

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    formats,
  };
});
```

For server components, you can do it as shown above. If you configure it in `NextIntlClientProvider`, just pass the same `formats` object through the `formats` prop. In general, `NextIntlClientProvider` automatically inherits the global format settings from `request.ts`, so you usually don’t need to define them again.

With that setup, you can use your custom formatting like this:

```ts
const formattedDateTimeA = format.dateTime(dateTimeA, "example");
```

You can also use types with these named formats to prevent bugs caused by typos. Create a type definition file such as `global.ts` at the project root.

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

Then add `satisfies Formats` to the `formats` object defined in `request.ts`. Note that this only works if the `formats` object is exported.

```ts
// formats object in request.ts
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

Now, if you use a format name that doesn’t exist in a date formatting API such as `format.dateTime`, you’ll get a type error.

# Wrapping Up

In this post, I looked at the most basic setup of next-intl along with its message and formatting features. Originally, I only knew how to use JSON files and `t()`, but by learning these additional features, I also picked up a lot of clues for handling internationalization more effectively.

So in the next post, I’ll look at additional convenience features in next-intl, some implementation choices around internationalization, and a few of the problems I ran into when applying i18n in real projects. I also plan to write about some solutions I know now but didn’t know back then, even if only partially.

# References

Next.js App Router internationalization https://next-intl.dev/docs/getting-started/app-router

next-intl Blog, useExtracted: The Tailwind of i18n? https://next-intl.dev/blog/use-extracted

[^1]: More precisely, `request.ts` is responsible for internationalization requests in server components, while `NextIntlClientProvider` handles client components. However, since most of what is configured in `request.ts` is also passed down to `NextIntlClientProvider`, let’s start on the server side for now. In my experience, using only Next.js server components is often not enough in real projects, so I did end up configuring things in `NextIntlClientProvider` as well.
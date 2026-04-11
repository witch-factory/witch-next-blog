---
title: favicon에 대하여
date: "2023-06-16T00:00:00Z"
description: "favicon은 어떻게 설정할 수 있을까?"
tags: ["front", "tip"]
---

# 1. 파비콘

파비콘은 웹 페이지를 대표하여 사용되는 작은 이미지다. 북마크에 추가되었을 때 사이트를 표시하는 이미지, 탭에 해당 페이지가 띄워졌을 때 사이트 제목 옆에 작게 뜨는 이미지 등으로 사용된다.

# 2. 설정 방법

`<head>` 태그 안에 `<link>` 태그를 추가하여 설정할 수 있다.

```html
<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
```

하지만 하나의 svg 이미지 같은 걸로 모든 아이콘을 설정하는 건 좋지 않다. 물론 기술적으로는 좋을지도 모르지만 UI/UX 관점에서는 아니다.

iOS에서는 모든 홈 스크린 아이콘이 모서리가 둥근 정사각형 모양이다. 그러나 안드로이드에서는 정사각이 아닌 아이콘도 흔한 등 플랫폼에 따라 차이가 있다. 따라서 각 플랫폼에 따라 다른 아이콘을 사용하는 게 좋다.

## 2.1. iOS 사파리

사파리는 터치 아이콘을 파비콘으로 쓴다. 일반적으로 180x180 PNG 파일을 사용한다. transparency는 사용하면 안된다.

```html
<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
```

이는 많은 브라우저에서 기본 고화질 아이콘으로 사용되기 때문에 북마크 추가시 보이는 이미지 등에도 흔히 사용된다.

## 2.2. 안드로이드 크롬

크롬은 Web App Manifest를 사용한다고 한다. 이것이 크롬만을 위한 건 아니지만 현재 크롬에서 가장 주로 지원하고 있다.

192x192 PNG 파일을 사용하며 transparency를 사용해도 된다. (권장되기도 한다)

```html
<link rel='manifest' href='/site.webmanifest' />
```

## 2.3. IE

`browserconfig.xml` 파일을 사용한다. 32x32 PNG 파일을 사용한다.

그리고 배경색도 지정해야 한다.

```html
<meta name='msapplication-TileColor' content='#ffffff' />
<meta name="msapplication-config" content="/browserconfig.xml">
```

## 2.4. 일반적인 브라우저

`favicon.ico`파일을 사용해서 파비콘을 선언하는 건 전통적인 방식이다. 하지만 대부분의 최신 브라우저는 더 가벼운 PNG 파일을 사용하는 것을 지원한다. 혹은 ICO 파일을 제대로 지원하지 않기까지도 한다.

따라서 이 모든 걸 선언해 주고 브라우저에서 택하도록 할 수 있다.

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="shortcut icon" href="/favicon.ico">
```

오페라에서는 228x228 PNG 파일을 사용하는 등 몇몇 다른 브라우저의 표준도 있다. 하지만 이들은 어차피 위의 방식으로도 충분히 지원할 수 있기에 굳이 특화 아이콘을 만들어줄 필요는 없다고 한다.

[realfavicongenerator.net](https://realfavicongenerator.net/)에서 사진을 통해 파비콘을 생성하거나, 내 페이지의 파비콘이 제대로 되어 있는지를 체크할 수 있다.

# 참고

https://stackoverflow.com/questions/48956465/favicon-standard-2023-svg-ico-png-and-dimensions
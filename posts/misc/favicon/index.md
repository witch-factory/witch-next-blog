---
title: favicon에 대하여
date: "2023-06-16T00:00:00Z"
description: "favicon은 어떻게 설정할 수 있을까?"
tags: ["misc"]
---

# 1. 파비콘

파비콘은 웹 페이지를 대표하여 사용되는 작은 이미지다. 북마크에 추가되었을 때 사이트를 표시하는 이미지, 탭에 해당 페이지가 띄워졌을 때 사이트 제목 옆에 작게 뜨는 이미지 등으로 사용된다.

# 2. 설정 방법

`<head>` 태그 안에 `<link>` 태그를 추가하여 설정할 수 있다.

```html
<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
```
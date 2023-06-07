---
title: 블로그 한땀한땀 만들기 - 12. 최적화
date: "2023-06-07T00:00:00Z"
description: "블로그가 너무 느리다. 최적화를 좀 해보자."
tags: ["blog", "web"]
---

아직 정말..수많은 문제가 있다. 하지만 Vercel로 옮기면서 많은 문제를 해결할 수 있을 거라 믿는다. 하나씩 해결해보자.

# 1. 이미지 최적화

일단 지금 내 블로그의 가장 큰 문제는 너무 느리다는 것이다. 이미지 로딩도 오래 걸리고. NextJS에서는 여러 이미지 최적화를 지원하기에 이를 해보자.

## 1.1. next/Image

일단 Nextjs의 이미지 최적화를 켠다. `next.config.js`에서 아까 Cloudflare 때문에 꺼놨던 image 최적화를 켜주자.

```ts
const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    unoptimized:false,
  },
  reactStrictMode: false,
  swcMinify:false,
};

module.exports = (withContentlayer(nextConfig));
```
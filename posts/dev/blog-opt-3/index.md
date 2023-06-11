---
title: 블로그 최적화 - 3. 이미지 최적화
date: "2023-06-11T03:00:00Z"
description: "겁나 빠른 마녀 : 블로그 최적화 그 세번째"
tags: ["blog", "web"]
---

# 1. 이미지 최적화

이미지를 전반적으로 최적화하는 글이다.
일단 글 목록 페이지에 대한 lighthouse의 제안과 진단을 볼까? 음...점수는 처참하지만 천릿길도 한 걸음부터니까, 할 수 있는 걸 하자.

![category-page-diagnostics](./category-page-diagnostics.png)

아까처럼 이미지에 적당한 크기를 주라고 한다. Card 컴포넌트에서 Image 태그에 sizes를 지정하자.

```jsx
function Card(props: Props) {
/* 생략 */
  <Image 
    className={styles.image} 
    src={image} 
    alt={`${image} 사진`} 
    width={200} 
    height={200}
    sizes='100px'
  />
/* 생략 */
}
```

# 2. 이미지 최적화 2

마침 매우 도움이 되는 글을 찾았다. [매우 많은 이미지를 서빙하는 갤러리를 NextJS로 만드는 글](https://vercel.com/blog/building-a-fast-animated-image-gallery-with-next-js)이 Vercel에서 공식으로 올라와 있었다!

cloudinary를 사용해서 이미지를 서빙하라고 한다.

# 참고

https://vercel.com/blog/building-a-fast-animated-image-gallery-with-next-js

https://nextjs.org/docs/pages/building-your-application/optimizing/images
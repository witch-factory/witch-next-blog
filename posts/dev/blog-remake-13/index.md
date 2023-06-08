---
title: 블로그 한땀한땀 만들기 - 13. 기타 페이지 최적화
date: "2023-06-08T00:00:00Z"
description: "블로그가 너무 느리다. 페이지 최적화를 하자."
tags: ["blog", "web"]
---

# 1. 글 목록 - 이미지 최적화

글 목록 페이지와 글 상세 페이지를 약간 최적화한다. 가장 글이 많은 개발 카테고리의 글 목록 페이지를 lighthouse로 조회해 보자.

![category-page-lighthouse](./category-page-lighthouse.png)

처참하다. 그럼 lighthouse의 제안과 진단을 볼까?

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
    sizes='200px'
  />
/* 생략 */
}
```

# 2. 글 목록 - 페이지네이션

그리고 DOM 사이즈를 줄이라는 조언이 있었다. DOM에 1620개나 되는 요소들이 있다고 한다. DOM 크기가 너무 크면 메모리 사용량이 늘고 스타일 계신이 너무 길어지며 레이아웃 리플로우(문서 내 요소의 위치를 계산되는 프로세스)도 오래 걸리게 된다. 

안 그래도 글 목록 페이지의 길어진 스크롤이 불편하던 참이었다. 


# 참고

https://uxplanet.org/ux-infinite-scrolling-vs-pagination-1030d29376f1
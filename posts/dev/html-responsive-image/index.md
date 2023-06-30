---
title: HTML로 반응형 이미지 가져오기
date: "2023-06-29T03:00:00Z"
description: "HTML에서도 반응형으로 이미지를 불러올 수 있다"
tags: ["web", "study", "front", "html"]
---

# 1. img 태그

HTML에서 img 태그는 이미지를 넣는 데에 사용된다. 거의 필수적인 속성만 넣어서 사용하면 다음과 같이 사용하게 될 것이다.

```html
<img src="assets/profile.png" alt="블로그 프로필 사진" />
```

그런데 메모리 절약, 화면 크기에 따른 강조 부분 차이 등으로 인해서 화면 크기에 따라 다른 이미지를 보여줘야 할 경우가 있다. 이른바 반응형 이미지라는 것이다.

물론 이럴 때 CSS를 이용할 수 있을 것이다. 가령 화면 너비에 따라서 `background-image`를 바꿔 준다든지.

```css
@media screen and (max-width: 600px) {
  .profile {
    background-image: url("assets/profile-small.png");
  }
}

@media screen and (min-width: 600px) {
  .profile {
    background-image: url("assets/profile-large.png");
  }
}
```

하지만 HTML로도 이러한 동작을 할 수 있다. img의 srcset, sizes라는 새로운 속성을 사용하는 게 먼저 하나의 방법이다.

# 참고

https://developer.mozilla.org/ko/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images

https://developer.mozilla.org/ko/docs/Web/HTML/Element/img
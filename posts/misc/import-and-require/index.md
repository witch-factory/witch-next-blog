---
title: JS의 require와 import
date: "2023-07-21T00:00:00Z"
description: "외부 파일을 불러올 때 쓰는 require와 import, 무슨 차이일까?"
tags: ["javascript"]
---

import와 require에 관해서 원래는 require가 commonJS에서 쓰이는 문법이고 import가 ES6부터 도입되었다는 정도만 알고 있었다. 그래서 이참에 예전에 들어 보기만 하고 묻어 두었던 관련 글들을 꺼내서 읽어보고 정리해보았다.

# 1. 문법

둘은 모두 외부 모듈의 코드를 불러오는 작업을 수행하는 데에 쓰인다.

## 1.1. require

모듈을 불러올 때는 `require` 키워드만 사용하면 된다.

```javascript
const express = require('express');
```

모듈을 내보낼 때는 `exports`와 `module.exports` 2가지의 방법이 있다. 사용하는 방식은 다음과 같다.

1. 여러 객체를 내보낼 때는 exports의 속성으로 할당한다.
2. 하나의 객체를 내보낼 때는 module.exports에 할당한다.



# 참고

https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-require-%E2%9A%94%EF%B8%8F-import-CommonJs%EC%99%80-ES6-%EC%B0%A8%EC%9D%B4-1

https://nodejs.org/ko/docs/guides/getting-started-guide
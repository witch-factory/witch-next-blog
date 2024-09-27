---
title: React useState를 파헤치다
date: "2024-09-09T00:00:00Z"
description: "React useState function"
tags: ["react"]
---

최근 React 공식 문서를 다시 보고 있다. 

https://ko.react.dev/learn/state-a-components-memory#how-does-react-know-which-state-to-return

React hooks: not magic, just arrays

https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e

리액트 훅은 간결한 구문을 구현하기 위해 훅은 동일한 컴포넌트의 모든 렌더링에서 안정적인 호출 순서에 의존합니다. 위의 규칙(“최상위 수준에서만 훅 호출”)을 따르면, 훅은 항상 같은 순서로 호출되기 때문에 실제로 잘 작동합니다. 또한, 린터 플러그인은 대부분의 실수를 잡아줍니다.
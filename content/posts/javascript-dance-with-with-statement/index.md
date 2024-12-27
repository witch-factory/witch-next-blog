---
title: with와 함께, with 시리즈 탐구기
date: "2024-07-08T01:00:00Z"
description: "오래된 Javascript 책의 한 문장에서 시작해서 MDN 기여까지"
tags: ["javascript", "web"]
---

# 이 글은 작성 중입니다.

with문에 대한 연구를 최근 해서 블로그에 글을 썼다.

[JS 탐구생활 - with문에 대하여](https://witch.work/posts/javascript-with-statement)

[JS 탐구생활 - 말썽쟁이 with문과 Symbol.unscopables 연대기](https://witch.work/posts/javascript-with-statement-2)

그런데 이게 내가 블로그에 글을 쓰거나 무언가를 공부하면서 추구하는 부분을 상당히 잘 달성했다고 생각하고 또 시간과 노력을 꽤나 들였기에 진행 과정을 여기 남긴다.

문제 사례를 보거나 무언가를 배웠을 때마다 완전히 이해하려고 노력하고, 머릿속에서 연결해 보면서 잘 연결이 되지 않거나 미심쩍은 부분을 찾는다. 그리고 완전히 시원하게 해결될 때까지 혹은 더 이상 깊이 갈 수 없을 것 같을 때까지 파고드는 것이다. 그러다 보면 지식과 이해와 PR은 알아서 따라온다.

# 시작

나는 Javascript의 역사에 관심이 많기 때문에 오래된 Javascript 책이나 자료를 찾아보고는 한다. 그런데 악셀 라우슈마이어의 "자바스크립트를 말하다"라는 책을 읽다가 다음과 같은 문장을 발견했다. `with`문의 문제에 관해서 이야기하는 섹션이었다.

> 이것은 사고실험이 아닙니다. 배열 메서드 values()가 파이어폭스에 추가되면서 TYPO3 콘텐츠 관리 시스템의 코드가 엉킨 일이 있었습니다. 브렌던 벤비가 이 문제의 원인을 밝혀냈습니다(http://mzl.la/1jCrXti).
>
> 악셀 라우슈마이어 지음, 한선용 옮김, "자바스크립트를 말하다", 248p

이 문장을 보고 나니 궁금해져서 해당 주소에 들어가 보았다. 그러자 책에 서술된 버그에 관한 Bugzilla 리포트 페이지가 떴다. 하지만 처음 볼 때는 맥락을 거의 이해할 수 없었다.

# MDN 문서 번역

버그 리포트 페이지의 코멘트들을 읽어 보니 `with(values)`라는 코드가 문제를 일으킨 듯 했다. 또 연관된 링크과 다른 버그 문서들을 읽어 보니 `Symbol.unscopables`이라는 잘 알려진 심볼과 연관이 있었다. 이전에 [심볼의 용도에 대해 알아본 글](https://witch.work/posts/javascript-symbol-usage)에서 이름을 들어본 적은 있었지만 잘 몰랐던 부분이었다.

이 버그 리포트를 이해하려면 `with`와 `Symbol.unscopables`에 대해 알아야 했다. 그래서 먼저 MDN에 있는 `with`와 `Symbol.unscopables`에 대한 문서를 찾아보았다. 개발하면서 실질적으로 쓸 일은 거의 없는 개념에 대한 문서라 그런지 번역은 되어 있지 않았다 (놀랍게도 `Array.prototype[@@unscopables]`는 번역이 되어 있었다).

그래서 나도 어차피 이해를 위해서는 문서를 여러 번 읽어야 할 것 같아서 이를 번역하였다.

이전에 이미 [Javascript: The First 20 Years를 번역](https://js-history.vercel.app/)하면서 생긴 요령이 있어서 번역은 그렇게 어렵지 않았다. 또한 [MDN Web Docs contribution guide](https://github.com/mdn/content/blob/main/CONTRIBUTING.md)같은 공식 가이드도 너무 친절해서 따라하기만 하면 됐다. 이미 앞선 기여자들의 후기와 가이드를 풀어 쓴 글들도 인터넷에 많았기에 PR까지 쉽게 완료했다.

[[ko] with 문서 신규 번역](https://github.com/mdn/translated-content/pull/22055), [[ko] Symbol.unscopables 문서 신규 번역](https://github.com/mdn/translated-content/pull/22078)까지 2개의 PR을 할 수 있었다.

이후 리뷰를 받으면서 리뷰어 분들이 가이드와 함께 나의 의견을 물어보신 부분도 있었는데, 대답하기 위해 공부하면서 내가 원래 이해하고자 했던 부분도 더 정확하게 탐구할 수 있었다.

리뷰된 내용을 고치자 PR이 머지되었다. 나도 많은 도움을 받았던 사이트에 내 흔적을 아주 작게나마 남긴다는 건 뿌듯한 일이었고 원래 하던 탐구에도 큰 도움이 되었다.

![MDN 번역 PR](./mdn-translation.png)

아무래도 가장 진입 장벽이 낮은 기여 중 하나가 문서 번역이고 또 그 중 유명한 게 MDN이었기에 솔직히 누구나 할 수 있다고 생각했던 부분이 있었다. 그런데 고작 지명도 낮은 문서 2개의 번역을 하면서도 꽤 많은 것을 생각해야 했기에 이전의 내 생각이 부끄러워졌다.

번역을 하면서 확실히 문서를 숙지했기에 원래 보던 버그 리포트를 쉽게 이해할 수 있었다. 그걸 기반으로 역사적인 부분들을 조사하여 [JS 탐구생활 - 말썽쟁이 with문과 Symbol.unscopables 연대기](https://witch.work/posts/javascript-with-statement-2)를 썼다.

# MDN 원문에 기여

그런데 그렇게 MDN 문서 번역과 버그 리포트 관련 탐구를 병행하다 보니 이상한 부분을 찾았다. MDN 문서에는 `Symbol.unscopables`가 `Array.prototype.keys()` 때문에 나왔다고 적혀 있었다. 그런데 아무리 찾아봐도 `Symbol.unscopables`는 `Array.prototype.values()` 때문에 나왔다는 사실이 계속 확실해졌다.

`Symbol.unscopables`가 처음 나올 때 `keys`도 포함되어 있었던 것은 맞다. 하지만 이는 `keys()`, `values()`, `entries()` 배열 메서드가 함께 나왔기 때문이었고 실제로 버그를 발생시킨 것은 `values()`였다.

물론 내가 모르는 어떤 사정이 있을 수 있다. 그리고 MDN 문서 기여자들은 대부분 전문가들이니 내가 모르는 어떤 막후 사정을 알 수도 있었다. 그래서 해당 MDN 문서에 기여한 사람을 찾아보았다. 하지만 그 분의 레쥬메 등을 보니 `with`와 관련된 TC39의 논의 등에 참여하거나 막후 사정을 알 만한 사람은 아니라고 예상했다.

[그래서 벌벌 떨면서 출처들을 최대한 찾아서, 문서에 틀린 정보가 있다고 이슈를 올렸다. PR을 올려도 되냐는 질문과 함께.](https://github.com/mdn/content/issues/34639)

![내가 올린 MDN 이슈](./mdn-upstream-issue.png)

'당연히 PR해도 된다'는 댓글이 생각보다 엄청 빠르게 달렸다. 따라서 `Symbol.unscopables`이 `keys()`가 아니라 `values()` 때문에 나왔다고 내용을 고쳐 [PR을 올렸다.](https://github.com/mdn/content/pull/34646#issuecomment-2209978411)

그런데 리뷰어가 댓글에 재밌을 거 같다면서 이슈에 언급한 컨텐츠를 더 추가할 생각이 있냐고 물었다. 나는 당연히 더 기여할 기회니까 좋다고 하면서, 그런데 그러려면 `Array.prototype[@@unscopables]` 문서도 고쳐질 가능성이 있다고 했다. 내 맘대로 하랬다.

![MDN 이슈에 대한 댓글](./mdn-upstream-pr-comment.png)

그래서 간단하게 내가 조사한 사실을 작성해서 PR을 올렸다. 역시 아주 빠르게 리뷰가 되었고 리뷰를 받아서 PR을 수정하자 이내 머지되었다.

![MDN PR 머지됨](./mdn-upstream-pr-merged.png)

비록 사람들이 많이 찾는 내용에 대한 건 아니지만, 프론트에서 그래도 가장 공신력 있는 걸로 평가받는 MDN 문서가 완전한 정보를 제공하도록 도운 것은 크게 기쁜 일이었다.

# 트위터

이렇게 쓴 글들을 트위터에 올렸더니 어떤 분이 [All about the with statement in JavaScript: removing with statements in JavaScript applications](https://dl.acm.org/doi/10.1145/2578856.2508173)이라는 논문을 달아주셨다. JS 관련 문서에 등장하는 얼마 안 되는 한국인인 류석영 교수님이 저자로 참여한 논문이라 흥미가 생겼다.

다행히 12쪽밖에 안 되는 논문이었고, with문을 재작성하는 정적 분석기를 만드는 내용이었다. 주제 자체가 알고 싶었던 내용은 아니었다. 하지만 논문에 나온 사전 조사 부분에 with의 기존 사용에 대한 정리가 있었다. 그래서 이를 참고하여 내가 쓴 글에 추가하였다.

Let's Bring Back JavaScript's `with()` Statement

https://witch.work/posts/javascipt-dance-with-with-statement
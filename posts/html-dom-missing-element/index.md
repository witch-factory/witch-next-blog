---
title: HTML의 DOM 인터페이스가 없는 요소들
date: "2023-08-10T01:00:00Z"
description: "어떤 HTML 요소들은 따로 DOM 인터페이스가 있고 어떤 건 없다. 왜 그럴까?"
tags: ["HTML"]
---

# 들어가면서

며칠에 걸쳐 조사를 진행했으나 솔직히 이 글에서 제기하는 작은 의문에 대해서 완전히 속시원한 대답을 찾지는 못했다. 대부분은 설명할 수 있었지만 몇 가지는 하지 못했다. 웹 스펙의 역사적인 이유라고밖에는 설명할 수 없을 것들이라고 생각한다. 

혹시 누군가가 HTML의 어떤 요소는 왜 HTMLElement이고, 어떤 요소는 특별한 추가 요구사항이 없는데도 HTML 요소의 인터페이스가 따로 존재하는지에 대한 명쾌한 기준을 알고 있거나 이 역사를 알고 있다면 제발 댓글로 알려주기를 바라고 있다.

아래에서도 나름의 기준을 찾아냈으나, 이를 벗어나는 부분들에 대해서 통합적인 명쾌한 설명을 하지 못했다.

# 1. 의문

TS를 쓰다 보면 간간이 HTML의 DOM Element 타입을 사용하게 된다. 가령 React에서는 `ChangeEvent`를 제네릭 타입으로 제공하는데 이럴 때 이런 타이핑을 하게 된다.

```tsx
const handleChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
  setValue(event.target.value)
}
```

그런데 코드를 짜다가 정확히 어떤 상황이었는지는 잘 기억나지 않지만 `<section>`태그 요소의 타이핑을 해야 했다. 하지만 찾아보니 section에 대한 DOM 인터페이스는 없었고 당연히 대응하는 타입도 없었다. section의 타이핑은 `HTMLElement`로 해야 한다.

[MDN 문서를 보아도 `<section>`의 인터페이스는 `HTMLElement`이다.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section) 어째서 이런 자주 쓰이는 태그에 고유 인터페이스 하나 없을까?

# 2. 탐구

이런 의문을 가진 사람이 내가 처음이었을 리는 없다. 그래서 찾아보니 누군가가 비슷한 의문을 제시해 놓았다. [왜 HTMLSectionElement와 HTMLArticleElement는 없는 것인가?](https://stackoverflow.com/questions/65721709/why-is-there-no-htmlsectionelement-and-no-htmlarticleelement-in-javascript)

질문에서도 이야기하고 또한 HTML 명세를 보아도 그렇지만, 꽤 많이 쓰이는 HTML 요소인데 따로 DOM 인터페이스가 없는 요소들은 다음과 같이 있다.

- `<nav>`
- `<header>`
- `<main>`
- `<footer>`
- `<aside>`
- `<section>`
- `<article>`

그럼 어떤 요소가 `HTMLElement`가 될까? HTML 명세에서는 다음과 같이 설명한다.

> The basic interface, from which all the HTML elements' interfaces inherit, and which must be used by elements that have no additional requirements, is the HTMLElement interface.
>
> [HTML5 spec, 3.2.2. Elements in the DOM](https://html.spec.whatwg.org/multipage/dom.html#elements-in-the-dom)

좀더 오래된 명세에도 이것이 포함되어 있다.

> Elements that only expose the HTML core attributes are represented by the base HTMLElement interface.
>
> [HTML4.01 spec, 1.6.4. The HTMLElement interface](https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-798055546)

즉, 위의 요소들은 추가적인 인터페이스 요구사항이 없기 때문에 `HTMLElement`인터페이스가 된 것이다. 그럼 여기서의 추가적인 요구사항이란 무엇일까? 우리가 흔히 말하는 HTML 요소의 프로퍼티를 말함이다. 가령 `<input>`요소의 `name`같은 것들 말이다.

예를 들어서 `<button>` 요소의 DOM 인터페이스인 `HTMLButtonElement`의 인터페이스 명세는 다음과 같다.

```webidl
[Exposed=Window]
interface HTMLButtonElement : HTMLElement {
  [HTMLConstructor] constructor();

  [CEReactions] attribute boolean disabled;
  readonly attribute HTMLFormElement? form;
  [CEReactions] attribute USVString formAction;
  [CEReactions] attribute DOMString formEnctype;
  [CEReactions] attribute DOMString formMethod;
  [CEReactions] attribute boolean formNoValidate;
  [CEReactions] attribute DOMString formTarget;
  [CEReactions] attribute DOMString name;
  [CEReactions] attribute DOMString type;
  [CEReactions] attribute DOMString value;

  readonly attribute boolean willValidate;
  readonly attribute ValidityState validity;
  readonly attribute DOMString validationMessage;
  boolean checkValidity();
  boolean reportValidity();
  undefined setCustomValidity(DOMString error);

  readonly attribute NodeList labels;
};
HTMLButtonElement includes PopoverInvokerElement;
```

`<button>`요소가 필요로 하는 프로퍼티인 `form`등이 명시되어 있는 것을 볼 수 있다. [이런 속성들이 자세히 정리된 내용은 이전에 폼 요소들을 정리했던 글을 참고할 수 있다.](https://witch.work/posts/html-form-tag#6.5.-button)

이런 식으로 추가적인 요구사항이 있는 요소들은 DOM 인터페이스가 따로 존재한다. 다른 요소와 별로 다를 바 없어 보이는 `<div>`의 `HTMLDivElement`도 주변 맥락에 대한 요소 컨텐츠의 정렬 위치를 나타내는 `align` 속성이 있었다. 이는 꽤 오래전에 deprecated되었지만 호환성을 위해 남아있는 것이다.

```webidl
partial interface HTMLDivElement {
  [CEReactions] attribute DOMString align;
};
```

**반면에 위에서 보았던 `<section>`와 같은 요소들은 기본 DOM 인터페이스에 비해 추가적인 요구사항이 없기 때문에 그냥 `HTMLElement`가 된 것이다.**

이를 뒷받침하듯이, HTML5에서 도입된 시맨틱 태그들은 대부분 따로 DOM 인터페이스가 없다. 해당 태그들은 대부분 말 그대로 사이트의 의미적 구조를 나타내고 구획하는 데에 쓰이기 때문이다. 위에서 언급된 것들도 시맨틱 태그이고 `<figcaption>`, `<figure>`, `<mark>`, `<summary>`와 같은 시맨틱 요소들도 `HTMLElement`만을 DOM 인터페이스로 가진다.

물론 이런 시맨틱 태그들이 모두 고유한 DOM 인터페이스가 없는 건 아니다. 따로 요구사항이 필요한 경우에는 고유 DOM 인터페이스를 가지고 있다. 다만 중요한 건 요구사항이 없을 경우 `HTMLElement`가 된다는 것이다. 

HTML5 요소가 아니라도 이는 마찬가지이다. `<dl>`, `<dt>`, `<dd>`, `<bdo>`, `<cite>`, `<em>`와 같은 요소들도 매우 오래전부터 있었지만 추가적인 인터페이스 요구사항이 없기 때문에 `HTMLElement`이다. [또 HTMLElement 인터페이스를 갖는 요소는 HTML 스펙에서 볼 수 있다.](https://html.spec.whatwg.org/multipage/indices.html#element-interfaces)

참고로 DOM 인터페이스 요구사항이 있는 시맨틱 요소의 예시를 들자면, [`<details>`요소의 경우 open 속성을 가지고 있기에 따로 DOM 인터페이스를 가진다.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) 열고 닫히는 요소이므로 요구 사항을 추가하여 고유 DOM 인터페이스를 만드는 게 맞았을 거라 생각한다. `<time>`요소도 마찬가지로 `datetime` 속성을 가지고 있기에 고유 DOM 인터페이스를 가진다.

# 3. 반례들에 대한 약간의 탐구

하지만 시원하게 이 의문을 해결하는 것을 방해하는 몇 가지 사실들이 남아 있다. 추가적인 요구사항이 없는 요소들이라고 해서 모두 `HTMLElement`가 되는 것은 아니다. 예를 들어서 `<span>`요소는 `HTMLSpanElement`라는 고유 DOM 인터페이스를 가지고 있다. 

[`HTMLSpanElement`는 `<span>`요소를 나타낼 뿐 부가적인 프로퍼티나 메서드가 없다.](https://developer.mozilla.org/ko/docs/Web/API/HTMLSpanElement) [스펙에서도 global attribute와 함께 쓰였을 때 유용할 수 있다고만 되어 있다.](https://html.spec.whatwg.org/multipage/text-level-semantics.html#htmlspanelement) 

옛날의 HTML 표준이야 어차피 아무도 안 지키는 걸로 유명했고 지금은 없던 무언가 여러가지가 있던 시절이었으니 그럴 수도 있다.

![웹 개발자들은 HTML 표준을 안 지키기로 유명하다](./your-opposite.png)
[사진 출처](https://gigglehd.com/gg/bbs/13526687)

하지만 상대적으로 꽤 최근이고 표준도 안정화된 HTML5에서 도입된 `<picture>` 요소는 어떤가? 이 요소 또한 [HTMLPictureElement라는 DOM 인터페이스를 따로 가지지만 HTMLElement에 비해 특별한 인터페이스 요구사항을 가지고 있지는 않다.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLPictureElement) 시간이 부족해서 찾지는 못했지만 분명 추가적인 요구사항이 없지만 DOM 인터페이스를 가지는 요소들이 더 있을 것이다.

그럼 이것들은 왜 따로 요소들을 가지고 있을까? 시원한 해설은 찾지 못했으나, 조사를 통해 `<span>`과 `<picture>`에 대해서만 추측해보았다. 결론적으로는 어떤 상황에 대한 대비책으로 만들어 놓았다고 생각한다.

## 3.1. picture

`<picture>`요소는 여러 여러 source를 감싸도록 하여 브라우저가 고를 수 있는 사진 소스들을 제공한다. 이를 다루는 내용은 [HTML로 반응형 이미지 가져오기](https://witch.work/posts/html-responsive-image#3.-%EC%95%84%ED%8A%B8-%EB%94%94%EB%A0%89%EC%85%98-%EB%AC%B8%EC%A0%9C%EC%99%80-picture)나 MDN 문서를 참고할 수 있다.

이는 물론 특별한 DOM 인터페이스 요구사항이 없어서 `HTMLElement`에 비해 다를 바가 없지만, 이미지를 다룬다는 점에서 충분히 새로운 요구사항이 생길 수 있고 이를 대비해서 만든 것으로 보인다.

실제로 이에 대한 제안이 있었다. `<picture>`에 대응하는 `HTMLPictureElement`를 만들고 내부의 이미지를 제어하는 어떤 프로퍼티나 이벤트를 넣자는 것이었다. 그리고 이 제어 로직은 쉐도우 DOM에 넣고 말이다. `<picture>`의 자식으로 `<img>`를 필수적으로 넣게 하자는 이야기도 해당 흐름에서 나왔다.

> Can we hide the "controlling" `<img>` in shadow DOM? And make  
HTMLPictureElement the interface that proxies relevant properties/events  
to the internal `<img>`?
>
> W3C Mailing List, [whatwg] `<picture>` redux 
> https://lists.w3.org/Archives/Public/public-whatwg-archive/2013Nov/0295.html

물론 이 제안은 `HTMLPictureElement`에 추가 인터페이스가 없는 것을 보아 기각당한 듯 하지만 이런 식으로 picture 요소에도 무언가를 추가하려는 시도가 분명 있었다. 이런 시도들로 말미암아 어떤 가능성에 대비하는 개념으로 `HTMLPictureElement`가 만들어진 것으로 추측해 본다.

## 3.2. span

span은 언제쯤부터 사용되기 시작했을까? [caniuse](https://caniuse.com/?search=span)를 참고하면 2010년대에 들어서서야 대부분 지원되기 시작했고 지원된다고 해서 바로 대중적으로 쓰이지는 않는 특성상 2010년대 초반은 지나서야 많이 쓰이기 시작했을 거라고 추측한다.

그러면 그때 웹에는 무슨 일이 있었을까? 웹 컴포넌트가 핫하게 떠오르고 있었다. React나 여러 컴포넌트 기반의 프레임워크들이 나오면서 비즈니스가 특정 기술에 묶여 버리게 되었고 웹 컴포넌트가 이를 극복하기 위한 기술로써 주목받고 있었다.

자세한 내용은 나중에 기회가 되면 글을 쓰겠지만, 마치 예전의 React class component와 비슷하게 HTMLElement를 확장한 클래스를 이용해 JS를 HTML처럼 쓸 수 있게 해주는 개념이었다. 

```js
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    const root = ReactDOM.createRoot(mountPoint);
    root.render(<a href={url}>{name}</a>);
  }
}
customElements.define('x-search', XSearch);
```

이렇게 만들어 놓으면 다음과 같이 쓸 수 있었다.

```html
<x-search name="Web Components"></x-search>
```

이는 React나 Vue같은 다른 프레임워크와 함께 쓸 수도 있었고 나름대로 여러가지 장점이 있는 기술이었다. 그런데 문제는 IE11보다 낮은 버전의 브라우저에서는 이 기술을 사용할 수 없었다. 그렇게 될 경우 그대로 내부 HTML을 렌더링하게 되었었다. 

이럴 땐 레거시 브라우저가 custom element를 이해하지 못할 때 이를 취급하는 인터페이스인 `HTMLUnknownElement`에도 스타일을 입힐 수 있으므로 fallback HTML을 자식으로 넣어두는 방식을 쓸 수 있었다.(물론 레거시 브라우저를 고려해야 할 때의 이야기다)

```html
<current-time>
    /* fallback html */
    13:00
</current-time>
```

이때 fallback HTML로 잘 쓸 수 있었던 것이 `<span>`요소였다. custom element를 지원하지 않는 레거시 브라우저에서는 해당 요소가 `HTMLUnknownElement`로 취급되었는데 이는 `HTMLElement`를 상속하고 있었고 따라서 `HTMLElement`의 display 기본값인 `inline`을 가지고 있었다.

그런데 custom element의 fallback HTML로 그냥 `HTMLElement`를 상속하는 요소를 아무거나 쓰기는 어려웠다. 

예를 들어 `<b>`와 같은 태그도 `HTMLElement`이지만 굵은 글씨 스타일이 기본적으로 적용되었기 때문에 fallback HTML로 쓰려면 해당 스타일을 따로 만져 줘야 해서 번거로웠을 것이다.

당시 개발자들이 생각하기에 fallback HTML로 가장 적절했던 태그가 `<span>`이 아니었을까 하고 나는 생각한다. `HTMLSpanElement`도 custom element처럼 `HTMLElement`를 상속하며, `display:inline`값을 가지는 인터페이스이며 심지어 [IE11 이하에서도 사용 가능하기 때문이다.](https://caniuse.com/?search=htmlspanelement)

[그리고 사실 IE8 미만의 브라우저에서는 이런 custom element를 만들 수는 있었지만 지원이 끔찍했기 때문에 custom element 대신 `<span>`요소를 쓰는 것이 권장되고 있었다.](https://stackoverflow.com/questions/6854757/custom-tags-not-working-in-ie8/6854813#6854813)

custom element의 레거시 브라우저 지원을 위한 fallback HTML 역할도 잘 수행하고, 심지어 그 대체품 역할까지 해내는 게 `<span>`이었다. 이 정도면 다른 태그들에 비해서 뭔가 좀 더 추가될 가능성이 있었기에 미래의 어떤 가능성에 대비해서 따로 DOM 인터페이스를 만들어 놓았던 것이 아닐까 하고 추측한다.

## 3.3. 여담

W3C의 메일링 아카이브에는 이런 추가적인 DOM 인터페이스에 대한 몇 가지 논의가 있었다. 지금 보면 신기한 것들도 있다. 

[예를 들어서 `<section>`의 DOM 인터페이스를 제안하는 것이 있었는데 여기서는 `HTMLSectionElement`라는 DOM 인터페이스를 제안하며 해당 section의 제목을 나타내는 `headingElement`이라는 프로퍼티를 가지도록 하자는 논의가 있었다. 물론 기각당했다.](https://lists.w3.org/Archives/Public/public-whatwg-archive/2004Nov/0095.html)

# 참고

https://stackoverflow.com/questions/65721709/why-is-there-no-htmlsectionelement-and-no-htmlarticleelement-in-javascript

https://stackoverflow.com/questions/36268712/htmlspanelement-vs-htmlunknownelement

https://stackoverflow.com/questions/6854757/custom-tags-not-working-in-ie8

https://developer.mozilla.org/ko/docs/Web/API/HTMLDivElement

https://developer.mozilla.org/ko/docs/Web/API/HTMLSpanElement

커스텀 요소 만들기 https://ui.toast.com/posts/ko_20170609

https://meetup.nhncloud.com/posts/115

W3C 퍼블릭 메일링 아카이브 https://lists.w3.org/Archives/Public/

https://lists.w3.org/Archives/Public/public-whatwg-archive/2013Nov/0296.html

https://yozm.wishket.com/magazine/detail/1193/

https://legacy.reactjs.org/docs/web-components.html


---
title: HTML의 링크 태그에 관하여
date: "2023-08-10T01:00:00Z"
description: "HTML의 하이퍼링크 태그"
tags: ["HTML"]
---

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
> [HTML spec, 3.2.2. Elements in the DOM](https://html.spec.whatwg.org/multipage/dom.html#elements-in-the-dom)

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

이런 식으로 추가적인 요구사항이 있는 요소들은 DOM 인터페이스가 따로 존재한다. 다른 요소와 별로 다를 바 없어 보이는 `<div>`의 `HTMLDivElement`도 주변 맥락에 대한 요소 컨텐츠의 정렬 위치를 나타내는 `align` 속성이 있다. 이는 꽤 오래전에 deprecated되었지만 호환성을 위해 남아있는 것이다.

반면에 위에서 보았던 `<section>`와 같은 요소들은 기본 DOM 인터페이스에 비해 추가적인 요구사항이 없기 때문에 그냥 `HTMLElement`가 된 것이다.

# 3. 한 걸음 더 탐구

하지만 추가적인 요구사항이 없어도 DOM 인터페이스를 만들어 주면 되는 거 아닌가? 예를 들어서 [`HTMLSpanElement`는 `<span>`요소를 나타낼 뿐 부가적인 프로퍼티나 메서드가 없다.](https://developer.mozilla.org/ko/docs/Web/API/HTMLSpanElement) [스펙에서도 global attribute와 함께 쓰였을 때 유용할 수 있다고만 되어 있다.](https://html.spec.whatwg.org/multipage/text-level-semantics.html#htmlspanelement) [HTMLPictureElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLPictureElement)도 마찬가지다.







# 참고

https://stackoverflow.com/questions/65721709/why-is-there-no-htmlsectionelement-and-no-htmlarticleelement-in-javascript

https://developer.mozilla.org/ko/docs/Web/API/HTMLDivElement

https://developer.mozilla.org/ko/docs/Web/API/HTMLSpanElement
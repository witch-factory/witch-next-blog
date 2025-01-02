---
title: HTML Elements Without DOM Interfaces
date: "2023-08-11T01:00:00Z"
description: "Some HTML elements have distinct DOM interfaces while others do not. Why is this the case?"
tags: ["HTML"]
---

# Introduction

I have conducted research over several days, but to be honest, I did not find a satisfactory answer to the small question raised in this article. Most could be explained, but there were a few that could not. I believe they can only be attributed to historical reasons related to web specifications.

If anyone knows the clear criteria for why certain HTML elements are classified as `HTMLElement` while others have unique interfaces without additional requirements, I would appreciate it if you could share this information in the comments.

I have found some criteria for the elements discussed below; however, I was unable to provide a unified and clear explanation for the exceptions.

# 1. Question

When using TypeScript, I occasionally utilize the HTML DOM Element types. For instance, in React, the `ChangeEvent` is provided as a generic type, which requires this kind of typing:

```tsx
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value)
}
```

However, while working with the code, I don’t remember the exact situation, but I needed to type an element of the `<section>` tag. Upon searching, I found that there was no DOM interface for the section, and therefore no corresponding type existed. The typing for section had to be done as `HTMLElement`.

[According to the MDN documentation, the interface for `<section>` is `HTMLElement`.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section) Why is it that such commonly used tags do not have a unique interface?

# 2. Exploration

I cannot be the first person to have this question. Upon investigation, I found that someone raised a similar issue: [Why are HTMLSectionElement and HTMLArticleElement non-existent?](https://stackoverflow.com/questions/65721709/why-is-there-no-htmlsectionelement-and-no-htmlarticleelement-in-javascript)

As mentioned in the question and the HTML specifications, commonly used HTML elements that do not have separate DOM interfaces include:

- `<nav>`
- `<header>`
- `<main>`
- `<footer>`
- `<aside>`
- `<section>`
- `<article>`

What, then, qualifies an element as `HTMLElement`? The HTML specifications explain it as follows:

> The basic interface, from which all the HTML elements' interfaces inherit, and which must be used by elements that have no additional requirements, is the HTMLElement interface.
>
> [HTML5 spec, 3.2.2. Elements in the DOM](https://html.spec.whatwg.org/multipage/dom.html#elements-in-the-dom)

This is also found in older specifications:

> Elements that only expose the HTML core attributes are represented by the base HTMLElement interface.
>
> [HTML4.01 spec, 1.6.4. The HTMLElement interface](https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-798055546)

Thus, since the aforementioned elements do not have additional interface requirements, they become part of the `HTMLElement` interface. What do we mean by additional requirements? These refer to the properties commonly associated with HTML elements, such as the `name` property of an `<input>` element.

For example, the interface specification for the DOM interface of the `<button>` element, `HTMLButtonElement`, is as follows:

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

You can see that properties required by `<button>`, such as `form`, are specified here. [Details regarding these attributes can be found in a previous article discussing form elements.](https://witch.work/posts/html-form-tag#6.5.-button)

Elements with additional interface requirements thus possess distinct DOM interfaces. Even the `<div>` element, which may not seem different from others, had a property `align` indicating the alignment of the content in context with surrounding elements. Although it has been deprecated for a long time, it remains for compatibility reasons.

```webidl
partial interface HTMLDivElement {
  [CEReactions] attribute DOMString align;
};
```

**In contrast, elements like `<section>`, as noted earlier, lack additional requirements compared to the base DOM interface, leading them to become simply `HTMLElement`.**

Supporting this observation, most semantic tags introduced in HTML5 do not have distinct DOM interfaces, as they are primarily utilized to represent and partition the semantic structure of the site. The elements mentioned above, as well as semantic elements like `<figcaption>`, `<figure>`, `<mark>`, and `<summary>`, also have only `HTMLElement` as their DOM interface.

Of course, not all semantic tags lack unique DOM interfaces. They possess distinct DOM interfaces if specific requirements exist. The key takeaway is that when there are no requirements, they become `HTMLElement`.

This principle applies not only to HTML5 elements but also to older elements such as `<dl>`, `<dt>`, `<dd>`, `<bdo>`, `<cite>`, and `<em>`, which have existed for a long time but do not have additional interface requirements, making them `HTMLElement`. [Moreover, elements with the HTMLElement interface can be seen in the HTML specifications.](https://html.spec.whatwg.org/multipage/indices.html#element-interfaces)

For example, an instance of a semantic element with specific DOM interface requirements is the `<details>` element, which has the open attribute, thereby necessitating a separate DOM interface. [Similarly, the `<time>` element has the `datetime` attribute, requiring its own DOM interface.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)

# 3. Some Exploration of Counterexamples

However, several facts remain that hinder a clear resolution to this question. Not all elements without additional requirements become `HTMLElement`. For instance, the `<span>` element has a unique DOM interface known as `HTMLSpanElement`.

[`HTMLSpanElement` represents the `<span>` element but does not possess additional properties or methods.](https://developer.mozilla.org/ko/docs/Web/API/HTMLSpanElement) [According to the specifications, it is only indicated to be useful when used with global attributes.](https://html.spec.whatwg.org/multipage/text-level-semantics.html#htmlspanelement)

The old HTML standards were notoriously not adhered to, and many elements once existed that are no longer present.

![Web developers are known for not adhering to HTML standards](./your-opposite.png)
[Image source](https://gigglehd.com/gg/bbs/13526687)

Consider the relatively recent and standardized HTML5 where the `<picture>` element exists. This element also [has its own DOM interface called `HTMLPictureElement`, but does not possess specific interface requirements compared to `HTMLElement`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLPictureElement) Due to time restrictions, I could not explore further; however, there are likely other elements that, despite having no additional requirements, have their own DOM interfaces.

So why do these elements have distinct interfaces? Though I have not found definitive explanations, I could speculate regarding `<span>` and `<picture>`. Ultimately, it appears they may have been created as contingency measures for certain situations.

## 3.1. Picture

The `<picture>` element is intended to wrap multiple sources to provide the browser with various image sources. For detailed treatment, refer to [Getting Responsive Images in HTML](https://witch.work/posts/html-responsive-image#3.-%EC%95%84%ED%8A%B8-%EB%94%94%EB%A0%89%EC%85%98-%EB%AC%B8%EC%A0%9C%EC%99%80-picture) or the MDN documentation.

Although it indeed has no unique DOM interface requirements, allowing for no differences when compared with `HTMLElement`, the nature of image handling means that new requirements could arise, which may explain its creation.

In fact, there have been discussions surrounding this. The notion was to create the `HTMLPictureElement` corresponding to `<picture>` and introduce properties or events for controlling the internal images. The control logic was also suggested to be placed within a shadow DOM structure, and there were proposals to mandate that `<img>` be placed as a child of `<picture>`.

> Can we hide the "controlling" `<img>` in shadow DOM? And make  
HTMLPictureElement the interface that proxies relevant properties/events  
to the internal `<img>`?
>
> W3C Mailing List, [whatwg] `<picture>` redux 
> https://lists.w3.org/Archives/Public/public-whatwg-archive/2013Nov/0295.html

Although this proposal seems to have been rejected, given the lack of additional interfaces in `HTMLPictureElement`, it demonstrates that there were attempts to introduce something to `<picture>`. Thus, it can be hypothesized that the `HTMLPictureElement` was designed with potential future requirements in mind.

## 3.2. Span

When did the usage of `<span>` begin? According to [caniuse](https://caniuse.com/?search=span), support started primarily in the 2010s, and since support does not equate to immediate widespread use, it is reasonable to estimate that `<span>` became widely used only after the early 2010s.

What was happening in the web during that time? Web components were gaining significant attention. With the advent of frameworks such as React and other component-based solutions, the technology was beginning to form a business landscape that became associated with specific technologies, leading to renewed interest in the concept of web components.

While I will delve into this topic more thoroughly in the future, the concept allowed developers to write JavaScript that functioned similarly to HTML by extending the `HTMLElement` class, akin to the older React class components.

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

Using this structure, it was possible to implement the following:

```html
<x-search name="Web Components"></x-search>
```

This technology allowed collaborativity with other frameworks like React and Vue, offering their advantages. However, the issue arose with browsers older than IE11, as they could not support this technology. In such cases, the fallback HTML could be added as children to an element styled using `HTMLUnknownElement`, which could inherit styles from `HTMLElement` even if the legacy browser did not understand the custom element.

```html
<current-time>
    /* fallback html */
    13:00
</current-time>
```

In this context, using the `<span>` element as fallback HTML proved practical. In legacy browsers that did not support custom elements, the `<span>` was treated as `HTMLUnknownElement`, which inherits from `HTMLElement` and thus possessed the default display property of `inline`.

However, randomly selecting any element derived from `HTMLElement` for use as fallback HTML was not a feasible option. For example, while `<b>` also belongs to `HTMLElement`, it has a default bold styling, thus making it cumbersome to manipulate if needed for fallback.

In my view, developers likely considered `<span>` the most suitable tag for fallback. `HTMLSpanElement`, inheriting from `HTMLElement` with a `display:inline` value, was also available for use even in browsers below IE11. [In fact, it was advised to favor the `<span>` element over custom elements due to severe issues with compatibility in browsers below IE8.](https://stackoverflow.com/questions/6854757/custom-tags-not-working-in-ie8/6854817#6854817)

Functioning effectively as fallback HTML for custom elements and even fulfilling a complementary role made `<span>` a tag that seemed more likely to be in line for the possibility of having additional features, leading to the hypothesis that its separate DOM interface was established with potential future needs in mind.

## 3.3. Additional Notes

The W3C mailing archives contain discussions regarding these additional DOM interfaces. Some of the proposals are quite intriguing, such as discussing the DOM interface for `<section>`, proposing an `HTMLSectionElement` interface that would include the property `headingElement`, which indicates the section's title. However, this too was rejected. [More details can be found here.](https://lists.w3.org/Archives/Public/public-whatwg-archive/2004Nov/0095.html)

# References

https://stackoverflow.com/questions/65721709/why-is-there-no-htmlsectionelement-and-no-htmlarticleelement-in-javascript

https://stackoverflow.com/questions/36268712/htmlspanelement-vs-htmlunknownelement

https://stackoverflow.com/questions/6854757/custom-tags-not-working-in-ie8

https://developer.mozilla.org/ko/docs/Web/API/HTMLDivElement

https://developer.mozilla.org/ko/docs/Web/API/HTMLSpanElement

Creating Custom Elements https://ui.toast.com/posts/ko_20170609

https://meetup.nhncloud.com/posts/115

W3C Public Mailing Archive https://lists.w3.org/Archives/Public/

https://lists.w3.org/Archives/Public/public-whatwg-archive/2013Nov/0296.html

https://yozm.wishket.com/magazine/detail/1193/

https://legacy.reactjs.org/docs/web-components.html
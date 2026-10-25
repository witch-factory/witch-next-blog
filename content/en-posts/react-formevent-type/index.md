---
title: Why React's FormEvent Type Was Deprecated
date: "2026-06-29T00:00:00Z"
description: "Why React's FormEvent type was deprecated and what to use instead"
tags: ["react", "typescript"]
---

# Deprecating the FormEvent type

When working in frontend development, you end up writing form handler functions over and over again. These days, repetitive work like this is naturally handled almost entirely by AI autocomplete. Today, I was writing a familiar form submit handler that most frontend developers have probably seen many times.

```ts
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // form 제출 처리 로직
};
```

But then I noticed that `FormEvent` was struck through and showed a deprecation warning. The warning said this:

> @deprecated
> FormEvent doesn't actually exist. You probably meant to use ChangeEvent, InputEvent, SubmitEvent, or just SyntheticEvent instead depending on the event type.

I had used this type without issues in other projects, so I assumed it had been deprecated in a recent version of `@types/react`. And as the warning suggested, switching to `SubmitEvent` resolved it immediately.

But why was `FormEvent` deprecated in the first place? In this post, I looked into the reason.

# The cause - DOM API interfaces and types

Events like clicking the mouse or entering a value into an input are based on the DOM API interface called `Event`. If an event needs additional properties, it is defined as a separate event type.

For keyboard input, there is a separate interface called `KeyboardEvent`. `KeyboardEvent` includes extra properties such as `key`, which tells you which key was pressed. Mouse click events do not have properties like `key`, but instead include properties such as `clientX` and `clientY` to indicate the click position. Since each event needs different properties, defining separate interfaces when necessary is perfectly natural.

React then provides an event object called `SyntheticEvent`, which wraps these real DOM events. The specific differences are outside the scope of this post, but it mainly handles things like browser compatibility. What matters here is that React provides an interface that is almost the same as the DOM event interface.

So naturally, `@types/react` should follow that model.[^1] For events that have their own interface, `@types/react` provides a dedicated type. For example, the `KeyboardEvent` type defined by `@types/react` looks like this, and it is almost identical to the real DOM `KeyboardEvent` interface. The exact type definition is not important here, so just treat it as an example showing that they are roughly equivalent.

```ts
interface KeyboardEvent<T = Element> extends UIEvent<T, NativeKeyboardEvent> {
	altKey: boolean;
	/** @deprecated */
	charCode: number;
	ctrlKey: boolean;
	code: string;
	/**
	 * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
	 */
	getModifierState(key: ModifierKey): boolean;
	/**
	 * See the [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values). for possible values
	 */
	key: string;
	/** @deprecated */
	keyCode: number;
	locale: string;
	location: number;
	metaKey: boolean;
	repeat: boolean;
	shiftKey: boolean;
	/** @deprecated */
	which: number;
}
```

A separate event type does not always mean there is a separate DOM interface. Events such as `ChangeEvent`, which has a type in `@types/react`, also do not have their own dedicated interface. But the [change event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event) clearly exists even if it does not have its own interface.

In other words, to define a separate event type, there should either be a separate DOM interface or at least a real event behind it. That seems reasonable.

So what about `FormEvent`, the one showing the deprecation warning? There is no such event interface, and there is no such event either.

```ts
addEventListener("change", (event) => {})
addEventListener("submit", (event) => {}) // 이런 이벤트들은 존재한다

addEventListener("form", (event) => {}) // 이런 이벤트는 없음
```

And in `@types/react`, it was effectively identical to `SyntheticEvent`. There was no real interface to define in the first place. (You might then wonder why `ChangeEvent` still exists, but I will explain that later.)

```ts
// 기존의 FormEvent 타입 정의
interface FormEvent<T = Element> extends SyntheticEvent<T> {}
```

So `FormEvent`, which was defined for an event that does not actually exist, was deprecated in favor of event types that match the real use case, such as `ChangeEvent`, `InputEvent`, and `SubmitEvent`, as the warning message suggested.

# Additional details

The DefinitelyTyped PR #74383 that deprecated `FormEvent` also included some discussion and a few additional changes. Those changes were the addition of `SubmitEvent` and a change to the `target` type of `ChangeEvent`. In this section, I will briefly go over both.

## Discussion around the breaking change

[That PR](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/74383/changes) tried to minimize the impact as much as possible. It only deprecated the type instead of removing it immediately, and it applied the deprecation only to the latest type version, React 19.

Even so, it seems that many projects still had their CI affected and builds broke. [There were comments about that in the PR as well.](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/74383/changes#issuecomment-3807791053)

The PR author considered this too, and even mentioned in the PR description that if the impact turned out to be too large, they would revert it and postpone the change to React 20. But the follow-up reply was even more memorable:

> If we have to defer every change until the next major update, we can almost never make progress. The changes in this PR fix clear bugs that should be corrected.
>
> [Original comment](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/74383/changes#issuecomment-3810403824)

Even the person who had commented that this update broke their CI replied in a way that showed they found that reasoning fair.

## Adding SubmitEvent

As the name suggests, `SubmitEvent` is the DOM interface for HTML form submission events. It includes a `submitter` property, which indicates which element triggered the form submission. According to MDN, this interface has existed since at least 2021, but it was only added to `SyntheticEvent` recently.

Judging from [the PR description](https://github.com/react/react/pull/35590), this may have been due to browser compatibility concerns, or perhaps it simply never got raised as an issue. [In fact, the first React issue specifically about `SubmitEvent` was not opened until 2025.](https://github.com/react/react/issues/33033)

Also, React updated this `SubmitEvent` support on January 22, 2026, and DefinitelyTyped PR #74383 was opened on January 23, 2026. So it looks like React was updated first, and the type definitions were updated immediately afterward. If anything, deprecating `FormEvent` looks like an extension of adding `SubmitEvent`.

## About the ChangeEvent target type change

PR #74383 also changed the `target` type of `ChangeEvent`. I suspect this was done to improve the typing of `ChangeEvent`, one of the suggested replacements for `FormEvent`. Let’s look at that a bit more closely.

```ts
// 기존의 ChangeEvent 타입 정의
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
	target: EventTarget & T;
}

// 변경된 ChangeEvent 타입 정의
/**
 * change events bubble in React so their target is generally unknown.
 * Only for form elements we know their target type because form events can't
 * be nested.
 * This type exists purely to narrow `target` for form elements. It doesn't
 * reflect a DOM event. React fires change events as {@link SyntheticEvent}.
 */
interface ChangeEvent<CurrentTarget = Element, Target = Element> extends SyntheticEvent<CurrentTarget> {
	// TODO: This is wrong for change event handlers on arbitrary. Should
	// be EventTarget & Target, but kept for backward compatibility until React 20.
	target: EventTarget & CurrentTarget;
}
```

Why make this change? Since `ChangeEvent` is one of the suggested replacements for `FormEvent`, it makes sense that they wanted to support it better. The code comments explain part of it, but with a bit more context, the reasoning becomes clearer.

DOM events have both a `target` property and a `currentTarget` property. I wrote about this in more detail in [A study of e.target and e.currentTarget](https://witch.work/ko/posts/react-target-vs-currenttarget), but briefly:

- `target`: the element where the event actually occurred. Example: if you click a `<button>`, the click event’s `target` is the `<button>`.
- `currentTarget`: the element where the event handler is actually attached. Example: if the handler is attached to a `<div>` and you click a `<button>` inside it, the click event’s `currentTarget` is the `<div>`.

The problem is that the element where the event actually occurs is determined at runtime. So it is impossible to know the exact type of `target` at compile time.

So what should the `target` type of `ChangeEvent` be? In general, it should be just `EventTarget`, because you do not know what element it will be. In code like the following, `e.target` inside `handleChange` could be either the `<div>` or the `<input>` inside it.

```tsx
<div onChange={handleChange}>
  <input 
	type="text"
	// input props...
  />
</div>
```

But for form elements, the element where the event occurred is guaranteed to be the form element itself. Form elements such as `input` or `select` cannot have child elements that fire their own change event for that same form control. A `<select>` can contain child elements like `<option>`, but the place where the `ChangeEvent` occurs is still guaranteed to be the `<select>` itself.

Put differently, for form elements, `currentTarget` and `target` are the same. So the `ChangeEvent` type definition was changed in order to narrow the `target` type for change events that occur on form elements.

However, the maintainers made one compromise here. Based on everything explained so far, the `target` type of `ChangeEvent` should really be `EventTarget & Target`. (The original comment explicitly says this too.)

```ts
interface ChangeEvent<CurrentTarget = Element, Target = Element> extends SyntheticEvent<CurrentTarget> {
	target: EventTarget & Target;
}

// 사용할 때는 이렇게. 여기서는 Input에 사용한다고 가정하자
const handleChange = (e: React.ChangeEvent<CurrentTarget, HTMLInputElement>) => {
  // e.target은 제네릭에 의해 HTMLInputElement 타입으로 추론됨
};
```

But in practice, they could not apply this immediately. Code like the following would break right away. Since the `Target` generic is not explicitly provided, it would default to `Element`, and `EventTarget & Element` does not have a `value` property.

```ts
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// e.target.value 사용
}
```

So what about this instead? Just make the first generic parameter `Target`.

```ts
interface ChangeEvent<Target = Element> extends SyntheticEvent<Target> {
	target: EventTarget & Target;
}
```

The problem is that this type extends `SyntheticEvent`. If you trace the structure of `SyntheticEvent`, its first generic parameter is used as the type of `currentTarget`. So with this change, the type of `currentTarget` would also be inferred as `Target`. Since `target` and `currentTarget` can be different, that would be an incorrect type definition.

In the end, `currentTarget` and `target` need to be different types, but doing that properly would break existing code. So for backward compatibility, the maintainers left `target` as `EventTarget & CurrentTarget` for now, and added a TODO comment indicating that this can be changed in React 20. In other words, the current `target` type of `ChangeEvent` is specifically for use with form elements.

# Final thoughts

I started looking into this because I noticed that `FormEvent` had been deprecated in a project I was working on. In practice, the fix is not difficult. In most cases, replacing it with `ChangeEvent` or `SubmitEvent` is enough.

But I wanted to understand *why* it had been deprecated. And as is often the case when digging into seemingly small details, I found a lot of interesting things. Seeing that `SubmitEvent` had existed since 2021 but was absent from React for so long reminded me that even major open source projects are not always perfect. And seeing the compromise around the `target` type gave me a glimpse into the trade-offs open source maintainers have to make.

Fixing warnings is easy, and it is something I do constantly as a developer. But whenever I follow the trail behind them, I always find something interesting. This time was no different.

# References

DefinitelyTyped PR #69436 comment https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/69436#discussioncomment-15572952

DefinitelyTyped PR #74383 https://github.com/DefinitelyTyped/DefinitelyTyped/pull/74383/changes

DefinitelyTyped discussion #69436 https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/69436

react PR #35590 https://github.com/react/react/pull/35590

MDN Docs, Event https://developer.mozilla.org/ko/docs/Web/API/Event

MDN Docs, SubmitEvent https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent

[^1]: DefinitelyTyped, which defines React’s types, is an independent project, but since React maintainers also participate in it, it makes sense to view them as effectively connected. The person who opened DefinitelyTyped PR #74383, which deprecated FormEvent, is also a React maintainer and the same person who submitted the PR adding SubmitEvent to React.
---
title: React의 FormEvent 타입은 왜 deprecated 되었을까?
date: "2026-06-29T00:00:00Z"
description: "React의 FormEvent 타입이 deprecated된 이유와 대체 방법"
tags: ["react", "typescript"]
---

# FormEvent 타입의 deprecate

프론트 개발을 하다 보면 폼의 핸들러 함수는 지겹도록 많이 작성하게 된다. 요즘 시대에는 이런 반복 작업에 가까운 건 당연히 거의 전부 AI 자동완성으로 작성한다. 나는 오늘도 프론트 개발자라면 자주 보았을 이런 형태의 form submit handler 함수를 작성중이었다.

```ts
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // form 제출 처리 로직
};
```

그런데 `FormEvent`에 취소선이 그어지고 deprecated 경고가 뜨는 것을 보았다. 경고문은 이런 내용이었다.

> @deprecated
> FormEvent doesn't actually exist. You probably meant to use ChangeEvent, InputEvent, SubmitEvent, or just SyntheticEvent instead depending on the event type.

다른 프로젝트에서는 잘 쓰던 타입이라 아마 최신 `@types/react` 버전에서 deprecated 된 것으로 추측했다. 그리고 deprecated 경고에서 안내하는 대로 `SubmitEvent`를 사용하자 경고는 바로 해결되었다.

그런데 왜 `FormEvent` 타입이 deprecated 되었을까? 이 글에서는 그 이유를 알아보았다.

# 원인 - DOM API 인터페이스와 타입

사용자가 마우스를 클릭하거나 입력창에 값을 입력하는 등의 이벤트들은 `Event` 라는 DOM API의 인터페이스를 기반으로 한다. 이 중에 추가적인 속성이 필요한 이벤트가 있으면 별개의 이벤트로 정의된다.

키보드를 누르는 이벤트의 경우 `KeyboardEvent`라는 별도의 인터페이스가 정의되어 있다. `KeyboardEvent`에는 이벤트가 일어난 키의 키값을 알려주는 `key` 등의 속성이 추가적으로 들어 있다. 마우스를 클릭하는 이벤트에는 `key`와 같은 속성이 없는 대신 마우스를 클릭한 위치를 알려주는 `clientX`, `clientY` 등의 속성이 들어 있다. 이런 식으로 이벤트마다 필요한 속성이 다르기 때문에 필요할 경우 별도의 인터페이스를 정의하는 건 자연스럽다.

그리고 리액트는 이런 실제 DOM 이벤트를 감싼 `SyntheticEvent`라는 이벤트 객체를 제공한다. 구체적인 차이는 이 글의 범위가 아니지만 브라우저 호환성을 위한 추가적인 처리 등을 담당한다. 중요한 건 리액트에서도 DOM 이벤트와 거의 동일한 인터페이스를 제공한다는 것이다.

그럼 당연히 `@types/react`에서도 이를 따라야 한다.[^1] 인터페이스가 따로 존재하는 이벤트에 대해서 `@types/react`는 별도의 타입을 제공한다. 예를 들어 `@types/react`에서 정의하는 `KeyboardEvent` 타입은 다음과 같고 이는 실제 DOM의 `KeyboardEvent` 인터페이스와 거의 동일하다. 이 타입 자체가 중요한 건 아니므로 적당히 비슷하다는 예시로 받아들이면 된다.

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

별개의 이벤트 타입 = DOM 인터페이스가 별개로 존재하는 이벤트인 건 아니다. `@types/react`에 타입이 정의된 `ChangeEvent`와 같은 이벤트도 따로 인터페이스가 존재하지는 않는다. 하지만 [change 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)는 인터페이스가 따로 있지 않을 뿐 분명히 존재한다.

즉 따로 이벤트 타입을 정의하려면 DOM 인터페이스가 별개로 존재하거나 최소한 해당 이벤트가 존재해야 한다. 타당해 보인다. 

그런데 deprecated 경고가 뜨던 `FormEvent`는 어떨까? 그런 이벤트 인터페이스는 없고 그런 이벤트도 존재하지 않는다.

```ts
addEventListener("change", (event) => {})
addEventListener("submit", (event) => {}) // 이런 이벤트들은 존재한다

addEventListener("form", (event) => {}) // 이런 이벤트는 없음
```

또한 `@types/react`에서도 이건 `SyntheticEvent`와 사실상 동일했다. 애초에 따로 정의할 인터페이스조차 없었기 때문이다. (그럼 `ChangeEvent` 같은 건 왜 그대로 존재하는가 하는 의문이 들 수 있는데 이후 설명한다)

```ts
// 기존의 FormEvent 타입 정의
interface FormEvent<T = Element> extends SyntheticEvent<T> {}
```

따라서 존재하지 않는 이벤트에 대해 정의된 `FormEvent` 타입을 deprecated 처리하고 실제 용도에 맞는 이벤트 타입, 예를 들어 경고문에도 나와 있던 `ChangeEvent`, `InputEvent`, `SubmitEvent` 등을 사용하도록 한 것이다.

# 추가 정보들

`FormEvent`를 deprecated 처리한 DefinitelyTyped PR #74383에서는 약간의 논의도 있었고 추가적인 변경사항들도 있었다. 변경사항은 `SubmitEvent`의 추가와 `ChangeEvent`의 `target` 타입 변경이다. 이 섹션에서는 이에 대해 간략히 알아본다.

## breaking change에 관한 논의

[해당 PR](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/74383/changes)은 영향 범위를 최소화하기 위해 노력했다. deprecated 처리만 하고 바로 제거하지 않았으며 가장 최신의 타입 버전(React 19)에만 이러한 deprecated 처리를 적용했다.

그럼에도 불구하고 여러 프로젝트의 CI가 영향을 받아 빌드가 깨지는 경우가 많았다고 한다. [PR의 댓글에도 그런 내용이 있었다.](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/74383/changes#issuecomment-3807791053)

PR 작성자 또한 이걸 고려했고 PR 본문에도 이 변화가 영향이 크다면 revert 후 React 20으로 해당 변경을 미루겠다고 언급했다. 하지만 이후 답변이 더 인상깊어서 가져왔다.

> 모든 변경사항을 다음 메이저 업데이트로 미루어야 한다면 우리는 거의 발전할 수 없다. 이 PR의 변경사항은 수정해야 하는 명백한 버그를 해결한다.
>
> [댓글 원문](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/74383/changes#issuecomment-3810403824)

이 업데이트로 인해 CI가 깨진다고 댓글을 달았던 사람도 적절히 납득하는 댓글을 남겼다.

## SubmitEvent의 추가

`SubmitEvent`는 이름답게 HTML form의 제출 이벤트에 대한 DOM 인터페이스이다. 폼의 제출을 위해서 쓰인 요소를 나타내는 `submitter` 속성이 존재한다. MDN 문서를 보아 최소 2021년부터 있었던 인터페이스지만 SyntheticEvent에서는 최근에 추가되었다.

[PR의 서술](https://github.com/react/react/pull/35590) 등을 보아 브라우저 호환성을 고려했을 수도 있고, 혹은 단순히 이슈레이징이 되지 않았을 수도 있다. [`SubmitEvent`에 관한 내용을 담은 이슈는 2025년이 되어서야 리액트에 처음 올라왔기 때문이다.](https://github.com/react/react/issues/33033)

또한 이 `SubmitEvent` 관련 사항을 리액트에서 수정한 날짜가 2026년 1월 22일이고 DefinitelyTyped PR #74383이 올라온 날짜가 2026년 1월 23일이므로, 리액트에서 먼저 수정하고 바로 타입 정의를 업데이트한 것으로 보인다. 오히려 `FormEvent`를 deprecated 처리한 건 `SubmitEvent` 추가의 연장선상으로 보인다.

## ChangeEvent의 target 타입 변경에 대하여

PR #74383에서는 `ChangeEvent`의 `target` 타입도 변경되었다. `FormEvent`의 대체품 중 하나인 `ChangeEvent`의 타입 보강을 위해서라고 추측한다. 해당 내용을 조금 더 리뷰해 보도록 하겠다.

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

왜 이런 변경사항을 만들었을까? `FormEvent`의 대체품 중 하나가 `ChangeEvent`인데 해당 이벤트의 타입을 더 잘 지원해 주기 위해서가 아닐까 한다. 해당 코드의 주석에도 설명이 있는데 좀 더 보충설명을 추가해 이야기하면 다음과 같다.

DOM 이벤트에는 `target` 속성과 `currentTarget` 속성이 존재한다. 이 차이는 [e.target과 e.currentTarget에 대한 연구](https://witch.work/ko/posts/react-target-vs-currenttarget)에 더 자세히 적었지만 간단하게 하면 다음과 같다.

- `target`: 이벤트가 실제로 발생한 요소를 나타낸다. 예시: `<button>`을 클릭하면 클릭 이벤트의 `target`은 `<button>`이 된다.
- `currentTarget`: 실제로 이벤트 핸들러가 등록된 요소다. 예시: `<div>`에 이벤트 핸들러가 등록되어 있고, 그 안의 `<button>`을 클릭하면 클릭 이벤트의 `currentTarget`은 `<div>`가 된다.

그런데 이벤트가 실제로 발생한 요소는 런타임에 결정된다. 따라서 `target`의 타입을 컴파일 타임에 정확히 아는 건 불가능하다.

그럼 `ChangeEvent`의 `target` 타입은 무엇이 되어야 할까? 일반적인 `EventTarget` 타입으로 두는 게 맞다. 어떤 요소가 될지 모르기 때문이다. 가령 다음과 같은 코드라면 `handleChange`의 `e.target`은 `<div>`가 될 수도 있고, `<div>` 안에 있는 `<input>`이 될 수도 있다.

```tsx
<div onChange={handleChange}>
  <input 
	type="text"
	// input props...
  />
</div>
```

하지만 폼 요소의 경우에는 이벤트가 발생한 요소가 폼 요소임이 보장된다. `input`이나 `select` 등의 폼 요소는 자신만의 change 이벤트를 발생시키는 요소를 자식으로 가질 수 없기 때문이다. `<select>`안에 `<option>`이 있는 등 자식 요소가 있을 수는 있지만 ChangeEvent가 발생한 위치는 자기 자신임이 보장된다.

이를 달리 말하면 폼 요소에서는 `currentTarget`과 `target`이 동일하다는 뜻이다. 따라서 폼 요소에서 발생하는 ChangeEvent의 `target` 타입을 좁혀주기 위해서 `ChangeEvent`의 타입 정의를 변경한 것이다.

하지만 여기서 메인테이너들이 하나 타협한 게 있다. 방금까지 설명한 대로라면 ChangeEvent의 `target` 타입은 `EventTarget & Target`이어야 한다. (원문 주석에도 이게 명시되어 있다)

```ts
interface ChangeEvent<CurrentTarget = Element, Target = Element> extends SyntheticEvent<CurrentTarget> {
	target: EventTarget & Target;
}

// 사용할 때는 이렇게. 여기서는 Input에 사용한다고 가정하자
const handleChange = (e: React.ChangeEvent<CurrentTarget, HTMLInputElement>) => {
  // e.target은 제네릭에 의해 HTMLInputElement 타입으로 추론됨
};
```

그러나 현실적으로 당장 이를 적용할 수는 없다. 당장 다음과 같은 코드가 깨질 것이다. `Target` 제네릭이 명시되지 않았으므로 `Element`로 추론되고 `EventTarget & Element` 타입에는 value 속성이 없기 때문이다.

```ts
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// e.target.value 사용
}
```

그럼 이렇게 하면 어떨까? 아예 첫 제네릭 인자를 `Target`으로 바꾸는 것이다.

```ts
interface ChangeEvent<Target = Element> extends SyntheticEvent<Target> {
	target: EventTarget & Target;
}
```

문제는 이 타입이 `SyntheticEvent`의 확장이라는 것이다. `SyntheticEvent` 타입의 구조를 따라가보면 첫 제네릭 인자가 `currentTarget`의 타입으로 쓰인다. 따라서 이렇게 바꾸면 `currentTarget`의 타입이 `Target`로 추론되어 버린다. `target`과 `currentTarget`이 다를 수 있기 때문에 이는 잘못된 타입 정의가 된다.

결국 `currentTarget`과 `target`의 타입은 달라야 하지만 이를 제대로 하려면 기존의 코드가 깨지게 된다는 것이다. 그래서 메인테이너들은 하위 호환을 위해 `target` 타입을 우선 `EventTarget & CurrentTarget`으로 두고, React 20에서 변경할 수 있도록 TODO 주석을 남겼다. 즉 현재로서 `ChangeEvent`의 `target` 타입은 오직 폼 요소에서의 사용을 위한 것이다.

# 마지막

프로젝트를 하다가 `FormEvent` 타입이 deprecated 된 걸 보고 궁금해서 여기까지 왔다. 사실 변경하는 건 어렵지 않다. 대부분 `ChangeEvent`나 `SubmitEvent`로 바꾸는 선에서 해결할 수 있다.

하지만 왜 deprecated되었는지 궁금했다. 이유를 찾다 보니, 이런 사소한 걸 파헤치는 일이 늘 그렇듯 흥미로운 게 많았다. 2021년부터 존재했던 `SubmitEvent`가 왜 오래도록 react에는 없었는지 보면서 메이저 오픈소스라고 해서 항상 완벽한 건 아니라는 걸 느끼기도 했고 `target` 타입에 대한 타협을 보며 오픈소스 메인테이너들의 고민을 엿볼 수 있었다.

경고를 해결하는 건 쉽고 개발자로서 나도 매일같이 틈틈이 하는 작업이다. 하지만 그 뒤를 따라가 보면 흥미로운 게 많다는 걸 늘 느낀다. 이번에도 역시 그랬다.

# 참고

DefinitelyTyped PR #69436 코멘트 https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/69436#discussioncomment-15572952

DefinitelyTyped PR #74383 https://github.com/DefinitelyTyped/DefinitelyTyped/pull/74383/changes

DefinitelyTyped discussion #69436 https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/69436

react PR #35590 https://github.com/react/react/pull/35590

MDN Docs, Event https://developer.mozilla.org/ko/docs/Web/API/Event

MDN Docs, SubmitEvent https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent

[^1]: 리액트의 타입을 정의하는 DefinitelyTyped는 독립된 프로젝트지만 리액트 메인테이너들 또한 참여하고 있기에 사실상 연결되어 있다고 보는 게 맞다. FormEvent를 deprecated 처리한 DefinitelyTyped PR #74383을 올린 사람도 리액트 메인테이너이며 SubmitEvent의 추가를 리액트에 PR로 올린 사람과 동일인이다.
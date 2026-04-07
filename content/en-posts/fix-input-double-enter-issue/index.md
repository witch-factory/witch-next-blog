---
title: Preventing duplicate Enter key execution when typing Korean in input, feat. isComposing
date: "2025-11-23T00:00:00Z"
description: "Fixing the bug where a handler runs twice after entering Korean text and pressing Enter, with an explanation of the root cause in IME and how to solve it"
tags: ["front", "web"]
---

# The problem

I was building a page in a side project that accepts user input. I wanted to save the value of an input through a keydown handler when the user pressed Enter after typing into the input. But I ran into an issue where the keydown handler executed one extra time for the last character.

For example, if I typed one of my favorite songs, '소문의 그애'[^1], and pressed Enter, '소문의 그애' would be saved, and then the last character of the input, '애', would also be saved separately.

## Reproduction code

There was an input field created with an `<input>` element, and the intended behavior was that pressing either 'Add' or Enter would save the string currently in that input field.

To reproduce just the part of the code related to this issue, it looked roughly like this.

Pressing the Add button or pressing Enter in the input would call `handleAddItem`, which would then append the input value to `items`.

```tsx
function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddItem = () => {
    if (inputValue.trim() === "") return;

    const newItem: Item = {
      id: Date.now(),
      text: inputValue,
    };

    setItems([...items, newItem]);
    setInputValue("");
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="새 항목을 입력하세요"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddItem();
          }
        }}
      />
      <button onClick={handleAddItem}>추가</button>
      {/* items 항목들을 표시하는 코드 */}
    </div>
  );
}
```

At this point, if I entered Korean text rather than English letters or numbers and tried to add the item by pressing Enter, the issue described above occurred. `handleAddItem` was called once for `inputValue`, and then once more for the last character of that value, so two items were added to `items`.

# Cause and solution

## The IME API

The root cause comes from the fact that Korean is a compositional writing system. The same issue also appears in languages such as Japanese and Chinese, which use compositional character input. For example, it can happen during the process of converting hiragana into kanji.

So why do compositional characters cause this problem? The reason is the IME (Input Method Editor) API, which is used to combine keyboard input into composed characters. The IME API is used for things like CJK character input and character input through touchscreen handwriting recognition, and it is usually handled by the OS.[^2]

A simple example of the IME API in action is typing `ㄱ + ㅏ` and having them combined into `가`. In this way, the IME API is involved in every Korean character we type. In many text editors, when you type Korean, you can also see the current character being composed underlined. That is also the work of the IME API.

So far, the IME API sounds like a helpful API that simply lets us type Korean. But why does it end up causing the keydown handler to run twice? Because when an Enter key event occurs during the IME composition process, that event gets handled by both the OS and the browser.

In the next section, let’s look more closely at why this happens based on how the IME API works.

## So why is Enter recognized twice?

The default behavior of the `keydown` event includes running the text composition system.[^3] Since that includes IME, pressing Enter while typing compositional characters like Korean can also complete a composition.

These composition events have an order, which looks like this.[^4]

- compositionstart: when a compositional character starts being typed
- compositionupdate: when the composition is updated by a new character input
- compositionend: when the composition is completed and a final character is produced

Let’s say you type the character '김'. When `ㄱ` is entered, the `compositionstart` event fires. Then as `ㅣ` and `ㅁ` are entered, the character changes to `기` and then `김`, and each time that happens, the `compositionupdate` event fires. Then if you type `ㅅ`, the input becomes `김ㅅ`, and the character '김' is finalized. Since one character has now been confirmed, the `compositionend` event fires.

For reference, the period between a `compositionstart` event and its corresponding `compositionend` event is called a composition session.

In other words, every time you type a Korean character, the composition system is running through `keydown` events. And here, Enter generally has the meaning of Accept, meaning it confirms the current composition.[^5]

So when I typed the Korean text '소문의 그애' into the input field in the code above and pressed Enter, the behavior was as follows. (The exact order can vary slightly by browser.)

1. The last character of '소문의 그애', namely '애', is still being composed.
2. An `"Enter"` `keydown` event occurs, because keydown events that happen during a composition session must also be processed. At this point, however, Enter is acting as composition "Accept".[^6]
3. The composition is confirmed through the composition 'accept' triggered by `"Enter"`. This happens at the OS level. (`compositionend`)
4. The browser processes the Enter `keydown` event one more time.

So the OS and the browser each handle the keydown differently. The OS treats it as finalizing text composition, while the browser treats it as the Enter `keydown` event itself, for example for line breaks or submission logic. That is why the keydown handler ends up being called twice. By contrast, non-compositional characters like English letters do not have this problem.

## Solving it with the isComposing flag

The explanation of the root cause is long, but the fix is simple.

`KeyboardEvent` has an `isComposing` property that indicates whether the event occurred during an active composition session.[^7] If you check this property and only run your intended logic, in this case the function that saves the input value, when composition is not in progress, the problem goes away.

In code, it looks like this. All I did was add a check for `isComposing` to the condition that decides whether to call `handleAddItem` inside the input’s `onKeyDown` handler.

```html
<input
  type="text"
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  placeholder="새 항목을 입력하세요"
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleAddItem();
    }
  }}
/>
```

Another option is to maintain your own `isComposing` flag and use the input’s `onCompositionStart` and `onCompositionEnd` events. Some versions of React’s Synthetic Event do not support `isComposing`, and in that case this approach works.

```tsx
const [isComposing, setIsComposing] = useState(false);

// ...

<input
  // ...
  onCompositionStart={() => setIsComposing(true)}
  onCompositionEnd={() => setIsComposing(false)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !isComposing) {
      handleAddItem();
    }
  }}
/>;
```

Managing `isComposing` state yourself like this also lets you control the behavior without browser compatibility concerns or direct access to `nativeEvent`.

# Considering alternatives

## Using the submit event of an HTML form

Is there another way? Submitting information by pressing Enter is actually a very common interaction. If you use the internet often, you’ve probably pressed Enter on a login page at least once to log in.

Naturally, if you use the HTML `<form>` tag and the submit event, which are specifically made for submission, you can handle Enter input smoothly.

So if you rewrite the input part of the code like this, the problem is solved quite easily. I added `e.preventDefault();` because the default behavior of form submission is to reload the page, and if that happens, React state is lost.

As AJAX became the norm, reloading the page on form submission stopped being strictly necessary, so I disabled it here. In a real project that also used a DB, I might not have needed `e.preventDefault();`. But that is not the main point of this article, so I won’t go into detail. What matters is that using a form lets you handle this case cleanly.

```tsx
<form
  onSubmit={(e) => {
    e.preventDefault();
    handleAddItem();
  }}
>
  <input
    type="text"
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    placeholder="새 항목을 입력하세요"
  />
  <button type="submit">추가</button>
</form>
```

## Why I didn’t choose it

In the actual project, I did not apply it this way. The reason was that this input field was part of a larger form.

In terms of the project structure, this input field was meant to build something like a list of tags. The overall form would then submit various pieces of information, including the list of tags added through this input field, and store them in the DB. So if I used a form tag just for saving the value of this input field, I would have had to put a form inside another form.

But nested forms are not allowed by the HTML standard.

> 4.10.3 The form element
>
> Content model: Flow content, but with no form element descendants.
>
> HTML Living Standard, https://html.spec.whatwg.org/multipage/forms.html#the-form-element

![nested form의 구조](./nested-form-example.jpg)

So to avoid using a nested form, I simply used the `isComposing` approach.

Of course, if you really want to use the submit event of a form, you can avoid nested forms by connecting the `input` and `button` to an external form using their `form` attribute.

```tsx
<input
  form="my-form"
  type="text"
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  placeholder="새 항목을 입력하세요"
/>
<button type="submit" form="my-form">
  추가
</button>

<form
  id="my-form"
  onSubmit={(e) => {
    e.preventDefault();
    handleAddItem();
  }}
/>
```

Still, I did not want to rely on form tags to that extent. Also, since the `form` attribute on the input tag is not something commonly used, I was even less inclined to choose it.

# Wrap-up

We looked at why pressing Enter can cause a keydown event handler to run twice unexpectedly. By understanding that the root cause lies in the IME (Input Method Editor) API used for text composition by the OS and browser, I was able to find a cleaner and more fundamental solution using the standard `isComposing` property.

I also explored the `submit` event of `form` as a more HTML-standard and general-purpose solution. But in order to make it work in this case, I would have had to either create a nested form, which the HTML standard does not allow, or use a trickier workaround, so I ultimately did not adopt it.

Still, starting from a small bug, I ended up digging into CJK input handling, form behavior, and the HTML standard spec.

# References

Input Method Editor API

https://www.w3.org/TR/ime-api/

UI Events

https://w3c.github.io/uievents/#events-composition-input-events

React, 한글 입력시 keydown 이벤트 중복 발생 현상

https://velog.io/@dosomething/React-%ED%95%9C%EA%B8%80-%EC%9E%85%EB%A0%A5%EC%8B%9C-keydown-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%A4%91%EB%B3%B5-%EB%B0%9C%EC%83%9D-%ED%98%84%EC%83%81

Improving Japanese Input UX in Multilingual Applications: Properly Handling IME Conversion

https://dev.to/oikon/improving-japanese-input-ux-in-multilingual-applications-properly-handling-ime-conversion-2ild

Event order between "compositionend" and "input"

https://github.com/w3c/uievents/issues/202

엔터 키로 전송 시 끝 글자만 전송되는 문제 해결하기

https://velog.io/@chichi2/%EC%97%94%ED%84%B0%ED%82%A4%EC%98%A4%EB%A5%98%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0

Understanding Composition Browser Events

https://medium.com/square-corner-blog/understanding-composition-browser-events-f402a8ed5643

Handling IME events in JavaScript

https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/

MDN Glossary, Input method editor

https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor

MDN, Element: compositionstart event

https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event

MDN, Element: compositionend event

https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event

Wikipedia, Input method

https://en.wikipedia.org/wiki/Input_method

HTML spec 4.10.3 The form element

https://html.spec.whatwg.org/multipage/forms.html#the-form-element

Can you nest HTML forms?

https://stackoverflow.com/questions/379610/can-you-nest-html-forms

[^1]: Murasaki Ima - Rumored Girl https://www.youtube.com/watch?v=-tO9d1Nwd0M

[^2]: https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor

[^3]: [W3C UI Events, 3.7.5. Keyboard Event Types](https://w3c.github.io/uievents/#events-keyboard-types)

[^4]: If needed, you can also log the events yourself using the [MDN, Element: compositionstart event](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event) documentation.

[^5]: [W3C UI Events, 4.3.3. Input Method Editors](https://w3c.github.io/uievents/#keys-IME)

[^6]: [W3C UI Events, 3.8.5. Key Events During Composition](https://w3c.github.io/uievents/#events-composition-key-events)

[^7]: [W3C UI Events, 3.7.1.1. KeyboardEvent](https://w3c.github.io/uievents/#idl-keyboardevent)
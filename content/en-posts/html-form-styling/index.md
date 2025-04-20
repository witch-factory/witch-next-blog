---
title: Styling Form Elements
date: "2023-08-15T03:00:00Z"
description: "How should form elements be styled?"
tags: ["HTML"]
---

# 1. History

The HTML2 standard introduced the form element in 1995. However, CSS was released in 1996, and most browsers did not support it immediately after its release.

Since browsers were already rendering form elements on their own, there was little motivation to enable CSS styling for these elements initially.

Over time, most form elements have become stylable, with a few exceptions.

Of course, there are still elements like the color picker that are challenging to style with CSS alone. Let's start by easily styling the form elements we can handle, and then we can conquer the styling of the more difficult ones.

# 2. Easily Stylable Elements

The following elements can be easily styled:

`<form>`, `<fieldset>`, `<legend>`, `<input>(except type="search")`, `<textarea>`, `<button>`, `<label>`, `<output>`

Checkboxes, radio buttons, and `<input type="search">` require slightly more complex CSS to style. The `<select>` element and certain input types have vastly different default styles across browsers, and while some styling is possible, certain aspects remain unstyleable.

In some cases, it may be better to implement the same functionality using other components that are relatively easier to style. Nevertheless, if you are willing to accept slight differences among browsers, you can achieve several styles such as size and background.

Let’s skip the easily styled elements and focus only on the challenging ones, discovering what we can do and what we cannot.

# 3. Preliminary Work

CSS related to fonts is easily applicable to any element. However, some form elements do not inherit `font-family` and `font-size` from their parents in certain browsers. Many browsers default to the system's standard font for these elements.

Thus, we should specify the styles for form elements as follows:

```css
button,
input,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
}
```

Some browsers, like those that fail to inherit `font-family` for `<input type="submit">`, necessitate the use of `<button>` tags as a remedy.

Each form element has its basic rules for borders, padding, and margins, so it is advisable to reset these. The decision about whether to use the system's default styles or to customize them is often a matter of developer preference.

```css
input,
textarea,
select,
button {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
```

## 3.1. Appearance

This CSS decides whether to apply the default styles based on the operating system UI.

```css
appearance: none;
appearance: auto;
```

Typically, it will be set to `none`. This setting disables the system styling, allowing you to apply your desired styles. You can think of it as starting with a blank slate in terms of design.

# 4. Styling Specific Elements

## 4.1. Styling the Search Box

Let’s look at the search box.

```html
<input type="search" />
```

In Safari, there are several styling limitations regarding search boxes. For instance, height and font size cannot be modified freely.

To resolve this, the `appearance` property should be set to `none`. You can then style it accordingly.

```css
input[type="search"] {
  appearance: none;
}
```

Alternatively, specifying border or background CSS may also help in overcoming these styling restrictions.

## 4.2. Styling Checkboxes and Radio Buttons

Checkboxes and radio buttons are fundamentally not resizable. When trying to adjust their size, the way they are rendered varies significantly among browsers.

The only aspect you can control is the color when activated, which can be adjusted using the `accent-color` CSS property. However, for more substantial styling changes, the `appearance` property should be set to `none` from the outset.

First, let’s write the example HTML as follows:

```html
<form>
  <fieldset>
    <legend>Checkboxes and Radio Buttons</legend>
    <p>
      Select a cake to order
    </p>
    <input type="checkbox" name="cake" value="choco" id="choco" />
    <label for="choco">Chocolate</label>
    <input type="checkbox" name="cake" value="strawberry" id="strawberry" />
    <label for="strawberry">Strawberry</label>
    <input type="checkbox" name="cake" value="vanilla" id="vanilla" />
    <label for="vanilla">Vanilla</label>

    <p>
      Select a coffee to order with the cake
    </p>

    <input type="radio" name="coffee" value="americano" id="americano" />
    <label for="americano">Americano</label>
    <input type="radio" name="coffee" value="latte" id="latte" />
    <label for="latte">Latte</label>
    <input type="radio" name="coffee" value="mocha" id="mocha" />
    <label for="mocha">Mocha</label>
  </fieldset>
</form>
```

Set the `appearance` property to none by default.

```css
input[type="checkbox"],
input[type="radio"] {
  appearance: none;
}
```

With this, the checkbox or radio button won't display anything. Now, let’s apply some styling.

For the checkbox, indicate a check mark when checked, and for the radio button, draw a circle around the selected item. This is what needs to be implemented.

Though there are various methods, we can create an element using `::before` and decide its content based on the check status with unicode.

To prevent recalculation of the layout, we will use `visibility: hidden` instead of `display:none`. The CSS for this is written as follows. While this code might not be the cleanest or best designed, the point is that this method allows for foundational styling of checkboxes and radio buttons.

```css
input[type="checkbox"],
input[type="radio"] {
  appearance: none;
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid #ccc;
  cursor: pointer;
  vertical-align: -2px;
  color: violet;
}

input[type="checkbox"]::before,
input[type="radio"]::before {
  position: absolute;
  font-size: 1.2rem;
  right: 1px;
  top: -10px;
  visibility: hidden;
}

input[type="checkbox"]:checked::before,
input[type="radio"]:checked::before {
  visibility: visible;
}

input[type="checkbox"] {
  border-radius: 5px;
}

input[type="radio"] {
  border-radius: 50%;
}

input[type="checkbox"]::before {
  content: "✔";
  top: -2px;
}

input[type="radio"]::before {
  content: "●";
  font-size: 2rem;
}
```

The result of this styling is as follows:

![Checkbox and Radio Button Styling Result](./checkbox-radio-style.png)

## 4.3. Select Element

There are two key issues with styling a `<select>` element. To illustrate, let's create a select element for choosing coffee.

```html
<form>
  <fieldset>
    <legend>Select</legend>
    <label for="coffeeSelection">Select a coffee</label>
    <select id="coffeeSelection">
      <option value="americano">Americano</option>
      <option value="latte">Latte</option>
      <option value="mocha">Mocha</option>
    </select>
  </fieldset>
</form>
```

The first issue is styling the arrow indicating that the select operates as a dropdown. This arrow varies by browser and may resize awkwardly when the select box size changes.

This issue can be somewhat resolved by specifying `appearance: none` to eliminate the default arrow before creating a new one. However, if you wish to use a separate arrow icon or require the arrow area to be clickable, achieving this purely with CSS may not suffice, and JavaScript or manually creating the select element would be necessary.

Let’s showcase what we can do. First, specify `appearance: none` to eliminate the arrow icon and margin.

Next, we will create our own icon. For this purpose, we will use `::before` and `::after`, necessitating a wrapping element for the select.

This is because elements like `::after` are positioned relative to the element's formatting box, while the select operates like a [replaced element](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element) and is placed by the browser rather than the document style, thus lacking this formatting box.

Let’s create a wrapper and apply `::after` to style it.

```html
<form>
  <fieldset>
    <legend>Select</legend>
    <label for="coffeeSelection">Select a coffee</label>
    <div class="select-wrapper">
      <select class="select" id="coffeeSelection">
        <option value="americano">Americano</option>
        <option value="latte">Latte</option>
        <option value="mocha">Mocha</option>
      </select>
    </div>
  </fieldset>
</form>
```

```css
select {
  appearance: none;
  width: 100%;
  height: 100%;
}

.select-wrapper {
  position: relative;
  width: 100px;
  height: 30px;
}

.select-wrapper::after {
  content: "▼";
  font-size: 1rem;
  top: 6px;
  right: 10px;
  position: absolute;
  color: violet;
}
```

This will display a new downward-pointing triangle arrow in violet.

The second issue is the inability to customize the box that appears when the select is clicked, containing the options. While font inheritance from the parent can be achieved, spacing and text color adjustments are not possible. This also applies to the `<datalist>` tag.

This aspect cannot be addressed within the `<select>` element itself. To resolve it, consider using a library that supports custom select elements or manually creating a selection box.

## 4.4. File Input

```html
<form>
  <fieldset>
    <legend>File Input</legend>
    <label class="fileInputLabel" for="fileInput">Choose a file</label>
    <input type="file" id="fileInput" />
  </fieldset>
</form>
```

The issue with file inputs is that the button that opens the file explorer is entirely unstyleable. Size adjustments, color changes, and even font modifications are not possible.

Therefore, to style it, take advantage of the fact that the input's label works in association with the input. Style the label corresponding to the input and hide the input itself.

Note the class given to the label.

```css
input[type="file"] {
  display: none;
}

.fileInputLabel {
  box-shadow: 1px 1px 3px #ccc;
  border: 1px solid #ccc;
  border-radius: 3px;
  text-align: center;
  line-height: 1.5;
  padding: 10px 20px;
}

.fileInputLabel:hover {
  cursor: pointer;
  background-color: #eee;
}
```

This will replace the unattractive file upload button with a styled button labeled "Choose a file," which, when clicked, opens the file explorer.

## 4.5. Range Input

Styling the bar of a range input is relatively easy, but styling the handle is quite difficult. First, let's look at the following HTML.

```html
<form>
  <fieldset>
    <legend>Range Input</legend>
    <label class="rangeLabel" for="range">Range input</label>
    <input type="range" id="range" />
  </fieldset>
</form>
```

Next, the bar can be styled as follows:

```css
input[type="range"] {
  appearance: none;
  background: violet;
  height: 3px;
  padding: 0;
  border: 1px solid transparent;
}
```

This sets the range input to function on a violet bar. To style the handle, we need to use browser-specific pseudo-elements like `::-webkit-slider-thumb`.

The following CSS is written with reference to [Styling Cross-Browser Compatible Range Inputs with CSS](https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/).

```css
/* range input bar
To ensure cross-browser compatibility, we should apply the same properties to
::webkit-slider-runnable-track, ::-moz-range-track, and ::-ms-track.
*/
input[type="range"] {
  appearance: none;
  background: red;
  height: 2px;
  padding: 0;
  border: 1px solid transparent;
}

/* thumb (handle) of the range input - Webkit */
/*
For Firefox use ::-moz-range-thumb,
For IE use ::-ms-thumb.
*/
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  border: none;
  height: 20px;
  width: 15px;
  border-radius: 3px;
  background: palevioletred;
  cursor: pointer;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
```

# 5. Elements That Are Impossible to Style

## 5.1. Date Input

Input tags like `type="datetime-local"`, `type="time"`, `type="week"`, and `type="month"` allow for basic styling like other input boxes. However, the datepicker or timepicker that appears upon clicking the input is entirely unstyleable, varying slightly by browser, and cannot be removed using `appearance: none`.

Therefore, if you want to style the picker part, you will have to create it yourself.

## 5.2. Number Input

The number input provides a spinner by default, which suffers from the same styling limitations as the date input.

However, using the `type="tel"` input, which restricts data to numbers, can be beneficial. This provides a similar text input while limiting the data to numeric values and displaying a numeric keypad on mobile devices.

## 5.3. Color Input

The border, padding, and so forth can be removed, but the color picker itself cannot be styled at all.

## 5.4. Meter and Progress

These elements are seldom used and are incredibly difficult to style. Instead of styling these, creating similar custom elements may be a better choice.

We will discuss how to create custom elements for these types later on.

# 6. Styling Using Pseudo Class Selectors

If you have dealt with CSS, you will already be familiar with pseudo-class selectors such as `:hover` and `:focus`. However, there are other pseudo-class selectors used for form elements as well. Let’s explore them through examples.

## 6.1. Indicating Required Submission Elements

Let’s assume you are creating registration elements. Some fields need to be marked as required. The `required` attribute is used for this purpose.

```html
<form>
  <fieldset>
    <legend>Sign Up</legend>
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" required />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" required />
      </div>
      <div>
        <label for="password-check">Confirm Password</label>
        <input type="password" id="password-check" required />
      </div>
      <div>
        <label for="name">Name</label>
        <input type="text" id="name" />
      </div>

      <div>
        <label for="birth">Date of Birth</label>
        <input type="date" id="birth" />
      </div>
      
      <button type="submit">Sign Up</button>
  </fieldset>
</form>
```

With this structure, you can use the `:required` and `:optional` pseudo-class selectors to differentiate between required and optional fields.

```css
input:required {
    border: 1px solid green;
}

input:optional {
    border: 1px solid red;
}
```

This will give required fields a green border and optional fields a red border. However, keep in mind that while this approach may improve visibility, it could reduce accessibility, and the conventional method of indicating required fields is to use an asterisk (*) or the text "required."

Therefore, it's better to use a `::after` pseudo-element to indicate required fields. Since the `::after` pseudo-element is positioned relative to the element's box, which the input element behaves similarly to a replaced element, we’ll add a span to properly utilize `::after`.

Here is how you can structure it:

```html
<div>
  <label for="email">Email</label>
  <input type="email" id="email" required />
  <span></span>
</div>
```

Now use the `::after` pseudo-element on the span following the required field to add a "required" text. Positioning will use `position: absolute`.

```css
input:required {
    border: 1px solid green;
}

input:optional {
    border: 1px solid red;
}

input + span {
  position: relative;
}

input:required + span::after {
  font-size: 0.7rem;
  position: absolute;
  content: "required";
  color: white;
  background-color: black;
  padding: 2px 10px;
  left: 10px;
}
```

This way, the somewhat unattractive "required" text will appear next to the required fields.

## 6.2. Validating Data Styling

The validity of the form data can also trigger specific styling. Thanks to the new input types introduced in HTML5, validation has become easier.

For example, for `<input type="email">`, if the format is incorrect, the data is deemed invalid. This scenario allows the use of `:valid` and `:invalid` pseudo-class selectors.

Similarly, these selectors can be combined with others to place indicators for current validity states via `::after`, which requires adding an empty `<span>` as done previously.

```css
input + span {
  position: relative;
}

input + span::before {
  position: absolute;
  right: -20px;
}

input:invalid {
  border: 1px solid red;
}

input:invalid + span::before {
  content: "✖";
  color: red;
}

input:valid + span::before {
  content: "✓";
  color: green;
}
```

Similar pseudo-classes like `:in-range` and `:out-of-range` exist and can be used for styling numeric inputs with `min` and `max` attributes. While they function similarly to `:valid`, they provide more information to enhance user experience when indicating invalid numbers.

## 6.3. Styling Based on the State of Form Elements

The `:enabled` and `:disabled` pseudo-class selectors can be employed for styling elements based on whether they are active or inactive.

For example, you can disable certain elements after information has been submitted and then style them using the `:disabled` selector.

A similar selector, `:read-only`, styles elements that users cannot edit but must be included in form submissions. The opposing pseudo-class selector is `:read-write`.

These apply to elements where `disabled` or `readonly` can be set. The default corresponding selectors, `:enabled` and `:read-write`, are not utilized that frequently.

## 6.4. Other Pseudo-class Selectors

Some additional pseudo-class selectors may be useful but might not have proper browser support.

Selectors like `:focus-within`, which determines if any child element is focused, and `:focus-visible`, which assesses whether an element is focused through keyboard navigation, can also be utilized.

The `:placeholder-shown` selector checks whether a placeholder is visible, allowing alternative styles to be applied while the placeholder is shown.

Another selector is `:empty`, which selects elements that contain no child elements.

# 7. Customizing Elements

Sometimes the existing form elements may feel insufficient. Alternatively, you may desire to create a custom form element. In such cases, you can create custom elements, but it's essential to note that designing functional form elements that work properly across all scenarios is a demanding task; thus, it’s usually more advantageous to utilize existing elements or third-party libraries.

However, when there is a necessity to create a new interaction element, we will review how to customize and implement one, focusing on styling a particularly challenging element like `<select>`.

Keep in mind that understanding how existing form elements function is valuable and informative.

https://developer.mozilla.org/en-US/docs/Learn/Forms/How_to_build_custom_form_controls#design_structure_and_semantics

## 7.1. Analysis

The standard `<select>` element should be usable via mouse or keyboard and must be compatible with screen readers. With these requirements in mind, let’s analyze how the `<select>` operates.

`<select>` is considered to be in the normal state under the following conditions:

- At initial loading
- When active, but the user clicks outside
- When active, but the user navigates the keyboard focus elsewhere

`<select>` is in the active state when:

- The user clicks or taps on the element
- The user focuses on the element via keyboard navigation
- The element is open, and the user clicks elsewhere

`<select>` enters the open state when:

- The user clicks the element from any other state.

Furthermore, it’s necessary to analyze when the selected value of the element changes. Although there’s a lot to analyze in terms of UI behaviors like arrow key reactions, let’s simply acknowledge the importance of analysis itself.

If you genuinely need to create a new element, thorough analysis and responsiveness to various scenarios become exceedingly crucial. Crafting a new interaction element is not easy! Ideally, one should avoid creating new interactive elements.

In any case, let's proceed to create a custom select element. The code provided here is not intended for direct implementation but serves as a demonstration.

## 7.2. HTML Structure

We start by crafting a basic structure with class names indicating each element's role. To facilitate keyboard accessibility, we assign `tabindex`, and for accessibility, we use the `role` attribute. Each `<div>` is given the role of `listbox` to indicate it groups its respective child elements with roles, while `<ul>` receives the `presentation` role to convey that it serves to display information without any special meaning.

```html
<h1>Select a Menu</h1>
<div class="select" tabindex="0" role="listbox">
  <span class="value">Americano</span>
  <ul class="option-list hidden" role="presentation">
    <li role="option" class="option">Americano</li>
    <li role="option" class="option">Café Latte</li>
    <li role="option" class="option">Café Mocha</li>
    <li role="option" class="option">Cappuccino</li>
    <li role="option" class="option">Vanilla Latte</li>
    <li role="option" class="option">Hazelnut Latte</li>
    <li role="option" class="option">Caramel Macchiato</li>
  </ul>
</div>
```

## 7.3. CSS

To ensure it behaves like a select element, the following CSS is created. The `.select::after` selector uses the `content` property to depict the downward arrow beneath the select element.

```css
.select {
  position: relative;
  display: inline-block;
}

.select.active,
.select:focus {
  outline: none;
  box-shadow: 0 0 3px 1px #227755;
}

.select .option-list {
  position: absolute;
  top: 100%;
  left: 0;
}

/* When hidden, set the maximum height to 0 and hide */
.select .option-list.hidden {
  max-height: 0;
  visibility: hidden;
}

/* Decorative CSS begins here */
.select {
  font-size: 1rem;
  box-sizing: border-box;
  padding: 0.5rem 1rem;

  width: 10rem;

  border: 1px solid #227755;
  border-radius: 4px;
  box-shadow: 0 0 3px 1px #227755;

  background-color: #fff;
}

.select .value {
  display: inline-block;
  width: 100%;
  overflow: hidden;

  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: top;
}

.select::after {
  content: "▼";
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;

  box-sizing: border-box;

  height: 100%;
  width: 2rem;
  padding-top: 0.3rem;

  border-left: 1px solid #227755;
  border-radius: 0 4px 4px 0;

  background-color: #000;
  color: #fff;
  text-align: center;
}

.select .option-list {
  z-index: 2;

  list-style: none;
  margin: 0;
  padding: 0;

  box-sizing: border-box;

  min-width: 100%;

  max-height: 10rem;
  overflow-y: auto;
  overflow-x: hidden;

  border: 1px solid #227755;
  box-shadow: 0 0 3px 1px #227755;
  background-color: #fff;
}

.select .option {
  padding: 0.5rem 1rem;
}

.select .highlight {
  background-color: #227755;
  color: #fff;
}
```

## 7.4. JavaScript

The JavaScript can be structured as follows:

```js
/* Hides the given select */
function deactivateSelect(select) {
  if (!select.classList.contains('active')) { return; }

  const optionList = select.querySelector('.option-list');
  optionList.classList.add('hidden');
  optionList.classList.remove('active');
}

// Activates the select from the selectList
function activateSelect(select, selectList) {
  if (select.classList.contains('active')) { return; }

  selectList.forEach(deactivateSelect);

  select.classList.add('active');
}

// Toggles the hidden state of the select's optionList
function toggleOptionList(select) {
  const optionList = select.querySelector('.option-list');
  optionList.classList.toggle('hidden');
}

// Highlights the option in the select's optionList
// Used when hovering over an option
function highlightOption(select, option) {
  const optionList = select.querySelectorAll('.option');

  optionList.forEach(other => {
    other.classList.remove('highlight');
  });

  option.classList.add('highlight');
}

// Updates the value of the select and aria-selected
function updateValue(select, index) {
  const value = select.querySelector('.value');
  const optionList = select.querySelectorAll('.option');

  optionList.forEach(other => {
    other.setAttribute('aria-selected', "false");
  });

  optionList[index].setAttribute('aria-selected', "true");

  value.innerHTML = optionList[index].innerHTML;
  highlightOption(select, optionList[index]);
}

// Adding event listeners
window.addEventListener('load', () => {
  const selectList = document.querySelectorAll('.select');
  
  selectList.forEach(select => {
    const optionList = select.querySelectorAll('.option');

    select.tabIndex = 0;

    optionList.forEach((option, index) => {
      option.addEventListener('click', () => {
        updateValue(select, index);
      });
    });

    optionList.forEach(option => {
      option.addEventListener('mouseover', () => {
        highlightOption(select, option);
      });
    });

    select.addEventListener('click', () => {
      toggleOptionList(select);
    });

    select.addEventListener('focus', () => {
      activateSelect(select, selectList);
    });

    select.addEventListener('blur', () => {
      deactivateSelect(select);
    });

    let index = 0; // Added to store index for keyboard navigation

    select.addEventListener('keyup', (e) => {
      if (e.key === "Escape") {
        deactivateSelect(select);
      }
      if (e.key === "ArrowDown" && index < optionList.length - 1) {
        index++;
      }
      if (e.key === "ArrowUp" && index > 0) {
        index--;
      }
      updateValue(select, index);
    });
  });
});
```

## 7.5. Fallbacks When Non-Functioning

Although nowadays rare, users may have JavaScript disabled.

Moreover, common issues include scripts failing to load due to network problems, bugs in the script, or conflicts with third-party libraries or browser extensions.

Old browsers may not support certain syntax used in the scripts, causing them to fail to function.

Interaction attempts before scripts load and initialize can also lead to dysfunctional interactions.

To prepare for these scenarios, a default `<select>` can be created to fall back on. In such cases, if the custom select loads, you would hide the default `<select>` and display the custom one.

```js
window.addEventListener("load", () => {
  document.body.classList.remove("no-widget");
  document.body.classList.add("widget");
});
```
---
title: HTML Input Tag
date: "2023-07-06T00:00:00Z"
description: "The input tag for receiving user data is powerful and feature-rich."
tags: ["HTML"]
---

While writing the article on [Creating HTML Forms](https://witch.work/posts/dev/html-form), the section on the input tag became excessively lengthy, prompting the need to separate it into a different post.

# 1. HTML Input Tag

Refer to the [MDN documentation for the input tag](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input), the [more concise table](https://developer.mozilla.org/ko/docs/Learn/Forms/How_to_structure_a_web_form#the_input_element), and the [basic form widgets](https://developer.mozilla.org/en-US/docs/Learn/Forms/Basic_native_form_controls).

The HTML input tag creates an element that can receive various types of user data. The `type` attribute specifies the kind of data to receive, and it possesses several other characteristics as well.

The behavior of this element varies significantly depending on the `type`, so it is summarized briefly for each type below. More information can be obtained from the references mentioned above.

# 2. type="text"

Provides an interface for entering a line of text. This is the default type used when the input tag's type is omitted or when the specified type is not supported by the browser (there are quite a few browsers that do not support types like `type="week"`). It only allows plain text input.

The following commonly used attributes can also be specified:

- `name`: Specifies the name of the input when form data is submitted. This name is used by the server to receive the form data.
- `value`: Sets the default value of the input. This value is ignored if the user inputs data.
- `readonly`: Prevents the user from modifying the value directly. The data is included upon form submission.
- `disabled`: Disables the input so that it cannot be modified. Data is not included upon form submission.
- `placeholder`: Displays a hint to the user within the text input box.
- `size`: Specifies the width of the text input box in terms of the number of characters.
- `minlength`, `maxlength`: Specifies the minimum and maximum number of characters that can be entered.
- `spellcheck`: When the browser supports spell checking, it allows for the checking of spelling in the entered text.
- `pattern`: Specifies a regular expression for validation. Allows only text that meets specific rules to be input.
- `required`: Makes the input mandatory for form submission; if this input is empty, the form cannot be submitted.

# 3. type="password"

Provides an interface for entering a password, masking the entered text with symbols like `*`. The `pattern` attribute can be used to validate the value with a regular expression.

However, this masking is purely visual and the original text is sent as plain text when the form is submitted. Therefore, sensitive values like passwords should be transmitted using `HTTPS` to ensure encryption.

# 4. type="hidden"

This is used for data that needs to be submitted with the form but should not be visible to the user.

## 4.1. Submitting Content ID

For example, it can be used to send the ID of the content being edited to the server.

```html
<form 
  action="serverURL" 
  method="post" 
>
  <div>
    Editing some content
  </div>
  <button type="submit" form="loginForm">Editing Complete</button>
  <input type="hidden" id="contentID" name="contentID" value="1234" />
</form>
```

By doing this, the content ID is sent to the server, allowing it to know which content is being edited.

In a similar manner, timestamps can also be sent. It is advantageous for sending invisible data to users as screen readers cannot read hidden inputs and they cannot be focused.

## 4.2. Providing Default Checkbox Value

As mentioned earlier, using the `name` and `value` attributes of checkboxes allows you to specify the value sent to the server when a checkbox is in the checked state.

However, if you want to specify the value sent to the server when the checkbox is not checked upon form submission, you can use `type="hidden"`.

```html
<form 
  action="serverURL" 
  method="post" 
>
  <input type="checkbox" id="checkboxValue" name="checkboxName" value="checkboxValue"/>
  <button type="submit">Submit</button>
  <input type="hidden" id="defaultInput" name="checkboxName" value="checkboxDefault" />
</form>
```

With this setup, even if the checkbox is not checked when the form is submitted, `checkboxName:checkboxDefault` will be sent to the server.

## 4.3. Caution

However, the value of hidden inputs can be accessed through developer tools, so sensitive information should not be exposed in this manner for security reasons.

# 5. type="checkbox"

Renders a checkbox that can change state upon clicking. The style may vary across different browsers.

It has `name` and `value` attributes, which are the values assigned when the checkbox's data is sent to the server. For example, consider the following checkbox input.

```html
<input type="checkbox" name="nickname" value="witch" />
```

When the form containing this checkbox is submitted while it's checked, the data sent through the form will include `nickname:witch`. If the value is omitted, the default is `on`.

If the checkbox is not checked when the form is submitted, its value will not be sent to the server.

The `checked` property does NOT indicate whether the checkbox is currently checked. It rather determines whether the checkbox is displayed as checked by default.

## 5.1. indeterminate

Checkboxes can have a third state known as `indeterminate`. For example, in a checkbox that indicates whether all terms and conditions are accepted—if there are three terms and less than three are checked, the checkbox can be set to an indeterminate state.

This state can be set using the `indeterminate` property of `HTMLInputElement`. It cannot be set using HTML alone.

```html
<input type="checkbox" name="agreement" id="agreement" />
<label for="agreement">Agree to All Terms</label>
```

```js
const agreement = document.getElementById("agreement");
agreement.indeterminate = true;
```

## 5.2. Grouping

For usability and accessibility, it is advisable to group related checkboxes within a `<fieldset>` that includes a `<legend>` for description.

Also, include associated `<label>` elements for each checkbox. This will improve usability by allowing users to click the label to toggle the checkbox.

## 5.3. Duplicate Names

What happens if multiple checkbox inputs have duplicate names? If you create the HTML as follows, there will be two checkboxes with the name "cake." If both are checked when the form is submitted, what will happen?

```html
<form>
  <fieldset>
    <legend>Select a Cake to Order</legend>
    <input type="checkbox" name="cake" value="choco" id="choco" />
    <label for="choco">Chocolate</label>
    <input type="checkbox" name="cake" value="strawberry" id="strawberry" />
    <label for="strawberry">Strawberry</label>
  </fieldset>
</form>
```

All values of the checkboxes will be sent to the server. The server will need to parse this into an array or similar format. For instance, in the case of the above form, the server will receive the following query string:

```
cake=choco&cake=strawberry
```

You can see that two queries with the same name "cake" are sent, and all values are transmitted rather than just the last value.

# 6. type="radio"

Used for groups of radio buttons. The `name` attribute specifies the group, and the `value` attribute designates the values for the radio buttons. Only one radio button with the same `name` can be selected, and only the `value` of the selected button will be sent with the form data.

```html
<input type="radio" name="coffee" value="Americano" id="americano" checked>
<label for="americano">Americano</label>
<input type="radio" name="coffee" value="Café Latte" id="latte">
<label for="latte">Café Latte</label>
<input type="radio" name="coffee" value="Café Mocha" id="mocha">
<label for="mocha">Café Mocha</label>
```

The `value` is not visible to the user, so generally, the `<label>` element is used to specify the label for the radio button. If the `value` attribute is omitted, the default value is unexpectedly `on`, so remember to specify the `value`.

If none of the radio buttons are selected, the corresponding data for that group will not be included in the submitted form data.

To prevent this, the `required` attribute should be added, and one radio button should have the `checked` attribute to set a default selection. Once one radio button is selected, the user has no way to deselect it except by resetting the form.

What happens if multiple radio buttons with the same `name` have the `checked` attribute? In this case, the last radio button with the `checked` attribute will be selected. Since only one item in the group can be selected, all other buttons will become deselected.

# 7. Button Types

These three types serve as buttons and can also be specified with the `<button>` tag. The `<button>` tag offers benefits, such as the ability to include internal content and easier styling.

## 7.1. type="submit"

Creates a button that submits the form. The `value` attribute can be used to specify the button's label. If omitted, the default label related to submission (which may vary among browsers) is used.

You can also use the `formaction`, `formenctype`, `formmethod`, `formnovalidate`, and `formtarget` attributes to override the corresponding attributes used in the `<form>`.

If the type of the `<button>` element is not specified, it will perform the same function as an input of this type.

## 7.2. type="reset"

Creates a button that resets all values in the form to their defaults. The `value` attribute can be used to specify the button's label. If omitted, the default label related to resetting (which may vary among browsers) will be used. Its usage is generally not recommended.

## 7.3. type="button"

Renders a push button with no specific functionality. However, you can define a click event using the `onclick` attribute.

```html
<input type="button" value="String to Use as Button Label" />
```

Nowadays, it is more preferred to use the `button` element, which can also include images and is more intuitive. However, there is no problem in using the `input` element with the button type.

You can specify a shortcut using the `accesskey` attribute. However, note that the specified key is not used alone and may require pressing a specific key combination. For details, refer to the section on [accesskey global attributes](https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/accesskey).

Nonetheless, designating shortcut keys is generally not recommended due to conflicts with accessibility or other assistive technologies.

The `disabled` attribute can easily deactivate the button.

# 8. type="image"

Use this when you want to create a submit button with an image. The `src` attribute specifies the image, and the `alt` attribute provides alternative text. The `value` attribute is not accepted.

In addition to attributes similar to `<img>`, it can also utilize attributes from other form buttons.

```html
<input type="image" id="imageInput" alt="Login Button" src="/login-button-image.png" />
```

The `src` and `alt` attributes are required.

## 8.1. formaction Attribute

The `formaction` attribute specifies the URL to which data will be submitted when this button is clicked. It takes precedence over the `action` of the form it belongs to.

## 8.2. formenctype Attribute

The `formenctype` attribute determines how the form data will be encoded. This functions similarly to the [form's enctype attribute](https://witch.work/posts/dev/html-form#4.1.1.-enctype).

It also takes precedence over the form's enctype.

## 8.3. formmethod

This decides which HTTP method will be used to submit the form data. It has the same role as the `method` attribute of the form. The default is also `get`. 

There is also a value `dialog`, which means that this button closes the `<dialog>` associated with this input.

## 8.4. Other

Attributes like `formnovalidate` and `formtarget` function similarly to the form's [novalidate and target attributes](https://witch.work/posts/dev/html-form#4.1.-form).

All these attributes take precedence over those of the form.

Moreover, when this input is used for submitting a form, the `value` specified on the button is not sent in the form. Instead, the coordinates of where the click occurred are sent as `x` and `y` properties (i.e., if the button has the name `prop`, it will send `prop.x` and `prop.y`). 

For instance, if the `formmethod` is `get` while submitting the form, the following URL is generated. Assuming the button name is `prop`:

```
https://example.com/?prop.x=10&prop.y=20
```

# 9. type="file"

Allows the selection of one or multiple files (when using the `multiple` attribute). The files can subsequently be submitted with the form or manipulated using the [File API](https://developer.mozilla.org/ko/docs/Web/API/File_API/Using_files_from_web_applications).

The `value` contains the path of the first selected file as a DOMString.

The `accept` attribute can specify allowed file types. When using the `multiple` attribute, multiple file types can be listed, separated by commas.

```html
<input type="file" name="file" id="file" accept="image/*" multiple />
```

[There are examples provided as well.](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input/file#%EC%98%88%EC%A0%9C) Notably, visually hiding the input and styling the associated label to look like a button for file uploads is quite impressive. Additionally, there are many aspects to consider, such as fetching file names/sizes.

On some mobile devices, this input can directly access the device's camera or microphone to capture and upload images or videos.

```html
<input type="file" accept="image/*;capture=camera" />
<input type="file" accept="video/*;capture=camcorder" />
<input type="file" accept="audio/*;capture=microphone" />
```

# 10. Common Attributes

There are several attributes that are common to all form elements, including `<input>`. Let’s briefly look at some of them.

## 10.1. name

Specifies the name corresponding to the value of the form element when it's submitted. This name is used by the server to receive the form data.

## 10.2. value

Specifies the default value of the form element. This value is ignored if the user inputs data.

## 10.3. disabled

Disables the form element, preventing user interaction. If this attribute is not explicitly specified, it inherits from the parent.

For example, if the `disabled` attribute is set on a `<fieldset>` element, all form elements within it will be disabled.

## 10.4. form

Specifies the ID of the `<form>` element associated with this form element. It is used for elements that are not wrapped in a `<form>`, and the associated `<form>` must be within the same document.

## 10.5. autofocus

Automatically focuses on the element when the page loads. Only one element on the page can have `autofocus`.

## 10.6. autocomplete

Determines whether previously entered values will be provided as autocompletion options (usually they are, but the values are selected by the browser). 

If set to `on`, autocompletion is provided; if `off`, it is not. If not specified, it uses the value associated with the `<form>`.

Specific values like `on`, `off`, `email`, or `username` can be designated, indicating that the browser should provide autocompletion options corresponding to these values.

# 11. type="email"

**From here on, these are input types added in HTML5. Most types are supported in nearly all browsers, but exceptions do exist. A good example is `type="week",` which is not supported in some major browsers.**

This type allows for entering an email or multiple emails.

```html
<input type="email" name="email" id="email" />
```

The input values will automatically undergo validity checks to ensure they are empty or conform to the email format. If the form is submitted with invalid values, the browser will display a warning and prevent submission.

CSS pseudo-classes like `:valid` and `:invalid` are activated based on whether the current field's value is a valid email.

On devices like smartphones, a keyboard optimized for email input, which includes the `@` symbol, may be displayed by default.

A crucial point to remember is that the validity checks of this input tag should not be solely relied upon for data validation from a security perspective. Server-side validation must always be performed on submitted data.

Client-side validity checks can be easily bypassed, as users can manipulate HTML using developer tools or submit data directly to the server using Postman, allowing them to circumvent client-side validations.

## 11.1. list Attribute

You can provide options for the user by passing the ID of a `<datalist>` element to the `list` attribute. However, this merely suggests options to the user, as they are not required to select one from the suggestions.

```html
<input type="email" name="email" list="emailList">
<datalist id="emailList">
  <option value="soakdma37@gmail.com"></option>
  <option value="foo@unknown.net"></option>
</datalist>
```

## 11.2. Other Attributes

Attributes such as `minlength`, `maxlength`, `placeholder`, `size`, and `pattern` are also applicable.

When the `multiple` attribute is specified, the user can enter several emails separated by commas or spaces.

```html
<input id="email" type="email" multiple />
```

However, note that specifying the `multiple` attribute makes an empty string a valid value, and thus it may pass validity checks when `required` is used. Therefore, if at least one email entry is mandatory, either perform manual validation using regular expressions or do not use the `multiple` attribute.

# 12. type="search"

Provides an interface for entering search terms. Functionally, it is similar to a `text` type input, but it may be styled slightly differently by different browsers.

The `name` is frequently set to `q` for queries in forms.

```html
<input type="search" name="q" />
```

Like the `text` type input, you can use the `list`, `minlength`, `maxlength`, `pattern`, `placeholder`, `readonly`, `required`, and `size` attributes with it.

## 12.1. Difference from text Type

Depending on the browser, it may render with rounded corners and show an `X` button for clearing the search term. This functionality is not available with the `text` type (unless styled with CSS). Additionally, on dynamic keyboard devices like smartphones, the keyboard may include a `search` button.

Moreover, several modern browsers may cache recent search entries and offer them as auto-complete options. 

## 12.2. Accessibility

Creating a search form like this is common, using `placeholder` to indicate it is a search field.

```html
<form>
  <div>
    <input
      type="search"
      id="mySearch"
      name="q"
      placeholder="Search the site" 
    />
    <button>Search</button>
  </div>
</form>
```

However, some screen readers may not read the placeholder, thus users may not understand the purpose of the search box. To address this, it's important to use the `role` attribute of the `<form>` tag and the `aria-label` to indicate that this is a search box.

```html
<form role="search">
  <div>
    <input
      type="search"
      id="mySearch"
      name="q"
      placeholder="Search the site"
      aria-label="Search input field"
    />
    <button>Search</button>
  </div>
</form>
```

The visual design remains unchanged while enhancing accessibility.

# 13. type="tel"

Provides an interface for entering telephone numbers. Since the format of telephone numbers varies by country, no basic validity checks are automatically provided. However, the `pattern` attribute can be used to validate the value with a regular expression.

```html
<input type="tel" id="tel" name="tel" />
```

MDN provides [examples that allow users to choose a region and validate the associated phone number format.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel#examples)

It may look like a text type, but it offers advantages. For example, mobile browsers that support this input type provide a dynamic keyboard optimized for phone number entry. However, unsupported browsers will revert to `type="text"`.

Most browsers have started to support `type="tel"`, particularly since September 3rd, 2014, when even the Android WebView browsers began to do so.

# 14. type="url"

Provides an interface for entering URLs. It automatically checks for proper URL formatting, such as whether a protocol like `http:` is included. An empty string is also considered valid. To ensure it isn't accepted, set the `required` attribute.

However, note that this validation checks only the string format, not whether a corresponding page actually exists at the URL. For more information on URL formatting, refer to [MDN - What is a URL?](https://developer.mozilla.org/ko/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL).

Browsers that support this feature provide dynamic keyboards with keys useful for URL entry. Unsupported browsers will again revert to `type="text"`.

The `pattern` attribute can be utilized to validate using a regular expression if more extensive validation is required, such as accepting only certain URLs.

# 15. type="number"

Though it visually resembles a text field, it provides an interface for entering only numeric values and performs validity checks to reject non-numeric input. Dynamic keyboard devices often provide keyboards optimized for number entry.

Generally, spinner buttons (up/down arrows) will be provided for increasing or decreasing the number. The amount of increase or decrease can be specified using the `step` attribute.

Only numbers of the form `min + step * i` that are less than `max` are allowed. The default `step` value is 1, which means that decimal places cannot be input. If decimal places are needed, specify the `step` attribute as something like 0.1 or as `any`.

You can also connect the `list` attribute to a `<datalist>` for option specification.

This type is useful for numerical inputs like age or height, which fall within certain limits. If the range is too broad, consider other options such as `tel`.

## 15.1. Accessibility

The role of `<input type="number">` is designated as `spinbutton`. If this control is not essential in the form, it is better to use `inputmode="numeric"` and enforce constraints with a `pattern` attribute to prevent unintended number changes and provide explicit feedback for non-numeric entries.

You can also use the [autocomplete](https://developer.mozilla.org/ko/docs/Web/HTML/Attributes/autocomplete) attribute to help users complete forms more quickly.

# 16. type="range"

Provides a slider interface to enter a range of numbers. The `min`, `max`, and `step` attributes can be utilized. The `value` attribute sets the default and must fall between `min` and `max`.

This slider can be manipulated using a mouse, touchpad, or keyboard arrows (when the slider is focused).

It's less precise compared to a text field, making it suitable for inputs that do not require exact values.

The `list` attribute can link with `<datalist>` to display tick marks to indicate a general range or show the current value with `<output>`. However, it is generally difficult for users to input precise values via range inputs.

# 17. Date and Time Input

Inputting dates and times has always posed challenges for web developers. Cross-browser issues, such as with datepickers and timepickers, still arise!

HTML offers input types intended to address these issues to some extent, though some input types are not supported in certain browsers and will default to `type="text"`. This means that validation provided by these input types won't function.

For environments requiring reliable cross-browser compatibility, it may be better to use well-known libraries or implement your own solution rather than relying solely on the HTML input types for date and time entry.

Even among browsers that support these input types, designs can vary widely, making libraries or custom implementations advisable.

The following date/time input fields can all use the `min`, `max`, and `step` attributes. The `list` and `readonly` attributes are also usable, with the condition that `max >= min`.

## 17.1. type="datetime-local"

Provides an interface for entering year, month, day, and time (hour/minute). 

While it is used to enter time, it does not necessarily refer to the time at the user's location. It simply collects the time value, which may be invalid in the user's timezone.

## 17.2. type="month"

Provides an interface for entering year and month. The value is formatted as `YYYY-MM`. However, the input will display a suitable representation based on the user's locale like `July 2023`.

For cross-browser compatibility, [an example for custom implementation is available](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month#examples).

## 17.3. type="time"

Provides an interface for entering time values. The `value` attribute is formatted as `HH:MM`. If seconds are included, it appears as `HH:MM:SS`.

Cross-browser support is not yet perfect, and the designs of timepickers vary among browsers. Therefore, it may be better to implement a custom solution for full cross-browser compatibility.

## 17.4. type="week"

Provides an interface for entering year and week. Despite having been around for a while, it is not widely used, as it is not supported in browsers like Firefox and Safari. It’s better to implement it yourself if this functionality is needed.

## 17.5. type="date"

Provides a text box for validating date input or an interface for selecting dates. It includes only the year, month, and day. Combinations involving time and date are supported by the previously mentioned `time` and `datetime-local` input types.

# 18. type="color"

Provides an interface for users to select colors. It includes both color pickers and RGB value inputs. The value is stored as a color code, such as `#rrggbb`, in lowercase.

```html
<input type="color" name="color" id="color" />
```

# 19. Other Attributes

The attributes used depend on the input type; refer to the [MDN documentation](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input) when needed.

# References

https://developer.mozilla.org/ko/docs/Web/HTML/Element/input

https://developer.mozilla.org/en-US/docs/Learn/Forms/Basic_native_form_controls
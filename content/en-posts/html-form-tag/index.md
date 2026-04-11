---
title: Tags Related to HTML Forms
date: "2023-07-16T00:00:00Z"
description: "Let's explore elements used in HTML forms"
tags: ["HTML"]
---

# 1. Introduction

HTML forms provide many features that allow users to interact with a website. They can send GET and POST requests needed for actions like signing up or logging in. However, these forms do not receive much attention, as evidenced by the lack of discussions around them. Honestly, I have rarely used them myself.

![html-form](./login-with-html.png)

Therefore, I would like to take some time to organize information from [MDN's HTML Forms Guide](https://developer.mozilla.org/ko/docs/Learn/Forms) and some insights I have gathered along the way. If someone is reading this article, I will assume they have basic HTML knowledge and some development experience.

# 2. Setting Up a Simple Server

Create a folder called `express-server` and run `npm init` inside it. 

Then, install express and body-parser.

```bash
npm install express --save
npm install body-parser
```

Create the `index.js` file within the folder with the following content.

```js
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/', (req, res) => {
  console.log(req.body);
  res.send('Got a POST request');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

Now, when you run `node index.js`, you will be able to access the server at `localhost:8080`, which will handle GET and POST requests.

# 3. Basic HTML Form

Let’s create a simple login form that sends a POST request to `localhost:8080`. 

```html
<form action="http://localhost:8080/" method="post">
  <label for="userid">User ID</label>
  <input type="text" id="userid" name="userid" placeholder="id" />
  <label for="userpw">Password</label>
  <input type="password" id="userpw" name="userpw" placeholder="pw" />
  <button type="submit">Login</button>
</form>
```

The `action` attribute of the form specifies the URL to send the data, and the `method` attribute specifies the HTTP method to use.

When this form is submitted, the following log will be printed on `localhost:8080`.

```bash
{ userid: 'entered id', userpw: 'entered password' }
```

The names specified in the input fields become the keys that will be received on the server.

# 4. Structuring Form Tags

There are numerous tags for creating user forms, including many well-known ones that even those who have never used the form tag might have encountered.

For instance, tags like `<input>` or `<button>` are classified as [form-related tags](https://developer.mozilla.org/ko/docs/Web/HTML/Element#%EC%96%91%EC%8B%9D). They can be used outside of form tags, often resulting in unrelated actions defined by JavaScript.

However, since we are currently investigating forms, let’s briefly review these elements in relation to forms.

## 4.1. form

The `form` tag defines a form. When defining a form in HTML, this element should always be the starting point. It is also important to note that enclosing a form within another form tag is restricted and can lead to unpredictable behavior.

The possible [attributes](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form#%ED%8A%B9%EC%84%B1) are as follows:

- `accept-charset`: Specifies the character encoding to use when submitting the form to the server. The default is `unknown`.
- `action`: Specifies the URL to send information to through the form.
- `autocomplete` (default is on): Whether the browser can autofill form items based on past user input. The default is on.
- `enctype`: Specifies the MIME type of the content to send when submitting the form. The default is `application/x-www-form-urlencoded`.
- `method`: Specifies the HTTP method to use when sending the form. The default is GET.
- `name`: Specifies the name of the form, which must be unique within the document.
- `novalidate`: Specifies that the form should not be validated before being submitted to the server. The default is false.
- `target`: Specifies how to receive the response after sending the form request. The default is `_self`.

### 4.1.1. enctype

Among these attributes, `enctype` determines how to encode form data when submitting a form.

The default is `application/x-www-form-urlencoded`, which uses the `encodeURI` function to encode characters in UTF-8 Unicode.

`multipart/form-data` submits the form using the FormData API and is sent via Ajax. This `enctype` must be used when working with forms.

`text/plain` sends the form data as plain text without encoding. It was added for debugging purposes in HTML5 and is primarily used for debugging.

## 4.2. fieldset, legend

The `<fieldset>` element is used to group related form elements. The `<legend>` element is used to describe the `<fieldset>` parent.

Most screen readers also recognize this and will read the legend before reading the contents of the fieldset.

Let's enhance the login form by utilizing these elements.

```html
<form action="http://localhost:8080/" method="post">
  <fieldset>
    <legend>Login</legend>
    <label for="userid">User ID</label>
    <input type="text" id="userid" name="userid" placeholder="id" />
    <label for="userpw">Password</label>
    <input type="password" id="userpw" name="userpw" placeholder="pw" />
    <button type="submit">Login</button>
  </fieldset>
</form>
```

This results in a form with a combined fieldset and legend. Even without any CSS, it is clear that it is a grouped form.

![fieldset-legend](./fieldset-legend.png)

This classification allows for sections of a form to be divided with `<fieldset>` and a title to be assigned with `<legend>`. This is considered an important use case in MDN examples. Of course, it should not be overused.

If the fieldset element is given the disabled attribute, it is generally displayed in gray, and the descendant controls are disabled. Additionally, it will not receive any browser events, although the form within the `<legend>` remains active.

The fieldset is a block-level element, and the legend is also a block-level element.

Currently, [a bug exists in Edge and Chrome browsers that prevents the use of flex or grid display within fieldsets.](https://github.com/w3c/csswg-drafts/issues/321)

## 4.3. label

Labels can represent descriptions for UI elements within the form. The `for` attribute links it to the UI specified by the associated id.

Linking the label to the UI means that clicking on the label activates the corresponding UI and triggers the click event. This is especially useful in checkboxes or radio buttons where a larger area can be designated as the clickable zone.

Alternatively, you can associate the label by wrapping the UI element inside it, like this:

```html
<label>
  <input type="checkbox" name="agree" />
  I agree.
</label>
```

However, in such a case, some assistive technologies might not understand the relationship between the label and the UI, so using the `for` attribute to specify an id is preferable. The above login form also employs the `for` attribute.

From an accessibility standpoint, it is advisable not to place interactive elements like buttons within the label.

The label is an inline element.

It is not recommended to connect multiple labels to a single element; instead, you can resolve this by placing a `span` tag within the label.

Additionally, if there is a particularly important element that needs reading, the `aria-label` attribute should be used. For instance, in the case below, the `*` indicates a required field and has an `aria-label` set.

```html
<label for="username">Name: <span aria-label="required">*</span></label>
<input id="username" type="text" name="username" required />
```

## 4.4. output

The `<output>` element is used to display computed outputs from user inputs. The `for` attribute can specify the id of another element to determine which element's output it corresponds to.

For example, to show the entered ID from the above login form in real time, you would do the following.

```html
<form 
  action="http://localhost:8080/" 
  method="post" 
  id="loginForm"
  oninput="result.value='User entered ID: '+userid.value"
>
  <fieldset form="loginForm">
    <legend>Login</legend>
    <label for="userid">User ID</label>
    <input type="text" id="userid" name="userid" placeholder="id" />
    <label for="userpw">Password</label>
    <input type="password" id="userpw" name="userpw" placeholder="pw" />
    <output name="result" for="loginForm">User entered ID: </output>
  </fieldset>
  <button type="submit" form="loginForm">Login</button>
</form>
```

Since we only need to display the user's ID input value, we can also specify `for` on the input.

```html
<form 
  action="http://localhost:8080/" 
  method="post" 
  id="loginForm"
  oninput="result.value=userid.value"
>
  <fieldset form="loginForm">
    <legend>Login</legend>
    <label for="userid">User ID</label>
    <input type="text" id="userid" name="userid" placeholder="id" />
    <label for="userpw">Password</label>
    <input type="password" id="userpw" name="userpw" placeholder="pw" />
    <output name="result" for="userid"></output>
  </fieldset>
  <button type="submit" form="loginForm">Login</button>
</form>
```

https://css-tricks.com/the-output-element/

## 4.5. Form Structure

As mentioned before, the form structure can also be created using HTML alone.

There are several common practices. Elements such as `li` inside `ul` or `ol` tags are often used to wrap form elements, while `p` and `div` elements are also commonly used as wrappers. Lists are often used to group checkboxes or radio buttons.

When there are complex forms within a fieldset, using a section element to classify the elements and assign title tags is also common. If there are multiple functional sections within the form, they should be categorized using sections.

# 5. input

The `<input>` element generates a field for receiving user data. The `type` attribute specifies what kind of data to expect, and it has various other attributes.

[I have separated the content due to length. HTML input tag](https://witch.work/posts/html-input-tag)

# 6. Other Form Elements

[Other form elements in MDN](https://developer.mozilla.org/en-US/docs/Learn/Forms/Other_form_controls)

## 6.1. textarea

Creates a control for inputting multiple lines of plain text, including line breaks. The `<input>` tag only allows for a single line of text. Since it only accepts text content, anything inserted will be rendered as text.

You can specify the control's size with the `cols` and `rows` attributes and dictate the wrapping method with the `wrap` attribute.

Any text placed between `<textarea>` tags becomes the default content. Setting a default value is easier than using the `value` attribute in an `input`.

The `minlength` and `maxlength` attributes allow you to specify the minimum and maximum length of characters that can be input.

```html
<textarea
  rows="5"
  cols="10"
  minlength="10"
  maxlength="100"
  name="message"
>
  Please enter your message
</textarea>
```

The size of the textarea can be controlled using CSS with the `resize` property. The default is `both`, allowing for resizing both horizontally and vertically.

## 6.2. select

You can create a selection box using `<select>` and `<option>` elements to choose one of the options. When submitting the form, the value of the `<select>` element will be the value of the selected `<option>`.

The `<optgroup>` element allows you to group options. The label value of the `<optgroup>` tag will be displayed above the options it contains.

If `<optgroup>` has the disabled attribute, all associated options will also be disabled.

```html
<form>
  <p>
    <label for="coffeeMenu">Please select your coffee order</label>
    <select id="coffeeMenu" name="coffee">
      <option value="Caramel Macchiato">Caramel Macchiato</option>
      <option value="Café Latte">Café Latte</option>
      <optgroup label="Americano">
        <option>Americano</option>
        <option>Honey Americano</option>
        <option>Hazelnut Americano</option>
      </optgroup>
    </select>
  </p>
</form>
```

The selected option will be sent as an object where the `name` attribute of the select is the key and the `value` attribute of the selected option is the value. In the case above, if Café Latte is selected, `{ coffee: 'Café Latte' }` will be sent.

Therefore, every option must possess a `value` attribute; if omitted, the text content within the option tag will be used as the value. If the `selected` attribute is specified for an option, that option will be rendered in a selected state.

If the select element carries the `multiple` attribute, it allows for selecting multiple items (in this case, the select box is no longer a dropdown) and the `size` attribute can be used to indicate how many items will be displayed at once when the select element is not focused.

Also, the `form` attribute can specify the form element that the select is associated with. This allows you to connect the form even if the select is outside it.

### 6.2.1. CSS Styling

[The select element is notorious for its difficulty in CSS styling.](https://developer.mozilla.org/ko/docs/Web/HTML/Element/select#css_%EC%8A%A4%ED%83%80%EC%9D%BC%EB%A7%81) You can remove the default appearance with properties like `appearance`, but due to its complex internal structure, results may not be consistent.

Thus, if consistent styling is essential, you may consider creating a separate dropdown menu using JS and WAI-ARIA.

## 6.3. datalist

This element provides autocomplete options when inputting form elements. If the user manually enters a value, it is ignored.

The `<datalist>` contains multiple `<option>` elements representing selectable choices, and you connect it with the `list` attribute that specifies the id of the `<datalist>` to link.

When linked through the `list` attribute, the options from the datalist will appear as autocomplete suggestions in `input` elements. They generally appear as a dropdown box.

[Example provided by MDN](https://developer.mozilla.org/ko/docs/Web/HTML/Element/datalist#%EC%98%88%EC%A0%9C)

Additionally, if connected to `<input type="color">`, it will present a palette for selecting colors.

### 6.3.1. Fallback

Although most browsers support `<datalist>`, older versions of IE or Firefox on Android prior to 2020 may not support it.

In such cases, you can create a fallback using a `<select>` element, as elements that are not `<option>` within `<datalist>` are ignored when it works.

```html
<datalist id="coffeeList">
  <label for="suggestion">Pick Menu</label>
  <select id="suggestion" name="altCoffee">
    <option>Americano</option>
    <option>Café Latte</option>
    <option>Café Mocha</option>
  </select>
</datalist>
```

If `<datalist>` functions correctly, the label and select will be ignored, and only the options will be displayed; if it doesn’t function, the selection box will appear.

## 6.4. meter, progress

The `<meter>` element indicates how much a value is positioned relative to a minimum and maximum range.

```html
<form>
  <label for="percent">Percentage</label>
  <meter
  id="percent"
  value="60"
  min="0"
  max="100"
  >
  60%
  </meter>
</form>
```

The `<progress>` element indicates the completion level of a task from 0 to `max`. Therefore, the minimum value is always 0, and depending on the value attribute less than max, the progress bar will fill up.

## 6.5. button

The `<button>` element represents a clickable button. It can be placed outside of forms as needed.

The types include `submit`, `reset`, and `button`. If not specified, `submit` is the default, and to prevent a submit action, specify `type="button"`.

Additionally, like the `input` elements specified for submission, attributes such as formaction, formenctype, formmethod, formnovalidate, and formtarget can be used to override form attributes.

### 6.5.1. button vs input

In the past, the `<button>` tag was less frequently used than `<input type="button">` due to a bug in IE6 and IE7.

This bug caused the raw content of the button to be sent instead of the value when submitting forms. Consequently, many opted for `<input>` to avoid this issue.

However, this bug was fixed in IE8, so `<button>` can be used confidently. Compared to `<input>`, `<button>` allows for more flexible styling as it can contain HTML content.

# 7. Associating Elements Outside the Form

While working with HTML, you may often use elements like `<button>` outside of forms. In such cases, an association with the form is necessary.

You can include buttons within the form. However, if this isn’t possible, the `form` attribute comes into play.

The `form` attribute can be used with elements to link them to a form. It points to the form’s id, thus creating the association. For instance, here’s how to connect a button outside of the form.

```html
<form action="http://localhost:8080/" method="post" id="loginForm">
  <fieldset>
    <legend>Login</legend>
    <label for="userid">User ID</label>
    <input type="text" id="userid" name="userid" placeholder="id" />
    <label for="userpw">Password</label>
    <input type="password" id="userpw" name="userpw" placeholder="pw" />
  </fieldset>
</form>
<button type="submit" form="loginForm">Login</button>
```

This can also be used to include fieldset elements outside of the form. Specify the form element id to connect to the fieldset via the form attribute.

The `<label>` element can also be linked to an external form using the form attribute. This allows the label to associate with the form wherever it is located.

# 8. Forms in Legacy Browsers

Supporting older browsers, such as IE or those on older smartphones, can be challenging. While browsers might convert unsupported `<input>` tag types to `type="text"` automatically, challenges remain. [MDN offers advice for such situations.](https://developer.mozilla.org/en-US/docs/Learn/Forms/HTML_forms_in_legacy_browsers)

Styling is even more complicated with legacy browser support. One can definitely feel this when consulting compatibility tables like [Property compatibility table for form controls](https://developer.mozilla.org/en-US/docs/Learn/Forms/Property_compatibility_table_for_form_controls). In such cases, using CSS’s `@supports` query to apply specific styles for legacy browsers is advisable.

Legacy browsers may use polyfills for unsupported APIs, but these engines are generally slower, compounding UI issues. Consider adopting unobtrusive JS methodologies to ensure minimal functionality and accessibility without necessitating JS. [This separates structure and behavior in HTML/CSS while ensuring essential functionality.](https://developer.mozilla.org/en-US/docs/Learn/Forms/HTML_forms_in_legacy_browsers#unobtrusive_javascript)

Alternatively, creating custom widgets may be an option if the cost and time involved are justifiable.

# References

HTML Reference, Forms Section https://developer.mozilla.org/ko/docs/Web/HTML/Element#%EC%96%91%EC%8B%9D

HTML Forms Guide https://developer.mozilla.org/ko/docs/Learn/Forms

Official Express Documentation https://expressjs.com/ko/starter/hello-world.html

Express and Body-parser https://expressjs.com/en/resources/middleware/body-parser.html

https://tech.devsisters.com/posts/functional-react-state-management/

https://dev.to/dailydevtips1/submit-button-outside-the-form-2m6f

Output Element https://css-tricks.com/the-output-element/

Forms in Legacy Browsers https://developer.mozilla.org/en-US/docs/Learn/Forms/HTML_forms_in_legacy_browsers
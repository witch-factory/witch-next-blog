---
title: Data Validation of HTML Forms
date: "2023-08-03T00:00:00Z"
description: "HTML form elements also support data validation."
tags: ["HTML"]
---

We previously reviewed the elements that can be used to create form elements with HTML. However, the primary purpose of a form is to properly submit data. Therefore, there are various methods for handling the data in the form. Let's explore them.

# 1. Form Validation

New input types introduced in HTML5, such as `<input type="email">`, allow for automatic validity checks by the browser. This is known as client-side validation.

Of course, this can be easily bypassed by sending requests directly to the server using tools like Postman. Therefore, client-side validation should not be relied upon for security purposes. The server must also perform its own validity checks on the submitted form.

However, client-side validation is an effective way to enhance user experience. It provides immediate feedback when a user inputs incorrect data, and the process is generally quick.

Client-side validation includes built-in mechanisms using input attributes and custom validations implemented with JavaScript. Using the `pattern` attribute to validate with regular expressions is considered a built-in method.

## 1.1. Overview of JavaScript Validation

Attributes used for built-in validity checks like `maxlength` are mostly found in [this article about the input tag](https://witch.work/posts/html-input-tag). Now, let’s delve into JavaScript-based validity checks.

This is referred to as the `Constraint Validation API`, which consists of methods and properties available for form elements. The DOM elements supporting these methods are as follows:

- `<input>` (HTMLInputElement)
- `<select>` (HTMLSelectElement)
- `<button>` (HTMLButtonElement)
- `<textarea>` (HTMLTextAreaElement)
- `<fieldset>` (HTMLFieldSetElement)
- `<output>` (HTMLOutputElement)

`willValidate` returns true if the element is subject to validation upon form submission; otherwise, it returns false.

`validity` holds a `ValidityState` object that contains the results of the element's validity checks. `validationMessage` returns a message describing the state when the element is invalid. If valid or if `willValidate` is false, it returns an empty string.

The keys within this object hold boolean values according to each validity check. For instance, if there is a `pattern` mismatch during validation, `patternMismatch` becomes true. Additional object properties include `tooLong`, `tooShort`, `typeMismatch`, and `valueMissing`.

The `checkValidity()` method returns the overall validity results of an element, while the `reportValidity` method is used to merely examine the validity results. There is also a `setCustomValidity(message)` method to set a custom error message.

## 1.2. Customizing Validation Messages

Using the above API, it is possible to display custom messages based on form validation. This has several advantages: firstly, styling form messages with CSS, and secondly, providing messages in multiple languages.

The default validation messages vary in content and design across browsers and countries; thus, customizing these messages with JavaScript allows for uniformity.

Let’s create a custom error message using JavaScript with a simple login form.

```html
<form>
  <fieldset>
    <legend>Member Login</legend>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required />
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required />
      <button type="submit">Login</button>
  </fieldset>
</form>
```

Next, we call the JavaScript file with a `<script>` tag.

This JavaScript file is written as follows. If the `typeMismatch` validation result for `emailInput` is false, we set the error message to an empty string using `setCustomValidity`. This indicates that the validation has passed. In contrast, setting an error message using `setCustomValidity` signifies that the validation has failed. The displayed error message may appear differently across browsers but will show below the input.

```js
// main.js
const emailInput = document.getElementById('email');

emailInput.addEventListener('input', function(event) {
  if (emailInput.validity.typeMismatch) {
    emailInput.setCustomValidity('Please enter a valid email address.');
  } else {
    emailInput.setCustomValidity('');
  }
});
```

![Email Format Mismatch](./email-typemismatch.png)

## 1.3. Customizing Validation Message Popups

By applying the `novalidate` attribute to the form, automatic validity checks by the browser are disabled. However, this does not mean that the Constraint Validation API or CSS pseudo-classes like `:valid` cannot be used. We can leverage these to create a form with our custom validation checks and custom message display methods.

First, we specify attributes for email input validation. Since the `type="email"` performs format validation, we only impose a minimum length restriction of 8 characters.

An error message will be displayed below the email input in a `<span>` tag based on the validity status. Setting `aria-live="polite"` allows screen readers to read the error messages, although screen reader priority is not that high.

```html
<!-- Disable default form validation -->
<form novalidate>
  <fieldset>
    <legend>Member Login</legend>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required minlength="8" />
      <span id="email-error-message" class="error" aria-live="polite"></span>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required />
      <button type="submit">Login</button>
  </fieldset>
</form>
```

The CSS should suitably display the error message, ensuring that the `error` class is set to not be visible by default.

It is crucial to write the following JavaScript that displays the error message based on validity checks. Every time an event occurs that changes the email input value, the validity check occurs, displaying the error message if invalid and clearing it if valid.

```js
const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error-message');

function showError() {
  if (emailInput.validity.valueMissing) {
    emailError.textContent = 'Please enter your email address.';  
  } else if (emailInput.validity.typeMismatch) {
    emailError.textContent = 'Please enter a valid email address.';
  } else if (emailInput.validity.tooShort) {
    emailError.textContent = `Email must be at least ${emailInput.minLength} characters.`;
  }

  emailError.className = 'error active';
}

emailInput.addEventListener('input', function(event) {
  if (emailInput.validity.valid) {
    emailError.textContent = '';
    emailError.className = 'error';
  } else {
    showError();
  }
});

form.addEventListener('submit', function(event) {
  if (!emailInput.validity.valid) {
    showError();
    event.preventDefault();
  }
});
```

## 1.4. Validating Without Built-in API

When customizing components related to forms, you may not be able to use the Constraint Validation API. In such cases, you will need to develop validation logic in JavaScript.

Consider what types of validity checks you want to implement, what actions to take when the checks fail, and how to assist the user in correcting their input. This falls under the realm of UI design. [Here is a link that may be helpful from MDN.](https://www.nngroup.com/articles/errors-forms-design-guidelines/)

Additionally, [this showcases an implementation example.](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#validating_forms_without_a_built-in_api)

# 2. Submitting Form Data

Once the data has been properly validated (though it should be validated once more by the server), the next step is to submit the form using the HTTP protocol. The `<form>` element allows you to specify how data transmission occurs when the user presses the submit button using the `action` and `method` attributes.

Simply put, values for form control elements, excluding files, will be encoded in the format `name=element value` and sent to the URL specified by the `action` attribute. The transmission will occur via the HTTP method specified by the `method` attribute. If no `method` is specified, it defaults to GET.

## 2.1. Action and Method

The `action` attribute specifies the URL to which form data will be submitted. It can accept both absolute and relative URLs; if omitted, it submits to the current page containing the form. If the form is on an HTTPS page and the `action` specifies an HTTP URL, the browser will display a warning.

Conversely, if the form is on an HTTP page and the `action` specifies an HTTPS URL, the browser will encrypt the data before submission.

The `method` attribute specifies the HTTP method used to submit form data. Typically, "GET" and "POST" are used. For information on these methods, refer to [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview).

When data is sent using GET, the request body is empty, so the data sent to the server is stored in the URL as a query string. GET is the default `method` value.

In contrast, if sent with POST, the request body contains the data. You can verify the form data in the request body using the network tab in the developer tools.

## 2.2. Sending Files

Sending files with HTML forms requires a different approach compared to sending regular text. Since files consist of binary data and HTTP is a text-based protocol, special handling is required when transmitting files.

This can be achieved by using the `enctype` attribute, which specifies the `Content-Type` for the request header. This indicates what type of data is being transmitted to the server. The default is `application/x-www-form-urlencoded`, which encodes form data as URL parameters.

When specifying files, you should set the `method` to POST and the `enctype` to `multipart/form-data`, as the data will be sent in multiple parts.

To allow the user to specify a file, use `<input type="file">`.

## 2.3. Security

https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data#be_paranoid_never_trust_your_users

HTML forms are a common point of server attacks. Security issues often arise from how data is managed on the server, such as SQL injection vulnerabilities.

We will delve deeper into security later, but the most important principle is to never trust user input. Even trusted users can have their computers hijacked. Therefore, it is prudent to filter out potentially harmful characters and restrict both the volume and types of incoming data. Uploaded files should ideally be stored in a separate location.

# References

https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation

https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data
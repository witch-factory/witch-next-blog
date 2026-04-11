---
title: Project Troubleshooting - Submission Timing of the Signup Form
date: "2022-08-14T00:00:00Z"
description: "Issue caused by default submit button settings in the form"
tags: ["web", "study", "front", "HTML", "react"]
---

# 1. Occurrence of the Problem

This issue arose while creating a signup form using React. Many signup forms contain two or more buttons. One of these is the signup completion button that users click after filling out the entire form. When this button is clicked, the entered signup information must be validated, and then the information should be sent to the server.

Additionally, a typical signup form includes a duplicate-check button to verify that the username or email entered by the user does not already exist among existing members. Other buttons, such as terms agreement and nickname duplicate-check buttons, may also be present. However, in this small project, there were only two buttons in the signup form: one for email duplicate checking and the other for completing the signup.

However, when the duplicate-check button was clicked, the signup form was submitted. Furthermore, pressing Enter in another input field also executed the duplicate-check action, causing the form to submit.

# 2. Structure Description

While the actual project code collected more information, the simplified structure of the signup form used in the project can be represented as follows:

```jsx
function SignUpForm() {
  return (
    <form
      className="signup-form"
      onSubmit={(e) => {
        e.preventDefault();
        alert("Form submitted");
      }}
    >
      <h1>Signup</h1>
      <label className="signup-field" htmlFor="email-form">
        <div style={{ width: "100px" }}>Email:</div>
        <input name="email" />
        <button
          onClick={() => {
            alert("Duplicate check button clicked");
          }}
        >
          Check Duplicate
        </button>
      </label>
      <label className="signup-field" htmlFor="password-form">
        <div style={{ width: "100px" }}>Password:</div>
        <input name="password" />
      </label>
      <label className="signup-field" htmlFor="password-confirm-form">
        <div style={{ width: "100px" }}>Confirm Password:</div>
        <input name="password-confirm" />
      </label>
      <button
        style={{ width: "100px" }}
        type="submit"
        onClick={() => {
          alert("Signup button clicked");
        }}
      >
        Signup
      </button>
    </form>
  );
}
```

This results in the creation of the following signup form in React. Although the layout may vary slightly due to CSS, the content will remain the same.

![signup](./signup-form.png)

# 3. Cause of the Problem

Upon investigating, it became evident that the issue was that the duplicate-check button was being treated like a submit button for the signup form. However, the type for the duplicate-check button was not explicitly defined in the code...

It was discovered that, starting from HTML5, the default submit button for a form is designated as the first submittable element (such as a button) encountered during a preorder traversal of the form's DOM tree. Consequently, the duplicate-check button, as the first button in the DOM tree, was treated as the form's submit button.

# 4. Solution to the Problem

If the type of the duplicate-check button is explicitly defined, this problem will not occur. In the provided code, since the duplicate-check button did not have a specified type, it was automatically considered the submit button for the form. Therefore, adding the `type="button"` attribute to the duplicate-check button will resolve the issue. Alternatively, one could artificially manipulate the order of buttons in the DOM tree.

```jsx
<button
  type="button"
  onClick={() => {
    alert("Duplicate check button clicked");
  }}
>
  Check Duplicate
</button>
```

# References

Stack Overflow Q&A: https://stackoverflow.com/questions/925334/how-is-the-default-submit-button-on-an-html-form-determined

Relevant section of the official HTML documentation: https://html.spec.whatwg.org/multipage/forms.html#category-submit
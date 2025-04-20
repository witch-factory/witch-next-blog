---
title: Validation and Management of Client Form Data
date: "2023-08-20T01:00:00Z"
description: "How to handle form data effectively to gain a good reputation"
tags: ["HTML"]
---

# 0. Introduction

It is common to have pages where users enter data and submit it to a server. 

Moreover, there are many instances of validating user input on the client side. Messages such as "Please enter a password with at least 8 characters and at least one special character" are familiar to most users.

As we create such pages that receive, validate, and submit user input on the client side, two considerations come to mind. The first is how to validate user input, and the second is how to manage the potentially large volume of input data.

Naturally, there are various methods to achieve these goals. Let's explore these two aspects by experimenting with simple login and signup forms.

[Additionally, this article has drawn significantly from the approach taken in the blog post by Kim Jeong-hwan.](https://jeonghwan-kim.github.io/dev/2022/03/29/react-form-and-formik.html) The code in this article is written using React.

# 1. Client Data Validation

## 1.1. Overview

Consider a page such as a signup form, where users input data that must be submitted to a server. Anyone who's used the internet has likely encountered such forms.

You often see messages like "Please enter a password of at least 8 characters and at least one special character" or "Please enter a valid email format." When these messages appear, the form cannot be submitted until the input is corrected.

How does this validation happen? One approach is to use an `onChange` handler to send the user's input data to the server each time it changes. The server then validates the data and sends back a response.

However, this method places considerable strain on the server and complicates real-time validation. While techniques like debouncing can help implement this, resorting to such advanced methods is unnecessary when effective client-side validation exists. Therefore, in many cases, real-time validation is performed on the client side.

## 1.2. Security Considerations

Of course, client-side validation is not foolproof against determined attackers who send malicious data directly to the server using tools like Postman. Therefore, server-side validation is also necessary to ensure security.

However, client-side input validation is very effective at providing quick feedback to users without burdening the server.

# 2. Using HTML

Let's consider creating a simple login form. Generally, when entering login information, validation of input values is minimal or absent. However, for illustrative purposes, we will use the login form as an example.

HTML form elements, particularly the `<input>` tag, provide basic validation functionality. Attributes like `required` are quite common. In addition, you can check for length and format without any JavaScript!

![Form submission without JavaScript](./login-with-html.png)

Let's create a login form using only HTML validation features.

## 2.1. Basic Structure of the Login Form

This is essentially a standard HTML structure without special React features.

```tsx
// src/App.tsx
function App() {
  return (
    <main>
      <form>
        <fieldset className="login-form">
          <legend>Login</legend>
          <div>
            <label htmlFor="id">Username</label>
            <input type="text" id="id" name="id" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <button type="submit">Log In</button>
        </fieldset>
      </form>
    </main>
  );
}

export default App;
```

The `login-form` class is simply used to stack the input fields vertically and provide a slight width constraint. Since design is not our focus, we can skip over that.

```css
// src/index.css
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 10rem;
}
```

## 2.2. Basic Validation

The validation attributes available for the HTML `<input>` tag include:

- `minlength`, `maxlength`: Specify the minimum/maximum number of characters allowed.
- `min`, `max`: Specify the minimum/maximum values for numeric inputs.
- `spellcheck`: Enable spellchecking for the entered text if supported by the browser.
- `pattern`: Specify a regex for validation. Only text matching this pattern is permitted.
- `required`: Marks the input as mandatory; the form cannot be submitted if this field is empty.
- `type`: Specifies the type of input (e.g., `number`, `email`), automatically enabling validation for that input type.

Using this, we can enforce that both the username and password are required, and that the username should be an email format within a specific length. Here is how we can implement this.

We used `type="email"` for validating the email format and `required` to indicate that the field is mandatory. We also set constraints using `minlength` and `maxlength` for input lengths.

```tsx
function App() {
  return (
    <main>
      <form>
        <fieldset className="login-form">
          <legend>Login</legend>
          <div>
            <label htmlFor="id">Username</label>
            <input 
              type="email" 
              id="id" 
              name="id" 
              placeholder="Please enter in email format."
              minLength={5}
              maxLength={30}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              minLength={5}
              maxLength={20}
              required
            />
          </div>
          <button type="submit">Log In</button>
        </fieldset>
      </form>
    </main>
  );
}
```

As a result, if the username doesn’t match the required format or length, an alert dialog will show upon submission.

![Email format validation with HTML](./email-html-validation.png)

Additionally, the `<input>` tag can validate using regex patterns by placing the desired regex in the `pattern` attribute. For example, to validate the format of a US phone number, you might use the following regex pattern, sourced from [a regex example site](https://regexlib.com/).

```html
<input 
  type="tel" 
  id="id" 
  name="id" 
  placeholder="Please enter your phone number"
  pattern="^[2-9]\d{2}-\d{3}-\d{4}$"
  required
/>
```

If the input does not satisfy the regex on submission, a warning will appear indicating that "Please match the requested format."

However, relying solely on this method might feel inadequate. Styling alert messages is not possible this way. More significantly, users see validation error messages only upon form submission, preventing real-time feedback.

The strength of client-side validation lies in providing real-time feedback that makes it easy for users to correct inputs immediately; if messages only appear at the submission stage, the user experience benefits are diminished.

Thus, let's customize validation messages further using the `Constraint Validation API` and `:valid`, `:invalid` pseudo-classes.

# 3. `Constraint Validation API`

## 3.1. API Introduction

Thus far, we can perform some basic validation. However, you might want to modify the content or style of warning messages, and to perform specific actions based on whether validation passes or fails. Many pages are designed this way, but what we’ve done previously doesn't support that.

To achieve this, we need to utilize the `Constraint Validation API`. 

This API comprises methods and properties available on form elements that help change messages for failed validations, trigger specified actions, or change styling.

The DOM elements that support the `Constraint Validation API` include:

- `<input>` (HTMLInputElement)
- `<select>` (HTMLSelectElement)
- `<button>` (HTMLButtonElement)
- `<textarea>` (HTMLTextAreaElement)
- `<fieldset>` (HTMLFieldSetElement)
- `<output>` (HTMLOutputElement)

On these elements, the `:valid` and `:invalid` CSS pseudo-classes can be used, closely integrated with the `Constraint Validation API`.

## 3.2. Changing Validation Message Content

Utilizing the `Constraint Validation API`, we can access the validation results of the form. This offers several benefits.

First, we can style the form’s messages using the `:valid`, `:invalid` pseudo-classes, and second, we can provide a consistent message display to users.

Default validation messages differ by browser and locale, but by customizing these messages with JavaScript, we can ensure users receive coherent validation-related feedback. Let’s implement customized message displays.

The simplest way is to change the message content using the `setCustomValidity(message)` API. Create a function that sets messages based on the validity state and assign this function to the `<input>`'s `onChange` handler.

```tsx
const checkValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { validity } = e.target;
  if (validity.typeMismatch) {
    e.target.setCustomValidity("Custom message for email format.");
  } else if (validity.tooShort) {
    e.target.setCustomValidity("Custom message for minimum length.");
  } else if (validity.tooLong) {
    e.target.setCustomValidity("Custom message for maximum length.");
  }
}

<input
  type="email"
  id="id"
  name="id"
  placeholder="Please enter in email format."
  minLength={5}
  maxLength={30}
  required
  onChange={checkValidation}
/>
```

Passing an empty string as an argument to `setCustomValidity` indicates that the user input is valid.

## 3.3. API Properties

Before delving into more customization, let’s summarize what properties the `Constraint Validation API` offers.

`willValidate` returns true if the element will undergo validation on form submission; otherwise, it returns false.

`validity` contains a `ValidityState` object with the results of the validation process. The `validationMessage` returns a description of the state when the element is invalid. It returns an empty string if the input is valid or if `willValidate` is false.

The keys within this object reflect various validation outcomes, yielding a boolean value for each. For instance, if the `pattern` validation fails, `patternMismatch` becomes true. There are additional properties like `tooLong`, `tooShort`, `typeMismatch`, and `valueMissing`.

The `checkValidity()` method returns the overall success status of the validation process, while the `reportValidity()` method merely checks the validity results. The `setCustomValidity(message)` method allows setting custom error messages.

## 3.4. Advanced Message Customization

By assigning the `novalidate` attribute to the `<form>` element, we can disable the default validation, allowing us to create entirely new messages. After all, there’s no inherent reason messages must pop up in alerts, is there?

First, place a `<span>` tag beneath each input field to display error messages.

```html
<main>
  <form noValidate>
    <fieldset className='login-form'>
      <legend>Sign Up</legend>
      <div>
        <label htmlFor='email'>Email</label>
        <input 
          type='email'
          id='email' 
          name='email' 
          placeholder='Email'
          required
          minLength={5}
          maxLength={30}
        />
        <span className='error' aria-live='polite'>
          Error message for email validation will go here.
        </span>
      </div>

      <div>
        <label htmlFor='password'>Password</label>
        <input 
          type='password' 
          id='password'
          name='password'
          placeholder='Password'
          required
          minLength={5}
          maxLength={20}
        />
        <span className='error' aria-live='polite'>
          Error message for password validation will go here.
        </span>
      </div>
      <button type='submit'>Sign Up</button>
    </fieldset>
  </form>
</main>
```

Setting the `novalidate` attribute on the `<form>` tag won’t erase validation on the `<input>`, nor will it disable the features of `:valid` and similar pseudo-classes. The validations will simply be ignored. Therefore, we need to proceed to customize the validation message through the `Constraint Validation API`.

Next, enhance the styling of the error messages and borders based on validation status. For instance, let's create red borders around invalid input fields and render error messages in red, smaller text.

```css
.login-form {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  gap: 1rem;
  width: 15rem;
}

input {
  appearance: none;
  border: 1px solid #ccc;
  margin: 0;
  margin-bottom: 0.5rem;

  box-sizing: border-box;
}

input:invalid {
  border: 1px solid red;
}

/* Remove red border when the input has focus */
input:focus:invalid {
  border: 1px solid #ccc;
  outline: none;
}

.error {
  display: block;
  width: 100%;
  padding: 0;

  font-size: 0.8rem;
  color: red;
}
```

Now, create a function that updates the error message based on validation outcomes, focusing on email validation in this example.

```tsx
const [emailError, setEmailError] = useState('Please enter an email.');

const emailValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { validity } = e.target;

  if (validity.typeMismatch) {
    setEmailError('Invalid email format.');
  } else if (validity.tooShort) {
    setEmailError('Email must be at least 5 characters long.');
  } else if (validity.valueMissing) {
    setEmailError('Please enter an email.');
  } else {
    setEmailError('');
  }
};
```

Connect this function to the `<input>`'s `onChange` handler and bind the error message to the `<span>` tag.

```tsx
<input 
  type='email'
  id='email' 
  name='email' 
  placeholder='Email'
  required
  minLength={5}
  maxLength={30}
  onChange={emailValidation}
/>
<span className='error' aria-live='polite'>
  {emailError}
</span>
```

Now the custom error message will be displayed as the input value changes.

![Validation error](./login-validation-failure.png)

Note, however, that since we set the `novalidate` attribute on the `<form>`, submission is still possible even if validations fail. To manage this, you can create a `handleSubmit` function to prevent submission when validations do not pass.

```tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  /*
  e.target.email.checkValidity(), 
  e.target.password.checkValidity()
  could be used to validate using the validation API.
  */
  if (emailError || passwordError) {
    alert('Please enter the email and password in the correct format.');
    return;
  }
  // Any submission action here
  alert('Login successful');
};
```

## 3.5. Rationale

While this logic could also be implemented by directly checking validation with `onChange` handlers and managing an `isValid` state, this would complicate the code, preventing the use of `:valid`, `:invalid` pseudo-classes. You'd also need to manage an additional state representing validation results. 

In many cases, it makes more sense to rely on HTML's basic validation functionalities, making the code less convoluted without needing to resort to `onChange` handlers.

# 4. Managing Data Neatly

## 4.1. Motivation for Data Management

Now that we can create custom validation messages and perform actions based on validation results via the `Constraint Validation API`, it may seem like developing forms to collect user inputs is straightforward. However, this is not the case. While we’ve customized validation, forms typically involve managing complex data formats, making user input handling a perennial challenge in frontend development.

As an example, let's create a more complex form than a login form—a signup form. Here’s a simplified version of a signup form (though many signup forms online require even more data).

![Basic signup form](./signup-form-basic.png)

To keep the article manageable and to avoid length issues for readers, I’ll illustrate that the code becomes lengthy and repetitive.

```tsx
function App() {
  const [nameError, setNameError] = useState('Please enter your name.');
  const [emailError, setEmailError] = useState('Please enter your email.');
  const [passwordError, setPasswordError] = useState('Please enter your password.');
  const [passwordConfirmError, setPasswordConfirmError] = useState('Please confirm your password.');
  const [phoneNumberError, setPhoneNumberError] = useState('Please enter your phone number.');

  const nameValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* Name validation logic */
  };

  const emailValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* Email validation logic */
  };

  const passwordValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* Password validation logic */
  };

  const passwordConfirmValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* Password confirmation validation logic */
  };

  const phoneNumberValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* Phone number validation logic */
  };

  return (
    <main>
      <form noValidate>
        <fieldset className='signup-form'>
          <legend>Sign Up</legend>
          <div>
            <label htmlFor='name'>Name</label>
            <input 
              type='text' 
              id='name'
              name='name'
              placeholder='Name'
              required
              minLength={5}
              maxLength={20}
              pattern={'[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]+'}
              onChange={nameValidation}
            />
            <span className='error' aria-live='polite'>
              {nameError}
            </span>
          </div>

          {/* Email, password, password confirm, phone number input fields...(omitted) */}

          <button type='submit'>Sign Up</button>
        </fieldset>
      </form>
    </main>
  );
}
```

Clearly, it's not advisable to stuff all these various logic and HTML element structures into a single component.

![First form structure](./form-structure-1.png)

So we need to find a way to split these up and create more reusable logic.

## 4.1. Creating Components

First, we can modularize these inputs into their components to manage them more effectively. This means we’ll separate the HTML structure into different components. React components truly shine here...(Notably, React wasn't the first to propose components, but that's beside the point.) Here’s how we can pass error messages and validation logic through props.

```tsx
type InputProps = {
  type: string;
  title: string;
  id: string;
  name: string;
  placeholder: string;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validProps: Record<string, number | boolean | string>;
};

function Input(props: InputProps) {
  const { type, id, name, placeholder, handleChange, validProps, error } = props;
  return (
    <div>
      <label htmlFor={id}>{title}</label>
      <input 
        type={type}
        id={id} 
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        {...validProps}
      />
      <span className='error' aria-live='polite'>
        {error}
      </span>
    </div>
  );
}
```

This component will be employed as follows. While it is possible to omit `validProps` and inject validation logic directly within the `handleChange`, we will adopt that approach later in the code.

```tsx
<Input
  type='text'
  title='Name'
  id='name'
  name='name'
  placeholder='Enter your name'
  error={nameError}
  handleChange={nameValidation}
  validProps={{
    required: true,
    minLength: 5,
    maxLength: 20,
    pattern: '[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]+',
  }}
/>
```

Thus, the section for rendering input fields has been successfully moved outside the form component.

![Second form structure](./form-structure-2.png)

## 4.2. Creating a Hook

Currently, the `App` component manages all states, adding to the complexity of state management. It might be noted that functionalities governing the form and the domain of signing up are intermixed.

To disentangle these concerns, we can separate state management into a hook that manages values and validations while exposing only the necessary logic to the `App` component. Hence, we designed a hook named `useForm`; however, the name isn't crucial.

The flow of input state management is inspired by ideas in the article [Elegantly Managing Form Data](https://tech.devsisters.com/posts/functional-react-state-management/).

```
Design of the useForm Hook:

Information managed by the hook:
- Input values within the form

Information injected into the hook:
- Function to validate the input values
- Callback function to be called when the form is submitted

Information exposed to the outside:
- Current input values
- Current validation results for the input values
- onChange handler for the inputs
- onSubmit handler for the form
```

The implementation of the `useForm` hook could look like this. Here we define a generic type `T` for the values structure, although this isn't strictly necessary given that there are alternative ways to validate the error objects.

```tsx
// src/hooks/useForm.ts
import { useState } from 'react';

function useForm<T extends Record<string, string>>(submitCallback: () => void, validate: (values: T) => T) {
  const [values, setValues] = useState<T>({} as T);
  const [errors, setErrors] = useState<T>({} as T);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    // Execute the callback if all values are valid (i.e., all error values are falsy)
    if (Object.values(errors).every(x => !x)) {
      submitCallback();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const currentValues = { ...values, [e.target.name]: e.target.value };
    setValues(currentValues);
    /* Validate in real-time */
    setErrors(validate(currentValues));
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
}

export default useForm;
```

Outside, you can invoke this hook by passing the submit callback and validation function.

```tsx
const { values, errors, handleChange, handleSubmit } = useForm<FormValues>(signUp, validate);
```

Using it would allow you to generate the form with concise code. Not all `inputName` values will necessarily correspond to a `<input>` tag type, but you could default to `type="text"` to mitigate such issues.

[To maximize user experience, one might consider validating on `onBlur` instead of `onChange`, preventing any anxiety rush to fill out forms too quickly. The choice lies with the developer.](https://jeonghwan-kim.github.io/dev/2022/03/29/react-form-and-formik.html#%EC%98%A4%EB%A5%98-%EB%A9%94%EC%84%B8%EC%A7%80%EB%A5%BC-%EB%8D%94-%EC%9D%BC%EC%B0%8D-%EB%B3%B4%EC%97%90%EC%A3%BC%EA%B8%B0)

```tsx
const inputNames: FormValues = {
  name: 'Name',
  email: 'Email',
  password: 'Password',
  tel: 'Phone Number',
};

// ...

// Input field creation
{Object.keys(inputNames).map((key) => (
  <Input
    key={key}
    type={key}
    id={key}
    name={key}
    title={inputNames[key]}
    placeholder={`Please enter your ${inputNames[key]}`}
    error={errors[key] || ''}
    value={values[key] || ''}
    handleChange={handleChange}
  />
))}
```

The validate function would follow this structure. While validation logic in real-world scenarios can be more intricate, this function essentially checks each input, returning an object filled with validation outcomes.

```ts
// src/utils/validate.ts
function validate(values: FormValues) {
  const errors: FormValues = {
    email: '',
    name: '',
    password: '',
  };

  if (!values.name) {
    errors.name = 'Name is required';
  } else if (values.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else {
    errors.name = '';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  }
  // ...
  else {
    errors.email = '';
  }

  // Validation logic for other keys...

  return errors;
}
```

Now, the form operates within this redesigned structure.

![Third form structure](./form-structure-3.png)

[The approach taken by Kim Jeong-hwan's post similarly emphasizes this structure while suggesting using the Context API for making more reusable logic.](https://jeonghwan-kim.github.io/dev/2022/03/29/react-form-and-formik.html)

## 4.3. Improving the Validation Function

After distributing responsibilities regarding complex states and structures, we started from a place of significant repetition within the validation coding process. 

Initially, I separated the HTML structure into components. After that, I partitioned the logic of form data and validation, along with submission checks, into a custom hook.

Can we make further improvements? Looking back at the ideas shared around hook design, there's still an opportunity to refine the input validation function.

Such repeatedly recurring rules might include statements like "A value is required" or "It must be a certain minimum length." These rules are likely applicable across multiple form fields, allowing us to consolidate many of them together. So let’s implement a set of small validation functions. 

```ts
/* 
Validation rule-generating functions returning an empty string if conditions are met,
or an error message if conditions fail.
*/
const minLength = (limit: number) => {
  return (name: string, value: string) => {
    if (value.length < limit) {
      return `${name} must be at least ${limit} characters long`;
    }
    return '';
  };
};

const maxLength = (limit: number) => {
  return (name: string, value: string) => {
    if (value.length > limit) {
      return `${name} must be at most ${limit} characters long`;
    }
    return '';
  };
};

const mustContain = (char: string) => {
  return (name: string, value: string) => {
    if (!value.includes(char)) {
      return `${name} must contain ${char}`;
    }
    return '';
  };
};

const required = () => {
  return (name: string, value: string) => {
    if (!value) {
      return `${name} is required`;
    }
    return '';
  };
};

const testRegex = (regex: RegExp) => {
  return (name: string, value: string) => {
    if (!regex.test(value)) {
      return `${name} is invalid`;
    }
    return '';
  };
};
```

We can now create a function that leverages these validation rule functions and returns an error if any rule fails. This allows us to combine various rules for creating specific verification logic.

```ts
const validatePipe = (name: string, value: string, validators: ((name: string, value: string) => string)[]) => {
  for (const validator of validators) {
    const error = validator(name, value);
    if (error) {
      return error;
    }
  }
  return '';
};
```

With this setup, we can define robust validation for each input value, constructing it as follows.

```ts
const validateEmail = (value: string) => {
  return (
    validatePipe('Email', 
      value, 
      [
        required(), 
        minLength(2), 
        maxLength(30), 
        mustContain('@'), 
        testRegex(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)
      ]
    )
  );
};
```

Consequently, the overall validation function can evolve to this more streamlined structure.

```ts
function validate(values: FormValues) {
  const errors: FormValues = {
    email: '',
    name: '',
    password: '',
    // Add validation for other fields...
  };

  errors.name = validateName(values.name);
  errors.email = validateEmail(values.email);
  errors.password = validatePassword(values.password);

  // Validation for other input values...

  return errors;
}
```

Though the code may seem longer at first glance, it allows for clarity, enabling new rules or modifications to be made with ease. By breaking down validation responsibilities into smaller, manageable units, we enhance the overall readability and maintainability of our codebase.

A prominent library that operates similarly to this approach is [Yup](https://github.com/jquense/yup), which supports creating and managing validation rules that can easily be combined.

## 4.4. Further Improvements?

In pursuit of easier management of complex forms, we separated the HTML structure, the state management, validation logic, and even the validation rule functions. However, we can further consider the responsibility of rendering input fields, currently managed by the `App` component, and delegate it elsewhere.

For instance, we might take a step further and hand off the rendering entirely to the `useForm` hook with a function such as `renderForm()` that automatically generates input fields.

Alternatively, we could create a `Form` component that utilizes [render props pattern](https://patterns-dev-kr.github.io/design-patterns/render-props-pattern/) to inject input component props, replicating a pattern found in Formik.

# 5. Form Libraries

The article has exceeded 800 lines so far, and various effective methods for managing form data may still be omitted due to my limitations. 

In response to these complexities, numerous libraries have emerged. [A LogRocket article introducing libraries for form validation lists at least 10 options. (Some of these might feel forced to meet that count based on star ratings.)](https://blog.logrocket.com/react-form-validation-sollutions-ultimate-roundup/)

Among these, I will briefly introduce two of the most notable libraries, Formik and React Hook Form, as they adopt different approaches to form management.

Although Redux Form exists, its coupling between Redux and form data is generally deemed too tight. Thus, libraries like React Final Form or Formik are recommended instead. React Final Form is rapidly growing, but it operates similarly to Formik, which is more widely utilized today, so I will omit it.

## 5.1. Formik

### 5.1.1. Motivation

Can we further abstract and make reusable the validation methodologies we've previously discussed? We might consider creating higher-order components. This method involves taking input parameters for our custom hook and passing them to a context API, allowing descendant components to use them as needed.

For example, by implementing a higher-order component that shares `useForm` values (e.g., values, errors, handleSubmit) with its surroundings.

```tsx
const FormContext = createContext({});

function Form({ children, ...restProps }) {
  const formValue = useForm(restProps);

  return (
    <FormContext.Provider value={formValue}>
      <form onSubmit={formValue.handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
}
```

Subsequent components can harness `useContext` to access the provided values from the `Form` context, as illustrated below.

```tsx
function Field({ name, ...restProps }) {
  const { values, errors, handleChange } = useContext(FormContext);

  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <input 
        id={name}
        name={name}
        value={values[name]}
        onChange={handleChange}
        {...restProps}
      />
      <span className='error' aria-live='polite'>
        {errors[name]}
      </span>
    </div>
  );
}
```

This structure abstracts and streamlines the configuration of the form and input fields.

```tsx
<Form
  onSubmit={handleSubmit}
  validate={validate}
>
  <Field
    name='name'
    placeholder='Enter your name'
  />
  {/* Additional fields... */}
  <button type='submit'>Sign Up</button>
</Form>
```

The `Field` component that manages the error message can be separated into its own component, perhaps named `ErrorMessage`.

Formik essentially implements the aforementioned ideas as a well-crafted library. If we recast our custom hook as `useFormik` and the `<Form>` component as `<Formik>`, their usage will closely resemble what we have implemented.

Formik encapsulates the management of form status, validation errors, and submission callbacks into a concise and reusable library structure.

### 5.1.2. Using Formik

Formik features a `useFormik` hook that operates similarly to our custom `useForm`. It takes in an object containing `onSubmit`, `validate`, and `initialValues`, returning `handleSubmit`, `handleChange`, `values`, and `errors`.

The wrapped component `<Formik>`, along with `<Field>` and `<ErrorMessage>`, simplifies usage. Using the `<Formik>` component is recommended for ease unless there are specific reasons to utilize `useFormik`.

Here's a brief example of how this might look. The `<Field>` and `<ErrorMessage>` components will automatically manage `onChange`, `onBlur`, `value`, and `checked`, based on props passed through `name`. (This is accomplished through utility functions like `getFieldProps(name)`).

```tsx
function App() {
  return (
    <main>
      <Formik
        initialValues={{
          email: '',
          name: '',
          password: '',
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
        validate={validate}
      >
        <Form>
          <legend>Sign Up</legend>
          <label htmlFor='email'>Email</label>
          <Field name='email' type='email' />
          <ErrorMessage name='email' />

          <label htmlFor='name'>Name</label>
          <Field name='name' type='text' />
          <ErrorMessage name='name' />

          <label htmlFor='password'>Password</label>
          <Field name='password' type='password' />
          <ErrorMessage name='password' />
          <button type='submit'>Sign Up</button>
        </Form>
      </Formik>
    </main>
  );
}
```

This way, initial values, validation functions, and submission callbacks are neatly organized, allowing the `<Formik>` component to manage the entire form efficiently.

The library serves to manage complex form data using controlled React components while also facilitating intuitive validation handling. [The official documentation offers excellent tutorials for deeper exploration.](https://formik.org/docs/tutorial)

Note that while the small abstracted functions for validation generation can be trialed with `validate`, using `validationSchema` with libraries like Yup can allow for even more comprehensive validation schemas.

## 5.2. React Hook Form

React recommends using controlled components for form input fields, meaning input values are stored in component state via `value` and `onChange` handlers.

However, remember how straightforward managing a `<form>` with HTML was? Use of `form` naturally handled input values based on their name and submitted data accordingly. 

React Hook Form adopts this methodology, managing each input as an uncontrolled component while aggregating values upon submission automatically.

Usage might look like this. The `useForm` hook only requires `defaultValues`, returning an object containing `register`, for input handling; and  `handleSubmit`, for submission handling.

```tsx
export default function App() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      // Other input fields...
    }
  });
  const onSubmit = data => {
    // Actions on submission
    console.log(data)
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <input {...register("email")} />
      <input {...register("password")} />
      {/* More input fields... */}
      <input type="submit" />
    </form>
  );
}
```

Even though inputs are uncontrolled, you can still access and edit values through `watch` and `getValues` (the former triggers re-renders on value changes, while the latter retrieves static input values). 

HTML validation is also supported, along with checks using libraries like Yup. [For more explorations, refer to the LogRocket guide or the official documentation.](https://blog.logrocket.com/react-hook-form-complete-guide/)

## 5.3. Comparison

One clear advantage of React Hook Form is its performance. By managing input values as uncontrolled components, fewer re-renders occur in response to user input.

Given the frequent changes in user inputs, employing React state for management leads to excessive re-rendering. This performance benefit from React Hook Form can yield significant gains.

In a comparison utilizing `useEffect`, you might find React Hook Form results in fewer re-renders compared to Formik.

Furthermore, [React Hook Form has zero dependencies, while Formik requires eight.](https://www.reason-to-code.com/blog/why-do-we-have-to-use-formik/)

On the downside, however, managing uncontrolled components means data manipulation by accessing input values is not feasible. Additionally, without using Yup or HTML’s built-in checks, creating customized validation is impossible.

In contrast, Formik uses controlled components, allowing direct manipulation of input data and easy application of custom validations alongside built-in ones. Users have found Formik easier to navigate, largely due to its high abstraction level and provided utilities, making it simpler to adopt after familiarization.

However, Formik may involve additional boilerplate code compared to React Hook Form and has a broader dependency profile.

Also, a point of distinction unrelated to the functionality of the libraries lies in their management levels.

Explore the relevant GitHub repositories to sense the difference—at the time of writing, React Hook Form houses just six active issues (predominantly bug reports). In contrast, Formik has a whopping 666 open issues, sometimes including unresolved bugs dating back years.

# 6. Conclusion

In this discussion, we introduced methods for validating and managing form data. We examined HTML’s built-in validation capabilities and delved deeper into the Constraint Validation API.

We covered how to customize messages and effectively validate forms using it. Following this, we explored methods for managing more intricate form data, distributing responsibilities for rendering input elements, state management, and validation logic.

Lastly, we presented Formik and React Hook Form, which abstracted form data management while supporting controlled and uncontrolled component approaches, respectively.

I hope the insights and tools discussed here empower the reader to manage form data more efficiently and effectively in complex user interfaces.
  
# References

https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation

Constraint Validation API https://web.dev/constraintvalidation/

https://tech.osci.kr/introduce-react-hook-form/

Elegant Management of Form Data with Functional Programming
https://tech.devsisters.com/posts/functional-react-state-management/

https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-FormData-%EC%A0%95%EB%A6%AC-fetch-api

https://jeonghwan-kim.github.io/dev/2020/06/08/html5-form-validation.html

Using the Constraint Validation API in React https://omwri.medium.com/react-constraints-api-better-validations-d9adba6f6e63

Managing Custom Hook for Form Validation https://upmostly.com/tutorials/form-validation-using-custom-react-hooks

Generic useForm Hook https://stackoverflow.com/questions/71358061/generic-useform-hook

React Hook Form vs Formik https://www.reason-to-code.com/blog/why-do-we-have-to-use-formik/

Managing Forms in React. Very helpful references here. https://jeonghwan-kim.github.io/dev/2022/03/29/react-form-and-formik.html

React Hook Form Guide https://blog.logrocket.com/react-hook-form-complete-guide/

React Forms - Formik vs. Hook-Form vs. Final-Form https://blog.appseed.us/react-forms-formik-vs-hookform-vs-finalform/
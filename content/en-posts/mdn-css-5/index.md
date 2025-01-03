---
title: Learning Front-End Knowledge CSS-5
date: "2023-04-13T00:00:00Z"
description: "MDN CSS Tutorial - 4"
tags: ["web", "study", "front", "CSS"]
---

# 1. CSS Structure

We explore methods for easily managing CSS.

## 1.1. Coding Style Guidelines

When working with others, it is essential to establish a project's style guidelines and consistently adhere to them. This includes rules for class naming conventions, ways to represent colors, formatting, etc.

For example, there are [CSS guidelines from MDN code examples](https://developer.mozilla.org/ko/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/CSS).

When establishing such guidelines, choices should be made with readability in mind, such as including only one rule per line.

## 1.2. Adding Comments

It is advisable to include comments for explanation in CSS. This is particularly important when non-intuitive CSS is written for specific reasons. For instance, when using properties not supported by outdated browsers, it is helpful to note alternative properties and explain why they exist.

```css
.container{
  /* For browsers that do not support linear gradient */
  background-color: purple;
  background-image: linear-gradient(to right, #ff0000, #aa0000);
}
```

## 1.3. Creating Logical Sections in Stylesheets

CSS consists of various rules, and categorizing them by their roles and placing them in different sections enhances readability.

First, it is advisable to specify common styles, which are often referred to as reset CSS. This typically includes defining styles for tags such as `p`, `h1`, `ul`, and `ol`.

Second, specify utility classes. These are styles that are commonly used across many components.

Third, define styles that are used site-wide, such as page layouts or navigation bars.

Finally, designate styles for specific components that are only used on particular pages. It is recommended to write this last.

Section separation is done with comments.

## 1.4. Using Selectors That Are Not Too Specific

Using overly specific selectors can complicate the application of styles to other components. For instance, consider the following class usage.

```css
section.container p.title{
  color: red;
}
```

This applies only to `p` tags with the title class that are descendants of `section` components with the container class. Such specific selectors make it nearly impossible to apply this style elsewhere, necessitating the creation of a new selector if the style is needed again.

Therefore, it is better to create a new class.

```css
.title-box{
  color: red;
}
```

## 1.5. OOCSS

OOCSS stands for Object Oriented CSS, which is a method of writing CSS in an object-oriented manner. It is based on the idea of separating CSS into reusable objects.

If this approach is not used, we would have to create new classes each time we make components with slightly different styles. This increases code duplication and makes maintenance difficult.

So, how can we enable reusability? OOCSS separates roles and design. For example, when creating a button, the `.button` class specifies the design for the button.

However, since this class is for the button's role, we should not specify gradient backgrounds or similar properties. Instead, a separate design class for backgrounds should be created and then applied to the `.button` class.

Also, containers and content should be separated in CSS. The style of the content should not change based on the position of the component, which is not recommended in OOCSS.

For instance, the following is discouraged, as the style of the `.list-item` class would change based on the position of `li`.

```css
ul li.list-item{
  color: red;
}
```

## 1.6. BEM

BEM stands for Block, Element, Modifier and is a methodology used when naming classes in CSS. Using this approach allows for consistency in class naming.

Block refers to components that can exist independently, such as buttons, menus, or logos. Element refers to parts that comprise the Block, such as button text or list items (`<li>`).

Modifier denotes the state of a Block or Element, indicating if a button is active, inactive, or its size is large or small.

In BEM, class names should be structured as follows:

```css
.block__element--modifier{
  // CSS properties
}
```

The frequent use of `_` and `-` makes it immediately apparent that the BEM methodology is being employed.

There are several other methodologies, including Atomic CSS.

# 2. Custom CSS Properties

CSS also allows for the creation of reusable variables, commonly referred to as custom properties. These variables are defined using a specific notation that starts with `--`, and can be accessed through the `var()` function. Any valid CSS value can be placed in these variables.

Like typical CSS property definitions, variables are defined within the selector.

```css
selector{
  --main-color: #eebefa;
}
```

It is common to use the `:root` selector to select the root element of the document for global patterns. If variables are intended to be used only within specific components, they can be defined in the top-level element of that component.

```css
:root{
  --main-color: #eebefa;
}
```

To retrieve the variable, use the `var()` function.

```css
p{
  color: var(--main-color);
}
```

## 2.1. Variable Inheritance

These variables can be inherited from parent elements. If a specific element does not define a variable, the element will look for the variable in its parent.

```css
.parent{
  --bg-color: #eebefa;
}

.child{
  background: var(--bg-color);
}
```

With the CSS defined above, the background color of the `.child` element will be `#eebefa`.

```html
<div class="parent">
  Parent Element
  <div class="child">Child Element</div>
</div>
```

Note that these are not true variables but properties that are calculated only when needed. Thus, one cannot search for these elements separately.

## 2.2. Fallback Values

If a given variable is not defined or is invalid, a fallback value can be specified using `var()`.

```css
p{
  color: var(--main-color, #99e9f2);
}
```

Here, if `--main-color` is not defined or invalid, `#99e9f2` will be applied.

## 2.3. Validity of Variable Values

When calculating the values of CSS variables, browsers do not know where these values will be used; therefore, they consider almost all values valid. If an invalid value is encountered, the browser will prioritize using inherited values from the parent and, if none exist, the default value.

```css
:root{
  --primary-color: 16px;
}

p{
  color: var(--primary-color);
}
```

In this case, the browser replaces `var(--primary-color)` with 16px, which is not a valid value, resulting in the default color of black being applied to the `p` tag.

Using fallback values in the same manner will also yield the same outcome, as the browser can recognize `var(--primary-color)` but can fill in an invalid value.

```css
p{
  color: var(--primary-color, #66d9e8);
}
```

Thus, even with the use of fallback values, the `p` tag will still have the default color of black applied.

# 3. Creating a Text Box

We will follow a common example provided by MDN. Let’s create a simple HTML box.

```html
<!DOCTYPE html>
<html lang="ko-KR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Creating a Box</title>
    <link href="index.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <div>
      <p>I will show you something</p>
    </div>
  </body>
</html>
```

Now, let’s write the index.css.

We will create an appropriate size for the box and add a background color to identify the box area. Additionally, we will center the text and also center the box within the page.

```css
.box{
  width:200px;
  height:200px;
  background-color:var(--bg-color);
  text-align:center;
  margin:0 auto;
}
```

Let’s also adjust the font size and color, adding the `text-shadow` property for some dimension.

```css
.text-content{
  font-size:1rem;
  color:var(--text-color);
  text-shadow: 1px 1px 2px black;
}
```

There is still room for more design on the box. Therefore, let’s create a new class to apply additional styles. We will round the corners, add borders, and apply gradients along with shadows to the box.

```css
.box-layout{
  width:200px;
  height:200px;
  text-align:center;
  margin:0 auto;
}

.box-design{
  background-color:var(--bg-color);
  border-radius:10px;
  border:3px solid var(--text-color);
  background-image: linear-gradient(135deg, rgba(0,0,0,0), rgba(0,0,0,0.2) 30%);
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}
```

Now let’s apply the classes in the HTML and render it.

```html
<div class="box-layout box-design">
  <p class="text-content">I will show you something</p>
</div>
```

![cool-box](./cool-box.png)

The design may not be great, but the box is complete nonetheless.

# References

https://clubmate.fi/oocss-acss-bem-smacss-what-are-they-what-should-i-use
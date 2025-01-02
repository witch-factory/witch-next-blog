---
title: Exploring JS - Accessing DOM Properties in JS
date: "2022-05-20T00:00:00Z"
description: "What can be done with DOM properties in JS"
tags: ["javascript"]
---

# 1. DOM Object Properties

Most HTML attributes assigned to HTML elements in the browser become properties of the DOM objects created from them. For example, consider the following case.

```html
<h1 id="greeting" style="color:blue">Hello. I am a witch.</h1>

<script>
  let greet=document.getElementById('greeting');
  console.log(greet.style.color);
  console.log(greeting.style.color); // Accessing the element using a global variable with the same name as the id
</script>
```

The `h1` has a style attribute, and when executing the code above, you can see that it accesses one of its properties, color, resulting in "blue" being logged.

These DOM object properties can also be created as desired by the user. You simply need to add them to the DOM object.

```html
<h1 id="greeting" style="color:blue">Hello. I am a witch.</h1>

<script>
  let greet=document.getElementById('greeting');
  greet.data='Name';
  greet.sayTagName = function() {
    console.log(this.tagName);
  };
  console.log(greet.data);
  greet.sayTagName();
</script>
```

You can confirm that the data and function added to the `greet` DOM object work correctly when executing the code above.

# 2. Attributes and Properties

When generating elements via HTML tags, if the provided attribute is a standard attribute from the specification, the attribute assigned to the HTML tag automatically becomes a property of the resulting DOM object. For instance, `greet.style.color` was given as an attribute of the `h1` tag, but it is also accounted for as a property of the `greet` DOM object.

However, if there are non-standard attributes specified in the HTML when parsing to create DOM objects, those attributes do not become properties of the DOM object. For example, when attempting to access a `test` attribute added to the `h1` tag, you will see that it does not work correctly because `test` is not a standard attribute, and thus it does not enter the DOM object's properties.

```html
<h1 id="greeting" style="color:blue" test="test-property">
  Hello. I am a witch.
</h1>

<script>
  let greet=document.getElementById('greeting');
  console.log(greet.test); // undefined is output
</script>
```

Such non-standard attributes can be accessed through the `getAttribute` method. It is important to note that the values of HTML attributes are always strings and are case-insensitive. Additionally, all attribute values are converted to strings.

```html
<h1 id="greeting" style="color:blue" test="test-property">
  Hello. I am a witch.
</h1>

<script>
  let greet=document.getElementById('greeting');
  console.log(greet.getAttribute('test')); // "test-property" is output
  console.log(greet.getAttribute('tEsT')); // This access is also possible since HTML attributes are case-insensitive
</script>
```

In addition to `getAttribute`, there are also `setAttribute`, `hasAttribute`, and `removeAttribute` methods that can be applied to elements, allowing manipulation of non-standard attributes defined in HTML within the DOM object.

# 3. Usage of Non-standard Attributes

So, where are these non-standard attributes used? We mostly write HTML using only standard attributes.

Non-standard attributes can be used when users want to pass custom data from HTML to JS or to indicate HTML elements to be manipulated with JS.

The following code iterates through all objects with an `info` attribute, setting the innerHTML of each object to the corresponding value of its `info` attribute. This involves adding a non-standard `info` attribute to the HTML tag and manipulating it with JS.

```html
<div info="name"></div>
<div info="likes"></div>

<script>
  let myInfo={
    name: 'Kim Seong-hyeon',
    likes: 'coffee'
  };

  for(let div of document.querySelectorAll('[info]')){
    let field=div.getAttribute('info');
    div.innerHTML=myInfo[field];
  }
</script>
```

By using non-standard attributes, it is said that one can significantly ease the modification of objects compared to using classes and similar constructs.

However, attributes like `info` are quite generic names and could very well be included as standard attributes for some tags. Additionally, if you write code using non-standard attributes that later become standardized, there can be issues. To prevent such cases, JS reserves specific prefix attributes for developers to use as needed. This is the `data-*` attribute.

Attributes created this way can be accessed in the DOM object using the `dataset` property. Attributes that start with `data-` are converted from kebab case to camel case and stored in the DOM object's dataset property.

```html
<h1 id='test' data-test-text="test">Text for Testing</h1>

<script>
  let t=document.getElementById('test');
  console.log(t.dataset.testText);
</script>
```

Note that the `data-test-text` attribute has become the `testText` property. The `data-` prefix is omitted, and the representation changes to camel case.
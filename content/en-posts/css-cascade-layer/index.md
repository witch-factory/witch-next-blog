---
title: About CSS Cascade Layers
date: "2023-03-31T01:00:00Z"
description: "Managing CSS Cascade Layers"
tags: ["web", "study", "front", "CSS"]
---

When multiple individuals collaborate on writing CSS, various CSS rules can become intertwined. However, all CSS declarations belong to the author style sheet origin. Therefore, it is essential to consider the specificity of selectors such as classes and IDs within the CSS cascade.

Some developers may distinguish selectors using classes, while others may use IDs. This mixing can quickly lead to conflicts, and to resolve them promptly, developers might resort to using the `!important` tag or expend considerable effort on coordination.

Using cascade layers can resolve these issues. Cascade layers add an additional stage to the cascade algorithm, allowing each stylesheet to be prioritized. Let us explore this concept.

First, let’s review the previously mentioned cascade algorithm.

# 1. What is the CSS Cascade Algorithm?

CSS stands for Cascading Style Sheets. "Cascading" refers to the algorithm by which the browser determines which style to apply to an element, given that there may be multiple selectors for the same element.

So, how does this cascade operate?

## 1.1. Components of the Cascade

Only CSS declarations in the form of property-value pairs are considered in the cascade. At-rules, such as `@font-face`, do not affect the cascade.

# 2. Considerations in the Cascade Algorithm

The cascade algorithm takes into account the following factors, listed in order of priority.

## 2.1. Origin and Importance

Importance refers to whether a CSS declaration is marked with `!important`. If `!important` is applied, the declaration is given the highest priority in the cascade algorithm. It is not advisable to utilize this unless absolutely necessary.

What does "origin" mean? CSS declarations considered by the cascade algorithm can originate from three sources, and the priority varies depending on the source.

### 2.1.1. User Agent Style Sheet

Browsers provide default styles for all elements. For example, the `<h1>` element has a default `font-size: 2em`.

Some browsers use style sheets directly, while others generate these default styles through code; nonetheless, the end result is the same.

The default styles provided by the browser are referred to as the User Agent Style Sheet.

### 2.1.2. Author Style Sheet

The author style sheet comprises styles explicitly written by the page developer. These are CSS styles declared within HTML documents (via link or style tags) and created by frontend developers.

### 2.1.3. User Style Sheet

These are styles defined by the browser's user. For instance, if a user changes the font size in their browser settings, those styles will be applied. They denote styles created and applied by users wishing to override the browser's defaults.

### 2.1.4. Priority Determination

Considering origin and importance, the cascade algorithm follows this hierarchy of priorities, listed from the highest to the lowest:

1. User-Agent && !important
2. User && !important
3. Author && !important
4. CSS animations, @keyframes (although they belong to the author style sheet, browsers prioritize animations over typical author styles)
5. Author
6. User
7. User-Agent

## 2.2. Selector Specificity

Developers cannot change the origin of declarations or are generally discouraged from using `!important`. Therefore, when considering cascade, the emphasis is often on specificity.

More specific selectors take precedence in style application. The order of specificity is as follows:

```
Inline styles > ID selectors > Class/Attribute/Pseudo-class selectors > Tag/Pseudo-element selectors > Universal selectors > Inherited properties from parent elements
```

If selectors of the same specificity exist in CSS declarations, the number of selectors is considered. If written as follows, both declarations have ID selectors, so they share the same specificity, but the one with more ID selectors takes precedence, resulting in the tag with the ID "title" being purple.

```css
#title#title {
  color: purple;
}

#title {
  color: red;
}
```

The same principle applies when the number of high-specificity selectors is equal. If one selector points to `#title.myclass1` and another to `#title2.myclass1.myclass2`, the latter, with more class selectors, takes precedence.

## 2.3. Declaration Order

This is straightforward: the last declared style has higher priority.

This applies even when loading CSS files through link tags. The later link tag will load its CSS file with a higher priority.

## 2.4. Default/Inherit Properties

This affects scenarios where there are no applicable CSS declarations for an element. Properties like color are inherently inherited from parent elements. Additionally, non-inherited properties typically have default values; for example, `background-color` defaults to `transparent`.

# 3. Cascade Layer Theory

In fact, there is one more consideration within the cascade algorithm: the cascade layer. After considering importance and origin, the cascade layer is taken into account before selector specificity.

Thus, the cascade algorithm considers CSS declarations in the following order:

1. Origin and importance
2. Cascade layer
3. Selector specificity
4. Declaration order
5. Default/inherited properties

## 3.1. Cascade Layer Priority

Cascade layers create a sub-origin level for CSS declarations from all origins and allow for priority scheduling. There can be multiple cascade layers for each origin level, with the order determined by how they are declared.

For normal origin, i.e., CSS declarations without `!important`, the layers follow the order of declaration. Hence, the CSS declaration of the last declared layer is considered first. Moreover, styles without layers are prioritized over those that have layers.

For CSS declarations with importance, the first declared layer's CSS declaration is prioritized. However, in this case, styles with layers are considered more important than those without layers.

## 3.2. Nested Layers

Nested layers can also be created, which is useful when one wishes to apply different stylings under certain conditions. For example, consider applying media queries. You can create a components layer and then create several layers inside it, each containing styles that vary according to screen width, which can be shown or hidden based on those conditions.

Creating nested layers eliminates concerns about naming conflicts between layers.

# 4. Cascade Layer Syntax

## 4.1. Creating Cascade Layers

Cascade layers can be created as follows.

```css
// 1. Declare components layer
@layer components;
// 2. Declare styles within the components layer
@layer components {
  .button {
    color: red;
  }
}
// Create style.css file as components layer
@import url(style.css) layer(components);
```

The three methods above will create a new layer if one with the specified name does not exist; if a layer already exists, the styles associated with that layer will be added.

If there is no layer name in a layer declaration, an anonymous layer will be created.

Let’s explore the methods for layer creation in more detail.

## 4.2. Creating Named Layers with @layer

By doing this, theme, layout, and utilities layers will be created, assuming there are no existing layers with those names. The priority of each layer follows the order of declaration—meaning the last declared layer takes precedence.

```css
// Priority order: theme < layout < utilities
@layer theme, layout, utilities;
```

Such declarations are used to define cascade layers and their priorities. It is also advisable to declare layer definitions on the first line of the CSS file to control priorities, because once set, that priority will not change.

```css
// Thus, style2 is declared later, so it takes precedence, making the h1 tag blue.
@layer style1 {
  h1 {
    color: red;
  }
}

@layer style2 {
  h1 {
    color: blue;
  }
}
```

Additionally, as mentioned earlier, styles that are not part of layers are given higher priority. This is irrespective of the position of the unlayered styles.

```css
// The unlayered h1 tag is declared earlier, but since it is prioritized over styles in a layer, the h1 tag will be purple.
h1 {
  color: purple;
}

@layer style1 {
  h1 {
    color: red;
  }
}
```

Furthermore, as seen above, if a layer identifier and style block directly follow the `@layer` declaration, a layer with that identifier is created, and its styles are added to the layer.

If only a style block follows without an identifier, an anonymous layer will be created for that style block. Of course, anonymous layers also have priorities, which follow the order of declaration.

```css
// Create layout layer and specify styles. If the layout layer already exists, those styles are added to that layer.
@layer layout {
  .container {
    width: 100%;
  }
}
```

Be cautious that consistently adding styles to an anonymous layer does not result in continuously increasing styles within one anonymous layer; instead, multiple distinct anonymous layers are created.

## 4.3. Importing Layers with @import

`@import` can be used to retrieve other stylesheets. When importing stylesheets, `@import` must be placed before any CSS styles or `<style>` blocks.

However, declaring a layer using `@layer` can be done after the `@import` block. Note that specifying styles while creating layers is not allowed in that context.

Regardless, using this import, stylesheets can be added to named layers, allowing for nested stylesheets as well.

```css
@import url("style.css") layer(layer1);
```

Styles can also be added to nested layers. The following code adds the stylesheet from style.css to layer2, which is inside layer1.

```css
@import url("style.css") layer(layer1.layer2);
```

Multiple CSS files can be added to a single layer.

```css
@import url("style1.css") layer(layer1);
@import url("style2.css") layer(layer1);
```

Layer imports can also be conditional using media queries or feature queries.

```css
@import url("style.css") layer(layer1) (width<30rem);
```

Using `@import` to place stylesheets into layers is necessary when one cannot declare `@layer` directly in stylesheets.

## 4.4. Layers with Media Queries

Media queries or feature queries (`@supports`) can be used to create layers. This means the specified layer will only be created when the media query conditions are met.

For example, the desktop layer will only be created when the media query (minimum screen width of 600px) is satisfied.

```css
@media (min-width: 600px) {
  @layer desktop {
    .button {
      color: red;
    }
  }
}
```

## 4.5. Nested Layers

Using nested layers allows for a hierarchical structuring of layers without the worry of naming conflicts.

To declare nested layers, simply declare `@layer` within the block of another layer.

```css
@layer base {
  @layer components {
    .button {
      color: red;
    }
  }
}
```

Alternatively, you can use `@import`.

```css
@import url("style.css") layer(base.components);
```

This will create a components layer within the base layer, and if there are styles declared in style.css, they will be added to the base.components layer.

Of course, you can also add styles to a nested layer as shown below.

```css
@layer base.components {
  .my-button {
    color: purple;
  }
}
```

# 5. Layer Priority, Revisited

The priorities of layers are determined as follows, starting from the highest, i.e., the styles that are considered first.

1. Transition styles (transition-xxx)
2. Inline && !important
3. Styles with layers && !important
4. Styles not part of layers && !important
5. Animation styles (animation-xxx)
6. Inline styles
7. Styles not part of layers
8. Styles part of layers

If styles exist with the same priority, among normal styles (i.e., not marked as important), the later declared styles will be applied first.

However, in the case of important styles, the first declared styles will be prioritized. It's essential to remember that many scenarios will have the opposite priority between normal and important styles.

Moreover, transition styles take precedence over all other styles but are only effective during the transition itself, rendering them temporary.

Thus, inline and important styles offer no style that can override them except during temporary transitions, so care should be taken in their use.

## 5.1. Nested Layer Priority

The same priority applies to nested layers.

For normal styles, unnested styles are prioritized over nested styles. In the case of important styles, the opposite applies. Also, the priority based on declaration order is inverted.

```css
@layer base {
  .button {
    color: red;
    font-size: 1rem !important;
  }
}

@layer base.components {
  .button {
    color: blue;
    font-size: 2rem !important;
  }
}

@layer base.utilities {
  .button {
    color: green;
    font-size: 3rem !important;
  }
}
```

In the case of normal styles, unnested layers take precedence; hence, the button class's color will be red.

Conversely, for important styles, nested layers are prioritized. Here, the font-size for nested layers has two important styles: one from base.components and one from base.utilities.

In important styles, the priority is determined first by declaration order. Therefore, the font-size from base.components is prioritized, resulting in a value of 2rem.

# References

https://developer.mozilla.org/ko/docs/Web/CSS/Cascade

About CSS Cascade https://blog.logrocket.com/how-css-works-understanding-the-cascade-d181cd89a4d8/

https://wit.nts-corp.com/2022/05/24/6528
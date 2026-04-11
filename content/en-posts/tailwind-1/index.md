---
title: Learning Front-End Knowledge with Tailwind - 1
date: "2022-07-27T00:00:00Z"
description: "Documentation of using Tailwind in projects"
tags: ["web", "study", "front"]
---

# 0. Organizing Front-End Study
As I take on front-end implementation in a project, I am studying various topics. I will organize the knowledge I acquire here, albeit in a somewhat chaotic manner. This will likely include snippets related to Tailwind, HTML tags, and React.

# 1. Getting Started with Tailwind
In my previous project, I worked on the front page using styled-components. However, it became increasingly challenging to name components, and I often found myself contemplating how much customization was necessary. As a result, I was recommended to use Tailwind and DaisyUI. Nonetheless, Tailwind has a considerable initial learning curve. Particularly, I needed to familiarize myself with the class names defined by Tailwind itself. I have documented here my brief notes on the basics of Tailwind and these class names, referencing Tailwind's official documentation. This writing summarizes the pages found in the Core Concepts section of the Tailwind official documentation.

# 2. Reasons for Using Tailwind - Utility-First Fundamentals
At its simplest, you can utilize pre-defined class names such as `w-12` (which indicates a specific width). While it may appear chaotic with over ten class names attached to a single component, you no longer need to 고민 about naming classes, and once you familiarize yourself with Tailwind class names, your productivity improves significantly.

It resembles inline styles but doesn’t require magic numbers, and it allows for easy implementation of responsive designs as well as hover, focus, and other state designs. For instance, to change the color when hovering over a component, you simply need to apply a class name like `hover:bg-my-color`.

# 3. States Provided by Tailwind - Hover, Focus, and Other States
Tailwind provides similar classes such as `hover`, `focus`, `active`, and `visited`.

There are also modifiers like `first` and `last` that activate when a component is the first or last child of its parent, as well as `even` and `odd` for even and odd child elements.

Classes representing form states such as `disabled`, `invalid`, `required`, and `read-only` are also available.

Additionally, Tailwind provides a myriad of modifiers. Below are a few summarized.

Depending on the state of the parent component, you may need to alter the CSS of child components. For example, if the parent component is hovered over, you might want the text color of its child component to turn white. You can achieve this by adding a class name `group` to the parent component, and then applying `group-hover:stroke-white` to the child component that you wish to alter based on the parent’s state.

Styling based on the state of sibling components can be done by applying the `peer` class to the sibling and using classes in the format `peer-*:*`. Keep in mind that the component you want to alter must come after the `peer` component in the DOM hierarchy.

Input or textarea placeholders can be styled using modifiers like `placeholder:*`.

The file upload button in an input (file type) component can also be styled with the `file:*` modifier.

The list marker for `<li>` components can be styled using `marker`. For example, applying a class like `marker:text-sky-400` to an `<li>` component will inherit down, but can also be applied to the parent `<ul>` component.

Highlighted text can be styled using `selection:*`, and the first line and first letter of a paragraph (p tag) can be styled with `first-line` and `first-letter` modifiers.

When using the `<dialog>` tag, the backdrop color can be styled with a class like `backdrop:bg-gray-50`. When using the dialog or details tags, you can also use the `open` modifier to style components when these tags are open.

For responsive design, classes such as `sm:*`, `md:*` can be employed. These prefixes apply based on screen size, ranging from sm to 2xl.

To account for cases where a user requests minimal movement in the web experience with the prefers-reduced-motion media query, you can utilize the `motion-reduce:*` modifier.

You can also create custom selectors as modifiers, denoted by brackets. For instance, a modifier that utilizes a selector to trigger only when a component is the third child of its parent would look like this: `[&:nth-child(3)]:underline`.

If a space is needed in a custom selector, use an underscore instead. The modifier class for selecting all p tags within descendant components would be `[&_p]:*`.

If you have recurring custom selectors, you can redefine them using the `addVariant` API. (Refer to the `Creating a plugin` section at https://tailwindcss.com/docs/hover-focus-and-other-states).

Refer to the reference for all similar class information. (https://tailwindcss.com/docs/hover-focus-and-other-states?email=geor%40ustrial&password=Bosco#disabled)

# 4. Implementing Responsive Design
Tailwind allows applying all classes according to screen size. The prefixes sm, md, lg, xl, and 2xl apply or do not apply depending on how these sizes surpass certain breakpoints. For example, the class `w-16 md:w-32 lg:w-48` means on screens wider than 768px, it will show `w-32`, and on screens wider than 1024px, it will display `w-48`.

Furthermore, Tailwind follows a mobile-first approach. Therefore, the base styling should be for mobile. Classes without prefixes apply to all screen sizes, while attaching a prefix such as `sm:` will apply this class only to screens that exceed that size. Hence, for mobile screens, unprefixed utilities should be used, and for larger screens, prefixes indicating screen breakpoints such as `sm:` should be applied for styling.

It is also important to note that there is no max-width breakpoint. If you wish to apply a media query specifically to medium-sized screens, you can apply it under `md:` and revert it on `lg:` screens.

These media query breakpoints can be customized in `tailwind.config.js`. By creating an entry in the theme’s screens section like 'tablet':'640px', a media query for a minimum width of 640px is produced. For more detailed customization, refer to https://tailwindcss.com/docs/screens.

# 5. Dark Mode
Dark mode is supported on many pages. Tailwind allows styling for dark mode using the `dark:*` class, which utilizes the `prefers-color-scheme` media query.

However, many pages also allow toggling between dark mode configurations. This can be achieved by changing the darkMode property in tailwind.config.js from media to class. Consequently, whether dark mode is applied or not will depend on whether the class ‘dark’ is present on the HTML tag (or on any tag that is earlier in the HTML tree).

# 6. Style Reusability
As projects grow, specific combinations of style utilities often repeat. For instance, you may have dozens of buttons with the same class combinations. Guidance on how to manage these repeating styles is also provided.

Of course, there exists a method to extract these repetitive styles into their own classes. However, it is also possible to use multi-cursor editing functionalities provided by editors like VScode (https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor) to edit all repeating classes at once. If repetitive styles are contained within a single file, this approach may be more beneficial than creating a new abstraction class.

Alternatively, storing the content of repeated elements in an array and utilizing methods like map can help avoid code repetition. This way, the actual element code is only written once.

If utilizing front-end frameworks like React, the best method is to encapsulate repeated elements into components. Determine the variations in the repeated elements and create components by defining props such as `children` and others.

You could also extract these repeated components into separate CSS classes, but this would ultimately lead to repeated class names across several components. Hence, creating components to abstract is a more favorable approach.

# 7. Custom Styles
One of the most challenging aspects of using a framework is handling parts that the framework does not cover directly. Tailwind is designed to allow some extension and handling in `tailwind.config.js`.

If you wish to alter the color palette, spacing styles, or fonts, you can edit the theme section of tailwind.config.js.

Additionally, if you want to utilize completely different arbitrary values beyond those provided by Tailwind regarding colors, sizes, or spacing, you can input those values using `[]`. For example, using `bg-[#bada55]` will set the background color to your defined color. This can easily be utilized alongside states such as `hover`.

It is also possible to directly plug in CSS properties that Tailwind does not support, such as `[mask-type:luminance]`. While this is very much like inline styles, it also shares the advantage of being easily used with states like hover.

If spaces are needed within the brackets, they can be replaced with underscores. Tailwind will convert them during the build process. In cases where underscores are truly necessary, they usually remain untouched by Tailwind but can be explicitly forced with a backslash.

In addition to using `@apply`, there are various other styling methods available, though they are not commonly used.

# 8. Functions & Directives
Directives are used within Tailwind CSS to create special functionalities. Several functions are also provided, mostly related to custom styles, which may be useful later when needed. This appears to have little relevance to quickly learning Tailwind, but if it turns out to be critical during development, I will revisit and enhance my understanding.

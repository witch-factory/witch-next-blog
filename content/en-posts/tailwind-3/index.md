---
title: Learning Front-End Knowledge, Tailwind - 3
date: "2022-07-29T00:00:00Z"
description: "Usage of Tailwind in a Project - Tag Organization 2"
tags: ["web", "study", "front"]
---

# 1. Second Tag Organization

Continuing from the previous article, here is a brief organization of the tags in Tailwind. I plan to familiarize myself with the available tags and refer to the official documentation when using them properly in future projects.

# 2. Backgrounds
 
Here are the properties related to backgrounds.

- Background Attachment
This property determines whether the background image moves with the viewport's scroll.
bg-fixed: Fixes the background to the viewport. Even if the element is scrolled, the background does not scroll with it.
bg-local: Fixes the background to the element's content. If the element is scrolled, the background scrolls with the content.
bg-scroll: Fixes the background to the element itself. Even if the element is scrolled, the background scrolls with it. This creates an effect similar to attaching the background image to the element's border.

- Background Clip
This property determines how far the element's background extends into the border, padding, or content box.
bg-clip-{border, padding, content, text}

- Background Color
Specifies the background color. The class name follows the format bg-{color_name}, and the color palette is the same as that referenced in the official documentation mentioned above.

- Background Origin
This property specifies where the background's origin will be set: at the border's starting point, inside the border, or inside the padding.
bg-origin-{border, padding, content}

- Background Position
Determines the position of the background image. It supports 8 directions plus center, resulting in 9 possible positions.
bg-{bottom, top, ..., center}

- Background Repeat
Determines the repetition of the background image. It allows for control over whether to repeat, on which axis to repeat, adjusting the background image size to avoid clipping (round), or distributing it evenly from end to end (space).
bg-{repeat, no-repeat, repeat-x, repeat-y, repeat-round, repeat-space}

- Background Size
Determines the size of the element's background image. It can be left as is, enlarged, reduced, or set to fit the available space.
bg-{auto, cover, contain}

- Background Gradient
Allows the background color to include a gradient. 
For example, bg-gradient-to-r from-cyan-500 to-blue-500 creates a gradient transitioning from cyan-500 to blue-500 towards the right. The direction of the gradient can also be adjusted using bg-gradient-to-{t, tr, r, br, b, bl, l, tl}. This may be useful for applying colors to logos, so I have organized it here.

# 3. Borders

Naturally, these properties relate to borders.

- Border Radius
An option for rounding the corners. This is used frequently, so there are separate options for rounding each of the four corners, with various sizes available.

- Border Width
An option for setting the thickness of the border. Specified using the border-number class format.

- Border Color
Specifies the border color. This is set using the border-color_name class, where the color names match those in the tailwind official color palette.

- Border Style
The border style can be solid, dashed, or double. This property determines the style.
border-{solid, dashed, dotted, double, hidden, none}

- Divide Width
A property that sets the border spacing between elements. It is used in the format divide-x-number or divide-y-number.

- Divide Color
Determines the color of the boundaries between elements. It is used as divide-color_name, following the color palette from the reference section.

- Divide Style
Determines whether the element borders are dashed or double.

- Outline
Outlines can also be styled regarding width, color, and style (dashed, solid, etc.).

- Ring
Similarly, styling is possible for a "Ring." I suspect it won't be immediately useful, so I will skip it for now.

# 4. Effects

- Box Shadow
An option for setting the shadow of an element.
Can be utilized with classes like shadow-{sm, md, lg, xl, 2xl, inner, none}. The shadow class can also be used to apply a default shadow.

- Box Shadow Color
Also sets the shadow for an element. Used as shadow-color_name, leveraging the default tailwind palette.

- Opacity
Sets the opacity of an element. This can be configured from opacity-0 to opacity-100 in increments of 10, with 100 being completely opaque.

- Mix Blend Mode
Determines how an element's content mixes with its background and that of the parent element.
mix-blend-{normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn}. A similar concept exists with Background Blend Mode.

---
There are many other properties, but I believe this is sufficient for now, and I will organize more properties in the future.

# Reference
Background Attachment from MDN: https://developer.mozilla.org/ko/docs/Web/CSS/background-attachment and many other CSS properties on the MDN documentation
https://developer.mozilla.org/ko/docs/Web/CSS/blend-mode, etc. 

Tailwind Color Palette: https://tailwindcss.com/docs/customizing-colors#default-color-palette
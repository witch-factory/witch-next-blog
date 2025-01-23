---
title: Renewing the Blog Theme Switch Button
date: "2023-09-19T04:00:00Z"
description: "Let's recreate the theme switch button for the blog."
tags: ["blog"]
---

References were made to a [YouTube video explaining how to use next-themes with Next.js 13](https://www.youtube.com/watch?v=RTAJ-enfums), the [next-themes documentation](https://github.com/pacocoursey/next-themes), and a [web.dev article on creating an accessible theme switch component](https://web.dev/building-a-theme-switch-component/).

# 1. Basic Setup

## 1.1. Providers Component

Currently, the blog manages themes using `next-themes`. However, switching to Next.js 13 requires slight modifications to the code due to the Context API. Let’s implement this first.

`next-themes` utilizes the Context API. However, it cannot be used in server components, which are the default component format in Next.js 13. Thus, we need to change it to a client-managed component.

Create `src/app/Provider.tsx` and write the following content. I included the themes to be created later. The most critical aspect here is to apply `use client`.

```tsx
'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      defaultTheme='system'
      enableSystem={true}
      value={{ dark: 'dark', light: 'light', pink: 'pink', darkPink: 'darkPink' }}
      themes={['dark', 'light', 'pink', 'darkPink']}
    >
      {children}
    </ThemeProvider>
  );
};
```

If any additional Provider properties are needed, feel free to add them to this component.

Next, apply this to `src/app/layout.tsx`, which is the root layout.

```tsx
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <Providers>
          <Header navList={blogCategoryList} />
          {children}
          <Footer />
          <GoogleAnalytics />
        </Providers> 
      </body>
    </html>
  );
}
```

## 1.2. Define Colors

Let’s apply the theme colors in `src/styles/theme.css`. The names of the color variables were defined based on their usage in the blog. Dark mode variables can be defined using the `[data-theme:"dark"]` selector.

```css
:root {
  --white:#fff;
  --black:#000;

  --bgColor: #ffffff;
  --textColor: #28292D;

  --contentBgColor: #f1f3f5;
  --contentBgHover: #e9ecef;
  --headerBorderColor: #dee2e6;
  --borderColor: #adb5bd;
  --shadowColor:#868e96;
  --infoTextColor:#495057;

  --codeBlockBgColor:#edf2ff;
  --codeBlockTextColor:#364fc7;
  --accentBgColor:#dbe4ff;
  --accentBgHover:#bac8ff;
  --accentTextColor:#3b5bdb;
  --lightAccentTextColor:#4c6ef5;
  --linkColor:#4263eb;
}

[data-theme='dark'] {
  --bgColor: #212529;
  --textColor: #ececec;

  --contentBgColor: #343a40;
  --contentBgHover: #343a40;
  --headerBorderColor:#495057;
  --borderColor: #868e96;
  --shadowColor:#868e96;
  --infoTextColor:#ced4da;

  --codeBlockBgColor:#343a40;
  --codeBlockTextColor:#edf2ff;
  --accentBgColor:#002395;
  --accentBgHover:#2b4aaf;
  --accentTextColor:#edf2ff;
  --lightAccentTextColor:#748ffc;
  --linkColor:#91a7ff;
}
```

Now that we can use the theme, let's create a button for the theme switch. Fortunately, the article on [web.dev on creating a theme switch component](https://web.dev/building-a-theme-switch-component/) provides guidance, which we will follow closely.

# 2. Structuring the Button

## 2.1. Markup

The component for changing themes is appropriately represented by a `<button>`. To enhance accessibility, include `aria-label` and `aria-live`, while adding `title` for tooltip support.

```tsx
function ThemeSwitch() {
  return (
    <button 
      className={styles.toggle} 
      title='Toggle Light & Dark' 
      aria-label='auto'
      aria-live='polite'
    >
      Toggle
    </button>
  );
}
```

## 2.2. Creating the Icon

An SVG component will be used for the icon. The design aims to have a sun and moon theme.

![theme-sketch](./theme-sketch.png)

To achieve this, create `icon.tsx` in the `components/molecules/themeSwitch` folder and implement the `SunAndMoonIcon` component.

Start by creating a circle in the center and drawing lines for sun rays. Group the lines for easier handling using the `<g>` element. The moon shape for dark mode will be created using a `<mask>` to block part of the circle. The resulting `SunAndMoonIcon` component will look as follows.

The `<svg>` has the `aria-hidden` attribute to prevent screen readers from interpreting it, as this icon is purely decorative. Additionally, the `stroke` property in `<g>` specifies the line color.

```tsx
import styles from './theme.module.css';

function SunAndMoonIcon() {
  return (
    <svg className={styles.sunAndMoon} aria-hidden='true' width='24' height='24' viewBox='0 0 24 24'>
      <circle className={styles.sun} cx='12' cy='12' r='6' mask='url(#moonMask)' fill='currentColor'/>
      <g className={styles.sunBeams} stroke='currentColor'>
        <line x1='12' y1='1' x2='12' y2='3' />
        <line x1='12' y1='21' x2='12' y2='23' />
        <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
        <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
        <line x1='1' y1='12' x2='3' y2='12' />
        <line x1='21' y1='12' x2='23' y2='12' />
        <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
        <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
      </g>
      <mask className={styles.moon} id='moonMask'>
        <rect x='0' y='0' width='100%' height='100%' fill='white' />
        <circle cx='24' cy='10' r='6' fill='black' />
      </mask>
    </svg>
  );
}
```

## 2.3. Simple Functionality

Let’s implement the action of changing the theme when the button is clicked.

Modify the `ThemeSwitch` component as shown below. This allows the theme to toggle when the button is clicked (the icon will not change yet).

```tsx
'use client';

import { useTheme } from 'next-themes';

import { getThemeName } from '@/utils/theme';

import SunAndMoonIcon from './icon';
import styles from './theme.module.css';

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const isDark = getThemeName(theme) === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button 
      className={styles.themeToggle} 
      title='Toggle Light & Dark'
      aria-label='auto'
      aria-live='polite'
      onClick={toggleTheme}
    >
      <SunAndMoonIcon />
    </button>
  );
}

export default ThemeSwitch;
```

Note that `getThemeName` is a simple function that returns the theme name.

```ts
export type ThemeType = 'light' | 'dark';

export const getThemeName = (theme: string | undefined): ThemeType => {
  if (theme === 'dark' || theme === 'light') {
    return theme;
  }
  return 'light';
};
```

## 2.4. CSS

Following this guide, let's manipulate the icon's CSS by modifying `theme.module.css`.

First, define the button class `.themeToggle`. Remove default button styles and provide appropriate designs. Also, use `outline-offset` to create spacing.

For touchscreen users, the size of `2rem` may not be sufficient, so we will increase the size on touchscreens using `@media (hover: none)`.

Color variables defined in `reset.css` will be used, ensuring that the icon's color automatically changes according to the current theme without the need for explicit styling.

```css
.themeToggle{
  --size: 2rem;
  --icon-fill: var(--infoTextColor);
  --icon-fill-hover: var(--textColor);

  background: none;
  border: none;
  padding: 0;

  inline-size: var(--size);
  block-size: var(--size);
  aspect-ratio: 1;
  border-radius: 50%;

  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  outline-offset: 5px;
}

@media (hover: none){
  .themeToggle{
    --size: 48px;
  }
}
```

Adjust the size of the SVG component within the button and round the ends of the lines using `stroke-linecap`.

```css
.themeToggle > svg{
  inline-size: 100%;
  block-size: 100%;
  stroke-linecap: round;
}
```

Now let's set various additional properties such as color and line thickness while configuring animation properties for the `transform`.

```css
/* Animation origin settings */
.sunAndMoon > :is(.moon, .sun, .sunBeams){
  transform-origin: center center;
}

.sunAndMoon > :is(.moon, .sun){
  fill: var(--icon-fill);
}

.themeToggle:is(:hover, :focus-visible) > .sunAndMoon > :is(.moon, .sun){
  fill: var(--icon-fill-hover);
}

.sunAndMoon > .sunBeams{
  stroke: var(--icon-fill);
  stroke-width: 2px;
}

.themeToggle:is(:hover, :focus-visible) .sunAndMoon > .sunBeams{
  stroke: var(--icon-fill-hover);
}

/* Dark mode styling */
[data-theme="dark"] .sunAndMoon > .sun{
  transform: scale(1.75);
}

[data-theme="dark"] .sunAndMoon > .sunBeams{
  opacity: 0;
}

[data-theme="dark"] .sunAndMoon > .moon > circle{
  transform: translateX(-7px);
}

@supports (cx: 1){
  [data-theme="dark"] .sunAndMoon > .moon > circle{
    transform: translateX(0);
    cx:17;
  }
}
```

This implementation allows the theme to change upon clicking the button, including the icon.

## 2.5. Animation

Let's add an animation for a smooth transition of the icon. However, animations can put significant load on low-spec devices, and users may not want animations due to visual fatigue.

Therefore, animations should use the `prefers-reduced-motion` media query. For details on this query, refer to the article on [controlling animation actions using prefers-reduced-motion](https://mong-blog.tistory.com/entry/CSS-%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98-%EB%8F%99%EC%9E%91%EC%9D%84-%EC%BB%A8%ED%8A%B8%EB%A1%A4%ED%95%98%EB%8A%94-prefers-reduced-motion).

Consequently, the animation should be contained within the `prefers-reduced-motion: no-preference` media query. You can also observe the animation progress using the [Chrome Developer Tools Animation Panel](https://developer.chrome.com/docs/devtools/css/animations/).

Here’s the unpacked CSS formerly written in postCSS. Although `:has` could be used as a substitute for `@nest`, not all browsers support it yet.

```css
/* Animation origin settings */
.sunAndMoon > :is(.moon, .sun, .sunBeams){
  transform-origin: center center;
}

.sunAndMoon > :is(.moon, .sun){
  fill: var(--icon-fill);
}

.themeToggle:is(:hover, :focus-visible) > .sunAndMoon > :is(.moon, .sun){
  fill: var(--icon-fill-hover);
}

.sunAndMoon > .sunBeams{
  stroke: var(--icon-fill);
  stroke-width: 2px;
}

.themeToggle:is(:hover, :focus-visible) .sunAndMoon > .sunBeams{
  stroke: var(--icon-fill-hover);
}

/* Dark mode styling */
[data-theme="dark"] .sunAndMoon > .sun{
  transform: scale(1.75);
}

[data-theme="dark"] .sunAndMoon > .sunBeams{
  opacity: 0;
}

[data-theme="dark"] .sunAndMoon > .moon > circle{
  transform: translateX(-7px);
}

@supports (cx: 1){
  [data-theme="dark"] .sunAndMoon > .moon > circle{
    transform: translateX(0);
    cx:17;
  }
}

@media (prefers-reduced-motion: no-preference){
  .sunAndMoon > .sun{
    transition: transform .5s var(--ease-elastic-3);
  }

  .sunAndMoon > .sunBeams{
    transition: 
        transform .5s var(--ease-elastic-4),
        opacity .5s var(--ease-3)
      ;
  }

  /* Animation for moon icon */
  .sunAndMoon .moon > circle{
    transition: transform .25s var(--ease-out-5);
  }

  @supports (cx: 1){
    .sunAndMoon .moon > circle{
      transition: cx .25s var(--ease-out-5);
    }
  }

  [data-theme='dark'] .sunAndMoon > .sun{
    transform:scale(1.75);
    transition-timing-function: var(--ease-3);
    transition-duration: .25s;
  }

  /* Adding slight rotation during the transition for dynamism */
  [data-theme='dark'] .sunAndMoon > .sunBeams{
    transform: rotateZ(-25deg);
    transition-duration: .15s;
  }

  [data-theme='dark'] .sunAndMoon > .moon > circle{
    transition-delay: .25s;
    transition-duration: .5s;
  }
}
```

We now have a natural animation for the icon transition upon button clicks.

# 3. Creating New Themes

## 3.1. Defining Theme Colors

I am a fan of the [Light Pink Theme](https://marketplace.visualstudio.com/items?itemName=mgwg.light-pink-theme) in VSCode. In addition to the light and dark themes, let’s also create a pink theme. We previously set up pink and darkPink in the `Provider` component.

From the `ThemeProvider` we saw earlier, the `value` and `themes` properties are defined as follows.

```tsx
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      defaultTheme='system'
      enableSystem={true}
      value={{ dark: 'dark', light: 'light', pink: 'pink', darkPink: 'darkPink' }}
      themes={['dark', 'light', 'pink', 'darkPink']}
    >
      {children}
    </ThemeProvider>
  );
};
```

Since nearly all element colors were already defined using CSS variable names, simply add the colors for the themes in `src/styles/theme.css`, and they will be automatically applied.

The colors for the pink theme reference the [Visual Studio Code Light Pink Theme](https://marketplace.visualstudio.com/items?itemName=mgwg.light-pink-theme) and [Open Color](https://yeun.github.io/open-color/).

The darkPink theme is adapted from the [Kuromi Color Palette](https://www.color-hex.com/color-palette/95814) and [Kuromi colours Color Palette](https://www.color-hex.com/color-palette/1022257), noting how pink and purple hues complement each other, as well as utilizing a few colors from [Open Color](https://yeun.github.io/open-color/).

The defined color variables are as follows.

```css
[data-theme='pink'] {
  --bgColor: #f5f0f3;
  --textColor: #632c3b;

  --contentBgColor: #f5e3ef;
  --contentBgHover:#f5e3ef;
  --headerBorderColor:#ffdeeb;
  --borderColor: #af4670;
  --shadowColor:#868e96;
  --infoTextColor:#d6336c;
  
  --codeBlockBgColor:#ffdeeb;
  --codeBlockTextColor:#a61e4d;
  --accentBgColor:#ffdeeb;
  --accentBgHover:#fcc2d7;
  --accentTextColor:#c2255c;
  --lightAccentTextColor:#f06595;
  --linkColor:#d6336c;
}

[data-theme='darkPink'] {
  --bgColor: #252526;
  --textColor: #f695c6;

  --contentBgColor: #343a40;
  --contentBgHover: #343a40;
  --headerBorderColor:#565656;

  --borderColor: #FFD6CD;
  --shadowColor:#868e96;
  --infoTextColor:#c097cf;

  --codeBlockBgColor:#845ef7;
  --codeBlockTextColor:#f3f0ff;
  --accentBgColor:#845ef7;
  --accentBgHover:#5f3dc4;
  --accentTextColor:#e5dbff;
  --lightAccentTextColor:#9775fa;
  --linkColor:#b197fc;
}
```

## 3.2. Designing the Theme Toggle Actions

Currently available themes are light and dark, but we will create another button for the pink and darkPink themes. The interactions can be conceptualized as follows.

The existing sun/moon button indicates the current state, transitioning from one theme to another. When in light mode, it switches to dark, and vice versa.

|Current Theme|Sun/Moon Button Click|
|---|---|
|light|dark|
|dark|light|

How should the pink theme toggle button behave? Given that the pink theme is less familiar, switching based on the current theme seems appropriate. The expected interactions could be as follows:

From the pink theme, toggling it again would switch between pink and darkPink. This transforms our interactions into the following table:

|Current Theme|Sun/Moon Button Click|Pink Button Click|
|---|---|---|
|light|dark|pink|
|dark|light|darkPink|
|pink|?|darkPink|
|darkPink|?|pink|

What should happen when the sun/moon button is clicked again in the pink theme? Based on how it operates when transitioning from light/dark to pink, it’s reasonable to expect the reverse behavior—hence the final design:

|Current Theme|Sun/Moon Button Click|Pink Button Click|
|---|---|---|
|light|dark|pink|
|dark|light|darkPink|
|pink|light|darkPink|
|darkPink|dark|pink|

## 3.3. Separate Existing Buttons into Components

It’s beneficial to separate these buttons into components. Therefore, create the `lightDarkToggle` and `pinkToggle` folders within `themeSwitch` and each should contain `index.tsx` and `styles.module.css`. The `LightDarkToggle` component can be created as follows.

The styles for `lightDarkToggle/styles.module.css` can include the relevant CSS defined for the sun/moon button.

```tsx
// src/components/molecules/themeSwitch/lightDarkToggle/index.tsx
import styles from './styles.module.css';

function LightDarkToggle({ toggleClick }: {toggleClick: () => void}) {
  {/* aria-hidden allows screen readers to ignore this since the icon is purely decorative */}
  return (
    <button 
      className={styles.themeToggle} 
      title='Toggle Light & Dark' 
      aria-label='auto'
      aria-live='polite'
      onClick={toggleClick}
    >
      <svg className={styles.sunAndMoon} aria-hidden='true' width='24' height='24' viewBox='0 0 24 24'>
        <circle className={styles.sun} cx='12' cy='12' r='6' mask='url(#moonMask)' fill='currentColor'/>
        <g className={styles.sunBeams} stroke='currentColor'>
          <line x1='12' y1='1' x2='12' y2='3' />
          <line x1='12' y1='21' x2='12' y2='23' />
          <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
          <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
          <line x1='1' y1='12' x2='3' y2='12' />
          <line x1='21' y1='12' x2='23' y2='12' />
          <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
          <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
        </g>
        <mask className={styles.moon} id='moonMask'>
          <rect x='0' y='0' width='100%' height='100%' fill='white' />
          <circle cx='24' cy='10' r='6' fill='black' />
        </mask>
      </svg>
    </button>
  );
}

export default LightDarkToggle;
```

## 3.4. Pink Button Markup

The pink button can also be designed similarly, utilizing an appropriate SVG icon. In inspiration from the sun/moon toggle button, I chose a [star SVG icon](https://www.svgrepo.com/svg/529943/star-fall-minimalistic).

```tsx
import styles from './styles.module.css';

function PinkToggle({ toggleClick }: {toggleClick: () => void}) {
  return (
    <button
      className={styles.pinkThemeToggle} 
      title='Toggle Pink & Dark Pink' 
      aria-label='auto'
      aria-live='polite'
      onClick={toggleClick}
    >
      <svg aria-hidden='true' width='30' height='30' viewBox='0 0 24 24' className={styles.star} fill='none'>
        <g className={styles.starBody} stroke='currentColor'>
          <path d='M8.32181 14.4933C7.3798 15.9862 6.90879 16.7327 7.22969 17.3433C7.55059 17.9538 8.45088 18.0241 10.2514 18.1647L10.7173 18.201C11.2289 18.241 11.4848 18.261 11.7084 18.3785C11.9321 18.4961 12.0983 18.6979 12.4306 19.1015L12.7331 19.469C13.9026 20.8895 14.4873 21.5997 15.1543 21.5084C15.8213 21.417 16.1289 20.5846 16.7439 18.9198L16.9031 18.4891C17.0778 18.0161 17.1652 17.7795 17.3369 17.6078C17.5086 17.4362 17.7451 17.3488 18.2182 17.174L18.6489 17.0149C20.3137 16.3998 21.1461 16.0923 21.2374 15.4253C21.3288 14.7583 20.6185 14.1735 19.1981 13.0041M17.8938 10.5224C17.7532 8.72179 17.6829 7.8215 17.0723 7.5006C16.4618 7.1797 15.7153 7.65071 14.2224 8.59272L13.8361 8.83643C13.4119 9.10412 13.1998 9.23797 12.9554 9.27143C12.7111 9.30488 12.4622 9.23416 11.9644 9.09271L11.5113 8.96394C9.75959 8.46619 8.88375 8.21732 8.41508 8.68599C7.94641 9.15467 8.19528 10.0305 8.69303 11.7822' />
          <path d='M13.5 6.5L13 6M9.5 2.5L11.5 4.5' />
          <path d='M6.5 6.5L4 4'/>
          <path d='M6 12L4.5 10.5M2 8L2.5 8.5' />
        </g>
      </svg>
    </button>
  );
}

export default PinkToggle;
```

## 3.5. Theme Toggle Button Functionality

Before styling the pink theme button, let's implement the interactions discussed earlier in the `themeSwitch/index.tsx`. Define appropriate `toggleClick` functions and pass them as props to the components. Utilize an `isDarkOrPink` variable for adjustment.

```tsx
function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const isDarkOrPink = getThemeName(theme) === 'dark' || getThemeName(theme) === 'pink';
  const toggleTheme = () => setTheme(isDarkOrPink ? 'light' : 'dark');
  const togglePinkTheme = () => setTheme(isDarkOrPink ? 'darkPink' : 'pink');

  return (
    <div className={styles.container}>
      <LightDarkToggle toggleClick={toggleTheme} />
      <PinkToggle toggleClick={togglePinkTheme} />
    </div>
  );
}
```

## 3.6. Pink Theme Button Design

The CSS is designed as follows. `.pinkThemeToggle` is similar to `LightDarkToggle` with adjusted colors. The hover effect gives the impression of a falling star.

```css
.pinkThemeToggle{
  --size: 36px;
  --pink2: #fcc2d7;
  --pink5: #f06595;
  --pink7: #d6336c;

  --darkPinkBgColor:#f695c6;
  --darkPinkIconColor:#845ef7;

  background: var(--pink2);

  border: none;
  padding: 0;

  inline-size: var(--size);
  block-size: var(--size);

  aspect-ratio: 1;
  border-radius: 50%;

  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  outline-offset: 5px;
  
  overflow:hidden;
}

@media (min-width: 768px){
  .pinkThemeToggle{
    display:block;
  }
}

.pinkThemeToggle > .star{
  padding-top:3px;
  padding-left:1px;
}

.pinkThemeToggle > .star > .starBody{
  stroke: var(--pink5);

  stroke-width: 1.5px;
  stroke-linecap: round;
}

[data-theme='dark'] .pinkThemeToggle{
  background:var(--darkPinkBgColor);
}

[data-theme='dark'] .pinkThemeToggle > .star > .starBody{
  stroke: var(--darkPinkIconColor);
}

[data-theme='darkPink'] .pinkThemeToggle{
  background:var(--darkPinkBgColor);
}

[data-theme='darkPink'] .pinkThemeToggle > .star > .starBody{
  stroke: var(--darkPinkIconColor);
}

@keyframes starFall{
  from{
    transform:translate(-1.5rem, -1.5rem);
  }
  to{
    transform:translate(1.5rem, 1.5rem);
  }
}

@media (prefers-reduced-motion: no-preference){
  .pinkThemeToggle:hover > .star{
    animation:starFall 1s ease-in-out infinite;
  }
}
```

For both `[data-theme='dark']` and `[data-theme='darkPink']`, you can utilize the `:is` pseudo-class or an older method of `[data-theme^='dark']` (selecting all data themes starting with dark) for brevity.

# 4. Implementing Functionality

The original article on [building a theme switch component](https://web.dev/building-a-theme-switch-component/#javascript) describes the implementation of JavaScript to ensure the theme is applied immediately without flickering upon page load.

However, `next-themes` handles this automatically, so this isn't necessary here. If anyone requires this, they may refer to the original article.

# 5. Additional Modifications

(Posted on 2023-09-22)

## 5.1. Adjusting Theme Toggle Button Design

Adding an animation upon hovering over the button appears effective. For `LightDarkToggle`, a slight rotation effect is introduced, while a falling star effect is applied for `PinkToggle`.

However, on mobile devices, a single click keeps the hover state until another area is clicked, appearing awkward; thus, let's apply this only for PC.

Only devices that allow hovering and use a precise pointer can engage this. Therefore, apply the media queries `@media (hover: hover)` and `@media (pointer: fine)` to the areas where animations are implemented.

```css
@media (prefers-reduced-motion: no-preference){
  @media (hover: hover) and (pointer: fine){
    .pinkThemeToggle:hover > .star{
      animation:starFall 1s ease-in-out infinite;
    }
  }
}
```

Apply the same to the CSS for `LightDarkToggle`.

```css
@media (prefers-reduced-motion: no-preference){
  @media (hover: hover) and (pointer: fine){
    .sunAndMoon:hover > .sunBeams{
      animation:rotate 1s ease-in-out infinite;
    }
  
    [data-theme^='dark'] .sunAndMoon:hover :is(.sun, .moon){
      animation:rotate-moon 1s ease-in-out infinite;
    }
  }
}
```

## 5.2. Adjusting Code Theme

This blog can utilize Markdown for writing posts. The transformation of markdown into the required blog content is handled by a library called Contentlayer. How then does code block highlighting occur?

That role is fulfilled by the [rehype-pretty-code](https://rehype-pretty-code.netlify.app/) library. You can verify its usage in the `contentlayer.config.js` file. By modifying this configuration file, you can change the theme of the code blocks. The pink theme prefers the light-plus theme.

Let's configure it like so. Here’s a portion of my `contentlayer.config.js`.

```js
const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    pink: 'light-plus',
    dark: 'github-dark',
  },
};

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [MDXPost, Post],
  markdown: {
    remarkPlugins: [remarkGfm, remarkMath, changeImageSrc, headingTree, makeThumbnail],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], rehypeKatex, highlight],
  },
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath, changeImageSrc, headingTree, makeThumbnail],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], rehypeKatex, highlight],
  },
});
```

For the darkPink theme, I reviewed several available themes in [Shiki](https://unpkg.com/browse/shiki@0.14.2/themes/), but did not find one that fits well. Hence, I decided to employ the [dark pink theme setting file from the light pink theme](https://github.com/mgwg/light-pink-theme/blob/master/themes/Dark%20Pink-color-theme.json).

I imported and formatted the JSON file, saving it in `public/themes/dark-pink-themes.json`. Subsequently, I added it to the `rehypePrettyCodeOptions` in `contentlayer.config.js`. You can simply read the JSON file and apply `JSON.parse` to do so.

```js
const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    pink: 'light-plus',
    dark: 'github-dark',
    darkPink: JSON.parse(
      readFileSync('./public/themes/dark-pink-theme.json')
    ),
  },
};
```

### 5.2.1. Issue with Insufficient Theme Colors

However, a problem arose. The colors rendered from the dark pink theme's JSON were somewhat bland. For example, switching the pink theme (with the code theme being [light-plus](https://unpkg.com/shiki@0.14.2/themes/light-plus.json)) shows my code in a rather monotonous manner as seen in the provided images.

The colors seemed dull because the dark pink theme's color JSON was not comprehensive. Since the initial dark pink theme is inherently somewhat bland, it feels like not enough colors should be applied.

To rectify this, I compared the settings with the [shiki's light-plus theme](https://unpkg.com/shiki@0.14.2/themes/light-plus.json), which is approximately 200 lines longer. 

Using a [JSON difference-checking site](https://www.jsondiff.com/) enabled me to see the differences and I manually contributed similar properties.

For instance, the following property from the light-plus theme file was missing from the dark pink theme file:

```json
{
    "name": "Function declarations",
    "scope": [
      "entity.name.function",
      "support.function",
      "support.constant.handlebars",
      "source.powershell variable.other.member",
      "entity.name.operator.custom-literal"
    ],
    "settings": {
        "foreground": "#795E26"
    }
},
```

This `#795E26` color relates to the `semanticTokenColors.customLiteral` used elsewhere. This property was defined in the dark pink theme file in the form of `#d4d4d4`. Therefore, it can be appropriately added into the dark pink theme file like so:

```json
{
  "name": "Function declarations",
  "scope": [
    "entity.name.function",
    "support.function",
    "support.constant.handlebars",
    "source.powershell variable.other.member",
    "entity.name.operator.custom-literal"
  ],
  "settings": {
    "foreground": "#d4d4d4"
  }
},
```

I gradually filled in missing colors, enhancing the theme to ensure better readability between various tokens. The palette was anchored around pink, purple, and light blue, relying on color adjustments from [Open Color](https://yeun.github.io/open-color) for brightness control.

I also referenced major theme configuration files for additional guidance.

Post implementation and rebuilding, the code blocks exhibited significantly improved coloring, although I’m not entirely satisfied with the design; I am not a designer, so I prefer not to spend excessive time on such matters...

![Improvements in Code Coloring](./code-in-new-dark-pink-theme.png)

# References

Building a theme switch component: https://web.dev/building-a-theme-switch-component/

Dark Theme in NextJs 13 – Using React Context in Server Components: https://www.youtube.com/watch?v=RTAJ-enfums

Next Themes GitHub: https://github.com/pacocoursey/next-themes

SVG viewbox attribute: https://tecoble.techcourse.co.kr/post/2021-10-24-svg-viewBox/

Prefers-reduced-motion: https://mong-blog.tistory.com/entry/CSS-%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98-%EB%8F%99%EC%9E%90%EC%9D%84-%EC%BB%A8%ED%8A%B8%EB%A1%A4%ED%95%98%EB%8A%94-prefers-reduced-motion

Search icon: https://www.svgrepo.com/svg/532555/search

Star fall icon: https://www.svgrepo.com/svg/529943/star-fall-minimalistic

Rehype pretty code documentation: https://rehype-pretty-code.netlify.app/

Pointer media query: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer
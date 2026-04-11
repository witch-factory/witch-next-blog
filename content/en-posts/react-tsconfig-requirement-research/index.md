---
title: Required tsconfig lib and jsx Settings for React + TS Projects
date: "2024-10-27T01:00:00Z"
description: Understanding the necessary tsconfig settings for React projects
tags: ["react", "typescript"]
---

![Thumbnail](./thumbnail.png)

While reviewing the React documentation, I came across information regarding the `lib` and `jsx` settings in tsconfig.json. I delved into these two properties.

# 1. tsconfig Settings Required for React

Using React with TypeScript is quite common. The official React documentation includes a page on ["Using TypeScript"](https://react.dev/learn/typescript).

According to ["Adding TypeScript to Existing React Projects"](https://react.dev/learn/typescript#adding-typescript-to-an-existing-react-project), the process of adding TypeScript to an existing project involves the following steps.

First, it is advised to install `@types/react` and `@types/react-dom`. I understood this because React does not have official types and provides types through a type definition repository called `DefinitelyTyped`.

The issue arises with the `tsconfig.json` settings. The necessary configurations are as follows:

> 1. "dom" must be included in lib (Note: If the lib option is not specified, "dom" is included by default).
> 2. jsx must be set to one of the valid options. For most applications, "preserve" is sufficient. If publishing a library, consult the jsx documentation regarding which value to choose.

Since these options were new to me, I researched their meanings and summarized my findings:

- The `lib` option specifies the type definition files that the TypeScript compiler will use. Adding `"dom"` includes type definition files for the browser DOM.
- The `jsx` option determines how JSX structures are transformed into JS files. For most applications, `preserve` is adequate.

Now let's take a closer look at each option.

# 2. tsconfig - lib Option

The lib option in tsconfig.json specifies the type definition files that the TypeScript compiler will utilize.

For example, in the `tsconfig.json` of a project created with `create-next-app`, the `lib` is defined as follows:

```json
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    // ...
  }
}
```

Let's explore what this means in more detail.

## 2.1. lib.d.ts

TypeScript inherently includes type definitions for built-in JS objects like `Array` and environments like `document`.

Where are these type definitions located? They can be found in the `lib.d.ts` file in the `node_modules/typescript/lib` folder that ships with TypeScript. This file is automatically included when TypeScript is compiled.

Inside this file, you will see that it includes built-in library files via [triple slash directives](https://www.typescriptlang.org/ko/docs/handbook/triple-slash-directives.html). These `///` statements are used at the top of the file to provide information to the compiler that aids in the compilation process.

```ts
// lib.d.ts
/// <reference no-default-lib="true"/>

/// <reference lib="es5" />
/// <reference lib="dom" />
/// <reference lib="webworker.importscripts" />
/// <reference lib="scripthost" />
```

This file specifies which of the other type definition files in the `node_modules/typescript/lib` folder to use. These other files contain type definitions related to specific features of JavaScript, such as those defined in `es2015.symbol.d.ts` concerning ES2015 symbols.

Files added here are automatically incorporated during the TypeScript compilation process (unless the `--noLib` option is used). The `lib` option is one of the factors influencing this. The process of how tsc loads files can be explored in more detail in [tsconfig.json lib](https://norux.me/59).

## 2.2. Configuring lib.d.ts

Apart from the `lib` option, a few options affect which type definition files are included in `lib.d.ts`. Let’s examine them all.

### 2.2.1. Target Option

While the `lib` option allows you to specify type definition files included in `lib.d.ts`, the `target` option has a higher priority. The `target` determines which version of JavaScript your TypeScript code compiles to, thus affecting the types that can be used.

For instance, if the `target` is below `"es6"`, type definition files for ES6 features like `Map` and `Set` will not be included, as those features cannot be used during compilation.

Essentially, what built-in type definition files are included in `lib.d.ts` depends fundamentally on the `target` option in tsconfig.json.

Certain platforms or frameworks, such as Node, may require a minimum version to be specified in the `target` option, as they have their own versions and types. For example, using `"esnext"` is recommended for Next.js. Type definitions required by other environments can be checked in the [tsconfig/bases](https://github.com/tsconfig/bases?tab=readme-ov-file#centralized-recommendations-for-tsconfig-bases) repository.

### 2.2.2. Lib Option

However, you may want to change the built-in type definition files determined by the `target` option. For example, if you are using an ES5 runtime but rely on a polyfill for `Promise`, it would be convenient to utilize the ES6 type definition for `Promise`. In such cases, you can directly use the `lib` option to specify which type definitions to include.

According to the [lib section in the TypeScript documentation](https://www.typescriptlang.org/tsconfig/#lib), you should consider using the `lib` option in the following cases:

- The program does not execute in a browser environment and thus does not require the "dom" type definition.
- The runtime platform provides certain JavaScript objects via polyfills but does not fully support the grammar of that ECMAScript version.
- There are higher ECMAScript version polyfills or native implementations available.

For instance, if you are using a polyfill for `Promise`, the `lib` option can be set up as follows:

```json
{
  "compilerOptions": {
    "lib": [
      "es5",
      "dom",
      "dom.iterable",
      "ES2015.Promise"
    ]
  }
}
```

The list of available type definition files can be found in the [lib section of the TypeScript documentation](https://www.typescriptlang.org/tsconfig/#lib).

### 2.2.3. Packages in node_modules

Since `target` and `lib` are options in tsconfig.json, it is natural that they can influence type definition files. But how can packages in node_modules affect this? This is intended for scenarios where type definition files are managed separately.

To summarize the current flow: the `target`, which decides which version of JavaScript the code is compiled into, determines the base `lib.d.ts` file. The `lib` option allows you to control which type definition files are directly included.

However, in some cases, this may become a disadvantage or fail to provide adequate control over types for the user. This necessitates using the built-in type definition files from TypeScript.

For instance, what if you need to constantly upgrade the TypeScript version, and the built-in type definitions cause breaking changes due to modifications in the DOM API? Or if the developer is adding or customizing a new type definition required for a project?

In such scenarios, just using the `lib` option in tsconfig.json is not sufficient. Therefore, starting from TypeScript 4.5, a feature was added to retrieve type definitions through npm packages.

Specifically, when the TypeScript compiler searches for type definition files to include in `lib.d.ts`, it looks for `node_modules/@typescript/lib-*` packages first. This is where the type definition files you want to use can be placed.

For instance, if you wanted to find the `dom` type definition file, the compiler would first check `node_modules/@typescript/lib-dom` before looking for `lib.dom.d.ts`.

To use a specific version of the DOM API type definition file, you can define the dependency in package.json as follows. Upon installing the `@typescript/lib-dom` package, the TypeScript compiler will utilize the type definition files from that package.

```json
{
 "dependencies": {
    "@typescript/lib-dom": "npm:@types/web"
  }
}
```

### 2.2.4. noLib Option

Setting the `"noLib"` option to true in tsconfig.json or specifying the `--noLib` flag in the command line will prevent `lib.d.ts` from being added and used during TypeScript compilation. This means the type definitions for JS built-in objects, including `Array`, will not be available.

You may use this option if you want to define types for built-in objects like `Array`, `Date`, `Map`, and others directly, especially when working in a custom environment that significantly differs from standard browser environments.

Generally, the use of `lib.d.ts` is preferred. Utilizing this option complicates sharing the project with others and can make it difficult to use code written by others, so it is not recommended.

## 2.3. lib Option and React

Remembering what we have learned, it becomes clear why it is necessary to add `"dom"` to the `lib` array in the existing project's `tsconfig.json`. React uses the browser DOM, and we must include the type definitions for this DOM API in `lib.d.ts`.

Just looking at the type definition file index.d.ts of `@types/react-dom` shows that many types defined in `lib.dom.d.ts`, such as `Element`, are extensively utilized.

# 3. tsconfig - jsx Option

> You must set jsx to one of the valid options. In most applications, preserve is sufficient. Refer to the jsx documentation for guidance if you're publishing a library. - React Official Documentation

This setting determines how JSX structures are transformed into JS files.

## 3.1. JSX

JSX is an extension of JavaScript syntax that allows you to write code that combines rendering logic and markup. It uses a syntax similar to HTML while maintaining the functionality of JavaScript, which is why it is widely used in React.

However, since JavaScript engines cannot directly comprehend JSX, the code must be transformed into JavaScript at runtime. The `jsx` option defines how this transformation occurs.

Specifically, the `jsx` option configures the format in which JSX is converted to JavaScript.

## 3.2. Possible jsx Options

According to the [tsconfig jsx options](https://www.typescriptlang.org/tsconfig/#jsx) on the TypeScript website, the following options are available. Examples can also be checked at that link.

- react-jsx: Generates `.js` files that transform JSX into optimized `_jsx` calls for production.
- react-jsxdev: Generates `.js` files that transform JSX into `_jsxDEV` calls for development.
- preserve: Leaves JSX unchanged, generating `.jsx` files.
- react-native: Generates `.js` files while preserving JSX.
- react: Transforms JSX into equivalent `React.createElement` calls in `.js` files.

If you utilize the `preserve` option stated in the React official documentation, JSX will remain untransformed, allowing Babel to perform the transformation. JSX transformation can also be done with Babel. Notably, using Babel allows the use of JSX irrespective of React.

## 3.3. jsx Option and React

Recognizing the significance of correctly setting the `jsx` option in tsconfig.json is essential, given our prior discussions. React utilizes JSX, and JavaScript transformation is required to ensure that browsers interpret it correctly.

The reason the `"jsx": "preserve"` option is generally sufficient is that React internally uses Babel. However, when publishing a library, you might need to select a different value. Regardless, a valid option must be established for utilizing JSX.

# 4. Conclusion

We explored the reasons for setting the `lib` and `jsx` options in the tsconfig.json of React projects.

The `lib` option specifies the type definition files the TypeScript compiler will use. To employ browser DOM types, `"dom"` must be added to the `lib` option.

The `jsx` option determines how the JSX structures used in React are transformed into JavaScript files. It needs to be set to one of the valid options for React's JSX to be correctly transformed.

# References

React docs, Using TypeScript

https://react.dev/learn/typescript

TSConfig Reference on lib/noLib Option, jsx Option

https://www.typescriptlang.org/ko/tsconfig

lib in tsconfig.json

https://norux.me/59

TypeScript Deep Dive - lib.d.ts

https://radlohead.gitbook.io/typescript-deep-dive/type-system/lib.d.ts

TypeScript Triple-Slash Directives

https://it-eldorado.com/posts/efa883af-7dd4-4680-a5bb-c09184883ae1

https://www.typescriptlang.org/ko/docs/handbook/triple-slash-directives.html

Supporting lib from node_modules

https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#supporting-lib-from-node_modules

TypeScript repo issue, Support resolving `@typescript/[lib]` in node modules #45771

https://github.com/microsoft/TypeScript/pull/45771

TypeScript Handbook, JSX

https://www.typescriptlang.org/ko/docs/handbook/jsx.html

Writing Markup with JSX

https://ko.react.dev/learn/writing-markup-with-jsx

Introducing the New JSX Transform

https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html

7.9.0 Released: Smaller preset-env output, Typescript 3.8 support and a new JSX transform

https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154httpsgithubcombabelbabelpull11154
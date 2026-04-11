---
title: TS Exploration - Small Insights on TS Modules
date: "2024-02-17T00:00:00Z"
description: "Notes on the module system in TS"
tags: ["typescript"]
---

JS officially supports a module system using import/export from ES2015. TS naturally shares this, with some distinct aspects noted below.

For information on modules in JS, refer to [JS Exploration - require, import, and JS module system](https://witch.work/posts/import-and-require).

# 1. export

Like other objects in JS, types can be exported. This allows usage in other files.

```ts
// types.ts
export type Person = {
  name: string;
  age: number;
};
```

```ts
// index.ts
import { Person } from "./types";
```

Using `*` allows importing the entire module, functioning as a copy of its contents. In the following example, `types.ts` is imported and used under the name `types`.

```ts
// index.ts
import * as types from "./types";

const person: types.Person = {
  name: "witch",
  age: 20,
};
```

This approach prevents collisions, allowing modules to have the same named interfaces or namespaces without merging.

## 1.1. type export

You can specify that the import/export target is a type using the `type` keyword. This is known as type import/export.

```ts
// types.ts
type Person = {
  name: string;
  age: number;
};

export type { Person };
```

```ts
// index.ts
import type { Person } from "./types";
```

Typically, TS understands whether the values being imported/exported are types, making this declaration unnecessary. However, in some cases, it is beneficial, warranting its introduction, which will be discussed in a separate article.

## 1.2. export all

Using `export *` allows all exports from a module to be used in another module.

```ts
export * as types from "./types";
```

This can be imported and used as follows.

```ts
import { types } from "./types";
```

# 2. Compatibility between cjs and esm

Initially, objects exported using CommonJS cannot be imported using ES2015 syntax. Nonetheless, TS offers several solutions for this.

## 2.1. CommonJS export

In CommonJS, the `exports` object defines the values that can be exported within a file.

```js
// commonJS
// Exporting multiple objects
exports.a = 1;
exports.b = 2;
exports.c = 3;

// Exporting a single object
const obj = {
    a: 1,
    b: 2,
    c: 3
};

module.exports = obj;
```

The syntax similar to this in ES2015 is known as default export. However, they are not compatible, meaning you cannot export in cjs style and import in ES2015 style.

## 2.2. export = syntax

To address this, TS allows specifying a single object exported from a module using the `export =` syntax. If a library's `index.d.ts` contains `export = ...`, that library adheres to the CommonJS module system, yet allows the module to be imported using ES2015 style with `import`.

```ts
// types.ts
class Person {
  name: string;
  age: number;
}

export = Person;
```

To import such an exported module, a syntax combining `import` and `require` is used. Notably, since there is only one object exported from the `./types` file with `export =`, it can be imported under any name.

```ts
import Person = require("./types");
```

The code utilizing this module will be compiled by the compiler into CommonJS, AMD, ES6 module syntax, etc. This module can be specified in the compile command using the `--module` keyword.

```bash
tsc --module commonjs index.ts
```

## 2.3. esModuleInterop

However, using both `import` and `require` together feels awkward. Setting `esModuleInterop` to true in `tsconfig.json` allows natural usage of ES2015 module syntax when importing CommonJS modules.

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

With this setting, code originally requiring both `import` and `require` can be simplified to:

```ts
import Person from "./types";
```

For principles regarding this, refer to [Mixing ES Module and CommonJS Module Usage (esModuleInterop)](https://simsimjae.medium.com/es%EB%AA%A8%EB%93%88%EB%B0%A9%EC%8B%9D%EA%B3%BC-commonjs-%EB%AA%A8%EB%93%88-%EB%B0%A9%EC%8B%9D%EC%9D%84-%EC%84%9B%EC%96%B4-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-esmoduleinterop-65529471948e).

# 3. Script Files and Module Files

If there are no `import` or `export` keywords at the top level of the file, it is recognized as a script file, and the type definitions are accessible globally. Conversely, the presence of `import` or `export` defines it as a module file.

```ts
// Script file
interface Person {
  name: string;
  age: number;
}
```

In contrast, if `export` is used in this way, it becomes a module file. It’s important to note that if `export` is within a namespace or another non-top-level scope, it remains a script file.

```ts
// Module file
export interface Person {
  name: string;
  age: number;
}
```

Care must be taken when two types share the same name, one in a script file and the other in a module file. The content of the type may differ depending on whether it is used directly or imported.

For instance, if there is a type named `Person` in a script file, it can be accessed without import. However, if a module file named `person.ts` also exports a `Person` type, the content may differ between direct use and import.

# References

https://www.typescriptlang.org/ko/docs/handbook/modules.html

Jo Hyun-young - TypeScript Textbook

https://www.typescriptlang.org/tsconfig#esModuleInterop
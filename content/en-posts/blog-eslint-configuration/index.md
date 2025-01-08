---
title: Applying ESLint 9 to a Blog - A Record of Challenges and Settings
date: "2025-01-05T01:00:00Z"
description: "Challenges encountered while applying ESLint 9 to the blog, along with code formatting and configuration using ESLint"
tags: ["blog", "front", "study", "web"]
---

# Introduction

I needed to install a new library for my blog project. While installing the new library with pnpm, a warning appeared stating that the currently used eslint 8 was deprecated.

```bash
WARN  deprecated eslint@8.47.0: This version is no longer supported. Please see https://eslint.org/version-support for other options.
```

Since eslint 8 is no longer supported, I was prompted to install the latest version. I knew that eslint 9 had been released, but I had postponed the upgrade due to the many changes required and the lack of available resources. However, I decided to try upgrading to eslint 9 this time.

# Starting Installation and Migration to ESLint 9

First, I will install eslint 9. Since I use pnpm, I installed it as follows:

```bash
# As of January 2025, the latest version of eslint is 9.17.0, so 
# eslint@latest can also be installed
pnpm install eslint@9
```

Next, I need to change the configuration file. From eslint 9, the existing configuration file format has been deprecated, and a new flat config format must be used.

Settings like `extends` and `overrides` are removed, and the new format includes using a one-dimensional array for configuration objects in modern JS. Although this is not the main topic of this article, further details about flat config can be found in [ESLint's introduction to flat config](https://eslint.org/blog/2022/08/new-config-system-part-2/).

Thus, to use eslint 9, the existing eslint configuration file must be changed to a flat config format called `eslint.config.mjs`. I was originally using the `.eslintrc.json` file, so I decided to modify it.

There is a tool available for [converting the old config file format to flat config](https://www.npmjs.com/package/@eslint/migrate-config), which can be used to establish a new configuration file. Since I was using the `.eslintrc.json` configuration file, I executed the following command:

```bash
# .yml or other file types are also possible
# However, as of the writing of this article, it is stated that it does not work for .eslintrc.js files 
# https://eslint.org/docs/latest/use/configure/migration-guide
npx @eslint/migrate-config .eslintrc.json
```

When this command is executed, a message appears indicating that the existing configuration file has been converted to a flat config, and an `eslint.config.mjs` file is automatically created. Fortunately, the existing file is not deleted.

```bash 
Migrating .eslintrc.json

Wrote new config to ./eslint.config.mjs

You will need to install the following packages to use the new config:
- @eslint/js
- @eslint/eslintrc

You can install them using the following command:

npm install @eslint/js @eslint/eslintrc -D
```

Flat config recommends using ESM format for module imports, so let’s keep the `.mjs` extension of the automatically generated file. If you want to use CJS, you can change the `languageOptions.sourceType` property in the [configuration file](https://eslint.org/blog/2022/08/new-config-system-part-2/#setting-sourcetype-in-flat-config).

Following the completion message, let's install `@eslint/js` and `@eslint/eslintrc` using pnpm.

```bash
pnpm install @eslint/js @eslint/eslintrc
```

A new `eslint.config.mjs` file was created at the project root as follows. The usage of plugins previously in JSON string format has been changed to imports, and settings are organized in an array of objects.

```js
// eslint.config.mjs
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("next", "next/core-web-vitals", "prettier"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        "unused-imports": unusedImports,
    },
    rules: {
      // Previously used ESLint rules...
    },
}];
```

Even after doing this, it does not work right away. There are details to fix and plugins that use slightly different operational methods need adjustments in the configuration file. Nevertheless, I have taken the first step. Let's examine the configuration files more closely and modify any additional parts as necessary.

# Modifying Existing Plugins

In the previous eslint configuration file, plugins were loaded as strings in the `plugins` property of the exported object, and external configurations were loaded using the `extends` property.

In contrast, flat config represents plugins as JavaScript objects, loading them from external files using either CommonJS's `require()` or ESM's `import` statements. By adding the loaded object to the `plugins` property, rules from that plugin can be utilized in the `rules`. Therefore, I will first modify the necessary old plugins.

## typescript-eslint

Since `@typescript-eslint/eslint-plugin` and others have merged into the new `typescript-eslint` package, I will install it first.

```bash
pnpm add -D typescript-eslint
# Remove old packages
pnpm remove @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

[`typescript-eslint` provides a `config` helper function for ESLint configuration. It accepts an arbitrary number of flat config objects and returns them as they are.](https://typescript-eslint.io/packages/typescript-eslint#config) Using this helper function, I aim to write the configuration more conveniently while utilizing autocomplete. Thus, I will reconstruct the existing plugins and settings using the `tseslint.config` function.

Since all the linter settings I used from `@typescript-eslint` were included in the recommended settings of `typescript-eslint`, I decided to simply use those settings.

When importing the recommended settings, I used the `recommendedConfig` property of `FlatCompat` earlier. However, since `typescript-eslint` provides these settings, I will omit `recommendedConfig` from `FlatCompat` and directly pass it to the `tseslint.config` function. Therefore, the configuration file is modified as follows:

```js
// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins:{
      'unused-imports': unusedImports,
    },
    rules:{
      // ...
    }
  },
  // ...
);
```

## Next.js ESLint

My blog is built on Next.js, which provides its own ESLint plugin (`eslint-plugin-next`). In the previously automated converted configuration file, I had also imported Next-related configurations using `compat.extends("next", "next/core-web-vitals")`.

However, I will reconfigure this according to the [official Next.js documentation on ESLint Plugin](https://nextjs.org/docs/app/api-reference/config/eslint).

First, I will replace `compat.extends` with `compat.config`, and then include the previously present Next and Next/core-web-vitals in the `extends` property. Since prettier will be replaced by something else later, I will remove it. This will allow using Next's ESLint plugin.

```js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins:{
      'unused-imports': unusedImports,
    },
    rules:{
      // ...
    }
  },
  // ...
  ...compat.config({
    extends:['next', "next/core-web-vitals"],
    rules:{
      // Add rules here if needed
    }
  }),
);
```

It is important to note that the `eslint-config-next` used for Next's linter settings will set the values for `parser`, `plugins`, and `settings` properties. Therefore, care must be taken not to overwrite any other possible configurations. I believe these settings are executed in a specific order, so I placed the `compat.config()` for Next's ESLint-related settings almost as the last argument in the `tseslint.config` function.

## Next.js ESLint with TypeScript

Many projects also use TypeScript with Next.js, and [Next.js provides ESLint settings for such projects.](https://nextjs.org/docs/app/api-reference/config/eslint#with-typescript) To incorporate this, I will add `next/typescript` to the list of `extends`.

```js
export default tseslint.config(
  ...compat.config({
    extends:["next", "next/core-web-vitals", "next/typescript"],
    rules:{
      // Add rules here if needed
    }
  }),
  // ...
);
```

It is crucial to note that this should not be used together with the recommended settings provided by typescript-eslint. This is because the rules provided by `next/typescript` are based on typescript-eslint's recommended settings. The official documentation mentions this, and this can also be verified by looking at the code of `eslint-config-next`.

```js
// next.js/packages/eslint-config-next/typescript.js
// https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/typescript.js
module.exports = {
  extends: ['plugin:@typescript-eslint/recommended'],
}
```

Thus, using the rules provided by Next's `next/typescript` alongside the recommended settings provided by typescript-eslint will result in an error stating that the typescript-eslint plugin cannot be redefined.

Since I am already utilizing the recommended settings of typescript-eslint via `tseslint.configs.recommended`, using `next/typescript` will cause the previously mentioned error regarding plugin redefinition. Therefore, I chose not to use this setting.

Of course, if a project does not require direct use of typescript-eslint, using `next/typescript` could be a good choice. However, as I wanted to apply a stricter set of rules in addition to just the recommended rules, I opted not to use this.

# Code Formatting Using ESLint Stylistic

## Reasons for Using ESLint Stylistic

Previously, I had been using prettier alongside eslint-config-prettier and eslint-plugin-prettier.

However, the prior eslint configuration file I was using was created before the style-related rules in ESLint were deprecated. Therefore, many style-related configurations such as `semi` were incorporated. Since I also had prettier settings in place, it led to conflicts during automatic corrections. The automatically migrated flat config settings retained these configurations, resulting in similar issues.

To resolve this, one option is to remove style-related rules from eslint. Since these rules have been deprecated in eslint, this could be a valid choice. However, I discovered a solution called ESLint Stylistic, which carries over the style-related rules from ESLint, and I decided to use it instead. This allows the styling to be managed solely through eslint rather than combining it with prettier.

The reasons for this are twofold. First, I have always preferred to handle automatic corrections with eslint alone. The previous eslint configuration file contained numerous style-related rules for that reason. The second reason is that typescript-eslint provides a collection of TypeScript style rules through `tseslint.configs.stylistic`, which I wanted to utilize.

Therefore, instead of using prettier again, I decided to rely on ESLint Stylistic to manage all style-related settings with eslint.

## Using ESLint Stylistic

The use is quite simple. First, I install ESLint Stylistic. [ESLint Stylistic consists of a total of four plugins,](https://eslint.style/guide/getting-started#packages) and the integrated plugin is `@stylistic/eslint-plugin`. I will install this plugin.

```bash
pnpm i -D @stylistic/eslint-plugin
```

Then, I will add it to the plugins in my configuration file.

```js
// config object in eslint.config.mjs
import stylisticJs from '@stylistic/eslint-plugin';

// ...
{
  plugins: {
    '@stylistic': stylisticJs,
  },
  rules: {
    // ...
  }
}
```

My originally used prettier configuration file looked like this:

```json
{
  "singleQuote": true,
  "jsxSingleQuote": false,
  "semi": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "all",
  "printWidth": 80,
  "arrowParens": "always"
}
```

By adding a few more rules to this prettier configuration, I created the following rules object and passed it as an argument to `tseslint.config`.

```js
// eslint.config.mjs
export default tseslint.config(
  // ...
  {
    plugins: {
      '@stylistic': stylisticJs,
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/arrow-parens': ['error'],
      '@stylistic/quotes': [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
        },
      ],
      '@stylistic/jsx-quotes': ['error'],
      '@stylistic/semi': ['error'],
      '@stylistic/max-len': ['error', { code: 80, tabWidth: 2 }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/keyword-spacing': ['error'],
      '@stylistic/space-before-blocks': ['error'],
      '@stylistic/space-infix-ops': ['error'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'comma', // use comma
            requireLast: true,
          },
          singleline: {
            delimiter: 'comma', // use comma in single line as well
            requireLast: false,
          },
        },
      ],
    },
  },
)
```

## Using Configuration Factory Functions

There is a factory function called `stylistic.configs.customize` which provides recommended rules among these rules and allows for some customizations. I referred to the [Shared Configurations](https://eslint.style/guide/config-presets) documentation and used it as follows. This will apply all the rules set above, excluding the `@stylistic/member-delimiter-style` rule. Additionally, it will also apply the collection of TypeScript-related style rules, `tseslint.configs.stylistic`.

```js
// eslint.config.mjs
export default tseslint.config(
  eslint.configs.recommended,
  eslint.configs.recommended,
  tseslint.configs.stylistic,
  stylisticJs.configs.customize({
    arrowParens: true,
    indent: 2,
    semi: true,
    commaDangle: 'always-multiline',
  }),
  // ...
);
```

With these changes, I removed the prettier-related libraries.

```bash
pnpm remove prettier eslint-config-prettier eslint-plugin-prettier
```

Now, code formatting can be accomplished solely with eslint.

# Typed Linting

typescript-eslint provides enhanced code analysis features related to types in TypeScript projects. Let's take a look.

## Basic Configuration

Previously, I had set basic recommended rules using `tseslint.configs.recommended`. Instead, I can use `tseslint.configs.recommendedTypeChecked` to apply more powerful type-related analysis rules.

To implement this, I must set up `languageOptions` for providing TSConfig to the parser. Following the guidance in the [Linting with Type Information](https://typescript-eslint.io/getting-started/typed-linting) documentation, I added an object with `languageOptions` set into the `tseslint.config` function.

```js
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
```

Then, I will use a rule set that provides type-related rules instead of the recommended settings. The rule sets provided by typescript-eslint include lower-level rules, so there is no need to set them twice. I decided to use `tseslint.configs.strictTypeChecked`, which provides the strictest inspection capabilities. For more detailed configuration related to this, refer to the [typescript-eslint's Shared Configs documentation](https://typescript-eslint.io/users/configs).

For ESLint stylistic, I will use `tseslint.configs.stylisticTypeChecked`, which also offers type-related rules. Thus, the configuration file changes as follows.

```js
// eslint.config.mjs
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  stylisticJs.configs.customize({
    arrowParens: true,
    indent: 2,
    semi: true,
    commaDangle: 'always-multiline',
  }),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // ...
);
```

## Troubleshooting - Resolving File Inclusion Issues in TSConfig

Now, when I run `npx eslint [file path]`, eslint operates smoothly. However, I may encounter errors in several files, such as `eslint.config.mjs` and `next.config.js`.

```bash 
... was not found by the project service. Consider either including it in the tsconfig.json or including it in allowDefaultProject
```

This error is well documented in the troubleshooting section of the [official typescript-eslint documentation](https://typescript-eslint.io/troubleshooting/typed-linting/#i-get-errors-telling-me--was-not-found-by-the-project-service-consider-either-including-it-in-the-tsconfigjson-or-including-it-in-allowdefaultproject). It occurs when attempting to lint files not included in the closest project's `tsconfig.json` regarding type information.

To illustrate with my case, the `include` property of my `tsconfig.json` is as follows:

```json
{
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
  ],
}
```

The `@typescript-eslint/parser` used for typed linting reads the `tsconfig.json` file to obtain type information, so files like `eslint.config.mjs`, which are not included in the `tsconfig.json`, trigger this problem. To resolve this, one option is to directly include these in the tsconfig.json, like so.

```json
{
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "eslint.config.mjs",
    "next.config.js",
  ],
}
```

However, it is not appropriate to include `.js` files in the tsconfig, nor would I be linting type information on `.js` files. Therefore, I decided to configure eslint to avoid type-checked linting for specific files.

```js
// eslint.config.mjs

export default tseslint.config(
  // ... the rest of your config ...
  {
    files: ['*.js', '*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
```

I also used the `files` property to ensure the configured rules only apply to `.ts` and `.tsx` files. This property restricts the settings to apply solely to those files, and I used the `ignores` property to ignore the `node_modules` folder and any files not included in the `src` folder. Omitting lengthy setting rules, the finalized configuration can be briefly summarized as follows:

```js
// eslint.config.mjs
export default tseslint.config(
  {
    ignores: ['.next/*', 'node_modules/*', '!src/**/*'],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  stylisticJs.configs.customize({
    arrowParens: true,
    indent: 2,
    semi: true,
    commaDangle: 'always-multiline',
  }),
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      '@stylistic': stylisticJs,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // rules...
    },
  },
  ...compat.config({
    extends: ['next', 'next/core-web-vitals'],
  }),
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
```

# Other Considerations

## Automatic Formatting on Save in VSCode

Since I use VSCode, I've adjusted the settings to enable eslint to operate automatically upon saving. I added the following to the project's `.vscode/settings.json` file. As I decided to manage styling through the stylistic plugin of eslint, I also set the default formatter to eslint.

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.codeActionsOnSave": {
    "source.fixAll": "always",
    "source.fixAll.eslint": "always"
  },
  "editor.formatOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

# References

ESLint Configuration Migration Guide

https://eslint.org/docs/latest/use/configure/migration-guide

ESLint 9 Flat Config + Prettier Settings (TypeScript, React)

https://romantech.net/1286

typescript-eslint Getting Started

https://typescript-eslint.io/getting-started/

Documentation for typescript-eslint Packages

https://typescript-eslint.io/packages/typescript-eslint/

Shared configs of typescript-eslint

https://typescript-eslint.io/users/configs

Next.js ESLint Plugin (especially with TypeScript)

https://nextjs.org/docs/app/api-reference/config/eslint

ESLint Stylistic Migration

https://eslint.style/guide/migration

ESLint Stylistic Shared Configurations

https://eslint.style/guide/config-presets

Linting with Type Information using typescript-eslint

https://typescript-eslint.io/getting-started/typed-linting

I encountered errors stating "... was not found by the project service. Consider including it in tsconfig.json or in allowDefaultProject"

https://typescript-eslint.io/troubleshooting/typed-linting/#i-get-errors-telling-me--was-not-found-by-the-project-service-consider-either-including-it-in-the-tsconfigjson-or-including-it-in-allowdefaultproject

How to disable type-checked linting for a file?

https://typescript-eslint.io/troubleshooting/typed-linting/#how-do-i-disable-type-checked-linting-for-a-file

Eslint 9 & Next.js 14 - Setup Guide

https://blog.linotte.dev/eslint-9-next-js-935c2b6d0371
---
title: Reasons and Solutions for eslint-config-next Failing in Next.js Projects Using pnpm
date: "2025-04-16T00:00:00Z"
description: "If eslint-config-next throws a Failed to load plugin error in your Next.js project"
tags: ["blog", "front", "study", "eslint"]
---

# Introduction

Next.js, pnpm, and eslint are popular technologies widely used together. Many users combine these technologies, especially when using the `--use-pnpm` flag with `create-next-app`.

```bash
npx create-next-app@latest --use-pnpm
```

This blog started with a project created using a similar command (to be exact, it was `pnpm create next-app`).

However, when using pnpm version 10 or higher, after creating a project and running it in VSCode, eslint does not work properly. Upon inspection, the Output panel shows an error message like the one below.

![eslint error](./eslint-error.png)

There may be an issue with the eslint settings in VSCode. However, even if the settings are correct, the above error can still occur. I discovered that eslint suddenly stopped working in my blog project and have documented the cause and solution.

This article does not cover all aspects of eslint settings. It specifically addresses cases where `eslint-config-next` produces errors after the eslint setup is complete, especially errors similar to the screenshot above. For more details on eslint settings, you can refer to my blog post [Applying ESLint 9 to My Blog, A Struggle and Configuration Records](https://witch.work/ko/posts/blog-eslint-configuration).

## Environment Used

To help others facing similar issues, I will describe the environment I used while writing the article in detail.

The project is based on the `npx create-next-app@latest --use-pnpm` command as of April 15, 2025, with the following major library versions:

- MacOS Sonoma 14.4.1
- Node.js 22.11.0
- npm 10.9.0
- pnpm 10.8.0
- Next.js 15.3.0
- eslint 9.24.0
- @eslint/eslintrc 3.3.1
- eslint-config-next: 15.3.0
- react: 19.1.0
- react-dom: 19.1.0
- typescript: 5.8.3

# Patchwork Solution

## Installing Missing Libraries

Error messages often indicate their own causes. Let's take a closer look at the error message.

```
Error: Failed to load plugin 'react-hooks' declared in ' » eslint-config-next/core-web-vitals » /Desktop/projects/eslint-next-test/node_modules/.pnpm/eslint-config-next@15.3.0_eslint@9.24.0_typescript@5.8.3/node_modules/eslint-config-next/index.js': Cannot find module 'eslint-plugin-react-hooks'
```

The error states that it could not find `eslint-plugin-react-hooks`, which is used by `eslint-config-next`. Let's install this plugin.

```bash
pnpm add -D eslint-plugin-react-hooks
```

After installation, let's try running VSCode again. This time, we encounter a new error.

```
Error: Failed to load plugin '@next/next' declared in ' » eslint-config-next/core-web-vitals » /Desktop/projects/eslint-next-test/node_modules/.pnpm/eslint-config-next@15.3.0_eslint@9.24.0_typescript@5.8.3/node_modules/eslint-config-next/index.js': Cannot find module '@next/eslint-plugin-next'
```

Similar to before, it indicates that the `@next/eslint-plugin-next` plugin could not be found. Let's install that as well.

```bash
pnpm add -D @next/eslint-plugin-next
```

After running VSCode again, we can see a log confirming that eslint is now working correctly.

```
ESLint library loaded from: /Desktop/projects/eslint-next-test/node_modules/.pnpm/eslint@9.24.0/node_modules/eslint/lib/api.js
```

## Question

However, this raises a question. Why do I need to install these plugins myself? This question arises because the libraries we just installed are explicitly defined as dependencies of `eslint-config-next`.

The [ESLint Plugin official documentation for Next.js](https://nextjs.org/docs/app/api-reference/config/eslint) mentions this, and if we check the `package.json` of the `eslint-config-next` package, we find that the plugins I installed are listed under `dependencies`.

Similarly, when I installed the project dependencies, I could find these packages in the `pnpm-lock.yaml` file and in the `node_modules/.pnpm` directory.

```yaml
# Part of pnpm-lock.yaml
eslint-config-next@15.3.0(eslint@9.24.0)(typescript@5.8.3):
    dependencies:
      '@next/eslint-plugin-next': 15.3.0
      # omitted for brevity
      eslint-plugin-react-hooks: 5.2.0(eslint@9.24.0)
```

When I create a Next.js project using npm or yarn, such issues do not occur. So, why does this happen specifically with pnpm? What is the root cause, and how can we resolve this issue cleanly?

# Root Cause

This section explores the fundamental reason for this issue. The explanation is simpler than the solution I will describe in the next section.

In summary, the previous eslint configuration method allowed eslint to locate plugins by specifying them as strings, leading to loading them directly from `node_modules`. There was a setting ensuring that eslint plugins existed at the top level of `node_modules`. However, starting from pnpm v10, this setting was removed from the default configuration. As a result, eslint could not find the plugins, leading to this bug. ([pnpm issue #8878](https://github.com/pnpm/pnpm/issues/8878))

This explanation might be difficult to understand at first. So, I will elaborate a bit more. Some background knowledge about JavaScript package managers and module systems is helpful here.

## eslint Plugin Loading Method and Requirements

The issue arises because eslint failed to load the plugins. But why did that happen? To understand this, let's examine how eslint loads plugins.

In the JavaScript ecosystem, libraries are typically imported using `import` or `require`. While there are many discussions around the differences and history of the two, it is not relevant to the main topic, so I will skip it. If needed, refer to the article [JS Exploration Life - require and import and the JS Module System](https://witch.work/ko/posts/import-and-require).

The important point is not whether one uses `import` or `require`, but that the user "specifies the path of the library module directly." Even though it goes through `node_modules`, the module's location is explicitly stated.

This method also applies to eslint's latest flat config format, which imports plugins using `import`. For example, in my blog's eslint configuration file, the plugins are explicitly stated where they are located.

```js
import eslint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      '@stylistic': stylisticJs,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      // ...
    },
  },
})
```

In contrast, before flat config was introduced, the configuration could be done using multiple formats, including js, json, or yaml, through what is called the "eslintrc" method. When using a `.eslintrc.json` file, it looked something like this:

```json 
// Source: eslint's Configuration Files (Deprecated), Using a configuration from a plugin section
// https://eslint.org/docs/latest/use/configure/configuration-files-deprecated
{
	"plugins": ["react"],
	"extends": ["eslint:recommended", "plugin:react/recommended"],
	"rules": {
		"react/no-set-state": "off"
	}
}
```

When specifying plugins as strings in this way, how did eslint load them? Since these aren't js files, it wouldn't have used `import`.

Instead, eslint performed this task. It would take the strings specified for plugins and load them by adding `eslint-plugin-` as a prefix before calling `require`.

For example, if the `plugins` array contained `"react"`, eslint would load the package `eslint-plugin-react`, behaving as if it had written `require('eslint-plugin-react')`.

Furthermore, plugins could be loaded through `extends`, which could bring in additional configurations (`eslint-config...`). It’s important to note that plugins required by configurations loaded through `extends` are also sourced based on the location of the eslint configuration file.

To clarify, let’s consider an example. Let’s say our `/.eslintrc.json` contains `extends: ['next']`. This indicates that we're using the Next setting. If `eslint-config-next` utilizes `eslint-plugin-react`, it would seem logical for eslint to look for `eslint-plugin-react` in the `node_modules` directory within `eslint-config-next`.

However, this isn't the case! Instead of looking for `eslint-plugin-react` in the `node_modules` of `eslint-config-next`, eslint looks for it in the `node_modules` directory at the project root where the eslint configuration file is located.

![Plugin loading diagram](./eslint-plugin-loading.png)

This means that for eslint to function properly, all the plugin packages used in the configuration file must exist at the top level of the project’s `node_modules`. The eslint loading relies solely on packages at the top of the `node_modules` directory.

## pnpm's Issue

Both npm and yarn install packages such that all packages, including their dependencies, appear at the top level of `node_modules`. This is known as hoisting, and while it has historical context, I will not elaborate on it here. ([Performant NPM - PNPM](https://kdydesign.github.io/2023/09/25/pnpm-tutorial/) offers more insights.) The key takeaway is that when using npm or yarn, all packages exist at the top level of the `node_modules`, allowing eslint to consistently find plugins.

In contrast, pnpm does not install packages at the top level of `node_modules`. Instead, it stores them in the `node_modules/.pnpm` directory and creates symlinks to only the necessary items for each package. This approach is for performance and memory efficiency. In this structure, the plugin packages typically do not reside at the top level of `node_modules`.

Specifically, the plugins that `eslint-config-next` uses as dependencies exist in `node_modules/.pnpm`. Therefore, if the configuration is written using the eslintrc method, eslint would fail to find the required plugins.

Due to the widespread use of eslint, pnpm was aware of this issue. As a result, until pnpm v9, the default configuration made sure that eslint and prettier (commonly used with eslint) related packages existed at the top level of `node_modules`. This was achieved through the `public-hoist-pattern` configuration setting.

This can be roughly visualized as the default setting in the `.npmrc`. (Of course, similar configurations can be done with the `pnpm-workspace.yaml` file. For more about that, see the [`publicHoistPattern` documentation](https://pnpm.io/settings#publichoistpattern).)

```json
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```

However, with the introduction of flat config in eslint, the need for eslint plugins to exist at the top level of `node_modules` was negated. [Thus, pnpm v10 removed the `*eslint*` and `*prettier*` settings from its default `public-hoist-pattern`.](https://github.com/pnpm/pnpm/issues/8378)

Now, by default, eslint-related packages do not exist at the top level of `node_modules` with pnpm.

From a user's perspective employing flat config for eslint, there would be no issue. But it’s not solely reliant on user actions. The `eslint-config-next` still employs the eslintrc method for its settings (as of April 15, 2025). This means that eslint continues to look for plugins at the top level of `node_modules`.

These factors combined mean that using `eslint-config-next` in a pnpm v10 environment triggers this issue. The internal eslint configuration files used by `eslint-config-next` rely on the eslintrc method to load plugins, which is not supported by the configuration changes in pnpm v10.

## Examining the eslint-config-next Package

To be sure, let's examine the code of the `eslint-config-next` package. When you create a Next.js project and set up eslint, this package will be installed. The generated eslint configuration file looks like this:

```js
// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // If the project was created with js settings, "next/typescript" is not present
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

Here, `FlatCompat` is specifically a library function designed to integrate eslintrc settings into flat config. This indicates the use of eslintrc settings. Now, let's check how `next/core-web-vitals` is defined in the `eslint-config-next` package's `core-web-vitals.js`.

```js
// next.js/packages/eslint-config-next/core-web-vitals.js
module.exports = {
  extends: [require.resolve('.'), 'plugin:@next/next/core-web-vitals'],
}
```

Once again, it uses eslintrc formatting. Since `@next/next/core-web-vitals` references additional eslint-plugin configurations, an error will emerge starting with pnpm v10. Lastly, let’s look into the `index.js` file of `eslint-config-next`, which uses similar eslintrc settings.

```js
// next.js/packages/eslint-config-next/index.js
// Complex code for default settings is omitted
module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended',
  ],
  plugins: ['import', 'react', 'jsx-a11y'],
  rules: {
    'import/no-anonymous-default-export': 'warn',
    // ...
  },
  // ...
}
```

Therefore, it has been confirmed that the configuration files used by `eslint-config-next` are still based on the eslintrc format rather than the flat config. Although I only examined `next/core-web-vitals`, `next/typescript` follows the same pattern.

When you use `eslint-config-next`, eslint will look for the necessary plugins at the top level of `node_modules`. However, since pnpm v10 does not place eslint-related packages at the top level, eslint will fail to locate them, resulting in errors as discussed.

# Solution

While I detailed the problem's root causes, the solution is quite simple. The issue arises due to the absence of the `public-hoist-pattern` setting in pnpm v10, so we can reintroduce this setting. Create a `.npmrc` file at the project root and include the following lines.

```json
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```

Since the package manager's settings have changed, delete the `node_modules` directory and `pnpm-lock.yaml` file before reinstalling the packages.

```bash
rm -rf node_modules
rm -rf pnpm-lock.yaml
pnpm install
```

Now, eslint-related packages will be located at the top level of `node_modules`, allowing eslint to successfully find the plugins used in the eslintrc configuration, thus avoiding errors.

This issue would not occur if the `eslint-config-next` package utilized flat config. As previously mentioned, flat config directly loads plugins via import instead of through eslint.

However, it appears that adopting flat config is still a challenge for the near future. [Many of the plugins that `eslint-config-next` depends on do not yet support flat config.](https://github.com/vercel/next.js/issues/64114#issuecomment-2041022698) Though related PRs are open, implementing them may breach compatibility. 

Even if they were implemented, flat config has not yet seen widespread adoption, making its immediate use in real projects difficult. Therefore, for now, it’s best to apply the above settings. Alternatively, you could experiment with a [flat config preset created by someone else](https://github.com/vercel/next.js/pull/73873).

# Conclusion

Originally, eslint operated by loading plugins specified as strings in the configuration file. To achieve this, eslint needed to find plugins in the top level of the `node_modules` directory. pnpm held this hoisting of eslint plugin packages as its default configuration.

However, the introduction of eslint flat config in pnpm v10 eliminated that default hoisting configuration. Since `eslint-config-next` continues to use the eslintrc configuration file, this incompatibility caused eslint to be unable to locate plugins.

To resolve this, we can restore the `public-hoist-pattern` setting so that eslint-related packages appear at the top level of `node_modules`.

While we could have quickly resolved the issue by installing missing libraries, I wanted to avoid hasty fixes in my blog code. Thus, I pursued a thorough understanding of the problem and documented it herein.

# References

Next.js documentation create-next-app

https://nextjs.org/docs/app/api-reference/cli/create-next-app

Next.js documentation ESLint Plugin

https://nextjs.org/docs/app/api-reference/config/eslint

Next.js eslint-config-next package code

https://github.com/vercel/next.js/tree/canary/packages/eslint-config-next

Next.js issue #64114, New ESLint "flat" configuration file does not work with next/core-web-vitals

https://github.com/vercel/next.js/issues/64114

Next.js issue #73968, Failed to load plugin 'react-hooks' declared in ' » eslint-config-next/core-web-vitals » Cannot find module 'eslint-plugin-react-hooks'

https://github.com/vercel/next.js/issues/73968

pnpm documentation, Settings (pnpm-workspace.yaml)

https://pnpm.io/settings#publichoistpattern

pnpm issue #8378, Remove the default option `*eslint*` and `*prettier*` from public-hoist-pattern option in next major version

https://github.com/pnpm/pnpm/issues/8378

pnpm PR #8621, feat!: remove prettier and eslint from the default value of public-hoist-pattern

https://github.com/pnpm/pnpm/pull/8621

pnpm issue #8878, Using public-hoist-pattern breaks ESLint extension?!

https://github.com/pnpm/pnpm/issues/8878

eslint Configuration Migration Guide documentation

https://eslint.org/docs/latest/use/configure/migration-guide

eslint Configuration Files (Deprecated) documentation

https://eslint.org/docs/latest/use/configure/configuration-files-deprecated

eslint Configure Plugins (Deprecated)

https://eslint.org/docs/latest/use/configure/plugins-deprecated

Introducing ESLint Compatibility Utilities

https://eslint.org/blog/2024/05/eslint-compatibility-utilities/

@eslint/eslintrc README

https://github.com/eslint/eslintrc

Comparing npm, yarn, pnpm

https://yceffort.kr/2022/05/npm-vs-yarn-vs-pnpm

Performant NPM - PNPM

https://kdydesign.github.io/2023/09/25/pnpm-tutorial/

How does ESLint analyze code?

https://1lsang.vercel.app/posts/eslint-01
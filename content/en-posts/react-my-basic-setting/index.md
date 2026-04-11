---
title: Basic React Project Setup
date: "2024-07-10T00:00:00Z"
description: "When working on projects, similar initial setups often recur. This document summarizes those processes."
tags: ["web", "front", "react"]
---

Whenever starting a practice or small-scale project, similar setups are repeated. This is mostly because the most well-known technology stacks are chosen, with a few libraries added as needed.

Thus, I have organized the essentials for starting a project that typically uses React, TypeScript, code formatters, and react-router-dom. You can follow these steps directly.

# 1. Project Creation

The official React documentation recommends starting with a framework; however, at present, using only React is the most common approach.

While create-react-app provided a good boilerplate, it is no longer maintained. Nowadays, Vite has become standard for starting React projects.

Therefore, create a project using Vite that provides a React + TypeScript template. Based on experience, I found pnpm to be the fastest and most stable package manager, so I will use pnpm (while yarn berry is also good, pnpm seems to be more stable for now).

```bash
pnpm create vite project-name --template react-ts
```

# 2. Code Formatter

ESLint + Prettier, along with the emerging library Biome, can be used for formatting.

## 2.1. ESLint + Prettier

Install the tools necessary for formatting. Prettier is a library that allows operations to conform to ESLint rules. Libraries like `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` are typically pre-installed.

```bash
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

Next, let's install eslint plugins. This includes a collection of plugins I used in previous projects along with `eslint-config-airbnb`, which automatically applies Airbnb's JavaScript style guide.

```bash
pnpm add -D eslint-plugin-import eslint-plugin-react eslint-plugin-unused-imports eslint-config-airbnb eslint-plugin-jsx-a11y
```

Then, create a `.eslintrc.cjs` file with the formatting rules as follows. These rules are a blend of lint files from Lee Chang-hee's blog and some Airbnb rules I have used personally.

```js
// .eslintrc.cjs
module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"airbnb",
		"airbnb/hooks",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
		"plugin:import/recommended",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: true,
		tsconfigRootDir: __dirname,
	},
	plugins: ["react-refresh", "unused-imports"],
	rules: {
		"arrow-parens": ["warn", "as-needed"],
		"comma-dangle": ["error", "always-multiline"],
		"consistent-return": "warn",
		"eol-last": ["error", "always"],
		indent: ["error", 2],
		"jsx-a11y/click-events-have-key-events": "off",
		"jsx-quotes": ["error", "prefer-single"],
		"keyword-spacing": "error",
		"no-alert": ["off"],
		"no-console": [
			"warn",
			{
				allow: ["warn", "error"],
			},
		],
		"no-duplicate-imports": "error",
		"no-extra-semi": "error",
		"no-param-reassign": "error",
		"no-shadow": "off",
		"no-trailing-spaces": "error",
		"object-curly-spacing": ["error", "always"],
		"padding-line-between-statements": [
			"error",
			{ blankLine: "always", prev: "*", next: "return" },
			{ blankLine: "always", prev: ["const", "let", "var"], next: "*" },
			{
				blankLine: "any",
				prev: ["const", "let", "var"],
				next: ["const", "let", "var"],
			},
		],
		"prefer-const": "error",
		"prefer-template": "error",
		quotes: [
			"error",
			"single",
			{
				avoidEscape: true,
			},
		],
		semi: "off",
		"space-before-blocks": "error",
		"unused-imports/no-unused-imports": "error",
		"import/extensions": "off",
		"import/no-named-as-default": "off",
		"import/no-unresolved": "off",
		"import/order": [
			"warn",
			{
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
				groups: [
					"builtin",
					"external",
					["parent", "internal"],
					"sibling",
					["unknown", "index", "object"],
				],
				pathGroups: [
					{
						pattern: "~/**",
						group: "internal",
					},
				],
				"newlines-between": "always",
			},
		],
		"import/prefer-default-export": "off",
		"react-hooks/exhaustive-deps": ["warn"],
		"react/jsx-boolean-value": "off",
		"react/jsx-curly-brace-presence": [
			"error",
			{ props: "never", children: "never" },
		],
		"react/jsx-filename-extension": [
			"warn",
			{
				extensions: [".js", ".ts", ".jsx", ".tsx"],
			},
		],
		"react/jsx-no-bind": "off",
		"react/jsx-no-useless-fragment": "warn",
		"react/jsx-props-no-spreading": "off",
		"react/no-array-index-key": "off",
		"react/no-unescaped-entities": "warn",
		"react/prop-types": "off",
		"react/require-default-props": "off",
		"react/self-closing-comp": "warn",
		"react-refresh/only-export-components": [
			"warn",
			{ allowConstantExport: true },
		],
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/no-misused-promises": [
			"error",
			{
				checksVoidReturn: false,
			},
		],
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-shadow": ["error"],
		"@typescript-eslint/no-unsafe-assignment": "warn",
		"@typescript-eslint/no-unused-vars": "error",
		"@typescript-eslint/semi": ["error"],
		"@typescript-eslint/type-annotation-spacing": [
			"error",
			{
				before: false,
				after: true,
				overrides: {
					colon: {
						before: false,
						after: true,
					},
					arrow: {
						before: true,
						after: true,
					},
				},
			},
		],
	},
};
```

However, with the current configuration, automatic fixes may not work properly. This is because the eslint file is not included in the `tsconfig.json`. To resolve this, modify the `include` field in the `tsconfig.app.json` as follows. This file is referenced from `tsconfig.json` and used during compilation.

```json
{
  /* compilerOptions omitted */
  "include": ["src", "vite.config.ts", ".eslintrc.cjs"],
}
```

Even with this change, eslint.json may still not be properly recognized. This is due to Vite using the `tsconfig.app.json`. This can be resolved by changing the `parserOptions` in eslint.

```js
// .eslintrc.cjs
module.exports = {
  // omitted
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.app.json",
    tsconfigRootDir: __dirname,
  },
  // omitted
}
```

Finally, create a prettier configuration file as follows. Create a `.prettierrc.json` in the project root and write the following:

```json
{
  "singleQuote": true,
  "semi": true,
  "useTabs": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 120,
  "arrowParens": "avoid"
}
```

# 3. Alternative Code Formatter - Biome

## 3.1. Reason for Use

As an alternative, the newly released lint library [Biome](https://biomejs.dev/) can also be utilized.

On July 9, 2024, while setting up a new project, I encountered a warning while installing [eslint-plugin-unused-imports](https://github.com/sweepline/eslint-plugin-unused-imports) via pnpm.

```js
Issues with peer dependencies found
.
└─┬ eslint-plugin-unused-imports 4.0.0
  ├── ✕ unmet peer @typescript-eslint/eslint-plugin@8: found 7.16.0
  └── ✕ unmet peer eslint@9: found 8.57.0
```

Visiting [the repository issue](https://github.com/sweepline/eslint-plugin-unused-imports/issues/82), the plugin creator recommended using Biome, stating that they started using it in their company and implied that the plugin is unlikely to be actively maintained.

So, I decided to give Biome a try. Biome is a library that sets up eslint and prettier all at once. An overview of its development can be found in [Biome: Next Generation JS Linter and Formatter](https://teamdable.github.io/techblog/biome-js-linter-and-formatter).

Let's install it according to the official documentation.

## 3.2. Installation and Application

```bash
pnpm add --save-dev --save-exact @biomejs/biome
```

Run the following command to create and initialize the configuration file.

```bash
pnpm biome init
```

Then, install the [vscode Biome plugin](https://marketplace.visualstudio.com/items?itemName=biomejs.biome). This plugin reads the Biome configuration file and automatically corrects the code.

Set the default formatter in the settings to Biome. However, as Biome is not yet widely adopted, other projects may still be using ESLint + Prettier. Thus, changing the vscode default formatter to Biome might be daunting.

Therefore, create a `.vscode` folder within the project and create a `settings.json` inside it with the following configuration:

```json
{
  "editor.defaultFormatter": "biomejs.biome"
}
```

[The earlier eslint and prettier configuration files can be easily migrated to Biome via command line.](https://biomejs.dev/guides/migrate-eslint-prettier/) Running the following commands will automatically migrate the eslint and prettier settings into `biome.json`.

```bash
pnpm biome migrate eslint --write
pnpm biome migrate prettier --write
```

By doing this, configurations such as `vite-tsconfig-paths` and various eslint plugins, as well as `.eslintrc` and `.prettierrc` files, will no longer be needed. Deleting them will lead to a cleaner `package.json`.

I will share my experiences using Biome in a future article.

# 4. Additional Configurations

## 4.1. Import Alias

First, install `vite-tsconfig-paths` to recognize the path alias from the tsconfig file in `vite.config.ts`.

```bash
pnpm add -D vite-tsconfig-paths
```

Then, modify `vite.config.ts` as follows:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
```

This allows you to import using paths that start with `@/`. Add the following `paths` configuration to the `compilerOptions` in `tsconfig.app.json`.

```json
{
  "compilerOptions": {
    /* omitted */
    "paths": {
      "@/*": ["./src/*"]
    }
  }
  /* omitted */
}
```

## 4.2. React Router Dom

To implement basic routing, install `react-router-dom`.

```bash
pnpm add react-router-dom
```

Then, set up the basic router in `src/main.tsx` as follows:

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <div>about</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

Now run the development environment, and when you enter the `/about` route, you will see a small page with the word "about," indicating that routing is correctly configured.

## 4.3. Vanilla Extract

When using other CSS-in-JS libraries like Tailwind or styled-components, Vanilla Extract can also be installed.

```bash
pnpm add @vanilla-extract/css
```

Follow the official documentation for Vanilla Extract's [Integration - Vite](https://vanilla-extract.style/documentation/integrations/vite/). First, install the plugin.

```bash
pnpm add -D @vanilla-extract/vite-plugin
```

Then, add the plugin to `vite.config.ts` as follows:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), vanillaExtractPlugin()],
});
```

# References

Using ESLint Airbnb https://hayjo.tistory.com/111

Shadcn UI Official Documentation https://ui.shadcn.com/

Biome Official Documentation https://biomejs.dev/
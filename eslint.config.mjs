// @ts-check

import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import stylisticJs from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  compat.config({
    extends: ["next", "next/core-web-vitals"],
  }),
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [".next/*", "node_modules/*", "!src/**/*"],
  },
  {
    plugins: {
      "@stylistic": stylisticJs,
      "unused-imports": unusedImports,
    },
    rules: {
      "object-curly-spacing": ["error", "always"],
      "import/extensions": "off",
      "import/prefer-default-export": "off",

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

      "@stylistic/indent": ["error", 2],
      "@stylistic/arrow-parens": ["error"],
      "@stylistic/quotes": [
        "error",
        "single",
        {
          allowTemplateLiterals: true,
        },
      ],
      "@stylistic/jsx-quotes": ["error"],
      "@stylistic/semi": ["error"],
      "@stylistic/max-len": ["error", { code: 80, tabWidth: 2 }],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/keyword-spacing": ["error"],
      "@stylistic/space-before-blocks": ["error"],
      "@stylistic/space-infix-ops": ["error"],
      "@stylistic/member-delimiter-style": [
        "error",
        {
          multiline: {
            delimiter: "comma", // 쉼표 사용
            requireLast: true,
          },
          singleline: {
            delimiter: "comma", // 단일 라인에서도 쉼표 사용
            requireLast: false,
          },
        },
      ],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "react/jsx-filename-extension": [
        "warn",
        {
          extensions: [".tsx"],
        },
      ],
      "react/no-unescaped-entities": "warn",
      "react/jsx-props-no-spreading": "off",
      "react/require-default-props": "off",
    },
  }
);

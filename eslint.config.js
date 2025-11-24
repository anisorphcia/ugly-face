import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 告诉 ESLint 忽略以下划线开头的变量
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // 忽略函数参数中以下划线开头的变量
          varsIgnorePattern: "^_", // 忽略变量中以下划线开头的变量
          destructuredArrayIgnorePattern: "^_", // 忽略解构赋值中以下划线开头的变量
        },
      ],
      // 如果您遇到其他未使用变量的错误，也可以同时启用 ESLint 核心规则的类似配置：
      "no-unused-vars": "off", // 关闭核心规则，使用 TS 插件的规则
    },
  },
  eslintConfigPrettier,
]);

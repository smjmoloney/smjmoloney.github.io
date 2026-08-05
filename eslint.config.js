import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: [
            ".astro/**",
            "dist/**",
            "node_modules/**",
            "public/sw.js",
            "src/data/dmc-colours.generated.ts",
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintPluginAstro.configs["flat/recommended"],
    {
        files: ["*.config.{js,mjs,ts}", "scripts/**/*.{js,mjs}"],
        languageOptions: {
            globals: {
                ...globals.node,
                fetch: "readonly",
            },
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            import: importPlugin,
            "jsx-a11y": jsxA11y,
            react,
            "react-hooks": reactHooks,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...jsxA11y.flatConfigs.recommended.rules,
            ...reactHooks.configs.flat.recommended.rules,
            "import/first": "error",
            "import/no-cycle": "error",
            "import/no-duplicates": "error",
            "react/function-component-definition": [
                "error",
                {
                    namedComponents: "arrow-function",
                    unnamedComponents: "arrow-function",
                },
            ],
            "react/no-multi-comp": ["error", { ignoreStateless: false }],
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["**/features/*/index"],
                            message:
                                "Import feature internals directly; feature barrels are for external consumers.",
                        },
                    ],
                },
            ],
        },
    },
    eslintConfigPrettier,
];

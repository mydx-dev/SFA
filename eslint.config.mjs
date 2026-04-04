import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import boundaries from "eslint-plugin-boundaries";
import filenames from "eslint-plugin-filenames";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";

const compat = new FlatCompat({
    baseDirectory: new URL(".", import.meta.url).pathname,
});

export default [
    ...compat.extends(
        "@typescript-eslint/recommended",
        "react-hooks/recommended",
        "prettier",
    ),
    ...compat.env({ browser: true, node: true, es6: true }),
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            import: importPlugin,
            boundaries,
            filenames,
            "react-hooks": reactHooks,
        },
        settings: {
            "boundaries/elements": [
                {
                    type: "controller",
                    pattern: "src/backend/presentation/controller/**",
                },
                {
                    type: "usecase",
                    pattern: "src/backend/application/usecase/**",
                },
                {
                    type: "service",
                    pattern: "src/backend/application/service/**",
                },
                { type: "domain", pattern: "src/backend/domain/**" },
                { type: "infra", pattern: "src/backend/infrastructure/**" },
                { type: "di", pattern: "src/backend/di.ts" },
                { type: "function", pattern: "src/backend/main.ts" },
                { type: "shared", pattern: "src/shared/**" },
            ],
        },
        rules: {
            "no-console": "error",
            "no-unused-vars": " off",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "error",
            complexity: ["error", 10],
            "max-lines-per-function": ["error", 50],
            "max-depth": ["error", 3],
            "import/no-cycle": ["error", { maxDepth: 2 }],
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "axios",
                            message:
                                "Use approved runtime gateway instead of axios.",
                        },
                        {
                            name: "node-fetch",
                            message:
                                "Use approved runtime gateway instead of node-fetch.",
                        },
                        {
                            name: "got",
                            message:
                                "Use approved runtime gateway instead of got.",
                        },
                    ],
                    patterns: ["@googleapis/*"],
                },
            ],
            "no-restricted-syntax": [
                "error",
                {
                    selector: "MethodDefinition[accessibility='private']",
                    message: "Private methods are not allowed.",
                },
            ],
            "boundaries/element-types": [
                "error",
                {
                    default: "disallow",
                    rules: [
                        {
                            from: "controller",
                            allow: ["usecase", "shared", "di"],
                        },
                        {
                            from: "usecase",
                            allow: ["service", "domain", "shared"],
                        },
                        {
                            from: "service",
                            allow: ["domain", "infra", "shared"],
                        },
                        { from: "domain", allow: ["shared"] },
                        { from: "infra", allow: ["domain", "shared"] },
                        {
                            from: "di",
                            allow: [
                                "controller",
                                "usecase",
                                "service",
                                "domain",
                                "infra",
                                "shared",
                            ],
                        },
                        {
                            from: "function",
                            allow: ["controller", "di", "shared"],
                        },
                        { from: "shared", allow: ["shared"] },
                    ],
                },
            ],
        },
    },
    {
        files: ["src/backend/presentation/controller/**/*.ts"],
        rules: {
            "filenames/match-regex": [
                "error",
                "^[A-Z][A-Za-z0-9]*Controller$",
                true,
            ],
        },
    },
    {
        files: ["src/backend/application/usecase/**/*.ts"],
        rules: {
            "filenames/match-regex": [
                "error",
                "^[A-Z][A-Za-z0-9]*UseCase$",
                true,
            ],
            "no-restricted-syntax": [
                "error",
                {
                    selector: "MethodDefinition[accessibility='private']",
                    message: "Private methods are not allowed.",
                },
                {
                    selector: "NewExpression[callee.name='SheetDB']",
                    message:
                        "Inject SheetDB via DI; do not instantiate in usecases.",
                },
            ],
            "no-restricted-globals": [
                "error",
                "SpreadsheetApp",
                "CacheService",
                "PropertiesService",
                "UrlFetchApp",
            ],
        },
    },
    {
        files: ["src/backend/application/service/**/*.ts"],
        rules: {
            "filenames/match-regex": [
                "error",
                "^[A-Z][A-Za-z0-9]*Service$",
                true,
            ],
        },
    },
    {
        files: ["src/backend/infrastructure/**/*.ts"],
        rules: {
            "filenames/match-regex": [
                "error",
                "^(?:[A-Z][A-Za-z0-9]*(?:Table|API)|tables|setup|index)$",
                true,
            ],
        },
    },
    {
        files: ["**/*.test.ts", "**/*.spec.ts"],
        rules: {
            "boundaries/element-types": "off",
            "import/no-cycle": "off",
        },
    },
];

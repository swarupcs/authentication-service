import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        ignores: [
            "dist",
            "node_modules",
            "eslint.config.mjs",
            "jest.config.js",
            "coverage",
            ".github",
        ],
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // "no-console": "warning",
            "dot-notation": "error",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
);

import tsParser from "@typescript-eslint/parser";

export default [
  { ignores: ["node_modules/**", "fixtures/**", "templates/**", "dist/**"] },
  {
    files: ["packages/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
    rules: { "no-unused-vars": "off" },
  },
];

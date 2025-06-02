module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended", // You might want to keep this for basic linting
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*",
    "/generated/**/*",
  ],
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    // Disable all rules except critical ones
    // For example, enable only errors related to syntax or potential bugs
    // and disable stylistic rules
    "quotes": "off",
    "import/no-unresolved": "off",
    "indent": "off",
    "consistent-return ": "off"
    // Add specific critical rules here, if any
    // e.g., "no-undef": "error",
  },
};

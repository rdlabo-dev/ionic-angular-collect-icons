module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: ["node_modules/", "dist/"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["eslint:recommended"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      rules: {},
    },
  ],
  rules: {},
};


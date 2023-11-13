module.exports = {
  env: {
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "script",
  },
  ignorePatterns: ["node_modules"],
  extends: ["plugin:prettier/recommended"],
  rules: {
    "max-len": ["warn", 120],
  },
};

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const reactNative = require("eslint-plugin-react-native");

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      "react-native": reactNative,
    },
    rules: {
      // Gradual quality guardrails for RN while keeping MVP velocity.
      "react-native/no-unused-styles": "off",
      "react-native/no-color-literals": "off",
      "react-native/no-inline-styles": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
    ignores: ["dist/*", ".expo/*"],
  },
]);

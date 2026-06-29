// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const reactNative = require("eslint-plugin-react-native");
const reactNativeA11y = require("eslint-plugin-react-native-a11y");

/**
 * Starts with warn severity so the team can adopt a11y rules without blocking CI.
 *
 * @param {Record<string, unknown>} rules
 */
function asA11yWarnings(rules) {
  return Object.fromEntries(
    Object.entries(rules).map(([rule, severity]) => [
      rule,
      severity === "error" ? "warn" : severity,
    ]),
  );
}

const a11yBasicRules = asA11yWarnings(reactNativeA11y.configs.basic.rules);

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      "react-native": reactNative,
      "react-native-a11y": reactNativeA11y,
    },
    rules: {
      // Gradual quality guardrails for RN while keeping MVP velocity.
      "react-native/no-unused-styles": "off",
      "react-native/no-color-literals": "off",
      "react-native/no-inline-styles": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],

      ...a11yBasicRules,

      // Hints are useful but optional in React Native; keep as warn only.
      "react-native-a11y/has-accessibility-hint": "off",

      "react-native-a11y/has-accessibility-props": [
        "warn",
        {
          touchables: [
            "TouchableOpacity",
            "TouchableHighlight",
            "TouchableWithoutFeedback",
            "TouchableNativeFeedback",
            "TouchableBounce",
            "Pressable",
            "Button",
          ],
        },
      ],
    },
    ignores: ["dist/*", ".expo/*"],
  },
]);

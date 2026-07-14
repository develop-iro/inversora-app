const DEV_CLIENT_PACKAGES = [
  'expo-dev-client',
  'expo-dev-launcher',
  'expo-dev-menu',
  'expo-dev-menu-interface',
];

const isDevelopmentBuild =
  process.env.EAS_BUILD_PROFILE === 'development' ||
  process.env.EAS_BUILD_PROFILE === 'development-simulator';

/** @type {import('@react-native-community/cli-types').Config} */
module.exports = {
  dependencies: isDevelopmentBuild
    ? {}
    : Object.fromEntries(
        DEV_CLIENT_PACKAGES.map((name) => [
          name,
          {
            platforms: {
              ios: null,
              android: null,
            },
          },
        ]),
      ),
};

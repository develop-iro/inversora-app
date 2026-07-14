const DEV_CLIENT_PACKAGES = [
  'expo-dev-client',
  'expo-dev-launcher',
  'expo-dev-menu',
  'expo-dev-menu-interface',
];

const isDevelopmentBuild =
  process.env.EAS_BUILD_PROFILE === 'development' ||
  process.env.EAS_BUILD_PROFILE === 'development-simulator';

const isProductionBuild = process.env.EAS_BUILD_PROFILE === 'production';

const excludedPackages = [
  ...(isDevelopmentBuild ? [] : DEV_CLIENT_PACKAGES),
  ...(isProductionBuild ? [] : ['@sentry/react-native']),
];

/** @type {import('@react-native-community/cli-types').Config} */
module.exports = {
  dependencies: Object.fromEntries(
    excludedPackages.map((name) => [
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

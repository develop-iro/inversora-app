const { withAndroidManifest, withInfoPlist } = require('expo/config-plugins');

const PINNED_HOSTS = [
  'inversora-api-production.up.railway.app',
  'inversora-api-staging.up.railway.app',
];

/**
 * Enables ATS hardening and disables cleartext traffic when strict transport
 * security is active. This does not implement SPKI certificate pinning.
 *
 * @param {import('expo/config-plugins').ExpoConfig} config
 * @returns {import('expo/config-plugins').ExpoConfig}
 */
const withSslPinning = (config) => {
  const enabled = process.env.EXPO_PUBLIC_SSL_PINNING_ENABLED === 'true';

  if (!enabled) {
    return config;
  }

  config = withInfoPlist(config, (config) => {
    config.modResults.NSAppTransportSecurity = {
      NSAllowsArbitraryLoads: false,
      NSExceptionDomains: Object.fromEntries(
        PINNED_HOSTS.map((host) => [
          host,
          {
            NSIncludesSubdomains: true,
            NSExceptionRequiresForwardSecrecy: true,
          },
        ]),
      ),
    };

    return config;
  });

  config = withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application?.[0];

    if (application?.$) {
      application.$['android:usesCleartextTraffic'] = 'false';
    }

    return config;
  });

  return config;
};

module.exports = withSslPinning;

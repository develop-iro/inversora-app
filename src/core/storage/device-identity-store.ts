import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { apiPost } from '@/core/api/client';
import { createDeviceIdentityStore } from '@/core/storage/device-identity-store.factory';
import { createSecureKeyValueStoragePort } from '@/core/storage/secure-key-value-storage-port';

function resolveAppVersion(): string | undefined {
  const version = Constants.expoConfig?.version?.trim();
  return version && version.length > 0 ? version : undefined;
}

const defaultDeviceIdentityStore = createDeviceIdentityStore({
  storage: createSecureKeyValueStoragePort(),
  platformOs: Platform.OS,
  appVersion: resolveAppVersion(),
  registerDevice: (body) =>
    apiPost<
      { deviceToken: string; deviceId: string },
      { platform: 'ios' | 'android' | 'web'; appVersion?: string }
    >({
      path: '/anonymous-devices/register',
      body,
    }),
});

/**
 * Returns the opaque device token when the installation is registered.
 */
export async function getDeviceToken(): Promise<string | null> {
  return defaultDeviceIdentityStore.getDeviceToken();
}

/**
 * Returns the server-side anonymous device identifier when available.
 */
export async function getDeviceId(): Promise<string | null> {
  return defaultDeviceIdentityStore.getDeviceId();
}

/**
 * Ensures the current installation has a registered anonymous device token.
 */
export async function ensureDeviceRegistered(): Promise<void> {
  return defaultDeviceIdentityStore.ensureDeviceRegistered();
}

export { createDeviceIdentityStore } from '@/core/storage/device-identity-store.factory';

export const deviceIdentityStore = {
  getDeviceToken,
  getDeviceId,
  ensureDeviceRegistered,
};

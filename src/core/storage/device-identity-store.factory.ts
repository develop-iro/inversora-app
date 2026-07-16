import { AppError } from '@/core/errors/app-error';
import {
  DEVICE_ID_STORAGE_KEY,
  DEVICE_TOKEN_STORAGE_KEY,
} from '@/core/storage/device-identity-storage-key';
import type { KeyValueStoragePort } from '@/core/storage/key-value-storage-port';

type AnonymousDevicePlatform = 'ios' | 'android' | 'web';

type RegisterDeviceResponse = {
  deviceToken: string;
  deviceId: string;
};

export type DeviceIdentityStoreOptions = {
  storage: KeyValueStoragePort;
  registerDevice: (body: {
    platform: AnonymousDevicePlatform;
    appVersion?: string;
  }) => Promise<RegisterDeviceResponse>;
  platformOs: string;
  appVersion?: string;
};

function resolveAnonymousDevicePlatform(platformOs: string): AnonymousDevicePlatform {
  if (platformOs === 'ios') {
    return 'ios';
  }

  if (platformOs === 'android') {
    return 'android';
  }

  return 'web';
}

/**
 * Creates the anonymous device-identity store (no React Native imports).
 *
 * @param options - Storage/register/platform dependencies.
 */
export function createDeviceIdentityStore(options: DeviceIdentityStoreOptions) {
  const { storage, platformOs, registerDevice, appVersion } = options;

  let ensureRegistrationPromise: Promise<void> | null = null;

  async function getDeviceToken(): Promise<string | null> {
    return storage.read(DEVICE_TOKEN_STORAGE_KEY);
  }

  async function getDeviceId(): Promise<string | null> {
    return storage.read(DEVICE_ID_STORAGE_KEY);
  }

  async function ensureDeviceRegistered(): Promise<void> {
    if (ensureRegistrationPromise) {
      await ensureRegistrationPromise;
      return;
    }

    ensureRegistrationPromise = (async () => {
      const existingToken = await storage.read(DEVICE_TOKEN_STORAGE_KEY);
      const existingDeviceId = await storage.read(DEVICE_ID_STORAGE_KEY);

      if (existingToken && existingDeviceId) {
        return;
      }

      const response = await registerDevice({
        platform: resolveAnonymousDevicePlatform(platformOs),
        appVersion,
      });

      await storage.write(DEVICE_TOKEN_STORAGE_KEY, response.deviceToken);
      await storage.write(DEVICE_ID_STORAGE_KEY, response.deviceId);
    })().catch((cause) => {
      ensureRegistrationPromise = null;

      throw new AppError(
        'API_REQUEST_FAILED',
        'No se pudo registrar el dispositivo anónimo.',
        cause,
      );
    });

    await ensureRegistrationPromise;
  }

  return {
    getDeviceToken,
    getDeviceId,
    ensureDeviceRegistered,
  };
}

import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { apiPost } from '@/core/api/client';
import { AppError } from '@/core/errors/app-error';
import {
  DEVICE_ID_STORAGE_KEY,
  DEVICE_TOKEN_STORAGE_KEY,
} from '@/core/storage/device-identity-storage-key';
import { readSecureValue, writeSecureValue } from '@/core/storage/secure-storage';

type AnonymousDevicePlatform = 'ios' | 'android' | 'web';

type RegisterDeviceResponse = {
  deviceToken: string;
  deviceId: string;
};

let ensureRegistrationPromise: Promise<void> | null = null;

function resolveAnonymousDevicePlatform(): AnonymousDevicePlatform {
  if (Platform.OS === 'ios') {
    return 'ios';
  }

  if (Platform.OS === 'android') {
    return 'android';
  }

  return 'web';
}

function resolveAppVersion(): string | undefined {
  const version = Constants.expoConfig?.version?.trim();
  return version && version.length > 0 ? version : undefined;
}

/**
 * Returns the opaque device token when the installation is registered.
 */
export async function getDeviceToken(): Promise<string | null> {
  return readSecureValue(DEVICE_TOKEN_STORAGE_KEY);
}

/**
 * Returns the server-side anonymous device identifier when available.
 */
export async function getDeviceId(): Promise<string | null> {
  return readSecureValue(DEVICE_ID_STORAGE_KEY);
}

/**
 * Ensures the current installation has a registered anonymous device token.
 */
export async function ensureDeviceRegistered(): Promise<void> {
  if (ensureRegistrationPromise) {
    await ensureRegistrationPromise;
    return;
  }

  ensureRegistrationPromise = (async () => {
    const existingToken = await readSecureValue(DEVICE_TOKEN_STORAGE_KEY);
    const existingDeviceId = await readSecureValue(DEVICE_ID_STORAGE_KEY);

    if (existingToken && existingDeviceId) {
      return;
    }

    const response = await apiPost<RegisterDeviceResponse, { platform: AnonymousDevicePlatform; appVersion?: string }>({
      path: '/anonymous-devices/register',
      body: {
        platform: resolveAnonymousDevicePlatform(),
        appVersion: resolveAppVersion(),
      },
    });

    await writeSecureValue(DEVICE_TOKEN_STORAGE_KEY, response.deviceToken);
    await writeSecureValue(DEVICE_ID_STORAGE_KEY, response.deviceId);
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

export const deviceIdentityStore = {
  getDeviceToken,
  getDeviceId,
  ensureDeviceRegistered,
};

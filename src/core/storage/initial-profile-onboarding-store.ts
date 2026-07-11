import { Platform } from 'react-native';

import { AppError } from '@/core/errors/app-error';
import { INITIAL_PROFILE_DISMISSED_STORAGE_KEY } from '@/core/storage/initial-profile-onboarding-storage-key';
import {
  deleteSecureValue,
  readSecureValue,
  writeSecureValue,
} from '@/core/storage/secure-storage';

/**
 * Returns whether the initial profile onboarding gate applies on this platform.
 */
export function shouldUseInitialProfileGate(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export const initialProfileOnboardingStore = {
  async getDismissed(): Promise<boolean> {
    if (!shouldUseInitialProfileGate()) {
      return false;
    }

    try {
      const raw = await readSecureValue(INITIAL_PROFILE_DISMISSED_STORAGE_KEY);
      return raw === 'true';
    } catch (cause) {
      throw new AppError(
        'STORAGE_READ_FAILED',
        'No se pudo leer el estado del perfil inicial.',
        cause,
      );
    }
  },

  async setDismissed(): Promise<void> {
    if (!shouldUseInitialProfileGate()) {
      return;
    }

    try {
      await writeSecureValue(INITIAL_PROFILE_DISMISSED_STORAGE_KEY, 'true');
    } catch (cause) {
      throw new AppError(
        'STORAGE_WRITE_FAILED',
        'No se pudo guardar el estado del perfil inicial.',
        cause,
      );
    }
  },

  async clearDismissed(): Promise<void> {
    if (!shouldUseInitialProfileGate()) {
      return;
    }

    try {
      await deleteSecureValue(INITIAL_PROFILE_DISMISSED_STORAGE_KEY);
    } catch (cause) {
      throw new AppError(
        'STORAGE_WRITE_FAILED',
        'No se pudo borrar el estado del perfil inicial.',
        cause,
      );
    }
  },
};

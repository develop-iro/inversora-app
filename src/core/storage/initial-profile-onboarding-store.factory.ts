import { AppError } from '@/core/errors/app-error';
import { shouldUseInitialProfileGateForPlatform } from '@/core/storage/initial-profile-onboarding-policy';
import { INITIAL_PROFILE_DISMISSED_STORAGE_KEY } from '@/core/storage/initial-profile-onboarding-storage-key';
import type { KeyValueStoragePort } from '@/core/storage/key-value-storage-port';

export type InitialProfileOnboardingStoreOptions = {
  storage: KeyValueStoragePort;
  platformOs: string;
};

/**
 * Returns whether the initial profile onboarding gate applies on a platform.
 */
export function shouldUseInitialProfileGateForOs(platformOs: string): boolean {
  return shouldUseInitialProfileGateForPlatform(platformOs);
}

/**
 * Creates the initial-profile dismiss store for a platform + storage port.
 *
 * @param options - Storage/platform dependencies.
 */
export function createInitialProfileOnboardingStore(
  options: InitialProfileOnboardingStoreOptions,
) {
  const { storage, platformOs } = options;

  return {
    async getDismissed(): Promise<boolean> {
      if (!shouldUseInitialProfileGateForOs(platformOs)) {
        return false;
      }

      try {
        const raw = await storage.read(INITIAL_PROFILE_DISMISSED_STORAGE_KEY);
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
      if (!shouldUseInitialProfileGateForOs(platformOs)) {
        return;
      }

      try {
        await storage.write(INITIAL_PROFILE_DISMISSED_STORAGE_KEY, 'true');
      } catch (cause) {
        throw new AppError(
          'STORAGE_WRITE_FAILED',
          'No se pudo guardar el estado del perfil inicial.',
          cause,
        );
      }
    },

    async clearDismissed(): Promise<void> {
      if (!shouldUseInitialProfileGateForOs(platformOs)) {
        return;
      }

      try {
        await storage.remove(INITIAL_PROFILE_DISMISSED_STORAGE_KEY);
      } catch (cause) {
        throw new AppError(
          'STORAGE_WRITE_FAILED',
          'No se pudo borrar el estado del perfil inicial.',
          cause,
        );
      }
    },
  };
}

import type { EducationalProfile } from '@/core/domain/educational-profile';
import { createEducationalProfileStore } from '@/core/storage/educational-profile-store.factory';
import { createSecureKeyValueStoragePort } from '@/core/storage/secure-key-value-storage-port';

export {
  createEducationalProfileStore,
  parseEducationalProfile,
} from '@/core/storage/educational-profile-store.factory';

const defaultEducationalProfileStore = createEducationalProfileStore(
  createSecureKeyValueStoragePort(),
);

export function subscribeEducationalProfile(
  listener: Parameters<typeof defaultEducationalProfileStore.subscribe>[0],
): () => void {
  return defaultEducationalProfileStore.subscribe(listener);
}

export const educationalProfileStore = {
  getProfile: () => defaultEducationalProfileStore.getProfile(),
  saveProfile: (profile: EducationalProfile) =>
    defaultEducationalProfileStore.saveProfile(profile),
  clearProfile: () => defaultEducationalProfileStore.clearProfile(),
};

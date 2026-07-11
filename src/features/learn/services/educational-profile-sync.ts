import { apiPut } from '@/core/api/client';
import type { EducationalProfile } from '@/core/domain/educational-profile';
import { deviceIdentityStore } from '@/core/storage/device-identity-store';
import {
  type DerivedEducationalProfilePayload,
  toDerivedEducationalProfilePayload,
} from '@/features/learn/services/derived-educational-profile-payload';

export type { DerivedEducationalProfilePayload };
export { toDerivedEducationalProfilePayload };

/**
 * Best-effort sync of the derived educational profile to the anonymous device record.
 *
 * @param profile - Local educational profile to sync.
 */
export async function syncEducationalProfileToServer(profile: EducationalProfile): Promise<void> {
  try {
    await deviceIdentityStore.ensureDeviceRegistered();

    await apiPut<{ saved: true; deviceId: string }, DerivedEducationalProfilePayload>({
      path: '/anonymous-devices/me/educational-profile',
      body: toDerivedEducationalProfilePayload(profile),
    });
  } catch {
    // Profile sync must never block the learn flow.
  }
}

import { useEffect } from 'react';

import { deviceIdentityStore } from '@/core/storage/device-identity-store';

/**
 * Registers the current installation as an anonymous device on app startup.
 */
export function useDeviceIdentity(): void {
  useEffect(() => {
    void deviceIdentityStore.ensureDeviceRegistered().catch(() => {
      // Registration is best-effort and retried on later API calls.
    });
  }, []);
}

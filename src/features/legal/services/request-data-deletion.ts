import { apiDelete } from '@/core/api/client';
import { deviceIdentityStore } from '@/core/storage/device-identity-store';
import { clearLocalUserData } from '@/features/legal/services/clear-local-user-data';
import { createRequestDataDeletion } from '@/features/legal/services/request-data-deletion.factory';

const defaultRequestDataDeletion = createRequestDataDeletion({
  getDeviceToken: () => deviceIdentityStore.getDeviceToken(),
  apiDelete,
  clearLocalUserData,
});

/**
 * Deletes anonymous server data for this installation and clears local stores.
 */
export async function requestDataDeletion(): Promise<{
  serverDeleted: boolean;
  localCleared: true;
}> {
  return defaultRequestDataDeletion();
}

export { createRequestDataDeletion } from '@/features/legal/services/request-data-deletion.factory';

import type { HttpDeletePort } from '@/core/api/http-delete-port';
import { AppError } from '@/core/errors/app-error';

export type DeleteAnonymousDeviceResponse = {
  deleted: true;
  deviceId: string;
};

export type RequestDataDeletionDependencies = {
  getDeviceToken: () => Promise<string | null>;
  apiDelete: HttpDeletePort;
  clearLocalUserData: () => Promise<void>;
};

export type RequestDataDeletionResult = {
  serverDeleted: boolean;
  localCleared: true;
};

/**
 * Creates the self-service data deletion orchestrator.
 *
 * Order: server DELETE when a token exists, then local wipe. Network failures
 * with a present token do not clear local storage.
 *
 * @param deps - Token lookup, DELETE port, and local wipe.
 */
export function createRequestDataDeletion(deps: RequestDataDeletionDependencies) {
  return async function requestDataDeletion(): Promise<RequestDataDeletionResult> {
    const deviceToken = await deps.getDeviceToken();

    if (deviceToken === null || deviceToken.trim().length === 0) {
      await deps.clearLocalUserData();
      return { serverDeleted: false, localCleared: true };
    }

    try {
      await deps.apiDelete<DeleteAnonymousDeviceResponse>({
        path: '/anonymous-devices/me',
        withDeviceToken: true,
      });
    } catch (error) {
      if (error instanceof AppError && (error.status === 401 || error.status === 404)) {
        await deps.clearLocalUserData();
        return { serverDeleted: false, localCleared: true };
      }

      throw error;
    }

    await deps.clearLocalUserData();
    return { serverDeleted: true, localCleared: true };
  };
}

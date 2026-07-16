import type { KeyValueStoragePort } from '@/core/storage/key-value-storage-port';
import {
  deleteSecureValue,
  migrateLegacyAsyncStorageValue,
  readSecureValue,
  writeSecureValue,
} from '@/core/storage/secure-storage';

/**
 * Default adapter over the app secure-storage helpers.
 */
export function createSecureKeyValueStoragePort(): KeyValueStoragePort {
  return {
    read: readSecureValue,
    write: writeSecureValue,
    remove: deleteSecureValue,
    migrateLegacy: migrateLegacyAsyncStorageValue,
  };
}

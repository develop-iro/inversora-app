/**
 * Narrow persistence port used by local stores (favorites, profile, compare, …).
 *
 * Keeps domain/application stores free of Expo SecureStore / AsyncStorage details.
 */
export type KeyValueStoragePort = {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  migrateLegacy(key: string): Promise<void>;
};

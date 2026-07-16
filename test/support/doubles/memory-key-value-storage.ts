import type { KeyValueStoragePort } from '@/core/storage/key-value-storage-port';

export type MemoryKeyValueStorage = KeyValueStoragePort & {
  /** Returns a snapshot of persisted entries (test helper). */
  dump(): Record<string, string>;
  /** Clears all entries (test helper). */
  clear(): void;
};

/**
 * In-memory key/value storage double for store contract tests.
 */
export function createMemoryKeyValueStorage(
  initial: Record<string, string> = {},
): MemoryKeyValueStorage {
  const entries = new Map<string, string>(Object.entries(initial));

  return {
    async read(key) {
      return entries.get(key) ?? null;
    },
    async write(key, value) {
      entries.set(key, value);
    },
    async remove(key) {
      entries.delete(key);
    },
    async migrateLegacy() {
      // No-op: memory doubles have no legacy AsyncStorage backend.
    },
    dump() {
      return Object.fromEntries(entries.entries());
    },
    clear() {
      entries.clear();
    },
  };
}

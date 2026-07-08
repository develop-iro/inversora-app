import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const MIGRATION_SUFFIX = ':migrated-to-secure-store';

/**
 * Returns whether sensitive values should use the OS secure store.
 */
export function shouldUseSecureStore(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

/**
 * Reads a persisted value from secure storage when available.
 *
 * @param key - Storage key.
 */
export async function readSecureValue(key: string): Promise<string | null> {
  if (shouldUseSecureStore()) {
    return SecureStore.getItemAsync(key);
  }

  return AsyncStorage.getItem(key);
}

/**
 * Persists a value using secure storage when available.
 *
 * @param key - Storage key.
 * @param value - Serialized value.
 */
export async function writeSecureValue(key: string, value: string): Promise<void> {
  if (shouldUseSecureStore()) {
    await SecureStore.setItemAsync(key, value);
    return;
  }

  await AsyncStorage.setItem(key, value);
}

/**
 * Deletes a persisted value from secure storage when available.
 *
 * @param key - Storage key.
 */
export async function deleteSecureValue(key: string): Promise<void> {
  if (shouldUseSecureStore()) {
    await SecureStore.deleteItemAsync(key);
    return;
  }

  await AsyncStorage.removeItem(key);
}

/**
 * Migrates a legacy AsyncStorage entry into secure storage once.
 *
 * @param key - Storage key shared by both backends.
 */
export async function migrateLegacyAsyncStorageValue(key: string): Promise<void> {
  if (!shouldUseSecureStore()) {
    return;
  }

  const migrationKey = `${key}${MIGRATION_SUFFIX}`;
  const alreadyMigrated = await AsyncStorage.getItem(migrationKey);

  if (alreadyMigrated === 'true') {
    return;
  }

  const legacyValue = await AsyncStorage.getItem(key);

  if (legacyValue === null) {
    await AsyncStorage.setItem(migrationKey, 'true');
    return;
  }

  await SecureStore.setItemAsync(key, legacyValue);
  await AsyncStorage.removeItem(key);
  await AsyncStorage.setItem(migrationKey, 'true');
}

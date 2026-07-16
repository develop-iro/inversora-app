import { AppError } from '@/core/errors/app-error';
import { FAVORITES_STORAGE_KEY } from '@/core/storage/favorites-storage-key';
import type { KeyValueStoragePort } from '@/core/storage/key-value-storage-port';

import type { FavoriteIsin } from './types';

type FavoritesListener = () => void;

/**
 * Creates a favorites store bound to a key/value persistence port.
 *
 * @param storage - Persistence adapter (secure storage in production, memory in tests).
 */
export function createFavoritesStore(storage: KeyValueStoragePort) {
  const listeners = new Set<FavoritesListener>();

  function notifyListeners() {
    listeners.forEach((listener) => listener());
  }

  async function readFavoriteSet(): Promise<Set<FavoriteIsin>> {
    await storage.migrateLegacy(FAVORITES_STORAGE_KEY);
    const raw = await storage.read(FAVORITES_STORAGE_KEY);

    if (!raw) {
      return new Set();
    }

    try {
      const parsed = JSON.parse(raw) as unknown;

      if (!Array.isArray(parsed)) {
        return new Set();
      }

      return new Set(parsed.filter((item): item is string => typeof item === 'string'));
    } catch {
      return new Set();
    }
  }

  async function writeFavoriteSet(favorites: Set<FavoriteIsin>): Promise<void> {
    await storage.write(FAVORITES_STORAGE_KEY, JSON.stringify([...favorites]));
  }

  return {
    subscribe(listener: FavoritesListener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async listFavoriteIsins(): Promise<FavoriteIsin[]> {
      try {
        const favorites = await readFavoriteSet();
        return [...favorites];
      } catch (cause) {
        throw new AppError('STORAGE_READ_FAILED', 'No se pudieron leer los favoritos.', cause);
      }
    },
    async isFavorite(isin: string): Promise<boolean> {
      const favorites = await readFavoriteSet();
      return favorites.has(isin);
    },
    async toggleFavorite(isin: string): Promise<void> {
      try {
        const favorites = await readFavoriteSet();

        if (favorites.has(isin)) {
          favorites.delete(isin);
        } else {
          favorites.add(isin);
        }

        await writeFavoriteSet(favorites);
        notifyListeners();
      } catch (cause) {
        throw new AppError('STORAGE_WRITE_FAILED', 'No se pudo actualizar el favorito.', cause);
      }
    },
  };
}

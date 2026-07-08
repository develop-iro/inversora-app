import { AppError } from '@/core/errors/app-error';
import { FAVORITES_STORAGE_KEY } from '@/core/storage/favorites-storage-key';
import {
  migrateLegacyAsyncStorageValue,
  readSecureValue,
  writeSecureValue,
} from '@/core/storage/secure-storage';

import type { FavoriteIsin } from './types';

type FavoritesListener = () => void;

const listeners = new Set<FavoritesListener>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

async function readFavoriteSet(): Promise<Set<FavoriteIsin>> {
  await migrateLegacyAsyncStorageValue(FAVORITES_STORAGE_KEY);
  const raw = await readSecureValue(FAVORITES_STORAGE_KEY);

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
  await writeSecureValue(FAVORITES_STORAGE_KEY, JSON.stringify([...favorites]));
}

export function subscribeFavorites(listener: FavoritesListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const favoritesStore = {
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

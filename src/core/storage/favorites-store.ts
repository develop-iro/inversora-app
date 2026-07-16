import { createFavoritesStore } from '@/core/storage/favorites-store.factory';
import { createSecureKeyValueStoragePort } from '@/core/storage/secure-key-value-storage-port';

export { createFavoritesStore } from '@/core/storage/favorites-store.factory';

const defaultFavoritesStore = createFavoritesStore(createSecureKeyValueStoragePort());

export function subscribeFavorites(
  listener: Parameters<typeof defaultFavoritesStore.subscribe>[0],
): () => void {
  return defaultFavoritesStore.subscribe(listener);
}

export const favoritesStore = {
  listFavoriteIsins: () => defaultFavoritesStore.listFavoriteIsins(),
  isFavorite: (isin: string) => defaultFavoritesStore.isFavorite(isin),
  toggleFavorite: (isin: string) => defaultFavoritesStore.toggleFavorite(isin),
};

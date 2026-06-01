import { useCallback, useEffect, useState } from 'react';

import { favoritesStore, subscribeFavorites } from '@/core/storage/favorites-store';

export function useFavorite(isin: string) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      favoritesStore.isFavorite(isin).then((value) => {
        if (!cancelled) {
          setIsFavorite(value);
          setIsLoading(false);
        }
      });
    };

    load();
    return subscribeFavorites(load);
  }, [isin]);

  const toggle = useCallback(async () => {
    await favoritesStore.toggleFavorite(isin);
    const next = await favoritesStore.isFavorite(isin);
    setIsFavorite(next);
  }, [isin]);

  return { isFavorite, isLoading, toggle };
}

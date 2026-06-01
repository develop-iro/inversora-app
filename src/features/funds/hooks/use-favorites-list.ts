import { useCallback, useEffect, useState } from 'react';

import { favoritesStore, subscribeFavorites } from '@/core/storage/favorites-store';

export function useFavoritesList() {
  const [isins, setIsins] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await favoritesStore.listFavoriteIsins();
    setIsins(next);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const next = await favoritesStore.listFavoriteIsins();
      if (!cancelled) {
        setIsins(next);
        setIsLoading(false);
      }
    };

    void load();

    return subscribeFavorites(() => {
      void load();
    });
  }, []);

  return { isins, isLoading, refresh };
}

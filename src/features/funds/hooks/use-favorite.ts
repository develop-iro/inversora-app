import { useCallback, useEffect, useState } from 'react';

import { trackEvent } from '@/core/analytics/track-event';
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
    void trackEvent('favorite_toggled', 'fund_detail', { isin, isFavorite: next });
  }, [isin]);

  return { isFavorite, isLoading, toggle };
}

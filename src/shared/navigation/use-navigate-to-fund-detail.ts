import { useNavigation, useRouter } from 'expo-router';
import { useCallback } from 'react';

import {
  navigateToFundDetail,
  type NavigateToFundDetailOptions,
} from '@/shared/navigation/fund-detail-navigation';

/**
 * Hook for opening fund detail without stacking multiple detail routes
 * when the user launches them from Inicio, Favoritos or Rankings.
 */
export function useNavigateToFundDetail() {
  const navigation = useNavigation();
  const router = useRouter();

  return useCallback(
    (isin: string, options?: NavigateToFundDetailOptions) => {
      navigateToFundDetail(navigation, router, isin, options);
    },
    [navigation, router],
  );
}

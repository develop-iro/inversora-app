import { useNavigation, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { compareSelectionStore } from '@/core/storage/compare-selection-store';
import { routes } from '@/shared/navigation/routes';
import { getTabNavigation } from '@/shared/navigation/tab-navigation';

/**
 * Hook for switching to sibling tab routes from nested stacks without breaking the tab shell.
 */
export function useNavigateToTabRoute() {
  const navigation = useNavigation();
  const router = useRouter();

  const navigateToCompare = useCallback(async (isins: readonly string[]) => {
    const normalized = [...new Set(isins.map((isin) => isin.trim().toUpperCase()))];

    if (normalized.length === 0) {
      return;
    }

    await compareSelectionStore.setSelectedIsins(normalized);

    const tabNavigation = getTabNavigation(navigation);

    if (tabNavigation) {
      tabNavigation.navigate('compare');
      return;
    }

    router.push(routes.compare);
  }, [navigation, router]);

  const navigateToCalculator = useCallback((isin: string) => {
    const normalized = isin.trim().toUpperCase();

    if (normalized.length === 0) {
      return;
    }

    const tabNavigation = getTabNavigation(navigation);

    if (tabNavigation) {
      tabNavigation.navigate('calculator', { isin: normalized });
      return;
    }

    router.push(routes.calculatorWithFund(normalized));
  }, [navigation, router]);

  return {
    navigateToCompare,
    navigateToCalculator,
  };
}

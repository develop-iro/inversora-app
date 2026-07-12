import { router, useNavigation } from 'expo-router';
import { useCallback } from 'react';

import { compareSelectionStore } from '@/core/storage/compare-selection-store';
import { routes } from '@/shared/navigation/routes';

type TabNavigation = {
  getState?: () => { routeNames?: readonly string[] };
  getParent?: () => TabNavigation | undefined;
  navigate: (name: string, params?: Record<string, string>) => void;
};

/**
 * Finds the primary tab navigator from a nested stack screen.
 */
function getTabNavigation(navigation: ReturnType<typeof useNavigation>): TabNavigation | undefined {
  let navigator = navigation as unknown as TabNavigation | undefined;

  while (navigator) {
    const routeNames = navigator.getState?.().routeNames;

    if (Array.isArray(routeNames) && routeNames.includes('compare')) {
      return navigator;
    }

    navigator = navigator.getParent?.();
  }

  return undefined;
}

/**
 * Hook for switching to sibling tab routes from nested stacks without breaking the tab shell.
 */
export function useNavigateToTabRoute() {
  const navigation = useNavigation();

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
  }, [navigation]);

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
  }, [navigation]);

  return {
    navigateToCompare,
    navigateToCalculator,
  };
}

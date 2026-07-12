import type { useNavigation } from 'expo-router';

type NavigationState = {
  routeNames?: readonly string[];
};

export type TabNavigation = {
  getState?: () => NavigationState;
  getParent?: () => TabNavigation | undefined;
  navigate: (name: string, params?: unknown) => void;
  reset?: (state: {
    index: number;
    routes: { name: string; params?: Record<string, unknown> }[];
  }) => void;
};

/**
 * Finds the primary tab navigator from a nested stack screen.
 */
export function getTabNavigation(
  navigation: ReturnType<typeof useNavigation>,
): TabNavigation | undefined {
  let navigator = navigation as unknown as TabNavigation | undefined;

  while (navigator) {
    const routeNames = navigator.getState?.().routeNames;

    if (
      Array.isArray(routeNames) &&
      routeNames.includes('funds') &&
      routeNames.includes('compare')
    ) {
      return navigator;
    }

    navigator = navigator.getParent?.();
  }

  return undefined;
}

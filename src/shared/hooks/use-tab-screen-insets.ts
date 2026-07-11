import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getTabBarClearance,
  resolveNavTabSafeBottomInset,
} from '@/shared/components/navigation/nav-tab-bar';

export type TabScreenInsets = {
  /** Safe bottom inset aligned with `NavTabBar` positioning. */
  readonly safeBottomInset: number;
  /** Space the floating tab bar occupies above the bottom edge. */
  readonly tabBarClearance: number;
  /** Recommended `ScrollView` content bottom padding for tab screens. */
  readonly contentBottomPadding: number;
};

/**
 * Shared inset math for tab screens so scroll content clears the floating nav bar.
 */
export function useTabScreenInsets(extraBottomPadding = 0): TabScreenInsets {
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const safeBottomInset = resolveNavTabSafeBottomInset(insets.bottom);
    const tabBarClearance = getTabBarClearance(safeBottomInset);

    return {
      safeBottomInset,
      tabBarClearance,
      contentBottomPadding: tabBarClearance + extraBottomPadding,
    };
  }, [extraBottomPadding, insets.bottom]);
}

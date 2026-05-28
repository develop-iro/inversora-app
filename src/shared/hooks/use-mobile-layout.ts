import { useWindowDimensions } from 'react-native';

import { Layout, Spacing } from '@/shared/theme/theme';

const MOBILE_MAX_WIDTH = 480;

export function useMobileLayout() {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < MOBILE_MAX_WIDTH;
  const contentWidth = Math.min(windowWidth, Layout.maxContentWidth);
  const horizontalPadding = Layout.screenPaddingHorizontal;
  const gridGap = Spacing.lg;
  const featuredCardWidth =
    (contentWidth - horizontalPadding * 2 - gridGap) / 2;

  return {
    windowWidth,
    contentWidth,
    isMobile,
    horizontalPadding,
    featuredCardWidth,
  };
}

import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { BREAKPOINTS, isWeb } from '@/shared/platform/capabilities';

export function usePlatformCapabilities() {
  const { width: windowWidth } = useWindowDimensions();

  return useMemo(() => {
    const isCompactViewport = windowWidth < BREAKPOINTS.desktopHints;
    const isMobileLayout = windowWidth < BREAKPOINTS.compact;
    const supportsPointerHover = isWeb;
    const supportsInfoHintPopover = isWeb && windowWidth >= BREAKPOINTS.desktopHints;

    return {
      windowWidth,
      isCompactViewport,
      isMobileLayout,
      supportsPointerHover,
      supportsInfoHintPopover,
    };
  }, [windowWidth]);
}

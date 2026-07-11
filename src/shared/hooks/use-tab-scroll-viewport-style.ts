import { Platform, useWindowDimensions, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Approximate app header chrome below the safe-area inset on web tab scenes. */
const WEB_TAB_HEADER_ESTIMATE = 70;

/**
 * Returns an explicit ScrollView height on web so tab content scrolls inside the viewport.
 * React Navigation tab scenes can grow with content (`flex: 0 0 auto`), which breaks web scroll.
 *
 * The floating `NavTabBar` overlays the scene — do not subtract its height here or a dead gap appears.
 * Scroll content clearance is handled via {@link useTabScreenInsets} padding instead.
 */
export function useTabScrollViewportStyle(): ViewStyle | undefined {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const viewportHeight = Math.max(
    320,
    windowHeight - insets.top - WEB_TAB_HEADER_ESTIMATE,
  );

  if (Platform.OS !== 'web') {
    return undefined;
  }

  return {
    height: viewportHeight,
    maxHeight: viewportHeight,
    overflow: 'hidden',
  };
}

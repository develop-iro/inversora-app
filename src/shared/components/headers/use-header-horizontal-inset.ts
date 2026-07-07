import { Layout } from '@/shared/theme/theme';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';

/**
 * Horizontal inset that aligns header content with the centered page column on wide screens.
 */
export function useHeaderHorizontalInset(): number {
  const { contentWidth, windowWidth } = useMobileLayout();

  return Math.max(
    Layout.screenPaddingHorizontal,
    (windowWidth - contentWidth) / 2 + Layout.screenPaddingHorizontal,
  );
}

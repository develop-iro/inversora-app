import { forwardRef, type ReactElement, type Ref } from 'react';
import {
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { TabScrollViewport } from '@/shared/components/layout/tab-scroll-viewport';
import { useTabScreenInsets } from '@/shared/hooks/use-tab-screen-insets';
import { cn } from '@/shared/utils/cn';

export type TabScreenScrollProps = ScrollViewProps & {
  /** Additional padding below {@link useTabScreenInsets} clearance. */
  extraBottomPadding?: number;
  contentContainerClassName?: string;
  viewportClassName?: string;
  viewportStyle?: StyleProp<ViewStyle>;
};

/**
 * Canonical scroll body for tab routes: bounded viewport on web plus nav-bar-safe bottom padding.
 * App header comes from the tabs layout; the floating `NavTabBar` sits outside this tree.
 */
export const TabScreenScroll = forwardRef(function TabScreenScroll(
  {
    children,
    className,
    style,
    contentContainerClassName,
    contentContainerStyle,
    extraBottomPadding = 0,
    viewportClassName,
    viewportStyle,
    ...scrollProps
  }: TabScreenScrollProps,
  ref: Ref<ScrollView>,
) {
  const { contentBottomPadding } = useTabScreenInsets(extraBottomPadding);

  return (
    <TabScrollViewport className={viewportClassName} style={viewportStyle}>
      <ScrollView
        ref={ref}
        className={cn('min-h-0 flex-1', className)}
        style={style}
        contentContainerClassName={contentContainerClassName}
        contentContainerStyle={[
          { paddingBottom: contentBottomPadding },
          contentContainerStyle,
        ]}
        {...scrollProps}
      >
        {children}
      </ScrollView>
    </TabScrollViewport>
  );
}) as (props: TabScreenScrollProps & { ref?: Ref<ScrollView> }) => ReactElement;

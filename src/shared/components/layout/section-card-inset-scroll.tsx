import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { SECTION_CARD_CONTENT_INSET } from '@/shared/components/layout/section-card';
import { Spacing } from '@/shared/theme/theme';

export type SectionCardInsetScrollProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Horizontal scroll that aligns its first item with section card inset text.
 */
export function SectionCardInsetScroll({
  children,
  style,
  contentContainerStyle,
}: SectionCardInsetScrollProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.bleed, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bleed: {
    marginHorizontal: -SECTION_CARD_CONTENT_INSET,
  },
  content: {
    gap: Spacing.sm,
    paddingHorizontal: SECTION_CARD_CONTENT_INSET,
    paddingVertical: Spacing.xs,
  },
});

import { Children, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/shared/theme/theme';

export type ScreenQuickActionsRowProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Evenly spaced row for {@link ScreenQuickAction} items with consistent wrapping.
 */
export function ScreenQuickActionsRow({ children, style }: ScreenQuickActionsRowProps) {
  return (
    <View style={[styles.row, style]}>
      {Children.map(children, (child, index) =>
        child !== null && child !== undefined ? (
          <View key={index} style={styles.item}>
            {child}
          </View>
        ) : null,
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  item: {
    flexGrow: 1,
    flexBasis: '42%',
    maxWidth: '48%',
    minWidth: 96,
    alignItems: 'center',
  },
});

import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { Spacing } from '@/shared/theme/theme';

export type DividerProps = ViewProps & {
  /** Vertical space above and below the line. */
  spacing?: number;
  /** Indent from the start edge (e.g. for list rows with icons). */
  insetStart?: number;
  /** Indent from the end edge. */
  insetEnd?: number;
};

export function Divider({
  spacing = Spacing.lg,
  insetStart = 0,
  insetEnd = 0,
  style,
  ...viewProps
}: DividerProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        { marginVertical: spacing, marginStart: insetStart, marginEnd: insetEnd },
        style,
      ]}
      accessibilityRole="none"
      {...viewProps}>
      <View style={[styles.line, { backgroundColor: theme.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
  },
  line: {
    height: StyleSheet.hairlineWidth,
    minHeight: 1,
    width: '100%',
  },
});

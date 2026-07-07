import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { TextLabel } from '@/shared/components/text';
import { SpinnerBarChart } from '@/shared/components/ui/spinner-bar-chart';
import { SpinnerLayout } from '@/shared/components/ui/spinner-layout';
import type { SpinnerSize } from '@/shared/components/ui/spinner.constants';
import { Spacing } from '@/shared/theme/theme';

export type { SpinnerSize };

export type SpinnerProps = {
  readonly size?: SpinnerSize;
  readonly label?: string;
  /** Expands the layout to fill the parent and center the spinner. */
  readonly fullscreen?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly accessibilityLabel?: string;
};

/**
 * Branded loading indicator with a looping upward bar chart.
 */
function SpinnerRoot({
  size = 'md',
  label,
  fullscreen = false,
  style,
  accessibilityLabel = 'Cargando',
}: SpinnerProps) {
  return (
    <SpinnerLayout
      fullscreen={fullscreen}
      style={style}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.content}>
        <SpinnerBarChart size={size} />
        {label ? (
          <TextLabel variant="meta" themeColor="textSecondary" style={styles.label}>
            {label}
          </TextLabel>
        ) : null}
      </View>
    </SpinnerLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  label: {
    textAlign: 'center',
  },
});

export const Spinner = Object.assign(SpinnerRoot, {
  Layout: SpinnerLayout,
  BarChart: SpinnerBarChart,
});

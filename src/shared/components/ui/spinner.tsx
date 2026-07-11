import { View, type StyleProp, type ViewStyle } from 'react-native';

import { TextLabel } from '@/shared/components/text';
import { SpinnerBarChart } from '@/shared/components/ui/spinner-bar-chart';
import { SpinnerLayout } from '@/shared/components/ui/spinner-layout';
import type { SpinnerSize } from '@/shared/components/ui/spinner.constants';

export type { SpinnerSize };

export type SpinnerProps = {
  readonly size?: SpinnerSize;
  readonly label?: string;
  /** Expands the layout to fill the parent and center the spinner. */
  readonly fullscreen?: boolean;
  readonly className?: string;
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
  className,
  style,
  accessibilityLabel = 'Cargando',
}: SpinnerProps) {
  return (
    <SpinnerLayout
      fullscreen={fullscreen}
      className={className}
      style={style}
      accessibilityLabel={accessibilityLabel}
    >
      <View className="items-center justify-center gap-md">
        <SpinnerBarChart size={size} />
        {label ? (
          <TextLabel variant="meta" themeColor="textSecondary" className="text-center">
            {label}
          </TextLabel>
        ) : null}
      </View>
    </SpinnerLayout>
  );
}

export const Spinner = Object.assign(SpinnerRoot, {
  Layout: SpinnerLayout,
  BarChart: SpinnerBarChart,
});

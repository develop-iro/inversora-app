import { Pressable, StyleSheet, View } from 'react-native';

import type { FundPerformanceTimeframe } from '@/core/domain/fund-market';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

const OPTIONS: { value: FundPerformanceTimeframe; label: string }[] = [
  { value: '1d', label: '1D' },
  { value: '1w', label: '1S' },
  { value: '1m', label: '1M' },
];

export type TimeframeSegmentedControlProps = {
  value: FundPerformanceTimeframe;
  onChange: (value: FundPerformanceTimeframe) => void;
};

export function TimeframeSegmentedControl({
  value,
  onChange,
}: TimeframeSegmentedControlProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Periodo del gráfico de evolución"
      style={[styles.track, { backgroundColor: theme.surfaceMuted }]}
    >
      {OPTIONS.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`Periodo ${option.label}`}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              selected && [
                styles.segmentSelected,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ],
            ]}
          >
            <ThemedText
              type="metaLabel"
              style={[
                styles.segmentLabel,
                { color: selected ? theme.deepOcean : theme.textSecondary },
              ]}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: Radius.pill,
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: Spacing.sm,
  },
  segmentSelected: {
    shadowColor: '#0B2E36',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentLabel: {
    letterSpacing: 0.6,
  },
});

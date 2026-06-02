import { Pressable, ScrollView, StyleSheet } from 'react-native';

import type { FundPerformanceTimeframe } from '@/core/domain/fund-market';
import { PERFORMANCE_TIMEFRAME_OPTIONS } from '@/features/funds/utils/fund-performance';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      accessibilityLabel="Periodo del gráfico de evolución"
      contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.surfaceMuted }]}
    >
      {PERFORMANCE_TIMEFRAME_OPTIONS.map((option) => {
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexDirection: 'row',
    borderRadius: Radius.pill,
    padding: 3,
    gap: 2,
  },
  segment: {
    minHeight: 36,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: Spacing.md,
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

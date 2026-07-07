import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { TextLabel, TextParagraph } from '@/shared/components/text';
import { METRIC_PILL_MIN_HEIGHT } from '@/shared/components/ui/score-pill';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing, Typography } from '@/shared/theme/theme';
import {
  formatReturnPercent,
  resolveReturnColorToken,
} from '@/shared/utils/format-return-percent';

export type FundReturnChipProps = {
  label: string;
  value: number | null;
  variant?: 'plain' | 'surface';
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

export function FundReturnChip({
  label,
  value,
  variant = 'plain',
  accessibilityHint = FUND_GLOSSARY.pastPerformance.explanation,
  style,
}: FundReturnChipProps) {
  const theme = useTheme();
  const displayValue = value === null ? '—' : formatReturnPercent(value);
  const colorToken = value === null ? 'textSecondary' : resolveReturnColorToken(value);
  const isSurface = variant === 'surface';

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${displayValue}. ${accessibilityHint}`}
      style={[
        styles.chip,
        isSurface && [
          styles.chipSurface,
          {
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.border,
          },
        ],
        style,
      ]}
    >
      <TextLabel variant="meta" themeColor="textSecondary" style={isSurface && styles.surfaceLabel}>
        {label}
      </TextLabel>
      {isSurface ? (
        <TextLabel
          variant="chip"
          themeColor={colorToken}
          style={[styles.value, styles.surfaceValue]}
        >
          {displayValue}
        </TextLabel>
      ) : (
        <TextParagraph
          variant="secondary"
          themeColor={colorToken}
          style={styles.value}
        >
          {displayValue}
        </TextParagraph>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    gap: Spacing.half,
    minWidth: 52,
    alignItems: 'flex-end',
  },
  chipSurface: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: '100%',
    minHeight: METRIC_PILL_MIN_HEIGHT,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  surfaceLabel: {
    letterSpacing: 0.88,
  },
  value: {
    fontVariant: ['tabular-nums'],
  },
  surfaceValue: {
    ...Typography.scoreHero,
  },
});

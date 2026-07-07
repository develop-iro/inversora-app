import { StyleSheet, View } from 'react-native';

import type { ScoreBreakdown } from '@/core/scoring/types';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type FundScoreBreakdownProps = {
  breakdown: ScoreBreakdown;
};

export function FundScoreBreakdown({ breakdown }: FundScoreBreakdownProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      {breakdown.map((criterion) => (
        <View key={criterion.id} style={styles.row}>
          <View style={styles.labelBlock}>
            <TextParagraph variant="secondary" themeColor="textSecondary">
              {criterion.label}
            </TextParagraph>
            <View
              style={[styles.track, { backgroundColor: theme.surfaceMuted }]}
              accessibilityRole="progressbar"
              accessibilityValue={{
                min: 0,
                max: criterion.maxPoints,
                now: criterion.points,
              }}
            >
              <View
                style={[
                  styles.fill,
                  {
                    backgroundColor: theme.primary,
                    width: `${Math.max(8, (criterion.points / Math.max(criterion.maxPoints, 1)) * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
          <TextLabel variant="meta" themeColor="deepOcean">
            {criterion.points}/{criterion.maxPoints}
          </TextLabel>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  labelBlock: {
    flex: 1,
    gap: Spacing.xs,
  },
  track: {
    height: 6,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});

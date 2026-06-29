import type { FundDetail } from '@/core/domain/catalog';
import type { ScoreCriterionResult } from '@/core/scoring/types';
import { CompareCollapsibleSection } from '@/features/comparison/components/compare-collapsible-section';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';
import { StyleSheet, View } from 'react-native';

export type CompareScoreBreakdownSectionProps = {
  details: readonly FundDetail[];
};

function CompareCriterionBars({
  criterion,
  details,
}: {
  criterion: ScoreCriterionResult;
  details: readonly FundDetail[];
}) {
  const theme = useTheme();

  return (
    <View style={styles.criterionBlock}>
      <ThemedText type="caption" themeColor="textSecondary">
        {criterion.label}
      </ThemedText>

      {details.map((detail) => {
        const entry = detail.scoredBreakdown.find((item) => item.id === criterion.id);

        if (entry === undefined) {
          return null;
        }

        const shortLabel =
          detail.fund.symbol.length > 0
            ? detail.fund.symbol
            : detail.fund.isin.slice(-4);
        const fillPercent = Math.max(
          8,
          (entry.points / Math.max(entry.maxPoints, 1)) * 100,
        );

        return (
          <View key={`${detail.fund.isin}-${criterion.id}`} style={styles.fundBarRow}>
            <View style={styles.fundBarHeader}>
              <ThemedText type="metaLabel" themeColor="textSecondary" numberOfLines={1}>
                {shortLabel}
              </ThemedText>
              <ThemedText type="metaLabel" themeColor="deepOcean">
                {entry.points}/{entry.maxPoints}
              </ThemedText>
            </View>
            <View
              style={[styles.track, { backgroundColor: theme.surfaceMuted }]}
              accessibilityRole="progressbar"
              accessibilityValue={{
                min: 0,
                max: entry.maxPoints,
                now: entry.points,
              }}
            >
              <View
                style={[
                  styles.fill,
                  {
                    backgroundColor: theme.primary,
                    width: `${fillPercent}%`,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

/**
 * Side-by-side score criterion bars stacked vertically for narrow screens.
 */
export function CompareScoreBreakdownSection({ details }: CompareScoreBreakdownSectionProps) {
  if (details.length < 2) {
    return null;
  }

  const criteria = details[0]?.scoredBreakdown ?? [];

  return (
    <CompareCollapsibleSection
      title="Desglose del Score Inversora"
      subtitle="Criterios del modelo educativo RN-04."
      defaultExpanded={false}
    >
      <View style={styles.criteriaList}>
        {criteria.map((criterion) => (
          <CompareCriterionBars
            key={criterion.id}
            criterion={criterion}
            details={details}
          />
        ))}
      </View>
    </CompareCollapsibleSection>
  );
}

const styles = StyleSheet.create({
  criteriaList: {
    gap: Spacing.lg,
  },
  criterionBlock: {
    gap: Spacing.sm,
  },
  fundBarRow: {
    gap: Spacing.xs,
  },
  fundBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
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

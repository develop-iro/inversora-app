import type { FundDetail } from '@/core/domain/catalog';
import type { ScoreCriterionResult } from '@/core/scoring/types';
import { CompareCollapsibleSection } from '@/features/comparison/components/compare-collapsible-section';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { View } from 'react-native';

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
  return (
    <View className="gap-sm">
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {criterion.label}
      </TextParagraph>

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
          <View key={`${detail.fund.isin}-${criterion.id}`} className="gap-xs">
            <View className="flex-row items-center justify-between gap-sm">
              <TextLabel variant="meta" themeColor="textSecondary" numberOfLines={1}>
                {shortLabel}
              </TextLabel>
              <TextLabel variant="meta" themeColor="deepOcean">
                {entry.points}/{entry.maxPoints}
              </TextLabel>
            </View>
            <View
              className="h-[6px] overflow-hidden rounded-full bg-surface-muted"
              accessibilityRole="progressbar"
              accessibilityValue={{
                min: 0,
                max: entry.maxPoints,
                now: entry.points,
              }}
            >
              <View
                className="h-full rounded-full bg-primary"
                // tailwind-exception: progress fill width is computed at runtime
                style={{ width: `${fillPercent}%` }}
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
      <View className="gap-lg">
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

import { StyleSheet, View } from 'react-native';

import type { FeaturedFund } from '@/core/domain/fund';
import type { ScoreBreakdown } from '@/core/scoring/types';
import { SCORING_CRITERIA_VERSION } from '@/core/scoring/criteria';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import { FundScoreBreakdown } from '@/features/funds/components/fund-score-breakdown';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { ThemedText } from '@/shared/components/themed-text';
import { Badge, InfoHintTrigger, ScorePill } from '@/shared/components/ui';
import {
  getEfficiencyBadgeVariant,
  getEfficiencyLabel,
} from '@/shared/utils/fund-efficiency';
import { Spacing } from '@/shared/theme/theme';

export type FundDetailScoreSectionProps = {
  score: number;
  breakdown: ScoreBreakdown;
  fund: FeaturedFund;
};

export function FundDetailScoreSection({
  score,
  breakdown,
  fund,
}: FundDetailScoreSectionProps) {
  const efficiencyLabel = getEfficiencyLabel(score);

  return (
    <FundDetailSectionShell
      title={FUND_GLOSSARY.inversoraScore.term}
      subtitle="Resumen orientativo según comisiones, seguimiento del índice, tamaño y antigüedad."
      hintTerm={FUND_GLOSSARY.inversoraScore.term}
      hintExplanation={FUND_GLOSSARY.inversoraScore.explanation}
    >
      <View style={styles.scoreHero}>
        <ScorePill score={score} variant="compact" />
        <View style={styles.efficiencyBlock}>
          <View style={styles.efficiencyLabelRow}>
            <ThemedText type="metaLabel" themeColor="textSecondary">
              {FUND_GLOSSARY.efficiencyLabel.term}
            </ThemedText>
            <InfoHintTrigger
              surface="detail"
              term={FUND_GLOSSARY.efficiencyLabel.term}
              explanation={FUND_GLOSSARY.efficiencyLabel.explanation}
            />
          </View>
          <Badge label={efficiencyLabel} variant={getEfficiencyBadgeVariant(score)} />
        </View>
      </View>

      <View style={styles.summaryBlock}>
        <ThemedText type="bodyBold">{fund.featuredReason}</ThemedText>
        <ThemedText type="body" themeColor="textSecondary">
          {fund.benefitSummary}
        </ThemedText>
      </View>

      <ThemedText type="bodyBold" accessibilityRole="header">
        Desglose por criterios
      </ThemedText>
      <FundScoreBreakdown breakdown={breakdown} />

      <View style={styles.metaBlock}>
        <ThemedText type="caption" themeColor="textSecondary">
          Datos de scoring {fund.quarterTag} ({fund.periodStart} – {fund.periodEnd})
        </ThemedText>
        <ThemedText type="metaLabel" themeColor="textSecondary">
          Modelo: {SCORING_CRITERIA_VERSION}
        </ThemedText>
      </View>
    </FundDetailSectionShell>
  );
}

const styles = StyleSheet.create({
  scoreHero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  efficiencyBlock: {
    flex: 1,
    minWidth: 140,
    gap: Spacing.xs,
  },
  efficiencyLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  summaryBlock: {
    gap: Spacing.xs,
  },
  metaBlock: {
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
});

import { View } from 'react-native';

import { FundDetailScoreExplain } from '@/features/funds/components/detail/fund-detail-score-explain';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import { FundScoreBreakdown } from '@/features/funds/components/fund-score-breakdown';
import type { FeaturedFund } from '@/core/domain/fund';
import type { ScoreBreakdown } from '@/core/scoring/types';
import { SCORING_CRITERIA_VERSION } from '@/core/scoring/criteria';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { CollapsibleSection } from '@/shared/components/layout';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { Badge, InfoHintTrigger, ScorePill } from '@/shared/components/ui';
import {
  getEfficiencyBadgeVariant,
  getEfficiencyLabel,
} from '@/shared/utils/fund-efficiency';

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
  const hasSummaryCopy =
    fund.featuredReason.trim().length > 0 || fund.benefitSummary.trim().length > 0;

  return (
    <FundDetailSectionShell
      title={FUND_GLOSSARY.inversoraScore.term}
      subtitle="Resumen orientativo según comisiones, seguimiento del índice, tamaño y antigüedad."
      hintTerm={FUND_GLOSSARY.inversoraScore.term}
      hintExplanation={FUND_GLOSSARY.inversoraScore.explanation}
    >
      <View className="flex-row flex-wrap items-end gap-md">
        <ScorePill score={score} variant="compact" />
        <View className="min-w-[140px] flex-1 gap-xs">
          <View className="flex-row items-center gap-xs">
            <TextLabel variant="meta" themeColor="textSecondary">
              {FUND_GLOSSARY.efficiencyLabel.term}
            </TextLabel>
            <InfoHintTrigger
              surface="detail"
              term={FUND_GLOSSARY.efficiencyLabel.term}
              explanation={FUND_GLOSSARY.efficiencyLabel.explanation}
            />
          </View>
          <Badge label={efficiencyLabel} variant={getEfficiencyBadgeVariant(score)} />
        </View>
      </View>

      {hasSummaryCopy ? (
        <View className="gap-xs">
          {fund.featuredReason.trim().length > 0 ? (
            <TextParagraph variant="emphasis">{fund.featuredReason}</TextParagraph>
          ) : null}
          {fund.benefitSummary.trim().length > 0 ? (
            <TextParagraph variant="secondary" themeColor="textSecondary">
              {fund.benefitSummary}
            </TextParagraph>
          ) : null}
        </View>
      ) : null}

      <FundDetailScoreExplain fundIsin={fund.isin} fundName={fund.name} />

      <CollapsibleSection
        title="Desglose por criterios"
        subtitle="Detalle de comisiones, seguimiento, patrimonio y antigüedad."
        defaultExpanded={false}
      >
        <FundScoreBreakdown breakdown={breakdown} />
        <View className="gap-sm">
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Datos de scoring {fund.quarterTag} ({fund.periodStart} – {fund.periodEnd})
          </TextParagraph>
          <TextLabel variant="meta" themeColor="textSecondary">
            Modelo: {SCORING_CRITERIA_VERSION}
          </TextLabel>
        </View>
      </CollapsibleSection>
    </FundDetailSectionShell>
  );
}

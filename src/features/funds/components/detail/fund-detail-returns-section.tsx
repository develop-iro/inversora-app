import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { FundDetailProfile } from '@/core/domain/fund-detail-profile';
import { FundDetailSectionEmptyState } from '@/features/funds/components/detail/fund-detail-section-empty-state';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { ThemedText } from '@/shared/components/themed-text';
import { HorizontalBarChart, SegmentTabs } from '@/shared/components/ui';
import { hasReturnData } from '@/features/funds/utils/fund-detail-presentation';
import { Spacing } from '@/shared/theme/theme';

type ReturnsTab = 'periods' | 'years';

const RETURNS_TABS = [
  { value: 'periods' as const, label: 'Por periodos' },
  { value: 'years' as const, label: 'Por años' },
];

export type FundDetailReturnsSectionProps = {
  profile: FundDetailProfile;
  fundName: string;
};

export function FundDetailReturnsSection({ profile, fundName }: FundDetailReturnsSectionProps) {
  const [tab, setTab] = useState<ReturnsTab>('periods');

  const chartData = useMemo(() => {
    if (tab === 'periods') {
      return profile.returnsByPeriod.map((item) => ({
        id: item.id,
        label: item.label,
        value: item.percent,
      }));
    }

    return profile.returnsByYear.map((item) => ({
      id: String(item.year),
      label: String(item.year),
      value: item.percent,
    }));
  }, [profile, tab]);

  const chartA11y = `Rentabilidad de ${fundName}, ${
    tab === 'periods' ? 'por periodos' : 'por años'
  }`;
  const hasData = hasReturnData(profile, tab);

  return (
    <FundDetailSectionShell
      title="Rentabilidad"
      hintTerm={FUND_GLOSSARY.pastPerformance.term}
      hintExplanation={FUND_GLOSSARY.pastPerformance.explanation}
    >
      <SegmentTabs tabs={RETURNS_TABS} value={tab} onChange={setTab} accessibilityLabel="Rentabilidad del fondo" />

      <View style={styles.chartWrap}>
        {hasData ? (
          <HorizontalBarChart data={chartData} accessibilityLabel={chartA11y} />
        ) : (
          <FundDetailSectionEmptyState message="Todavía no hay rentabilidades publicadas para este fondo en este horizonte." />
        )}
      </View>

      <View style={styles.notes}>
        <ThemedText type="caption" themeColor="textSecondary">
          {profile.currencyNote}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.noteRight}>
          {profile.methodNote}
        </ThemedText>
      </View>
    </FundDetailSectionShell>
  );
}

const styles = StyleSheet.create({
  chartWrap: {
    paddingTop: Spacing.md,
  },
  notes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  noteRight: {
    flex: 1,
    minWidth: 200,
    textAlign: 'right',
  },
});

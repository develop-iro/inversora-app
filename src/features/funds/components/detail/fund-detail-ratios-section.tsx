import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { FundDetailProfile, RatioHorizon } from '@/core/domain/fund-detail-profile';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { KeyValueList, SegmentTabs } from '@/shared/components/ui';
import { hasAnyRatioData } from '@/features/funds/utils/fund-detail-presentation';
import { Spacing } from '@/shared/theme/theme';

const RATIO_TABS: { value: RatioHorizon; label: string }[] = [
  { value: '12m', label: '12 meses' },
  { value: '3y', label: '3 años' },
  { value: '5y', label: '5 años' },
];

export type FundDetailRatiosSectionProps = {
  profile: FundDetailProfile;
  fundName: string;
};

export function FundDetailRatiosSection({ profile, fundName }: FundDetailRatiosSectionProps) {
  const [horizon, setHorizon] = useState<RatioHorizon>('12m');

  if (!hasAnyRatioData(profile)) {
    return null;
  }

  const rows = profile.ratiosByHorizon[horizon].map((row) => ({
    id: row.id,
    label: row.label,
    value: row.value,
  }));

  return (
    <FundDetailSectionShell
      title="Ratios"
      subtitle={`Principales ratios (en euros) del fondo ${fundName}:`}
      hintTerm={FUND_GLOSSARY.sharpeRatio.term}
      hintExplanation={FUND_GLOSSARY.sharpeRatio.explanation}
    >
      <SegmentTabs
        tabs={RATIO_TABS}
        value={horizon}
        onChange={setHorizon}
        accessibilityLabel="Horizonte temporal de ratios"
      />
      <View style={styles.panel}>
        <KeyValueList rows={rows} />
      </View>
    </FundDetailSectionShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    paddingTop: Spacing.sm,
  },
});

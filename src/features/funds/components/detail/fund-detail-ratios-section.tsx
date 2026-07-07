import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { FundDetailProfile, RatioHorizon } from '@/core/domain/fund-detail-profile';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import {
  getRatioHorizonsWithData,
  hasAnyRatioData,
} from '@/features/funds/utils/fund-detail-presentation';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { KeyValueList, TabHeader } from '@/shared/components/ui';
import { Spacing } from '@/shared/theme/theme';

const RATIO_TAB_LABELS: Record<RatioHorizon, string> = {
  '12m': '12 meses',
  '3y': '3 años',
  '5y': '5 años',
};

export type FundDetailRatiosSectionProps = {
  profile: FundDetailProfile;
  fundName: string;
};

export function FundDetailRatiosSection({ profile, fundName }: FundDetailRatiosSectionProps) {
  const availableHorizons = useMemo(() => getRatioHorizonsWithData(profile), [profile]);
  const [horizon, setHorizon] = useState<RatioHorizon>(() => availableHorizons[0] ?? '12m');
  const activeHorizon = availableHorizons.includes(horizon)
    ? horizon
    : availableHorizons[0];

  if (!hasAnyRatioData(profile) || !activeHorizon) {
    return null;
  }

  const ratioTabs = availableHorizons.map((value) => ({
    value,
    label: RATIO_TAB_LABELS[value],
  }));

  const rows = profile.ratiosByHorizon[activeHorizon].map((row) => ({
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
      <TabHeader
        tabs={ratioTabs}
        value={activeHorizon}
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
    paddingTop: Spacing.xs,
  },
});

import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { ExposureTabId, FundDetailProfile } from '@/core/domain/fund-detail-profile';
import { FundDetailSectionEmptyState } from '@/features/funds/components/detail/fund-detail-section-empty-state';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { ThemedText } from '@/shared/components/themed-text';
import { AllocationBarList, SegmentTabs } from '@/shared/components/ui';
import { getExposureTabsWithData } from '@/features/funds/utils/fund-detail-presentation';
import { Spacing } from '@/shared/theme/theme';

const EXPOSURE_TAB_LABELS: Record<ExposureTabId, string> = {
  sectorial: 'Sectorial',
  regional: 'Regional',
  assetAllocation: 'Asset allocation',
  capitalization: 'Capitalización',
  portfolio: 'Portfolio',
};

const EXPOSURE_SUBTITLES: Record<ExposureTabId, string> = {
  sectorial: 'Exposición por sectores',
  regional: 'Exposición por regiones',
  assetAllocation: 'Reparto por clase de activo',
  capitalization: 'Reparto por tamaño de capitalización',
  portfolio: 'Concentración de la cartera',
};

export type FundDetailExposureSectionProps = {
  profile: FundDetailProfile;
};

export function FundDetailExposureSection({ profile }: FundDetailExposureSectionProps) {
  const tabsWithData = useMemo(() => getExposureTabsWithData(profile), [profile]);
  const [tab, setTab] = useState<ExposureTabId>('sectorial');
  const activeTab = tabsWithData.includes(tab) ? tab : tabsWithData[0];
  const exposureTabs = tabsWithData.map((value) => ({
    value,
    label: EXPOSURE_TAB_LABELS[value],
  }));
  const slices = activeTab ? profile.exposureByTab[activeTab] : [];

  if (tabsWithData.length === 0) {
    return null;
  }

  return (
    <FundDetailSectionShell
      title="Exposición"
      hintTerm={FUND_GLOSSARY.sectorExposure.term}
      hintExplanation={FUND_GLOSSARY.sectorExposure.explanation}
    >
      <SegmentTabs
        tabs={exposureTabs}
        value={activeTab}
        onChange={setTab}
        accessibilityLabel="Tipo de exposición del fondo"
      />

      <ThemedText type="bodyBold" style={styles.subtitle}>
        {EXPOSURE_SUBTITLES[activeTab]}
      </ThemedText>

      <View style={styles.panel}>
        {slices.length > 0 ? (
          <AllocationBarList slices={slices} />
        ) : (
          <FundDetailSectionEmptyState message="Todavía no hay datos de exposición para esta vista." />
        )}
      </View>
    </FundDetailSectionShell>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: Spacing.sm,
  },
  panel: {
    paddingTop: Spacing.xs,
  },
});

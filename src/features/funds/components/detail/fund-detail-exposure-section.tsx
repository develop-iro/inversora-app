import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { ExposureTabId, FundDetailProfile } from '@/core/domain/fund-detail-profile';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { ThemedText } from '@/shared/components/themed-text';
import { AllocationBarList, SegmentTabs } from '@/shared/components/ui';
import { Spacing } from '@/shared/theme/theme';

const EXPOSURE_TABS: { value: ExposureTabId; label: string }[] = [
  { value: 'sectorial', label: 'Sectorial' },
  { value: 'regional', label: 'Regional' },
  { value: 'assetAllocation', label: 'Asset allocation' },
  { value: 'capitalization', label: 'Capitalización' },
  { value: 'portfolio', label: 'Portfolio' },
];

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
  const [tab, setTab] = useState<ExposureTabId>('sectorial');
  const slices = profile.exposureByTab[tab];

  return (
    <FundDetailSectionShell
      title="Exposición"
      hintTerm={FUND_GLOSSARY.sectorExposure.term}
      hintExplanation={FUND_GLOSSARY.sectorExposure.explanation}
    >
      <SegmentTabs
        tabs={EXPOSURE_TABS}
        value={tab}
        onChange={setTab}
        accessibilityLabel="Tipo de exposición del fondo"
      />

      <ThemedText type="bodyBold" style={styles.subtitle}>
        {EXPOSURE_SUBTITLES[tab]}
      </ThemedText>

      <View style={styles.panel}>
        <AllocationBarList slices={slices} />
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

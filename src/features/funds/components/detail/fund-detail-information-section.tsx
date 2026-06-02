import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { FundDetailProfile } from '@/core/domain/fund-detail-profile';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { ThemedText } from '@/shared/components/themed-text';
import { KeyValueList, SegmentTabs } from '@/shared/components/ui';
import { Spacing } from '@/shared/theme/theme';

type InfoTab = 'summary' | 'fees' | 'documents';

const INFO_TABS = [
  { value: 'summary' as const, label: 'Resumen' },
  { value: 'fees' as const, label: 'Comisiones' },
  { value: 'documents' as const, label: 'Documentos' },
];

export type FundDetailInformationSectionProps = {
  profile: FundDetailProfile;
};

export function FundDetailInformationSection({ profile }: FundDetailInformationSectionProps) {
  const [tab, setTab] = useState<InfoTab>('summary');

  const documentRows = profile.documents.map((doc) => ({
    id: doc.id,
    label: doc.label,
    value: doc.status === 'coming_soon' ? 'Próximamente' : 'Ver documento',
    emphasis: doc.status === 'available' ? ('link' as const) : undefined,
  }));

  return (
    <FundDetailSectionShell
      title="Información"
      hintTerm={FUND_GLOSSARY.benchmark.term}
      hintExplanation={FUND_GLOSSARY.benchmark.explanation}
    >
      <ThemedText type="body" themeColor="textSecondary" style={styles.description}>
        {profile.description}
      </ThemedText>

      <SegmentTabs tabs={INFO_TABS} value={tab} onChange={setTab} accessibilityLabel="Información del fondo" />

      <View style={styles.tabPanel}>
        {tab === 'summary' ? <KeyValueList rows={profile.summaryRows} /> : null}
        {tab === 'fees' ? <KeyValueList rows={profile.feeRows} /> : null}
        {tab === 'documents' ? <KeyValueList rows={documentRows} /> : null}
      </View>
    </FundDetailSectionShell>
  );
}

const styles = StyleSheet.create({
  description: {
    lineHeight: 24,
  },
  tabPanel: {
    paddingTop: Spacing.sm,
  },
});

import { useMemo, useState } from 'react';
import { View } from 'react-native';

import type { FundDetailProfile } from '@/core/domain/fund-detail-profile';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import {
  FUND_DETAIL_COLLAPSIBLE_DESCRIPTION_MIN_LENGTH,
  hasInformationSectionData,
  hasPopulatedProfileRows,
} from '@/features/funds/utils/fund-detail-presentation';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { CollapsibleSection } from '@/shared/components/layout';
import { TextParagraph } from '@/shared/components/text';
import { KeyValueList, TabHeader } from '@/shared/components/ui';

type InfoTab = 'summary' | 'fees' | 'documents';

const INFO_TAB_DEFINITIONS: { value: InfoTab; label: string }[] = [
  { value: 'summary', label: 'Resumen' },
  { value: 'fees', label: 'Comisiones' },
  { value: 'documents', label: 'Documentos' },
];

export type FundDetailInformationSectionProps = {
  profile: FundDetailProfile;
};

/**
 * Renders profile tables only for tabs that contain populated rows.
 */
function buildAvailableInfoTabs(profile: FundDetailProfile): { value: InfoTab; label: string }[] {
  return INFO_TAB_DEFINITIONS.filter((tab) => {
    if (tab.value === 'summary') {
      return hasPopulatedProfileRows(profile.summaryRows);
    }

    if (tab.value === 'fees') {
      return hasPopulatedProfileRows(profile.feeRows);
    }

    return profile.documents.length > 0;
  });
}

export function FundDetailInformationSection({ profile }: FundDetailInformationSectionProps) {
  const availableTabs = useMemo(() => buildAvailableInfoTabs(profile), [profile]);
  const [tab, setTab] = useState<InfoTab>(() => availableTabs[0]?.value ?? 'summary');
  const trimmedDescription = profile.description.trim();
  const shouldCollapseDescription =
    trimmedDescription.length >= FUND_DETAIL_COLLAPSIBLE_DESCRIPTION_MIN_LENGTH;

  const activeTab = availableTabs.some((item) => item.value === tab)
    ? tab
    : availableTabs[0]?.value;

  const documentRows = profile.documents.map((doc) => ({
    id: doc.id,
    label: doc.label,
    value: doc.status === 'coming_soon' ? 'Próximamente' : 'Ver documento',
    emphasis: doc.status === 'available' ? ('link' as const) : undefined,
  }));

  if (!hasInformationSectionData(profile)) {
    return null;
  }

  return (
    <FundDetailSectionShell
      title="Información"
      hintTerm={FUND_GLOSSARY.benchmark.term}
      hintExplanation={FUND_GLOSSARY.benchmark.explanation}
    >
      {trimmedDescription.length > 0 ? (
        shouldCollapseDescription ? (
          <CollapsibleSection title="Descripción del fondo" defaultExpanded={false}>
            <TextParagraph
              variant="secondary"
              themeColor="textSecondary"
              className="leading-6"
            >
              {trimmedDescription}
            </TextParagraph>
          </CollapsibleSection>
        ) : (
          <TextParagraph variant="secondary" themeColor="textSecondary" className="leading-6">
            {trimmedDescription}
          </TextParagraph>
        )
      ) : null}

      {availableTabs.length > 0 && activeTab ? (
        <>
          <TabHeader
            tabs={availableTabs}
            value={activeTab}
            onChange={setTab}
            accessibilityLabel="Información del fondo"
          />
          <View className="pt-xs">
            {activeTab === 'summary' ? <KeyValueList rows={profile.summaryRows} /> : null}
            {activeTab === 'fees' ? <KeyValueList rows={profile.feeRows} /> : null}
            {activeTab === 'documents' ? <KeyValueList rows={documentRows} /> : null}
          </View>
        </>
      ) : null}
    </FundDetailSectionShell>
  );
}

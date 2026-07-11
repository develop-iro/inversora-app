import { useMemo, useState } from 'react';
import { View } from 'react-native';

import type { FundDetailProfile } from '@/core/domain/fund-detail-profile';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import { hasAnyReturnData, hasReturnData } from '@/features/funds/utils/fund-detail-presentation';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { CollapsibleSection } from '@/shared/components/layout';
import { TextParagraph } from '@/shared/components/text';
import { HorizontalBarChart, TabHeader } from '@/shared/components/ui';

type ReturnsTab = 'periods' | 'years';

const RETURNS_TABS = [
  { value: 'periods' as const, label: 'Por periodos' },
  { value: 'years' as const, label: 'Por años' },
];

export type FundDetailReturnsSectionProps = {
  profile: FundDetailProfile;
  fundName: string;
};

function buildAvailableReturnsTabs(profile: FundDetailProfile): { value: ReturnsTab; label: string }[] {
  return RETURNS_TABS.filter((tab) => hasReturnData(profile, tab.value));
}

export function FundDetailReturnsSection({ profile, fundName }: FundDetailReturnsSectionProps) {
  const availableTabs = useMemo(() => buildAvailableReturnsTabs(profile), [profile]);
  const [tab, setTab] = useState<ReturnsTab>(() => availableTabs[0]?.value ?? 'periods');
  const activeTab = availableTabs.some((item) => item.value === tab)
    ? tab
    : availableTabs[0]?.value;

  const chartData = useMemo(() => {
    if (!activeTab) {
      return [];
    }

    if (activeTab === 'periods') {
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
  }, [activeTab, profile]);

  const chartA11y = `Rentabilidad de ${fundName}, ${
    activeTab === 'periods' ? 'por periodos' : 'por años'
  }`;

  const methodologyNotes = [profile.currencyNote.trim(), profile.methodNote.trim()].filter(
    (note) => note.length > 0,
  );

  if (!hasAnyReturnData(profile) || !activeTab) {
    return null;
  }

  return (
    <FundDetailSectionShell
      title="Rentabilidad"
      hintTerm={FUND_GLOSSARY.pastPerformance.term}
      hintExplanation={FUND_GLOSSARY.pastPerformance.explanation}
    >
      <TabHeader
        tabs={availableTabs}
        value={activeTab}
        onChange={setTab}
        accessibilityLabel="Rentabilidad del fondo"
      />

      <View className="pt-xs">
        <HorizontalBarChart data={chartData} accessibilityLabel={chartA11y} />
      </View>

      {methodologyNotes.length > 0 ? (
        <CollapsibleSection
          title="Metodología y divisa"
          subtitle="Notas sobre cómo se calculan estas rentabilidades."
          defaultExpanded={false}
        >
          <View className="gap-sm">
            {methodologyNotes.map((note) => (
              <TextParagraph key={note} variant="secondary" themeColor="textSecondary">
                {note}
              </TextParagraph>
            ))}
          </View>
        </CollapsibleSection>
      ) : null}
    </FundDetailSectionShell>
  );
}

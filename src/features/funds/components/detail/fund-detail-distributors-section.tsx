import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

import type { FundDetailProfile, FundDistributorKind } from '@/core/domain/fund-detail-profile';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { CollapsibleSection } from '@/shared/components/layout';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { Card } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';

const KIND_LABELS: Record<FundDistributorKind, string> = {
  bank: 'Banco',
  broker: 'Bróker',
};

const KIND_ICONS: Record<FundDistributorKind, keyof typeof MaterialCommunityIcons.glyphMap> = {
  bank: 'bank-outline',
  broker: 'finance',
};

export type FundDetailDistributorsSectionProps = {
  profile: FundDetailProfile;
};

export function FundDetailDistributorsSection({ profile }: FundDetailDistributorsSectionProps) {
  const theme = useTheme();

  if (profile.distributors.length === 0) {
    return null;
  }

  return (
    <FundDetailSectionShell
      title="¿Dónde contratarlo?"
      subtitle="Bancos y brókers donde suele estar disponible este fondo (lista orientativa)."
      hintTerm={FUND_GLOSSARY.fundAvailability.term}
      hintExplanation={FUND_GLOSSARY.fundAvailability.explanation}
    >
      <View className="gap-sm">
        {profile.distributors.map((distributor) => (
          <Card key={distributor.id} variant="outlined" className="self-stretch">
            <View className="flex-row items-start gap-md">
              <View className="h-10 w-10 items-center justify-center rounded-chip border border-border bg-surface-muted">
                <MaterialCommunityIcons
                  name={KIND_ICONS[distributor.kind]}
                  size={20}
                  color={theme.primary}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                />
              </View>
              <View className="min-w-0 flex-1 gap-xs">
                <View className="flex-row flex-wrap items-baseline gap-sm">
                  <TextParagraph variant="emphasis">{distributor.name}</TextParagraph>
                  <TextLabel variant="meta" themeColor="textSecondary">
                    {KIND_LABELS[distributor.kind]}
                  </TextLabel>
                </View>
                {distributor.note ? (
                  <TextParagraph variant="secondary" themeColor="textSecondary">
                    {distributor.note}
                  </TextParagraph>
                ) : null}
              </View>
            </View>
          </Card>
        ))}
      </View>

      <CollapsibleSection
        title="Aviso sobre disponibilidad"
        defaultExpanded={false}
      >
        <TextParagraph variant="secondary" themeColor="textSecondary">
          Comprueba en la web de cada entidad el ISIN, la clase del fondo y las comisiones antes de
          contratar. Inversora no enlaza con plataformas ni recibe remuneración por su inclusión en
          esta lista.
        </TextParagraph>
      </CollapsibleSection>
    </FundDetailSectionShell>
  );
}

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import type { FundDetailProfile, FundDistributorKind } from '@/core/domain/fund-detail-profile';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { CollapsibleSection } from '@/shared/components/layout';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { Card } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

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
      <View style={styles.list}>
        {profile.distributors.map((distributor) => (
          <Card key={distributor.id} variant="outlined" style={styles.row}>
            <View style={styles.rowContent}>
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={KIND_ICONS[distributor.kind]}
                  size={20}
                  color={theme.primary}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                />
              </View>
              <View style={styles.textBlock}>
                <View style={styles.nameRow}>
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

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
  },
  row: {
    alignSelf: 'stretch',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.chip,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
});

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import type { FundDetailProfile, FundDistributorKind } from '@/core/domain/fund-detail-profile';
import { FundDetailSectionShell } from '@/features/funds/components/detail/fund-detail-section-shell';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { ThemedText } from '@/shared/components/themed-text';
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
          <View
            key={distributor.id}
            style={[
              styles.row,
              {
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: theme.surface,
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
                <ThemedText type="bodyBold">{distributor.name}</ThemedText>
                <ThemedText type="metaLabel" themeColor="textSecondary">
                  {KIND_LABELS[distributor.kind]}
                </ThemedText>
              </View>
              {distributor.note ? (
                <ThemedText type="caption" themeColor="textSecondary">
                  {distributor.note}
                </ThemedText>
              ) : null}
            </View>
          </View>
        ))}
      </View>

      <ThemedText type="caption" themeColor="textSecondary" style={styles.disclaimer}>
        Comprueba en la web de cada entidad el ISIN, la clase del fondo y las comisiones antes de
        contratar. Inversora no enlaza con plataformas ni recibe remuneración por su inclusión en
        esta lista.
      </ThemedText>
    </FundDetailSectionShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.card,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.chip,
    borderWidth: 1,
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
  disclaimer: {
    lineHeight: 18,
  },
});

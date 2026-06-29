import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CompareLoadErrorsBannerProps = {
  notFoundIsins: readonly string[];
};

/**
 * Surfaces ISINs that failed to load during comparison hydration.
 */
export function CompareLoadErrorsBanner({ notFoundIsins }: CompareLoadErrorsBannerProps) {
  const theme = useTheme();

  if (notFoundIsins.length === 0) {
    return null;
  }

  const label =
    notFoundIsins.length === 1
      ? `No se pudo cargar el fondo ${notFoundIsins[0]}.`
      : `No se pudieron cargar ${notFoundIsins.length} fondos seleccionados.`;

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.banner,
        {
          backgroundColor: theme.backgroundSoft,
          borderColor: theme.border,
        },
      ]}
    >
      <ThemedText type="bodyBold">Carga incompleta</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        {label} Puedes quitarlos o intentar añadirlos de nuevo.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
});

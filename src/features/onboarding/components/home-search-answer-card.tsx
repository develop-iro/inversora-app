import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import type { HomeSearchAnswer } from '@/features/onboarding/mocks/home-search-answers-mock';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type HomeSearchAnswerCardProps = {
  query: string;
  answer: HomeSearchAnswer;
};

export function HomeSearchAnswerCard({ query, answer }: HomeSearchAnswerCardProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`Respuesta orientativa para ${query}`}
      style={[
        styles.card,
        {
          backgroundColor: 'rgba(234, 248, 246, 0.66)',
          borderColor: 'rgba(0, 191, 166, 0.16)',
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: 'rgba(0, 191, 166, 0.14)' }]}>
          <MaterialCommunityIcons name="robot-outline" size={16} color={theme.deepOcean} />
        </View>
        <View style={styles.headerCopy}>
          <ThemedText type="metaLabel" themeColor="deepOcean">
            Respuesta orientativa
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
            Mock educativo · próximamente Asistente Inversora
          </ThemedText>
        </View>
      </View>

      <ThemedText type="bodyBold">{answer.title}</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.body}>
        {answer.body}
      </ThemedText>

      <ThemedText type="caption" themeColor="textSecondary" style={styles.disclaimer}>
        No es asesoramiento financiero personalizado. El rendimiento pasado no garantiza
        resultados futuros.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  body: {
    lineHeight: 20,
  },
  disclaimer: {
    lineHeight: 17,
    opacity: 0.82,
  },
});

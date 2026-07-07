import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import type { ProfileInconsistency } from '@/features/learn/services/build-educational-profile';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type LearnInconsistencyNoticeProps = {
  inconsistencies: readonly ProfileInconsistency[];
};

/**
 * Explains contradictory questionnaire answers before showing the profile result.
 */
export function LearnInconsistencyNotice({ inconsistencies }: LearnInconsistencyNoticeProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.deepOcean} />
        <TextHeading variant="section" style={styles.title}>
          Revisemos juntos tus respuestas
        </TextHeading>
      </View>

      <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.intro}>
        Hemos detectado combinaciones que suelen generar incomodidad. No es un error: solo
        queremos que entiendas el contexto antes de continuar.
      </TextParagraph>

      <View style={styles.list}>
        {inconsistencies.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: theme.softTealSurface,
                borderColor: theme.primaryBorderSubtle,
              },
            ]}
          >
            <TextParagraph variant="emphasis">{item.title}</TextParagraph>
            <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.cardBody}>
              {item.body}
            </TextParagraph>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    letterSpacing: -0.2,
  },
  intro: {
    lineHeight: 24,
  },
  list: {
    gap: Spacing.sm,
  },
  card: {
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  cardBody: {
    lineHeight: 18,
  },
});

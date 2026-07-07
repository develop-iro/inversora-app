import { StyleSheet, View } from 'react-native';

import type { EducationalProfile } from '@/core/domain/educational-profile';
import {
  getEducationalProfileSummary,
  getInvestmentHorizonLabel,
  getKnowledgeLevelLabel,
  getLearningGoalLabel,
  getRiskOrientationLabel,
} from '@/features/learn/services/build-educational-profile';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { Badge } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type LearnProfileResultProps = {
  profile: EducationalProfile;
};

type ProfileMetricProps = {
  label: string;
  value: string;
};

function ProfileMetric({ label, value }: ProfileMetricProps) {
  return (
    <View style={styles.metric}>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {label}
      </TextParagraph>
      <TextParagraph variant="emphasis">{value}</TextParagraph>
    </View>
  );
}

/**
 * Summarizes the orientative educational profile after questionnaire completion.
 */
export function LearnProfileResult({ profile }: LearnProfileResultProps) {
  const theme = useTheme();
  const summary = getEducationalProfileSummary(profile);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextLabel variant="meta" themeColor="deepOcean">
          Tu perfil orientativo
        </TextLabel>
        <TextHeading variant="section" style={styles.title}>
          Gracias por tomarte este momento
        </TextHeading>
        <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.summary}>
          {summary}
        </TextParagraph>
      </View>

      <View
        style={[
          styles.metricsCard,
          {
            borderColor: theme.borderSubtle,
            backgroundColor: theme.softTealSurfaceFaint,
          },
        ]}
      >
        <View style={styles.badgeRow}>
          <Badge label={getRiskOrientationLabel(profile.riskOrientation)} variant="mint" />
          <Badge label={getKnowledgeLevelLabel(profile.knowledgeLevel)} variant="muted" />
        </View>

        <View style={styles.metrics}>
          <ProfileMetric
            label="Horizonte"
            value={getInvestmentHorizonLabel(profile.investmentHorizon)}
          />
          <ProfileMetric
            label="Próximo paso sugerido"
            value={getLearningGoalLabel(profile.learningGoal)}
          />
        </View>
      </View>

      <LegalNotice
        title="Perfil educativo, no asesoramiento"
        body="Este resultado es orientativo y se guarda solo en tu dispositivo. No constituye una recomendación de inversión ni un test de idoneidad. Toda inversión conlleva riesgo y la rentabilidad pasada no garantiza resultados futuros."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.sm,
  },
  title: {
    letterSpacing: -0.2,
  },
  summary: {
    lineHeight: 24,
  },
  metricsCard: {
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  metrics: {
    gap: Spacing.md,
  },
  metric: {
    gap: Spacing.xs,
  },
});

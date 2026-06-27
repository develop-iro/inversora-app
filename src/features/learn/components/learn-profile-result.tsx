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
import { ThemedText } from '@/shared/components/themed-text';
import { Badge } from '@/shared/components/ui';
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
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="bodyBold">{value}</ThemedText>
    </View>
  );
}

/**
 * Summarizes the orientative educational profile after questionnaire completion.
 */
export function LearnProfileResult({ profile }: LearnProfileResultProps) {
  const summary = getEducationalProfileSummary(profile);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="metaLabel" themeColor="deepOcean">
          Tu perfil orientativo
        </ThemedText>
        <ThemedText type="sectionTitle" style={styles.title}>
          Gracias por tomarte este momento
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.summary}>
          {summary}
        </ThemedText>
      </View>

      <View style={styles.metricsCard}>
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
    borderColor: 'rgba(11, 46, 54, 0.06)',
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.md,
    backgroundColor: 'rgba(234, 248, 246, 0.35)',
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

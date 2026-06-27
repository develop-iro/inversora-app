import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { EducationalProfile } from '@/core/domain/educational-profile';
import { LearnInconsistencyNotice } from '@/features/learn/components/learn-inconsistency-notice';
import { LearnProfileResult } from '@/features/learn/components/learn-profile-result';
import { LearnProgressHeader } from '@/features/learn/components/learn-progress-header';
import { LearnQuestionStepView } from '@/features/learn/components/learn-question-step-view';
import {
  LEARN_QUESTIONNAIRE_STEPS,
  LEARN_QUESTIONNAIRE_TOTAL_STEPS,
} from '@/features/learn/constants/learn-questionnaire';
import { useEducationalProfile } from '@/features/learn/hooks/use-educational-profile';
import {
  buildEducationalProfile,
  type BuildEducationalProfileResult,
  type ProfileInconsistency,
} from '@/features/learn/services/build-educational-profile';
import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';
import { Layout, Spacing } from '@/shared/theme/theme';

type LearnFlowPhase = 'questionnaire' | 'inconsistency' | 'result';

const HEADER_HEIGHT = 56;

/**
 * Multi-step educational profiling questionnaire launched from "Quiero aprender".
 */
export default function LearnQuestionnaireScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { contentWidth } = useMobileLayout();
  const { saveProfile } = useEducationalProfile();

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<LearnFlowPhase>('questionnaire');
  const [profileResult, setProfileResult] = useState<BuildEducationalProfileResult | null>(null);
  const [completedProfile, setCompletedProfile] = useState<EducationalProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentStep = LEARN_QUESTIONNAIRE_STEPS[stepIndex];
  const isLastQuestionnaireStep = stepIndex === LEARN_QUESTIONNAIRE_TOTAL_STEPS - 1;
  const selectedOptionId = currentStep ? answers[currentStep.id] : undefined;

  const canContinue = useMemo(() => {
    if (!currentStep) {
      return false;
    }

    if (currentStep.kind === 'info') {
      return true;
    }

    return Boolean(selectedOptionId);
  }, [currentStep, selectedOptionId]);

  const handleBack = useCallback(() => {
    if (phase === 'result') {
      router.replace(routes.home);
      return;
    }

    if (phase === 'inconsistency') {
      setPhase('questionnaire');
      setProfileResult(null);
      return;
    }

    if (stepIndex === 0) {
      router.back();
      return;
    }

    setStepIndex((current) => current - 1);
  }, [phase, router, stepIndex]);

  const handleSelectOption = useCallback((optionId: string) => {
    if (!currentStep) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentStep.id]: optionId,
    }));
  }, [currentStep]);

  const finalizeProfile = useCallback(
    async (result: BuildEducationalProfileResult) => {
      setIsSaving(true);

      try {
        await saveProfile(result.profile);
        setCompletedProfile(result.profile);
        setPhase('result');
      } finally {
        setIsSaving(false);
      }
    },
    [saveProfile],
  );

  const handleContinue = useCallback(async () => {
    if (!currentStep || !canContinue) {
      return;
    }

    if (!isLastQuestionnaireStep) {
      setStepIndex((current) => current + 1);
      return;
    }

    const result = buildEducationalProfile(answers);

    if (result.inconsistencies.length > 0) {
      setProfileResult(result);
      setPhase('inconsistency');
      return;
    }

    await finalizeProfile(result);
  }, [answers, canContinue, currentStep, finalizeProfile, isLastQuestionnaireStep]);

  const handleAcceptInconsistency = useCallback(async () => {
    if (!profileResult) {
      return;
    }

    await finalizeProfile(profileResult);
  }, [finalizeProfile, profileResult]);

  const handleReviseAnswers = useCallback(() => {
    setPhase('questionnaire');
    setProfileResult(null);
    setStepIndex(LEARN_QUESTIONNAIRE_TOTAL_STEPS - 1);
  }, []);

  const primaryLabel = useMemo(() => {
    if (phase === 'inconsistency') {
      return 'Entiendo, continuar';
    }

    if (phase === 'result') {
      return 'Explorar fondos';
    }

    if (currentStep?.kind === 'info') {
      return stepIndex === 0 ? 'Empezar' : 'Continuar';
    }

    return isLastQuestionnaireStep ? 'Ver mi perfil' : 'Siguiente';
  }, [currentStep?.kind, isLastQuestionnaireStep, phase, stepIndex]);

  const handlePrimaryPress = useCallback(async () => {
    if (phase === 'result') {
      router.replace(routes.fundsCatalog);
      return;
    }

    if (phase === 'inconsistency') {
      await handleAcceptInconsistency();
      return;
    }

    await handleContinue();
  }, [handleAcceptInconsistency, handleContinue, phase, router]);

  const inconsistencies: readonly ProfileInconsistency[] =
    profileResult?.inconsistencies ?? [];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.surface,
            borderBottomColor: 'rgba(11, 46, 54, 0.06)',
          },
        ]}
      >
        <View style={[styles.headerInner, { width: contentWidth, maxWidth: contentWidth }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={theme.text} />
          </Pressable>
          <ThemedText type="navTitle" style={styles.headerTitle}>
            Quiero aprender
          </ThemedText>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            width: contentWidth,
            maxWidth: contentWidth,
            paddingBottom: insets.bottom + Spacing['3xl'],
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {phase === 'questionnaire' && currentStep ? (
          <>
            <LearnProgressHeader
              currentStep={stepIndex + 1}
              totalSteps={LEARN_QUESTIONNAIRE_TOTAL_STEPS}
            />
            <LearnQuestionStepView
              step={currentStep}
              selectedOptionId={selectedOptionId}
              onSelectOption={handleSelectOption}
            />
          </>
        ) : null}

        {phase === 'inconsistency' ? (
          <LearnInconsistencyNotice inconsistencies={inconsistencies} />
        ) : null}

        {phase === 'result' && completedProfile ? (
          <LearnProfileResult profile={completedProfile} />
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.surface,
            borderTopColor: 'rgba(11, 46, 54, 0.06)',
            paddingBottom: insets.bottom + Spacing.md,
          },
        ]}
      >
        <View style={[styles.footerInner, { width: contentWidth, maxWidth: contentWidth }]}>
          {phase === 'inconsistency' ? (
            <Button
              variant="ghost"
              label="Revisar respuestas"
              accessibilityLabel="Revisar respuestas del cuestionario"
              onPress={handleReviseAnswers}
              fullWidth
            />
          ) : null}

          <Button
            label={primaryLabel}
            accessibilityLabel={primaryLabel}
            onPress={() => {
              void handlePrimaryPress();
            }}
            loading={isSaving}
            disabled={phase === 'questionnaire' && !canContinue}
            fullWidth
          />

          {phase === 'result' ? (
            <Button
              variant="ghost"
              label="Volver al inicio"
              accessibilityLabel="Volver al inicio"
              onPress={() => router.replace(routes.home)}
              fullWidth
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    alignSelf: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerInner: {
    alignSelf: 'center',
    minHeight: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing.sm,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignSelf: 'center',
    flexGrow: 1,
    gap: Spacing.lg,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.xl,
  },
  footer: {
    alignSelf: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.md,
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  footerInner: {
    alignSelf: 'center',
    gap: Spacing.sm,
  },
});

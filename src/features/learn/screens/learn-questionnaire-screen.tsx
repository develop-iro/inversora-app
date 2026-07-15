import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { EducationalProfile } from '@/core/domain/educational-profile';
import { modal } from '@/core/overlay/modal';
import { initialProfileOnboardingStore } from '@/core/storage/initial-profile-onboarding-store';
import { LearnInconsistencyNotice } from '@/features/learn/components/learn-inconsistency-notice';
import { LearnProfileResult } from '@/features/learn/components/learn-profile-result';
import { LearnProgressHeader } from '@/features/learn/components/learn-progress-header';
import { LearnQuestionStepView } from '@/features/learn/components/learn-question-step-view';
import { LearnWelcomeIntro } from '@/features/learn/components/learn-welcome-intro';
import {
  getLearnQuestionnaireProgressIndex,
  isLearnWelcomeStep,
  LEARN_QUESTIONNAIRE_PROGRESS_TOTAL,
  LEARN_QUESTIONNAIRE_SCREEN_TITLE,
  LEARN_QUESTIONNAIRE_STEPS,
  LEARN_QUESTIONNAIRE_TOTAL_STEPS,
} from '@/features/learn/constants/learn-questionnaire';
import { useEducationalProfile } from '@/features/learn/hooks/use-educational-profile';
import {
  buildEducationalProfile,
  type BuildEducationalProfileResult,
  type ProfileInconsistency,
} from '@/features/learn/services/build-educational-profile';
import { applyQuestionnaireGraduation } from '@/features/learn/services/educational-profile-graduation';
import { syncEducationalProfileToServer } from '@/features/learn/services/educational-profile-sync';
import {
  trackLearnAbandoned,
  trackLearnCompleted,
  trackLearnInconsistencyResolved,
  trackLearnInconsistencyShown,
  trackLearnStarted,
  trackLearnStepAnswered,
  trackLearnStepBack,
  trackLearnStepViewed,
} from '@/features/learn/services/learn-questionnaire-analytics';
import { ScreenShell } from '@/shared/components/layout';
import { HeaderBar, HeaderModal, HeaderTextAction } from '@/shared/components/headers';
import { Button } from '@/shared/components/ui';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { routes } from '@/shared/navigation/routes';
import { Layout, Spacing } from '@/shared/theme/theme';

type LearnFlowPhase = 'questionnaire' | 'inconsistency' | 'result';

type LearnSearchParams = {
  mode?: string | string[];
};

function resolveInitialMode(mode: LearnSearchParams['mode']): boolean {
  if (Array.isArray(mode)) {
    return mode[0] === 'initial';
  }

  return mode === 'initial';
}

/**
 * Multi-step educational profiling questionnaire for the orientative investor profile.
 */
export default function LearnQuestionnaireScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<LearnSearchParams>();
  const insets = useSafeAreaInsets();
  const { contentWidth } = useMobileLayout();
  const { saveProfile } = useEducationalProfile();
  const isInitialMode = resolveInitialMode(mode);
  const analyticsMode = isInitialMode ? 'initial' : 'voluntary';
  const hasTrackedStartedRef = useRef(false);

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<LearnFlowPhase>('questionnaire');
  const [profileResult, setProfileResult] = useState<BuildEducationalProfileResult | null>(null);
  const [completedProfile, setCompletedProfile] = useState<EducationalProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isWelcomeRevealComplete, setIsWelcomeRevealComplete] = useState(false);

  const currentStep = LEARN_QUESTIONNAIRE_STEPS[stepIndex];
  const isWelcomeStep = phase === 'questionnaire' && isLearnWelcomeStep(stepIndex);
  const progressIndex = getLearnQuestionnaireProgressIndex(stepIndex);
  const isLastQuestionnaireStep = stepIndex === LEARN_QUESTIONNAIRE_TOTAL_STEPS - 1;
  const selectedOptionId = currentStep ? answers[currentStep.id] : undefined;

  const canContinue = useMemo(() => {
    if (!currentStep) {
      return false;
    }

    if (isWelcomeStep && !isWelcomeRevealComplete) {
      return false;
    }

    if (currentStep.kind === 'info') {
      return true;
    }

    return Boolean(selectedOptionId);
  }, [currentStep, isWelcomeRevealComplete, isWelcomeStep, selectedOptionId]);

  useEffect(() => {
    if (phase !== 'questionnaire' || !currentStep) {
      return;
    }

    trackLearnStepViewed({
      step: currentStep,
      stepIndex,
      mode: analyticsMode,
    });
  }, [analyticsMode, currentStep, phase, stepIndex]);

  const handleSkipInitialProfile = useCallback(async () => {
    trackLearnAbandoned(currentStep?.id, phase, analyticsMode);
    setIsSkipping(true);

    try {
      await initialProfileOnboardingStore.setDismissed();
      router.replace(routes.home);
    } finally {
      setIsSkipping(false);
    }
  }, [analyticsMode, currentStep?.id, phase, router]);

  const handleClose = useCallback(async () => {
    const executeClose = (): void => {
      if (phase === 'result') {
        router.replace(routes.home);
        return;
      }

      if (phase === 'inconsistency') {
        if (isInitialMode) {
          void handleSkipInitialProfile();
          return;
        }

        trackLearnAbandoned(currentStep?.id, phase, analyticsMode);
        router.back();
        return;
      }

      if (isInitialMode && isWelcomeStep) {
        void handleSkipInitialProfile();
        return;
      }

      if (isInitialMode) {
        void handleSkipInitialProfile();
        return;
      }

      trackLearnAbandoned(currentStep?.id, phase, analyticsMode);
      router.back();
    };

    const needsConfirmation =
      phase === 'result' ||
      phase === 'inconsistency' ||
      (phase === 'questionnaire' && (progressIndex !== null || stepIndex > 0) && !isWelcomeStep);

    if (!needsConfirmation) {
      executeClose();
      return;
    }

    let title = '¿Salir del cuestionario?';
    let message = 'Perderás el progreso actual si sales ahora.';

    if (phase === 'result') {
      title = '¿Salir del perfil orientativo?';
      message =
        'Tu perfil ya está guardado en el dispositivo. También guardamos una copia anónima para orientar el producto. ¿Quieres salir?';
    } else if (phase === 'inconsistency') {
      title = '¿Salir antes de ver tu perfil?';
      message =
        'Aún no has visto tu perfil orientativo. Puedes continuar, ajustar alguna respuesta o salir ahora.';
    }

    const confirmed = await modal.confirm(title, message, {
      confirmLabel: 'Salir',
      destructive: true,
    });

    if (confirmed) {
      executeClose();
    }
  }, [
    analyticsMode,
    currentStep?.id,
    handleSkipInitialProfile,
    isInitialMode,
    isWelcomeStep,
    phase,
    progressIndex,
    router,
    stepIndex,
  ]);

  const handlePreviousStep = useCallback(() => {
    if (phase !== 'questionnaire' || stepIndex <= 0) {
      return;
    }

    const previousStep = LEARN_QUESTIONNAIRE_STEPS[stepIndex - 1];

    if (currentStep && previousStep) {
      trackLearnStepBack(currentStep, previousStep, analyticsMode);
    }

    setStepIndex((current) => current - 1);
  }, [analyticsMode, currentStep, phase, stepIndex]);

  const handleSelectOption = useCallback((optionId: string) => {
    if (!currentStep) {
      return;
    }

    trackLearnStepAnswered(currentStep, optionId, analyticsMode);

    setAnswers((current) => ({
      ...current,
      [currentStep.id]: optionId,
    }));
  }, [analyticsMode, currentStep]);

  const finalizeProfile = useCallback(
    async (
      result: BuildEducationalProfileResult,
      options?: { readonly goHome?: boolean },
    ) => {
      setIsSaving(true);

      try {
        const graduatedProfile = applyQuestionnaireGraduation(result.profile);
        await saveProfile(graduatedProfile);
        void syncEducationalProfileToServer(graduatedProfile);
        await initialProfileOnboardingStore.clearDismissed();
        trackLearnCompleted(
          graduatedProfile.riskOrientation,
          graduatedProfile.profileVersion,
          analyticsMode,
        );

        if (options?.goHome) {
          router.replace(routes.home);
          return;
        }

        setCompletedProfile(graduatedProfile);
        setPhase('result');
      } finally {
        setIsSaving(false);
      }
    },
    [analyticsMode, router, saveProfile],
  );

  const handleContinue = useCallback(async () => {
    if (!currentStep || !canContinue) {
      return;
    }

    if (isWelcomeStep && !hasTrackedStartedRef.current) {
      hasTrackedStartedRef.current = true;
      trackLearnStarted(analyticsMode);
    }

    if (!isLastQuestionnaireStep) {
      setStepIndex((current) => current + 1);
      return;
    }

    const result = buildEducationalProfile(answers);

    if (result.inconsistencies.length > 0) {
      setProfileResult(result);
      setPhase('inconsistency');
      trackLearnInconsistencyShown(result.inconsistencies.length, analyticsMode);
      return;
    }

    await finalizeProfile(result);
  }, [analyticsMode, answers, canContinue, currentStep, finalizeProfile, isLastQuestionnaireStep, isWelcomeStep]);

  const handleAcceptInconsistency = useCallback(
    async (destination: 'result' | 'home' = 'result') => {
      if (!profileResult) {
        return;
      }

      trackLearnInconsistencyResolved('accept', analyticsMode);
      await finalizeProfile(profileResult, { goHome: destination === 'home' });
    },
    [analyticsMode, finalizeProfile, profileResult],
  );

  const handleReviseAnswers = useCallback(() => {
    trackLearnInconsistencyResolved('revise', analyticsMode);
    setPhase('questionnaire');
    setProfileResult(null);
    setStepIndex(LEARN_QUESTIONNAIRE_TOTAL_STEPS - 1);
  }, [analyticsMode]);

  const primaryLabel = useMemo(() => {
    if (phase === 'inconsistency') {
      return 'Ir al inicio';
    }

    if (phase === 'result') {
      return 'Ir al inicio';
    }

    if (isWelcomeStep) {
      return 'Empezar cuestionario';
    }

    if (currentStep?.kind === 'info') {
      return 'Continuar';
    }

    return isLastQuestionnaireStep ? 'Ver mi perfil' : 'Siguiente';
  }, [currentStep?.kind, isLastQuestionnaireStep, isWelcomeStep, phase]);

  const handlePrimaryPress = useCallback(async () => {
    if (phase === 'result') {
      router.replace(routes.home);
      return;
    }

    if (phase === 'inconsistency') {
      await handleAcceptInconsistency('home');
      return;
    }

    await handleContinue();
  }, [handleAcceptInconsistency, handleContinue, phase, router]);

  const handleOpenSuggestedCatalog = useCallback(() => {
    router.replace(routes.fundsCatalogWithProfileHints);
  }, [router]);

  const inconsistencies: readonly ProfileInconsistency[] =
    profileResult?.inconsistencies ?? [];

  const showPreviousStep =
    phase === 'questionnaire' && progressIndex !== null && progressIndex > 1;

  const showInitialWelcomeHeader =
    phase === 'questionnaire' && isWelcomeStep && isInitialMode;

  const showQuestionnaireHeader =
    (phase !== 'questionnaire' || !isWelcomeStep || isInitialMode) && !showInitialWelcomeHeader;

  const handleWelcomeRevealComplete = useCallback(() => {
    setIsWelcomeRevealComplete(true);
  }, []);

  const header = showInitialWelcomeHeader ? (
    <HeaderBar
      layout="screen"
      className="bg-surface"
      trailing={
        <HeaderTextAction
          label="Omitir"
          accessibilityLabel="Explorar sin perfil"
          onPress={() => {
            void handleSkipInitialProfile();
          }}
          loading={isSkipping}
          className="rounded-pill border border-border-subtle bg-surface-muted px-md"
        />
      }
    />
  ) : showQuestionnaireHeader ? (
    <HeaderModal
      title={LEARN_QUESTIONNAIRE_SCREEN_TITLE}
      onAction={{ close: handleClose }}
    />
  ) : null;

  const bodyContent = (() => {
    if (phase === 'questionnaire' && currentStep) {
      if (isWelcomeStep && currentStep.kind === 'info') {
        return (
          <LearnWelcomeIntro
            step={currentStep}
            showSkipHint={isInitialMode}
            onRevealComplete={handleWelcomeRevealComplete}
          />
        );
      }

      return (
        <>
          {progressIndex !== null ? (
            <LearnProgressHeader
              currentStep={progressIndex}
              totalSteps={LEARN_QUESTIONNAIRE_PROGRESS_TOTAL}
            />
          ) : null}
          <LearnQuestionStepView
            step={currentStep}
            selectedOptionId={selectedOptionId}
            onSelectOption={handleSelectOption}
          />
        </>
      );
    }

    if (phase === 'inconsistency') {
      return <LearnInconsistencyNotice inconsistencies={inconsistencies} />;
    }

    if (phase === 'result' && completedProfile) {
      return <LearnProfileResult profile={completedProfile} />;
    }

    return null;
  })();

  return (
    <ScreenShell
      header={header}
      body={
        <ScrollView
          className="min-h-0 w-full flex-1"
          contentContainerClassName={
            isWelcomeStep
              ? 'flex-grow self-center pb-md'
              : 'flex-grow gap-lg self-center pt-xl'
          }
          contentContainerStyle={{
            width: contentWidth,
            maxWidth: contentWidth,
            paddingHorizontal: Layout.screenPaddingHorizontal,
            paddingTop: isWelcomeStep && !isInitialMode ? insets.top + Spacing.lg : undefined,
            paddingBottom: isWelcomeStep ? Spacing.md : Spacing['3xl'],
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {bodyContent}
        </ScrollView>
      }
      footer={
        <View
          className="self-stretch border-t border-border-subtle bg-surface pt-md"
          style={{
            paddingHorizontal: Layout.screenPaddingHorizontal,
            // ScreenShell already applies safe-area bottom around the footer.
            paddingBottom: Spacing.md,
          }}
        >
          <View className="w-full max-w-full gap-sm self-center">
            {phase === 'inconsistency' ? (
              <>
                <Button
                  variant="ghost"
                  label="Ajustar alguna respuesta"
                  accessibilityLabel="Volver al cuestionario para ajustar alguna respuesta"
                  onPress={handleReviseAnswers}
                  fullWidth
                />
                <Button
                  variant="secondary"
                  label="Ver resumen del perfil"
                  accessibilityLabel="Guardar y ver el resumen del perfil orientativo"
                  onPress={() => {
                    void handleAcceptInconsistency('result');
                  }}
                  loading={isSaving}
                  fullWidth
                />
              </>
            ) : null}

            {showPreviousStep ? (
              <Button
                variant="ghost"
                label="Anterior"
                accessibilityLabel="Ir al paso anterior del cuestionario"
                onPress={handlePreviousStep}
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
                variant="secondary"
                label="Ir al catálogo con filtros sugeridos"
                accessibilityLabel="Ir al catálogo con filtros sugeridos según tu perfil"
                onPress={handleOpenSuggestedCatalog}
                fullWidth
              />
            ) : null}
          </View>
        </View>
      }
    />
  );
}

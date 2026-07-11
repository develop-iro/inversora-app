import type { LearnQuestionStep } from '@/features/learn/constants/learn-questionnaire';
import { trackEvent } from '@/core/analytics/track-event';

const LEARN_SURFACE = 'learn_questionnaire';

type LearnAnalyticsMode = 'initial' | 'voluntary';

type LearnStepAnalyticsPayload = {
  readonly step: LearnQuestionStep;
  readonly stepIndex: number;
  readonly mode: LearnAnalyticsMode;
};

/**
 * Tracks when the user is shown a questionnaire step.
 */
export function trackLearnStepViewed({
  step,
  stepIndex,
  mode,
}: LearnStepAnalyticsPayload): void {
  void trackEvent('learn_step_viewed', LEARN_SURFACE, {
    stepId: step.id,
    stepIndex,
    kind: step.kind,
    mode,
  });
}

/**
 * Tracks when the user selects an answer option.
 */
export function trackLearnStepAnswered(
  step: LearnQuestionStep,
  optionId: string,
  mode: LearnAnalyticsMode,
): void {
  void trackEvent('learn_step_answered', LEARN_SURFACE, {
    stepId: step.id,
    optionId,
    mode,
  });
}

/**
 * Tracks when the user moves back to a previous step.
 */
export function trackLearnStepBack(
  fromStep: LearnQuestionStep,
  toStep: LearnQuestionStep,
  mode: LearnAnalyticsMode,
): void {
  void trackEvent('learn_step_back', LEARN_SURFACE, {
    fromStepId: fromStep.id,
    toStepId: toStep.id,
    mode,
  });
}

/**
 * Tracks when the user starts the questionnaire after the welcome step.
 */
export function trackLearnStarted(mode: LearnAnalyticsMode): void {
  void trackEvent('learn_started', LEARN_SURFACE, { mode });
}

/**
 * Tracks when the user abandons the questionnaire before completion.
 */
export function trackLearnAbandoned(
  lastStepId: string | undefined,
  phase: string,
  mode: LearnAnalyticsMode,
): void {
  void trackEvent('learn_abandoned', LEARN_SURFACE, {
    lastStepId: lastStepId ?? 'unknown',
    phase,
    mode,
  });
}

/**
 * Tracks when inconsistent answers trigger the notice screen.
 */
export function trackLearnInconsistencyShown(inconsistencyCount: number, mode: LearnAnalyticsMode): void {
  void trackEvent('learn_inconsistency_shown', LEARN_SURFACE, {
    inconsistencyCount,
    mode,
  });
}

/**
 * Tracks how the user resolves the inconsistency notice.
 */
export function trackLearnInconsistencyResolved(
  action: 'accept' | 'revise',
  mode: LearnAnalyticsMode,
): void {
  void trackEvent('learn_inconsistency_resolved', LEARN_SURFACE, { action, mode });
}

/**
 * Tracks successful profile completion.
 */
export function trackLearnCompleted(
  riskOrientation: string,
  profileVersion: number,
  mode: LearnAnalyticsMode,
): void {
  void trackEvent('learn_completed', LEARN_SURFACE, {
    riskOrientation,
    profileVersion,
    mode,
  });
}

/**
 * Tracks redirect from the initial profile gate.
 */
export function trackLearnGateRedirect(): void {
  void trackEvent('learn_gate_redirect', LEARN_SURFACE, { source: 'initial_gate' });
}

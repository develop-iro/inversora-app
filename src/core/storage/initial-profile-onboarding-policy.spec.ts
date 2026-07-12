import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isOnboardingExemptRoute,
  shouldRedirectToInitialProfileQuestionnaire,
  shouldUseInitialProfileGateForPlatform,
} from '@/core/storage/initial-profile-onboarding-policy';

describe('initial-profile-onboarding-policy', () => {
  it('enables gate only on ios and android', () => {
    assert.equal(shouldUseInitialProfileGateForPlatform('ios'), true);
    assert.equal(shouldUseInitialProfileGateForPlatform('android'), true);
    assert.equal(shouldUseInitialProfileGateForPlatform('web'), false);
    assert.equal(shouldUseInitialProfileGateForPlatform('windows'), false);
  });

  it('treats learn and legal as exempt routes', () => {
    assert.equal(isOnboardingExemptRoute(['learn']), true);
    assert.equal(isOnboardingExemptRoute(['legal']), true);
    assert.equal(isOnboardingExemptRoute(['(tabs)']), false);
    assert.equal(isOnboardingExemptRoute(['rankings']), false);
  });

  it('redirects when native gate is active and user has no profile', () => {
    assert.equal(
      shouldRedirectToInitialProfileQuestionnaire({
        enabled: true,
        useGate: true,
        isProfileLoading: false,
        isDismissed: false,
        hasProfile: false,
        hasRedirected: false,
        segments: ['(tabs)'],
      }),
      true,
    );
  });

  it('does not redirect on web', () => {
    assert.equal(
      shouldRedirectToInitialProfileQuestionnaire({
        enabled: true,
        useGate: false,
        isProfileLoading: false,
        isDismissed: false,
        hasProfile: false,
        hasRedirected: false,
        segments: ['(tabs)'],
      }),
      false,
    );
  });

  it('does not redirect when profile exists, dismissed, or already redirected', () => {
    const base = {
      enabled: true,
      useGate: true,
      isProfileLoading: false,
      isDismissed: false,
      hasProfile: false,
      hasRedirected: false,
      segments: ['(tabs)'] as const,
    };

    assert.equal(
      shouldRedirectToInitialProfileQuestionnaire({ ...base, hasProfile: true }),
      false,
    );
    assert.equal(
      shouldRedirectToInitialProfileQuestionnaire({ ...base, isDismissed: true }),
      false,
    );
    assert.equal(
      shouldRedirectToInitialProfileQuestionnaire({ ...base, hasRedirected: true }),
      false,
    );
  });

  it('does not redirect on exempt routes', () => {
    assert.equal(
      shouldRedirectToInitialProfileQuestionnaire({
        enabled: true,
        useGate: true,
        isProfileLoading: false,
        isDismissed: false,
        hasProfile: false,
        hasRedirected: false,
        segments: ['learn'],
      }),
      false,
    );

    assert.equal(
      shouldRedirectToInitialProfileQuestionnaire({
        enabled: true,
        useGate: true,
        isProfileLoading: false,
        isDismissed: false,
        hasProfile: false,
        hasRedirected: false,
        segments: ['legal'],
      }),
      false,
    );
  });

  it('waits while profile or dismiss state is loading', () => {
    assert.equal(
      shouldRedirectToInitialProfileQuestionnaire({
        enabled: true,
        useGate: true,
        isProfileLoading: true,
        isDismissed: false,
        hasProfile: false,
        hasRedirected: false,
        segments: ['(tabs)'],
      }),
      false,
    );

    assert.equal(
      shouldRedirectToInitialProfileQuestionnaire({
        enabled: true,
        useGate: true,
        isProfileLoading: false,
        isDismissed: null,
        hasProfile: false,
        hasRedirected: false,
        segments: ['(tabs)'],
      }),
      false,
    );
  });
});

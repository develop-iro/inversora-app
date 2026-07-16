import Constants from 'expo-constants';

import { apiPost } from '@/core/api/client';
import { getAppEnvironment } from '@/core/config/app-environment';
import { deviceIdentityStore } from '@/core/storage/device-identity-store';
import { createProductFeedbackService } from '@/features/feedback/services/submit-product-feedback.factory';

export type { SubmitProductFeedbackInput } from '@/features/feedback/services/submit-product-feedback.factory';

function resolveAppVersion(): string | undefined {
  const version = Constants.expoConfig?.version?.trim();
  return version && version.length > 0 ? version : undefined;
}

const productFeedbackService = createProductFeedbackService({
  apiPost,
  getDeviceId: () => deviceIdentityStore.getDeviceId(),
  getAppEnvironment,
  getAppVersion: resolveAppVersion,
});

/**
 * Sends anonymous product feedback to the Inversora API.
 *
 * @param input - Validated feedback answers from the user.
 */
export const submitProductFeedback = productFeedbackService.submitProductFeedback;

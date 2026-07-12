import Constants from 'expo-constants';

import { apiPost } from '@/core/api/client';
import { getAppEnvironment } from '@/core/config/app-environment';
import type {
  FeedbackClarity,
  FeedbackWouldReturn,
} from '@/features/feedback/schemas/product-feedback.schema';
import { deviceIdentityStore } from '@/core/storage/device-identity-store';

type SubmitProductFeedbackInput = {
  readonly clarity: FeedbackClarity;
  readonly wouldReturn: FeedbackWouldReturn;
  readonly message?: string;
  readonly surface?: string;
};

type SubmitProductFeedbackResponse = {
  readonly accepted: true;
};

function resolveAppVersion(): string | undefined {
  const version = Constants.expoConfig?.version?.trim();
  return version && version.length > 0 ? version : undefined;
}

/**
 * Sends anonymous product feedback to the Inversora API.
 *
 * @param input - Validated feedback answers from the user.
 */
export async function submitProductFeedback(
  input: SubmitProductFeedbackInput,
): Promise<void> {
  const deviceId = await deviceIdentityStore.getDeviceId();
  const message = input.message?.trim();

  await apiPost<SubmitProductFeedbackResponse, Record<string, unknown>>({
    path: '/feedback',
    body: {
      clarity: input.clarity,
      wouldReturn: input.wouldReturn,
      surface: input.surface ?? 'feedback',
      deviceId: deviceId ?? undefined,
      appEnv: getAppEnvironment(),
      appVersion: resolveAppVersion(),
      ...(message && message.length > 0 ? { message } : {}),
    },
  });
}

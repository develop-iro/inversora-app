import type { HttpPostPort } from '@/core/api/http-post-port';
import type { AppEnvironment } from '@/core/config/app-environment';
import type {
  FeedbackClarity,
  FeedbackWouldReturn,
} from '@/features/feedback/schemas/product-feedback.schema';

export type SubmitProductFeedbackInput = {
  readonly clarity: FeedbackClarity;
  readonly wouldReturn: FeedbackWouldReturn;
  readonly message?: string;
  readonly surface?: string;
};

type SubmitProductFeedbackResponse = {
  readonly accepted: true;
};

/**
 * Dependencies for the product-feedback submit service.
 */
export type ProductFeedbackServiceDeps = {
  apiPost: HttpPostPort;
  getDeviceId: () => Promise<string | null>;
  getAppEnvironment: () => AppEnvironment;
  getAppVersion: () => string | undefined;
};

/**
 * Creates the product-feedback submit service without React Native imports.
 *
 * @param deps - HTTP POST port and anonymous device/environment readers.
 */
export function createProductFeedbackService(deps: ProductFeedbackServiceDeps) {
  const { apiPost, getDeviceId, getAppEnvironment, getAppVersion } = deps;

  /**
   * Sends anonymous product feedback to the Inversora API.
   *
   * @param input - Validated feedback answers from the user.
   */
  async function submitProductFeedback(input: SubmitProductFeedbackInput): Promise<void> {
    const deviceId = await getDeviceId();
    const message = input.message?.trim();

    await apiPost<SubmitProductFeedbackResponse, Record<string, unknown>>({
      path: '/feedback',
      body: {
        clarity: input.clarity,
        wouldReturn: input.wouldReturn,
        surface: input.surface ?? 'feedback',
        deviceId: deviceId ?? undefined,
        appEnv: getAppEnvironment(),
        appVersion: getAppVersion(),
        ...(message && message.length > 0 ? { message } : {}),
      },
    });
  }

  return { submitProductFeedback };
}

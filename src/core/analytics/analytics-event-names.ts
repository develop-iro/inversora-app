/** Canonical analytics event names (keep in sync with inversora-api analytics-event-names.ts). */
export const ANALYTICS_EVENT_NAMES = [
  'screen_view',
  'fund_opened',
  'compare_completed',
  'learn_gate_redirect',
  'learn_started',
  'learn_step_viewed',
  'learn_step_answered',
  'learn_step_back',
  'learn_abandoned',
  'learn_inconsistency_shown',
  'learn_inconsistency_resolved',
  'learn_completed',
  'favorite_toggled',
  'calculator_run',
  'perf_mark',
] as const;

/** Analytics event name union. */
export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

/** Non-PII property bag attached to analytics events. */
export type AnalyticsEventProperties = Readonly<Record<string, string | number | boolean>>;

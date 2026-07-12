/**
 * UX threshold before replacing skeleton loaders with a slow-request notice.
 *
 * Aligned with HU-42 surface perf marks: educational surfaces should not show
 * indefinite skeletons when the API exceeds a tolerable wait (~8 s on slow dev/staging).
 */
export const SLOW_REQUEST_NOTICE_THRESHOLD_MS = 8_000;

/** Title shown when a loading surface exceeds {@link SLOW_REQUEST_NOTICE_THRESHOLD_MS}. */
export const SLOW_REQUEST_NOTICE_TITLE = 'El servidor no responde';

/** Supporting copy for slow-request notices (educational, non-alarming). */
export const SLOW_REQUEST_NOTICE_MESSAGE =
  'La carga está tardando más de lo habitual. Comprueba tu conexión o inténtalo de nuevo en unos segundos.';

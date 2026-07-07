/**
 * Generates a stable-enough id for overlay entries.
 */
export function createOverlayId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

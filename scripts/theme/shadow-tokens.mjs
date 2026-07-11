import { withAlpha } from './color-utils.mjs';

/**
 * Shadow presets aligned with `src/shared/theme/shadows.ts`.
 * Values are CSS `box-shadow` strings using the theme shadow color.
 *
 * @param {string} shadowColor
 * @returns {Record<string, string>}
 */
export function buildShadowCssVars(shadowColor) {
  return {
    '--shadow-card': `0 1px 6px ${withAlpha(shadowColor, 0.06)}`,
    '--shadow-elevated': `0 10px 28px ${withAlpha(shadowColor, 0.16)}`,
    '--shadow-focus-aura': `0 8px 18px ${withAlpha(shadowColor, 0.036)}`,
    '--shadow-tooltip': `0 2px 6px ${withAlpha(shadowColor, 0.08)}`,
    '--shadow-segment-selected': `0 1px 4px ${withAlpha(shadowColor, 0.06)}`,
    '--shadow-hero-text': `0 1px 2px ${withAlpha(shadowColor, 0.08)}`,
  };
}

/**
 * Tailwind boxShadow map referencing CSS variables.
 *
 * @returns {Record<string, string>}
 */
export function buildTailwindBoxShadow() {
  return {
    card: 'var(--shadow-card)',
    elevated: 'var(--shadow-elevated)',
    'focus-aura': 'var(--shadow-focus-aura)',
    tooltip: 'var(--shadow-tooltip)',
    'segment-selected': 'var(--shadow-segment-selected)',
    'hero-text': 'var(--shadow-hero-text)',
  };
}

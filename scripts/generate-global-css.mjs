import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildSemanticColors, semanticKeyToCssVar } from './theme/semantic-colors.mjs';
import { buildShadowCssVars } from './theme/shadow-tokens.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, '..');
const PALETTE_JSON_PATH = join(REPO_ROOT, 'src/shared/theme/palette.primitives.json');
const SPACING_JSON_PATH = join(REPO_ROOT, 'src/shared/theme/spacing.primitives.json');
const GLOBAL_CSS_PATH = join(REPO_ROOT, 'src/global.css');

/** Assumed root font-size on web when converting dp grid units to rem. */
export const WEB_ROOT_FONT_SIZE_PX = 16;

/** Web font stacks — keep aligned with `FontFamily` in `src/shared/theme/tokens.ts`. */
export const WEB_FONT_VARIABLES = {
  '--font-display': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
  '--font-accent': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
  '--font-mono':
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
  '--font-serif': 'Georgia, "Times New Roman", serif',
  '--font-rounded':
    '"SF Pro Rounded", "Hiragino Maru Gothic ProN", Meiryo, "MS PGothic", sans-serif',
};

/**
 * Converts a palette or theme key in camelCase to kebab-case.
 *
 * @param {string} key
 * @returns {string}
 */
export function camelCaseToKebab(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Converts a palette key in camelCase to a CSS custom property name.
 *
 * @param {string} paletteKey
 * @returns {string}
 */
export function paletteKeyToCssVar(paletteKey) {
  return `--color-${camelCaseToKebab(paletteKey)}`;
}

/**
 * Normalizes hex colors to lowercase for stable CSS output.
 *
 * @param {string} hexColor
 * @returns {string}
 */
export function normalizeHexColor(hexColor) {
  return hexColor.toLowerCase();
}

/**
 * Reads palette primitives from the canonical JSON file.
 *
 * @returns {Record<string, string>}
 */
export function readPalettePrimitives() {
  const raw = readFileSync(PALETTE_JSON_PATH, 'utf8');
  return JSON.parse(raw);
}

/**
 * Reads spacing primitives from the canonical JSON file.
 *
 * @returns {{ unitDp: number, scale: Record<string, number> }}
 */
export function readSpacingPrimitives() {
  const raw = readFileSync(SPACING_JSON_PATH, 'utf8');
  return JSON.parse(raw);
}

/**
 * Converts a spacing token key to a CSS custom property name.
 *
 * @param {string} spacingKey
 * @returns {string}
 */
export function spacingKeyToCssVar(spacingKey) {
  return `--spacing-${spacingKey}`;
}

/**
 * Builds CSS lines for the spacing scale from primitives.
 *
 * @param {{ unitDp: number, scale: Record<string, number> }} [spacing]
 * @returns {string[]}
 */
export function generateSpacingCssLines(spacing = readSpacingPrimitives()) {
  const unitRem = spacing.unitDp / WEB_ROOT_FONT_SIZE_PX;
  const scaleLines = Object.entries(spacing.scale)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey, undefined, { numeric: true }))
    .map(
      ([key, multiplier]) =>
        `  ${spacingKeyToCssVar(key)}: calc(var(--spacing-unit) * ${multiplier});`,
    );

  return [`  --spacing-unit: ${unitRem}rem;`, ...scaleLines];
}

/**
 * Builds CSS variable lines for a semantic color map.
 *
 * @param {Record<string, string>} semanticColors
 * @returns {string[]}
 */
export function generateSemanticColorCssLines(semanticColors) {
  return Object.entries(semanticColors)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `  ${semanticKeyToCssVar(key)}: ${value};`);
}

/**
 * Builds the `global.css` document from palette primitives and web font variables.
 *
 * @param {Record<string, string>} [palette]
 * @param {{ unitDp: number, scale: Record<string, number> }} [spacing]
 * @param {{ light: Record<string, string>, dark: Record<string, string> }} [semantic]
 * @returns {string}
 */
export function generateGlobalCssContent(
  palette = readPalettePrimitives(),
  spacing = readSpacingPrimitives(),
  semantic = buildSemanticColors(palette),
) {
  const paletteLines = Object.entries(palette)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `  ${paletteKeyToCssVar(key)}: ${normalizeHexColor(value)};`);

  const fontLines = Object.entries(WEB_FONT_VARIABLES).map(
    ([cssVar, fontStack]) => `  ${cssVar}: ${fontStack};`,
  );

  const spacingLines = generateSpacingCssLines(spacing);
  const lightSemanticLines = generateSemanticColorCssLines(semantic.light);
  const darkSemanticLines = generateSemanticColorCssLines(semantic.dark);
  const lightShadowLines = Object.entries(buildShadowCssVars(semantic.light.shadow)).map(
    ([cssVar, value]) => `  ${cssVar}: ${value};`,
  );
  const darkShadowLines = Object.entries(buildShadowCssVars(semantic.dark.shadow)).map(
    ([cssVar, value]) => `  ${cssVar}: ${value};`,
  );

  return `/* Generated by scripts/generate-global-css.mjs — do not edit manually. */
/* Sources: palette.primitives.json, spacing.primitives.json, semantic-colors (colors.ts) */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Brand palette */
${paletteLines.join('\n')}

  /* Semantic colors (light) */
${lightSemanticLines.join('\n')}

  /* Shadows (light) */
${lightShadowLines.join('\n')}

  /* Spacing (web) — base unit × multiplier; native uses SPACING_UNIT in tokens */
${spacingLines.join('\n')}

  /* Typography (web) */
${fontLines.join('\n')}
}

.dark {
  /* Semantic colors (dark) */
${darkSemanticLines.join('\n')}

  /* Shadows (dark) */
${darkShadowLines.join('\n')}
}

/*
 * Skeleton pulse — web only (native uses Animated in skeleton-bone.tsx).
 * Duration must stay aligned with SKELETON_SHIMMER_DURATION_MS in skeleton-tokens.ts.
 */
@keyframes skeleton-bone-pulse {
  0%,
  100% {
    background-color: var(--color-skeleton-bone);
  }

  50% {
    background-color: var(--color-skeleton-shimmer-shadow);
  }
}

.skeleton-bone-pulse {
  background-color: var(--color-skeleton-bone);
  animation: skeleton-bone-pulse 1400ms ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-bone-pulse {
    animation: none;
    background-color: var(--color-skeleton-bone);
  }
}
`;
}

/**
 * Writes `src/global.css` from the canonical palette JSON.
 */
export function generateGlobalCss() {
  const content = generateGlobalCssContent();
  writeFileSync(GLOBAL_CSS_PATH, content, 'utf8');
  return GLOBAL_CSS_PATH;
}

const isDirectExecution =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectExecution) {
  const outputPath = generateGlobalCss();
  console.log(`Wrote ${outputPath}`);
}

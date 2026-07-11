import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  camelCaseToKebab,
  readPalettePrimitives,
  readSpacingPrimitives,
} from './generate-global-css.mjs';
import { buildSemanticColors, semanticKeyToCssVar } from './theme/semantic-colors.mjs';
import { buildTailwindBoxShadow } from './theme/shadow-tokens.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, '..');
const TAILWIND_CONFIG_PATH = join(REPO_ROOT, 'tailwind.config.js');

/** Keep aligned with `Radius` in `src/shared/theme/tokens.ts`. */
export const RADIUS_TOKENS = {
  hairline: 1,
  xs: 3,
  tabBar: 28,
  image: 6,
  card: 12,
  field: 16,
  chip: 16,
  pill: 56,
  full: 9999,
};

/**
 * Keep aligned with `Typography` in `src/shared/theme/tokens.ts`.
 * Tailwind fontSize tuples: [size, { lineHeight, letterSpacing, ... }].
 */
export const TYPOGRAPHY_TOKENS = {
  hero: ['56px', { lineHeight: '58px', letterSpacing: '-1.1px' }],
  sectionTitle: ['20px', { lineHeight: '25px', letterSpacing: '-0.2px' }],
  navTitle: ['17px', { lineHeight: '22px' }],
  body: ['16px', { lineHeight: '24px' }],
  bodyBold: ['17px', { lineHeight: '24px' }],
  button: ['15px', { lineHeight: '20px' }],
  caption: ['13px', { lineHeight: '19px' }],
  metaLabel: ['11px', { lineHeight: '15px', letterSpacing: '0.88px' }],
  chip: ['16px', { lineHeight: '21px', letterSpacing: '-0.16px' }],
  cardTitle: ['24px', { lineHeight: '30px', letterSpacing: '-0.36px' }],
  tab: ['11px', { lineHeight: '15px' }],
  legal: ['12px', { lineHeight: '17px' }],
  segment: ['14px', { lineHeight: '18px' }],
  micro: ['10px', { lineHeight: '13px', letterSpacing: '0.48px' }],
  brandWordmark: ['24px', { lineHeight: '28px', letterSpacing: '-0.3px' }],
  brandWordmarkSplash: ['40px', { lineHeight: '44px', letterSpacing: '-0.4px' }],
  brandWordmarkCompact: ['22px', { lineHeight: '26px', letterSpacing: '-0.3px' }],
  brandSectionTitle: ['22px', { lineHeight: '28px', letterSpacing: '-0.3px' }],
  code: ['12px', { lineHeight: '16px' }],
  chartAxis: ['10px', { lineHeight: '12px' }],
  chartLabel: ['11px', { lineHeight: '14px' }],
  captionDense: ['11px', { lineHeight: '14px' }],
  listMeta: ['12px', { lineHeight: '16px' }],
  scoreDisplay: ['18px', { lineHeight: '24px', letterSpacing: '-0.3px' }],
  scoreHero: ['22px', { lineHeight: '26px', letterSpacing: '-0.24px' }],
  scoreHeroCompact: ['26px', { lineHeight: '30px' }],
  tabLabel: ['11px', { lineHeight: '16px' }],
  tabLabelActive: ['11px', { lineHeight: '16px' }],
  inputNumeric: ['16px', { lineHeight: '22px' }],
  iconSymbolSm: ['16px', { lineHeight: '18px' }],
  iconSymbolMd: ['18px', { lineHeight: '20px' }],
};

/**
 * Builds Tailwind color map from palette primitives (kebab-case keys).
 *
 * @param {Record<string, string>} palette
 * @returns {Record<string, string>}
 */
export function buildTailwindColors(palette = readPalettePrimitives()) {
  return Object.fromEntries(
    Object.entries(palette).map(([key, value]) => [camelCaseToKebab(key), value.toLowerCase()]),
  );
}

/**
 * Builds Tailwind spacing map in dp/px from spacing primitives.
 *
 * @param {{ unitDp: number, scale: Record<string, number> }} [spacing]
 * @returns {Record<string, string>}
 */
export function buildTailwindSpacing(spacing = readSpacingPrimitives()) {
  return Object.fromEntries(
    Object.entries(spacing.scale).map(([key, multiplier]) => [
      key,
      `${spacing.unitDp * multiplier}px`,
    ]),
  );
}

/**
 * Serializes a JS object literal for generated config output.
 *
 * @param {unknown} value
 * @param {number} [indent]
 * @returns {string}
 */
function serializeLiteral(value, indent = 0) {
  const pad = '  '.repeat(indent);
  const childPad = '  '.repeat(indent + 1);

  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 2 && typeof value[1] === 'object' && !Array.isArray(value[1])) {
      const [fontSize, options] = value;
      const optionEntries = Object.entries(options)
        .map(([key, optionValue]) => `${key}: ${JSON.stringify(optionValue)}`)
        .join(', ');
      return `[${JSON.stringify(fontSize)}, { ${optionEntries} }]`;
    }

    return `[${value.map((entry) => serializeLiteral(entry, indent + 1)).join(', ')}]`;
  }

  const entries = Object.entries(value)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey, undefined, { numeric: true }))
    .map(([key, entryValue]) => `${childPad}${JSON.stringify(key)}: ${serializeLiteral(entryValue, indent + 1)},`)
    .join('\n');

  return `{\n${entries}\n${pad}}`;
}

/**
 * Builds Tailwind semantic color map referencing CSS variables.
 *
 * @param {{ light: Record<string, string> }} semantic
 * @returns {Record<string, string>}
 */
export function buildTailwindSemanticColors(semantic = buildSemanticColors()) {
  return Object.fromEntries(
    Object.keys(semantic.light).map((key) => {
      const kebab = camelCaseToKebab(key);
      return [kebab, `var(${semanticKeyToCssVar(key)})`];
    }),
  );
}

/**
 * Builds `tailwind.config.js` content from canonical theme primitives.
 *
 * @param {Record<string, string>} [palette]
 * @param {{ unitDp: number, scale: Record<string, number> }} [spacing]
 * @param {{ light: Record<string, string>, dark: Record<string, string> }} [semantic]
 * @returns {string}
 */
export function generateTailwindConfigContent(
  palette = readPalettePrimitives(),
  spacing = readSpacingPrimitives(),
  semantic = buildSemanticColors(palette),
) {
  const themeExtend = {
    colors: {
      ...buildTailwindColors(palette),
      ...buildTailwindSemanticColors(semantic),
    },
    spacing: buildTailwindSpacing(spacing),
    borderRadius: Object.fromEntries(
      Object.entries(RADIUS_TOKENS).map(([key, value]) => [key, `${value}px`]),
    ),
    boxShadow: buildTailwindBoxShadow(),
    fontFamily: {
      display: ['DMSans_400Regular'],
      'display-bold': ['DMSans_700Bold'],
      mono: ['ui-monospace', 'monospace'],
      'brand-serif': ['Georgia', 'Times New Roman', 'serif'],
    },
    fontSize: TYPOGRAPHY_TOKENS,
  };

  return `/* Generated by scripts/generate-tailwind-config.mjs — do not edit manually. */
/* Sources: palette.primitives.json, spacing.primitives.json, tokens.ts (radius, typography), semantic-colors */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: ${serializeLiteral(themeExtend, 2)},
  },
  plugins: [],
};
`;
}

/**
 * Writes `tailwind.config.js` from canonical theme primitives.
 */
export function generateTailwindConfig() {
  const content = generateTailwindConfigContent();
  writeFileSync(TAILWIND_CONFIG_PATH, content, 'utf8');
  return TAILWIND_CONFIG_PATH;
}

const isDirectExecution =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectExecution) {
  const outputPath = generateTailwindConfig();
  console.log(`Wrote ${outputPath}`);
}

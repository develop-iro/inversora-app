import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

import {
  generateGlobalCssContent,
  generateSpacingCssLines,
  paletteKeyToCssVar,
  readPalettePrimitives,
  readSpacingPrimitives,
  spacingKeyToCssVar,
} from './generate-global-css.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, '..');
const GLOBAL_CSS_PATH = join(REPO_ROOT, 'src/global.css');

describe('paletteKeyToCssVar', () => {
  it('converts camelCase palette keys to kebab-case CSS variables', () => {
    assert.equal(paletteKeyToCssVar('primaryTeal'), '--color-primary-teal');
    assert.equal(paletteKeyToCssVar('softTealBackground'), '--color-soft-teal-background');
    assert.equal(paletteKeyToCssVar('chartInterestTeal'), '--color-chart-interest-teal');
  });
});

describe('spacingKeyToCssVar', () => {
  it('converts spacing keys to CSS variables', () => {
    assert.equal(spacingKeyToCssVar('xs'), '--spacing-xs');
    assert.equal(spacingKeyToCssVar('2xl'), '--spacing-2xl');
  });
});

describe('generateSpacingCssLines', () => {
  it('emits base unit and calc() multipliers for each spacing token', () => {
    const spacing = readSpacingPrimitives();
    const lines = generateSpacingCssLines(spacing);

    assert.match(lines.join('\n'), /--spacing-unit: 0\.25rem;/);
    for (const [key, multiplier] of Object.entries(spacing.scale)) {
      assert.match(
        lines.join('\n'),
        new RegExp(`${spacingKeyToCssVar(key)}: calc\\(var\\(--spacing-unit\\) \\* ${multiplier}\\);`),
      );
    }
  });
});

describe('generateGlobalCssContent', () => {
  it('emits one CSS variable per palette primitive', () => {
    const palette = readPalettePrimitives();
    const css = generateGlobalCssContent(palette);

    for (const [key, value] of Object.entries(palette)) {
      assert.match(css, new RegExp(`${paletteKeyToCssVar(key)}: ${value.toLowerCase()};`));
    }
  });

  it('includes web font variables', () => {
    const css = generateGlobalCssContent();
    assert.match(css, /--font-display:/);
    assert.match(css, /--font-mono:/);
  });

  it('includes spacing CSS variables', () => {
    const css = generateGlobalCssContent();
    assert.match(css, /--spacing-unit: 0\.25rem;/);
    assert.match(css, /--spacing-lg: calc\(var\(--spacing-unit\) \* 4\);/);
  });

  it('includes NativeWind tailwind directives', () => {
    const css = generateGlobalCssContent();
    assert.match(css, /@tailwind base;/);
    assert.match(css, /@tailwind components;/);
    assert.match(css, /@tailwind utilities;/);
  });

  it('includes semantic color CSS variables for light and dark', () => {
    const css = generateGlobalCssContent();
    assert.match(css, /--color-surface:/);
    assert.match(css, /--color-background:/);
    assert.match(css, /\.dark \{[\s\S]*--color-surface:/);
  });

  it('includes shadow CSS variables', () => {
    const css = generateGlobalCssContent();
    assert.match(css, /--shadow-card:/);
    assert.match(css, /\.dark \{[\s\S]*--shadow-elevated:/);
  });
});

describe('committed global.css', () => {
  it('matches the generator output', () => {
    const expected = generateGlobalCssContent();
    const committed = readFileSync(GLOBAL_CSS_PATH, 'utf8');
    assert.equal(committed, expected);
  });
});

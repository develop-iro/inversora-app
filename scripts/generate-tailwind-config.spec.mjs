import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

import { camelCaseToKebab, readPalettePrimitives } from './generate-global-css.mjs';
import {
  buildTailwindColors,
  buildTailwindSpacing,
  generateTailwindConfigContent,
} from './generate-tailwind-config.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, '..');
const TAILWIND_CONFIG_PATH = join(REPO_ROOT, 'tailwind.config.js');

describe('buildTailwindColors', () => {
  it('maps palette primitives to kebab-case Tailwind color keys', () => {
    const colors = buildTailwindColors({
      primaryTeal: '#00BFA6',
      softTealBackground: '#EAF8F6',
    });

    assert.equal(colors['primary-teal'], '#00bfa6');
    assert.equal(colors['soft-teal-background'], '#eaf8f6');
  });
});

describe('buildTailwindSpacing', () => {
  it('resolves spacing tokens to pixel values from unit multipliers', () => {
    const spacing = buildTailwindSpacing({
      unitDp: 4,
      scale: { xs: 1, lg: 4 },
    });

    assert.equal(spacing.xs, '4px');
    assert.equal(spacing.lg, '16px');
  });
});

describe('generateTailwindConfigContent', () => {
  it('includes nativewind preset and src content paths', () => {
    const config = generateTailwindConfigContent();

    assert.match(config, /presets: \[require\('nativewind\/preset'\)\]/);
    assert.match(config, /content: \['\.\/src\/\*\*\/\*\.\{js,jsx,ts,tsx\}'\]/);
  });

  it('emits one color entry per palette primitive', () => {
    const palette = readPalettePrimitives();
    const config = generateTailwindConfigContent(palette);

    for (const key of Object.keys(palette)) {
      assert.match(config, new RegExp(`"${camelCaseToKebab(key)}":`));
    }
  });
});

describe('committed tailwind.config.js', () => {
  it('matches the generator output', () => {
    const expected = generateTailwindConfigContent();
    const committed = readFileSync(TAILWIND_CONFIG_PATH, 'utf8');
    assert.equal(committed, expected);
  });
});

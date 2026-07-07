import spacingPrimitives from '@/shared/theme/spacing.primitives.json';

type SpacingScale = typeof spacingPrimitives.scale;

/**
 * Base grid unit for layout spacing (4dp on native; 0.25rem on web when root font-size is 16px).
 * All `Spacing` tokens are multiples of this value — see `spacing.primitives.json`.
 */
export const SPACING_UNIT = spacingPrimitives.unitDp;

/**
 * Builds pixel/dp spacing tokens from unit multipliers.
 *
 * @param scale - Named multipliers relative to {@link SPACING_UNIT}.
 * @returns Readonly map of token name to resolved spacing value.
 */
function buildSpacing(scale: SpacingScale): { readonly [K in keyof SpacingScale]: number } {
  return Object.fromEntries(
    Object.entries(scale).map(([key, multiplier]) => [key, SPACING_UNIT * multiplier]),
  ) as { readonly [K in keyof SpacingScale]: number };
}

/**
 * Spacing scale derived from {@link SPACING_UNIT} and `spacing.primitives.json`.
 * Synced to CSS custom properties in `src/global.css` via `npm run generate:global-css`.
 */
export const Spacing = buildSpacing(spacingPrimitives.scale);

export type SpacingToken = keyof typeof Spacing;

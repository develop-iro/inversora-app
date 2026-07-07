import palettePrimitives from '@/shared/theme/palette.primitives.json';

/**
 * Inversora brand primitives.
 * Source: `palette.primitives.json` (synced to `src/global.css` via `npm run generate:global-css`).
 * @see https://www.figma.com/design/S7oabGJ5AQJh52ITEVaH8G/Inversora
 */
export const palette = palettePrimitives;

export type PaletteColor = keyof typeof palette;

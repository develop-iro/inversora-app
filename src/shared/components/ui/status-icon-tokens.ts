import { z } from 'zod';

/** Semantic status variants for generic status icons. */
export const statusIconVariantSchema = z.enum(['success', 'error', 'warning']);

export type StatusIconVariant = z.infer<typeof statusIconVariantSchema>;

/** Filled background colors for each status icon variant. */
export const STATUS_ICON_COLORS: Record<StatusIconVariant, string> = {
  success: '#22C55E',
  error: '#EF4444',
  warning: '#FACC15',
};

/** Foreground glyph color drawn on top of the status shape. */
export const STATUS_ICON_GLYPH_COLOR = '#FFFFFF';

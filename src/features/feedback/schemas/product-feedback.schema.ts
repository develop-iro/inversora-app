import { z } from 'zod';

/** Whether the user found the experience clear. */
export const FEEDBACK_CLARITY_VALUES = ['yes', 'somewhat', 'no'] as const;

/** Whether the user would use Inversora again. */
export const FEEDBACK_WOULD_RETURN_VALUES = ['yes', 'maybe', 'no'] as const;

export type FeedbackClarity = (typeof FEEDBACK_CLARITY_VALUES)[number];

export type FeedbackWouldReturn = (typeof FEEDBACK_WOULD_RETURN_VALUES)[number];

export const productFeedbackInputSchema = z.object({
  clarity: z.enum(FEEDBACK_CLARITY_VALUES, {
    message: 'Indica si la experiencia te resultó clara.',
  }),
  wouldReturn: z.enum(FEEDBACK_WOULD_RETURN_VALUES, {
    message: 'Indica si volverías a usar Inversora.',
  }),
  message: z.string().trim().max(2000, 'El comentario no puede superar 2000 caracteres.').optional(),
});

export type ProductFeedbackInput = z.infer<typeof productFeedbackInputSchema>;

export type FeedbackOption<T extends string> = {
  readonly value: T;
  readonly label: string;
};

export const FEEDBACK_CLARITY_OPTIONS: readonly FeedbackOption<FeedbackClarity>[] = [
  { value: 'yes', label: 'Sí' },
  { value: 'somewhat', label: 'Más o menos' },
  { value: 'no', label: 'No' },
];

export const FEEDBACK_WOULD_RETURN_OPTIONS: readonly FeedbackOption<FeedbackWouldReturn>[] = [
  { value: 'yes', label: 'Sí' },
  { value: 'maybe', label: 'Tal vez' },
  { value: 'no', label: 'No' },
];

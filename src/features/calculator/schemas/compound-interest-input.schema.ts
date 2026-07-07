import { z } from 'zod';

/**
 * Zod schema for compound-interest calculator form values.
 */
export const compoundInterestInputSchema = z.object({
  initialBalance: z
    .number()
    .min(0, 'El balance inicial no puede ser negativo.')
    .max(10_000_000, 'Introduce un balance inicial más realista.'),
  periodicDeposit: z
    .number()
    .min(0, 'La aportación no puede ser negativa.')
    .max(100_000, 'Introduce una aportación más realista.'),
  depositFrequency: z.enum(['monthly', 'yearly']),
  depositTiming: z.enum(['start', 'end']),
  annualRatePercent: z
    .number()
    .min(-20, 'El tipo anual parece demasiado bajo para una simulación educativa.')
    .max(30, 'El tipo anual parece demasiado alto para una simulación educativa.'),
  durationYears: z
    .number()
    .int('La duración debe ser un número entero de años.')
    .min(1, 'La duración mínima es 1 año.')
    .max(60, 'La duración máxima es 60 años.'),
});

export type CompoundInterestInputSchema = z.infer<typeof compoundInterestInputSchema>;

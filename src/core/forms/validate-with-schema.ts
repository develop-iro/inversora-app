import { z } from 'zod';

/**
 * Maps a Zod object schema failure to per-field error messages.
 */
export function mapZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];

    if (typeof key !== 'string' || fieldErrors[key]) {
      continue;
    }

    fieldErrors[key] = issue.message;
  }

  return fieldErrors;
}

/**
 * Validates values against a Zod schema and returns field errors when invalid.
 */
export function validateWithSchema<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  values: z.input<TSchema>,
):
  | { success: true; data: z.output<TSchema> }
  | { success: false; fieldErrors: Record<string, string> } {
  const result = schema.safeParse(values);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    fieldErrors: mapZodFieldErrors(result.error),
  };
}

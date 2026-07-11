/**
 * Joins Tailwind class names, filtering falsy values.
 */
export function cn(...classes: readonly (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

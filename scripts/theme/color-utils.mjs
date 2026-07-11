/**
 * Converts a hex color to an `rgba()` string with the given alpha.
 *
 * @param {string} hexColor
 * @param {number} alpha
 * @returns {string}
 */
export function withAlpha(hexColor, alpha) {
  const normalized = hexColor.trim().replace('#', '');
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((channel) => channel + channel)
          .join('')
      : normalized;

  if (expanded.length !== 6) {
    throw new Error(`withAlpha expects a hex color, received "${hexColor}"`);
  }

  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));

  return `rgba(${red}, ${green}, ${blue}, ${clampedAlpha})`;
}

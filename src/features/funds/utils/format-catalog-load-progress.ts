export type FormatCatalogLoadProgressOptions = {
  readonly isRefreshing?: boolean;
};

/**
 * Formats the inline catalog pagination label shown above the fund grid.
 *
 * Returns null when there is nothing meaningful to show (fully loaded or idle).
 */
export function formatCatalogLoadProgress(
  loadedCount: number,
  totalCount: number | null,
  options?: FormatCatalogLoadProgressOptions,
): string | null {
  if (options?.isRefreshing) {
    return null;
  }

  if (totalCount == null) {
    return null;
  }

  if (loadedCount >= totalCount) {
    return null;
  }

  const fundWord = totalCount === 1 ? 'fondo' : 'fondos';
  return `${loadedCount.toLocaleString('es-ES')} de ${totalCount.toLocaleString('es-ES')} ${fundWord}`;
}

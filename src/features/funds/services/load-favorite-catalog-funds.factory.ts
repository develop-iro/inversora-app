import type { CatalogFund, FundDetail } from '@/core/domain/catalog';
import { mapFundDetailToCatalogFund } from '@/features/funds/utils/map-fund-detail-to-catalog';

/**
 * Dependencies for the favorites catalog hydration service.
 */
export type FavoriteCatalogFundsServiceDeps = {
  getFundByIsin: (isin: string, signal?: AbortSignal) => Promise<FundDetail | null>;
};

/**
 * Creates the favorites catalog hydration service without React Native imports.
 *
 * @param deps - Fund detail loader port.
 */
export function createFavoriteCatalogFundsService(deps: FavoriteCatalogFundsServiceDeps) {
  const { getFundByIsin } = deps;

  /**
   * Loads catalog-shaped cards for favorite ISINs, preserving selection order.
   *
   * Missing or failing ISINs are skipped so the favorites list stays usable.
   *
   * @param isins - Favorite ISINs in display order.
   * @param signal - Optional abort signal forwarded to each detail fetch.
   */
  async function loadFavoriteCatalogFunds(
    isins: readonly string[],
    signal?: AbortSignal,
  ): Promise<CatalogFund[]> {
    if (isins.length === 0) {
      return [];
    }

    const details = await Promise.all(
      isins.map(async (isin) => {
        try {
          return await getFundByIsin(isin, signal);
        } catch {
          return null;
        }
      }),
    );

    return details
      .filter((detail): detail is FundDetail => detail !== null)
      .map((detail) => mapFundDetailToCatalogFund(detail));
  }

  return { loadFavoriteCatalogFunds };
}

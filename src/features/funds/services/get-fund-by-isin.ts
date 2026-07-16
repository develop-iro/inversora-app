import { apiGet } from '@/core/api/client';
import {
  allowsMockFallback,
  shouldUseMockData,
} from '@/core/config/app-environment';
import { createFundByIsinService } from '@/features/funds/services/get-fund-by-isin.factory';

export { invalidateFundDetailCache } from '@/features/funds/services/get-fund-by-isin.factory';

const fundByIsinService = createFundByIsinService({
  apiGet,
  shouldUseMockData,
  allowsMockFallback,
});

/**
 * Fetches the aggregated fund detail for a given ISIN from `GET /funds/:isin`.
 *
 * @param isin - Fund ISIN (case-insensitive).
 * @param signal - Optional abort signal for in-flight requests.
 */
export const getFundByIsin = fundByIsinService.getFundByIsin;

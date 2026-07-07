import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { shouldUseMockData } from '@/core/config/app-environment';
import { FundCatalogSearchSuggestions } from '@/features/funds/components/fund-catalog-search-suggestions';
import { CATALOG_FUNDS_MOCK } from '@/features/funds/mocks/catalog-funds-mock';
import { searchCatalogFunds } from '@/features/funds/services/get-funds';
import {
  CATALOG_SEARCH_DEBOUNCE_MS,
  CATALOG_SUGGESTIONS_MIN_QUERY_LENGTH,
  getFundSearchSuggestions,
  type FundSearchSuggestion,
} from '@/features/funds/utils/fund-search';
import { SearchField } from '@/shared/components/ui';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { Spacing } from '@/shared/theme/theme';

const BLUR_DISMISS_DELAY_MS = 160;

export type FundCatalogSearchFieldProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

function mapCatalogFundsToSuggestions(
  funds: readonly { isin: string; name: string; categoryLabel?: string }[],
): FundSearchSuggestion[] {
  return funds.map((fund) => ({
    isin: fund.isin,
    name: fund.name,
    categoryLabel: fund.categoryLabel ?? '',
  }));
}

export function FundCatalogSearchField({
  query,
  onQueryChange,
}: FundCatalogSearchFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState<FundSearchSuggestion[]>([]);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const debouncedQuery = useDebouncedValue(query, CATALOG_SEARCH_DEBOUNCE_MS);
  const trimmedDebouncedQuery = debouncedQuery.trim();
  const queryMeetsMinimum =
    trimmedDebouncedQuery.length >= CATALOG_SUGGESTIONS_MIN_QUERY_LENGTH;

  const mockSuggestions = useMemo(() => {
    if (!shouldUseMockData() || !queryMeetsMinimum) {
      return [];
    }

    return getFundSearchSuggestions(CATALOG_FUNDS_MOCK, debouncedQuery);
  }, [debouncedQuery, queryMeetsMinimum]);

  useEffect(() => {
    if (shouldUseMockData() || !queryMeetsMinimum) {
      return;
    }

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    void searchCatalogFunds(trimmedDebouncedQuery, { signal: controller.signal })
      .then((results) => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setApiSuggestions(mapCatalogFundsToSuggestions(results));
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setApiSuggestions([]);
      });

    return () => {
      controller.abort();
    };
  }, [queryMeetsMinimum, trimmedDebouncedQuery]);

  const suggestions = shouldUseMockData()
    ? mockSuggestions
    : queryMeetsMinimum
      ? apiSuggestions
      : [];

  const showSuggestions =
    isFocused &&
    query.trim().length >= CATALOG_SUGGESTIONS_MIN_QUERY_LENGTH &&
    suggestions.length > 0;

  const clearBlurTimeout = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  }, []);

  const handleFocus = useCallback(() => {
    clearBlurTimeout();
    setIsFocused(true);
  }, [clearBlurTimeout]);

  const handleBlur = useCallback(() => {
    clearBlurTimeout();
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, BLUR_DISMISS_DELAY_MS);
  }, [clearBlurTimeout]);

  const handleSelectSuggestion = useCallback(
    (suggestion: FundSearchSuggestion) => {
      clearBlurTimeout();
      onQueryChange(suggestion.name);
      setIsFocused(false);
    },
    [clearBlurTimeout, onQueryChange],
  );

  return (
    <View style={styles.wrapper}>
      <SearchField
        variant="plain"
        accessibilityLabel="Buscar fondos por nombre o ISIN"
        placeholder="Buscar por nombre o ISIN"
        value={query}
        onChangeText={onQueryChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {showSuggestions ? (
        <View style={styles.suggestionsSlot} pointerEvents="box-none">
          <FundCatalogSearchSuggestions
            suggestions={suggestions}
            onSelect={handleSelectSuggestion}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 20,
  },
  suggestionsSlot: {
    marginTop: Spacing.sm,
  },
});

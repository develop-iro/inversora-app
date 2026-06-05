import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { FundCatalogSearchSuggestions } from '@/features/funds/components/fund-catalog-search-suggestions';
import {
  CATALOG_SEARCH_DEBOUNCE_MS,
  CATALOG_SUGGESTIONS_MIN_QUERY_LENGTH,
  getFundSearchSuggestions,
  type FundSearchSuggestion,
} from '@/features/funds/utils/fund-search';
import { SearchField } from '@/shared/components/ui';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { Spacing } from '@/shared/theme/theme';

const PLACEHOLDER_SUGGESTIONS = ['MSCI World', 'IE00B4L5Y983', 'S&P 500'] as const;
const BLUR_DISMISS_DELAY_MS = 160;

export type FundCatalogSearchFieldProps = {
  query: string;
  catalog: CatalogFund[];
  onQueryChange: (query: string) => void;
};

export function FundCatalogSearchField({
  query,
  catalog,
  onQueryChange,
}: FundCatalogSearchFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedQuery = useDebouncedValue(query, CATALOG_SEARCH_DEBOUNCE_MS);

  const suggestions = useMemo(
    () => getFundSearchSuggestions(catalog, debouncedQuery),
    [catalog, debouncedQuery],
  );

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
        accessibilityLabel="Buscar fondos por nombre o ISIN"
        placeholder="Nombre del fondo o ISIN"
        value={query}
        onChangeText={onQueryChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        suggestions={[...PLACEHOLDER_SUGGESTIONS]}
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

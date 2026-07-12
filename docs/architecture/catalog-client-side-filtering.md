# Catalog client-side filtering

The fund catalog can contain thousands of funds. Filter **draft** UI must not issue one HTTP request per toggle.

## Pattern

1. Load the visible catalog once into memory with `getCatalogFundsIndex()` (paginated `GET /funds`, 100 items per page, merged and cached for five minutes).
2. Normalize sheet state with `buildCatalogPreviewServiceFilters(draft, searchQuery)`.
3. Count or slice locally with `countCatalogFunds()` / `filterCatalogFunds()` in `src/features/funds/utils/filter-catalog-funds.ts`.
4. Call the API again only when the user **applies** filters or when the browse list paginates / refreshes.

## When HTTP is allowed

| Action | HTTP |
|--------|------|
| Open catalog / infinite scroll | Yes (`useCatalogFundsPagination`) |
| Toggle filter in sheet (preview) | No |
| Tap **Ver X fondos** (apply) | Yes (committed filters) |
| Pull-to-refresh | Yes (invalidates cache + reloads index) |

## Related code

- `src/features/funds/hooks/use-catalog-funds-index.ts`
- `src/features/funds/hooks/use-catalog-filter-preview-count.ts`
- `src/features/funds/utils/filter-catalog-funds.ts`

Cursor rule: `.cursor/rules/catalog-client-side-filtering.mdc`

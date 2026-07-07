/**
 * Discriminated union: `loading: true` omits required content props.
 * Optional `TLoadingExtra` fields remain available while loading (e.g. `style`, `layout`).
 */
export type WithLoading<
  TContent extends Record<string, unknown>,
  TLoadingExtra extends Record<string, unknown> = Record<string, unknown>,
> =
  | ({ loading: true } & Partial<TLoadingExtra>)
  | ({ loading?: false | undefined } & TContent);

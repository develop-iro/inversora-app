/**
 * Single selectable tab entry for tab family components.
 */
export type TabOption<T extends string> = {
  readonly value: T;
  readonly label: string;
};

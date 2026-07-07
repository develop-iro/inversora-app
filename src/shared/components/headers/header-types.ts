/**
 * Shell layout presets for header chrome.
 */
export type HeaderLayout = 'app' | 'screen' | 'modal';

/**
 * Built-in operational actions available on header toolbars.
 */
export type HeaderActionId = 'back' | 'close' | 'learn' | 'sora';

/**
 * Declarative action entry: shorthand id or object with overrides.
 */
export type HeaderActionSpec =
  | HeaderActionId
  | {
      readonly action: HeaderActionId;
      readonly onPress?: () => void;
      readonly accessibilityLabel?: string;
    };

/**
 * Optional handlers keyed by {@link HeaderActionId}.
 * Missing keys fall back to shared defaults where safe (`back`, `learn`).
 */
export type HeaderActionHandlers = Partial<Record<HeaderActionId, () => void>>;

/**
 * Visual density for toolbar actions.
 * - `compact`: circular bordered icon (dense modals).
 * - `caption`: icon with short label (app bar and stack screens).
 */
export type HeaderActionPresentation = 'compact' | 'caption';

/**
 * Resolves a {@link HeaderActionSpec} to its action id.
 */
export function resolveHeaderActionId(spec: HeaderActionSpec): HeaderActionId {
  return typeof spec === 'string' ? spec : spec.action;
}

/**
 * Resolves an optional press override from a {@link HeaderActionSpec}.
 */
export function resolveHeaderActionPressOverride(
  spec: HeaderActionSpec,
): (() => void) | undefined {
  return typeof spec === 'string' ? undefined : spec.onPress;
}

/**
 * Resolves an optional accessibility label override from a {@link HeaderActionSpec}.
 */
export function resolveHeaderActionA11yLabel(spec: HeaderActionSpec): string | undefined {
  return typeof spec === 'string' ? undefined : spec.accessibilityLabel;
}

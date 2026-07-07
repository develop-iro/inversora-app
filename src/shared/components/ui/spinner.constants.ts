/** Normalized bar heights for the upward bar chart (0 = bottom, 1 = top). */
export const SPINNER_BAR_VALUES = [0.3, 0.42, 0.38, 0.52, 0.48, 0.64, 0.6, 0.76, 0.86] as const;

/** Delay between each bar grow-in during a loop cycle. */
export const SPINNER_BAR_STAGGER_MS = 85;

/** Duration of a single bar grow-in. */
export const SPINNER_BAR_DURATION_MS = 400;

/** Hold at peak visibility before the next loop cycle. */
export const SPINNER_CYCLE_HOLD_MS = 320;

/** Reset duration between loop cycles when motion is enabled. */
export const SPINNER_CYCLE_RESET_MS = 260;

export type SpinnerSize = 'sm' | 'md' | 'lg';

/** Chart dimensions per spinner size. */
export const SPINNER_CHART_DIMENSIONS: Record<
  SpinnerSize,
  {
    readonly width: number;
    readonly height: number;
    readonly barWidth: number;
    readonly gap: number;
  }
> = {
  sm: { width: 128, height: 56, barWidth: 10, gap: 6 },
  md: { width: 176, height: 76, barWidth: 14, gap: 8 },
  lg: { width: 232, height: 100, barWidth: 16, gap: 10 },
};

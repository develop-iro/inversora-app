/**
 * Timing defaults for the welcome typewriter entrance.
 */
export const TYPEWRITER_DEFAULTS = {
  startDelayMs: 280,
  charDelayMs: 28,
  segmentPauseMs: 320,
} as const;

export type TypewriterTiming = {
  readonly startDelayMs: number;
  readonly charDelayMs: number;
  readonly segmentPauseMs: number;
};

export type TypewriterReveal = {
  readonly visibleSegments: readonly string[];
  readonly activeSegmentIndex: number;
  readonly isComplete: boolean;
};

/**
 * Splits welcome body copy into short paragraphs for progressive typing.
 */
export function resolveWelcomeBodySegments(body: string): readonly string[] {
  return body
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

/**
 * Builds the ordered typewriter segments for the welcome intro.
 */
export function buildWelcomeTypewriterSegments(options: {
  readonly title: string;
  readonly body: string;
  readonly skipHint?: string;
}): readonly string[] {
  const segments = [options.title, ...resolveWelcomeBodySegments(options.body)];

  if (options.skipHint && options.skipHint.trim().length > 0) {
    return [...segments, options.skipHint.trim()];
  }

  return segments;
}

/**
 * Computes which characters should be visible after `elapsedMs` of typing.
 */
export function computeTypewriterReveal(
  segments: readonly string[],
  elapsedMs: number,
  timing: TypewriterTiming = TYPEWRITER_DEFAULTS,
): TypewriterReveal {
  if (segments.length === 0) {
    return {
      visibleSegments: [],
      activeSegmentIndex: -1,
      isComplete: true,
    };
  }

  if (elapsedMs < timing.startDelayMs) {
    return {
      visibleSegments: segments.map(() => ''),
      activeSegmentIndex: 0,
      isComplete: false,
    };
  }

  let remaining = elapsedMs - timing.startDelayMs;
  const visibleSegments = segments.map(() => '');

  for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
    const segment = segments[segmentIndex] ?? '';
    const typeDuration = segment.length * timing.charDelayMs;

    if (remaining < typeDuration) {
      const chars = Math.max(0, Math.floor(remaining / timing.charDelayMs));
      visibleSegments[segmentIndex] = segment.slice(0, chars);
      return {
        visibleSegments,
        activeSegmentIndex: segmentIndex,
        isComplete: false,
      };
    }

    visibleSegments[segmentIndex] = segment;
    remaining -= typeDuration;

    const isLast = segmentIndex === segments.length - 1;
    if (isLast) {
      return {
        visibleSegments,
        activeSegmentIndex: -1,
        isComplete: true,
      };
    }

    if (remaining < timing.segmentPauseMs) {
      return {
        visibleSegments,
        activeSegmentIndex: segmentIndex + 1,
        isComplete: false,
      };
    }

    remaining -= timing.segmentPauseMs;
  }

  return {
    visibleSegments,
    activeSegmentIndex: -1,
    isComplete: true,
  };
}

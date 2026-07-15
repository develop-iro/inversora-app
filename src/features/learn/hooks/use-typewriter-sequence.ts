import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  computeTypewriterReveal,
  TYPEWRITER_DEFAULTS,
  type TypewriterReveal,
  type TypewriterTiming,
} from '@/features/learn/services/welcome-typewriter';

export type TypewriterSequenceOptions = {
  /** Ordered strings to type in sequence. */
  readonly segments: readonly string[];
  readonly startDelayMs?: number;
  readonly charDelayMs?: number;
  readonly segmentPauseMs?: number;
  /** When true, reveals all text immediately. */
  readonly reducedMotion?: boolean;
  /** Called once when the full sequence finishes (or is skipped). */
  readonly onComplete?: () => void;
};

export type TypewriterSequenceState = {
  readonly visibleSegments: readonly string[];
  readonly activeSegmentIndex: number;
  readonly isComplete: boolean;
  readonly skip: () => void;
};

function createCompleteReveal(segments: readonly string[]): TypewriterReveal {
  return {
    visibleSegments: [...segments],
    activeSegmentIndex: -1,
    isComplete: true,
  };
}

/**
 * Types a list of text segments character by character for entrance motion.
 */
export function useTypewriterSequence({
  segments,
  startDelayMs = TYPEWRITER_DEFAULTS.startDelayMs,
  charDelayMs = TYPEWRITER_DEFAULTS.charDelayMs,
  segmentPauseMs = TYPEWRITER_DEFAULTS.segmentPauseMs,
  reducedMotion = false,
  onComplete,
}: TypewriterSequenceOptions): TypewriterSequenceState {
  const segmentsKey = segments.join('\u0000');
  const timing = useMemo<TypewriterTiming>(
    () => ({ startDelayMs, charDelayMs, segmentPauseMs }),
    [charDelayMs, segmentPauseMs, startDelayMs],
  );

  const [trackedKey, setTrackedKey] = useState(segmentsKey);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const completionKeyRef = useRef<string | null>(null);

  if (trackedKey !== segmentsKey) {
    setTrackedKey(segmentsKey);
    setElapsedMs(0);
    setSkipped(false);
  }

  const notifyComplete = useCallback(() => {
    if (completionKeyRef.current === segmentsKey) {
      return;
    }

    completionKeyRef.current = segmentsKey;
    onComplete?.();
  }, [onComplete, segmentsKey]);

  const skip = useCallback(() => {
    setSkipped(true);
    notifyComplete();
  }, [notifyComplete]);

  useEffect(() => {
    if (reducedMotion || skipped || segmentsKey.length === 0) {
      notifyComplete();
      return;
    }

    const startedAt = Date.now();
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const schedule = (delayMs: number) => {
      timeoutId = setTimeout(() => {
        if (cancelled) {
          return;
        }

        const nextElapsed = Date.now() - startedAt;
        setElapsedMs(nextElapsed);

        const currentSegments = segmentsKey.split('\u0000');
        const next = computeTypewriterReveal(currentSegments, nextElapsed, timing);

        if (next.isComplete) {
          notifyComplete();
          return;
        }

        schedule(charDelayMs);
      }, delayMs);
    };

    schedule(Math.max(charDelayMs, 16));

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [charDelayMs, notifyComplete, reducedMotion, segmentsKey, skipped, timing]);

  const reveal = useMemo(() => {
    const currentSegments =
      segmentsKey.length === 0 ? [] : segmentsKey.split('\u0000');

    if (reducedMotion || skipped || currentSegments.length === 0) {
      return createCompleteReveal(currentSegments);
    }

    return computeTypewriterReveal(currentSegments, elapsedMs, timing);
  }, [elapsedMs, reducedMotion, segmentsKey, skipped, timing]);

  return {
    visibleSegments: reveal.visibleSegments,
    activeSegmentIndex: reveal.activeSegmentIndex,
    isComplete: reveal.isComplete,
    skip,
  };
}

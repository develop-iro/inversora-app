import { Spacing } from '@/shared/theme/spacing';

export type InfoHintPlacement = 'below' | 'beside';

/** Minimum popup width (matches Tailwind `min-w-[200px]`). */
export const INFO_HINT_POPUP_MIN_WIDTH = 200;

/** Maximum popup width (matches Tailwind `max-w-[280px]`). */
export const INFO_HINT_POPUP_MAX_WIDTH = 280;

/** Fallback height before the popup is measured in the DOM. */
export const INFO_HINT_POPUP_ESTIMATED_HEIGHT = 120;

/** Edge padding when clamping within the viewport. */
export const INFO_HINT_VIEWPORT_PADDING = Spacing.md;

export type InfoHintAnchorRect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type InfoHintViewport = {
  readonly width: number;
  readonly height: number;
};

export type InfoHintPopupSize = {
  readonly width: number;
  readonly height: number;
};

export type InfoHintPopupPosition = {
  readonly top: number;
  readonly left: number;
};

export type ResolveInfoHintPopupPositionInput = {
  readonly anchor: InfoHintAnchorRect;
  readonly viewport: InfoHintViewport;
  readonly placement: InfoHintPlacement;
  readonly popupSize?: InfoHintPopupSize;
};

/**
 * Clamps a coordinate so `origin + size` stays inside `[padding, max - padding]`.
 */
export function clampWithinViewport(
  origin: number,
  size: number,
  viewportMax: number,
  padding: number = INFO_HINT_VIEWPORT_PADDING,
): number {
  const minOrigin = padding;
  const maxOrigin = Math.max(padding, viewportMax - size - padding);
  return Math.min(Math.max(origin, minOrigin), maxOrigin);
}

/**
 * Resolves fixed popup coordinates for an info-hint anchor, keeping the bubble inside the viewport.
 *
 * - `below`: aligns under the anchor; shifts left on right overflow; flips above on bottom overflow.
 * - `beside`: prefers right of anchor; flips left when there is no room on the right.
 */
export function resolveInfoHintPopupPosition({
  anchor,
  viewport,
  placement,
  popupSize = {
    width: INFO_HINT_POPUP_MAX_WIDTH,
    height: INFO_HINT_POPUP_ESTIMATED_HEIGHT,
  },
}: ResolveInfoHintPopupPositionInput): InfoHintPopupPosition {
  const popupWidth = Math.min(
    Math.max(popupSize.width, INFO_HINT_POPUP_MIN_WIDTH),
    INFO_HINT_POPUP_MAX_WIDTH,
  );
  const popupHeight = Math.max(popupSize.height, 1);
  const horizontalGap = Spacing.sm;
  const verticalGap = Spacing.xs;

  if (placement === 'beside') {
    const rightCandidateLeft = anchor.x + anchor.width + horizontalGap;
    const fitsOnRight =
      rightCandidateLeft + popupWidth <= viewport.width - INFO_HINT_VIEWPORT_PADDING;
    const preferredLeft = fitsOnRight
      ? rightCandidateLeft
      : anchor.x - horizontalGap - popupWidth;

    return {
      top: clampWithinViewport(anchor.y - verticalGap, popupHeight, viewport.height),
      left: clampWithinViewport(preferredLeft, popupWidth, viewport.width),
    };
  }

  const belowTop = anchor.y + anchor.height + verticalGap;
  const fitsBelow =
    belowTop + popupHeight <= viewport.height - INFO_HINT_VIEWPORT_PADDING;
  const preferredTop = fitsBelow ? belowTop : anchor.y - verticalGap - popupHeight;
  const preferredLeft = anchor.x;

  return {
    top: clampWithinViewport(preferredTop, popupHeight, viewport.height),
    left: clampWithinViewport(preferredLeft, popupWidth, viewport.width),
  };
}

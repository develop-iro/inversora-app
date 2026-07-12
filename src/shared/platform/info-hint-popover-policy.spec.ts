import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

/** Desktop width threshold for hover popover (see use-platform-capabilities). */
export const INFO_HINT_DESKTOP_BREAKPOINT = 768;

/**
 * Mirrors popover gate without importing react-native Platform.
 */
export function supportsInfoHintPopoverForViewport(
  platformOs: string,
  windowWidth: number,
): boolean {
  return platformOs === 'web' && windowWidth >= INFO_HINT_DESKTOP_BREAKPOINT;
}

describe('supportsInfoHintPopoverForViewport', () => {
  it('enables hover popover on web desktop', () => {
    assert.equal(supportsInfoHintPopoverForViewport('web', 1024), true);
  });

  it('uses centered dialog path on native', () => {
    assert.equal(supportsInfoHintPopoverForViewport('ios', 390), false);
  });
});

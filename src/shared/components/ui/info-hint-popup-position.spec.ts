import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  INFO_HINT_POPUP_MAX_WIDTH,
  INFO_HINT_VIEWPORT_PADDING,
  clampWithinViewport,
  resolveInfoHintPopupPosition,
} from './info-hint-popup-position';

const viewport = { width: 390, height: 844 };

describe('clampWithinViewport', () => {
  it('keeps the origin inside padded bounds', () => {
    assert.equal(clampWithinViewport(300, 280, 390), 390 - 280 - INFO_HINT_VIEWPORT_PADDING);
    assert.equal(clampWithinViewport(-10, 200, 390), INFO_HINT_VIEWPORT_PADDING);
  });
});

describe('resolveInfoHintPopupPosition', () => {
  it('shifts a below popup left when it would overflow the right edge', () => {
    const anchor = { x: 320, y: 200, width: 24, height: 24 };
    const position = resolveInfoHintPopupPosition({
      anchor,
      viewport,
      placement: 'below',
      popupSize: { width: INFO_HINT_POPUP_MAX_WIDTH, height: 100 },
    });

    assert.equal(
      position.left + INFO_HINT_POPUP_MAX_WIDTH,
      viewport.width - INFO_HINT_VIEWPORT_PADDING,
    );
    assert.ok(position.top > anchor.y);
  });

  it('flips a below popup above the anchor when there is no room below', () => {
    const anchor = { x: 40, y: 780, width: 24, height: 24 };
    const popupHeight = 120;
    const position = resolveInfoHintPopupPosition({
      anchor,
      viewport,
      placement: 'below',
      popupSize: { width: 240, height: popupHeight },
    });

    assert.ok(position.top + popupHeight <= anchor.y);
  });

  it('flips a beside popup to the left when there is no room on the right', () => {
    const anchor = { x: 300, y: 120, width: 24, height: 24 };
    const popupWidth = 240;
    const position = resolveInfoHintPopupPosition({
      anchor,
      viewport,
      placement: 'beside',
      popupSize: { width: popupWidth, height: 90 },
    });

    assert.ok(position.left + popupWidth <= anchor.x);
  });

  it('keeps a beside popup on the right when there is enough space', () => {
    const anchor = { x: 40, y: 120, width: 24, height: 24 };
    const popupWidth = 240;
    const position = resolveInfoHintPopupPosition({
      anchor,
      viewport,
      placement: 'beside',
      popupSize: { width: popupWidth, height: 90 },
    });

    assert.ok(position.left >= anchor.x + anchor.width);
  });
});

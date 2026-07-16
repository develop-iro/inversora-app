import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  parseLocalizedNumber,
  sanitizeLocalizedDecimalInput,
} from '@/shared/components/inputs/input-utils';

describe('input-utils', () => {
  it('sanitizes localized decimal drafts', () => {
    assert.equal(sanitizeLocalizedDecimalInput('150,25'), '150,25');
    assert.equal(sanitizeLocalizedDecimalInput('150.25'), '15025');
    assert.equal(sanitizeLocalizedDecimalInput('12,3,4'), '12,34');
  });

  it('parses localized numbers after editing', () => {
    assert.equal(parseLocalizedNumber('150,25'), 150.25);
    assert.equal(parseLocalizedNumber(''), 0);
  });
});

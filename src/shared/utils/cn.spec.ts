import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { cn } from './cn';

describe('cn', () => {
  it('joins truthy class names', () => {
    assert.equal(cn('px-lg', 'gap-sm'), 'px-lg gap-sm');
  });

  it('filters falsy values', () => {
    assert.equal(cn('px-lg', false && 'hidden', null, undefined, 'flex-1'), 'px-lg flex-1');
  });
});

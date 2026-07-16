import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { productFeedbackInputSchema } from '@/features/feedback/schemas/product-feedback.schema';

describe('productFeedbackInputSchema', () => {
  it('should accept valid feedback answers', () => {
    const parsed = productFeedbackInputSchema.parse({
      clarity: 'somewhat',
      wouldReturn: 'maybe',
      message: '  Más contexto en rankings.  ',
    });

    assert.equal(parsed.clarity, 'somewhat');
    assert.equal(parsed.wouldReturn, 'maybe');
    assert.equal(parsed.message, 'Más contexto en rankings.');
  });

  it('should reject missing required answers', () => {
    const result = productFeedbackInputSchema.safeParse({
      clarity: 'yes',
    });

    assert.equal(result.success, false);
  });

  it('should reject messages longer than 2000 characters', () => {
    const result = productFeedbackInputSchema.safeParse({
      clarity: 'no',
      wouldReturn: 'no',
      message: 'x'.repeat(2001),
    });

    assert.equal(result.success, false);
  });
});

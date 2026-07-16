import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getPrivacyPolicyUrl } from '@/features/legal/constants/privacy-policy-url';

describe('getPrivacyPolicyUrl', () => {
  it('returns an https privacy policy URL', () => {
    const url = getPrivacyPolicyUrl();

    assert.ok(url.startsWith('https://'));
    assert.ok(url.endsWith('/privacidad.html'));
  });
});

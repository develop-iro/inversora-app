import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isSafeExternalUrl } from './safe-external-url';

describe('safe-external-url', () => {
  it('allows curated https hosts', () => {
    assert.equal(
      isSafeExternalUrl('https://www.cnmv.es/Portal/Consultas/DatosEmpresa'),
      true,
    );
  });

  it('blocks javascript and non-https URLs', () => {
    assert.equal(isSafeExternalUrl('javascript:alert(1)'), false);
    assert.equal(isSafeExternalUrl('http://www.cnmv.es'), false);
    assert.equal(isSafeExternalUrl('https://evil.example/phish'), false);
  });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isSafeExternalUrl,
  isSafeHttpsUrl,
  isSafeRemoteImageUrl,
} from '@/core/security/safe-external-url';

describe('safe-external-url', () => {
  it('allows curated https hosts', () => {
    assert.equal(
      isSafeExternalUrl('https://www.cnmv.es/Portal/Consultas/DatosEmpresa'),
      true,
    );
    assert.equal(
      isSafeExternalUrl('https://inversora--inversora.expo.app/privacidad.html'),
      true,
    );
  });

  it('blocks javascript and non-https URLs', () => {
    assert.equal(isSafeExternalUrl('javascript:alert(1)'), false);
    assert.equal(isSafeExternalUrl('http://www.cnmv.es'), false);
    assert.equal(isSafeExternalUrl('https://evil.example/phish'), false);
  });

  it('allows trusted https URLs from market-news feeds', () => {
    assert.equal(
      isSafeHttpsUrl('https://www.marketwatch.com/story/example-headline'),
      true,
    );
    assert.equal(
      isSafeHttpsUrl('https://seekingalpha.com/article/4921397-example'),
      true,
    );
    assert.equal(isSafeHttpsUrl('http://www.marketwatch.com/story/example'), false);
    assert.equal(isSafeHttpsUrl('https://localhost/news'), false);
  });

  it('allows only trusted remote image hosts', () => {
    assert.equal(
      isSafeRemoteImageUrl('https://cdn.brandfetch.io/domain/vanguard.com/w/64/h/64'),
      true,
    );
    assert.equal(
      isSafeRemoteImageUrl('https://user:pass@cdn.brandfetch.io/domain/vanguard.com'),
      false,
    );
    assert.equal(isSafeRemoteImageUrl('http://cdn.brandfetch.io/domain/vanguard.com'), false);
    assert.equal(isSafeRemoteImageUrl('https://evil.example/logo.png'), false);
  });
});

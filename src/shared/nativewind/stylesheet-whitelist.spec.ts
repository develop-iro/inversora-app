import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isStylesheetWhitelistPath,
  STYLESHEET_WHITELIST,
} from '@/shared/nativewind/stylesheet-whitelist';

describe('stylesheet-whitelist', () => {
  it('should include nav-tab-bar and tab-pill', () => {
    const paths = STYLESHEET_WHITELIST.map((entry) => entry.path);

    assert.ok(paths.includes('shared/components/navigation/nav-tab-bar.tsx'));
    assert.ok(paths.includes('shared/components/tabs/tab-pill.tsx'));
  });

  it('should match source paths under src/', () => {
    assert.equal(
      isStylesheetWhitelistPath(
        'C:/project/src/shared/components/tabs/tab-pill.tsx',
      ),
      true,
    );
    assert.equal(
      isStylesheetWhitelistPath('src/features/funds/screens/home-screen.tsx'),
      false,
    );
  });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MAX_COMPARE_FUNDS } from '@/core/storage/compare-selection-storage-key';
import { createCompareSelectionStore } from '@/core/storage/compare-selection-store.factory';
import { createMemoryKeyValueStorage } from '@test/support/doubles/memory-key-value-storage';

describe('compareSelectionStore contract', () => {
  it('normalizes ISINs and caps selection at MAX_COMPARE_FUNDS', async () => {
    const store = createCompareSelectionStore(createMemoryKeyValueStorage());

    assert.equal(MAX_COMPARE_FUNDS, 2);

    const first = await store.addFund(' ie00b4l5y983 ');
    assert.deepEqual(first, ['IE00B4L5Y983']);

    const second = await store.addFund('IE00B5BMR087');
    assert.deepEqual(second, ['IE00B4L5Y983', 'IE00B5BMR087']);

    const third = await store.addFund('IE00OVERFLOW1');
    assert.deepEqual(third, ['IE00B4L5Y983', 'IE00B5BMR087']);
  });

  it('removes and clears selected funds', async () => {
    const store = createCompareSelectionStore(createMemoryKeyValueStorage());

    await store.setSelectedIsins(['IE00A', 'IE00B']);
    assert.deepEqual(await store.removeFund('ie00a'), ['IE00B']);
    await store.clear();
    assert.deepEqual(await store.listSelectedIsins(), []);
  });

  it('is idempotent when adding an already selected fund', async () => {
    const store = createCompareSelectionStore(createMemoryKeyValueStorage());
    await store.addFund('IE00B4L5Y983');
    const again = await store.addFund('IE00B4L5Y983');
    assert.deepEqual(again, ['IE00B4L5Y983']);
  });
});

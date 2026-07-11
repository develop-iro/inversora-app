import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { modal } from '@/core/overlay/modal';
import { useModalStore } from '@/core/overlay/modal-store';

describe('modal.confirm', () => {
  it('resolves true when the confirm button is pressed', async () => {
    useModalStore.setState({ stack: [] });

    const promise = modal.confirm('Salir', '¿Seguro?');

    const entry = useModalStore.getState().stack.at(-1);
    assert.equal(entry?.kind, 'alert');

    if (entry?.kind !== 'alert') {
      throw new Error('Expected alert entry');
    }

    assert.equal(entry.backdrop, 'blur-scrim');
    entry.buttons?.[1]?.onPress?.();

    const result = await promise;
    assert.equal(result, true);
  });

  it('resolves false when the cancel button is pressed', async () => {
    useModalStore.setState({ stack: [] });

    const promise = modal.confirm('Salir', '¿Seguro?');
    const entry = useModalStore.getState().stack.at(-1);

    if (entry?.kind !== 'alert') {
      throw new Error('Expected alert entry');
    }

    entry.buttons?.[0]?.onPress?.();

    const result = await promise;
    assert.equal(result, false);
  });

  it('resolves false when the dialog closes without confirmation', async () => {
    useModalStore.setState({ stack: [] });

    const promise = modal.confirm('Salir', '¿Seguro?');
    useModalStore.getState().close();

    const result = await promise;
    assert.equal(result, false);
  });
});

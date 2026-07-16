import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildWelcomeTypewriterSegments,
  computeTypewriterReveal,
  resolveWelcomeBodySegments,
  TYPEWRITER_DEFAULTS,
} from '@/features/learn/services/welcome-typewriter';

describe('resolveWelcomeBodySegments', () => {
  it('splits body text on blank lines', () => {
    assert.deepEqual(
      resolveWelcomeBodySegments('Uno.\n\nDos.\n\n\nTres.'),
      ['Uno.', 'Dos.', 'Tres.'],
    );
  });

  it('returns a single segment when there are no paragraph breaks', () => {
    assert.deepEqual(resolveWelcomeBodySegments('Solo un párrafo.'), [
      'Solo un párrafo.',
    ]);
  });
});

describe('buildWelcomeTypewriterSegments', () => {
  it('prepends the title and appends an optional skip hint', () => {
    assert.deepEqual(
      buildWelcomeTypewriterSegments({
        title: 'Hola',
        body: 'A.\n\nB.',
        skipHint: 'Omitir arriba',
      }),
      ['Hola', 'A.', 'B.', 'Omitir arriba'],
    );
  });
});

describe('computeTypewriterReveal', () => {
  const segments = ['Hi', 'Yo'] as const;
  const timing = {
    startDelayMs: 100,
    charDelayMs: 10,
    segmentPauseMs: 20,
  };

  it('keeps text hidden during the start delay', () => {
    const reveal = computeTypewriterReveal(segments, 50, timing);
    assert.deepEqual(reveal.visibleSegments, ['', '']);
    assert.equal(reveal.isComplete, false);
    assert.equal(reveal.activeSegmentIndex, 0);
  });

  it('types the first segment character by character', () => {
    const afterOneChar = computeTypewriterReveal(segments, 110, timing);
    assert.equal(afterOneChar.visibleSegments[0], 'H');
    assert.equal(afterOneChar.activeSegmentIndex, 0);

    const afterTitle = computeTypewriterReveal(segments, 120, timing);
    assert.equal(afterTitle.visibleSegments[0], 'Hi');
  });

  it('pauses between segments then types the next one', () => {
    const duringPause = computeTypewriterReveal(segments, 130, timing);
    assert.deepEqual(duringPause.visibleSegments, ['Hi', '']);
    assert.equal(duringPause.activeSegmentIndex, 1);

    const afterNextChar = computeTypewriterReveal(segments, 150, timing);
    assert.equal(afterNextChar.visibleSegments[1], 'Y');
  });

  it('marks the sequence complete when every character is typed', () => {
    const done = computeTypewriterReveal(segments, 10_000, timing);
    assert.deepEqual(done.visibleSegments, ['Hi', 'Yo']);
    assert.equal(done.isComplete, true);
    assert.equal(done.activeSegmentIndex, -1);
  });

  it('exports stable default timings', () => {
    assert.equal(TYPEWRITER_DEFAULTS.charDelayMs > 0, true);
    assert.equal(TYPEWRITER_DEFAULTS.startDelayMs > 0, true);
  });
});

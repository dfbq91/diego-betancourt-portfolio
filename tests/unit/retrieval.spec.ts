import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { cosineSimilarity, retrieveTopK } from '../../src/lib/rag/retrieval.ts';
import type { Chunk } from '../../src/lib/rag/types.ts';

describe('cosineSimilarity', () => {
  it('returns 1 for identical vectors', () => {
    const v = [1, 2, 3];
    assert.equal(cosineSimilarity(v, v), 1);
  });

  it('returns 0 for orthogonal vectors', () => {
    assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
  });

  it('returns a value between -1 and 1 for arbitrary vectors', () => {
    const score = cosineSimilarity([1, 2, 3], [2, 1, 1]);
    assert.ok(score > 0 && score < 1);
  });

  it('returns 0 when a vector is all zeros', () => {
    assert.equal(cosineSimilarity([0, 0], [1, 2]), 0);
  });

  it('throws on length mismatch', () => {
    assert.throws(() => cosineSimilarity([1], [1, 2]));
  });
});

describe('retrieveTopK', () => {
  const chunks: Chunk[] = [
    { id: 0, text: 'orthogonal', embedding: [0, 1] },
    { id: 1, text: 'identical', embedding: [1, 0] },
    { id: 2, text: 'opposite', embedding: [-1, 0] }
  ];

  it('orders chunks by relevance to the query', () => {
    const result = retrieveTopK([1, 0], chunks, 3);
    assert.deepEqual(
      result.map((c) => c.text),
      ['identical', 'orthogonal', 'opposite']
    );
  });

  it('returns at most K chunks', () => {
    const result = retrieveTopK([1, 0], chunks, 2);
    assert.equal(result.length, 2);
    assert.deepEqual(
      result.map((c) => c.text),
      ['identical', 'orthogonal']
    );
  });

  it('returns an empty list when K is 0', () => {
    assert.deepEqual(retrieveTopK([1, 0], chunks, 0), []);
  });
});

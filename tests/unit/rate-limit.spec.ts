import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEFAULT_QUESTION_LIMIT,
  SESSION_TTL_SECONDS,
  consumeQuestion,
  getSessionQuestionLimit
} from '../../src/lib/rag/rate-limit.ts';
import type { RateLimitKV } from '../../src/lib/rag/rate-limit.ts';

function createMockKV(): RateLimitKV & {
  store: Map<string, string>;
  ttls: Map<string, number>;
} {
  const store = new Map<string, string>();
  const ttls = new Map<string, number>();
  return {
    store,
    ttls,
    async get(key) {
      return store.get(key) ?? null;
    },
    async put(key, value, options) {
      store.set(key, value);
      ttls.set(key, options.expirationTtl);
    }
  };
}

describe('consumeQuestion', () => {
  it('increments the counter per session token', async () => {
    const kv = createMockKV();
    const first = await consumeQuestion(kv, 'session-1', 3);
    const second = await consumeQuestion(kv, 'session-1', 3);
    assert.deepEqual(first, { allowed: true, count: 1, remaining: 2 });
    assert.deepEqual(second, { allowed: true, count: 2, remaining: 1 });
  });

  it('rejects questions beyond the configurable limit N', async () => {
    const kv = createMockKV();
    await consumeQuestion(kv, 'session-1', 2);
    await consumeQuestion(kv, 'session-1', 2);
    const third = await consumeQuestion(kv, 'session-1', 2);
    assert.deepEqual(third, { allowed: false, count: 2, remaining: 0 });
    assert.equal(kv.store.get('chat-rate-limit:session-1'), '2');
  });

  it('tracks sessions independently', async () => {
    const kv = createMockKV();
    await consumeQuestion(kv, 'session-1', 2);
    const other = await consumeQuestion(kv, 'session-2', 2);
    assert.deepEqual(other, { allowed: true, count: 1, remaining: 1 });
  });

  it('writes the counter with the 24h TTL', async () => {
    const kv = createMockKV();
    await consumeQuestion(kv, 'session-1', 10);
    assert.equal(kv.ttls.get('chat-rate-limit:session-1'), SESSION_TTL_SECONDS);
    assert.equal(SESSION_TTL_SECONDS, 86400);
  });
});

describe('getSessionQuestionLimit', () => {
  it('defaults to 10 when unset or invalid', () => {
    assert.equal(getSessionQuestionLimit({}), DEFAULT_QUESTION_LIMIT);
    assert.equal(DEFAULT_QUESTION_LIMIT, 10);
    assert.equal(getSessionQuestionLimit({ RAG_SESSION_QUESTION_LIMIT: 'abc' }), 10);
    assert.equal(getSessionQuestionLimit({ RAG_SESSION_QUESTION_LIMIT: '0' }), 10);
  });

  it('reads N from the environment variable', () => {
    assert.equal(getSessionQuestionLimit({ RAG_SESSION_QUESTION_LIMIT: '2' }), 2);
  });
});

export const SESSION_TTL_SECONDS = 24 * 60 * 60;
export const DEFAULT_QUESTION_LIMIT = 10;

const KEY_PREFIX = 'chat-rate-limit:';

// Minimal KV surface used by the rate limiter (subset of Cloudflare KV).
export interface RateLimitKV {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options: { expirationTtl: number }
  ): Promise<void>;
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  remaining: number;
}

export function getSessionQuestionLimit(env: {
  RAG_SESSION_QUESTION_LIMIT?: string;
}): number {
  const parsed = Number.parseInt(env.RAG_SESSION_QUESTION_LIMIT ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_QUESTION_LIMIT;
}

export async function consumeQuestion(
  kv: RateLimitKV,
  sessionId: string,
  limit: number
): Promise<RateLimitResult> {
  const key = `${KEY_PREFIX}${sessionId}`;
  const current = await kv.get(key);
  const count = current ? Number.parseInt(current, 10) : 0;

  if (count >= limit) {
    return { allowed: false, count, remaining: 0 };
  }

  const next = count + 1;
  await kv.put(key, String(next), { expirationTtl: SESSION_TTL_SECONDS });
  return { allowed: true, count: next, remaining: limit - next };
}

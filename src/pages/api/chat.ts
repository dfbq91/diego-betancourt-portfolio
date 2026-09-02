import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import ragIndexJson from '../../data/rag-index.json';
import { retrieveTopK } from '../../lib/rag/retrieval';
import { buildPrompt } from '../../lib/rag/prompt';
import { consumeQuestion, getSessionQuestionLimit } from '../../lib/rag/rate-limit';
import { createChatStream } from '../../lib/rag/stream';
import type { ChatLanguage, ChatRequest, ChatResponse, RagIndex } from '../../lib/rag/types';

export const prerender = false;

const DEFAULT_TOP_K = 3;
const DEFAULT_EMBEDDING_MODEL = '@cf/baai/bge-m3';
const DEFAULT_GENERATION_MODEL = '@cf/zai-org/glm-4.7-flash';

function jsonError(status: number, code: string): Response {
  const body: ChatResponse = { error: code };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const POST: APIRoute = async ({ request }) => {
  let body: Partial<ChatRequest>;
  try {
    body = (await request.json()) as Partial<ChatRequest>;
  } catch {
    return jsonError(400, 'invalid_json');
  }

  const question = typeof body.question === 'string' ? body.question.trim() : '';
  const lang = body.lang;
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';

  // CL-8: empty or missing questions are rejected without any AI usage.
  if (!question || (lang !== 'es' && lang !== 'en') || !sessionId) {
    return jsonError(400, 'invalid_request');
  }

  // RF-18: session rate limit checked before any AI call.
  const limit = getSessionQuestionLimit(env);
  const rate = await consumeQuestion(env.CHAT_RATE_LIMIT, sessionId, limit);
  if (!rate.allowed) {
    return jsonError(429, 'limit_reached');
  }

  try {
    // RF-14: embed the question and retrieve the top-K most relevant chunks.
    const embeddingModel =
      env.WORKERS_AI_EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL;
    const embeddings = await env.AI.run(embeddingModel, { text: [question] });
    const queryEmbedding = embeddings.data[0];

    const index = ragIndexJson as unknown as RagIndex;
    const topK = parsePositiveInt(env.RAG_TOP_K, DEFAULT_TOP_K);
    const chunks = retrieveTopK(queryEmbedding, index.chunks, topK);

    // RF-15/RF-16: build the prompt and stream the answer in the active language.
    const messages = buildPrompt(lang, chunks, question);
    const generationModel =
      env.WORKERS_AI_GENERATION_MODEL ?? DEFAULT_GENERATION_MODEL;
    const aiStream = await env.AI.run(generationModel, { messages, stream: true });

    return new Response(createChatStream(aiStream as ReadableStream<Uint8Array>, lang), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('chat endpoint failure', error);
    return jsonError(500, 'internal_error');
  }
};

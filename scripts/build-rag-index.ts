// Build-time RAG index generator (RF-19, plan D6).
// Reads src/content/rag-source.md, splits it into overlapping chunks, generates
// embeddings via the Workers AI REST API (the env.AI binding does not exist in
// a Node build context), and writes src/data/rag-index.json.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { Chunk, RagIndex } from '../src/lib/rag/types.ts';

const SOURCE_PATH = 'src/content/rag-source.md';
const OUTPUT_PATH = 'src/data/rag-index.json';

// Chunking targets ~300-500 tokens per fragment with a small overlap (plan risk #4).
// Words are a good-enough approximation of tokens for Spanish prose.
const MAX_WORDS_PER_CHUNK = 300;
const OVERLAP_WORDS = 40;

const DEFAULT_EMBEDDING_MODEL = '@cf/baai/bge-m3';
const DEFAULT_API_BASE_URL = 'https://api.cloudflare.com/client/v4';

function fail(message: string): never {
  console.error(`build-rag-index: ${message}`);
  process.exit(1);
}

const wordCount = (text: string): number =>
  text.split(/\s+/).filter(Boolean).length;

export function splitIntoChunks(text: string): string[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current: string[] = [];
  let currentWords = 0;

  for (const paragraph of paragraphs) {
    const words = wordCount(paragraph);
    if (currentWords + words > MAX_WORDS_PER_CHUNK && current.length > 0) {
      const chunkText = current.join('\n\n');
      chunks.push(chunkText);
      // Start the next chunk with the tail of the previous one (overlap).
      const tail = chunkText.split(/\s+/).slice(-OVERLAP_WORDS).join(' ');
      current = tail ? [tail] : [];
      currentWords = wordCount(tail);
    }
    current.push(paragraph);
    currentWords += words;
  }
  if (current.length > 0) chunks.push(current.join('\n\n'));
  return chunks;
}

async function generateEmbeddings(
  texts: string[],
  model: string,
  apiBaseUrl: string,
  accountId: string,
  apiToken: string
): Promise<number[][]> {
  const url = `${apiBaseUrl}/accounts/${accountId}/ai/run/${model}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: texts })
  });
  if (!response.ok) {
    fail(
      `Workers AI embeddings request failed: ${response.status} ${await response.text()}`
    );
  }
  const payload = (await response.json()) as {
    success: boolean;
    result?: { data?: number[][] };
  };
  if (!payload.success || !payload.result?.data) {
    fail(`Workers AI embeddings response was not successful: ${JSON.stringify(payload)}`);
  }
  return payload.result.data;
}

async function main(): Promise<void> {
  try {
    // Node 20.12+ / 22+ built-in env loader for local development
    if (typeof process.loadEnvFile === 'function') {
      process.loadEnvFile();
    }
  } catch {
    // Ignore if .env is missing (e.g. Cloudflare Pages CI environment)
  }

  // CL-9: fail the build explicitly when the source document is missing or empty.
  let source: string;
  try {
    source = await readFile(SOURCE_PATH, 'utf8');
  } catch {
    fail(`${SOURCE_PATH} does not exist. The chat cannot be deployed without content.`);
  }
  if (source.trim().length === 0) {
    fail(`${SOURCE_PATH} is empty. The chat cannot be deployed without content.`);
  }

  const apiToken =
    process.env.CF_EMBEDDINGS_API_TOKEN ?? process.env.CLOUDFLARE_API_TOKEN;
  if (!apiToken) {
    fail(
      'CF_EMBEDDINGS_API_TOKEN (or CLOUDFLARE_API_TOKEN) is not set. It is required to generate embeddings.'
    );
  }
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!accountId) {
    fail('CLOUDFLARE_ACCOUNT_ID is not set. It is required to call the Workers AI REST API.');
  }
  const model = process.env.WORKERS_AI_EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL;
  const apiBaseUrl = process.env.CLOUDFLARE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

  const texts = splitIntoChunks(source);
  const embeddings = await generateEmbeddings(
    texts,
    model,
    apiBaseUrl,
    accountId,
    apiToken
  );
  if (embeddings.length !== texts.length) {
    fail(
      `Workers AI returned ${embeddings.length} embeddings for ${texts.length} chunks.`
    );
  }

  const index: RagIndex = {
    model,
    chunks: texts.map((text, id): Chunk => ({ id, text, embedding: embeddings[id] }))
  };

  const outputPath = resolve(OUTPUT_PATH);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(index));
  console.log(
    `build-rag-index: wrote ${index.chunks.length} chunks (${model}) to ${OUTPUT_PATH}`
  );
}

await main();

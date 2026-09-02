import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createChatStream, extractTokens } from '../../src/lib/rag/stream.ts';
import { OUT_OF_SCOPE_MARKER } from '../../src/lib/rag/prompt.ts';
import { OUT_OF_SCOPE_MESSAGES } from '../../src/lib/rag/prompt.ts';

function sseStream(events: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const event of events) controller.enqueue(encoder.encode(event));
      controller.close();
    }
  });
}

async function readAll(stream: ReadableStream<Uint8Array>): Promise<string> {
  const decoder = new TextDecoder();
  let out = '';
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  return out;
}

const token = (text: string) => `data: ${JSON.stringify({ response: text })}\n\n`;

describe('extractTokens', () => {
  it('parses SSE data events and ignores [DONE]', () => {
    const { tokens, rest } = extractTokens(
      `${token('Hola')}${token(' mundo')}data: [DONE]\n\n`
    );
    assert.deepEqual(tokens, ['Hola', ' mundo']);
    assert.equal(rest, '');
  });

  it('keeps an incomplete final line as rest', () => {
    const { tokens, rest } = extractTokens(`${token('Hi')}data: {"resp`);
    assert.deepEqual(tokens, ['Hi']);
    assert.equal(rest, 'data: {"resp');
  });
});

describe('createChatStream', () => {
  it('streams tokens through as plain text', async () => {
    const output = await readAll(
      createChatStream(
        sseStream([token('Diego vive '), token('en Colombia.'), 'data: [DONE]\n\n']),
        'es'
      )
    );
    assert.equal(output, 'Diego vive en Colombia.');
  });

  it('substitutes the exact ES message when the marker arrives', async () => {
    const output = await readAll(
      createChatStream(sseStream([token(OUT_OF_SCOPE_MARKER), 'data: [DONE]\n\n']), 'es')
    );
    assert.equal(output, OUT_OF_SCOPE_MESSAGES.es);
    assert.ok(!output.includes(OUT_OF_SCOPE_MARKER));
  });

  it('substitutes the exact EN message', async () => {
    const output = await readAll(
      createChatStream(sseStream([token(OUT_OF_SCOPE_MARKER)]), 'en')
    );
    assert.equal(output, OUT_OF_SCOPE_MESSAGES.en);
  });

  it('handles the marker split across stream chunks', async () => {
    const marker = OUT_OF_SCOPE_MARKER;
    const half = Math.floor(marker.length / 2);
    const output = await readAll(
      createChatStream(
        sseStream([token(marker.slice(0, half)), token(marker.slice(half)), 'data: [DONE]\n\n']),
        'es'
      )
    );
    assert.equal(output, OUT_OF_SCOPE_MESSAGES.es);
  });

  it('emits a partial marker prefix as normal text when the stream ends', async () => {
    const partial = OUT_OF_SCOPE_MARKER.slice(0, 5);
    const output = await readAll(createChatStream(sseStream([token(partial)]), 'es'));
    assert.equal(output, partial);
  });

  it('swallows tokens that follow the marker', async () => {
    const output = await readAll(
      createChatStream(
        sseStream([token(OUT_OF_SCOPE_MARKER), token(' extra')]),
        'en'
      )
    );
    assert.equal(output, OUT_OF_SCOPE_MESSAGES.en);
  });
});

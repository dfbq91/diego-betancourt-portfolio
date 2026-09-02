import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readChatResponse } from '../../src/scripts/chat-client.ts';

function responseFromChunks(chunks: string[]): Response {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
        controller.close();
      }
    })
  );
}

describe('readChatResponse', () => {
  it('delivers each response fragment incrementally', async () => {
    const fragments: string[] = [];
    await readChatResponse(responseFromChunks(['Diego ', 'trabaja ', 'en Colombia.']), (chunk) => {
      fragments.push(chunk);
    });

    assert.deepEqual(fragments, ['Diego ', 'trabaja ', 'en Colombia.']);
    assert.equal(fragments.join(''), 'Diego trabaja en Colombia.');
  });
});

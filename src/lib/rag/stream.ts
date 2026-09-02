import type { ChatLanguage } from './types.ts';
import { OUT_OF_SCOPE_MARKER, getOutOfScopeMessage } from './prompt.ts';

// Workers AI streaming responses arrive as SSE events:
//   data: {"response":"partial text"}\n\n
// terminated by `data: [DONE]`.
export function extractTokens(buffer: string): { tokens: string[]; rest: string } {
  const tokens: string[] = [];
  const lines = buffer.split(/\r?\n/);
  const rest = lines.pop() ?? '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let payload = trimmed;
    const isSSE = trimmed.startsWith('data:');
    if (isSSE) {
      payload = trimmed.slice('data:'.length).trim();
    }

    if (payload === '[DONE]' || payload === '') continue;

    if (payload.startsWith('{') && payload.endsWith('}')) {
      try {
        const parsed = JSON.parse(payload) as {
          response?: unknown;
          choices?: Array<{ delta?: { content?: unknown } }>;
        };
        if (typeof parsed.response === 'string') {
          if (parsed.response) tokens.push(parsed.response);
          continue;
        }
        const deltaContent = parsed.choices?.[0]?.delta?.content;
        if (typeof deltaContent === 'string') {
          if (deltaContent) tokens.push(deltaContent);
          continue;
        }
      } catch {
        // Ignore malformed JSON payloads.
      }
    }

    // Fallback: If not SSE formatted and not JSON, treat raw text as token chunk
    if (!isSSE) {
      tokens.push(trimmed);
    }
  }
  return { tokens, rest };
}

// Transforms the Workers AI generation stream into a plain text stream for the
// browser, substituting the out-of-scope marker with the fixed bilingual
// message (RF-17, plan D9). The marker may be split across stream chunks, so
// output is held back while the accumulated text is still a marker prefix.
export function createChatStream(
  source: ReadableStream<Uint8Array>,
  lang: ChatLanguage
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = source.getReader();
      let buffer = '';
      let acc = '';
      let decided = false;
      let outOfScope = false;
      let emittedFixed = false;

      const handleToken = (token: string): void => {
        if (decided) {
          if (!outOfScope) controller.enqueue(encoder.encode(token));
          return;
        }
        acc += token;
        const trimmed = acc.trimStart();
        if (OUT_OF_SCOPE_MARKER.startsWith(trimmed)) {
          if (trimmed === OUT_OF_SCOPE_MARKER) {
            decided = true;
            outOfScope = true;
          }
          return; // Hold back: might be a (partial) marker.
        }
        decided = true;
        controller.enqueue(encoder.encode(acc));
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const { tokens, rest } = extractTokens(buffer);
          buffer = rest;
          for (const token of tokens) handleToken(token);
        }
        buffer += decoder.decode();
        if (buffer) {
          const { tokens } = extractTokens(`${buffer}\n`);
          for (const token of tokens) handleToken(token);
        }
        // Flush whatever is pending.
        if (!decided) {
          const trimmed = acc.trimStart();
          if (trimmed === OUT_OF_SCOPE_MARKER) {
            outOfScope = true;
          } else if (acc) {
            controller.enqueue(encoder.encode(acc));
          }
        }
        if (outOfScope && !emittedFixed) {
          emittedFixed = true;
          controller.enqueue(encoder.encode(getOutOfScopeMessage(lang)));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });
}

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  OUT_OF_SCOPE_MARKER,
  OUT_OF_SCOPE_MESSAGES,
  buildPrompt,
  buildSystemPrompt,
  getOutOfScopeMessage
} from '../../src/lib/rag/prompt.ts';
import type { Chunk } from '../../src/lib/rag/types.ts';

const chunks: Chunk[] = [
  { id: 0, text: 'Diego vive en Colombia.', embedding: [1] },
  { id: 1, text: 'Diego trabaja en Tech Solutions SAS.', embedding: [1] }
];

describe('buildPrompt', () => {
  it('includes the retrieved chunks in the user message', () => {
    const [system, user] = buildPrompt('es', chunks, '¿Dónde vive Diego?');
    assert.equal(system.role, 'system');
    assert.equal(user.role, 'user');
    assert.ok(user.content.includes('Diego vive en Colombia.'));
    assert.ok(user.content.includes('Diego trabaja en Tech Solutions SAS.'));
    assert.ok(user.content.includes('¿Dónde vive Diego?'));
  });

  it('injects the target language into the system prompt', () => {
    assert.ok(buildSystemPrompt('es').includes('español'));
    assert.ok(buildSystemPrompt('en').includes('English'));
  });

  it('instructs the model to answer in the requested language regardless of question language', () => {
    const system = buildSystemPrompt('en');
    assert.ok(system.includes('regardless of the language'));
  });
});

describe('out of scope marker', () => {
  it('is an exported constant referenced by the system prompt', () => {
    assert.ok(OUT_OF_SCOPE_MARKER.length > 0);
    assert.ok(buildSystemPrompt('es').includes(OUT_OF_SCOPE_MARKER));
  });

  it('returns the exact fixed message per language', () => {
    assert.equal(getOutOfScopeMessage('es'), OUT_OF_SCOPE_MESSAGES.es);
    assert.equal(getOutOfScopeMessage('en'), OUT_OF_SCOPE_MESSAGES.en);
    assert.ok(OUT_OF_SCOPE_MESSAGES.es.includes('sección de contacto'));
    assert.ok(OUT_OF_SCOPE_MESSAGES.en.includes('Contact section'));
  });
});

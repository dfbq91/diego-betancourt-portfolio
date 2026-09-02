export interface Chunk {
  id: number;
  text: string;
  embedding: number[];
}

export interface RagIndex {
  model: string;
  chunks: Chunk[];
}

export type ChatLanguage = 'es' | 'en';

export interface ChatRequest {
  question: string;
  lang: ChatLanguage;
  sessionId: string;
}

// Successful responses are streamed as plain text; this type covers the
// non-streaming JSON error responses (400, 429, 500).
export interface ChatResponse {
  error: string;
}

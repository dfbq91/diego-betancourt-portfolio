import type { ChatLanguage, Chunk } from './types';

// Unique internal marker the model is instructed to return when the question
// cannot be answered from the retrieved context. The backend detects it in the
// stream and substitutes the fixed bilingual message (plan D9).
export const OUT_OF_SCOPE_MARKER = '[[OUT_OF_SCOPE]]';

export const OUT_OF_SCOPE_MESSAGES: Record<ChatLanguage, string> = {
  es: '¡Ups! No tengo respuesta a esa pregunta. Puedes escribirle a Diego directamente desde la sección de contacto.',
  en: 'Oops! I don\u2019t have an answer to that question. You can reach out to Diego directly through the Contact section.'
};

const LANGUAGE_INSTRUCTIONS: Record<ChatLanguage, string> = {
  es: 'Responde siempre en español, sin importar el idioma en que esté escrita la pregunta.',
  en: 'Always answer in English, regardless of the language the question is written in.'
};

export interface PromptMessage {
  role: 'system' | 'user';
  content: string;
}

export function buildSystemPrompt(lang: ChatLanguage): string {
  return [
    'Eres el asistente del portfolio de Diego Betancourt, un desarrollador de software full-stack de Colombia.',
    'Solo puedes responder preguntas sobre Diego: quién es, su trayectoria profesional, sus proyectos, su vida personal y cómo contactarlo.',
    `Tu única fuente de verdad es el contexto que se te entrega. Si la respuesta no está en el contexto, responde únicamente con el texto "${OUT_OF_SCOPE_MARKER}" sin ningún otro texto.`,
    'No inventes información. No respondas preguntas sobre temas ajenos a Diego.',
    LANGUAGE_INSTRUCTIONS[lang]
  ].join(' ');
}

export function buildPrompt(
  lang: ChatLanguage,
  chunks: Chunk[],
  question: string
): PromptMessage[] {
  const context = chunks.map((chunk) => chunk.text).join('\n\n');
  return [
    { role: 'system', content: buildSystemPrompt(lang) },
    {
      role: 'user',
      content: `Contexto sobre Diego:\n\n${context}\n\nPregunta: ${question}`
    }
  ];
}

export function getOutOfScopeMessage(lang: ChatLanguage): string {
  return OUT_OF_SCOPE_MESSAGES[lang];
}

const SESSION_ID_KEY = 'portfolio-chat-session-id';
const SESSION_LIMIT_KEY = 'portfolio-chat-limit-reached';

type ChatElements = {
  container: HTMLElement;
  form: HTMLFormElement;
  input: HTMLInputElement;
  submit: HTMLButtonElement;
  messages: HTMLElement;
  status: HTMLElement;
};

function getLanguage(): 'es' | 'en' {
  return document.documentElement.dataset.locale === 'en' ? 'en' : 'es';
}

function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  sessionStorage.setItem(SESSION_ID_KEY, id);
  return id;
}

function addMessage(messages: HTMLElement, text: string, role: 'user' | 'assistant'): HTMLElement {
  const message = document.createElement('div');
  message.dataset.chatMessage = role;
  message.className =
    role === 'user'
      ? 'ml-auto max-w-[85%] rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] px-3.5 py-2 font-mono text-[13px] text-[var(--text-bright)] whitespace-pre-wrap'
      : 'max-w-[92%] rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 font-mono text-[13px] text-[var(--text)] whitespace-pre-wrap leading-relaxed';
  message.textContent = text;
  messages.append(message);
  message.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  return message;
}

function setStatus(status: HTMLElement, text = ''): void {
  status.textContent = text;
  status.classList.toggle('hidden', !text);
}

function setBusy(elements: ChatElements, busy: boolean): void {
  elements.input.disabled = busy;
  elements.submit.disabled = busy;
}

export async function readChatResponse(
  response: Response,
  onChunk: (chunk: string) => void
): Promise<void> {
  if (!response.body) {
    const text = await response.text();
    if (text) onChunk(text);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      if (text) onChunk(text);
    }
    const remaining = decoder.decode();
    if (remaining) onChunk(remaining);
  } finally {
    reader.releaseLock();
  }
}

function getElements(container: HTMLElement): ChatElements | null {
  const form = container.querySelector<HTMLFormElement>('[data-chat-form]');
  const input = container.querySelector<HTMLInputElement>('[data-chat-input]');
  const submit = container.querySelector<HTMLButtonElement>('[data-chat-submit]');
  const messages = container.querySelector<HTMLElement>('[data-chat-messages]');
  const status = container.querySelector<HTMLElement>('[data-chat-status]');

  if (!form || !input || !submit || !messages || !status) return null;
  return { container, form, input, submit, messages, status };
}

export function initializeChat(): void {
  const syncSessionLimit = (): void => {
    const limitReached = sessionStorage.getItem(SESSION_LIMIT_KEY) === 'true';
    document.querySelectorAll<HTMLElement>('[data-chat]').forEach((container) => {
      const elements = getElements(container);
      if (!elements) return;
      const limitMessage = container.dataset.limitMessage ?? '';
      if (limitReached) {
        setBusy(elements, true);
        setStatus(elements.status, limitMessage);
      }
    });
  };

  syncSessionLimit();

  const win = window as unknown as { _chatSubmitBound?: boolean };
  if (win._chatSubmitBound) return;
  win._chatSubmitBound = true;

  document.addEventListener('submit', async (event) => {
    const form = (event.target as HTMLElement)?.closest<HTMLFormElement>('[data-chat-form]');
    if (!form) return;

    event.preventDefault();
    event.stopPropagation();

    const container = form.closest<HTMLElement>('[data-chat]');
    if (!container) return;

    const elements = getElements(container);
    if (!elements) return;

    const question = elements.input.value.trim();
    if (!question || elements.input.disabled) return;

    const typingLabel = container.dataset.typingLabel ?? '';
    const errorMessage = container.dataset.errorMessage ?? '';
    const limitMessage = container.dataset.limitMessage ?? '';
    let limitReached = sessionStorage.getItem(SESSION_LIMIT_KEY) === 'true';

    const disableForSessionLimit = (): void => {
      limitReached = true;
      sessionStorage.setItem(SESSION_LIMIT_KEY, 'true');
      setBusy(elements, true);
      setStatus(elements.status, limitMessage);
    };

    if (limitReached) {
      disableForSessionLimit();
      return;
    }

    addMessage(elements.messages, question, 'user');
    elements.input.value = '';
    setBusy(elements, true);
    setStatus(elements.status, typingLabel);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          lang: getLanguage(),
          sessionId: getSessionId()
        })
      });

      if (response.status === 429) {
        disableForSessionLimit();
        return;
      }
      if (!response.ok) throw new Error(`Chat request failed: ${response.status}`);

      let assistantMessage: HTMLElement | undefined;
      await readChatResponse(response, (chunk) => {
        if (!assistantMessage) {
          assistantMessage = addMessage(elements.messages, '', 'assistant');
          setStatus(elements.status);
        }
        assistantMessage.textContent += chunk;
        assistantMessage.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    } catch (error) {
      console.error('chat client failure', error);
      addMessage(elements.messages, errorMessage, 'assistant');
    } finally {
      if (limitReached) {
        setStatus(elements.status, limitMessage);
      } else {
        setStatus(elements.status);
        setBusy(elements, false);
        elements.input.focus();
      }
    }
  });
}

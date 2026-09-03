import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const RESEND_API_URL = 'https://api.resend.com/emails';

const DEFAULT_TO = 'dfbq91@gmail.com';
const DEFAULT_FROM = 'Contact <onboarding@resend.dev>';

type SendResult =
  | { ok: true; id: string }
  | { ok: false; status: number; code: string };

function jsonError(status: number, code: string): Response {
  return new Response(JSON.stringify({ error: code }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function sendEmail(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  message: string
): Promise<SendResult> {
  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: message
      })
    });

    const data = (await res.json()) as { id?: string };

    if (!res.ok) {
      return { ok: false, status: res.status, code: 'resend_error' };
    }

    return data.id ? { ok: true, id: data.id } : { ok: false, status: 500, code: 'resend_error' };
  } catch (error) {
    console.error('email send failure', error);
    return { ok: false, status: 500, code: 'internal_error' };
  }
}

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get('Content-Type')?.startsWith('application/json') !== true) {
    return jsonError(400, 'invalid_request');
  }

  let body: { subject?: unknown; message?: unknown };
  try {
    body = (await request.json()) as { subject?: unknown; message?: unknown };
  } catch {
    return jsonError(400, 'invalid_json');
  }

  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!subject || !message) {
    return jsonError(400, 'invalid_request');
  }

  if (subject.length > 200 || message.length > 5000) {
    return jsonError(400, 'invalid_request');
  }

  const apiKey = env.CONTACT_EMAIL_API_KEY;
  if (!apiKey) {
    console.error('email send: CONTACT_EMAIL_API_KEY secret not configured');
    return jsonError(500, 'internal_error');
  }

  const from = env.CONTACT_EMAIL_FROM ?? DEFAULT_FROM;
  const to = env.CONTACT_EMAIL_TO ?? DEFAULT_TO;

  const result = await sendEmail(apiKey, from, to, subject, message);

  if (!result.ok) {
    if (result.status === 500) return jsonError(500, 'internal_error');
    return jsonError(result.status, result.code);
  }

  return new Response(JSON.stringify({ ok: true, id: result.id }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
};

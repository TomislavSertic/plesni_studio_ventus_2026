import 'server-only';
import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from './sanity';
import { escapeHtml, validateInquiry, type Inquiry } from './validation';
const rateLimit = new Map<string, { count: number; expires: number }>();
const pending = new Map<string, Promise<{ mailSent: boolean }>>();
const mailConfigured = () => ['MAILTRAP_USER', 'MAILTRAP_PASS', 'SEND_FROM_EMAIL', 'SEND_TO_EMAIL'].every(key => Boolean(process.env[key]));
async function sendMail(data: Inquiry, type: string) {
  if (!mailConfigured()) throw new Error('SMTP configuration is incomplete');
  const transporter = nodemailer.createTransport({ host: 'live.smtp.mailtrap.io', port: 587, secure: false, requireTLS: true,
    auth: { user: process.env.MAILTRAP_USER, pass: process.env.MAILTRAP_PASS }, connectionTimeout: 12000, greetingTimeout: 12000, socketTimeout: 20000 });
  const labels: Record<string, string> = { emailAddress: 'Email porukom', phoneNumber: 'Telefonskim pozivom', whatsupMessage: 'WhatsApp porukom' };
  await transporter.sendMail({ from: process.env.SEND_FROM_EMAIL, to: process.env.SEND_TO_EMAIL,
    ...(data.email ? { replyTo: data.email } : {}),
    subject: `${type} poruka od ${data.name} - ${data.email || data.phoneNumber}`,
    text: `Ime: ${data.name}\nEmail: ${data.email}\nTelefon: ${data.phoneNumber}\nOdgovor: ${labels[data.wantedResponse]}\n\n${data.message}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;padding:28px;border-top:4px solid #f26436"><h2>Ventus — ${escapeHtml(type)}</h2><p><b>Ime:</b> ${escapeHtml(data.name)}</p><p><b>Email:</b> ${escapeHtml(data.email)}</p><p><b>Telefon:</b> ${escapeHtml(data.phoneNumber)}</p><p><b>Željeni odgovor:</b> ${escapeHtml(labels[data.wantedResponse])}</p><hr><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p></div>`,
  });
}
async function persistAndNotify(data: Inquiry, type: 'contactMessage' | 'registrationMessage') {
  const id = `ventus-${type}-${data.requestId || crypto.randomUUID()}`;
  const existing = pending.get(id);
  if (existing) return existing;
  const task = (async () => {
    const record = await writeClient.createIfNotExists({ _id: id, _type: type, name: data.name, email: data.email, phoneNumber: data.phoneNumber, wantedResponse: data.wantedResponse, message: data.message, dateRecived: new Date().toISOString(), responded: false, emailNotificationSent: false });
    if (record.emailNotificationSent === true) return { mailSent: true };
    try {
      await sendMail(data, type === 'registrationMessage' ? 'Registration' : 'Contact');
      await writeClient.patch(id).set({ emailNotificationSent: true }).commit();
      return { mailSent: true };
    } catch {
      console.error('[Ventus] Message saved; email notification could not be confirmed.');
      return { mailSent: false };
    }
  })();
  pending.set(id, task);
  try { return await task; } finally { pending.delete(id); }
}
export async function handleInquiry(req: NextRequest, type: 'contactMessage' | 'registrationMessage' | 'mail') {
  const origin = req.headers.get('origin');
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== req.nextUrl.host && originHost !== req.headers.get('host')) return NextResponse.json({ success: false, message: 'Zahtjev nije dopušten.' }, { status: 403 });
    } catch { return NextResponse.json({ success: false, message: 'Zahtjev nije dopušten.' }, { status: 403 }); }
  }
  if (!req.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ success: false, message: 'Očekujemo JSON podatke.' }, { status: 415 });
  if (Number(req.headers.get('content-length') || 0) > 18000) return NextResponse.json({ success: false, message: 'Poruka je preduga.' }, { status: 413 });
  const key = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  // Bounded, process-local abuse protection. Persistent rate limits can be added at the hosting edge.
  for (const [ip, value] of rateLimit) if (value.expires < now) rateLimit.delete(ip);
  const entry = rateLimit.get(key) || { count: 0, expires: now + 15 * 60 * 1000 };
  if (entry.count >= 8) return NextResponse.json({ success: false, message: 'Poslano je više upita. Pričekaj malo ili nas nazovi.' }, { status: 429, headers: { 'Retry-After': '900' } });
  if (rateLimit.size >= 5000 && !rateLimit.has(key)) rateLimit.delete(rateLimit.keys().next().value!);
  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 18000) return NextResponse.json({ success: false, message: 'Poruka je preduga.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return NextResponse.json({ success: false, message: 'Podaci obrasca nisu valjani.' }, { status: 400 }); }
  const result = validateInquiry(body);
  if (result.error) return NextResponse.json({ success: false, message: result.error }, { status: 400 });
  rateLimit.set(key, { count: entry.count + 1, expires: entry.expires });
  try {
    if (type === 'mail') {
      await sendMail(result.data!, body.formType === 'Registration' ? 'Registration' : 'Contact');
      return NextResponse.json({ success: true, mailSent: true, message: 'Mail Sent.' });
    }
    const status = await persistAndNotify(result.data!, type);
    return NextResponse.json({ success: true, saved: true, ...status, message: status.mailSent ? 'Poruka je uspješno poslana.' : 'Poruka je spremljena, ali email obavijest nije dostavljena.' }, { status: 201 });
  } catch {
    console.error('[Ventus] Inquiry could not be completed. Check Sanity credentials and network access.');
    return NextResponse.json({ success: false, message: 'Poruka trenutačno nije poslana. Pokušaj ponovno ili nas kontaktiraj izravno.' }, { status: 503 });
  }
}

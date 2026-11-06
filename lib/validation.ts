export type Inquiry = { name: string; email: string; phoneNumber: string; wantedResponse: string; message: string; requestId: string };
export function validateInquiry(input: unknown): { data: Inquiry; error?: never } | { error: string; data?: never } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Podaci obrasca nisu valjani.' };
  const body = input as Record<string, unknown>;
  const text = (key: string) => typeof body[key] === 'string' ? (body[key] as string).trim() : '';
  const name = text('name'), email = text('email'), phoneNumber = text('phoneNumber'), message = text('message');
  const responseMap: Record<string, string> = { email: 'emailAddress', emailAddress: 'emailAddress', phone: 'phoneNumber', phoneNumber: 'phoneNumber', whatsup: 'whatsupMessage', whatsupMessage: 'whatsupMessage', whatsapp: 'whatsupMessage' };
  const wantedResponse = responseMap[text('wantedResponse')];
  if (name.length < 2 || name.length > 100 || /[\r\n\x00-\x1f]/.test(name)) return { error: 'Unesi valjano ime (2–100 znakova).' };
  if (!wantedResponse) return { error: 'Odaberi kako želiš da ti se javimo.' };
  if (email.length > 254 || (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))) return { error: 'Unesi valjanu email adresu.' };
  if (wantedResponse === 'emailAddress' && !email) return { error: 'Unesi email adresu za odgovor.' };
  if (phoneNumber && (!/^[+\d\s().\/-]{6,30}$/.test(phoneNumber) || /[\r\n\x00-\x1f]/.test(phoneNumber))) return { error: 'Unesi valjan broj telefona.' };
  if (wantedResponse !== 'emailAddress' && !phoneNumber) return { error: 'Unesi broj telefona za odgovor.' };
  if (message.length < 3 || message.length > 4500) return { error: 'Poruka treba imati između 3 i 4500 znakova.' };
  if (body.consent === false) return { error: 'Za odgovor na upit potreban je pristanak na obradu podataka.' };
  const requestId = text('requestId');
  if (requestId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId)) return { error: 'Osvježi stranicu i pokušaj ponovno.' };
  return { data: { name, email, phoneNumber, wantedResponse, message, requestId } };
}
export function escapeHtml(value: string) { return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!); }

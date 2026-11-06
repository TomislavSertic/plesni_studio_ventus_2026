import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore -- Node's type stripping requires the explicit source extension.
import { validateInquiry, escapeHtml } from '../lib/validation.ts';
const valid = { name: 'Test korisnik', email: 'test@example.com', wantedResponse: 'emailAddress', phoneNumber: '', message: 'Zanima me ples.', consent: true };
test('existing forms and both legacy contact enums remain supported', () => {
  assert.equal(validateInquiry(valid).data?.wantedResponse, 'emailAddress');
  assert.equal(validateInquiry({ ...valid, email: '', wantedResponse: 'phoneNumber', phoneNumber: '+385 91 123 4567' }).data?.wantedResponse, 'phoneNumber');
  assert.equal(validateInquiry({ ...valid, wantedResponse: 'whatsupMessage', phoneNumber: '+385 91 123 4567' }).data?.wantedResponse, 'whatsupMessage');
  assert.equal(validateInquiry({ ...valid, wantedResponse: 'email' }).data?.wantedResponse, 'emailAddress');
});
test('empty and malformed payloads never reach storage or SMTP', () => {
  for (const payload of [null, [], 'test', {}, { ...valid, name: '' }, { ...valid, email: '' }, { ...valid, email: 'bad@email' }, { ...valid, message: 'x' }, { ...valid, message: 'x'.repeat(4501) }, { ...valid, wantedResponse: 'fax' }, { ...valid, consent: false }, { ...valid, requestId: '../document' }]) assert.ok(validateInquiry(payload).error);
});
test('mail header injection and unsafe callback values are rejected', () => {
  assert.ok(validateInquiry({ ...valid, name: 'User\r\nBcc: other@example.com' }).error);
  assert.ok(validateInquiry({ ...valid, email: 'test@example.com\nBcc:other@example.com' }).error);
  assert.ok(validateInquiry({ ...valid, wantedResponse: 'phoneNumber', phoneNumber: '<script>alert(1)</script>' }).error);
  assert.ok(validateInquiry({ ...valid, email: '', wantedResponse: 'phoneNumber', phoneNumber: '+385\r\n123456' }).error);
});
test('visitor content is escaped in notification email HTML', () => {
  const escaped = escapeHtml('<img src=x onerror="alert(1)"> & \'quoted\'');
  assert.ok(!escaped.includes('<img'));
  assert.ok(escaped.includes('&lt;img'));
  assert.ok(escaped.includes('&quot;'));
  assert.ok(escaped.includes('&#39;'));
});

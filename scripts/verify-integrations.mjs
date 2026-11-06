import { createClient } from '@sanity/client';
import nodemailer from 'nodemailer';
const required = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET', 'MAILTRAP_USER', 'MAILTRAP_PASS', 'SEND_FROM_EMAIL', 'SEND_TO_EMAIL'];
const missing = required.filter(key => !process.env[key]);
if (!process.env.SANITY_API_TOKEN && !process.env.NEXT_PUBLIC_SANITY_TOKEN) missing.push('SANITY_API_TOKEN or NEXT_PUBLIC_SANITY_TOKEN');
if (missing.length) { console.error('Missing environment variable names:', missing.join(', ')); process.exit(1); }
let failed = false;
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-01-01', useCdn: false, token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN, perspective: 'published' });
try {
  const counts = await client.fetch('{"dances":count(*[_type=="dances" && teaching==true]),"instructors":count(*[_type=="instructors" && show==true]),"posts":count(*[_type=="post"]),"events":count(*[_type=="event"]),"schedules":count(*[_type=="scheduleSchema"])}');
  console.log('PASS Sanity read access:', JSON.stringify(counts));
  for (const type of ['contactMessage', 'registrationMessage']) {
    await client.request({ url: `/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`, method: 'POST', query: { dryRun: true }, body: { mutations: [{ create: { _id: `ventus-dry-run-${crypto.randomUUID()}`, _type: type, name: 'Integration dry run', dateRecived: new Date().toISOString() } }] } });
    console.log(`PASS Sanity ${type} write permission (dry run; no record created)`);
  }
} catch (error) { failed = true; console.error('FAIL Sanity:', error.statusCode || error.code || 'connection or permissions'); }
try {
  const transporter = nodemailer.createTransport({ host: 'live.smtp.mailtrap.io', port: 587, secure: false, requireTLS: true, auth: { user: process.env.MAILTRAP_USER, pass: process.env.MAILTRAP_PASS }, connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 15000 });
  await transporter.verify();
  console.log('PASS SMTP connection, TLS and authentication (no email sent)');
} catch (error) { failed = true; console.error('FAIL SMTP:', error.code || 'authentication or connection'); }
console.log('Recipient delivery requires a real submitted inquiry; this check sends no email.');
process.exitCode = failed ? 1 : 0;

'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Check, LoaderCircle } from 'lucide-react';
type Mode = 'registration' | 'contact';
export function InquiryForm({ mode = 'registration', programs = [] }: { mode?: Mode; programs?: string[] }) {
  return <Suspense fallback={<div className="inquiry-form" role="status">Pripremamo obrazac...</div>}><InquiryFormFields mode={mode} programs={programs} /></Suspense>;
}
function InquiryFormFields({ mode, programs }: { mode: Mode; programs: string[] }) {
  const searchParams = useSearchParams();
  const queryProgram = searchParams.get('program') || '';
  const [response, setResponse] = useState('emailAddress');
  const [program, setProgram] = useState(queryProgram);
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error' | 'saved'>('idle');
  const [message, setMessage] = useState('');
  const id = useRef('');
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { id.current = crypto.randomUUID(); }, []);
  useEffect(() => { setProgram(queryProgram); }, [queryProgram]);
  const registration = mode === 'registration';
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;
    const data = new FormData(event.currentTarget);
    if (String(data.get('website') || '')) return;
    setState('sending'); setMessage('');
    const content = String(data.get('message') || '').trim();
    const body = {
      name: data.get('name'), email: data.get('email') || '', phoneNumber: data.get('phoneNumber') || '',
      wantedResponse: response, message: program ? `Zanima me: ${program}.\n${content}` : content || (registration ? 'Prijava za probni trening. Molim pomoć pri odabiru programa.' : ''),
      requestId: id.current, consent: data.get('consent') === 'on',
    };
    try {
      const result = await fetch(`/api/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const payload = await result.json();
      if (!result.ok) throw new Error(payload.message || 'Slanje nije uspjelo. Pokušaj ponovno.');
      setState(payload.mailSent ? 'success' : 'saved');
      setMessage(payload.mailSent ? (registration ? 'Tvoja je prijava stigla! Javit ćemo ti se da dogovorimo prvi trening.' : 'Poruka je stigla! Javit ćemo ti se putem odabranog kontakta.') : 'Poruka je spremljena u studio, ali email obavijest trenutačno nije dostavljena. Za brži odgovor nazovi +385 91 445 5914.');
      form.current?.reset();
    } catch (error) { setState('error'); setMessage(error instanceof Error ? error.message : 'Nešto je pošlo po krivu. Pokušaj ponovno.'); }
  }
  if (state === 'success' || state === 'saved') return <div className="form-success" role="status"><span className="success-icon"><Check size={32} /></span><span className="eyebrow">{state === 'success' ? 'VIDIMO SE USKORO' : 'PORUKA JE SPREMLJENA'}</span><h3>{registration ? 'PRVI KORAK?\nNAPRAVLJEN.' : 'ČUJEMO SE!'}</h3><p>{message}</p><button className="text-link" type="button" onClick={() => { id.current = crypto.randomUUID(); setState('idle'); setMessage(''); }}>Pošalji novu poruku <ArrowUpRight size={18} /></button></div>;
  return <form className="inquiry-form" ref={form} onSubmit={submit}>
    <div className="form-heading"><span className="eyebrow">{registration ? 'TVOJ NOVI POČETAK' : 'TU SMO ZA TEBE'}</span><h3>{registration ? 'Idemo zaplesati.' : 'Pošalji nam poruku.'}</h3><p>{registration ? 'Ostavi kontakt, a mi ćemo se javiti za dogovor.' : 'Pitanje, ideja ili dogovor? Piši nam.'}</p></div>
    <fieldset disabled={state === 'sending'}><label>Ime i prezime <span>*</span><input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Kako se zoveš?" /></label>
    {registration && <label>Zanima me<select value={program} onChange={e => setProgram(e.target.value)}><option value="">Pomozi mi odabrati program</option>{[...new Set([...programs, ...(program ? [program] : [])])].map(p => <option key={p}>{p}</option>)}</select></label>}
    <label>Kako želiš da ti se javimo?<select name="wantedResponse" value={response} onChange={e => setResponse(e.target.value)}><option value="emailAddress">Email porukom</option><option value="phoneNumber">Telefonskim pozivom</option><option value="whatsupMessage">WhatsApp porukom</option></select></label>
    {response === 'emailAddress' ? <label>Email adresa <span>*</span><input type="email" name="email" autoComplete="email" maxLength={254} required placeholder="tvoj@email.com" /></label> : <label>Broj telefona <span>*</span><input type="tel" name="phoneNumber" autoComplete="tel" minLength={6} maxLength={30} required placeholder="+385 ..." /></label>}
    <label>{registration ? 'Još nešto što želiš podijeliti?' : 'Tvoja poruka'} {!registration && <span>*</span>}<textarea name="message" rows={3} maxLength={4000} required={!registration} minLength={registration ? undefined : 3} placeholder={registration ? 'Iskustvo, želje ili pitanje — slušamo.' : 'Što te zanima?'} /></label>
    <div className="honeypot" aria-hidden="true"><label>Web stranica<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="consent"><input type="checkbox" name="consent" required /><span>Slažem se da Ventus koristi moje podatke za odgovor na ovaj upit. <Link href="/privacypolicy">Više o privatnosti.</Link></span></label>
    {state === 'error' && <p className="form-error" role="alert">{message} Možeš nam se javiti i na <a href="tel:+385914455914">+385 91 445 5914</a>.</p>}
    <button className="button form-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? <>Šaljemo... <LoaderCircle className="spin" size={19} /></> : <>{registration ? 'Prijavi se za besplatan trening' : 'Pošalji poruku'}<ArrowUpRight size={20} /></>}</button>
    <p className="form-footnote">{registration ? 'Prve dvije grupne lekcije su besplatne. Bez obveze upisa.' : 'Podatke koristimo isključivo za komunikaciju o tvojem upitu.'}</p></fieldset>
  </form>;
}

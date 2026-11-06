import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Check, Music2, Sparkles, Users, Heart } from 'lucide-react';
import { getDances, getInstructors, getPosts, getSchedules } from '@/lib/sanity';
import { SITE_URL, studio } from '@/lib/config';
import { ButtonLink, DanceCard, InstructorCard, SectionHeading, StoryCard, TrialBanner } from '@/components/ui';
import { KineticRibbon } from '@/components/kinetic-ribbon';
import { ScheduleExplorer } from '@/components/schedule-explorer';
export const revalidate = 120;
export const metadata = { alternates: { canonical: '/' } };
const faqs = [
  ['Mogu li doći ako nikada nisam plesao/la?', 'Naravno. Prvi korak ne traži iskustvo — samo malo znatiželje. Javi nam se i pomoći ćemo ti pronaći grupu koja odgovara tvojem iskustvu i željama.'],
  ['Trebam li doći s plesnim partnerom?', 'Javi nam koji te program zanima. Neki su programi individualni, a za tečajeve u parovima zajedno ćemo provjeriti mogućnosti i pronaći najbolju opciju za tebe.'],
  ['Kako funkcioniraju besplatne lekcije?', 'Ispuni prijavu za probni trening. Kontaktirat ćemo te kako bismo dogovorili grupu i termin. Prve dvije grupne lekcije su besplatne i nema obveze upisa.'],
  ['Što trebam ponijeti na prvi trening?', 'Udobnu odjeću u kojoj se lako krećeš, čistu i udobnu obuću za dvoranu te vodu. Ako program traži nešto posebno, reći ćemo ti prilikom dogovora.'],
  ['Gdje se održavaju treninzi?', 'Radimo na više lokacija. Uz svaki termin u rasporedu navedena je lokacija, a točno mjesto i sve detalje potvrdit ćemo ti prije prvog dolaska.'],
];
export default async function Home() {
  const [dances, instructors, posts, schedules] = await Promise.all([getDances(), getInstructors(), getPosts(), getSchedules()]);
  const featured = dances.filter(d => d.highlighted).slice(0, 3);
  const highlights = featured.length ? featured : dances.slice(0, 3);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'DanceSchool', name: studio.name, url: SITE_URL, telephone: studio.phone, email: studio.email, image: `${SITE_URL}/images/hero-image.webp`, sameAs: [studio.instagram, studio.facebook] }).replace(/</g, '\\u003c') }} />
    <section className="hero-shell"><div className="hero">
      <div className="hero-photo"><Image src="/images/hero-image.webp" alt="Plesni par u pokretu na plesnom podiju" fill priority sizes="(max-width: 760px) 100vw, 65vw" /><div className="hero-photo-overlay" /></div>
      <KineticRibbon />
      <div className="hero-content"><div className="hero-eyebrow"><span className="status-dot" />VIŠE OD PLESNOG STUDIJA</div><h1>MANJE<br />RAZMIŠLJAJ.<br /><span>VIŠE PLEŠI.</span></h1><p>Ugasi svakodnevicu. Pojačaj glazbu.<br />Pronađi svoj ritam i ljude koji ga dijele.</p><div className="hero-actions"><ButtonLink href="/schedule#free-lesson">Isprobaj besplatno</ButtonLink><Link className="hero-secondary" href="/classes">Istraži tečajeve <ArrowUpRight size={18} /></Link></div><div className="hero-reassurance"><span><Check size={14} /> Prve dvije grupne lekcije gratis</span><span><Check size={14} /> Početnici su dobrodošli</span></div></div>
      <span className="hero-side-label">OSJETI GLAZBU. POKRENI PRIČU.</span><div className="hero-image-caption"><span className="caption-line" /><span>POKRET KOJI<br />POVEZUJE.</span></div><a href="#programi" className="hero-scroll" aria-label="Otkrij programe"><ArrowDown size={19} /></a><span className="hero-edition">VENTUS / NOVO POGLAVLJE</span>
    </div></section>
    <div className="ticker-stack" aria-hidden="true">
      <div className="ticker ticker-back"><div>{[0, 1, 2, 3].map(i => <span key={i}>DRUŠTVENI PLESOVI <b>✳</b> LATINO <b>✳</b> PRVI PLES <b>✳</b> PLES ZA DJECU <b>✳</b> </span>)}</div></div>
      <div className="ticker"><div>{[0, 1, 2, 3].map(i => <span key={i}>DOBRA GLAZBA <b>✳</b> SLOBODA POKRETA <b>✳</b> TVOJA EKIPA <b>✳</b> TVOJ RITAM <b>✳</b> </span>)}</div></div>
    </div>
    <section className="section container programs-section" id="programi"><SectionHeading label="SVAKI RITAM IMA SVOJU PRIČU" title="KOJI JE" accent="TVOJ PLES?" href="/classes" linkLabel="Svi programi" /><div className="section-lead"><p>Za prvi izlazak na podij, za veliki dan ili za čisti gušt.<br className="desktop-only" /> Pronađi program zbog kojeg ćeš jedva čekati sljedeći trening.</p><span className="little-note"><Music2 size={18} /> Od početnika do zaljubljenika u ples.</span></div><div className="dance-grid">{highlights.map((dance, i) => <DanceCard key={dance._id} dance={dance} index={i} />)}</div></section>
    <section className="manifesto container" data-reveal><div className="manifesto-visual"><Image src="/images/aboutus-card.webp" alt="Plesni par na zajedničkom treningu" fill sizes="(max-width: 760px) 90vw, 45vw" /><div className="manifesto-stamp"><span>PLEŠI.<br />OSJETI.<br />PONOVI.</span><ArrowUpRight size={28} /></div></div><div className="manifesto-copy"><span className="eyebrow"><span className="tiny-square" />DOBRO DOŠAO/LA U VENTUS</span><h2>NE UČIMO TE<br />SAMO KORAKE.<br /><span>OTVARAMO<br />NOVI SVIJET.</span></h2><p>Onaj osjećaj kad zaboraviš na vrijeme. Kad ti pjesma izmami osmijeh, a korak koji je jučer bio težak danas jednostavno sjedne. Zbog toga plešemo.</p><p>U Ventusu ima mjesta za tvoj prvi pokušaj, tvoj tempo i tvoju osobnost. Tu smo da zajedno pronađemo ples u kojem se osjećaš kao ti.</p><Link className="text-link" href="/aboutus">Upoznaj našu priču <ArrowUpRight size={20} /></Link><div className="manifesto-facts"><div><strong>{dances.length.toString().padStart(2, '0')}</strong><span>plesnih programa</span></div><div><strong>02</strong><span>prve lekcije gratis</span></div><div><strong>∞</strong><span>razloga za ples</span></div></div></div></section>
    <section className="values-strip container" data-reveal>{[{ icon: Sparkles, title: 'Tvoj tempo', text: 'Kreni od mjesta na kojem jesi.' }, { icon: Users, title: 'Tvoja ekipa', text: 'Poznata lica. Nova prijateljstva.' }, { icon: Heart, title: 'Tvoj trenutak', text: 'Vrijeme koje odvajaš za sebe.' }].map(({ icon: Icon, title, text }) => <div key={title}><Icon size={25} strokeWidth={1.4} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</section>
    <section className="schedule-section section"><div className="container"><SectionHeading label="NAPRAVI MJESTA ZA NEŠTO DOBRO" title="PRONAĐI SVOJ" accent="TERMIN." href="/schedule" linkLabel="Raspored i cjenik" /><ScheduleExplorer schedules={schedules} compact /></div></section>
    {!!instructors.length && <section className="section container"><SectionHeading label="LJUDI KOJI ŽIVE PLES" title="DOBRA ENERGIJA." accent="PRAVA EKIPA." href="/aboutus#instructors" linkLabel="Upoznaj instruktore" /><div className="instructor-grid">{instructors.slice(0, 2).map(i => <InstructorCard key={i._id} instructor={i} />)}</div></section>}
    <TrialBanner />
    {!!posts.length && <section className="section container"><SectionHeading label="ŽIVOT IZMEĐU KORAKA" title="IZ NAŠEG" accent="RITMA." href="/news" linkLabel="Sve novosti" /><div className="story-grid">{posts.slice(0, 3).map(p => <StoryCard key={p._id} story={p} />)}</div></section>}
    <section className="faq-section section container"><div><span className="eyebrow">IMAŠ PITANJA? IMAMO ODGOVORE.</span><h2>SVE POČINJE<br /><span>PRVIM KORAKOM.</span></h2><p>Ako te još nešto zanima,<br />uvijek nam se možeš javiti.</p><Link className="text-link" href="/contact">Razgovarajmo <ArrowUpRight size={18} /></Link></div><div className="faq-list">{faqs.map(([q, a], i) => <details key={q}><summary><span><small>0{i + 1}</small>{q}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
  </>;
}

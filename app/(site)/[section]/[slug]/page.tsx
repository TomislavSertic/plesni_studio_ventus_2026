import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getDances, getDocument, getEvents, getInstructors, getPosts } from '@/lib/sanity';
import { imageUrl, readableDate } from '@/lib/images';
import { ButtonLink, TrialBanner, displayDance } from '@/components/ui';
import { RichText } from '@/components/rich-text';
type Props = { params: Promise<{ section: string; slug: string }> };
const types: Record<string, string> = { classes: 'dances', instructors: 'instructors', news: 'post', events: 'event' };
const labels: Record<string, string> = { classes: 'Tečajevi', instructors: 'Instruktori', news: 'Novosti', events: 'Događanja' };
export const revalidate = 120;
export async function generateStaticParams() {
  const [classes, instructors, news, events] = await Promise.all([getDances(), getInstructors(), getPosts(), getEvents()]);
  return Object.entries({ classes, instructors, news, events }).flatMap(([section, docs]) => docs.map(doc => ({ section, slug: doc.slug.current })));
}
async function load(params: Awaited<Props['params']>) {
  if (!types[params.section]) notFound();
  const doc = await getDocument(types[params.section], params.slug);
  if (!doc) notFound();
  return doc;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params; const doc = await load(p);
  const title = p.section === 'classes' ? displayDance(doc.name) : p.section === 'instructors' ? `${doc.name} ${doc.surname || ''}` : doc.title;
  return { title, description: doc.description || `${title} u plesnom studiju Ventus. Pronađi svoj ritam.`, alternates: { canonical: `/${p.section}/${p.slug}` }, openGraph: { title, description: doc.description || title, images: [{ url: imageUrl(doc.mainImage || doc.image) }], type: p.section === 'news' ? 'article' : 'website' } };
}
export default async function DetailPage({ params }: Props) {
  const { section, slug } = await params;
  const doc = await load({ section, slug });
  const event = section === 'events';
  if (section === 'classes' || section === 'instructors') {
    const instructor = section === 'instructors';
    const title = instructor ? `${doc.name} ${doc.surname || ''}` : displayDance(doc.name);
    return <><div className="container page-intro"><Link className="breadcrumb" href={instructor ? '/aboutus#instructors' : '/classes'}>Ventus <span>/</span>{labels[section]} <span>/</span>{title}</Link></div><section className="container detail-hero"><div><span className="eyebrow">{instructor ? 'TVOJ VODIČ KROZ PLES' : 'PRONAĐI SE U POKRETU'}</span><h1>{title}</h1>{doc.description && <p className="detail-description">{doc.description}</p>}<div className="detail-tags">{(instructor ? doc.knowledge?.map(d => d.name) : doc.teachingOptions)?.map(t => <span key={t}>{t}</span>)}</div><ButtonLink href={`/schedule?program=${encodeURIComponent(instructor ? `Privatna lekcija – ${title}` : title)}#free-lesson`}>{instructor ? 'Dogovori lekciju' : 'Želim probati ovaj ples'}</ButtonLink></div><div className={`detail-cover ${instructor ? 'portrait' : ''}`}><Image src={imageUrl(doc.image, 1200, instructor ? `/images/${slug}.png` : '/images/latino.jpg')} alt={title} fill priority sizes="(max-width: 760px) 90vw, 45vw" /></div></section><section className="container detail-layout"><div><RichText value={instructor ? doc.bio : doc.body} />{!(instructor ? doc.bio : doc.body)?.length && <p>Želiš saznati više? Javi nam se i zajedno ćemo pronaći program i termin za tebe.</p>}{instructor && !!doc.knowledge?.length && <><h2 style={{ fontSize: 38, marginBlock: '35px 20px' }}>PLESOVI KOJE DIJELIMO</h2><div className="detail-tags">{doc.knowledge.filter(d => d?.slug?.current).map(d => <Link className="text-link" href={`/classes/${d.slug.current}`} key={d._id}>{displayDance(d.name)}<ArrowUpRight size={15} /></Link>)}</div></>}</div><aside className="detail-aside"><span className="eyebrow">TVOJ SLJEDEĆI KORAK</span><h2>{instructor ? 'UPOZNAJMO SE.' : 'PODIJ TE ČEKA.'}</h2><p>{instructor ? 'Individualna pažnja i tempo prilagođen tebi. Javi se i dogovorimo tvoj trening.' : 'Prve dvije grupne lekcije su besplatne. Isprobaj i osjeti je li ovo tvoj ritam.'}</p><ButtonLink href={`/schedule?program=${encodeURIComponent(title)}#free-lesson`}>Prijavi se</ButtonLink><Link className="text-link" href="/schedule">Raspored i cjenik <ArrowUpRight size={16} /></Link>{instructor && <dl>{doc.email && <><dt>EMAIL</dt><dd><a href={`mailto:${doc.email}`}>{doc.email}</a></dd></>}{doc.phoneNumber && <><dt>TELEFON</dt><dd><a href={`tel:${doc.phoneNumber.replace(/\s/g, '')}`}>{doc.phoneNumber}</a></dd></>}{doc.socials?.filter(s => /^https?:\/\//.test(s.url)).map(s => <dd key={s._key}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.socialName} ↗</a></dd>)}</dl>}</aside></section><TrialBanner /><div style={{ height: 70 }} /></>;
  }
  const archived = event && new Date(doc.eventEnd || doc.eventStart || 0).getTime() < Date.now();
  return <><header className="article-header container"><Link href={`/${section}`} className="breadcrumb">Ventus <span>/</span>{labels[section]}<span>/</span>Priča</Link><h1>{doc.title}</h1>{doc.description && <p>{doc.description}</p>}<div className="article-meta"><span>{doc.categories?.map(c => c.title).join(' · ') || labels[section]}</span><time dateTime={event ? doc.eventStart : doc.publishedAt}>{readableDate(event ? doc.eventStart : doc.publishedAt, event)}</time>{doc.author?.name && <span>{doc.author.name}</span>}</div><div className="article-image"><Image src={imageUrl(doc.mainImage, 1600)} alt={doc.title} fill priority sizes="95vw" /></div></header><div className="article-wrap">{archived && <div className="archive-notice">Ovo je događanje iz naše arhive. Aktualne susrete pronađi na stranici događanja.</div>}<RichText value={doc.body} />{event && <aside className="detail-aside" style={{ position: 'static', marginTop: 35 }}><span className="eyebrow">DETALJI DOGAĐANJA</span><dl><dt>KADA</dt><dd>{readableDate(doc.eventStart, true)}{doc.eventEnd && <> — {readableDate(doc.eventEnd, true)}</>}</dd>{(doc.eventVenue || doc.eventVenueAddress) && <><dt>GDJE</dt><dd>{doc.eventVenue}<br />{doc.eventVenueAddress}</dd></>}{typeof doc.eventPrice === 'number' && <><dt>CIJENA</dt><dd>{doc.eventPrice === 0 ? 'Besplatno' : `${doc.eventPrice} €`}</dd></>}{doc.organizator && <><dt>ORGANIZATOR</dt><dd>{doc.organizator.name} {doc.organizator.surname}</dd></>}</dl>{!archived && <ButtonLink href={`/contact?program=${encodeURIComponent(doc.title)}`}>Zanima me događanje</ButtonLink>}</aside>}<Link className="text-link" style={{ marginTop: 35 }} href={`/${section}`}>Natrag na {event ? 'događanja' : 'novosti'} <ArrowUpRight size={18} /></Link></div></>;
}

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { imageUrl, readableDate } from '@/lib/images';
import type { Dance, Instructor, Story } from '@/lib/types';
export function ButtonLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return <Link href={href} className={`button ${secondary ? 'button-outline' : ''}`}>{children}<ArrowUpRight size={19} /></Link>;
}
export function SectionHeading({ label, title, accent, href, linkLabel = 'Istraži više' }: { label: string; title: string; accent?: string; href?: string; linkLabel?: string }) {
  return <div className="section-heading" data-reveal><div><span className="eyebrow"><span className="tiny-square" />{label}</span><h2>{title} {accent && <span>{accent}</span>}</h2></div>{href && <Link className="text-link" href={href}>{linkLabel}<ArrowUpRight size={19} /></Link>}</div>;
}
export function PageIntro({ label, title, accent, text }: { label: string; title: string; accent?: string; text?: string }) {
  return <section className="page-intro container"><Link className="breadcrumb" href="/">Ventus <span>/</span> {label}</Link><div className="intro-grid"><h1>{title}<br /><span>{accent}</span></h1>{text && <p>{text}</p>}</div></section>;
}
export function displayDance(name: string) { return name.trim().replace(/dijecu/gi, 'djecu'); }
export function DanceCard({ dance, index = 0 }: { dance: Dance; index?: number }) {
  return <Link href={`/classes/${dance.slug.current}`} className="dance-card" data-reveal>
    <div className="dance-image"><Image src={imageUrl(dance.image, 900, '/images/latino.jpg')} alt={displayDance(dance.name)} fill sizes="(max-width: 650px) 92vw, (max-width: 1000px) 46vw, 31vw" /><span className="image-number">{String(index + 1).padStart(2, '0')}</span><span className="image-arrow"><ArrowUpRight size={23} /></span><div className="dance-image-label">{dance.teachingOptions?.[0] || 'ISTRAŽI PLES'}</div></div>
    <div className="dance-card-bottom"><h3>{displayDance(dance.name)}</h3><span>{dance.categories?.map(c => c.title).filter(Boolean).join(' · ') || 'Pronađi svoj pokret'}</span></div>
  </Link>;
}
export function InstructorCard({ instructor }: { instructor: Instructor }) {
  return <Link className="instructor-card" href={`/instructors/${instructor.slug.current}`} data-reveal><div className="instructor-image"><Image src={imageUrl(instructor.image, 900, `/images/${instructor.slug.current}.png`)} alt={`${instructor.name} ${instructor.surname || ''}`} fill sizes="(max-width: 700px) 90vw, 45vw" /><span className="image-arrow"><ArrowUpRight /></span></div><div className="instructor-info"><h3>{instructor.name} {instructor.surname}</h3><p>{instructor.description || 'Tvoj vodič kroz svijet plesa'}</p></div></Link>;
}
export function StoryCard({ story }: { story: Story }) {
  const event = story._type === 'event';
  return <Link href={`/${event ? 'events' : 'news'}/${story.slug.current}`} className="story-card" data-reveal><div className="story-image"><Image src={imageUrl(story.mainImage, 900)} alt={story.title} fill sizes="(max-width: 700px) 90vw, 30vw" /></div><div className="story-meta"><span>{event ? 'DOGAĐANJE' : story.categories?.[0]?.title || 'IZ STUDIJA'}</span><time dateTime={event ? story.eventStart : story.publishedAt}>{readableDate(event ? story.eventStart : story.publishedAt)}</time></div><h3>{story.title}</h3>{story.description && <p>{story.description}</p>}<span className="text-link">Pročitaj priču <ArrowRight size={17} /></span></Link>;
}
export function TrialBanner() {
  return <section className="trial-banner container" data-reveal><div className="trial-symbol" aria-hidden="true">✳</div><div><span className="eyebrow">BEZ PRITISKA. S PUNO RITMA.</span><h2>NE TREBAŠ ZNATI PLESATI.<br />TREBAŠ SAMO <span>DOĆI.</span></h2><p>Prijavi se i isprobaj prve dvije grupne lekcije besplatno.</p></div><ButtonLink href="/schedule#free-lesson">Moj prvi korak</ButtonLink></section>;
}
export function EmptyState({ children }: { children: React.ReactNode }) { return <div className="empty-state"><span aria-hidden="true">↗</span><p>{children}</p><Link className="text-link" href="/contact">Javi nam se <ArrowUpRight size={18} /></Link></div>; }

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { getPricing } from '@/lib/sanity';
import type { PricingSettings } from '@/lib/types';
import { formatPrice } from '@/lib/pricing';
export function PricingContent({ settings }: { settings: PricingSettings }) {
  const cards = (settings.cards || []).filter(card => card.enabled !== false);
  if (settings.enabled === false || !cards.length) return null;
  const actions: Record<string, string> = { registration: '/schedule#free-lesson', contact: '/contact', schedule: '/schedule' };
  return <section id="price-list" className="section container pricing"><div className="section-heading"><div>{settings.eyebrow && <span className="eyebrow">{settings.eyebrow}</span>}<h2>{settings.heading} <span>{settings.accent}</span></h2></div>{settings.description && <p style={{ whiteSpace: 'pre-line' }}>{settings.description}</p>}</div><div className="price-grid">{cards.map((card, index) => <div key={card._key} className={`price-card ${card.featured ? 'featured' : ''}`}>
    {card.badge && <span className="price-badge">{card.badge}</span>}<span className="eyebrow">{String(index + 1).padStart(2, '0')} / {card.label}</span><h3 style={{ whiteSpace: 'pre-line' }}>{card.title}</h3><div className={`price ${card.priceText ? 'price-custom' : ''}`}>{formatPrice(card.amount, card.priceText, settings.currency)}{card.unit && <small>{card.unit}</small>}</div>{card.description && <p style={{ whiteSpace: 'pre-line' }}>{card.description}</p>}
    {!!card.packages?.length && <div className="price-packages">{card.packages.map(p => <span key={p._key}>{p.title}<b>{formatPrice(p.amount, p.priceText, settings.currency)}</b></span>)}</div>}
    {card.buttonText && <Link className={card.featured ? 'button button-dark' : 'text-link'} href={actions[card.buttonAction || 'registration'] || actions.registration}>{card.buttonText}<ArrowUpRight size={18} /></Link>}
  </div>)}</div>{settings.note && <p className="pricing-note" style={{ whiteSpace: 'pre-line' }}>{settings.note}</p>}</section>;
}
export async function Pricing() { return <PricingContent settings={await getPricing()} />; }

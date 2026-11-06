import Link from 'next/link';
import { ArrowUpRight, Instagram, Facebook } from 'lucide-react';
import { studio } from '@/lib/config';
export function SiteFooter() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-top"><div><span className="eyebrow">PRVI KORAK JE TVOJ.</span><h2>OSTALO JE <span>PLES.</span></h2></div><Link href="/schedule#free-lesson" className="circle-link" aria-label="Prijavi se na probni trening"><ArrowUpRight size={44} /></Link></div>
    <div className="footer-grid"><div className="footer-studio"><Link href="/" className="footer-wordmark">VENTUS<span>®</span></Link><p>Pokret koji povezuje.<br />Mjesto za tvoj ritam.</p></div><div><h3>ISTRAŽI</h3><Link href="/classes">Tečajevi</Link><Link href="/schedule">Raspored i cjenik</Link><Link href="/aboutus">Naša priča i instruktori</Link></div><div><h3>BUDI U TOKU</h3><Link href="/news">Novosti iz studija</Link><Link href="/events">Događanja</Link><a href={studio.instagram} target="_blank" rel="noopener noreferrer">Instagram <Instagram size={14} /></a><a href={studio.facebook} target="_blank" rel="noopener noreferrer">Facebook <Facebook size={14} /></a></div><div><h3>ČUJEMO SE</h3><a href={`tel:${studio.phone}`}>{studio.phoneLabel}</a><a className="footer-email" href={`mailto:${studio.email}`}>{studio.email}</a><Link href="/contact">Pošalji nam poruku <ArrowUpRight size={15} /></Link></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Plesni studio Ventus j.d.o.o.</span><Link href="/privacypolicy">Privatnost</Link><span>S ljubavlju prema pokretu.</span></div>
  </div></footer>;
}

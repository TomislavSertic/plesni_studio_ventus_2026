'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { navigation } from '@/lib/config';
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (e.key === 'Tab') {
        const items = [toggle.current, ...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>('a') || [])].filter(Boolean) as HTMLElement[];
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && index <= 0) { e.preventDefault(); items.at(-1)?.focus(); }
        else if (!e.shiftKey && index === items.length - 1) { e.preventDefault(); items[0]?.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => { document.body.style.overflow = before; document.removeEventListener('keydown', handler); };
  }, [open]);
  return <header className="site-header"><div className="nav-wrap">
    <Link href="/" className="brand" aria-label="Ventus – naslovnica"><Image src="/images/main-logo4.png" alt="" width={51} height={56} priority /><span>VENTUS<small>PLESNI STUDIO</small></span></Link>
    <nav className="desktop-nav" aria-label="Glavna navigacija">{navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>{item.label}</Link>)}</nav>
    <Link className="button button-small nav-cta" href="/schedule#free-lesson">Zapleši s nama <ArrowUpRight size={17} /></Link>
    <button ref={toggle} className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Zatvori izbornik' : 'Otvori izbornik'}>{open ? <X /> : <Menu />}</button>
  </div>
    {open && <div ref={panel} id="mobile-menu" className="mobile-menu"><nav aria-label="Mobilna navigacija">{[...navigation, { href: '/events', label: 'Događanja' }].map((item, i) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><small>0{i + 1}</small>{item.label}<ArrowUpRight /></Link>)}</nav><Link href="/schedule#free-lesson" className="button" onClick={() => setOpen(false)}>Prijavi se za probni trening <ArrowUpRight size={18} /></Link></div>}
  </header>;
}

'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) { return <div className="error-page"><span className="eyebrow">KRATKA PAUZA U RITMU</span><h1>SADRŽAJ SE<br />NIJE UČITAO.</h1><p>Veza sa studijem trenutačno nije dostupna. Pokušaj ponovno ili nas nazovi na +385 91 445 5914.</p><button className="button" onClick={reset}>Pokušaj ponovno ↗</button><Link href="tel:+385914455914" className="text-link">Nazovi studio</Link></div>; }

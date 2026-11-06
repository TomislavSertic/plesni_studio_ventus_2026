import { getDances } from '@/lib/sanity';
import { PageIntro, TrialBanner } from '@/components/ui';
import { ClassExplorer } from '@/components/class-explorer';
export const metadata = { title: 'Tečajevi plesa', description: 'Istraži plesne programe studija Ventus: društveni plesovi, latino, prvi ples, balet, jazz i ples za djecu i mlade.', alternates: { canonical: '/classes' } };
export const revalidate = 120;
export default async function Classes() { const dances = await getDances(); return <><PageIntro label="Tečajevi" title="ZA SVAKOG" accent="POSTOJI RITAM." text="Nije važno koliko koraka znaš. Važno je pronaći ples zbog kojeg se želiš pokrenuti. Istraži programe i pronađi svoj." /><section className="container section-tight"><ClassExplorer dances={dances} /></section><TrialBanner /></>; }

import { getDances, getSchedules } from '@/lib/sanity';
import { PageIntro } from '@/components/ui';
import { ScheduleExplorer } from '@/components/schedule-explorer';
import { InquiryForm } from '@/components/inquiry-form';
import { Pricing } from '@/components/pricing';
import { Check } from 'lucide-react';
export const metadata = { title: 'Raspored i cjenik', description: 'Aktualni raspored, lokacije i cijene plesnih tečajeva studija Ventus. Prijavi se za prve dvije besplatne grupne lekcije.', alternates: { canonical: '/schedule' } };
export const revalidate = 120;
export default async function SchedulePage() { const [schedules, dances] = await Promise.all([getSchedules(), getDances()]); return <><PageIntro label="Raspored" title="TVOJE VRIJEME" accent="ZA PLES." text="Jedan termin u tjednu može promijeniti cijeli njegov ritam. Pronađi svoju grupu, lokaciju i trenutak za sebe." /><section className="container section-tight"><ScheduleExplorer schedules={schedules} /></section><Pricing /><section className="signup-section" id="free-lesson"><div className="container signup-grid"><div className="signup-copy"><span className="eyebrow">JEDNA PRIJAVA. NOVA PRIČA.</span><h2>PRVI KORAK<br />JE <span>NA NAMA.</span></h2><p>Dođi upoznati ekipu, osjetiti atmosferu i isprobati program koji te zanima. Prve dvije grupne lekcije poklanjamo mi.</p><ul><li><Check size={18} /> Bez obveze upisa</li><li><Check size={18} /> Zajedno biramo odgovarajuću grupu</li><li><Check size={18} /> Dobrodošli su potpuni početnici</li></ul><span className="signup-doodle" aria-hidden="true">see you<br /><i>on the floor ↗</i></span></div><InquiryForm programs={dances.map(d => d.name.trim())} /></div></section></>; }

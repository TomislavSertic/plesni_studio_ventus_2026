import { getPosts } from '@/lib/sanity';
import { EmptyState, PageIntro, StoryCard, TrialBanner } from '@/components/ui';
export const metadata = { title: 'Novosti', description: 'Priče, savjeti i novosti iz plesnog studija Ventus. Zavirite u naš plesni svijet.', alternates: { canonical: '/news' } };
export const revalidate = 120;
export default async function News() { const posts = await getPosts(); return <><PageIntro label="Novosti" title="PRIČE KOJE NAS" accent="POKREĆU." text="Malo inspiracije, malo života iz studija i puno ljubavi prema plesu. Dobro došao/la u naš ritam." /><section className="container section-tight">{posts.length ? <div className="story-grid">{posts.map(p => <StoryCard key={p._id} story={p} />)}</div> : <EmptyState>Nove priče stižu uskoro. U međuvremenu, vidimo se na podiju.</EmptyState>}</section><TrialBanner /></>; }

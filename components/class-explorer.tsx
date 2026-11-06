'use client';
import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { DanceCard } from './ui';
import type { Dance } from '@/lib/types';
export function ClassExplorer({ dances }: { dances: Dance[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Sve');
  const options = ['Sve', ...new Set(dances.flatMap(dance => dance.teachingOptions || []))];
  const filtered = useMemo(() => dances.filter(dance => (filter === 'Sve' || dance.teachingOptions?.includes(filter)) && dance.name.toLocaleLowerCase('hr').includes(search.toLocaleLowerCase('hr'))), [dances, filter, search]);
  return <><div className="explorer-toolbar"><div className="filter-pills" aria-label="Način poduke">{options.map(option => <button type="button" key={option} onClick={() => setFilter(option)} aria-pressed={filter === option}>{option}</button>)}</div><label className="search-field"><Search size={18} /><span className="sr-only">Pretraži plesove</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pronađi svoj ples..." />{search && <button aria-label="Očisti pretragu" onClick={() => setSearch('')}><X size={16} /></button>}</label></div><p className="results-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'program' : 'programa'} za tvoj sljedeći korak</p><div className="dance-grid">{filtered.map((dance, i) => <DanceCard key={dance._id} dance={dance} index={i} />)}</div>{!filtered.length && <div className="empty-state"><p>Nema programa za ovu pretragu.</p><button className="button" onClick={() => { setFilter('Sve'); setSearch(''); }}>Prikaži sve programe</button></div>}</>;
}

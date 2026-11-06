'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin, SlidersHorizontal } from 'lucide-react';
import type { Schedule } from '@/lib/types';
const weekdays = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];
export function ScheduleExplorer({ schedules, compact = false }: { schedules: Schedule[]; compact?: boolean }) {
  const [selected, setSelected] = useState(schedules[0]?._id || '');
  const [day, setDay] = useState('Svi dani');
  const [location, setLocation] = useState('Sve lokacije');
  const [level, setLevel] = useState('Sve razine');
  const schedule = schedules.find(s => s._id === selected) || schedules[0];
  const all = useMemo(() => (schedule?.days || []).flatMap(d => (d.classes || []).filter(c => c.enabled !== false && (c.className || c.class)).map(c => ({ ...c, className: c.className || c.class || '', day: d.day }))).sort((a, b) => weekdays.indexOf(a.day) - weekdays.indexOf(b.day) || (a.timeStart || '').localeCompare(b.timeStart || '')), [schedule]);
  const locations = [...new Set(all.map(c => c.location).filter(Boolean))];
  const levels = [...new Set(all.map(c => c.level).filter(Boolean))];
  const filtered = all.filter(c => (day === 'Svi dani' || c.day === day) && (location === 'Sve lokacije' || c.location === location) && (level === 'Sve razine' || c.level === level));
  const shown = compact ? filtered.slice(0, 3) : filtered;
  return <div className={`schedule-explorer ${compact ? 'compact' : ''}`}>
    {!schedules.length ? <div className="empty-state"><CalendarDays size={32} /><p>Raspored je u pripremi. Javi nam se i zajedno ćemo pronaći tvoj termin.</p><Link className="button" href="/contact">Dogovori termin <ArrowUpRight size={18} /></Link></div> : <>
      {!compact && <div className="schedule-filters"><label><span>ODABERI RASPORED</span><select value={selected} onChange={e => { setSelected(e.target.value); setLocation('Sve lokacije'); setLevel('Sve razine'); setDay('Svi dani'); }}>{schedules.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}</select></label><label><span>LOKACIJA</span><select value={location} onChange={e => setLocation(e.target.value)}><option>Sve lokacije</option>{locations.map(l => <option key={l}>{l}</option>)}</select></label><label><span>RAZINA</span><select value={level} onChange={e => setLevel(e.target.value)}><option>Sve razine</option>{levels.filter(l => l !== 'Sve razine').map(l => <option key={l}>{l}</option>)}</select></label><SlidersHorizontal className="filter-icon" size={22} /></div>}
      <div className="day-tabs" aria-label="Filtriraj po danu">{['Svi dani', ...weekdays].map(d => <button key={d} type="button" onClick={() => setDay(d)} aria-pressed={day === d}>{d === 'Svi dani' ? 'Cijeli tjedan' : d}<span>{d === 'Svi dani' ? all.length : all.filter(c => c.day === d).length}</span></button>)}</div>
      <div className="schedule-list" aria-live="polite">{shown.map((c, i) => <div className="schedule-row" key={`${c.day}-${c._key || i}`}><div className="schedule-day"><CalendarDays size={17} /><span>{c.day}</span></div><div className="schedule-time">{c.timeStart}<span>{c.timeEnd}</span></div><div className="schedule-name"><h3>{c.className}</h3>{c.note && <p>{c.note}</p>}{c.instructorName && <p>{c.instructorName}</p>}{typeof c.capacity === 'number' && <p>Kapacitet: {c.capacity} mjesta</p>}</div><div className="schedule-location">{c.level && <span className="level-tag">{c.level}</span>}{c.location && <span><MapPin size={13} />{[c.location, c.room].filter(Boolean).join(' · ')}</span>}</div><Link className="schedule-signup" href={`/schedule?program=${encodeURIComponent(c.className)}#free-lesson`} aria-label={`Prijavi se: ${c.className}, ${c.day} ${c.timeStart}`}><span>Prijavi se</span><ArrowUpRight size={20} /></Link></div>)}</div>
      {!shown.length && <div className="empty-state"><p>Nema termina za odabrane filtre.</p><button className="text-link" onClick={() => { setDay('Svi dani'); setLevel('Sve razine'); setLocation('Sve lokacije'); }}>Prikaži sve termine <ArrowUpRight size={16} /></button></div>}
      <div className="schedule-note"><span className="status-dot" />Termini i lokacije iz aktualnog rasporeda studija.{compact && <Link className="text-link" href="/schedule">Cijeli raspored <ArrowUpRight size={16} /></Link>}</div>
    </>}
  </div>;
}

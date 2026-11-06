'use client';
import '@sanity/ui/styles.css';
import { useEffect, useState } from 'react';
import { Box, Button, Card, Dialog, Flex, Stack, Text } from '@sanity/ui';
import { ArrowRight, CalendarDays, Copy, GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { insert, set, setIfMissing, unset, useClient, useFormValue, isArrayOfObjectsInputProps, type InputProps } from 'sanity';
import styled from 'styled-components';
import { appendSlot, endTime, LEVELS, moveSlot, overlaps, slotErrors, slotFieldPatches, slotName, WEEKDAYS, type EditorDay, type EditorPatch, type EditorSlot } from '../../lib/schedule-editor';

type Option = { _id: string; name: string };
type Defaults = { location?: string; room?: string; duration?: number; level?: string };
type Editor = { day: string; dayKey?: string; original?: EditorSlot; slot: EditorSlot };
const newKey = () => crypto.randomUUID().replace(/-/g, '').slice(0, 20);
const MIME = 'application/x-ventus-schedule';
const Styles = styled.div`
  font-size:13px;line-height:1.5;
  .board-help{margin:0;color:inherit;opacity:.7;font-size:12px;line-height:1.7}
  .week-board{display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:12px;margin-top:16px;align-items:start}
  .week-day{border:1px solid #8884;border-radius:9px;padding:12px;min-height:190px;background:#88888808;transition:background .15s}
  .week-day.drag-over{background:#f2643620;border-color:#f26436}
  .day-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 13px;font-size:14px;font-family:inherit;font-weight:700}
  .day-title small{font-size:11px;opacity:.5;font-weight:400}
  .slot-card{padding:13px;border:1px solid #8884;border-left:3px solid #f26436;border-radius:6px;margin-bottom:10px;background:var(--card-bg-color,#fff);color:var(--card-fg-color,#222);cursor:grab}
  .slot-card:active{cursor:grabbing}.slot-card.hidden-slot{opacity:.65;border-left-color:#888}.slot-card.dragging{opacity:.35}
  .slot-time{display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:12px;color:var(--card-fg-color,inherit)}
  .slot-card h4{font-family:inherit;font-weight:600;font-size:14px;line-height:1.5;margin:9px 0 5px;overflow-wrap:anywhere}
  .slot-detail{font-size:11px;margin:3px 0;opacity:.7;color:inherit;overflow-wrap:anywhere}
  .slot-actions{display:flex;gap:3px;flex-wrap:wrap;align-items:center;border-top:1px solid #8883;padding-top:9px;margin-top:11px}
  .slot-action{display:inline-flex;gap:4px;align-items:center;border:0;border-radius:4px;background:transparent;color:inherit;padding:7px;cursor:pointer;font:inherit;font-size:10px;min-height:32px}
  .slot-action:hover{background:#8882}.slot-action.danger{color:#c23928}.slot-action:disabled{opacity:.4;cursor:not-allowed}
  .move-label{display:flex;align-items:center;gap:5px;width:100%;margin-top:5px;font-size:10px}
  .move-label select{width:100%;min-width:0;border:1px solid #8884;border-radius:4px;padding:7px;background:var(--card-bg-color,#fff);color:inherit;font:inherit}
  .board-warning{border:1px solid #c9953b70;background:#dbac3820;padding:10px;border-radius:5px;font-size:11px;line-height:1.6;margin:10px 0;color:inherit}
  .board-empty{font-size:11px;opacity:.55;margin:20px 0;line-height:1.6;color:inherit}
  .board-status{font-size:12px;min-height:20px;margin:10px 0;color:inherit}
  .slot-form{padding:24px;display:grid;gap:16px;max-height:75vh;overflow:auto}
  .slot-form label{display:block;font-size:12px;font-weight:600;line-height:1.6}
  .slot-form input:not([type=checkbox]),.slot-form select,.slot-form textarea{width:100%;margin-top:6px;box-sizing:border-box;padding:11px 12px;border:1px solid #8886;border-radius:5px;font:inherit;font-size:14px;background:var(--card-bg-color,#fff);color:var(--card-fg-color,#222)}
  .slot-form textarea{min-height:70px;resize:vertical}.slot-form .field-pair{display:grid;grid-template-columns:1fr 1fr;gap:15px}
  .slot-form .switch-label{display:flex;align-items:center;gap:10px}.slot-form .switch-label input{width:17px;height:17px;accent-color:#f26436}
  .slot-form .form-hint{font-size:11px;opacity:.65;color:inherit;margin:4px 0 0}.slot-form .form-error{color:#b42e20;background:#c8342020;font-size:12px;padding:12px;margin:0;border-radius:5px}
  .slot-form .actions{display:flex;justify-content:flex-end;gap:10px;padding-top:8px;position:sticky;bottom:-24px;background:var(--card-bg-color,#fff);padding-bottom:10px}
  @media(max-width:500px){.slot-form{padding:18px}.slot-form .field-pair{grid-template-columns:1fr}.week-board{grid-template-columns:1fr}.slot-form input:not([type=checkbox]),.slot-form select,.slot-form textarea{font-size:16px}}
`;

export function ScheduleBoardInput(props: InputProps) {
  const client = useClient({ apiVersion: '2025-01-01' });
  const defaultLocation = useFormValue(['defaultLocation']) as string | undefined;
  const defaultRoom = useFormValue(['defaultRoom']) as string | undefined;
  const defaultDuration = useFormValue(['defaultDuration']) as number | undefined;
  const defaultLevel = useFormValue(['defaultLevel']) as string | undefined;
  const [catalog, setCatalog] = useState<{ dances: Option[]; instructors: Option[] }>({ dances: [], instructors: [] });
  const [catalogError, setCatalogError] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  useEffect(() => {
    let active = true;
    client.fetch('{"dances": *[_type == "dances" && teaching == true] | order(name asc){_id,name},"instructors":*[_type == "instructors" && show == true] | order(name asc){_id,"name":name + " " + coalesce(surname, "")}}', {}, { perspective: 'published' })
      .then(result => { if (active) { setCatalog(result); setCatalogError(false); } }).catch(() => { if (active) setCatalogError(true); });
    return () => { active = false; };
  }, [client]);
  function change(patches: EditorPatch[]) {
    if (props.readOnly || !patches.length) return;
    props.onChange(patches.map(p => p.type === 'set' ? set(p.value, p.path) : p.type === 'setIfMissing' ? setIfMissing(p.value, p.path) : p.type === 'unset' ? unset(p.path) : insert(p.items, p.position, p.path)));
  }
  if (!isArrayOfObjectsInputProps(props)) return props.renderDefault(props);
  return <Stack gap={3}>
    <Flex justify="flex-end"><Button mode="ghost" fontSize={1} text={advanced ? 'Natrag na pregled tjedna' : 'Klasični uređivač'} onClick={() => setAdvanced(!advanced)} /></Flex>
    {catalogError && <Card tone="caution" padding={3} radius={2}><Text size={1}>Popis plesova i instruktora trenutačno nije dostupan. Termine možeš unositi ručno.</Text></Card>}
    {advanced ? props.renderDefault(props) : <ScheduleBoard value={(props.value || []) as EditorDay[]} onChange={change} readOnly={props.readOnly} catalog={catalog} defaults={{ location: defaultLocation, room: defaultRoom, duration: defaultDuration, level: defaultLevel }} />}
  </Stack>;
}

export function ScheduleBoard({ value, onChange, readOnly, defaults = {}, catalog = { dances: [], instructors: [] } }: {
  value: EditorDay[]; onChange: (patches: EditorPatch[]) => void; readOnly?: boolean; defaults?: Defaults; catalog?: { dances: Option[]; instructors: Option[] };
}) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [drag, setDrag] = useState<{ dayKey: string; slotKey: string } | null>(null);
  const [over, setOver] = useState('');
  const [deletion, setDeletion] = useState<{ dayKey: string; slot: EditorSlot } | null>(null);
  const duplicateDays = value.some((d, i) => value.findIndex(v => v.day === d.day) !== i);
  function emit(patches: EditorPatch[], message: string) { if (readOnly || !patches.length) return; onChange(patches); setStatus(message); }
  function open(day: string, existing?: EditorSlot, dayKey?: string) {
    if (readOnly) return;
    setErrors([]);
    setEditor({ day, dayKey, original: existing, slot: existing ? { ...existing, className: slotName(existing) } : { _key: newKey(), _type: 'scheduleClass', className: '', timeStart: '18:00', timeEnd: endTime('18:00', defaults.duration || 60), location: defaults.location || '', room: defaults.room || '', level: defaults.level || 'Sve razine', enabled: true } });
  }
  function update(field: string, value: unknown) { setEditor(current => current ? { ...current, slot: { ...current.slot, [field]: value } } : null); }
  function save() {
    if (!editor || readOnly) return;
    const slot = { ...editor.slot, className: slotName(editor.slot), location: editor.slot.location?.trim() };
    const validation = slotErrors(slot);
    if (validation.length) { setErrors(validation); return; }
    if (editor.original && editor.dayKey) {
      const current = value.find(d => d._key === editor.dayKey)?.classes?.find(c => c._key === editor.original?._key);
      if (!current) { setErrors(['Termin je u međuvremenu premješten ili uklonjen. Zatvori prozor i otvori ga ponovno.']); return; }
      emit(slotFieldPatches(editor.dayKey, slot._key, editor.original, slot), `Spremljeno: ${slotName(slot)}.`);
    } else emit(appendSlot(value, editor.day, slot, newKey()), `Dodan termin za ${editor.day.toLowerCase()}.`);
    setEditor(null);
  }
  function move(sourceDayKey: string, slotKey: string, target: string, beforeKey?: string) {
    emit(moveSlot(value, sourceDayKey, slotKey, target, newKey(), beforeKey), `Termin premješten: ${target}.`);
    setDrag(null); setOver('');
  }
  function drop(event: React.DragEvent, target: string, beforeKey?: string) {
    event.preventDefault(); event.stopPropagation(); if (readOnly) return;
    try {
      const source = drag || JSON.parse(event.dataTransfer.getData(MIME));
      if (source && typeof source.dayKey === 'string' && typeof source.slotKey === 'string') move(source.dayKey, source.slotKey, target, beforeKey);
    } catch { setStatus('Termin nije premješten. Pokušaj ponovno ili koristi izbornik Premjesti.'); }
  }
  return <Styles>
    <p className="board-help">Dodaj termin pod željeni dan. Kartice možeš povlačiti između dana; za točno vrijeme otvori „Uredi”. Na mobitelu i tipkovnicom koristi „Premjesti”. Promjene postaju javne tek nakon gumba Publish / Objavi u Studiju. Na stranici se termini unutar dana prikazuju po vremenu.</p>
    {duplicateDays && <div className="board-warning" role="alert">Postoji više unosa za isti dan. Otvori klasični uređivač i objedini ih prije objave.</div>}
    <div className="board-status" role="status" aria-live="polite">{status}</div>
    <div className="week-board">{WEEKDAYS.map(dayName => {
      const days = value.filter(d => d.day === dayName);
      const slots = days.flatMap(d => (d.classes || []).map(slot => ({ dayKey: d._key, slot })));
      const warnings = overlaps(slots.map(s => s.slot));
      return <section key={dayName} className={`week-day ${over === dayName ? 'drag-over' : ''}`} aria-label={dayName}
        onDragOver={e => { if (!readOnly && drag) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOver(dayName); } }} onDrop={e => drop(e, dayName)}>
        <h3 className="day-title"><span>{dayName}</span><small>{slots.length} termina</small></h3>
        {slots.map(({ slot, dayKey }) => <article key={`${dayKey}-${slot._key}`} className={`slot-card ${slot.enabled === false ? 'hidden-slot' : ''} ${drag?.slotKey === slot._key ? 'dragging' : ''}`} draggable={!readOnly} aria-label={`${slotName(slot) || 'Prazan termin'}, ${dayName}`}
          onDragStart={e => { if (readOnly) { e.preventDefault(); return; } const source = { dayKey, slotKey: slot._key }; setDrag(source); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData(MIME, JSON.stringify(source)); }}
          onDragEnd={() => { setDrag(null); setOver(''); }} onDrop={e => drop(e, dayName, slot._key)}>
          <div className="slot-time"><span>{slot.timeStart || '--:--'} – {slot.timeEnd || '--:--'}</span><GripVertical size={15} aria-hidden="true" /></div>
          <h4>{slotName(slot) || 'Prazan stari unos'}</h4><p className="slot-detail">{slot.level || 'Razina nije navedena'}</p><p className="slot-detail">{[slot.location, slot.room].filter(Boolean).join(' · ') || 'Dodaj lokaciju'}</p>
          {slot.instructor && <p className="slot-detail">{catalog.instructors.find(i => i._id === slot.instructor?._ref)?.name || 'Dodijeljen instruktor'}</p>}
          {slot.note && <p className="slot-detail">{slot.note}</p>}{slot.enabled === false && <p className="slot-detail"><strong>Skriven sa stranice</strong></p>}
          <div className="slot-actions"><button type="button" className="slot-action" disabled={readOnly} onClick={() => open(dayName, slot, dayKey)}><Pencil size={12} />Uredi</button><button type="button" className="slot-action" disabled={readOnly} onClick={() => emit(appendSlot(value, dayName, { ...slot, _key: newKey() }, newKey()), 'Termin je dupliciran. Provjeri vrijeme kopije.')} aria-label={`Dupliciraj ${slotName(slot)}`}><Copy size={12} />Kopiraj</button><button type="button" className="slot-action danger" disabled={readOnly} aria-label={`Ukloni ${slotName(slot)}`} onClick={() => setDeletion({ dayKey, slot })}><Trash2 size={12} /></button>
          <label className="move-label"><ArrowRight size={12} /><span>Premjesti</span><select aria-label={`Premjesti ${slotName(slot)} u dan`} value="" disabled={readOnly} onChange={e => { if (e.target.value) move(dayKey, slot._key, e.target.value); }}><option value="">Odaberi dan...</option>{WEEKDAYS.filter(d => d !== dayName).map(d => <option key={d}>{d}</option>)}</select></label></div>
        </article>)}
        {!slots.length && <p className="board-empty">Slobodan dan.<br />Dodaj ili dovuci termin ovdje.</p>}
        {!!warnings.length && <div className="board-warning">{warnings.map((w, i) => <div key={i}>{w}</div>)}</div>}
        <Button mode="ghost" icon={Plus} text="Dodaj termin" fontSize={1} disabled={readOnly} onClick={() => open(dayName)} />
      </section>;
    })}</div>
    {editor && <Dialog id="ventus-slot-editor" header={`${editor.original ? 'Uredi' : 'Novi'} termin · ${editor.day}`} width={1} onClose={() => setEditor(null)}><Styles><div className="slot-form">
      <label>Ples / program<select value={editor.slot.classRef?._ref || ''} onChange={e => {
        const selected = catalog.dances.find(d => d._id === e.target.value);
        setEditor(current => current ? { ...current, slot: { ...current.slot, classRef: selected ? { _type: 'reference', _ref: selected._id } : undefined, className: !slotName(current.slot) && selected ? selected.name : current.slot.className } } : null);
      }}><option value="">Ručni unos / bez poveznice</option>{editor.slot.classRef && !catalog.dances.some(d => d._id === editor.slot.classRef?._ref) && <option value={editor.slot.classRef._ref}>Postojeći odabrani program</option>}{catalog.dances.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}</select></label>
      <label>Naziv termina *<input autoFocus value={editor.slot.className || ''} onChange={e => update('className', e.target.value)} placeholder="npr. Samba — početna grupa" maxLength={140} /></label>
      <div className="field-pair"><label>Početak *<input type="time" value={editor.slot.timeStart || ''} onChange={e => {
        const time = e.target.value; setEditor(current => current ? { ...current, slot: { ...current.slot, timeStart: time, timeEnd: !current.slot.timeEnd || current.slot.timeEnd === endTime(current.slot.timeStart || '', defaults.duration || 60) ? endTime(time, defaults.duration || 60) : current.slot.timeEnd } } : null);
      }} /></label><label>Završetak *<input type="time" value={editor.slot.timeEnd || ''} onChange={e => update('timeEnd', e.target.value)} /></label></div>
      <label>Lokacija *<input value={editor.slot.location || ''} onChange={e => update('location', e.target.value)} placeholder="Adresa ili naziv lokacije" maxLength={200} /></label>
      <div className="field-pair"><label>Dvorana<input value={editor.slot.room || ''} onChange={e => update('room', e.target.value)} placeholder="npr. Dvorana A" maxLength={80} /></label><label>Razina<select value={editor.slot.level || ''} onChange={e => update('level', e.target.value)}><option value="">Bez oznake razine</option>{editor.slot.level && !LEVELS.includes(editor.slot.level) && <option>{editor.slot.level}</option>}{LEVELS.map(l => <option key={l}>{l}</option>)}</select></label></div>
      <div className="field-pair"><label>Instruktor<select value={editor.slot.instructor?._ref || ''} onChange={e => update('instructor', e.target.value ? { _type: 'reference', _ref: e.target.value } : undefined)}><option value="">Bez dodijeljenog instruktora</option>{editor.slot.instructor && !catalog.instructors.some(i => i._id === editor.slot.instructor?._ref) && <option value={editor.slot.instructor._ref}>Postojeći instruktor</option>}{catalog.instructors.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}</select></label><label>Broj mjesta<input type="number" min={1} step={1} value={editor.slot.capacity ?? ''} onChange={e => update('capacity', e.target.value === '' ? undefined : Number(e.target.value))} /><span className="form-hint">Ukupan kapacitet grupe, ne preostala mjesta.</span></label></div>
      <label>Napomena za polaznike<textarea value={editor.slot.note || ''} onChange={e => update('note', e.target.value)} maxLength={500} /></label>
      <label className="switch-label"><input type="checkbox" checked={editor.slot.enabled !== false} onChange={e => update('enabled', e.target.checked)} />Prikaži ovaj termin na stranici</label>
      {!!errors.length && <div className="form-error" role="alert">{errors.map(error => <div key={error}>{error}</div>)}</div>}
      <div className="actions"><Button text="Odustani" mode="ghost" onClick={() => setEditor(null)} /><Button text={editor.original ? 'Spremi termin' : 'Dodaj termin'} tone="primary" onClick={save} /></div>
    </div></Styles></Dialog>}
    {deletion && <Dialog id="ventus-slot-delete" header="Ukloniti termin?" width={0} onClose={() => setDeletion(null)}><Box padding={4}><Stack gap={4}><Text size={1}>Uklanjaš „{slotName(deletion.slot) || 'Prazan termin'}” iz ovog rasporeda. Ostali termini se ne mijenjaju.</Text><Flex gap={2} justify="flex-end"><Button text="Odustani" mode="ghost" onClick={() => setDeletion(null)} /><Button text="Ukloni termin" tone="critical" onClick={() => { emit([{ type: 'unset', path: [{ _key: deletion.dayKey }, 'classes', { _key: deletion.slot._key }] }], 'Termin je uklonjen.'); setDeletion(null); }} /></Flex></Stack></Box></Dialog>}
  </Styles>;
}

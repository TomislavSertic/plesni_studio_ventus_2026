export const WEEKDAYS = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];
export const LEVELS = ['Početna razina', 'Srednja razina', 'Napredna razina', 'Sve razine'];
export type EditorSlot = { _key: string; _type: string; className?: string; class?: string; timeStart?: string; timeEnd?: string; location?: string; room?: string; note?: string; level?: string; enabled?: boolean; capacity?: number; classRef?: { _type: 'reference'; _ref: string }; instructor?: { _type: 'reference'; _ref: string }; [key: string]: unknown };
export type EditorDay = { _key: string; _type: string; day: string; classes?: EditorSlot[]; [key: string]: unknown };
export type KeyPath = (string | number | { _key: string })[];
export type EditorPatch = { type: 'set'; path: KeyPath; value: unknown } | { type: 'setIfMissing'; path: KeyPath; value: unknown } | { type: 'unset'; path: KeyPath } | { type: 'insert'; path: KeyPath; position: 'before' | 'after'; items: unknown[] };
export const slotName = (slot: EditorSlot) => (slot.className || slot.class || '').trim();
export function timeMinutes(value?: string) { if (!value || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null; const [h, m] = value.split(':').map(Number); return h * 60 + m; }
export function endTime(start: string, duration: number) { const minutes = timeMinutes(start); if (minutes === null || !Number.isFinite(duration) || minutes + duration >= 1440) return ''; const end = minutes + duration; return `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`; }
export function slotErrors(slot: EditorSlot) {
  const errors: string[] = [];
  if (!slotName(slot)) errors.push('Upiši naziv termina ili odaberi ples.');
  const start = timeMinutes(slot.timeStart), end = timeMinutes(slot.timeEnd);
  if (start === null || end === null) errors.push('Unesi vrijeme početka i završetka u obliku HH:MM.');
  else if (end <= start) errors.push('Završetak mora biti nakon početka, unutar istog dana.');
  if (!slot.location?.trim()) errors.push('Unesi lokaciju treninga.');
  if (slot.capacity !== undefined && (!Number.isInteger(slot.capacity) || slot.capacity < 1)) errors.push('Broj mjesta mora biti cijeli broj veći od nule.');
  return errors;
}
export function overlaps(slots: EditorSlot[]) {
  const warnings: string[] = [];
  const active = slots.filter(slot => slot.enabled !== false && slotName(slot));
  for (let i = 0; i < active.length; i++) for (let j = i + 1; j < active.length; j++) {
    const a = active[i], b = active[j];
    const as = timeMinutes(a.timeStart), ae = timeMinutes(a.timeEnd), bs = timeMinutes(b.timeStart), be = timeMinutes(b.timeEnd);
    if (as === null || ae === null || bs === null || be === null || as >= be || bs >= ae) continue;
    const samePlace = (a.location || '').trim().toLowerCase() === (b.location || '').trim().toLowerCase() && (a.room || '').trim().toLowerCase() === (b.room || '').trim().toLowerCase();
    const sameTeacher = a.instructor?._ref && a.instructor._ref === b.instructor?._ref;
    if (samePlace || sameTeacher) warnings.push(`${slotName(a)} i ${slotName(b)}: preklapanje ${sameTeacher ? 'instruktora' : 'lokacije i dvorane'}.`);
  }
  return warnings;
}
const dayPath = (day: EditorDay): KeyPath => [{ _key: day._key }, 'classes'];
export function appendSlot(days: EditorDay[], dayName: string, slot: EditorSlot, newDayKey: string): EditorPatch[] {
  if (!WEEKDAYS.includes(dayName)) throw new Error('Nepoznat dan rasporeda.');
  const day = days.find(d => d.day === dayName);
  if (!day) return [{ type: 'setIfMissing', path: [], value: [] }, { type: 'insert', path: [-1], position: 'after', items: [{ _key: newDayKey, _type: 'daySchedule', day: dayName, classes: [slot] }] }];
  return [{ type: 'setIfMissing', path: dayPath(day), value: [] }, { type: 'insert', path: [...dayPath(day), -1], position: 'after', items: [slot] }];
}
export function moveSlot(days: EditorDay[], sourceDayKey: string, slotKey: string, targetDay: string, newDayKey: string, beforeKey?: string): EditorPatch[] {
  const source = days.find(d => d._key === sourceDayKey);
  const slot = source?.classes?.find(c => c._key === slotKey);
  if (!source || !slot || !WEEKDAYS.includes(targetDay)) return [];
  const target = days.find(d => d.day === targetDay);
  if (target?._key === source._key && (!beforeKey || beforeKey === slotKey)) return [];
  if (beforeKey && !target?.classes?.some(c => c._key === beforeKey)) return [];
  const remove: EditorPatch = { type: 'unset', path: [...dayPath(source), { _key: slotKey }] };
  if (target && beforeKey) return [remove, { type: 'insert', path: [...dayPath(target), { _key: beforeKey }], position: 'before', items: [slot] }];
  return [remove, ...appendSlot(days, targetDay, slot, newDayKey)];
}
export function slotFieldPatches(dayKey: string, slotKey: string, before: EditorSlot, after: EditorSlot): EditorPatch[] {
  const fields = ['className', 'timeStart', 'timeEnd', 'level', 'location', 'room', 'note', 'enabled', 'capacity', 'classRef', 'instructor'];
  return fields.filter(field => JSON.stringify(before[field]) !== JSON.stringify(after[field])).map(field => {
    const path: KeyPath = [{ _key: dayKey }, 'classes', { _key: slotKey }, field];
    return after[field] === undefined || after[field] === '' ? { type: 'unset' as const, path } : { type: 'set' as const, path, value: after[field] };
  });
}

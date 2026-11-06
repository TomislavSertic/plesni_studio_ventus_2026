import { defineField, defineType } from 'sanity';
import { LEVELS, slotErrors } from '../lib/schedule-editor';
export const scheduleFields = [
  defineField({ name: 'className', title: 'Naziv termina', type: 'string', description: 'Primjer: Samba — početna grupa.' }),
  defineField({ name: 'class', title: 'Stari naziv termina', type: 'string', hidden: true }),
  defineField({ name: 'classRef', title: 'Ples / program', type: 'reference', to: [{ type: 'dances' }] }),
  defineField({ name: 'timeStart', title: 'Početak (HH:MM)', type: 'string', validation: r => r.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: 'vrijeme HH:MM' }) }),
  defineField({ name: 'timeEnd', title: 'Završetak (HH:MM)', type: 'string', validation: r => r.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: 'vrijeme HH:MM' }) }),
  defineField({ name: 'location', title: 'Lokacija', type: 'string', validation: r => r.required() }),
  defineField({ name: 'room', title: 'Dvorana', type: 'string', description: 'Neobavezno. Razlikuje istovremene treninge na istoj adresi.' }),
  defineField({ name: 'level', title: 'Razina', type: 'string', options: { list: LEVELS }, initialValue: 'Sve razine' }),
  defineField({ name: 'instructor', title: 'Instruktor', type: 'reference', to: [{ type: 'instructors' }] }),
  defineField({ name: 'capacity', title: 'Broj mjesta', type: 'number', validation: r => r.integer().min(1), description: 'Informativni kapacitet grupe; ne predstavlja broj preostalih mjesta.' }),
  defineField({ name: 'note', title: 'Napomena za polaznike', type: 'string', description: 'Primjer: Početak nove grupe 15. rujna.' }),
  defineField({ name: 'enabled', title: 'Prikaži termin na stranici', type: 'boolean', initialValue: true }),
  defineField({ name: 'slug', title: 'Stara poveznica', type: 'string', hidden: true }),
];
export default defineType({ name: 'scheduleClass', title: 'Termin treninga', type: 'object', fields: scheduleFields,
  validation: r => r.custom(value => { if (!value) return true; const errors = slotErrors(value as Parameters<typeof slotErrors>[0]); return errors.length ? errors.join(' ') : true; }),
  preview: { select: { title: 'className', legacy: 'class', start: 'timeStart', end: 'timeEnd', enabled: 'enabled' }, prepare({ title, legacy, start, end, enabled }) { return { title: title || legacy || 'Novi termin', subtitle: `${start || '--:--'} – ${end || '--:--'}${enabled === false ? ' · Skriveno' : ''}` }; } },
});

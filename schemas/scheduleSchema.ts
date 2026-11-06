import { defineField, defineType } from 'sanity';
import { ScheduleBoardInput } from '../components/studio/schedule-board-input';
import { WEEKDAYS } from '../lib/schedule-editor';
export default defineType({
  name: 'scheduleSchema', title: 'Raspored', type: 'document',
  groups: [{ name: 'schedule', title: 'Tjedni raspored', default: true }, { name: 'settings', title: 'Postavke i objava' }],
  initialValue: () => ({ enabled: true, isMain: false, displayOrder: 0, defaultDuration: 60, defaultLevel: 'Sve razine', days: WEEKDAYS.map((day, i) => ({ _key: `day-${i}`, _type: 'daySchedule', day, classes: [] })) }),
  fields: [
    defineField({ name: 'title', title: 'Naziv rasporeda', type: 'string', group: ['schedule', 'settings'], description: 'Primjer: Zagreb — grupni treninzi ili Privatne lekcije.', validation: r => r.required() }),
    defineField({ name: 'days', title: 'Složi tjedan', type: 'array', group: 'schedule', of: [{ type: 'daySchedule' }], components: { input: ScheduleBoardInput }, validation: r => r.custom(days => {
      const names = (days || []).map(d => (d as { day?: string }).day);
      return new Set(names).size === names.length ? true : 'Svaki dan smije biti dodan samo jednom. Premjesti termine u jednu karticu tog dana.';
    }) }),
    defineField({ name: 'enabled', title: 'Prikaži raspored na stranici', type: 'boolean', group: 'settings', initialValue: true, description: 'Isključi i objavi promjene da sakriješ cijeli raspored bez brisanja termina.' }),
    defineField({ name: 'isMain', title: 'Glavni raspored', type: 'boolean', group: 'settings', initialValue: false, description: 'Glavni raspored prikazuje se prvi i koristi se na naslovnici. Pri promjeni glavnog rasporeda isključi ovu postavku na prethodnom.' }),
    defineField({ name: 'displayOrder', title: 'Redoslijed prikaza', type: 'number', group: 'settings', initialValue: 0, description: 'Manji broj ide prvi; glavni raspored uvijek ima prednost.', validation: r => r.integer().min(0) }),
    defineField({ name: 'validFrom', title: 'Prikaži od datuma', type: 'date', group: 'settings', description: 'Neobavezno. Prije ovog datuma raspored nije vidljiv posjetiteljima.' }),
    defineField({ name: 'validUntil', title: 'Prikaži zaključno do datuma', type: 'date', group: 'settings', validation: r => r.custom((value, context) => !value || !context.document?.validFrom || value >= String(context.document.validFrom) ? true : 'Završni datum mora biti isti ili kasniji od početnog.'), description: 'Neobavezno. Nakon ovog datuma raspored se automatski skriva.' }),
    defineField({ name: 'defaultLocation', title: 'Zadana lokacija novih termina', type: 'string', group: 'settings', description: 'Popunjava nove termine; postojeće lokacije ostaju kako su unesene.' }),
    defineField({ name: 'defaultRoom', title: 'Zadana dvorana novih termina', type: 'string', group: 'settings' }),
    defineField({ name: 'defaultDuration', title: 'Zadano trajanje (minute)', type: 'number', group: 'settings', initialValue: 60, validation: r => r.integer().min(5).max(480), description: 'Uređivač predlaže završetak na temelju vremena početka. Svaki termin može imati drugo trajanje.' }),
    defineField({ name: 'defaultLevel', title: 'Zadana razina novih termina', type: 'string', group: 'settings', options: { list: ['Početna razina', 'Srednja razina', 'Napredna razina', 'Sve razine'] }, initialValue: 'Sve razine' }),
  ],
  orderings: [{ title: 'Glavni i redoslijed', name: 'mainFirst', by: [{ field: 'isMain', direction: 'desc' }, { field: 'displayOrder', direction: 'asc' }, { field: 'title', direction: 'asc' }] }],
  preview: { select: { title: 'title', isMain: 'isMain', enabled: 'enabled' }, prepare({ title, isMain, enabled }) { return { title, subtitle: enabled === false ? 'Skriven sa stranice' : isMain ? 'Glavni raspored' : 'Dodatni raspored' }; } },
});

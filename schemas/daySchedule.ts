import { defineField, defineType } from 'sanity';
import { WEEKDAYS, overlaps, type EditorSlot } from '../lib/schedule-editor';
export default defineType({ name: 'daySchedule', title: 'Dan u tjednu', type: 'object', fields: [
  defineField({ name: 'day', title: 'Dan', type: 'string', options: { list: WEEKDAYS }, validation: r => r.required() }),
  defineField({ name: 'classes', title: 'Termini', type: 'array', of: [{ type: 'scheduleClass' }, { type: 'classEntry' }], validation: r => r.custom(value => { const warnings = overlaps((value || []) as EditorSlot[]); return warnings.length ? warnings.join(' ') : true; }).warning() }),
  defineField({ name: 'numberOfClasses', title: 'Stari broj termina', type: 'number', hidden: true, readOnly: true }),
], preview: { select: { title: 'day', classes: 'classes' }, prepare({ title, classes }) { return { title, subtitle: `${classes?.length || 0} termina` }; } } });

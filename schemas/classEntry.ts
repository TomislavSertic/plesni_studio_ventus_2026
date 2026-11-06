import { defineType } from 'sanity';
import { scheduleFields } from './scheduleClass';
import { slotErrors, slotName, type EditorSlot } from '../lib/schedule-editor';
// Retained for existing records. Newly added slots use scheduleClass.
export default defineType({ name: 'classEntry', title: 'Termin (stariji zapis)', type: 'object', fields: scheduleFields.map(field => ({ ...field, validation: undefined })),
  validation: r => r.custom(value => { if (!value || !slotName(value as EditorSlot)) return true; const errors = slotErrors(value as EditorSlot); return errors.length ? errors.join(' ') : true; }),
  preview: { select: { title: 'className', legacy: 'class', time: 'timeStart' }, prepare({ title, legacy, time }) { return { title: title || legacy || 'Prazan stari unos', subtitle: time }; } },
});

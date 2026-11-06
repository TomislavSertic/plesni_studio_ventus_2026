import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore -- explicit source extension for Node type stripping.
import { appendSlot, endTime, moveSlot, overlaps, slotErrors, slotFieldPatches } from '../lib/schedule-editor.ts';
// @ts-ignore -- explicit source extension for Node type stripping.
import { applyEditorPatches } from './apply-editor-patches.ts';
const slot = { _key: 'samba', _type: 'scheduleClass', className: 'Samba', timeStart: '18:00', timeEnd: '19:00', location: 'Zagreb', room: 'A', enabled: true };
const document = () => ({ _id: 'test', _type: 'scheduleSchema', extra: 'preserve me', days: [{ _key: 'mon', _type: 'daySchedule', day: 'Ponedjeljak', classes: [slot] }, { _key: 'tue', _type: 'daySchedule', day: 'Utorak', classes: [{ ...slot, _key: 'jazz', className: 'Jazz' }] }] });
test('first slot can initialize a completely empty schedule', () => {
  const result = applyEditorPatches({ _id: 'test', _type: 'scheduleSchema' }, appendSlot([], 'Petak', slot, 'fri'));
  assert.equal(result.days?.[0].day, 'Petak'); assert.equal(result.days?.[0].classes?.[0]._key, 'samba');
});
test('moving a slot preserves its fields and all unrelated content', () => {
  const doc = document();
  const result = applyEditorPatches(doc, moveSlot(doc.days, 'mon', 'samba', 'Utorak', 'unused'));
  assert.equal(result.days?.[0].classes?.length, 0);
  assert.deepEqual(result.days?.[1].classes, [doc.days[1].classes[0], slot]);
  assert.equal(result.extra, 'preserve me'); assert.equal(doc.days[0].classes.length, 1);
});
test('moving to a previously absent day creates that day exactly once', () => {
  const doc = document(); const result = applyEditorPatches(doc, moveSlot(doc.days, 'mon', 'samba', 'Subota', 'sat'));
  assert.equal(result.days?.filter(d => d.day === 'Subota').length, 1);
  assert.deepEqual(result.days?.find(d => d.day === 'Subota')?.classes, [slot]);
});
test('keyed insertion supports reordering and ignores stale or invalid drag sources', () => {
  const doc = document(); const result = applyEditorPatches(doc, moveSlot(doc.days, 'mon', 'samba', 'Utorak', 'unused', 'jazz'));
  assert.deepEqual(result.days?.[1].classes?.map(c => c._key), ['samba', 'jazz']);
  assert.deepEqual(moveSlot(doc.days, 'missing', 'samba', 'Utorak', 'unused'), []);
  assert.deepEqual(moveSlot(doc.days, 'mon', 'samba', 'Wrong day', 'unused'), []);
  assert.deepEqual(moveSlot(doc.days, 'mon', 'samba', 'Utorak', 'unused', 'deleted-slot'), []);
});
test('editing a time does not overwrite another editor’s simultaneous note', () => {
  const doc = document(); const original = doc.days[0].classes[0];
  const changed = { ...original, timeEnd: '19:30' };
  const remote = { ...doc, days: doc.days.map(d => d._key === 'mon' ? { ...d, classes: [{ ...original, note: 'Added by another editor' }] } : d) };
  const result = applyEditorPatches(remote, slotFieldPatches('mon', 'samba', original, changed));
  assert.equal(result.days?.[0].classes?.[0].timeEnd, '19:30');
  assert.equal(result.days?.[0].classes?.[0].note, 'Added by another editor');
});
test('invalid times and capacities are rejected; adjacent classes and different rooms are permitted', () => {
  assert.equal(slotErrors(slot).length, 0);
  assert.ok(slotErrors({ ...slot, timeEnd: '17:00' }).length);
  assert.ok(slotErrors({ ...slot, timeStart: '25:00' }).length);
  assert.ok(slotErrors({ ...slot, capacity: 1.5 }).length);
  assert.equal(overlaps([slot, { ...slot, _key: 'b', timeStart: '19:00', timeEnd: '20:00' }]).length, 0);
  assert.equal(overlaps([slot, { ...slot, _key: 'b', room: 'B' }]).length, 0);
  assert.equal(overlaps([slot, { ...slot, _key: 'b' }]).length, 1);
  assert.equal(overlaps([slot, { ...slot, _key: 'b', enabled: false }]).length, 0);
  assert.equal(endTime('18:15', 75), '19:30'); assert.equal(endTime('23:30', 60), '');
});

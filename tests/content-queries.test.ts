import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse, evaluate } from 'groq-js';
// @ts-ignore -- Node requires the explicit TypeScript source extension.
import { SCHEDULES_QUERY, PRICING_QUERY } from '../lib/content-queries.ts';
async function run(query: string, dataset: Record<string, unknown>[]) { return (await evaluate(parse(query), { dataset, params: { today: '2026-11-05' } })).get(); }
test('website honors schedule visibility, date boundaries and main/order settings while preserving legacy records', async () => {
  const base = { _type: 'scheduleSchema', title: 'Raspored', days: [] };
  const dataset = [
    { ...base, _id: 'legacy' },
    { ...base, _id: 'main', isMain: true },
    { ...base, _id: 'ordered', displayOrder: 2 },
    { ...base, _id: 'hidden', enabled: false },
    { ...base, _id: 'expired', validUntil: '2026-11-04' },
    { ...base, _id: 'future', validFrom: '2026-11-06' },
    { ...base, _id: 'drafts.unpublished' },
    { ...base, _id: 'today', validFrom: '2026-11-05', validUntil: '2026-11-05', displayOrder: 1 },
  ];
  const result = await run(SCHEDULES_QUERY, dataset);
  assert.deepEqual(result.map((d: { _id: string }) => d._id), ['main', 'legacy', 'today', 'ordered']);
});
test('hidden slots never appear publicly; program slugs and instructor names resolve from existing references', async () => {
  const result = await run(SCHEDULES_QUERY, [
    { _id: 'schedule', _type: 'scheduleSchema', days: [{ _key: 'mon', day: 'Ponedjeljak', classes: [{ _key: 'show', className: 'Samba', classRef: { _ref: 'dance' }, instructor: { _ref: 'teacher' } }, { _key: 'hide', className: 'Skriveni termin', enabled: false }] }] },
    { _id: 'dance', _type: 'dances', slug: { current: 'samba' } },
    { _id: 'teacher', _type: 'instructors', name: 'Domagoj', surname: 'Sertić' },
  ]);
  assert.equal(result[0].days[0].classes.length, 1);
  assert.equal(result[0].days[0].classes[0].slug, 'samba');
  assert.equal(result[0].days[0].classes[0].instructorName, 'Domagoj Sertić');
});
test('pricing uses the published canonical document, never a draft or unrelated duplicate', async () => {
  const result = await run(PRICING_QUERY, [{ _id: 'drafts.ventus-pricing', _type: 'pricingSettings', amount: 999 }, { _id: 'other-pricing', _type: 'pricingSettings' }, { _id: 'ventus-pricing', _type: 'pricingSettings', enabled: false, cards: [] }]);
  assert.equal(result._id, 'ventus-pricing'); assert.equal(result.enabled, false);
});

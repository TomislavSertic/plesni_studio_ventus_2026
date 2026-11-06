import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore -- Node type stripping requires the explicit source extension.
import { formatPrice } from '../lib/pricing.ts';
test('zero and decimal prices stay accurate in Croatian currency formatting', () => {
  assert.match(formatPrice(0), /^0\s*€$/);
  assert.match(formatPrice(49.5), /^49,50\s*€$/);
  assert.match(formatPrice(1200), /^1\.200\s*€$/);
});
test('editor-defined price text overrides amounts and missing prices stay understandable', () => {
  assert.equal(formatPrice(50, 'Besplatno'), 'Besplatno');
  assert.equal(formatPrice(undefined, ' Na upit '), 'Na upit');
  assert.equal(formatPrice(undefined), 'Na upit');
  assert.match(formatPrice(50, undefined, 'bad currency'), /^50\s*€$/);
});

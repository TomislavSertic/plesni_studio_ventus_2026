import { Mutation, arrayToJSONMatchPath } from '@sanity/mutator';
import type { EditorPatch, EditorDay } from '../lib/schedule-editor';
type Document = { _id: string; _type: string; days?: EditorDay[]; [key: string]: unknown };
// Uses Sanity's mutation engine, also used by the local browser QA fixture.
export function applyEditorPatches(document: Document, patches: EditorPatch[]): Document {
  return new Mutation({ mutations: patches.map(p => {
    const path = arrayToJSONMatchPath(['days', ...p.path]);
    if (p.type === 'unset') return { patch: { id: document._id, unset: [path] } };
    if (p.type === 'insert') return { patch: { id: document._id, insert: p.position === 'before' ? { before: path, items: p.items } : { after: path, items: p.items } } };
    if (p.type === 'set') return { patch: { id: document._id, set: { [path]: p.value } } };
    return { patch: { id: document._id, setIfMissing: { [path]: p.value } } };
  }) }).apply(document) as Document;
}

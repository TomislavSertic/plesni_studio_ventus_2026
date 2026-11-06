'use client';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { structure } from './sanity.structure';
export default defineConfig({
  basePath: '/studio', name: 'Ventus', title: 'ventus-studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes, templates: previous => previous.filter(template => template.schemaType !== 'pricingSettings') },
  document: {
    newDocumentOptions: previous => previous.filter(option => option.templateId !== 'pricingSettings'),
    actions: (previous, context) => context.schemaType === 'pricingSettings' ? previous.filter(action => !['delete', 'duplicate', 'unpublish'].includes(action.action || '')) : previous,
  },
});

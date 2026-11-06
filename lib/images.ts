import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImage } from './types';
const builder = createImageUrlBuilder({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing', dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production' });
export function imageUrl(source?: SanityImage, width = 1200, fallback = '/images/hero-image.webp') {
  if (!source?.asset?._ref && !source?.asset?.url) return fallback;
  return builder.image(source).width(width).auto('format').fit('max').url();
}
export function readableDate(value?: string, time = false) {
  if (!value || Number.isNaN(new Date(value).getTime())) return '';
  return new Intl.DateTimeFormat('hr-HR', { day: 'numeric', month: 'long', year: 'numeric', ...(time ? { hour: '2-digit', minute: '2-digit' } : {}), timeZone: 'Europe/Zagreb' }).format(new Date(value));
}

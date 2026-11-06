import 'server-only';
import { createClient } from '@sanity/client';
import { cache } from 'react';
import type { Dance, Instructor, Schedule, Story, PricingSettings } from './types';
import defaultPricing from '../content/default-pricing.json';
import { SCHEDULES_QUERY, PRICING_QUERY } from './content-queries';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-01-01',
  useCdn: true,
  perspective: 'published',
  // Legacy environment names remain compatible; the token is never imported by a client component.
  token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
export const writeClient = sanityClient.withConfig({ useCdn: false });
const published = '!(_id in path("drafts.**"))';
const fetchContent = async <T>(query: string, params: Record<string, string> = {}): Promise<T> =>
  sanityClient.fetch<T>(query, params, { next: { revalidate: 120, tags: ['sanity'] } });
export const getDances = cache(() => fetchContent<Dance[]>(`*[_type == "dances" && teaching == true && ${published} && defined(slug.current)] | order(coalesce(highlighted, false) desc, name asc) {..., "categories": (categories[]->)[defined(_id)]}`));
export const getInstructors = cache(() => fetchContent<Instructor[]>(`*[_type == "instructors" && show == true && ${published} && defined(slug.current)] | order(name asc) {..., "knowledge": (knowledge[]->)[defined(_id)]}`));
export const getSchedules = cache(() => {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zagreb', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return fetchContent<Schedule[]>(SCHEDULES_QUERY, { today });
});
export const getPricing = cache(async (): Promise<PricingSettings> => (await fetchContent<PricingSettings | null>(PRICING_QUERY)) || defaultPricing);
export const getPosts = cache(() => fetchContent<Story[]>(`*[_type == "post" && ${published} && defined(slug.current)] | order(publishedAt desc, _createdAt desc) {..., author->, "categories": (categories[]->)[defined(_id)]}`));
export const getEvents = cache(() => fetchContent<Story[]>(`*[_type == "event" && ${published} && defined(slug.current)] | order(eventStart desc) {..., organizator->, "categories": (categories[]->)[defined(_id)]}`));
export const getDocument = cache((type: string, slug: string) => fetchContent<(Dance & Instructor & Story) | null>(`*[_type == $type && slug.current == $slug && ${published}][0]{..., "categories": (categories[]->)[defined(_id)], "knowledge": (knowledge[]->)[defined(_id)], author->, organizator->}`, { type, slug }));

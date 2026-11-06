import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';
import { getDances, getEvents, getInstructors, getPosts } from '@/lib/sanity';
export const revalidate = 120;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [classes, instructors, news, events] = await Promise.all([getDances(), getInstructors(), getPosts(), getEvents()]);
  return [
    ...['', '/classes', '/schedule', '/aboutus', '/news', '/events', '/contact', '/privacypolicy'].map(path => ({ url: SITE_URL + path, changeFrequency: 'weekly' as const, priority: path ? .8 : 1 })),
    ...Object.entries({ classes, instructors, news, events }).flatMap(([section, docs]) => docs.map(doc => ({ url: `${SITE_URL}/${section}/${doc.slug.current}`, changeFrequency: 'weekly' as const, priority: .7 }))),
  ];
}

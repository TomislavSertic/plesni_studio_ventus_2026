import type { Metadata, Viewport } from 'next';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import './globals.css';
import { SITE_URL, studio } from '@/lib/config';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Ventus — Pronađi svoj ritam. | Plesni studio', template: '%s | Plesni studio Ventus' },
  description: 'Pronađi svoj ples u studiju Ventus. Tečajevi za djecu i odrasle, društveni plesovi, prvi ples i privatne lekcije. Prve dvije grupne lekcije besplatno.',
  openGraph: { locale: 'hr_HR', type: 'website', siteName: studio.name, title: 'Ventus — Pronađi svoj ritam.', description: 'Tečajevi plesa, dobra ekipa i tvoj novi početak. Zapleši s nama.', images: [{ url: '/images/hero-image.webp', width: 1260, height: 709, alt: 'Plesni studio Ventus' }] },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.ico', apple: '/favicon-32x32.png' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#f6f3ec' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="hr" data-scroll-behavior="smooth"><body>{children}</body></html>;
}

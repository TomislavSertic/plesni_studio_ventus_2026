import type { NextConfig } from 'next';
const config: NextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }] },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    ] }];
  },
  async redirects() {
    return [
      { source: '/about', destination: '/aboutus', permanent: true },
      { source: '/raspored', destination: '/schedule', permanent: true },
      { source: '/tecajevi', destination: '/classes', permanent: true },
      { source: '/kontakt', destination: '/contact', permanent: true },
    ];
  },
};
export default config;

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for cPanel/LiteSpeed hosting. Locale negotiation is handled
  // by .htaccess (see deploy/htaccess-dashboard.txt) since middleware is
  // unsupported in `output: 'export'`.
  output: 'export',
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // The default next/image optimizer needs a server; static export requires
    // unoptimized images.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default withNextIntl(nextConfig);

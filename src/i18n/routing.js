import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  // 'always' so the static export emits fully-prefixed /ar/... and /en/...
  // trees; the root redirect is handled by .htaccess on the server.
  localePrefix: 'always'
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);

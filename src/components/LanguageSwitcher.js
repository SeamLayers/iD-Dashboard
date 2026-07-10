"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    // Persist the choice for the .htaccess root redirect on the static host
    // (middleware locale negotiation is unavailable with `output: 'export'`).
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.replace({ pathname }, { locale: nextLocale });
  };

  return (
    <button onClick={switchLanguage} className="lang-switcher" title="Switch Language">
      <Languages size={16} />
      <span className="lang-label">{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}

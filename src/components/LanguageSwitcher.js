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
    router.replace({ pathname }, { locale: nextLocale });
  };

  return (
    <button onClick={switchLanguage} className="lang-switcher" title="Switch Language">
      <Languages size={16} />
      <span className="lang-label">{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}

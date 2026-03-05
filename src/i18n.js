import {getRequestConfig} from 'next-intl/server';
import { routing } from './i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  let messages;
  if (locale === 'en') {
    messages = (await import('../messages/en.json')).default;
  } else {
    messages = (await import('../messages/ar.json')).default;
  }

  return {
    locale,
    messages
  };
});

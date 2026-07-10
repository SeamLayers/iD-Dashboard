import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ThemeProvider from "@/components/ThemeProvider";
import { ReactQueryProvider } from "@/shared/providers/ReactQueryProvider";
import { AuthProvider } from "@/shared/auth/AuthProvider";
import { DemoStoreProvider } from "@/components/DemoStoreProvider";
import AppShell from "@/components/AppShell";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "iD+ Web Admin Dashboard",
  description: "Ultra-premium B2B SaaS Dashboard for iD+ by Mhawer",
};

// Static export: pre-render one tree per locale (out/ar/, out/en/).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Enable static rendering for next-intl under `output: 'export'`.
  setRequestLocale(locale);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir} className={dir} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <ReactQueryProvider>
              <AuthProvider>
                <DemoStoreProvider>
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 2600,
                    style: {
                      borderRadius: '12px',
                      border: '1px solid rgba(20, 184, 166, 0.25)',
                      background: 'rgba(2, 6, 23, 0.92)',
                      color: '#F8FAFC',
                    },
                  }}
                />
                <AppShell locale={locale}>{children}</AppShell>
                </DemoStoreProvider>
              </AuthProvider>
            </ReactQueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

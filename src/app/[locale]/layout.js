import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
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

export default async function RootLayout({ children, params }) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

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

import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const metadata = {
  title: "iD+ Web Admin Dashboard",
  description: "Ultra-premium B2B SaaS Dashboard for iD+ by Mhawer",
};

export default async function RootLayout({ children, params }) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  // Validate that the incoming `locale` parameter is valid
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  // Set text direction based on locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Provide messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir} className={dir}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="layout-wrapper">
            <Sidebar />
            <div className="main-content">
              <TopNavbar />
              {children}
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

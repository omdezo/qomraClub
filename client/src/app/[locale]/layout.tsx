import type { Metadata } from 'next';
import { LenisProvider } from '@/context/LenisContext';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export async function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: {
      default: `${dict.site.name} - ${dict.site.tagline}`,
      template: `%s | ${dict.site.name}`,
    },
    description: dict.home.heroSubtitle,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const locale = params.locale;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const dict = await getDictionary(locale);

  return (
    <div lang={locale} dir={dir} className="font-dialogue">
      <LenisProvider>
        <Navbar locale={locale} dict={dict} />
        <main className="min-h-screen">{children}</main>
        <Footer locale={locale} dict={dict} />
      </LenisProvider>
    </div>
  );
}

import { inter, dialogueMe, notoSansArabic } from '@/lib/fonts';
import '@/app/globals.css';

export const metadata = {
  title: 'Qomra — قمرة',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" className={`${inter.variable} ${dialogueMe.variable} ${notoSansArabic.variable}`}>
      <body className="font-dialogue bg-primary text-white antialiased">
        {children}
      </body>
    </html>
  );
}

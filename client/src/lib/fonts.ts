import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-arabic',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const dialogueMe = localFont({
  src: [
    { path: '../../public/fonts/dialogue-me-extralight-trial.ttf', weight: '200', style: 'normal' },
    { path: '../../public/fonts/dialogue-me-light-trial.ttf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/dialogue-me-regular-trial.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/dialogue-me-medium-trial.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/dialogue-me-demibold-trial.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/dialogue-me-bold-trial.ttf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/dialogue-me-extrabold-trial.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-dialogue',
  display: 'swap',
});

import type { Locale } from '@/types';
import { FaInstagram, FaXTwitter, FaYoutube, FaTiktok } from 'react-icons/fa6';

interface FooterProps {
  locale: Locale;
  dict: Record<string, any>;
}

export default function Footer({ locale, dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img src="/LOGO.png" alt={dict.site.name} className="h-12 mb-2" />
            <p className="text-white/50 text-sm">{dict.site.tagline}</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-3">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {['about', 'gallery', 'events', 'contact'].map((key) => (
                <a
                  key={key}
                  href={`/${locale}/${key}`}
                  className="text-sm text-white/50 hover:text-accent transition-colors"
                >
                  {dict.nav[key] || key}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-3">
              {locale === 'ar' ? 'تابعنا' : 'Follow Us'}
            </h4>
            <div className="flex gap-4">
              {[
                { icon: FaInstagram, label: 'Instagram' },
                { icon: FaXTwitter, label: 'X' },
                { icon: FaYoutube, label: 'YouTube' },
                { icon: FaTiktok, label: 'TikTok' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="text-white/50 hover:text-accent transition-colors"
                  aria-label={label}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center text-white/30 text-sm">
          &copy; {currentYear} {dict.site.name}. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}

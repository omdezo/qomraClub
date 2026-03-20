import type { Locale } from '@/types';

interface StatsBarProps {
  locale: Locale;
  dict: Record<string, any>;
}

export default function StatsBar({ locale, dict }: StatsBarProps) {
  const stats = [
    { value: '50+', label: dict.about.stats.members },
    { value: '5', label: dict.about.stats.qomraWeeks },
    { value: '20+', label: dict.about.stats.events },
    { value: '500+', label: dict.about.stats.photos },
  ];

  return (
    <section className="py-12 bg-secondary border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-accent">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import type { Locale, Event, PaginatedResponse } from '@/types';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';

export default function AboutPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';

  const [coreEvents, setCoreEvents] = useState<Event[]>([]);
  const [charityEvents, setCharityEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.get<PaginatedResponse<Event>>('/events', { params: { limit: 50 } })
      .then(({ data }) => {
        const all = data.data || [];
        setCoreEvents(all.filter((e) => e.type !== 'meetup').slice(0, 6));
        setCharityEvents(all.filter((e) => e.type === 'meetup').slice(0, 6));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="pt-20">
      {/* ======================== نبذة عنّا ======================== */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeInOnScroll>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight mb-4">
              {locale === 'ar' ? (
                <>نبذة <span className="text-accent">عنّا</span></>
              ) : (
                <>About <span className="text-accent">Us</span></>
              )}
            </h1>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.15}>
            <div className="max-w-3xl mt-8">
              {locale === 'ar' ? (
                <p className="text-lg text-white/70 leading-[2]">
                  جماعة قمرة للتصوير الضوئي هي جماعة طلابية تأسست عام 2011 في
                  الجامعة الوطنية للعلوم والتكنولوجيا، بمبادرة من مجموعة طلاب ممن
                  لديهم شغف بفنون التصوير الفوتوغرافي. وخلال مسيرتها، تطورت الجماعة
                  لتشمل مجالات أوسع مثل التصوير الفيديوغرافي، وصناعة الأفلام، والتصميم
                  الإبداعي. على مدار السنوات، حصدت &quot;قمرة&quot; العديد من الجوائز المحلية
                  والإقليمية والعالمية، مؤكدة حضورها في المجال كمركز نابض بالإبداع.
                  وتهدف الجماعة إلى صقل مهارات الطلاب الفنية والتقنية، وإنتاج أعمال فنية
                  قادرة على ملامسة كل من يتلقاها.
                </p>
              ) : (
                <p className="text-lg text-white/70 leading-[2]">
                  Qomra Photography Club is a student organization founded in 2011 at
                  the National University of Science and Technology, initiated by a group
                  of students passionate about photography. Over the years, the club has
                  expanded to encompass videography, filmmaking, and creative design.
                  Throughout its journey, Qomra has earned numerous local, regional, and
                  international awards, establishing itself as a vibrant hub of creativity.
                  The club aims to refine students&apos; artistic and technical skills,
                  producing works that resonate with all who experience them.
                </p>
              )}
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ======================== فلسفتنا ======================== */}
      <section className="py-24 bg-secondary">
        <div className="max-w-5xl mx-auto px-4">
          <FadeInOnScroll>
            <p className="text-accent text-sm tracking-[0.3em] uppercase mb-12">
              {locale === 'ar' ? 'فلسفتنا' : 'Our Philosophy'}
            </p>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.1}>
            <blockquote className="text-2xl md:text-3xl font-light leading-relaxed text-white/80 border-s-2 border-accent ps-8 mb-16 max-w-3xl">
              {locale === 'ar'
                ? 'في قمرة نؤمن أن الحكاية إن عجز اللسان عن قولها تولت الصورة سردها، فالصورة لغة صامتة لا تعجز.'
                : 'At Qomra, we believe that when words fail to tell the story, the image takes over — for a photograph is a silent language that never falters.'}
            </blockquote>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* الرؤية */}
            <FadeInOnScroll delay={0.1}>
              <div>
                <h3 className="text-xl font-bold text-accent mb-4">
                  {locale === 'ar' ? 'الرؤية' : 'Vision'}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {locale === 'ar'
                    ? 'في قمرة، نطمح إلى أن نكون الجماعة الرائدة التي تحتضن الإبداع وتجمع بين جماليات الفن وروح التصوير الفوتوغرافي لنصوغ من خلال عدساتنا قصصاً تُلهم الأبصار وتلامس الأرواح.'
                    : 'At Qomra, we aspire to be the leading club that embraces creativity, combining the beauty of art with the spirit of photography to craft stories through our lenses that inspire eyes and touch souls.'}
                </p>
              </div>
            </FadeInOnScroll>

            {/* الهدف */}
            <FadeInOnScroll delay={0.2}>
              <div>
                <h3 className="text-xl font-bold text-accent mb-4">
                  {locale === 'ar' ? 'الهدف' : 'Mission'}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {locale === 'ar'
                    ? 'مهمتنا في قمرة هي تمكين الطاقات الشابة من صقل مهاراتهم في فنون التصوير الضوئي عبر توفير بيئة محفزة وداعمة للإبداع تمنحهم المساحة للتعبير عن أفكارهم ورؤاهم وتحويلها إلى صور قادرة على الإلهام.'
                    : 'Our mission at Qomra is to empower young talent by honing their photography skills through a stimulating, creativity-supporting environment that gives them space to express their ideas and visions, transforming them into inspiring images.'}
                </p>
              </div>
            </FadeInOnScroll>

            {/* الفئة المستهدفة */}
            <FadeInOnScroll delay={0.3}>
              <div>
                <h3 className="text-xl font-bold text-accent mb-4">
                  {locale === 'ar' ? 'الفئة المستهدفة' : 'Target Audience'}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {locale === 'ar'
                    ? 'طلاب وطالبات الجامعة الوطنية، والمصورون الهواة والمحترفون من داخل المجتمع الجامعي، إضافة إلى المؤسسات والجهات المهتمة بعالم الفنون البصرية، والمهتمة بتنمية المهارات الشبابية.'
                    : 'Students of the National University, amateur and professional photographers from within the university community, as well as institutions and organizations interested in visual arts and youth skill development.'}
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ======================== فعاليات أساسية ======================== */}
      <section className="py-24 bg-primary">
        <div className="max-w-5xl mx-auto px-4">
          <FadeInOnScroll>
            <div className="mb-16">
              <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
                {locale === 'ar' ? 'فعاليتنا' : 'Our Events'}
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight">
                {locale === 'ar' ? (
                  <>فعاليات <span className="text-accent">أساسية</span></>
                ) : (
                  <>Core <span className="text-accent">Events</span></>
                )}
              </h2>
            </div>
          </FadeInOnScroll>

          {coreEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreEvents.map((event, i) => (
                <FadeInOnScroll key={event._id} delay={i * 0.1}>
                  <div className="bg-secondary rounded-xl p-6 border border-white/5 hover:border-accent/20 transition-colors">
                    {event.coverImageUrl && (
                      <div className="aspect-video rounded-lg overflow-hidden mb-4">
                        <img src={event.coverImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <span className="text-xs text-accent tracking-wider uppercase">{event.type}</span>
                    <h3 className="text-lg font-semibold mt-2">
                      {locale === 'ar' ? event.title.ar : event.title.en}
                    </h3>
                    <p className="text-sm text-white/40 mt-2 line-clamp-2">
                      {locale === 'ar' ? event.description.ar : event.description.en}
                    </p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { ar: 'أسبوع قمرة', en: 'Qomra Week', desc_ar: 'المسابقة السنوية الأبرز للتصوير الفوتوغرافي', desc_en: 'The flagship annual photography competition' },
                { ar: 'معرض الصور', en: 'Photo Exhibition', desc_ar: 'عرض أفضل أعمال الأعضاء في معارض الجامعة', desc_en: 'Showcasing members\' best works at university exhibitions' },
                { ar: 'ورش التصوير', en: 'Photography Workshops', desc_ar: 'ورش عمل متخصصة لتطوير مهارات التصوير', desc_en: 'Specialized workshops to develop photography skills' },
              ].map((item, i) => (
                <FadeInOnScroll key={i} delay={i * 0.1}>
                  <div className="bg-secondary rounded-xl p-6 border border-white/5">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <span className="text-accent text-xl font-bold">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{locale === 'ar' ? item.ar : item.en}</h3>
                    <p className="text-sm text-white/40">{locale === 'ar' ? item.desc_ar : item.desc_en}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================== فعاليات خيرية ======================== */}
      <section className="py-24 bg-secondary">
        <div className="max-w-5xl mx-auto px-4">
          <FadeInOnScroll>
            <div className="mb-16">
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight">
                {locale === 'ar' ? (
                  <>فعاليات <span className="text-accent">خيرية</span></>
                ) : (
                  <>Charity <span className="text-accent">Events</span></>
                )}
              </h2>
            </div>
          </FadeInOnScroll>

          {charityEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {charityEvents.map((event, i) => (
                <FadeInOnScroll key={event._id} delay={i * 0.1}>
                  <div className="bg-primary rounded-xl p-6 border border-white/5 hover:border-accent/20 transition-colors">
                    <h3 className="text-lg font-semibold">
                      {locale === 'ar' ? event.title.ar : event.title.en}
                    </h3>
                    <p className="text-sm text-white/40 mt-2 line-clamp-2">
                      {locale === 'ar' ? event.description.ar : event.description.en}
                    </p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/30">
                {locale === 'ar' ? 'سيتم إضافة الفعاليات الخيرية قريباً' : 'Charity events coming soon'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ======================== سجل الإنجازات ======================== */}
      <section className="py-24 bg-primary">
        <div className="max-w-5xl mx-auto px-4">
          <FadeInOnScroll>
            <div className="mb-16">
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight">
                {locale === 'ar' ? (
                  <>سجل <span className="text-accent">الإنجازات</span></>
                ) : (
                  <>Achievement <span className="text-accent">Record</span></>
                )}
              </h2>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-16">
            {[
              { value: '150+', ar: 'عضو', en: 'Members' },
              { value: '11', ar: 'أسبوع قمرة', en: 'Qomra Weeks' },
              { value: '50+', ar: 'فعالية', en: 'Events' },
              { value: '1000+', ar: 'صورة', en: 'Photos' },
            ].map((stat, i) => (
              <FadeInOnScroll key={i} delay={i * 0.1}>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-sm text-white/50">{locale === 'ar' ? stat.ar : stat.en}</div>
              </FadeInOnScroll>
            ))}
          </div>

          {/* Placeholder for achievements — will be populated from admin */}
          <div className="text-center py-8">
            <p className="text-white/30">
              {locale === 'ar'
                ? 'سيتم إضافة سجل الإنجازات التفصيلي من لوحة التحكم'
                : 'Detailed achievement records will be added from the admin dashboard'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { getBilingual } from '@/lib/utils';
import type { Locale, Member } from '@/types';
import Badge from '@/components/ui/Badge';

export default function MemberDetailPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const id = params?.id as string;
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    api.get(`/members/${id}`).then(({ data }) => setMember(data)).catch(() => {});
  }, [id]);

  if (!member) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center text-white/50">
        {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary shrink-0">
            {member.avatarUrl ? (
              <Image src={member.avatarUrl} alt="" width={128} height={128} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-white/20">
                {getBilingual(member.name, locale).charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">{getBilingual(member.name, locale)}</h1>
            <p className="text-accent mb-4">{getBilingual(member.role, locale)}</p>
            {member.isBoardMember && <Badge variant="accent" className="mb-4">{locale === 'ar' ? 'عضو مجلس الإدارة' : 'Board Member'}</Badge>}
            {member.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {member.specialties.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            )}
            <p className="text-white/60 leading-relaxed">{getBilingual(member.bio, locale)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

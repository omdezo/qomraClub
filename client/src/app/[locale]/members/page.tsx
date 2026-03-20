'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { getBilingual } from '@/lib/utils';
import type { Locale, Member, PaginatedResponse } from '@/types';

export default function MembersPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await api.get<PaginatedResponse<Member>>('/members', { params: { limit: 50 } });
        setMembers(data.data);
      } catch {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">
          {locale === 'ar' ? 'الأعضاء' : 'Members'}
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-secondary rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            {locale === 'ar' ? 'سيتم إضافة الأعضاء قريباً' : 'Members coming soon'}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <Link
                key={member._id}
                href={`/${locale}/members/${member._id}`}
                className="group bg-secondary rounded-xl p-4 border border-white/5 hover:border-accent/20 transition-all text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-elevated mb-3">
                  {member.avatarUrl ? (
                    <Image src={member.avatarUrl} alt="" width={80} height={80} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-white/20">
                      {getBilingual(member.name, locale).charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold group-hover:text-accent transition-colors">
                  {getBilingual(member.name, locale)}
                </h3>
                <p className="text-xs text-white/40 mt-1">
                  {getBilingual(member.role, locale)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

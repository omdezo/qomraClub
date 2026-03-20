'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { AdminStats } from '@/types';
import {
  HiOutlinePhotograph, HiOutlineUserGroup, HiOutlineCalendar,
  HiOutlineStar, HiOutlineBookOpen, HiOutlineBriefcase, HiOutlineMail,
} from 'react-icons/hi';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Photos', value: stats?.photos ?? '-', icon: HiOutlinePhotograph, color: 'text-blue-400' },
    { label: 'Members', value: stats?.members ?? '-', icon: HiOutlineUserGroup, color: 'text-green-400' },
    { label: 'Events', value: stats?.events ?? '-', icon: HiOutlineCalendar, color: 'text-purple-400' },
    { label: 'QW Editions', value: stats?.editions ?? '-', icon: HiOutlineStar, color: 'text-yellow-400' },
    { label: 'Articles', value: stats?.articles ?? '-', icon: HiOutlineBookOpen, color: 'text-cyan-400' },
    { label: 'Services', value: stats?.services ?? '-', icon: HiOutlineBriefcase, color: 'text-orange-400' },
    { label: 'Unread Messages', value: stats?.unreadMessages ?? '-', icon: HiOutlineMail, color: 'text-red-400' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-secondary rounded-xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <card.icon size={22} className={card.color} />
            </div>
            <div className="text-2xl font-bold mb-1">{card.value}</div>
            <div className="text-xs text-white/40">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

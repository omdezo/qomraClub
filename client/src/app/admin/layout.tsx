'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  HiOutlinePhotograph, HiOutlineUserGroup, HiOutlineCalendar,
  HiOutlineStar, HiOutlineBookOpen, HiOutlineBriefcase,
  HiOutlineMail, HiOutlineCog, HiOutlineChartBar, HiOutlineLogout,
  HiOutlineHome,
  HiMenu, HiX,
} from 'react-icons/hi';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: HiOutlineChartBar },
  { href: '/admin/homepage', label: 'Homepage', icon: HiOutlineHome },
  { href: '/admin/gallery', label: 'Gallery', icon: HiOutlinePhotograph },
  { href: '/admin/qomra-week', label: 'Qomra Week', icon: HiOutlineStar },
  { href: '/admin/events', label: 'Events', icon: HiOutlineCalendar },
  { href: '/admin/members', label: 'Members', icon: HiOutlineUserGroup },
  { href: '/admin/learn', label: 'Articles', icon: HiOutlineBookOpen },
  { href: '/admin/services', label: 'Services', icon: HiOutlineBriefcase },
  { href: '/admin/contact', label: 'Messages', icon: HiOutlineMail },
  { href: '/admin/settings', label: 'Settings', icon: HiOutlineCog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }

    const token = localStorage.getItem('qomra_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    api.get('/auth/me')
      .then(({ data }) => { setUser(data); setChecking(false); })
      .catch(() => {
        localStorage.removeItem('qomra_token');
        router.push('/admin/login');
      });
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('qomra_token');
    router.push('/admin/login');
  };

  // Login page — no sidebar
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-primary text-white">{children}</div>;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-white flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-40 w-64 bg-secondary border-e border-white/5 transform transition-transform lg:translate-x-0 lg:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <img src="/LOGO.png" alt="Qomra" className="h-9" />
            <span className="text-sm font-medium text-white/40">Admin</span>
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive ? 'bg-accent/10 text-accent' : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 start-0 end-0 p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 w-full transition-colors"
          >
            <HiOutlineLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-primary/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white/70">
            {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
          <div className="flex-1" />
          {user && (
            <span className="text-sm text-white/50">{user.username}</span>
          )}
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

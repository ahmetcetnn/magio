"use client";
import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Topbar({ fullName, title }: { fullName?: string; title?: string }) {
  const [name, setName] = React.useState<string | undefined>(undefined);
  const pathname = usePathname();

  const computedTitle = React.useMemo(() => {
    if (title) return title;
    const path = pathname || '/';
    const parts = path.split('/').filter(Boolean);
    // Use last segment for title, default to Dashboard when at /dashboard
    const last = parts[parts.length - 1] || 'dashboard';
    const pretty = last
      .split('-')
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
      .join(' ');
    return pretty || 'Dashboard';
  }, [pathname, title]);

  React.useEffect(() => {
    const read = () => {
      try {
        const ls = localStorage.getItem('fullName');
        setName(ls || fullName);
      } catch {
        setName(fullName);
      }
    };
    read();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'fullName') read();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [fullName]);
  return (
    <header className="h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Open menu"
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
          onClick={() => {
            try {
              // @ts-ignore - exposed by Sidebar on window
              if (typeof window !== 'undefined' && window.openMobileSidebar) window.openMobileSidebar();
            } catch {}
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{computedTitle}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="Search" className="p-2 rounded-full hover:bg-gray-100 hidden sm:inline-flex">
          <Image src="/icons/search.svg" alt="" width={20} height={20} />
        </button>
        <button aria-label="Notifications" className="p-2 rounded-full hover:bg-gray-100">
          <Image src="/icons/notification.svg" alt="" width={20} height={20} />
        </button>
  <div className="flex items-center gap-2 bg-[#FAFAFA]  rounded-full pl-1 pr-3 py-1">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 grid place-items-center">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5.33 0-8 2.67-8 5v1h16v-1c0-2.33-2.67-5-8-5Z"/></svg>
          </div>
          <span className="text-sm font-medium text-gray-900 hidden sm:block">{name || 'User'}</span>
          <Image src="/icons/arrow.svg" alt="" width={9} height={9} className="hidden sm:block opacity-80" />
        </div>
      </div>
    </header>
  );
}

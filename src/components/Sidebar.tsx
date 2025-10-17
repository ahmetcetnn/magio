"use client";
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const items = [
  { name: 'Dashboard', href: '/dashboard', iconSrc: '/icons/Dashboard.svg' },
  { name: 'Transactions', href: '/dashboard/transactions', iconSrc: '/icons/Transactions.svg' },
  { name: 'Invoices', href: '#', iconSrc: '/icons/Invoices.svg' },
  { name: 'My Wallets', href: '#', iconSrc: '/icons/My Wallets.svg' },
  { name: 'Settings', href: '#', iconSrc: '/icons/Settings.svg' },
];

export default function Sidebar() {
  const [showLogout, setShowLogout] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Expose an opener for Topbar on mobile
  React.useEffect(() => {
    // @ts-ignore
    (window as any).openMobileSidebar = () => setMobileOpen(true);
    return () => {
      // @ts-ignore
      if ((window as any).openMobileSidebar) delete (window as any).openMobileSidebar;
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = base ? `${base}/users/logout` : '/users/logout';
      // Fire-and-forget with keepalive so it continues during navigation
      fetch(url, { method: 'POST', credentials: 'include', keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
      toast.success('Logged out');
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('fullName');
    } catch {}
    setShowLogout(false);
    setIsLoggingOut(false);
    router.replace('/signin');
  };

  return (
  <>
    {/* Mobile top bar with hamburger */}
    <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
      <div className="h-14 flex items-center justify-between px-4">
        <button
          type="button"
          aria-label="Open menu"
          aria-controls="mobile-sidebar"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
        >
          {/* Hamburger icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <Image src="/images/logonav.png" alt="MagIo" width={100} height={28} />
        {/* Spacer to balance layout */}
        <span className="w-10" />
      </div>
    </div>

    {/* Mobile drawer */}
    {mobileOpen && (
      <div role="dialog" aria-modal="true" className="lg:hidden fixed inset-0 z-50">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
        {/* Panel */}
        <div id="mobile-sidebar" className="relative z-10 h-full w-72 max-w-[85%] bg-[#FAFAFA] shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Image src="/images/logonav.png" alt="MagIo" width={110} height={32} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
            >
              {/* Close icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="p-3 overflow-y-auto h-[calc(100%-64px)]">
            <ul className="space-y-2">
              {items.map((it) => {
                const isDash = it.href === '/dashboard';
                const active = isDash ? pathname === '/dashboard' : (it.href !== '#' && pathname.startsWith(it.href));
                return (
                  <li key={it.name}>
                    <a
                      href={it.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${active ? 'text-gray-900 bg-lime-200' : 'text-[#929EAE] hover:bg-lime-100/50 hover:text-gray-900'}`}
                      aria-current={active ? 'true' : undefined}
                    >
                      <Image src={it.iconSrc} alt="" width={18} height={18} aria-hidden />
                      <span>{it.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 border-t border-gray-100 pt-4">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#929EAE] hover:bg-gray-50 hover:text-gray-900">
                    <Image src="/icons/Help.svg" alt="" width={18} height={18} aria-hidden />
                    <span>Help</span>
                  </a>
                </li>
                <li>
                  <button onClick={() => { setShowLogout(true); setMobileOpen(false); }} className="w-full text-left flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#929EAE] hover:bg-gray-50 hover:text-gray-900">
                    <Image src="/icons/Logout.svg" alt="" width={18} height={18} aria-hidden />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    )}

    {/* Desktop sidebar */}
    <aside className="hidden lg:flex sticky top-0 h-[100dvh] w-60 shrink-0 bg-[#FAFAFA] flex-col overflow-y-auto">
      <div className="p-5">
        <Image src="/images/logonav.png" alt="MagIo" width={110} height={32} />
      </div>
      <nav aria-label="Main" className="px-3 flex-1">
        <ul className="space-y-2">
          {items.map((it) => {
            const isDash = it.href === '/dashboard';
            const active = isDash ? pathname === '/dashboard' : (it.href !== '#' && pathname.startsWith(it.href));
            return (
              <li key={it.name}>
                <a
                  href={it.href}
                  className={`flex items-center ${isDash ? 'gap-[12px]' : 'gap-3'} rounded-lg text-sm font-medium ${active ? 'text-gray-900' : 'text-[#929EAE]'} hover:bg-lime-100/50 hover:text-gray-900 aria-[current=true]:bg-lime-200 aria-[current=true]:text-gray-900 aria-[current=true]:font-semibold ${isDash ? 'w-[200px] pl-[15px] pr-[81px] py-[14px]' : 'px-3 py-2'}`}
                  aria-current={active ? 'true' : undefined}
                >
                  <Image src={it.iconSrc} alt="" width={18} height={18} aria-hidden />
                  <span>{it.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto mb-[100px] p-3 ">
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#929EAE] hover:bg-gray-50 hover:text-gray-900">
              <Image src="/icons/Help.svg" alt="" width={18} height={18} aria-hidden />
              <span>Help</span>
            </a>
          </li>
          <li>
            <button onClick={() => setShowLogout(true)} className="w-full text-left flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#929EAE] hover:bg-gray-50 hover:text-gray-900">
              <Image src="/icons/Logout.svg" alt="" width={18} height={18} aria-hidden />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>

      {showLogout && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLogout(false)} />
          <div className="relative z-10 w-[90%] max-w-sm rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Log out?</h3>
            <p className="text-sm text-gray-600 mb-4">You will be redirected to the sign-in page.</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowLogout(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleLogout} disabled={isLoggingOut} className={`px-4 py-2 rounded-lg text-sm text-black ${isLoggingOut ? 'opacity-60 cursor-not-allowed' : ''}`} style={{ backgroundColor: '#C8EE44' }}>
                {isLoggingOut ? 'Logging out…' : 'Yes, log out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  </>
  );
}

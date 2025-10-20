"use client";
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ConfirmDialog from './ui/ConfirmDialog';

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

  React.useEffect(() => {
    (window as any).openMobileSidebar = () => setMobileOpen(true);
    return () => {
      if ((window as any).openMobileSidebar) delete (window as any).openMobileSidebar;
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = base ? `${base}/users/logout` : '/users/logout';
      fetch(url, { method: 'POST', credentials: 'include', keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
      toast.success('Logged out');
    } catch {
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

    {mobileOpen && (
      <div role="dialog" aria-modal="true" className="lg:hidden fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
        <div id="mobile-sidebar" className="relative z-10 h-full w-72 max-w-[85%] bg-[#FAFAFA] shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Image src="/images/logonav.png" alt="MagIo" width={110} height={32} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
            >
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
                  className={`flex items-center rounded-lg text-sm font-medium transition-all duration-150
                    ${active ? 'gap-[12px]' : 'gap-3 hover:gap-[12px]'}
                    ${active ? 'text-gray-900 bg-lime-200 font-semibold' : 'text-[#929EAE] hover:bg-lime-100/50 hover:text-gray-900'}
                    ${active ? 'w-[200px] pl-[15px] pr-[81px] py-[14px]' : 'px-3 py-2 hover:w-[200px] hover:pl-[15px] hover:pr-[81px] hover:py-[14px]'}
                  `}
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

      <ConfirmDialog
        open={showLogout}
        title="Log out?"
        description="You will be redirected to the sign-in page."
        cancelText="Cancel"
        confirmText={isLoggingOut ? 'Logging out…' : 'Yes'}
        busy={isLoggingOut}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </aside>
  </>
  );
}

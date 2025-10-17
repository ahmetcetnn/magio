import React from 'react';

export function SummaryCard({
  title,
  value,
  icon,
  iconSrc,
  accent = 'bg-gray-900',
  active = false,
  onClick,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
  iconSrc?: string;
  accent?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <section
      aria-label={title}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`rounded-xl p-4 flex items-center gap-[12px] select-none transition-colors ${onClick ? 'cursor-pointer' : 'cursor-default'} ${
        active ? 'bg-[#363A3F]' : 'bg-[#F8F8F8]'
      }`}
    >
      <div className={`h-10 w-10 grid place-items-center rounded-full ${active ? 'bg-[#4E5257]' : 'bg-[#EBE8E8]'}`}>
        {iconSrc ? (
          <span
            aria-hidden
            className="block h-5 w-5"
            style={{
              WebkitMaskImage: `url("${iconSrc}")`,
              maskImage: `url("${iconSrc}")`,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              backgroundColor: active ? 'var(--primary)' : '#363A3F',
            }}
          />
        ) : (
          icon
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm text-[#929EAE] font-normal`}>{title}</p>
        <p className={`text-2xl font-semibold ${active ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      </div>
    </section>
  );
}

export function WalletCard({ bank, masked, brand }: { bank: string; masked: string; brand: string }) {
  return (
    <div className="rounded-2xl relative overflow-hidden text-white p-5 bg-gray-800">
      <p className="text-sm opacity-80 mb-6">{bank}</p>
      <p className="tracking-widest text-lg font-medium">{masked}</p>
      <div className="mt-8 flex items-center justify-between text-xs opacity-80">
        <span>09/25</span>
        <span className="uppercase">{brand}</span>
      </div>
    </div>
  );
}

export function Section({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {action}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-gray-200/80 ${className}`}
      style={{}}
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            'linear-gradient(90deg, rgba(220,220,220,0.2) 0%, rgba(220,220,220,0.6) 50%, rgba(220,220,220,0.2) 100%)',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

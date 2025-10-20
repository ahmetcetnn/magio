import React from 'react';
import { Skeleton } from '../../../components/ui/cards';

type Card = { bank: string; last4: string; brand: string; masked: string; exp: string; cardNumber?: string };

export default function WalletPanel({ loading, cards }: { loading: boolean; cards: Card[] }) {
  return (
    <div>
      <section className="rounded-xl bg-white px-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Wallet</h2>
          <button className="text-xl text-gray-500" aria-label="More options">…</button>
        </div>
        <div>
          {loading ? (
            <>
              <Skeleton className="h-36" />
              <Skeleton className="h-20" />
            </>
          ) : (
            <div className="relative pb-16 max-w-[400px] mx-auto">
              {cards[0] && (
                <div className="relative w-full max-w-[400px] rounded-2xl overflow-hidden text-white z-0" style={{ transform: 'scaleY(0.7875)', transformOrigin: 'top left' }}>
                  <img src="/icons/BG.png" alt="Card" className="block w-full h-auto max-h-[250px]" />
                  <div className="absolute inset-0 p-5 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-bold" style={{ fontFamily: 'Gordita, sans-serif' }}>Maglo.</span>
                        <span className="opacity-80">|</span>
                        <span className="text-xs font-medium" style={{ color: '#626260', fontFamily: 'Gordita, sans-serif' }}>{cards[0].bank}</span>
                      </div>
                    </div>
                    <div className="absolute left-5 right-5 top-1/2 -translate-y-1/2 flex items-center justify-between">
                      <img src="/icons/chip.png" alt="Chip" width={36} height={48} className="object-contain opacity-90" />
                      <img src="/icons/wifi.png" alt="Wi‑Fi" className="w-9 h-9 mr-2 opacity-80 object-contain" />
                    </div>
                    <div className="absolute left-5 right-5 top[68%] font-semibold tracking-wide text-lg">
                      {cards[0].cardNumber ?? cards[0].masked}
                    </div>
                  </div>
                </div>
              )}
              {cards[1] && (
                <div className="absolute left-4 pr-4 right-0 top-[50%] max-w-[360px] overflow-hidden z-50" style={{ transform: 'scaleY(0.903)', transformOrigin: 'top left' }}>
                  <img src="/icons/Effect.png" alt="Card" className="block w-full h-auto max-h-[200px]" />
                  <div className="absolute inset-0 p-4 flex flex-col text-gray-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-[16px] font-bold" style={{ fontFamily: 'Gordita, sans-serif' }}>Maglo.</span>
                        <span className="opacity-80">|</span>
                        <span className="text-[12px] font-medium" style={{ color: '#F5F5F5', fontFamily: 'Gordita, sans-serif' }}>{cards[1].bank}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <img src="/icons/chip.png" alt="Chip" className="h-6 w-8 object-contain opacity-90" />
                      <img src="/icons/wifi.png" alt="Wi‑Fi" className="h-9 w-9 mr-4 object-contain opacity-80" />
                    </div>
                    <div className="mt-auto">
                      <div className="text-lg font-semibold tracking-wider">{cards[1].masked}</div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="text-xs text-gray-700">{cards[1].exp}</div>
                        <img src="/icons/visa.png" alt="Visa" className="h-5 mr-4 w-auto object-contain drop-shadow" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

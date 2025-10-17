'use client';

import React from 'react';
import currency from 'currency.js';

type Settings = {
  locale: string;
  currency: string; // ISO 4217 code e.g., USD, EUR, TRY
};

type SettingsContextType = Settings & {
  setLocale: (locale: string) => void;
  setCurrency: (currency: string) => void;
  formatMoney: (value: number, opts?: Intl.NumberFormatOptions) => string;
  formatDate: (date: string | number | Date, opts?: Intl.DateTimeFormatOptions) => string;
};

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState('en-US');
  const [cur, setCurr] = React.useState('USD');

  const value = React.useMemo<SettingsContextType>(() => ({
    locale,
    currency: cur,
    setLocale,
    setCurrency: setCurr,
    formatMoney: (value, opts) => {
      const val = currency(value).value;
      const desired = (opts as any)?.currency as string | undefined;
      const code = (desired || cur || '').toUpperCase();
      const sym = code === 'TRY' ? '₺' : code === 'USD' ? '$' : code === 'EUR' ? '€' : undefined;
      if (sym) {
        // Format just the number per locale, then append currency symbol at the end
        const number = new Intl.NumberFormat(locale, {
          // Hide cents: no fraction digits
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          ...opts,
        }).format(val);
        return `${number} ${sym}`;
      }
      // Fallback to standard Intl currency formatting for other codes, also without fraction digits
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code || cur,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        ...opts,
      }).format(val);
    },
    formatDate: (date, opts) => new Intl.DateTimeFormat(locale, { ...opts }).format(new Date(date)),
  }), [locale, cur]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

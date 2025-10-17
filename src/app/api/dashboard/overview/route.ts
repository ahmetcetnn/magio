import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder empty data to focus on pixel-perfect UI; replace with real integration later.
  const payload = {
    totals: {
      balance: 0,
      spending: 0,
      saved: 0,
    },
    chart: {
      range: 'last_7_days' as const,
      points: [
        { date: new Date().toISOString(), income: 0, expenses: 0 },
      ],
    },
    wallet: {
      cards: [
        {
          bank: 'MagIo. Universal Bank',
          last4: '2321',
          brand: 'visa',
          masked: '8595 2548 ****',
          exp: '09/25',
        },
        {
          bank: 'MagIo. Commercial Bank',
          last4: '8868',
          brand: 'visa',
          masked: '8595 2548 ****',
          exp: '09/25',
        },
      ],
    },
    recentTransactions: [],
    scheduledTransfers: [],
  };

  return NextResponse.json(payload);
}

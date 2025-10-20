import api from '../lib/http';


export type SummaryTotals = { balance: number; spending: number; saved: number };
export async function getFinancialSummary(signal?: AbortSignal): Promise<{ totals: SummaryTotals; currency: string }> {
  const res = await api.get<any>('/financial/summary', { signal });
  const body = res.data;
  const payload = (body as any)?.data ?? body;
  const currency = payload?.totalBalance?.currency || payload?.totalExpense?.currency || payload?.totalSavings?.currency || 'USD';
  return {
    totals: {
      balance: Number(payload?.totalBalance?.amount ?? 0),
      spending: Number(payload?.totalExpense?.amount ?? 0),
      saved: Number(payload?.totalSavings?.amount ?? 0),
    },
    currency,
  };
}

export type WorkingPoint = { date: string; income: number; expenses: number };
export async function getWorkingCapital(signal?: AbortSignal): Promise<{ points: WorkingPoint[]; currency?: string }> {
  const res = await api.get<any>('/financial/working-capital', { signal });
  const body = res.data;
  const payload = (body as any)?.data ?? body;
  const points = (payload?.data ?? []).map((m: any) => ({
    date: String(m?.month ?? ''),
    income: Number(m?.income ?? 0),
    expenses: Number(m?.expense ?? 0),
  }));
  return { points, currency: payload?.currency };
}

export type WalletCardVM = { bank: string; last4: string; brand: string; masked: string; exp: string };
export async function getWallet(signal?: AbortSignal): Promise<{ cards: WalletCardVM[] }> {
  const res = await api.get<any>('/financial/wallet', { signal });
  const body = res.data as any;
  const payload = body?.data ?? body;
  const cardsRaw: any[] = payload?.cards ?? [];
  const formatMasked = (raw: string) => {
    const original = String(raw || '');
    const hasMask = /[\*•]/.test(original);
    const digits = original.replace(/\D+/g, '');
    const last4 = digits.slice(-4);
    const formattedDigits = digits.replace(/(.{4})/g, '$1 ').trim();
    const display = hasMask && original.trim().length > 0 ? original : formattedDigits;
    return { display, last4 };
  };
  const mapped = cardsRaw
    .slice()
    .sort((a, b) => (b?.isDefault === true ? 1 : 0) - (a?.isDefault === true ? 1 : 0))
    .map((c: any) => {
      const { display, last4 } = formatMasked(String(c?.cardNumber ?? ''));
      const mm = String(Number(c?.expiryMonth ?? 0)).padStart(2, '0');
      const yy = String(c?.expiryYear ?? '').slice(-2);
      return {
        bank: String(c?.bank ?? ''),
        last4,
        brand: String(c?.network ?? ''),
        masked: display,
        exp: `${mm}/${yy}`,
      };
    });
  return { cards: mapped };
}

export type RecentTxVM = { id: string; name: string; type: string; amount: number; date: string };
export async function getRecentTransactions(limit = 20, signal?: AbortSignal): Promise<{ items: RecentTxVM[] }> {
  const res = await api.get<any>('/financial/transactions/recent', { params: { limit }, signal });
  const body = res.data;
  const payload = (body as any)?.data ?? body;
  const items = (payload?.transactions ?? []).map((t: any) => ({
    id: String(t?.id ?? ''),
    name: String(t?.name ?? ''),
    type: String(t?.type ?? ''),
    amount: Number(t?.amount ?? 0),
    date: String(t?.date ?? ''),
  }));
  return { items };
}

export type ScheduledTransferVM = { id: string; name: string; date: string; amount: number; currency?: string };
export async function getScheduledTransfers(signal?: AbortSignal): Promise<{ items: ScheduledTransferVM[] }> {
  const res = await api.get<any>('/financial/transfers/scheduled', { signal });
  const body = res.data;
  const payload = (body as any)?.data ?? body;
  const items = (payload?.transfers ?? []).map((t: any) => ({
    id: String(t?.id ?? ''),
    name: String(t?.name ?? ''),
    date: String(t?.date ?? ''),
    amount: Number(t?.amount ?? 0),
    currency: String(t?.currency ?? ''),
  }));
  return { items };
}

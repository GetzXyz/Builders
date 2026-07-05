// Live FX rates with 12h in-memory cache and dual-source failover.
// Primary: open.er-api.com (free, no key). Fallback: fawazahmed0 currency CDN.

export const SUPPORTED_CURRENCIES = [
  'PKR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SAR', 'AED', 'INR',
] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const MIN_BUDGET_PKR = 30000;

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  PKR: 'Rs ', USD: '$', EUR: '\u20AC', GBP: '\u00A3', CAD: 'CA$',
  AUD: 'A$', SAR: 'SR ', AED: 'AED ', INR: '\u20B9',
};

type RateTable = Record<string, number>;

let cache: { rates: RateTable; fetchedAt: number } | null = null;
const TTL_MS = 12 * 60 * 60 * 1000;

async function fetchPrimary(): Promise<RateTable> {
  const res = await fetch('https://open.er-api.com/v6/latest/USD');
  if (!res.ok) throw new Error(`Primary FX source HTTP ${res.status}`);
  const data = await res.json();
  if (data.result !== 'success' || !data.rates) throw new Error('Primary FX source: bad payload');
  return data.rates as RateTable;
}

async function fetchFallback(): Promise<RateTable> {
  const res = await fetch(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
  );
  if (!res.ok) throw new Error(`Fallback FX source HTTP ${res.status}`);
  const data = await res.json();
  const out: RateTable = {};
  for (const [code, rate] of Object.entries(data.usd ?? {})) {
    if (typeof rate === 'number') out[code.toUpperCase()] = rate;
  }
  if (!out.PKR || !out.EUR) throw new Error('Fallback FX source: bad payload');
  return out;
}

export async function getUsdRates(): Promise<RateTable> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) return cache.rates;
  try {
    cache = { rates: await fetchPrimary(), fetchedAt: Date.now() };
  } catch {
    try {
      cache = { rates: await fetchFallback(), fetchedAt: Date.now() };
    } catch (err) {
      if (cache) return cache.rates; // stale is better than dead
      throw new Error('All FX sources unavailable');
    }
  }
  return cache.rates;
}

export function isSupportedCurrency(code: string): code is Currency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(code);
}

export async function convert(amount: number, from: Currency, to: Currency): Promise<number> {
  if (from === to) return amount;
  const rates = await getUsdRates();
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) throw new Error(`Missing FX rate for ${!fromRate ? from : to}`);
  return (amount / fromRate) * toRate;
}

export function formatMoney(amount: number, currency: Currency): string {
  return `${CURRENCY_SYMBOLS[currency]}${Math.round(amount).toLocaleString()}`;
}

export type BudgetValidation =
  | { ok: true; budgetPKR: number }
  | { ok: false; code: 'INVALID_AMOUNT' | 'UNSUPPORTED_CURRENCY' | 'BUDGET_TOO_LOW'; message: string; minBudgetInCurrency?: number };

export async function validateBudget(budget: unknown, currencyRaw: unknown): Promise<BudgetValidation> {
  const amount = typeof budget === 'string' ? Number(budget) : (budget as number);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, code: 'INVALID_AMOUNT', message: 'Please enter a valid budget amount.' };
  }
  const currency = String(currencyRaw ?? '').toUpperCase();
  if (!isSupportedCurrency(currency)) {
    return {
      ok: false,
      code: 'UNSUPPORTED_CURRENCY',
      message: `Currency "${currency}" is not supported. Supported: ${SUPPORTED_CURRENCIES.join(', ')}.`,
    };
  }
  const budgetPKR = await convert(amount, currency, 'PKR');
  if (budgetPKR < MIN_BUDGET_PKR) {
    const minInCurrency = await convert(MIN_BUDGET_PKR, 'PKR', currency);
    return {
      ok: false,
      code: 'BUDGET_TOO_LOW',
      minBudgetInCurrency: Math.ceil(minInCurrency),
      message:
        `A reliable PC build below Rs ${MIN_BUDGET_PKR.toLocaleString()} PKR` +
        (currency === 'PKR' ? '' : ` (\u2248 ${formatMoney(minInCurrency, currency)} ${currency})`) +
        ` isn't realistic \u2014 at that level, components are typically end-of-life, heavily degraded, or unreliable. ` +
        `We'd rather be honest than sell you a machine that disappoints. ` +
        `Consider raising your budget to at least ${formatMoney(minInCurrency, currency)}${currency === 'PKR' ? '' : ` (${currency})`}, or saving a little longer \u2014 it makes a dramatic difference at this range.`,
    };
  }
  return { ok: true, budgetPKR: Math.round(budgetPKR) };
}
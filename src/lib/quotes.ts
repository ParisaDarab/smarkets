import type { ContractQuote, QuotesResponse } from '@/types/quote';

/**
 * Smarkets prices are basis points out of 10000 (5000 = 50%). Convert to
 * decimal odds the way the docs describe: 10000 / price.
 */
export function priceToDecimalOdds(price: number): number {
  return 10000 / price;
}


export function priceToPercent(price: number): number {
  return price / 100;
}

export function formatDecimalOdds(price: number | undefined | null): string {
  if (price === undefined || price === null) return '-';
  return priceToDecimalOdds(price).toFixed(2);
}

/**
 * Confirmed: the quotes response is keyed directly by contract_id at the
 * root, e.g. {"314977223": {bids: [...], offers: [...]}, ...} - no
 * wrapper key. This just turns that plain object into a Map for
 * consistent lookup with .get(contractId).
 */
export function normalizeQuotes(response: QuotesResponse | undefined): Map<string, ContractQuote> {
  const map = new Map<string, ContractQuote>();
  if (!response) return map;

  for (const [contractId, quote] of Object.entries(response)) {
    map.set(contractId, quote);
  }

  return map;
}
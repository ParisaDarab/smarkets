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
 * The quotes endpoint has been seen returning either an array of quotes
 * (each tagged with contract_id) or an object keyed by contract_id.
 * Normalise to a Map so the UI doesn't need to care which shape came back.
 */
export function normalizeQuotes(
  response: QuotesResponse | undefined
): Map<string, ContractQuote> {
  const map = new Map<string, ContractQuote>();
  if (!response) return map;

  const { quotes } = response;

  if (Array.isArray(quotes)) {
    for (const quote of quotes) {
      if (quote.contract_id) map.set(quote.contract_id, quote);
    }
  } else if (quotes && typeof quotes === 'object') {
    for (const [contractId, quote] of Object.entries(quotes)) {
      map.set(contractId, quote);
    }
  }

  return map;
}
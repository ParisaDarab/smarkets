import { describe, expect, it } from 'vitest';
import {
  formatDecimalOdds,
  normalizeQuotes,
  priceToDecimalOdds,
  priceToPercent,
} from '@/lib/quotes';

describe('priceToDecimalOdds', () => {
  it('converts Smarkets price to decimal odds', () => {
    expect(priceToDecimalOdds(5000)).toBe(2);
    expect(priceToDecimalOdds(2500)).toBe(4);
  });
});

describe('priceToPercent', () => {
  it('converts price to percentage', () => {
    expect(priceToPercent(5000)).toBe(50);
    expect(priceToPercent(2500)).toBe(25);
  });
});

describe('formatDecimalOdds', () => {
  it('formats odds to two decimal places', () => {
    expect(formatDecimalOdds(5000)).toBe('2.00');
    expect(formatDecimalOdds(2500)).toBe('4.00');
  });

  it('returns "-" when price is missing', () => {
    expect(formatDecimalOdds(undefined)).toBe('-');
    expect(formatDecimalOdds(null)).toBe('-');
  });
});

describe('normalizeQuotes', () => {
  it('converts quote object to a Map', () => {
    const response = {
      'contract-1': {
        bids: [],
        offers: [],
      },
      'contract-2': {
        bids: [],
        offers: [],
      },
    };

    const result = normalizeQuotes(response);

    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(2);
    expect(result.get('contract-1')).toEqual({
      bids: [],
      offers: [],
    });
  });

  it('returns an empty Map for undefined response', () => {
    expect(normalizeQuotes(undefined)).toEqual(new Map());
  });
});
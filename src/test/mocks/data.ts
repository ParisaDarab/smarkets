import type { SmarketsEvent } from '@/types/event';
import type { SmarketsMarket } from '@/types/market';
import type { SmarketsContract } from '@/types/contract';
import type { QuotesResponse } from '@/types/quote';

export const mockEvents: SmarketsEvent[] = [
  {
    id: 'event-1',
    name: 'Cycling',
    full_slug: '/sport/football/arsenal-chelsea',
    state: 'live',
    type: 'generic',
    hidden: false,
    parent_id: 'football',
    start_datetime: '2026-08-18T18:00:00Z',
  },
];

export const mockMarkets: Record<string, SmarketsMarket[]> = {
  'event-1': [
    {
      id: 'market-1',
      name: 'Match Winner',
    },
  ],
};

export const mockContracts: Record<string, SmarketsContract[]> = {
  'market-1': [
    {
      id: 'contract-1',
      name: 'Arsenal',
    },
    {
      id: 'contract-2',
      name: 'Draw',
    },
    {
      id: 'contract-3',
      name: 'Chelsea',
    },
  ],
};

export const mockQuotes: QuotesResponse = {
  'contract-1': {
    bids: [{ price: 5000, volume: 100 }],
    offers: [{ price: 5100, volume: 100 }],
  },
  'contract-2': {
    bids: [{ price: 3300, volume: 80 }],
    offers: [{ price: 3400, volume: 70 }],
  },
  'contract-3': {
    bids: [{ price: 3000, volume: 120 }],
    offers: [{ price: 3100, volume: 90 }],
  },
};


export const mockSession = {
  created_social_member: false,
  factor: 'complete',
  refresh_token: 'token',
  stop: '2026-08-18T11:22:46.139572',
  token: 'token',
  verify: false,
};
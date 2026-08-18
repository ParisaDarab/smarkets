import { http, HttpResponse } from 'msw';

import {
  mockEvents,
  mockMarkets,
  mockContracts,
  mockQuotes,
  mockSession,
} from './data';

const API_BASE = '/api';

const TEST_CREDENTIALS = {
  username: 'test@example.com',
  password: 'Parisadrb@2003',
};

export const handlers = [
  // =========================
  // AUTH / SESSION
  // =========================
  http.post(
    `${API_BASE}/v3/sessions/`,
    async ({ request }) => {

      const body = (await request.json()) as {
        username: string;
        password: string;
      };

      const isValid =
        body.username === TEST_CREDENTIALS.username &&
        body.password === TEST_CREDENTIALS.password;

      if (!isValid) {
        return HttpResponse.json(
          {
            error_type: 'INVALID_CREDENTIALS',
            data: 'Invalid credentials',
          },
          {
            status: 401,
          }
        );
      }

      return HttpResponse.json(mockSession, {
        status: 200,
      });
    }
  ),

  // =========================
  // EVENTS
  // =========================
  http.get(`${API_BASE}/v3/events/`, ({ request }) => {
    const url = new URL(request.url);
    const state = url.searchParams.get('state');

    return HttpResponse.json({
      events: mockEvents,
      pagination: {
        next_page: null,
      },
    });
  }),

  // =========================
  // MARKETS FOR EVENT
  // =========================
  http.get(
    `${API_BASE}/v3/events/:eventId/markets/`,
    ({ params }) => {
      const eventId = String(params.eventId);
      return HttpResponse.json({
        markets: mockMarkets[eventId] ?? [],
      });
    }
  ),

  // =========================
  // CONTRACTS FOR MARKET
  // =========================
  http.get(
    `${API_BASE}/v3/markets/:marketId/contracts/`,
    ({ params }) => {
      const marketId = String(params.marketId);

      return HttpResponse.json({
        contracts: mockContracts[marketId] ?? [],
      });
    }
  ),

  // =========================
  // QUOTES
  // =========================
http.get(
  `${API_BASE}/v3/markets/:marketIds/quotes/`,
  ({ params }) => {
    const marketIds = String(params.marketIds);
    return HttpResponse.json(mockQuotes);
  }
),
];
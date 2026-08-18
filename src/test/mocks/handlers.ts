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
      console.log('✅ SESSION HANDLER HIT');

      const body = (await request.json()) as {
        username: string;
        password: string;
      };

      console.log('✅ SESSION BODY:', body);

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

    console.log(
      '✅ EVENTS HANDLER HIT:',
      url.pathname,
      url.search
    );

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

      console.log(
        '✅ MARKETS HANDLER HIT:',
        eventId
      );

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

      console.log(
        '✅ CONTRACTS HANDLER HIT:',
        marketId
      );

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

    console.log(
      '✅ QUOTES HANDLER HIT:',
      marketIds
    );

    return HttpResponse.json(mockQuotes);
  }
),
];
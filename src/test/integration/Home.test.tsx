import { http, HttpResponse } from 'msw';
import { server } from '@/test/server';

import { Home } from '@/pages/home';
import { renderWithAuth } from '@/test/utils/renderWithAuth';

import { screen } from '@testing-library/react';

import { beforeEach, describe, expect, it } from 'vitest';

describe('Home integration', () => {
  beforeEach(() => {
    localStorage.clear();
    server.resetHandlers();
  });

  it('renders live event and market prices', async () => {
    renderWithAuth(<Home />);

    expect(await screen.findByText(/Match Winner/i)).toBeInTheDocument();

    expect(await screen.findByText(/Arsenal/i)).toBeInTheDocument();

    expect(await screen.findByText('2.00')).toBeInTheDocument();
  });

  it('renders empty state when there are no live events', async () => {
    server.use(
      http.get('/api/v3/events/', ({ request }) => {
        const url = new URL(request.url);

        if (url.searchParams.get('state') === 'live') {
          return HttpResponse.json({
            events: [],
            pagination: {
              next_page: null,
            },
          });
        }

        return HttpResponse.json({
          events: [],
          pagination: {
            next_page: null,
          },
        });
      })
    );

    renderWithAuth(<Home />);

    expect(
      await screen.findByText(/Nothing is live right now - check back later./i)
    ).toBeInTheDocument();
  });

  it('handles events API failure', async () => {
    server.use(
      http.get('/api/v3/events/', () => {
        return new HttpResponse(null, {
          status: 500,
        });
      })
    );

    renderWithAuth(<Home />);

    expect(await screen.findByText(/no/i)).toBeInTheDocument();
  });
});

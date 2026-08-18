import { screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';

import { Event } from '@/pages/event';
import { renderWithAuth } from '@/test/utils/renderWithAuth';

import { server } from '@/test/server';
import { http, HttpResponse } from 'msw';
import { Route, Routes } from 'react-router-dom';

describe('Event integration', () => {
  beforeEach(() => {
    localStorage.clear();
    server.resetHandlers();
  });

  it('loads markets, contracts and quotes for an event', async () => {
    renderWithAuth(
      <Routes>
        <Route path="/event/:eventId" element={<Event />} />
      </Routes>,
      ['/event/event-1']
    );

    expect(await screen.findByText(/Match Winner/i)).toBeInTheDocument();

    expect(await screen.findByText(/Arsenal/i)).toBeInTheDocument();

    expect(await screen.findByText('2.00')).toBeInTheDocument();
  });

  it('renders empty state when the event has no markets', async () => {
    server.use(
      http.get('/api/v3/events/event-1/markets/', () => {
        return HttpResponse.json({
          markets: [],
        });
      })
    );

    renderWithAuth(
      <Routes>
        <Route path="/event/:eventId" element={<Event />} />
      </Routes>,
      ['/event/event-1']
    );

    expect(
      await screen.findByText(/Nothing available here yet./i)
    ).toBeInTheDocument();
  });
});

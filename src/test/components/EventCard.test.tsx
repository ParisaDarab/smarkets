import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EventCard } from '@/components/EventCard';

const featuredMarket = {
  event: {
    id: 'event-1',
    name: 'Arsenal vs Chelsea',
    state: 'live',
  },
  market: {
    id: 'market-1',
    name: 'Match Winner',
  },
};

describe('EventCard', () => {
  it('renders event name', () => {
    render(
      <MemoryRouter>
        <EventCard featuredMarket={featuredMarket}>
          <span>Market content</span>
        </EventCard>
      </MemoryRouter>
    );

    expect(screen.getByText('Arsenal vs Chelsea')).toBeInTheDocument();
  });

  it('shows In-Play for live events', () => {
    render(
      <MemoryRouter>
        <EventCard featuredMarket={featuredMarket}>
          <span>Market content</span>
        </EventCard>
      </MemoryRouter>
    );

    expect(screen.getByText('In-Play')).toBeInTheDocument();
  });

  it('links to the event page', () => {
    render(
      <MemoryRouter>
        <EventCard featuredMarket={featuredMarket}>
          <span>Market content</span>
        </EventCard>
      </MemoryRouter>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/event/event-1');
  });

  it('does not show In-Play for non-live events', () => {
    render(
      <MemoryRouter>
        <EventCard
          featuredMarket={{
            ...featuredMarket,
            event: {
              ...featuredMarket.event,
              state: 'upcoming',
            },
          }}
        >
          <span>Market content</span>
        </EventCard>
      </MemoryRouter>
    );

    expect(screen.queryByText('In-Play')).not.toBeInTheDocument();
  });
});
